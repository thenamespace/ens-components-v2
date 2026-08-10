---
title: readPermissionedResolverVerification
description: Verify a PermissionedResolver proxy deployment.
---

# readPermissionedResolverVerification

Calls `VerifiableFactory.verifyContract(resolver)` and compares its returned
implementation address with the expected Permissioned Resolver implementation.

## Import

```ts [import.ts]
import { readPermissionedResolverVerification } from "@thenamespace/ens-components-v2/actions";
```

## Usage

```ts [resolver-verification.ts]
const result = await readPermissionedResolverVerification(publicClient, {
  factoryAddress,
  implementationAddress,
  resolverAddress,
});

if (result.isErr()) throw result.error;
```

## Parameters

### publicClient

`PublicClient`

The Viem client used to read the factory.

### parameters

```ts [types.ts]
interface ReadPermissionedResolverVerificationParameters {
  factoryAddress: Address;
  implementationAddress: Address;
  resolverAddress: Address;
}
```

## Return Type

`ResultAsync<boolean, ReadPermissionedResolverVerificationErrorType>`

## Error

Validation and RPC failures are returned as uppercase error codes.

## Prepare

`preparePermissionedResolverVerificationRead` returns the ABI-inferred
verification request without accessing an RPC endpoint. See
[Batching](/docs/guides/batching).
