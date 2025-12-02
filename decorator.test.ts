import { assertEquals, assertStrictEquals } from "@std/assert";
import { expect } from "@std/expect";
import { defineDecorator } from "./decorator.ts";

Deno.test("defineDecorator, class with typescript experimental decorator", () => {
  const spyEcma = [] as unknown[][];
  const spyTsExperimental = [] as unknown[][];

  const classDecorator = defineDecorator({
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
  }
  classDecorator(TestClass);

  assertEquals(spyEcma.length, 0);

  assertEquals(spyTsExperimental.length, 1);
  assertEquals(spyTsExperimental[0].length, 1);
  assertStrictEquals(spyTsExperimental[0][0], TestClass);
});

Deno.test("defineDecorator, class with ecma decorator", () => {
  const spyEcma = [] as unknown[][];
  const spyTsExperimental = [] as unknown[][];

  const classDecorator = defineDecorator({
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

Deno.test("defineDecorator, instance field with typescript experimental decorator", () => {
  const spyEcma = [] as unknown[][];
  const spyTsExperimental = [] as unknown[][];

  const classFieldDecorator = defineDecorator({
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
  classFieldDecorator(TestClass.prototype, "instanceField", undefined);

  assertEquals(spyEcma.length, 0);
  assertEquals(spyTsExperimental.length, 1);
  assertEquals(spyTsExperimental[0].length, 3);
  assertStrictEquals(spyTsExperimental[0][0], TestClass.prototype);
  assertStrictEquals(spyTsExperimental[0][1], "instanceField");
  assertStrictEquals(spyTsExperimental[0][2], undefined);
});

Deno.test("defineDecorator, instance field with ecma decorator", () => {
  const spyEcma = [] as unknown[][];
  const spyTsExperimental = [] as unknown[][];

  const classFieldDecorator = defineDecorator({
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

Deno.test("defineDecorator, static field with typescript experimental decorator", () => {
  const spyEcma = [] as unknown[][];
  const spyTsExperimental = [] as unknown[][];

  const classFieldDecorator = defineDecorator({
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
  classFieldDecorator(TestClass, "staticField", undefined);

  assertEquals(spyEcma.length, 0);
  assertEquals(spyTsExperimental.length, 1);
  assertEquals(spyTsExperimental[0].length, 3);
  assertStrictEquals(spyTsExperimental[0][0], TestClass);
  assertStrictEquals(spyTsExperimental[0][1], "staticField");
  assertStrictEquals(spyTsExperimental[0][2], undefined);
});

Deno.test("defineDecorator, static field with ecma decorator", () => {
  const spyEcma = [] as unknown[][];
  const spyTsExperimental = [] as unknown[][];

  const classFieldDecorator = defineDecorator({
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

Deno.test("defineDecorator, instance method with typescript experimental decorator", () => {
  const spyEcma = [] as unknown[][];
  const spyTsExperimental = [] as unknown[][];

  const classMethodDecorator = defineDecorator({
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
    instanceMethod() {}
  }
  classMethodDecorator(TestClass.prototype, "instanceMethod", {
    configurable: true,
    enumerable: false,
    value: TestClass.prototype.instanceMethod,
    writable: true,
  });

  assertEquals(spyEcma.length, 0);
  assertEquals(spyTsExperimental.length, 1);
  assertEquals(spyTsExperimental[0].length, 3);
  assertStrictEquals(spyTsExperimental[0][0], TestClass.prototype);
  assertStrictEquals(spyTsExperimental[0][1], "instanceMethod");
  assertEquals(spyTsExperimental[0][2], {
    configurable: true,
    enumerable: false,
    value: TestClass.prototype.instanceMethod,
    writable: true,
  });
});

Deno.test("defineDecorator, instance method with ecma decorator", () => {
  const spyEcma = [] as unknown[][];
  const spyTsExperimental = [] as unknown[][];

  const classMethodDecorator = defineDecorator({
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
    instanceMethod() {}
  }

  assertEquals(spyEcma.length, 1);
  assertEquals(spyEcma[0].length, 2);
  assertStrictEquals(spyEcma[0][0], TestClass.prototype.instanceMethod);
  expect(spyEcma[0][1]).toEqual({
    kind: "method",
    name: "instanceMethod",
    static: false,
    private: false,
    metadata: Object.create(null),
    addInitializer: expect.any(Function),
    access: { get: expect.any(Function) },
  });

  assertEquals(spyTsExperimental.length, 0);
});

Deno.test("defineDecorator, static method with typescript experimental decorator", () => {
  const spyEcma = [] as unknown[][];
  const spyTsExperimental = [] as unknown[][];

  const classMethodDecorator = defineDecorator({
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
    static staticMethod() {}
  }
  classMethodDecorator(TestClass, "staticMethod", {
    configurable: true,
    enumerable: false,
    value: TestClass.staticMethod,
    writable: true,
  });

  assertEquals(spyEcma.length, 0);
  assertEquals(spyTsExperimental.length, 1);
  assertEquals(spyTsExperimental[0].length, 3);
  assertStrictEquals(spyTsExperimental[0][0], TestClass);
  assertStrictEquals(spyTsExperimental[0][1], "staticMethod");
  assertEquals(spyTsExperimental[0][2], {
    configurable: true,
    enumerable: false,
    value: TestClass.staticMethod,
    writable: true,
  });
});

Deno.test("defineDecorator, static method with ecma decorator", () => {
  const spyEcma = [] as unknown[][];
  const spyTsExperimental = [] as unknown[][];

  const classMethodDecorator = defineDecorator({
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
    static staticMethod() {}
  }

  assertEquals(spyEcma.length, 1);
  assertEquals(spyEcma[0].length, 2);
  assertStrictEquals(spyEcma[0][0], TestClass.staticMethod);
  expect(spyEcma[0][1]).toEqual({
    kind: "method",
    name: "staticMethod",
    static: true,
    private: false,
    metadata: Object.create(null),
    addInitializer: expect.any(Function),
    access: { get: expect.any(Function) },
  });

  assertEquals(spyTsExperimental.length, 0);
});
