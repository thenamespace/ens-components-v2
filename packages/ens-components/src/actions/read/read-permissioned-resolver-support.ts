import { err, errAsync, ok, type Result, type ResultAsync } from "neverthrow";
import { type Address, type ContractFunctionParameters, type Hex, type PublicClient } from "viem";

import { executeContractRead, type PreparedContractRead } from "#/actions/read/contract-reads";
import { permissionedResolverAbi } from "#/data/abi";
import { isNonZeroAddress } from "#/lib/helpers";

/** ERC-165 interface ID advertised by the deployed ENS v2 PermissionedResolver. */
export const PERMISSIONED_RESOLVER_INTERFACE_ID = "0x91413117" as const satisfies Hex;

export type PreparePermissionedResolverSupportReadError = "INVALID_RESOLVER_ADDRESS";

export interface PreparePermissionedResolverSupportReadParameters {
  readonly resolverAddress: Address;
}

type PermissionedResolverSupportRequest = ContractFunctionParameters<
  typeof permissionedResolverAbi,
  "view",
  "supportsInterface",
  readonly [Hex]
>;

export type PreparedPermissionedResolverSupportRead = PreparedContractRead<
  PermissionedResolverSupportRequest,
  boolean,
  "permissioned-resolver-support",
  {
    readonly resolverAddress: Address;
  }
>;

export type ReadPermissionedResolverSupportParameters =
  PreparePermissionedResolverSupportReadParameters;
export type ReadPermissionedResolverSupportReturnType = boolean;
export type ReadPermissionedResolverSupportErrorType =
  | PreparePermissionedResolverSupportReadError
  | "CONTRACT_READ_FAILED";

/** Prepares an ERC-165 check for the ENS v2 PermissionedResolver interface. */
export function preparePermissionedResolverSupportRead(
  parameters: PreparePermissionedResolverSupportReadParameters,
): Result<PreparedPermissionedResolverSupportRead, PreparePermissionedResolverSupportReadError> {
  if (!isNonZeroAddress(parameters.resolverAddress)) {
    return err("INVALID_RESOLVER_ADDRESS");
  }

  return ok({
    kind: "permissioned-resolver-support",
    metadata: {
      resolverAddress: parameters.resolverAddress,
    },
    request: {
      address: parameters.resolverAddress,
      abi: permissionedResolverAbi,
      functionName: "supportsInterface",
      args: [PERMISSIONED_RESOLVER_INTERFACE_ID],
    },
  });
}

/** Reads whether a resolver implements the ENS v2 PermissionedResolver interface. */
export function readPermissionedResolverSupport(
  publicClient: PublicClient,
  parameters: ReadPermissionedResolverSupportParameters,
): ResultAsync<
  ReadPermissionedResolverSupportReturnType,
  ReadPermissionedResolverSupportErrorType
> {
  const prepared = preparePermissionedResolverSupportRead(parameters);
  if (prepared.isErr()) return errAsync(prepared.error);
  return executeContractRead(publicClient, prepared.value);
}
