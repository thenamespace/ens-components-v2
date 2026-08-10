import { err, ok, type Result } from "neverthrow";
import type { PublicClient, TransactionReceipt } from "viem";

import type {
  ContractWriteProgress,
  PreparedContractWrite,
  NameRegistrationPaymentStatus,
  SubmittedContractTransaction,
} from "#/actions";
import type { StoredRegistrationAttempt } from "#/components/name-registration/hooks/use-registration-attempts";
import {
  prepareRegistrationPaymentWrites,
  type PreparedRegistrationPaymentWrites,
} from "#/components/name-registration/steps/registration-process/steps/registration-payment/registration-payment-writes";
import type { RegistrationSuccessDetails } from "#/components/name-registration/steps/registration-success";
import type { EnsPaymentToken } from "#/data";
import type { CommitmentStatus, ExecuteContractWritesMutation } from "#/hooks";
import { getTransactionTimestamp, parseRegistrationReceipt } from "#/lib/helpers";

export interface ConfirmedRegistrationWrite {
  receipt: TransactionReceipt;
  transactionHash: `0x${string}`;
}

export interface RegistrationPaymentSubmissionSuccess {
  addressRecord?: ConfirmedRegistrationWrite;
  approval?: ConfirmedRegistrationWrite;
  defaultPrimaryName?: ConfirmedRegistrationWrite;
  details: RegistrationSuccessDetails;
  l1PrimaryName?: ConfirmedRegistrationWrite;
  primaryNameError?: unknown;
  primaryNameErrorPhase?: "address-record" | "default-primary-name" | "l1-primary-name";
  registration: ConfirmedRegistrationWrite;
  registrationAmount: bigint;
  registrationDuration: bigint;
  tokenId?: bigint;
}

export interface SubmitRegistrationPaymentParameters {
  attempt: StoredRegistrationAttempt;
  commitment: CommitmentStatus;
  defaultReverseRegistrarAdapterAddress: `0x${string}`;
  executeWrites: ExecuteContractWritesMutation;
  payment: NameRegistrationPaymentStatus;
  paymentToken: EnsPaymentToken;
  publicClient: PublicClient;
  l1ReverseRegistrarAddress: `0x${string}`;
  onProgress?: (progress: ContractWriteProgress) => Promise<void> | void;
}

function getCommitmentStateError(state: string) {
  return state === "WAITING"
    ? "COMMITMENT_NOT_READY"
    : state === "EXPIRED"
      ? "COMMITMENT_EXPIRED"
      : "COMMITMENT_NOT_FOUND";
}

function findConfirmedWrite(
  transactions: readonly {
    prepared: PreparedContractWrite;
    receipt?: TransactionReceipt;
    transactionHash: `0x${string}`;
  }[],
  kind: string,
): Result<ConfirmedRegistrationWrite, "TRANSACTION_CONFIRMATION_FAILED"> {
  const transaction = transactions.find(({ prepared }) => prepared.kind === kind);
  if (transaction?.receipt === undefined) {
    return err("TRANSACTION_CONFIRMATION_FAILED");
  }

  return ok({
    receipt: transaction.receipt,
    transactionHash: transaction.transactionHash,
  });
}

function getConfirmedWrite(
  transactions: readonly SubmittedContractTransaction[],
  kind: string,
): ConfirmedRegistrationWrite | undefined {
  const transaction = transactions.find(({ prepared }) => prepared.kind === kind);
  if (transaction?.receipt === undefined) return undefined;

  return {
    receipt: transaction.receipt,
    transactionHash: transaction.transactionHash,
  };
}

interface BuildRegistrationSuccessParameters {
  payment: NameRegistrationPaymentStatus;
  paymentToken: EnsPaymentToken;
  primaryNameError?: unknown;
  transactions: readonly SubmittedContractTransaction[];
  writes: PreparedRegistrationPaymentWrites;
}

async function buildRegistrationSuccess(
  publicClient: PublicClient,
  props: BuildRegistrationSuccessParameters,
): Promise<Result<RegistrationPaymentSubmissionSuccess, unknown>> {
  const { payment, paymentToken, primaryNameError, transactions, writes } = props;
  const confirmedRegistration = findConfirmedWrite(transactions, "register-name");
  if (confirmedRegistration.isErr()) return err(confirmedRegistration.error);

  const registeredAt = await getTransactionTimestamp(
    publicClient,
    confirmedRegistration.value.receipt,
  );
  const registrationDetails = parseRegistrationReceipt({
    fallbackAmount: payment.total,
    fallbackDuration: writes.registration.request.args[5],
    fallbackLabel: writes.registration.metadata.label,
    receipt: confirmedRegistration.value.receipt,
    registrarAddress: writes.registration.request.address,
  });
  const approval = getConfirmedWrite(transactions, "approve-payment-token");
  const addressRecord = getConfirmedWrite(transactions, "set-address-record");
  const defaultPrimaryName = getConfirmedWrite(transactions, "set-default-primary-name");
  const l1PrimaryName = getConfirmedWrite(transactions, "set-l1-primary-name");
  const primaryNameErrorPhase =
    primaryNameError === undefined
      ? undefined
      : addressRecord === undefined
        ? ("address-record" as const)
        : defaultPrimaryName === undefined
          ? ("default-primary-name" as const)
          : ("l1-primary-name" as const);

  return ok({
    ...(addressRecord === undefined ? {} : { addressRecord }),
    ...(approval === undefined ? {} : { approval }),
    ...(defaultPrimaryName === undefined ? {} : { defaultPrimaryName }),
    details: {
      amount: registrationDetails.amount,
      decimals: payment.decimals,
      duration: registrationDetails.duration,
      expiresAt: registeredAt + Number(registrationDetails.duration) * 1_000,
      name: `${registrationDetails.label}.eth`,
      paymentTokenIcon: paymentToken.icon,
      paymentTokenSymbol: paymentToken.symbol,
      primaryNameStatus:
        writes.defaultPrimaryName === undefined || writes.l1PrimaryName === undefined
          ? "not-requested"
          : addressRecord === undefined ||
              l1PrimaryName === undefined ||
              defaultPrimaryName === undefined
            ? "failed"
            : "set",
    },
    ...(l1PrimaryName === undefined ? {} : { l1PrimaryName }),
    ...(primaryNameError === undefined ? {} : { primaryNameError }),
    ...(primaryNameErrorPhase === undefined ? {} : { primaryNameErrorPhase }),
    registration: confirmedRegistration.value,
    registrationAmount: registrationDetails.amount,
    registrationDuration: registrationDetails.duration,
    ...(registrationDetails.tokenId === undefined ? {} : { tokenId: registrationDetails.tokenId }),
  });
}

export async function submitRegistrationPayment(
  props: SubmitRegistrationPaymentParameters,
): Promise<Result<RegistrationPaymentSubmissionSuccess, unknown>> {
  const { attempt, payment, paymentToken, publicClient } = props;
  if (props.commitment.state !== "READY") {
    return err(getCommitmentStateError(props.commitment.state));
  }

  const writes = prepareRegistrationPaymentWrites({
    attempt,
    defaultReverseRegistrarAdapterAddress: props.defaultReverseRegistrarAdapterAddress,
    l1ReverseRegistrarAddress: props.l1ReverseRegistrarAddress,
    payment,
    paymentToken,
  });
  if (writes.isErr()) return err(writes.error);

  const confirmedTransactions: SubmittedContractTransaction[] = [];
  let execution;
  try {
    execution = await props.executeWrites({
      calls: writes.value.calls,
      confirmation: "confirmed",
      onProgress: async (progress) => {
        if (progress.strategy !== "atomic" && progress.state === "confirmed") {
          confirmedTransactions.push({
            prepared: progress.prepared,
            receipt: progress.receipt,
            transactionHash: progress.transactionHash,
          });
        }
        await props.onProgress?.(progress);
      },
      strategy: "auto",
      timeout: 120_000,
    });
  } catch (error) {
    if (
      attempt.setPrimaryName &&
      getConfirmedWrite(confirmedTransactions, "register-name") !== undefined
    ) {
      return buildRegistrationSuccess(publicClient, {
        payment,
        paymentToken,
        primaryNameError: error,
        transactions: confirmedTransactions,
        writes: writes.value,
      });
    }

    return err(error);
  }

  return buildRegistrationSuccess(publicClient, {
    payment,
    paymentToken,
    transactions: execution.transactions,
    writes: writes.value,
  });
}
