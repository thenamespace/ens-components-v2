---
title: setDefaultPrimaryName
description: Set an account's default ENS primary name.
---

# setDefaultPrimaryName

Submits `DefaultReverseRegistrarAdapter.setName(account, name)` against the
July 30 ENS v2 deployment.

## Import

```ts [import.ts]
import { setDefaultPrimaryName } from "@thenamespace/ens-components-v2/actions";
```

## Usage

```ts [set-primary-name.ts]
const result = await setDefaultPrimaryName(walletClient, publicClient, {
  account,
  chain,
  defaultReverseRegistrarAdapterAddress,
  input: "example.eth",
});

if (result.isErr()) throw result.error;
```

## Parameters

### walletClient

`WalletClient`

The connected Viem wallet client.

### publicClient

`PublicClient`

The Viem client used for simulation and confirmation.

### parameters

```ts [types.ts]
interface SetDefaultPrimaryNameParameters extends ExecuteContractWriteParameters {
  account: Address;
  defaultReverseRegistrarAdapterAddress: Address;
  input: string | null | undefined;
}
```

## Return Type

`ResultAsync<ExecuteContractWritesResult, SetDefaultPrimaryNameErrorType>`

## Error

Returns name, account, adapter, simulation, wallet, or confirmation error
codes.

## Prepare

`prepareSetDefaultPrimaryNameWrite` returns the prepared adapter call. See
[Batching](/docs/guides/batching).
