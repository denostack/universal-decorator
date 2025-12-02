// deno-lint-ignore-file ban-types no-explicit-any

export type EcmaDecoratorContext = ClassDecoratorContext | ClassFieldDecoratorContext | ClassMethodDecoratorContext;

export interface LegacyDecorator {
  (target: Object, propertyKey?: string | symbol, descriptor?: PropertyDescriptor | undefined): any;
}

export interface EcmaDecorator {
  (target: Function | undefined, ctx: EcmaDecoratorContext): any;
}

export interface UniversalDecorator {
  (target: Object, propertyKey?: string | symbol, descriptor?: PropertyDescriptor | undefined): any;
  (target: Function | undefined, ctx: EcmaDecoratorContext): any;
}
