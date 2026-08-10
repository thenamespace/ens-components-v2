---
title: Choosing an API
description: Choose between ENS Components components, hooks, and actions.
---

# Choosing an API

ENS Components exposes ENS workflows at three levels. Start with the highest
level that gives your application enough control.

| API        | Use when                                          |
| ---------- | ------------------------------------------------- |
| Components | You need a complete, accessible user flow.        |
| Hooks      | You are building a custom React interface.        |
| Actions    | You own caching, execution, or run outside React. |

## Components

Components manage form state, validation, transaction ordering, confirmation,
errors, and success states.

```tsx [renew-name.tsx]
import { NameRenewal } from "@thenamespace/ens-components-v2";

<NameRenewal defaultInput="example.eth" />;
```

Use slots, messages, events, and presentation props to integrate them with the
host application.

:::tip
Start with a component when the package already covers the complete flow.
Moving to hooks later does not change the underlying ENS configuration.
:::

## Hooks

Hooks combine prepared actions with Wagmi clients and TanStack Query.

```tsx [renewal-price.tsx]
import { useNameRenewalPrice } from "@thenamespace/ens-components-v2/hooks";

const renewal = useNameRenewalPrice({
  duration: 31_536_000n,
  input: "example.eth",
});
```

Use hooks when the application should own rendering but not RPC orchestration.

## Actions

Actions validate and execute reads or writes without React. Every direct action
also has a prepare function for custom execution and batching.

```ts [availability.ts]
import {
  executeContractRead,
  prepareNameAvailabilityRead,
} from "@thenamespace/ens-components-v2/actions";

const prepared = prepareNameAvailabilityRead({
  input: "example.eth",
  registrarAddress,
});

if (prepared.isOk()) {
  const available = await executeContractRead(publicClient, prepared.value);
}
```

Use actions in state machines, servers, workers, or applications with their
own orchestration.

See [Batching](/docs/guides/batching) to compose prepared reads and writes.
