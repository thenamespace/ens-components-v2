---
title: NameRenewal
description: A complete ENS v2 .eth renewal flow.
---

# NameRenewal

Provides a complete ENS v2 renewal flow for second-level `.eth` names:

1. Normalize the entered label and confirm that the name is renewable.
2. Read its current expiry and renewal price.
3. Extend the expiry by whole years or select a target date.
4. Select a configured ERC-20 payment token.
5. Approve the registrar when the current allowance is insufficient.
6. Renew the name and display its previous and new expiry.

Anyone can pay to renew a name. The connected account does not need to own it.

## Import

```ts
import { NameRenewal } from "@thenamespace/ens-components-v2";
```

## Usage

```tsx
<NameRenewal defaultLabel="example" />
```

The default presentation renders a `Renew a name` trigger and opens the flow
in a dialog. `defaultLabel` accepts a label or a second-level `.eth` name.

### Inline presentation

```tsx
<NameRenewal presentation="inline" />
```

Inline mode renders the flow directly and ignores `slots.trigger`. Selecting
Done resets it to the initial form.

## Props

| Prop                         | Type                           | Default              | Description                                                            |
| ---------------------------- | ------------------------------ | -------------------- | ---------------------------------------------------------------------- |
| `presentation`               | `"dialog" \| "inline"`         | `"dialog"`           | Selects the outer presentation.                                        |
| `defaultLabel`               | `string`                       | `""`                 | Initial label or second-level `.eth` name.                             |
| `defaultPaymentTokenAddress` | `Address`                      | First provider token | Initial payment token. Unknown addresses fall back to the first token. |
| `defaultDuration`            | `bigint`                       | `31_536_000n`        | Initial extension in seconds, clamped from 28 days to 10 years.        |
| `defaultDurationMode`        | `"date" \| "duration"`         | `"duration"`         | Initial duration control.                                              |
| `defaultReferrer`            | `Hex`                          | `zeroHash`           | Initial 32-byte referrer identifier.                                   |
| `slots`                      | `NameRenewalSlots`             | `{}`                 | Replaces visual elements.                                              |
| `messages`                   | `Partial<NameRenewalMessages>` | Default English copy | Overrides high-level interface copy.                                   |
| `events`                     | `NameRenewalEvents`            | `{}`                 | Receives confirmed transactions and flow errors.                       |

Default values initialize internal state. They are not controlled props.

## Duration and expiry

Duration mode adds exact ENS years of `31_536_000` seconds to the current
onchain expiry. Date mode selects a target calendar date and converts the
difference from the current expiry to whole days.

The selected extension must be at least 28 days. The component does not quote
names outside the registrar's renewable period.

## Payment behavior

The component lists the payment tokens configured by `EnsProvider`. Changing
the token refetches its renewal quote. Before submission, the component
refreshes price, balance, and allowance to avoid using stale values.

When approval is required, wallets with atomic EIP-5792 support receive the
approval and renewal as one batch. Other wallets receive ordered transactions,
with approval confirmed before renewal is submitted.

## Slots

```tsx
<NameRenewal
  slots={{
    trigger: <button>Extend a name</button>,
    formGraphic: <RenewalGraphic />,
    successGraphic: <SuccessGraphic />,
    transactionProgressIcon: <BrandIcon />,
  }}
/>
```

| Slot                      | Description                                            |
| ------------------------- | ------------------------------------------------------ |
| `trigger`                 | Replaces the dialog trigger. Ignored by inline mode.   |
| `formGraphic`             | Graphic above the search and renewal form.             |
| `successGraphic`          | Graphic shown after the renewal confirms.              |
| `transactionProgressIcon` | Icon animated while approval or renewal is confirming. |

An `undefined` slot uses the default. Passing `null` hides a graphic.

## Messages

```tsx
<NameRenewal
  messages={{
    formTitle: "Extend your name",
    renewLabel: "Continue",
    successTitle: "Renewal complete",
  }}
/>
```

| Key                 | Default                                            |
| ------------------- | -------------------------------------------------- |
| `triggerLabel`      | `Renew a name`                                     |
| `formTitle`         | `Renew your ENS name`                              |
| `formDescription`   | `Extend a registered .eth name before it expires.` |
| `searchPlaceholder` | `Search a name, e.g. vitalik`                      |
| `renewLabel`        | `Renew`                                            |
| `successTitle`      | `Your name has been renewed`                       |
| `doneLabel`         | `Done`                                             |

Transaction states, validation errors, and protocol-critical copy are not
customizable through `messages`.

## Lifecycle events

```tsx
<NameRenewal
  events={{
    onApprove: ({ amount, transactionHash }) => {},
    onRenew: ({ name, currentExpiry, newExpiry, transactionHash }) => {},
    onError: ({ error, phase, transactionHash }) => {},
  }}
/>
```

| Event       | When it runs                                                                                    |
| ----------- | ----------------------------------------------------------------------------------------------- |
| `onApprove` | A required ERC-20 approval confirms. It does not run when the existing allowance is sufficient. |
| `onRenew`   | The renewal confirms and the new expiry is available.                                           |
| `onError`   | An attempted approval or renewal fails. `phase` is `"approval"` or `"renewal"`.                 |

Confirmed transaction events contain `chainId`, `transactionHash`, and the
Viem `TransactionReceipt`. Callbacks may return a promise, but the flow does
not wait for it. Callback failures do not change an already-confirmed
transaction.

## Current constraints

- Only second-level `.eth` names are supported.
- The extension must be at least 28 days.
- Renewal uses a payment token configured by `EnsProvider`.
- The built-in named configuration currently supports ENS v2 Sepolia.
