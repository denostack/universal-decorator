// deno-lint-ignore-file ban-types

import { defineDecorator } from "./define_decorator.ts";

export interface Property {
  name: string | symbol;
  static: boolean;
}

const SYMBOL_CLASS = Symbol("class");
const SYMBOL_INSTANCE_PROPERTIES = Symbol("instanceProperties");
const SYMBOL_STATIC_PROPERTIES = Symbol("staticProperties");

interface MetadataStorageGroup {
  [SYMBOL_CLASS]?: Record<string | symbol, unknown>;
  [SYMBOL_INSTANCE_PROPERTIES]?: Record<string | symbol, Record<string | symbol, unknown>>;
  [SYMBOL_STATIC_PROPERTIES]?: Record<string | symbol, Record<string | symbol, unknown>>;
}

const metadataStorageGroupMap = new WeakMap<Function, MetadataStorageGroup>();

function getOrCreateMetadataStorageGroup(target: Function) {
  let storageGroup = (target[Symbol.metadata] as MetadataStorageGroup | undefined) ??
    metadataStorageGroupMap.get(target);
  if (!storageGroup) {
    storageGroup = {} as MetadataStorageGroup;
    metadataStorageGroupMap.set(target, storageGroup);
  }
  return storageGroup;
}

function getOrCreateMetadataStorage(storageGroup: MetadataStorageGroup, property?: Property) {
  if (!property) {
    return storageGroup[SYMBOL_CLASS] = storageGroup[SYMBOL_CLASS] ?? {};
  }
  if (property.static) {
    storageGroup[SYMBOL_STATIC_PROPERTIES] = storageGroup[SYMBOL_STATIC_PROPERTIES] ?? {};
    return storageGroup[SYMBOL_STATIC_PROPERTIES][property.name] =
      storageGroup[SYMBOL_STATIC_PROPERTIES][property.name] ?? {};
  }
  storageGroup[SYMBOL_INSTANCE_PROPERTIES] = storageGroup[SYMBOL_INSTANCE_PROPERTIES] ?? {};
  return storageGroup[SYMBOL_INSTANCE_PROPERTIES][property.name] =
    storageGroup[SYMBOL_INSTANCE_PROPERTIES][property.name] ?? {};
}

function defineMetadata<T>(
  metadataStorage: Record<string | symbol, unknown>,
  metadataKey: string | symbol,
  metadataValue: T | ((value?: T) => T),
) {
  metadataStorage[metadataKey] = typeof metadataValue === "function"
    ? (metadataValue as (value?: T) => T)(metadataStorage[metadataKey] as T | undefined)
    : metadataValue;
}

export function defineMetadataDecorator<T>(
  key: string | symbol,
  value: T | ((value?: T) => T),
) {
  return defineDecorator({
    ecma(_, ctx) {
      const storage = getOrCreateMetadataStorage(
        ctx.metadata as MetadataStorageGroup,
        ctx.kind === "class" ? undefined : { name: ctx.name, static: ctx.static },
      );
      defineMetadata(storage, key, value);
    },
    tsExperimental(target, property) {
      const [targetClass, isStatic] = typeof target === "function" ? [target, true] : [target.constructor, false];
      const storageGroup = getOrCreateMetadataStorageGroup(targetClass);
      const storage = getOrCreateMetadataStorage(
        storageGroup,
        property ? { name: property, static: isStatic } : undefined,
      );
      defineMetadata(storage, key, value);
    },
  });
}

function getOwnMetadataStorage(target: Function, property?: Property) {
  const storageGroup = (target[Symbol.metadata] as MetadataStorageGroup | undefined) ??
    metadataStorageGroupMap.get(target) ?? {};
  if (!property) {
    return storageGroup[SYMBOL_CLASS] ?? {};
  }
  return storageGroup[property.static ? SYMBOL_STATIC_PROPERTIES : SYMBOL_INSTANCE_PROPERTIES]?.[property.name] ?? {};
}

export function hasOwnMetadata(metadataKey: string | symbol, target: Function, property?: Property) {
  return metadataKey in getOwnMetadataStorage(target, property);
}

export function getMetadata(metadataKey: string | symbol, target: Function, property?: Property) {
  return getOwnMetadataStorage(target, property)[metadataKey];
}

export function getMetadataKeys(target: Function, property?: Property) {
  return Object.keys(getOwnMetadataStorage(target, property));
}
