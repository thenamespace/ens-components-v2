---
title: useSetPrimaryName
description: Set and verify an account's ENS primary name.
---

# useSetPrimaryName

Sets an account's forward address record, default reverse name, and L1 reverse
name.

## Import

```ts
import { useSetPrimaryName } from "@thenamespace/ens-components-v2/hooks";
```

## Usage

```tsx
const primaryName = useSetPrimaryName();
primaryName.mutate({
  account,
  input: "example.eth",
  resolverAddress,
  execution: { strategy: "auto" },
});
```

## Parameters

```ts
interface UseSetPrimaryNameParameters {
  defaultReverseRegistrarAdapterAddress?: Address;
  l1ReverseRegistrarAddress?: Address;
  mutation?: UseMutationOptions;
}
```

The adapter and reverse registrar addresses default to the provider
configuration.

## Mutation Variables

```ts
interface SetPrimaryNameVariables {
  account: Address;
  input: string | null | undefined;
  owner?: Address;
  resolverAddress: Address;
  execution?: PreparedWriteExecutionOptions;
}
```

`owner` defaults to `account`.

## Return Type

`UseMutationResult<ExecuteContractWritesResult, SetPrimaryNameError, SetPrimaryNameVariables>`

With `strategy: "auto"`, supported wallets submit all three writes atomically;
other wallets submit them in dependency order.

## Actions

Uses `prepareSetAddressRecordWrite`, `prepareSetDefaultPrimaryNameWrite`,
`prepareSetL1PrimaryNameWrite`, and `useExecuteContractWrites`.
