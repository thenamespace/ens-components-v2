# ENS Components

A growing collection of production-ready React components, hooks, and contract
actions for integrating ENS v2 into React applications.

> ENS v2 support is currently limited to the Sepolia testnet configuration.
> The `"mainnet"` network value is reserved but is not implemented yet.

## Features

- Complete resolver, commit, wait, approve, register, and primary-name flow
- Complete ERC-20 name renewal flow
- Permission-aware ENS profile record editor
- Configured payment-token selection with resumable state
- Dialog and inline registration presentations
- TanStack Query hooks for availability, pricing, profiles, and payment status
- Framework-independent actions returning `neverthrow` results
- Resumable registration flow

## Installation

Install the package and its Web3 peers:

```sh
npm install @thenamespace/ens-components-v2 @tanstack/react-query@^5 viem@^2.55.0 wagmi@^2.19.5
```

The package requires React and React DOM 19.2.7 or later, TanStack Query 5,
Viem 2.55 or later, and Wagmi 2.19.5 or later.
Tailwind CSS is not required in the consuming application.

## Styles

Import the precompiled package stylesheet once at the application root:

```css
@import "@thenamespace/ens-components-v2/styles.css";
```

The stylesheet contains the compiled UI Kit styles and every utility used by ENS
Components. No Tailwind installation, configuration, or source scanning is
required.

## Package exports

Import components, providers, data, and shared helpers from the package root:

```ts
import { EnsProvider, NameRegistration } from "@thenamespace/ens-components-v2";
```

Use the dedicated entry points for actions, query hooks, and icons:

```ts
import { prepareNameAvailabilityRead } from "@thenamespace/ens-components-v2/actions";
import { useNameAvailability } from "@thenamespace/ens-components-v2/hooks";
import { getAddressIcon } from "@thenamespace/ens-components-v2/icons";
```

Actions, hooks, and icons are not re-exported from the package root.

## Providers

Hooks and components require Wagmi, TanStack Query, and `EnsProvider`:

```tsx
"use client";

import type { ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { EnsProvider } from "@thenamespace/ens-components-v2";
import { createConfig, http, WagmiProvider } from "wagmi";
import { sepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";

const queryClient = new QueryClient();

const wagmiConfig = createConfig({
  chains: [sepolia],
  connectors: [injected()],
  transports: {
    [sepolia.id]: http(),
  },
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <EnsProvider config={{ network: "testnet" }}>{children}</EnsProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

Your application must also provide a wallet connection interface.

Use the same built-in configuration with direct actions:

```ts
import { getEnsNetworkConfiguration } from "@thenamespace/ens-components-v2";

const { chain, contracts } = getEnsNetworkConfiguration("testnet");
```

## Name registration

Render the complete registration flow as a dialog:

```tsx
import { NameRegistration } from "@thenamespace/ens-components-v2";

export function RegisterName() {
  return <NameRegistration />;
}
```

Use the inline presentation when the flow should remain in the page layout:

```tsx
<NameRegistration
  presentation="inline"
  messages={{
    searchTitle: "Claim your onchain identity",
  }}
/>
```

See
[NameRegistration](https://ens-components.vercel.app/docs/components/name-registration)
for customization, lifecycle events, defaults, and flow behavior.

## Name renewal

Render the renewal flow as a dialog:

```tsx
import { NameRenewal } from "@thenamespace/ens-components-v2";

export function RenewName() {
  return <NameRenewal defaultLabel="vitalik" />;
}
```

Use `presentation="inline"` to place the flow directly in a page. See
[NameRenewal](https://ens-components.vercel.app/docs/components/name-renewal)
for duration controls, lifecycle events, slots, and messages.

## Profile records

Render the permission-aware profile editor:

```tsx
import { NameProfileEditor, emptyNameProfileFormValues } from "@thenamespace/ens-components-v2";

<NameProfileEditor initialRecords={emptyNameProfileFormValues} name="example.eth" />;
```

The application supplies the initial record snapshot. The component discovers
the resolver, checks the connected account's ENS v2 record permissions,
reviews changes, and submits one atomic resolver multicall. See
[NameProfileEditor](https://ens-components.vercel.app/docs/components/name-profile-editor).

## Documentation

### Components

- [NameRegistration](https://ens-components.vercel.app/docs/components/name-registration)
- [NameRenewal](https://ens-components.vercel.app/docs/components/name-renewal)
- [NameProfileEditor](https://ens-components.vercel.app/docs/components/name-profile-editor)
- [TransactionProgress](https://ens-components.vercel.app/docs/components/transaction-progress)

### Providers

- [EnsProvider](https://ens-components.vercel.app/docs/providers/ens-provider)

### Hooks

#### Registration

- [useNameAvailability](https://ens-components.vercel.app/docs/hooks/use-name-availability)
- [useNamePrice](https://ens-components.vercel.app/docs/hooks/use-name-price)
- [useRegistrationPaymentStatus](https://ens-components.vercel.app/docs/hooks/use-registration-payment-status)
- [useCommitmentStatus](https://ens-components.vercel.app/docs/hooks/use-commitment-status)
- [useCommitName](https://ens-components.vercel.app/docs/hooks/use-commit-name)
- [useRegisterName](https://ens-components.vercel.app/docs/hooks/use-register-name)

#### Renewal

- [useNameRenewalPrice](https://ens-components.vercel.app/docs/hooks/use-name-renewal-price)
- [useNameRenewalPaymentStatus](https://ens-components.vercel.app/docs/hooks/use-name-renewal-payment-status)
- [useRenewName](https://ens-components.vercel.app/docs/hooks/use-renew-name)

#### Resolver and profile

- [useNameProfile](https://ens-components.vercel.app/docs/hooks/use-name-profile)
- [useNameRecords](https://ens-components.vercel.app/docs/hooks/use-name-records)
- [useNameProfilePermissions](https://ens-components.vercel.app/docs/hooks/use-name-profile-permissions)
- [useNameResolver](https://ens-components.vercel.app/docs/hooks/use-name-resolver)
- [useResolverCapabilities](https://ens-components.vercel.app/docs/hooks/use-resolver-capabilities)
- [useDeployPermissionedResolver](https://ens-components.vercel.app/docs/hooks/use-deploy-permissioned-resolver)
- [useUpdateNameProfileRecords](https://ens-components.vercel.app/docs/hooks/use-update-name-profile-records)
- [useSetAddressRecord](https://ens-components.vercel.app/docs/hooks/use-set-address-record)
- [useSetPrimaryName](https://ens-components.vercel.app/docs/hooks/use-set-primary-name)

#### Payments and transactions

- [useApprovePaymentToken](https://ens-components.vercel.app/docs/hooks/use-approve-payment-token)
- [useWalletCapabilities](https://ens-components.vercel.app/docs/hooks/use-wallet-capabilities)
- [useExecuteContractWrites](https://ens-components.vercel.app/docs/hooks/use-execute-contract-writes)
- [useContractWritesStatus](https://ens-components.vercel.app/docs/hooks/use-contract-writes-status)

### Icons

- [ENS icons and icon resolvers](https://ens-components.vercel.app/docs/icons/icons)

### Actions

- [readCommitmentStatus](https://ens-components.vercel.app/docs/actions/read-commitment-status)
- [readNameAvailability](https://ens-components.vercel.app/docs/actions/read-name-availability)
- [readNameProfileDiscovery](https://ens-components.vercel.app/docs/actions/read-name-profile-discovery)
- [readNameProfilePermissions](https://ens-components.vercel.app/docs/actions/read-name-profile-permissions)
- [readNameRecords](https://ens-components.vercel.app/docs/actions/read-name-records)
- [readNameRegistrationPaymentStatus](https://ens-components.vercel.app/docs/actions/read-name-registration-payment-status)
- [readNameRegistrationPrice](https://ens-components.vercel.app/docs/actions/read-name-registration-price)
- [readNameRenewalPaymentStatus](https://ens-components.vercel.app/docs/actions/read-name-renewal-payment-status)
- [readNameRenewalPrice](https://ens-components.vercel.app/docs/actions/read-name-renewal-price)
- [readNameResolver](https://ens-components.vercel.app/docs/actions/read-name-resolver)
- [readPermissionedResolverSupport](https://ens-components.vercel.app/docs/actions/read-permissioned-resolver-support)
- [readPermissionedResolverVerification](https://ens-components.vercel.app/docs/actions/read-permissioned-resolver-verification)
- [approvePaymentToken](https://ens-components.vercel.app/docs/actions/approve-payment-token)
- [commitName](https://ens-components.vercel.app/docs/actions/commit-name)
- [deployPermissionedResolver](https://ens-components.vercel.app/docs/actions/deploy-permissioned-resolver)
- [registerName](https://ens-components.vercel.app/docs/actions/register-name)
- [renewName](https://ens-components.vercel.app/docs/actions/renew-name)
- [setAddressRecord](https://ens-components.vercel.app/docs/actions/set-address-record)
- [setDefaultPrimaryName](https://ens-components.vercel.app/docs/actions/set-default-primary-name)
- [setL1PrimaryName](https://ens-components.vercel.app/docs/actions/set-l1-primary-name)
- [updateNameProfileRecords](https://ens-components.vercel.app/docs/actions/update-name-profile-records)
- [Contract Reads](https://ens-components.vercel.app/docs/actions/contract-reads)
- [GraphQL Reads](https://ens-components.vercel.app/docs/actions/graphql-reads)
- [Contract Writes](https://ens-components.vercel.app/docs/actions/contract-writes)
- [Contract Write Status](https://ens-components.vercel.app/docs/actions/contract-write-status)
- [executeContractWrites](https://ens-components.vercel.app/docs/actions/execute-contract-writes)
- [supportsAtomicBatchCalls](https://ens-components.vercel.app/docs/actions/supports-atomic-batch-calls)
