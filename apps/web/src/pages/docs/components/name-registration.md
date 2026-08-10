---
title: NameRegistration
description: A complete ENS v2 .eth registration flow.
---

# NameRegistration

Provides the complete ENS v2 registration flow for second-level `.eth` names:

1. Check availability, select a payment token, and read its price.
2. Optionally request that the registered name becomes the wallet's primary
   name.
3. Select a custom resolver or prepare a dedicated resolver.
4. Deploy the resolver and submit a persisted commitment.
5. Wait for the commitment minimum age.
6. Approve the ERC-20 payment token when required and register the name.
7. Set the forward and reverse records when primary-name setup is selected.
8. Display the confirmed registration.

## Import

```ts
import { NameRegistration } from "@thenamespace/ens-components-v2";
```

## Usage

```tsx
<NameRegistration />
```

The default presentation renders a `Register` trigger and opens the flow in a
dialog.

### Inline presentation

```tsx
<NameRegistration presentation="inline" />
```

Inline mode renders the flow directly and ignores `slots.trigger`.

## Props

| Prop                         | Type                                | Default              | Description                                                             |
| ---------------------------- | ----------------------------------- | -------------------- | ----------------------------------------------------------------------- |
| `presentation`               | `"dialog" \| "inline"`              | `"dialog"`           | Selects the outer presentation.                                         |
| `defaultInput`               | `string`                            | `""`                 | Initial name input.                                                     |
| `defaultPaymentTokenAddress` | `Address`                           | First provider token | Initial payment token. Unknown addresses fall back to the first token.  |
| `defaultDuration`            | `bigint`                            | `31_557_600n`        | Initial duration in seconds. Values below 28 days are clamped.          |
| `defaultDurationMode`        | `"date" \| "duration"`              | `"duration"`         | Initial duration control.                                               |
| `defaultReferrer`            | `Hex`                               | `zeroHash`           | Initial 32-byte referrer identifier.                                    |
| `defaultResolverAddress`     | `Address`                           | `undefined`          | Initial custom resolver. A dedicated resolver is deployed when omitted. |
| `slots`                      | `NameRegistrationSlots`             | `{}`                 | Replaces branded visual elements.                                       |
| `messages`                   | `Partial<NameRegistrationMessages>` | Default English copy | Overrides high-level interface copy.                                    |
| `events`                     | `NameRegistrationEvents`            | `{}`                 | Receives confirmed transactions and flow errors.                        |

The default values initialize internal state. They are not controlled props.

## Payment tokens

The name-search screen lists the payment tokens configured for the selected
network. Changing the token refetches its registration price. The selected
token is then used for balance, allowance, approval, and registration calls.
When approval is required, wallets with atomic EIP-5792 support receive the
approval and registration as one batch. When primary-name setup is selected,
the forward address record and reverse-name update are appended to the same
batch. Other wallets receive the same writes as ordered transactions, with
each write confirmed before the next is submitted.

```tsx
<NameRegistration defaultPaymentTokenAddress="0x5472c5725a00b7ba11f0794a79d08ade6f4683bd" />
```

The default Sepolia configuration provides Mock USDC and Mock DAI. The payment
token is not part of the ENS commitment, so selecting another configured token
does not require a new commitment.

## Slots

```tsx
<NameRegistration
  slots={{
    trigger: <button>Claim a name</button>,
    searchGraphic: <SearchGraphic />,
    processGraphic: <ProcessGraphic />,
    successGraphic: <SuccessGraphic />,
    transactionProgressIcon: <BrandIcon />,
  }}
/>
```

| Slot                      | Description                                                               |
| ------------------------- | ------------------------------------------------------------------------- |
| `trigger`                 | Replaces the dialog trigger. Ignored by inline mode.                      |
| `searchGraphic`           | Graphic on the availability and pricing screen.                           |
| `processGraphic`          | Graphic above the commitment flow.                                        |
| `successGraphic`          | Graphic on the completed registration screen.                             |
| `transactionProgressIcon` | Icon animated during commitment, approval, and registration confirmation. |

An `undefined` slot uses the default. Passing `null` hides a graphic.

## Messages

```tsx
<NameRegistration
  messages={{
    doneLabel: "Continue",
    searchTitle: "Claim your onchain identity",
    successTitle: "Your name is ready",
  }}
/>
```

| Key                  | Default                                    |
| -------------------- | ------------------------------------------ |
| `triggerLabel`       | `Register`                                 |
| `searchTitle`        | `Register your ENS Name`                   |
| `searchDescription`  | `Register your ENS name and set a profile` |
| `searchPlaceholder`  | `Search a name, e.g. vitalik`              |
| `processTitle`       | `ENS Registration Process`                 |
| `processDescription` | `Registration consists of three steps.`    |
| `successTitle`       | `Hooray! You've registered`                |
| `doneLabel`          | `Done`                                     |

Protocol-critical step descriptions, errors, and transaction states are not
customizable through `messages`.

## Lifecycle events

```tsx
<NameRegistration
  events={{
    onCommit: ({ commitment, transactionHash }) => {},
    onResolverDeploy: ({ resolverAddress, transactionHash }) => {},
    onApprove: ({ amount, transactionHash }) => {},
    onRegister: ({ name, tokenId, transactionHash }) => {},
    onSetPrimaryName: ({ name, transactionHash }) => {},
    onError: ({ error, phase, transactionHash }) => {},
  }}
/>
```

| Event              | When it runs                                                                                            |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| `onResolverDeploy` | A dedicated resolver deployment is confirmed. It does not run when a custom resolver is used.           |
| `onCommit`         | The commitment receipt succeeds and the registration attempt is stored locally.                         |
| `onApprove`        | A required ERC-20 approval receipt succeeds. It does not run when the existing allowance is sufficient. |
| `onRegister`       | The registration receipt succeeds and registration details are available.                               |
| `onSetPrimaryName` | The forward address, default reverse, and L1 reverse writes are all confirmed.                          |
| `onError`          | An attempted resolver, commitment, payment, registration, address-record, or primary-name phase fails.  |

Confirmed transaction events contain `chainId`, `transactionHash`, and the
Viem `TransactionReceipt`. Operation-specific payloads include the related
addresses and values.
For `onSetPrimaryName`, the base receipt and hash belong to the final L1
reverse write. The event also includes the address-record receipt and hash,
the default reverse receipt and hash, the adapter address, and the L1 reverse
registrar address.

`onError.phase` is `"resolver"`, `"commitment"`, `"approval"`,
`"registration"`, `"address-record"`, `"default-primary-name"`, or
`"l1-primary-name"`.
`transactionHash` is included when a transaction was submitted.

Callbacks may return a promise, but the flow does not wait for it. Thrown or
rejected callback errors do not change an already-confirmed transaction flow.

## Resolver behavior

Leave the custom resolver field blank to deploy a dedicated
`PermissionedResolver` proxy owned by the connected account. If the wallet
supports atomic EIP-5792 calls, resolver deployment and commitment submission
are sent as one atomic batch. Other wallets receive the same operations as two
sequential transactions.

Set `defaultResolverAddress` or enter an address under Advanced options to use
an existing resolver. The component checks that the address contains deployed
bytecode. The caller is responsible for ensuring that the resolver supports
the records and permissions required by the application.

## Primary-name behavior

The **Set as primary name** switch is in Advanced options and is off by
default. When selected, the component appends three writes after registration:

1. `setAddr(node, 60, addressBytes)` on the registered name's resolver;
2. `setName(account, name)` on the deployed `DefaultReverseRegistrarAdapter`;
3. `setName(name)` on the registry-backed L1 `ReverseRegistrar`.

The explicit Ethereum address record is required for L1 forward verification.
The adapter explicitly receives the connected account and authorizes the
caller, while the L1 registrar derives the account from `msg.sender`. Writing
both reverse representations
matches the ENS v2 app while preserving compatibility with the established
`addr.reverse` resolution path.
The built-in dedicated `PermissionedResolver` grants the connected account the
required permissions. A custom resolver must implement the multicoin
`setAddr` function and authorize the connected account to update the record.

An atomic wallet either confirms all registration and primary-name writes or
reverts all of them. With a sequential wallet, registration may confirm before
a later primary-name write fails. In that case, the component reports the
registration as successful, displays `Primary name: Not set`, and invokes
`onError` for the failed phase. It does not submit the registration again.

## Resuming registration

The component persists the prepared resolver, salt, secret, commitment, and
submitted transaction identifiers before waiting for confirmation. It also
persists the selected payment-token address so a resumed registration uses the
same token. The primary-name choice is stored with the attempt and restored
when the flow resumes. It can resume a pending or confirmed attempt from the
same browser origin when the name, wallet, duration, referrer, resolver choice,
network, and contracts still match. Progress is not synchronized across
browsers or devices. Clearing site storage removes resume data but does not
change onchain state.

## Current constraints

- Only second-level `.eth` names are supported.
- Labels must contain at least three Unicode code points.
- Registration uses one of the payment tokens configured by `EnsProvider`.
- The built-in named configuration currently supports ENS v2 Sepolia.
