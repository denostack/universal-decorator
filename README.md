# universal-decorator <a href="https://github.com/denostack"><img src="https://raw.githubusercontent.com/denostack/images/main/logo.svg" width="160" align="right" /></a>

<p>
  <a href="https://github.com/denostack/universal-decorator/actions"><img alt="Build" src="https://img.shields.io/github/actions/workflow/status/denostack/universal-decorator/ci.yml?branch=main&logo=github&style=flat-square" /></a>
  <a href="https://codecov.io/gh/denostack/universal-decorator"><img alt="Coverage" src="https://img.shields.io/codecov/c/gh/denostack/universal-decorator?style=flat-square" /></a>
  <img alt="License" src="https://img.shields.io/npm/l/universal-decorator.svg?style=flat-square" />
  <img alt="Language Typescript" src="https://img.shields.io/badge/language-Typescript-007acc.svg?style=flat-square" />
  <br />
  <a href="https://jsr.io/@denostack/universal-decorator"><img alt="JSR version" src="https://jsr.io/badges/@denostack/universal-decorator?style=flat-square" /></a>
  <a href="https://www.npmjs.com/package/universal-decorator"><img alt="NPM Version" src="https://img.shields.io/npm/v/universal-decorator.svg?style=flat-square&logo=npm" /></a>
  <a href="https://npmcharts.com/compare/universal-decorator?minimal=true"><img alt="Downloads" src="https://img.shields.io/npm/dt/universal-decorator.svg?style=flat-square" /></a>
</p>

This library bridges the gap between **TC39 Proposal Decorators** (Stage 3) and **TypeScript Experimental Decorators**,
allowing you to write decorators that work in both environments.

It provides a compatibility layer for:

- **Unified Decorator Definition**: Define a single decorator that handles both standard and experimental behaviors.
- **Metadata Reflection**: A `reflect-metadata` compatible API (`getMetadata`, `hasMetadata`, `getMetadataKeys`) that
  works with the new metadata proposal.
- **Metadata Inheritance**: seamless inheritance of metadata values, complying with the proposal spec.

## Usage

### `defineDecorator`

`defineDecorator` allows you to define the implementation for both ECMAScript (Standard) decorators and TypeScript
Experimental decorators in one place.

```typescript
import { defineDecorator } from "@denostack/universal-decorator";

const myDecorator = defineDecorator({
  // Implementation for TC39 Stage 3 Decorators
  ecma(target, ctx) {
    console.log(`[ECMA] Decorating ${ctx.kind}: ${String(ctx.name)}`);
    // Logic for standard decorators...
  },
  // Implementation for TypeScript Experimental Decorators
  tsExperimental(target, property, descriptor) {
    console.log(`[TS] Decorating ${property ? String(property) : "class"}`);
    // Logic for experimental decorators...
  },
});

// Usage
@myDecorator
class MyClass {
  @myDecorator
  method() {}
}
```

### Metadata Reflection

This library provides a metadata API inspired by `reflect-metadata`, but adapted for the modern decorator context
structure.

The functions `getMetadata`, `hasMetadata`, `getMetadataKeys`, `getOwnMetadata`, `hasOwnMetadata`, and
`getOwnMetadataKeys` follow the usage pattern of `reflect-metadata`. However, when specifying a property, they expect an
object structure `{ name: string | symbol, static: boolean }` which aligns with the `context` object in the TC39
decorator proposal.

```typescript
import { defineMetadataDecorator, getMetadata } from "@denostack/universal-decorator";

// Define metadata
@defineMetadataDecorator("role", "admin")
class User {
  @defineMetadataDecorator("permissions", ["read", "write"])
  static defaultPermissions: string[];

  @defineMetadataDecorator("visible", true)
  getName() {}
}

// Retrieve metadata
// Class metadata
const classRole = getMetadata("role", User); // "admin"

// Static property metadata
// Note: Property identifier is an object { name, static }
const staticPerms = getMetadata("permissions", User, { name: "defaultPermissions", static: true }); // ["read", "write"]

// Instance property metadata
const methodVisible = getMetadata("visible", User, { name: "getName", static: false }); // true
```

### `defineMetadataDecorator` and Inheritance

`defineMetadataDecorator` creates a decorator specifically for attaching metadata. It supports **metadata inheritance**,
meaning metadata defined on a parent class is accessible to child classes unless overridden.

You can also inherit and extend existing metadata values using a callback function: `(previousValue) => newValue`.

```typescript
import { defineMetadataDecorator, getMetadata, getOwnMetadata, hasOwnMetadata } from "@denostack/universal-decorator";

// 1. Simple Definition
@defineMetadataDecorator("custom:tag", "v1")
class Parent {}

// 2. Inheritance & Extension
// The callback receives the metadata value from the parent class (if any)
@defineMetadataDecorator("custom:tag", (parentValue) => `${parentValue} -> v2`)
class Child extends Parent {}

console.log(getMetadata("custom:tag", Parent)); // "v1"
console.log(getMetadata("custom:tag", Child)); // "v1 -> v2"

// You can use `hasOwnMetadata` and `getOwnMetadata` to check for metadata directly defined
// on a class, rather than inherited metadata.
@defineMetadataDecorator("custom:attr", "only-child")
class GrandChild extends Child {}

console.log(getOwnMetadata("custom:tag", Parent)); // "v1"
console.log(getOwnMetadata("custom:tag", Child)); // "v1 -> v2"
console.log(getOwnMetadata("custom:tag", GrandChild)); // undefined (not directly defined on GrandChild)

console.log(hasOwnMetadata("custom:attr", GrandChild)); // true
console.log(getOwnMetadata("custom:attr", GrandChild)); // "only-child"
```

This inheritance mechanism follows the behavior specified in the Decorator Metadata proposal, ensuring that metadata
flows down the prototype chain correctly.

### Comparison with `reflect-metadata`

While `reflect-metadata` uses `(metadataKey, target, propertyKey)`:

- **reflect-metadata**: `Reflect.getMetadata("key", Target.prototype, "methodName")`
- **universal-decorator**: `getMetadata("key", Target, { name: "methodName", static: false })`

This library consciously adopts the `{ name, static }` structure to be forwards-compatible with the context object
provided by standard decorators. Metadata resolution follows the prototype chain (inheritance) by default, as per the
proposal, but you can also access own metadata using `getOwnMetadata`.

## References

- [TC39 Proposal: Decorator Metadata](https://github.com/tc39/proposal-decorator-metadata)
- [TC39 Proposal: Decorators](https://github.com/tc39/proposal-decorators)
- [Reflect Metadata](http://github.com/microsoft/reflect-metadata)
