import type { Address } from "viem";

import { DaiIcon, UsdcIcon } from "#/components/icons";
import {
  defaultReverseRegistrarAdapterAbi,
  ethRegistrarAbi,
  ethRegistryAbi,
  l1ReverseRegistrarAbi,
  permissionedResolverAbi,
  universalResolverV2Abi,
  verifiableFactoryAbi,
} from "#/data/abi";
import type { EnsIconComponent } from "#/icons/get-record-icon";

export interface EnsPaymentToken {
  readonly address: Address;
  readonly decimals: number;
  readonly icon: EnsIconComponent;
  readonly name: string;
  readonly symbol: string;
}

export type EnsPaymentTokens = readonly [EnsPaymentToken, ...EnsPaymentToken[]];

export interface EnsContracts {
  readonly defaultReverseRegistrarAdapter: {
    readonly abi: typeof defaultReverseRegistrarAdapterAbi;
    readonly address: Address;
  };
  readonly l1ReverseRegistrar: {
    readonly abi: typeof l1ReverseRegistrarAbi;
    readonly address: Address;
  };
  readonly ethRegistrar: {
    readonly abi: typeof ethRegistrarAbi;
    readonly address: Address;
  };
  readonly ethRegistry: {
    readonly abi: typeof ethRegistryAbi;
    readonly address: Address;
  };
  readonly paymentTokens: EnsPaymentTokens;
  readonly permissionedResolverImplementation: {
    readonly abi: typeof permissionedResolverAbi;
    readonly address: Address;
  };
  readonly universalResolverV2: {
    readonly abi: typeof universalResolverV2Abi;
    readonly address: Address;
  };
  readonly verifiableFactory: {
    readonly abi: typeof verifiableFactoryAbi;
    readonly address: Address;
  };
}

export const testnetContracts = {
  defaultReverseRegistrarAdapter: {
    address: "0x7a84e241f862d73960d73c26d68c3c8f89f0b18f" as Address,
    abi: defaultReverseRegistrarAdapterAbi,
  },
  l1ReverseRegistrar: {
    address: "0xA0a1AbcDAe1a2a4A2EF8e9113Ff0e02DD81DC0C6" as Address,
    abi: l1ReverseRegistrarAbi,
  },
  ethRegistrar: {
    address: "0xa88553f454b77203b0d036a05c894d555eaaa2cc" as Address,
    abi: ethRegistrarAbi,
  },
  ethRegistry: {
    address: "0xbdc85dd5b15d7ecb354cd7cb6f2c50b4f2c4f0e2" as Address,
    abi: ethRegistryAbi,
  },
  paymentTokens: [
    {
      address: "0x768f42455a2d082e23ceef7d51e5787c82d67a39",
      decimals: 6,
      icon: UsdcIcon,
      name: "Mock USDC",
      symbol: "USDC",
    },
    {
      address: "0x5472c5725a00b7ba11f0794a79d08ade6f4683bd",
      decimals: 18,
      icon: DaiIcon,
      name: "Mock DAI",
      symbol: "DAI",
    },
  ] as const satisfies EnsPaymentTokens,
  permissionedResolverImplementation: {
    address: "0x9eae5c2730a7dd16bdd1dee6421a1b91e3b0365e" as Address,
    abi: permissionedResolverAbi,
  },
  universalResolverV2: {
    address: "0xeEeEEEeE14D718C2B47D9923Deab1335E144EeEe" as Address,
    abi: universalResolverV2Abi,
  },
  verifiableFactory: {
    address: "0x10dc6333cdfe1fcef624c6e0a8221b91804cd7ef" as Address,
    abi: verifiableFactoryAbi,
  },
} as const satisfies EnsContracts;
