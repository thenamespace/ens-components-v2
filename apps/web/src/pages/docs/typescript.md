---
title: TypeScript
description: TypeScript requirements and type inference in ENS Components.
---

# TypeScript

ENS Components is written in TypeScript and publishes declaration files for
every public entry point.

## Recommended configuration

Use TypeScript 5.7 or newer with strict checking and a bundler-aware module
resolver.

```json [tsconfig.json]
{
  "compilerOptions": {
    "lib": ["DOM", "ES2022"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "target": "ES2022",
    "verbatimModuleSyntax": true
  }
}
```

## Inferred query data

Query hooks preserve TanStack Query `select` inference.

```ts [price.ts] twoslash
// @noErrors
import { useNameRegistrationPrice } from "@thenamespace/ens-components-v2/hooks";
const price = useNameRegistrationPrice({
  input: "example.eth",
  duration: 31_536_000n,
  query: {
    select: (data) => data.price,
  },
});

price.data;
//    ^?
```

## Typed errors

Actions return Neverthrow results with string-literal error unions. Branch on
the code, then format it at the rendering boundary.

```ts [availability.ts]
const result = await readNameAvailability(publicClient, {
  input: "example.eth",
  registrarAddress,
});

if (result.isErr()) {
  switch (result.error) {
    case "INVALID_REGISTRAR_ADDRESS":
    case "UNSUPPORTED_NAME":
    case "CONTRACT_READ_FAILED":
      break;
  }
}
```

Hooks expose the same codes through the TanStack Query `error` property.

## Prepared calls

Prepared actions retain their ABI-derived request and result types. Pass the
prepared value directly to the corresponding executor instead of rebuilding
the request object.

```ts [resolver.ts]
const prepared = prepareNameResolverRead({
  input: "example.eth",
  universalResolverAddress,
});

if (prepared.isOk()) {
  const result = await executeContractRead(publicClient, prepared.value);
}
```

:::tip
Use `import type` for public parameter, result, event, slot, and message types.
All package entry points publish declaration files.
:::
