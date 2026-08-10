import { err, errAsync, ok, type Result, type ResultAsync } from "neverthrow";
import {
  encodeFunctionData,
  type Address,
  type ContractFunctionParameters,
  type PublicClient,
  type WalletClient,
} from "viem";

import type {
  ExecuteContractWritesResult,
  PreparedContractWrite,
} from "#/actions/write/contract-writes";
import {
  executeContractWrite,
  type ExecuteContractWriteParameters,
  type ExecuteContractWritesError,
} from "#/actions/write/execute-contract-writes";
import { defaultReverseRegistrarAdapterAbi } from "#/data/abi";
import { isNonZeroAddress } from "#/lib/helpers";
import type { ParseNameInputError } from "#/lib/parse-name-input";
import { parseNameInput } from "#/lib/parse-name-input";

export type PrepareSetDefaultPrimaryNameWriteError =
  | "INVALID_ACCOUNT_ADDRESS"
  | "INVALID_DEFAULT_REVERSE_REGISTRAR_ADAPTER_ADDRESS"
  | ParseNameInputError;

export interface PrepareSetDefaultPrimaryNameWriteParameters {
  /** Account whose default primary name will be updated. */
  readonly account: Address;
  /** Deployed ENS DefaultReverseRegistrarAdapter address. */
  readonly defaultReverseRegistrarAdapterAddress: Address;
  /** ENS name or `.eth` label to use as the default primary name. */
  readonly input: string | null | undefined;
}

type SetDefaultPrimaryNameRequest = ContractFunctionParameters<
  typeof defaultReverseRegistrarAdapterAbi,
  "nonpayable",
  "setName",
  readonly [Address, string]
>;

export interface SetDefaultPrimaryNameWriteMetadata {
  readonly name: string;
  readonly owner: Address;
}

export type PreparedSetDefaultPrimaryNameWrite = PreparedContractWrite<
  SetDefaultPrimaryNameRequest,
  "set-default-primary-name",
  SetDefaultPrimaryNameWriteMetadata
>;

export type SetDefaultPrimaryNameParameters = PrepareSetDefaultPrimaryNameWriteParameters &
  ExecuteContractWriteParameters;
export type SetDefaultPrimaryNameReturnType = ExecuteContractWritesResult;
export type SetDefaultPrimaryNameErrorType =
  | PrepareSetDefaultPrimaryNameWriteError
  | ExecuteContractWritesError;

/** Prepares a default reverse-name update through the July deployment adapter. */
export function prepareSetDefaultPrimaryNameWrite(
  parameters: PrepareSetDefaultPrimaryNameWriteParameters,
): Result<PreparedSetDefaultPrimaryNameWrite, PrepareSetDefaultPrimaryNameWriteError> {
  const { account, defaultReverseRegistrarAdapterAddress, input } = parameters;

  if (!isNonZeroAddress(account)) {
    return err("INVALID_ACCOUNT_ADDRESS");
  }

  if (!isNonZeroAddress(defaultReverseRegistrarAdapterAddress)) {
    return err("INVALID_DEFAULT_REVERSE_REGISTRAR_ADAPTER_ADDRESS");
  }

  const parsedInput = parseNameInput(input);
  if (parsedInput.isErr()) return err(parsedInput.error);

  const name = parsedInput.value.normalizedName;
  const request = {
    address: defaultReverseRegistrarAdapterAddress,
    abi: defaultReverseRegistrarAdapterAbi,
    functionName: "setName",
    args: [account, name],
  } as const satisfies SetDefaultPrimaryNameRequest;

  return ok({
    account,
    call: {
      data: encodeFunctionData(request),
      to: defaultReverseRegistrarAdapterAddress,
      value: 0n,
    },
    kind: "set-default-primary-name" as const,
    metadata: { name, owner: account },
    request,
  });
}

/** Sets an account's default primary name. */
export function setDefaultPrimaryName(
  walletClient: WalletClient,
  publicClient: PublicClient,
  parameters: SetDefaultPrimaryNameParameters,
): ResultAsync<SetDefaultPrimaryNameReturnType, SetDefaultPrimaryNameErrorType> {
  const prepared = prepareSetDefaultPrimaryNameWrite(parameters);
  if (prepared.isErr()) return errAsync(prepared.error);
  return executeContractWrite(walletClient, publicClient, prepared.value, parameters);
}
