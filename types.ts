// deno-lint-ignore-file ban-types

export type ProposalClassDecorator = <TFunction extends Function>(
  target: TFunction,
  ctx: ClassDecoratorContext,
) => void;
export type UniversalClassDecorator =
  & ProposalClassDecorator
  & ClassDecorator;

export type ProposalClassFieldDecorator = (
  _: undefined,
  ctx: ClassFieldDecoratorContext,
) => void;
export type UniversalClassFieldDecorator =
  & ProposalClassFieldDecorator
  & PropertyDecorator;
