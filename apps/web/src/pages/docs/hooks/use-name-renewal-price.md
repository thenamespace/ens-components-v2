---
title: useNameRenewalPrice
description: Read an ENS v2 renewal quote and projected expiry.
---

# useNameRenewalPrice

Reads a renewal quote, current expiry, and projected expiry for a second-level
`.eth` name. Input is normalized and debounced for 300 milliseconds.

## Import

```ts
import { useNameRenewalPrice } from "@thenamespace/ens-components-v2/hooks";
```

## Usage

```tsx
import { formatUnits } from "viem";

const quote = useNameRenewalPrice({
  duration: 31_536_000n,
  input: "example",
});

if (quote.data) {
  const total = formatUnits(quote.data.total, quote.data.decimals);
}
```

## Parameters

```ts
interface UseNameRenewalPriceParameters<selectData = NameRenewalPrice> {
  duration: bigint;
  ethRegistryAddress?: Address;
  input: string | null | undefined;
  paymentTokenAddress?: Address;
  registrarAddress?: Address;
  query?: Omit<
    UseQueryOptions<NameRenewalPrice, NameRenewalPriceError, selectData>,
    "queryFn" | "queryKey"
  >;
}
```

### duration

`bigint`

Number of seconds added to the current expiry.

### input

`string | null | undefined`

Label or second-level `.eth` name. The query is disabled for invalid names.

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

`UseQueryResult<NameRenewalPrice, NameRenewalPriceError>`

```ts
interface NameRenewalPrice {
  readonly currentExpiry: bigint;
  readonly decimals: number;
  readonly duration: bigint;
  readonly newExpiry: bigint;
  readonly total: bigint;
}
```

Timestamps are Unix seconds. `total` is expressed in payment-token atomic
units.

## Action

Uses
[`prepareNameRenewalPriceRead`](/docs/actions/read-name-renewal-price)
and `executeContractReads`.
