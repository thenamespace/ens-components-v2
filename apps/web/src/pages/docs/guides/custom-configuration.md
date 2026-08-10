---
title: Custom Configuration
description: Configure ENS Components for a compatible ENS deployment.
---

# Custom Configuration

Use a complete `EnsConfig` for a compatible ENS v2 deployment that is not
covered by a named preset.

```ts [ens.ts]
import { createEnsConfig, testnetContracts } from "@thenamespace/ens-components-v2";
import { sepolia } from "viem/chains";

const config = createEnsConfig({
  chain: sepolia,
  contracts: testnetContracts,
  indexerUrl: "https://graphql.ens.dev/graphql",
});
```

:::warning
Raw configurations are not merged with a preset. Provide every required
contract and at least one payment token.
:::

## Required contracts

A custom configuration must provide:

- ETH registrar
- ENS registry
- Universal Resolver v2
- Permissioned Resolver implementation
- Verifiable Factory
- Default Reverse Registrar Adapter
- L1 reverse registrar
- at least one ERC-20 payment token

Each contract entry contains both `address` and `abi`.

## Chain alignment

The configured chain must also exist in the nearest Wagmi configuration.
Hooks select Wagmi clients by `EnsConfig.chain.id`.

## Compatibility

Custom contracts must implement the ABI and behavior expected by the package.
The configuration API does not adapt ENS v1 contracts or incompatible
registrar and resolver implementations.

See [Contracts](/docs/config/contracts) for the complete shape.
