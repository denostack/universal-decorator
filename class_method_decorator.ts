import type {
  ProposalClassMethodDecorator,
  UniversalClassMethodDecorator,
} from "./types.ts";

export interface CreateClassMethodDecoratorProps {
  ecma?: ProposalClassMethodDecorator;
  tsExperimental?: MethodDecorator;
}

export function createClassMethodDecorator(
  props: CreateClassMethodDecoratorProps = {},
): UniversalClassMethodDecorator {
  return ((...args: unknown[]) => {
    if (args[0] && typeof args[1] === "string" && typeof args[2] === "object") {
      return props?.tsExperimental?.call(undefined, ...args);
    }
    if (
      args[0] &&
      args[1] &&
      typeof args[1] === "object" &&
      "addInitializer" in args[1]
    ) {
      return props?.ecma?.call(undefined, ...args);
    }
  }) as unknown as UniversalClassMethodDecorator;
}
