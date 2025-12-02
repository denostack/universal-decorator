// deno-lint-ignore-file no-explicit-any

import { assertEquals, assertStrictEquals } from "@std/assert";
import { expect } from "@std/expect";
import { createClassFieldDecorator } from "./class_field_decorator.ts";

Deno.test("createClassFieldDecorator with typescript experimental decorator", () => {
  const spyEcma = [] as unknown[][];
  const spyTsExperimental = [] as unknown[][];

  const classFieldDecorator = createClassFieldDecorator({
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
    instanceField?: string;
  }
  (classFieldDecorator as any).call(
    undefined,
    TestClass.prototype,
    "instanceField",
    undefined,
  );

  assertEquals(spyEcma.length, 0);
  assertEquals(spyTsExperimental.length, 1);
  assertEquals(spyTsExperimental[0].length, 3);
  assertStrictEquals(spyTsExperimental[0][0], TestClass.prototype);
  assertStrictEquals(spyTsExperimental[0][1], "instanceField");
  assertStrictEquals(spyTsExperimental[0][2], undefined);
});

Deno.test("createClassFieldDecorator with ecma decorator", () => {
  const spyEcma = [] as unknown[][];
  const spyTsExperimental = [] as unknown[][];

  const classFieldDecorator = createClassFieldDecorator({
    ecma(...args) {
      spyEcma.push(args);
    },
    tsExperimental(...args) {
      spyTsExperimental.push(args);
    },
  });

  assertEquals(spyEcma.length, 0);
  assertEquals(spyTsExperimental.length, 0);

  class _TestClass {
    @classFieldDecorator
    instanceField?: string;
  }

  assertEquals(spyEcma.length, 1);
  assertEquals(spyEcma[0].length, 2);
  assertStrictEquals(spyEcma[0][0], undefined);
  expect(spyEcma[0][1]).toEqual({
    kind: "field",
    name: "instanceField",
    static: false,
    private: false,
    metadata: Object.create(null),
    addInitializer: expect.any(Function),
    access: { get: expect.any(Function), set: expect.any(Function) },
  });

  assertEquals(spyTsExperimental.length, 0);
});

Deno.test("createClassFieldDecorator static with typescript experimental decorator", () => {
  const spyEcma = [] as unknown[][];
  const spyTsExperimental = [] as unknown[][];

  const classFieldDecorator = createClassFieldDecorator({
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
    static staticField: string;
  }
  (classFieldDecorator as any).call(
    undefined,
    TestClass,
    "staticField",
    undefined,
  );

  assertEquals(spyEcma.length, 0);
  assertEquals(spyTsExperimental.length, 1);
  assertEquals(spyTsExperimental[0].length, 3);
  assertStrictEquals(spyTsExperimental[0][0], TestClass);
  assertStrictEquals(spyTsExperimental[0][1], "staticField");
  assertStrictEquals(spyTsExperimental[0][2], undefined);
});

Deno.test("createClassFieldDecorator static with ecma decorator", () => {
  const spyEcma = [] as unknown[][];
  const spyTsExperimental = [] as unknown[][];

  const classFieldDecorator = createClassFieldDecorator({
    ecma(...args) {
      spyEcma.push(args);
    },
    tsExperimental(...args) {
      spyTsExperimental.push(args);
    },
  });

  assertEquals(spyEcma.length, 0);
  assertEquals(spyTsExperimental.length, 0);

  class _TestClass {
    @classFieldDecorator
    static staticField: string;
  }

  assertEquals(spyEcma.length, 1);
  assertEquals(spyEcma[0].length, 2);
  assertStrictEquals(spyEcma[0][0], undefined);
  expect(spyEcma[0][1]).toEqual({
    kind: "field",
    name: "staticField",
    static: true,
    private: false,
    metadata: Object.create(null),
    addInitializer: expect.any(Function),
    access: { get: expect.any(Function), set: expect.any(Function) },
  });

  assertEquals(spyTsExperimental.length, 0);
});
