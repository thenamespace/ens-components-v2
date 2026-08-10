import { err, ok, type Result } from "neverthrow";
import type { Address } from "viem";

import type { PreparedContractWrite, NameRegistrationPaymentStatus } from "#/actions";
import {
  prepareRegisterNameWrite,
  preparePaymentTokenApprovalWrite,
  prepareSetAddressRecordWrite,
  prepareSetDefaultPrimaryNameWrite,
  prepareSetL1PrimaryNameWrite,
  type PreparedRegisterNameWrite,
  type PreparedPaymentTokenApprovalWrite,
  type PreparedSetAddressRecordWrite,
  type PreparedSetDefaultPrimaryNameWrite,
  type PreparedSetL1PrimaryNameWrite,
} from "#/actions";
import type { StoredRegistrationAttempt } from "#/components/name-registration/hooks/use-registration-attempts";
import type { EnsPaymentToken } from "#/data";
import { parseRegistrationDuration } from "#/lib/helpers";

export interface PreparedRegistrationPaymentWrites {
  addressRecord?: PreparedSetAddressRecordWrite;
  approval?: PreparedPaymentTokenApprovalWrite;
  calls: readonly [PreparedContractWrite, ...PreparedContractWrite[]];
  defaultPrimaryName?: PreparedSetDefaultPrimaryNameWrite;
  l1PrimaryName?: PreparedSetL1PrimaryNameWrite;
  registration: PreparedRegisterNameWrite;
}

export interface PrepareRegistrationPaymentWritesProps {
  attempt: StoredRegistrationAttempt;
  defaultReverseRegistrarAdapterAddress: Address;
  payment: NameRegistrationPaymentStatus;
  paymentToken: EnsPaymentToken;
  l1ReverseRegistrarAddress: Address;
}

export function prepareRegistrationPaymentWrites(
  props: PrepareRegistrationPaymentWritesProps,
): Result<PreparedRegistrationPaymentWrites, unknown> {
  const {
    attempt,
    defaultReverseRegistrarAdapterAddress,
    l1ReverseRegistrarAddress,
    payment,
    paymentToken,
  } = props;
  const duration = parseRegistrationDuration(attempt.duration);
  if (duration === undefined) return err("INVALID_DURATION");

  const registration = prepareRegisterNameWrite({
    account: attempt.account,
    duration,
    input: attempt.label,
    owner: attempt.owner,
    paymentTokenAddress: paymentToken.address,
    referrer: attempt.referrer,
    registrarAddress: attempt.registrarAddress,
    resolverAddress: attempt.resolver.address,
    secret: attempt.secret,
    subregistryAddress: attempt.subregistry,
  });
  if (registration.isErr()) return err(registration.error);

  let approval: PreparedPaymentTokenApprovalWrite | undefined;
  if (!payment.hasSufficientAllowance) {
    const preparedApproval = preparePaymentTokenApprovalWrite({
      account: attempt.account,
      amount: payment.total,
      paymentTokenAddress: paymentToken.address,
      spenderAddress: attempt.registrarAddress,
    });
    if (preparedApproval.isErr()) return err(preparedApproval.error);
    approval = preparedApproval.value;
  }

  let addressRecord: PreparedSetAddressRecordWrite | undefined;
  let defaultPrimaryName: PreparedSetDefaultPrimaryNameWrite | undefined;
  let l1PrimaryName: PreparedSetL1PrimaryNameWrite | undefined;
  if (attempt.setPrimaryName) {
    const preparedAddressRecord = prepareSetAddressRecordWrite({
      account: attempt.account,
      input: attempt.normalizedName,
      owner: attempt.account,
      resolverAddress: attempt.resolver.address,
    });
    if (preparedAddressRecord.isErr()) return err(preparedAddressRecord.error);

    const preparedDefaultPrimaryName = prepareSetDefaultPrimaryNameWrite({
      account: attempt.account,
      defaultReverseRegistrarAdapterAddress,
      input: attempt.normalizedName,
    });
    if (preparedDefaultPrimaryName.isErr()) return err(preparedDefaultPrimaryName.error);

    const preparedL1PrimaryName = prepareSetL1PrimaryNameWrite({
      account: attempt.account,
      input: attempt.normalizedName,
      l1ReverseRegistrarAddress,
    });
    if (preparedL1PrimaryName.isErr()) return err(preparedL1PrimaryName.error);

    addressRecord = preparedAddressRecord.value;
    defaultPrimaryName = preparedDefaultPrimaryName.value;
    l1PrimaryName = preparedL1PrimaryName.value;
  }

  const calls: PreparedContractWrite[] = [
    ...(approval === undefined ? [] : [approval]),
    registration.value,
    ...(addressRecord === undefined ? [] : [addressRecord]),
    ...(defaultPrimaryName === undefined ? [] : [defaultPrimaryName]),
    ...(l1PrimaryName === undefined ? [] : [l1PrimaryName]),
  ];

  return ok({
    ...(addressRecord === undefined ? {} : { addressRecord }),
    ...(approval === undefined ? {} : { approval }),
    calls: calls as [PreparedContractWrite, ...PreparedContractWrite[]],
    ...(defaultPrimaryName === undefined ? {} : { defaultPrimaryName }),
    ...(l1PrimaryName === undefined ? {} : { l1PrimaryName }),
    registration: registration.value,
  });
}
