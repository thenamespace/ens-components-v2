---
title: Contracts
description: Configure contract addresses and ABIs for an ENS v2 deployment.
---

# Contracts

`EnsContracts` contains every contract used by package components, hooks, and
actions.

## Import

```ts [import.ts]
import { testnetContracts } from "@thenamespace/ens-components-v2";
```

## Type

```ts [types.ts]
interface EnsContracts {
  readonly defaultReverseRegistrarAdapter: Contract<typeof defaultReverseRegistrarAdapterAbi>;
  readonly ethRegistrar: Contract<typeof ethRegistrarAbi>;
  readonly ethRegistry: Contract<typeof ethRegistryAbi>;
  readonly universalResolverV2: Contract<typeof universalResolverV2Abi>;
  readonly permissionedResolverImplementation: Contract<typeof permissionedResolverAbi>;
  readonly verifiableFactory: Contract<typeof verifiableFactoryAbi>;
  readonly l1ReverseRegistrar: Contract<typeof l1ReverseRegistrarAbi>;
  readonly paymentTokens: EnsPaymentTokens;
}
```

Each contract entry has `address` and `abi` properties. The exported ABIs are
JSON ABI arrays with literal types.

## Testnet Contracts

| Contract                                  | Sepolia address                              |
| ----------------------------------------- | -------------------------------------------- |
| Default Reverse Registrar Adapter         | `0x7a84e241f862d73960d73c26d68c3c8f89f0b18f` |
| ETH Registrar                             | `0xa88553f454b77203b0d036a05c894d555eaaa2cc` |
| ENS Registry                              | `0xbdc85dd5b15d7ecb354cd7cb6f2c50b4f2c4f0e2` |
| Universal Resolver v2 proxy               | `0xeEeEEEeE14D718C2B47D9923Deab1335E144EeEe` |
| Permissioned Resolver implementation      | `0x9eae5c2730a7dd16bdd1dee6421a1b91e3b0365e` |
| Verifiable Factory                        | `0x10dc6333cdfe1fcef624c6e0a8221b91804cd7ef` |
| Registry-backed L1 Reverse Registrar (v1) | `0xA0a1AbcDAe1a2a4A2EF8e9113Ff0e02DD81DC0C6` |

These addresses target the ENS v2 Sepolia deployment created on July 30, 2026. The Universal Resolver uses its stable upgradeable proxy address.

:::warning
Custom contracts must implement the ABI and behavior expected by ENS
Components. The configuration layer does not adapt ENS v1 contracts.
:::
