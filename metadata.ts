// deno-lint-ignore-file ban-types no-explicit-any

import { defineDecorator } from "./decorator.ts";
import type { UniversalDecorator } from "./types.ts";

export interface Property {
  name: string | symbol;
  static: boolean;
}

const SYMBOL_CLASS = Symbol("class");
const SYMBOL_INSTANCE = Symbol("instance");
const SYMBOL_STATIC = Symbol("static");

type Metadata = Record<string | symbol, unknown>;

interface MetadataStorage {
  [SYMBOL_CLASS]?: Metadata;
  [SYMBOL_INSTANCE]?: Record<string | symbol, Metadata>;
  [SYMBOL_STATIC]?: Record<string | symbol, Metadata>;
}

const metadataStorageMap = new WeakMap<Function, MetadataStorage>();

function getStorageFromClass(target: Function): MetadataStorage {
  let storage = metadataStorageMap.get(target);
  if (!storage) {
    const parentTarget = Object.getPrototypeOf(target);
    storage = Object.create(parentTarget ? getStorageFromClass(parentTarget) : null) as MetadataStorage;
    metadataStorageMap.set(target, storage);
  }
  return storage;
}

function getClassMetadataFromStorage(storage: MetadataStorage): Metadata {
  if (Object.hasOwn(storage, SYMBOL_CLASS)) {
    return storage[SYMBOL_CLASS]!;
  }
  const parentStorage = Object.getPrototypeOf(storage) as MetadataStorage | null;
  return storage[SYMBOL_CLASS] = Object.create(parentStorage ? getClassMetadataFromStorage(parentStorage) : null);
}

function getInstanceMetadataGroupFromStorage(storage: MetadataStorage): Record<string | symbol, Metadata> {
  if (Object.hasOwn(storage, SYMBOL_INSTANCE)) {
    return storage[SYMBOL_INSTANCE]!;
  }
  const parentStorage = Object.getPrototypeOf(storage) as MetadataStorage | null;
  return storage[SYMBOL_INSTANCE] = Object.create(
    parentStorage ? getInstanceMetadataGroupFromStorage(parentStorage) : null,
  );
}

function getInstanceMetadataFromStorage(storage: MetadataStorage, propertyName: string | symbol): Metadata {
  const metadataGroup = getInstanceMetadataGroupFromStorage(storage);
  if (Object.hasOwn(metadataGroup, propertyName)) {
    return metadataGroup[propertyName]!;
  }
  const parentStorage = Object.getPrototypeOf(storage) as MetadataStorage | null;
  return metadataGroup[propertyName] = Object.create(
    parentStorage ? getInstanceMetadataFromStorage(parentStorage, propertyName) : null,
  );
}

function getStaticMetadataGroupFromStorage(storage: MetadataStorage): Record<string | symbol, Metadata> {
  if (Object.hasOwn(storage, SYMBOL_STATIC)) {
    return storage[SYMBOL_STATIC]!;
  }
  const parentStorage = Object.getPrototypeOf(storage) as MetadataStorage | null;
  return storage[SYMBOL_STATIC] = Object.create(
    parentStorage ? getStaticMetadataGroupFromStorage(parentStorage) : null,
  );
}

function getStaticMetadataFromStorage(storage: MetadataStorage, propertyName: string | symbol): Metadata {
  const metadataGroup = getStaticMetadataGroupFromStorage(storage);
  if (Object.hasOwn(metadataGroup, propertyName)) {
    return metadataGroup[propertyName]!;
  }
  const parentStorage = Object.getPrototypeOf(storage) as MetadataStorage | null;
  return metadataGroup[propertyName] = Object.create(
    parentStorage ? getStaticMetadataFromStorage(parentStorage, propertyName) : null,
  );
}

function getMetadataFromStorage(storage: MetadataStorage, property?: Property): Metadata {
  if (!property) {
    return getClassMetadataFromStorage(storage);
  }
  return property.static
    ? getStaticMetadataFromStorage(storage, property.name)
    : getInstanceMetadataFromStorage(storage, property.name);
}

function getMetadataFromTarget(target: Function, property?: Property): Metadata {
  const storage = (target[Symbol.metadata] as MetadataStorage | undefined) ?? metadataStorageMap.get(target) ?? {};
  if (!property) {
    return storage[SYMBOL_CLASS] ?? {};
  }
  return storage[property.static ? SYMBOL_STATIC : SYMBOL_INSTANCE]?.[property.name] ?? {};
}

function defineMetadata<T>(
  metadata: Metadata,
  metadataKey: string | symbol,
  metadataValue: T | ((value: T | undefined, storage: Metadata) => T),
) {
  metadata[metadataKey] = typeof metadataValue === "function"
    ? (metadataValue as (value: T | undefined, storage: Metadata) => T)(
      metadata[metadataKey] as T | undefined,
      metadata,
    )
    : metadataValue;
}

export function defineMetadataDecorator<T>(
  key: string | symbol,
  value: T | ((value: T | undefined, storage: Metadata) => T),
): UniversalDecorator {
  return defineDecorator({
    ecma(_, ctx) {
      const metadata = getMetadataFromStorage(
        ctx.metadata,
        ctx.kind === "class" ? undefined : { name: ctx.name, static: ctx.static },
      );
      defineMetadata(metadata, key, value);
    },
    tsExperimental(target, property) {
      const [targetClass, isStatic] = typeof target === "function" ? [target, true] : [target.constructor, false];
      const storage = getStorageFromClass(targetClass);
      const metadata = getMetadataFromStorage(
        storage,
        property ? { name: property, static: isStatic } : undefined,
      );
      defineMetadata(metadata, key, value);
    },
  });
}

export function hasMetadata(metadataKey: string | symbol, target: Function, property?: Property): boolean {
  return metadataKey in getMetadataFromTarget(target, property);
}

export function getMetadata(metadataKey: string | symbol, target: Function, property?: Property): any {
  return getMetadataFromTarget(target, property)[metadataKey];
}

export function getMetadataKeys(target: Function, property?: Property): (string | symbol)[] {
  const keys: (string | symbol)[] = [];
  for (const key in getMetadataFromTarget(target, property)) {
    keys.push(key);
  }
  return keys;
}

export function hasOwnMetadata(metadataKey: string | symbol, target: Function, property?: Property): boolean {
  return Object.hasOwn(getMetadataFromTarget(target, property), metadataKey);
}

export function getOwnMetadata(metadataKey: string | symbol, target: Function, property?: Property): any {
  const metadata = getMetadataFromTarget(target, property);
  if (Object.hasOwn(metadata, metadataKey)) {
    return metadata[metadataKey];
  }
  return undefined;
}

export function getOwnMetadataKeys(target: Function, property?: Property): (string | symbol)[] {
  return Object.keys(getMetadataFromTarget(target, property));
}
