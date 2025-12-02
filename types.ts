// deno-lint-ignore-file ban-types no-explicit-any

export type ProposalClassDecorator = <TFunction extends Function>(
  target: TFunction,
  ctx: ClassDecoratorContext,
) => any;
export type UniversalClassDecorator =
  & ProposalClassDecorator
  & ClassDecorator;

export type ProposalClassFieldDecorator = (
  _: undefined,
  ctx: ClassFieldDecoratorContext,
) => any;
export type UniversalClassFieldDecorator =
  & ProposalClassFieldDecorator
  & PropertyDecorator;

export type ProposalClassMethodDecorator = (
  target: Function,
  ctx: ClassMethodDecoratorContext,
) => any;
export type UniversalClassMethodDecorator =
  & ProposalClassMethodDecorator
  & MethodDecorator;
