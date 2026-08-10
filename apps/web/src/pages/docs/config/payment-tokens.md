---
title: Payment Tokens
description: Configure ERC-20 tokens accepted by an ENS v2 registrar.
---

# Payment Tokens

ENS v2 registration and renewal use ERC-20 payment tokens. Every
configuration must contain at least one token.

## Type

```ts [types.ts]
interface EnsPaymentToken {
  readonly address: Address;
  readonly decimals: number;
  readonly icon: EnsIconComponent;
  readonly name: string;
  readonly symbol: string;
}

type EnsPaymentTokens = readonly [EnsPaymentToken, ...EnsPaymentToken[]];
```

Components render the configured tokens in their payment selector. Hooks use
the first token when `paymentTokenAddress` is omitted.

## Testnet Tokens

| Token     | Address                                      | Decimals |
| --------- | -------------------------------------------- | -------- |
| Mock USDC | `0x768f42455a2d082e23ceef7d51e5787c82d67a39` | 6        |
| Mock DAI  | `0x5472c5725a00b7ba11f0794a79d08ade6f4683bd` | 18       |

## Custom Token

```ts [payment-token.ts]
import { UsdcIcon } from "@thenamespace/ens-components-v2/icons";

const paymentToken = {
  address: "0x...",
  decimals: 6,
  icon: UsdcIcon,
  name: "USD Coin",
  symbol: "USDC",
} as const;
```

The token must implement ERC-20 `decimals`, `balanceOf`, `allowance`, and
`approve`. The configured registrar must accept the token for pricing and
payment.

:::note
The configured `decimals` value is presentation metadata. Price and payment
actions also read token state onchain.
:::
