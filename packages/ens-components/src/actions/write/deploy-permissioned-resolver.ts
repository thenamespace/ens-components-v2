import { errAsync, ok, ResultAsync } from "neverthrow";
import {
  encodeFunctionData,
  type Address,
  type ContractFunctionParameters,
  type Hex,
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
import { permissionedResolverAbi, verifiableFactoryAbi } from "#/data/abi";
import { isBytes32, isNonZeroAddress } from "#/lib/helpers";

export const PERMISSIONED_RESOLVER_ALL_ROLES =
  0x1111111111111111111111111111111111111111111111111111111111111111n;

export type PreparePermissionedResolverDeploymentWriteError =
  | "CONTRACT_SIMULATION_FAILED"
  | "INVALID_ACCOUNT_ADDRESS"
  | "INVALID_FACTORY_ADDRESS"
  | "INVALID_IMPLEMENTATION_ADDRESS"
  | "INVALID_OWNER_ADDRESS"
  | "INVALID_RESOLVER_ADDRESS"
  | "INVALID_SALT";

export interface PreparePermissionedResolverDeploymentWriteParameters {
  /** Account that will call the factory. This affects the proxy address. */
  readonly account: Address;
  /** ENS VerifiableFactory address. */
  readonly factoryAddress: Address;
  /** Deployed PermissionedResolver implementation address. */
  readonly implementationAddress: Address;
  /** Account receiving every resolver permission. */
  readonly owner: Address;
  /** Random bytes32 salt returned by `createResolverSalt`. */
  readonly salt: Hex;
}

type PermissionedResolverDeploymentRequest = ContractFunctionParameters<
  typeof verifiableFactoryAbi,
  "nonpayable",
  "deployProxy",
  readonly [Address, bigint, Hex]
>;

export interface PermissionedResolverDeploymentWriteMetadata {
  readonly initData: Hex;
  readonly resolverAddress: Address;
  readonly salt: Hex;
}

export type PreparedPermissionedResolverDeploymentWrite = PreparedContractWrite<
  PermissionedResolverDeploymentRequest,
  "deploy-permissioned-resolver",
  PermissionedResolverDeploymentWriteMetadata
>;

export type DeployPermissionedResolverParameters =
  PreparePermissionedResolverDeploymentWriteParameters & ExecuteContractWriteParameters;
export type DeployPermissionedResolverReturnType = ExecuteContractWritesResult;
export type DeployPermissionedResolverErrorType =
  | PreparePermissionedResolverDeploymentWriteError
  | ExecuteContractWritesError;

/**
 * Simulates a PermissionedResolver proxy deployment and returns the
 * exact address and encoded call required by sequential or atomic submission.
 */
export function preparePermissionedResolverDeploymentWrite(
  publicClient: PublicClient,
  parameters: PreparePermissionedResolverDeploymentWriteParameters,
): ResultAsync<
  PreparedPermissionedResolverDeploymentWrite,
  PreparePermissionedResolverDeploymentWriteError
> {
  const { account, factoryAddress, implementationAddress, owner, salt } = parameters;

  if (!isNonZeroAddress(account)) {
    return errAsync("INVALID_ACCOUNT_ADDRESS");
  }

  if (!isNonZeroAddress(factoryAddress)) {
    return errAsync("INVALID_FACTORY_ADDRESS");
  }

  if (!isNonZeroAddress(implementationAddress)) {
    return errAsync("INVALID_IMPLEMENTATION_ADDRESS");
  }

  if (!isNonZeroAddress(owner)) {
    return errAsync("INVALID_OWNER_ADDRESS");
  }

  if (!isBytes32(salt)) {
    return errAsync("INVALID_SALT");
  }

  const initData = encodeFunctionData({
    abi: permissionedResolverAbi,
    functionName: "initialize",
    args: [owner, PERMISSIONED_RESOLVER_ALL_ROLES, []],
  });
  const saltValue = BigInt(salt);
  const data = encodeFunctionData({
    abi: verifiableFactoryAbi,
    functionName: "deployProxy",
    args: [implementationAddress, saltValue, initData],
  });
  const request = {
    address: factoryAddress,
    abi: verifiableFactoryAbi,
    functionName: "deployProxy",
    args: [implementationAddress, saltValue, initData],
  } as const satisfies PermissionedResolverDeploymentRequest;

  return ResultAsync.fromPromise(
    publicClient.simulateContract({
      account,
      address: factoryAddress,
      abi: verifiableFactoryAbi,
      functionName: "deployProxy",
      args: [implementationAddress, saltValue, initData],
    }),
    () => "CONTRACT_SIMULATION_FAILED" as const,
  ).andThen(({ result: resolverAddress }) => {
    if (!isNonZeroAddress(resolverAddress)) {
      return errAsync("INVALID_RESOLVER_ADDRESS" as const);
    }

    return ok({
      account,
      call: {
        data,
        to: factoryAddress,
        value: 0n,
      },
      kind: "deploy-permissioned-resolver" as const,
      metadata: {
        initData,
        resolverAddress,
        salt,
      },
      request,
    });
  });
}

/** Deploys a PermissionedResolver proxy and waits for confirmation by default. */
export function deployPermissionedResolver(
  walletClient: WalletClient,
  publicClient: PublicClient,
  parameters: DeployPermissionedResolverParameters,
): ResultAsync<DeployPermissionedResolverReturnType, DeployPermissionedResolverErrorType> {
  return preparePermissionedResolverDeploymentWrite(publicClient, parameters).andThen((prepared) =>
    executeContractWrite(walletClient, publicClient, prepared, parameters),
  );
}
