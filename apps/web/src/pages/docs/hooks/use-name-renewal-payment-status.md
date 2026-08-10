---
title: useNameRenewalPaymentStatus
description: Read a renewal quote, token balance, and registrar allowance.
---

# useNameRenewalPaymentStatus

Reads a renewal quote together with an account's ERC-20 balance and registrar
allowance.

## Import

```ts
import { useNameRenewalPaymentStatus } from "@thenamespace/ens-components-v2/hooks";
```

## Usage

```tsx
import { useAccount } from "wagmi";

const { address } = useAccount();
const payment = useNameRenewalPaymentStatus({
  account: address,
  duration: 31_536_000n,
  input: "example.eth",
});
```

## Parameters

```ts
interface UseNameRenewalPaymentStatusParameters<selectData = NameRenewalPaymentStatus> {
  account: Address | null | undefined;
  duration: bigint;
  ethRegistryAddress?: Address;
  input: string | null | undefined;
  paymentTokenAddress?: Address;
  registrarAddress?: Address;
  query?: Omit<
    UseQueryOptions<NameRenewalPaymentStatus, NameRenewalPaymentStatusError, selectData>,
    "queryFn" | "queryKey"
  >;
}
```

### account

`Address | null | undefined`

Account whose balance and allowance are read. The query is disabled while it
is unavailable.

### duration

`bigint`

Number of renewal seconds.

### input

`string | null | undefined`

Label or second-level `.eth` name.

### ethRegistryAddress

`Address | undefined`

Defaults to the configured ENS registry.

### paymentTokenAddress

`Address | undefined`

Defaults to the first configured payment token.

### registrarAddress

`Address | undefined`

Defaults to the configured ENS v2 registrar.

### query

TanStack Query options, excluding `queryFn` and `queryKey`.

## Return Type

`UseQueryResult<NameRenewalPaymentStatus, NameRenewalPaymentStatusError>`

The result extends the renewal quote with `allowance`, `balance`,
`hasSufficientAllowance`, and `hasSufficientBalance`. All token amounts use
atomic units.

## Action

Uses
[`prepareNameRenewalPaymentStatusRead`](/docs/actions/read-name-renewal-payment-status)
and `executeContractReads`.
