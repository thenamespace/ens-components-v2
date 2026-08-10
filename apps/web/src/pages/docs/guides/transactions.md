---
title: Transactions
description: Prepare and execute ENS writes as single, atomic, or sequential transactions.
---

# Transactions

Write actions separate validation and encoding from wallet execution.

## Prepare calls

Each `prepare*Write` action returns a typed `PreparedContractWrite`.

```ts [prepare-renewal.ts]
const renewal = prepareRenewNameWrite({
  account,
  duration: 31_536_000n,
  input: "example.eth",
  paymentTokenAddress,
  registrarAddress,
});
```

Preparation does not prompt the wallet.

## Execute one call

Direct domain actions prepare and execute one call.

```ts [renew-name.ts]
const result = await renewName(walletClient, publicClient, {
  account,
  chain,
  duration,
  input: "example.eth",
  paymentTokenAddress,
  referrer,
  registrarAddress,
});
```

Use [`executeContractWrite`](/docs/actions/execute-contract-writes) when you
already have a prepared call.

## Confirmation

`confirmation: "confirmed"` waits for receipts. `"submitted"` returns after
wallet submission. Components use confirmed results before advancing.

## React

Use [`useExecuteContractWrites`](/docs/hooks/use-execute-contract-writes) for
arbitrary prepared calls. Operation-specific mutation hooks prepare and
execute one write.

:::info
To compose multiple dependent writes, choose an execution strategy, or use
EIP-5792 atomic calls, see [Batching](/docs/guides/batching).
:::
