---
title: useNameRegistrationPaymentStatus
description: Read a registration quote, token balance, and registrar allowance.
---

# useNameRegistrationPaymentStatus

Reads the registration quote, ERC-20 balance, and registrar allowance in one
batched query.

## Import

```ts
import { useNameRegistrationPaymentStatus } from "@thenamespace/ens-components-v2/hooks";
```

## Usage

```tsx
const payment = useNameRegistrationPaymentStatus({
  account: address,
  duration: 31_536_000n,
  input: "example",
});

const canRegister = payment.data?.hasSufficientBalance && payment.data.hasSufficientAllowance;
```

## Parameters

```ts
interface UseNameRegistrationPaymentStatusParameters<selectData = NameRegistrationPaymentStatus> {
  account: Address | null | undefined;
  duration: bigint;
  input: string | null | undefined;
  paymentTokenAddress?: Address;
  registrarAddress?: Address;
  query?: Omit<
    UseQueryOptions<NameRegistrationPaymentStatus, NameRegistrationPaymentStatusError, selectData>,
    "queryFn" | "queryKey"
  >;
}
```

### account

`Address | null | undefined`

Account whose token balance and allowance are read. The query is disabled when
the account or public client is unavailable.

### duration

`bigint`

Registration duration in seconds.

### input

`string | null | undefined`

Label or second-level `.eth` name.

### paymentTokenAddress

`Address | undefined`

Defaults to the first configured payment token.

### registrarAddress

`Address | undefined`

Defaults to the configured ENS v2 registrar.

### query

TanStack Query options, excluding `queryFn` and `queryKey`.

## Return Type

`UseQueryResult<NameRegistrationPaymentStatus, NameRegistrationPaymentStatusError>`

```ts
interface NameRegistrationPaymentStatus {
  readonly allowance: bigint;
  readonly balance: bigint;
  readonly base: bigint;
  readonly decimals: number;
  readonly hasSufficientAllowance: boolean;
  readonly hasSufficientBalance: boolean;
  readonly premium: bigint;
  readonly total: bigint;
}
```

Amounts are payment-token atomic units. The generated query key includes the
network, contract addresses, account, duration, and input.

## Action

Uses
[`prepareNameRegistrationPaymentStatusRead`](/docs/actions/read-name-registration-payment-status)
and `executeContractReads`.
