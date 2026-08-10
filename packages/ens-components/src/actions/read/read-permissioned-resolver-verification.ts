import { err, errAsync, ok, okAsync, ResultAsync, type Result } from "neverthrow";
import {
  BaseError,
  ContractFunctionRevertedError,
  isAddressEqual,
  type Address,
  type ContractFunctionParameters,
  type PublicClient,
} from "viem";

import type { PreparedContractRead } from "#/actions/read/contract-reads";
import { verifiableFactoryAbi } from "#/data/abi";
import { isNonZeroAddress } from "#/lib/helpers";

export type PreparePermissionedResolverVerificationReadError =
  | "INVALID_FACTORY_ADDRESS"
  | "INVALID_IMPLEMENTATION_ADDRESS"
  | "INVALID_RESOLVER_ADDRESS";

export interface PreparePermissionedResolverVerificationReadParameters {
  readonly factoryAddress: Address;
  readonly implementationAddress: Address;
  readonly resolverAddress: Address;
}

type PermissionedResolverVerificationRequest = ContractFunctionParameters<
  typeof verifiableFactoryAbi,
  "view",
  "verifyContract",
  readonly [Address]
>;

export type PreparedPermissionedResolverVerificationRead = PreparedContractRead<
  PermissionedResolverVerificationRequest,
  Address,
  "permissioned-resolver-verification",
  {
    readonly implementationAddress: Address;
    readonly resolverAddress: Address;
  }
>;

export type ReadPermissionedResolverVerificationParameters =
  PreparePermissionedResolverVerificationReadParameters;
export type ReadPermissionedResolverVerificationReturnType = boolean;
export type ReadPermissionedResolverVerificationErrorType =
  | PreparePermissionedResolverVerificationReadError
  | "CONTRACT_READ_FAILED";

function isVerificationFailed(error: unknown): boolean {
  return (
    error instanceof BaseError &&
    error.walk(
      (cause) =>
        cause instanceof ContractFunctionRevertedError &&
        cause.data?.errorName === "VerificationFailed",
    ) !== null
  );
}

/** Validates and prepares a VerifiableFactory implementation check. */
export function preparePermissionedResolverVerificationRead(
  parameters: PreparePermissionedResolverVerificationReadParameters,
): Result<
  PreparedPermissionedResolverVerificationRead,
  PreparePermissionedResolverVerificationReadError
> {
  if (!isNonZeroAddress(parameters.factoryAddress)) {
    return err("INVALID_FACTORY_ADDRESS");
  }
  if (!isNonZeroAddress(parameters.implementationAddress)) {
    return err("INVALID_IMPLEMENTATION_ADDRESS");
  }
  if (!isNonZeroAddress(parameters.resolverAddress)) {
    return err("INVALID_RESOLVER_ADDRESS");
  }

  return ok({
    kind: "permissioned-resolver-verification",
    metadata: {
      implementationAddress: parameters.implementationAddress,
      resolverAddress: parameters.resolverAddress,
    },
    request: {
      address: parameters.factoryAddress,
      abi: verifiableFactoryAbi,
      functionName: "verifyContract",
      args: [parameters.resolverAddress],
    },
  });
}

/** Reads whether a resolver proxy was deployed from the expected implementation. */
export function readPermissionedResolverVerification(
  publicClient: PublicClient,
  parameters: ReadPermissionedResolverVerificationParameters,
): ResultAsync<
  ReadPermissionedResolverVerificationReturnType,
  ReadPermissionedResolverVerificationErrorType
> {
  const prepared = preparePermissionedResolverVerificationRead(parameters);
  if (prepared.isErr()) return errAsync(prepared.error);
  return ResultAsync.fromPromise(
    publicClient.readContract(prepared.value.request),
    (error): "CONTRACT_READ_FAILED" | "UNVERIFIED" =>
      isVerificationFailed(error) ? "UNVERIFIED" : "CONTRACT_READ_FAILED",
  )
    .map((implementationAddress) =>
      isAddressEqual(implementationAddress, parameters.implementationAddress),
    )
    .orElse((error) =>
      error === "UNVERIFIED" ? okAsync(false) : errAsync("CONTRACT_READ_FAILED" as const),
    );
}
