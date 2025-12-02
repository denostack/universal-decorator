// deno-lint-ignore-file no-explicit-any

import type { EcmaDecorator, LegacyDecorator, UniversalDecorator } from "./types.ts";

export interface DefineDecoratorProps {
  ecma?: EcmaDecorator;
  tsExperimental?: LegacyDecorator;
}

export function defineDecorator(
  props: DefineDecoratorProps = {},
): UniversalDecorator {
  return ((...args: unknown[]) => {
    if (args[1] && typeof args[1] === "object" && "addInitializer" in args[1]) {
      return (props?.ecma as any)?.apply(undefined, args as any);
    }
    return (props?.tsExperimental as any)?.apply(undefined, args as any);
  }) as unknown as UniversalDecorator;
}
