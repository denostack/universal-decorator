import { assertEquals, assertStrictEquals } from "@std/assert";
import { expect } from "@std/expect";
import { createClassMethodDecorator } from "./class_method_decorator.ts";

Deno.test("createClassMethodDecorator with typescript experimental decorator", () => {
  const spyEcma = [] as unknown[][];
  const spyTsExperimental = [] as unknown[][];

  const classMethodDecorator = createClassMethodDecorator({
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
    bar() {}
  }
  classMethodDecorator.call(undefined, TestClass.prototype, "bar", {
    configurable: true,
    enumerable: false,
    value: TestClass.prototype.bar,
    writable: true,
  });

  assertEquals(spyEcma.length, 0);
  assertEquals(spyTsExperimental.length, 1);
  assertEquals(spyTsExperimental[0].length, 3);
  assertStrictEquals(spyTsExperimental[0][0], TestClass.prototype);
  assertStrictEquals(spyTsExperimental[0][1], "bar");
  assertEquals(spyTsExperimental[0][2], {
    configurable: true,
    enumerable: false,
    value: TestClass.prototype.bar,
    writable: true,
  });
});

Deno.test("createClassMethodDecorator with ecma decorator", () => {
  const spyEcma = [] as unknown[][];
  const spyTsExperimental = [] as unknown[][];

  const classMethodDecorator = createClassMethodDecorator({
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
    @classMethodDecorator
    bar() {}
  }

  assertEquals(spyEcma.length, 1);
  assertEquals(spyEcma[0].length, 2);
  assertStrictEquals(spyEcma[0][0], TestClass.prototype.bar);
  expect(spyEcma[0][1]).toEqual({
    kind: "method",
    name: "bar",
    static: false,
    private: false,
    metadata: Object.create(null),
    addInitializer: expect.any(Function),
    access: { get: expect.any(Function) },
  });

  assertEquals(spyTsExperimental.length, 0);
});

Deno.test("createClassMethodDecorator static with typescript experimental decorator", () => {
  const spyEcma = [] as unknown[][];
  const spyTsExperimental = [] as unknown[][];

  const classMethodDecorator = createClassMethodDecorator({
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
    static bar() {}
  }
  classMethodDecorator.call(undefined, TestClass, "bar", {
    configurable: true,
    enumerable: false,
    value: TestClass.bar,
    writable: true,
  });

  assertEquals(spyEcma.length, 0);
  assertEquals(spyTsExperimental.length, 1);
  assertEquals(spyTsExperimental[0].length, 3);
  assertStrictEquals(spyTsExperimental[0][0], TestClass);
  assertStrictEquals(spyTsExperimental[0][1], "bar");
  assertEquals(spyTsExperimental[0][2], {
    configurable: true,
    enumerable: false,
    value: TestClass.bar,
    writable: true,
  });
});

Deno.test("createClassMethodDecorator static with ecma decorator", () => {
  const spyEcma = [] as unknown[][];
  const spyTsExperimental = [] as unknown[][];

  const classMethodDecorator = createClassMethodDecorator({
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
    @classMethodDecorator
    static bar() {}
  }

  assertEquals(spyEcma.length, 1);
  assertEquals(spyEcma[0].length, 2);
  assertStrictEquals(spyEcma[0][0], TestClass.bar);
  expect(spyEcma[0][1]).toEqual({
    kind: "method",
    name: "bar",
    static: true,
    private: false,
    metadata: Object.create(null),
    addInitializer: expect.any(Function),
    access: { get: expect.any(Function) },
  });

  assertEquals(spyTsExperimental.length, 0);
});
