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
    if (args[0] && typeof args[0] === "object" && typeof args[1] === "string") {
      return props?.tsExperimental?.call(undefined, ...args);
    }
    if (!args[0] && args[1] && typeof args[1] === "object") {
      return props?.ecma?.call(undefined, ...args);
    }
  }) as unknown as UniversalClassFieldDecorator;
}
