---
title: useNameRegistrationPrice
description: Read an ENS v2 registration quote.
---

# useNameRegistrationPrice

Reads an ENS v2 registration quote and payment-token decimals. Input is
normalized and debounced for 300 milliseconds.

## Import

```ts
import { useNameRegistrationPrice } from "@thenamespace/ens-components-v2/hooks";
```

## Usage

```tsx
import { formatUnits } from "viem";

const price = useNameRegistrationPrice({
  duration: 31_536_000n,
  input: "example",
});

if (price.data) {
  const value = formatUnits(price.data.total, price.data.decimals);
}
```

## Parameters

```ts
interface UseNameRegistrationPriceParameters<selectData = NameRegistrationPrice> {
  duration: bigint;
  input: string | null | undefined;
  paymentTokenAddress?: Address;
  registrarAddress?: Address;
  query?: Omit<
    UseQueryOptions<NameRegistrationPrice, NameRegistrationPriceError, selectData>,
    "queryFn" | "queryKey"
  >;
}
```

### duration

`bigint`

Registration duration in seconds.

### input

`string | null | undefined`

A label or second-level `.eth` name.

### paymentTokenAddress

`Address | undefined`

ERC-20 payment token. Defaults to the first configured payment token.

### registrarAddress

`Address | undefined`

ENS v2 registrar. Defaults to the provider configuration.

### query

TanStack Query options, excluding `queryFn` and `queryKey`. See
[Queries](/docs/guides/queries).

The query is disabled when the normalized input is not a second-level `.eth`
name or no public client is available.

## Return Type

`UseQueryResult<NameRegistrationPrice, NameRegistrationPriceError>`

```ts
interface NameRegistrationPrice {
  readonly base: bigint;
  readonly decimals: number;
  readonly premium: bigint;
  readonly total: bigint;
}
```

All amounts are payment-token atomic units. `total` is `base + premium`.

## Action

Uses
[`prepareNameRegistrationPriceRead`](/docs/actions/read-name-registration-price)
and `executeContractReads`.
