// deno-lint-ignore-file no-explicit-any

import type {
  ProposalClassFieldDecorator,
  UniversalClassFieldDecorator,
} from "./types.ts";

export interface CreateClassFieldDecoratorProps {
  ecma?: ProposalClassFieldDecorator;
  tsExperimental?: PropertyDecorator;
}

export function createClassFieldDecorator(
  props: CreateClassFieldDecoratorProps = {},
): UniversalClassFieldDecorator {
  return ((...args: unknown[]) => {
    if (args[0] && typeof args[1] === "string") {
      return props?.tsExperimental?.apply(undefined, args as any);
    }
    if (
      !args[0] &&
      args[1] &&
      typeof args[1] === "object" &&
      "addInitializer" in args[1]
    ) {
      return props?.ecma?.apply(undefined, args as any);
    }
  }) as unknown as UniversalClassFieldDecorator;
}
