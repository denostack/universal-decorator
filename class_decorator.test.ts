import { assertEquals, assertStrictEquals } from "@std/assert";
import { expect } from "@std/expect";
import { createClassDecorator } from "./class_decorator.ts";

Deno.test("createClassDecorator with typescript experimental decorator", () => {
  const spyEcma = [] as unknown[][];
  const spyTsExperimental = [] as unknown[][];

  const classDecorator = createClassDecorator({
    ecma(...args) {
      spyEcma.push(args);
    },
    tsExperimental(...args) {
      spyTsExperimental.push(args);
    },
  });

  assertEquals(spyEcma.length, 0);
  assertEquals(spyTsExperimental.length, 0);

  class TestClass {
    foo: string;
  }
  classDecorator.call(undefined, TestClass);

  assertEquals(spyEcma.length, 0);

  assertEquals(spyTsExperimental.length, 1);
  assertEquals(spyTsExperimental[0].length, 1);
  assertStrictEquals(spyTsExperimental[0][0], TestClass);
});

Deno.test("createClassDecorator with ecma decorator", () => {
  const spyEcma = [] as unknown[][];
  const spyTsExperimental = [] as unknown[][];

  const classDecorator = createClassDecorator({
    ecma(...args) {
      spyEcma.push(args);
    },
    tsExperimental(...args) {
      spyTsExperimental.push(args);
    },
  });

  assertEquals(spyEcma.length, 0);
  assertEquals(spyTsExperimental.length, 0);

  @classDecorator
  class TestClass {
    foo: string;
  }

  assertEquals(spyEcma.length, 1);
  assertEquals(spyEcma[0].length, 2);
  assertStrictEquals(spyEcma[0][0], TestClass);
  expect(spyEcma[0][1]).toEqual({
    kind: "class",
    name: "TestClass",
    metadata: Object.create(null),
    addInitializer: expect.any(Function),
  });

  assertEquals(spyTsExperimental.length, 0);
});
