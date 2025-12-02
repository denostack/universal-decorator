// deno-lint-ignore-file no-explicit-any

import type {
  ProposalClassDecorator,
  UniversalClassDecorator,
} from "./types.ts";

export interface CreateClassDecoratorProps {
  ecma?: ProposalClassDecorator;
  tsExperimental?: ClassDecorator;
}

export function createClassDecorator(
  props: CreateClassDecoratorProps = {},
): UniversalClassDecorator {
  return ((...args: unknown[]) => {
    if (args[0] && typeof args[0] === "function" && !args[1]) {
      return props.tsExperimental?.apply(undefined, args as any);
    }
    if (
      args[0] && typeof args[0] === "function" &&
      args[1] &&
      typeof args[1] === "object" &&
      "addInitializer" in args[1]
    ) {
      return props.ecma?.apply(undefined, args as any);
    }
  }) as unknown as UniversalClassDecorator;
}
