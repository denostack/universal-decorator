import { assertEquals } from "@std/assert/equals";
import { defineMetadataDecorator, getMetadata } from "./metadata.ts";

Deno.test("defineMetadataDecorator with typescript experimental decorator", () => {
  class TestClass {
    static staticField?: string;
    static staticMethod() {}
    instanceField?: string;
    instanceMethod() {}
  }

  defineMetadataDecorator("class", { name: "ts class" })(TestClass);
  defineMetadataDecorator("instanceField", { name: "ts instance field" })(TestClass.prototype, "instanceField");
  defineMetadataDecorator("instanceMethod", { name: "ts instance method" })(
    TestClass.prototype,
    "instanceMethod",
    {
      configurable: true,
      enumerable: false,
      value: TestClass.prototype.instanceMethod,
      writable: true,
    },
  );
  defineMetadataDecorator("staticField", { name: "ts static field" })(TestClass, "staticField");
  defineMetadataDecorator("staticMethod", { name: "ts static method" })(TestClass, "staticMethod", {
    configurable: true,
    enumerable: false,
    value: TestClass.staticMethod,
    writable: true,
  });

  assertEquals(getMetadata("class", TestClass), { name: "ts class" });
  assertEquals(getMetadata("instanceField", TestClass, { static: false, name: "instanceField" }), {
    name: "ts instance field",
  });
  assertEquals(getMetadata("instanceMethod", TestClass, { static: false, name: "instanceMethod" }), {
    name: "ts instance method",
  });
  assertEquals(getMetadata("staticField", TestClass, { static: true, name: "staticField" }), {
    name: "ts static field",
  });
  assertEquals(getMetadata("staticMethod", TestClass, { static: true, name: "staticMethod" }), {
    name: "ts static method",
  });
});

Deno.test("defineMetadataDecorator with ecma decorator", () => {
  @defineMetadataDecorator("class", { name: "ecma class" })
  class TestClass {
    @defineMetadataDecorator("staticField", { name: "ecma static field" })
    static staticField?: string;
    @defineMetadataDecorator("staticMethod", { name: "ecma static method" })
    static staticMethod() {}
    @defineMetadataDecorator("instanceField", { name: "ecma instance field" })
    instanceField?: string;
    @defineMetadataDecorator("instanceMethod", { name: "ecma instance method" })
    instanceMethod() {}
  }

  assertEquals(getMetadata("class", TestClass), { name: "ecma class" });
  assertEquals(getMetadata("instanceField", TestClass, { static: false, name: "instanceField" }), {
    name: "ecma instance field",
  });
  assertEquals(getMetadata("instanceMethod", TestClass, { static: false, name: "instanceMethod" }), {
    name: "ecma instance method",
  });
  assertEquals(getMetadata("staticField", TestClass, { static: true, name: "staticField" }), {
    name: "ecma static field",
  });
  assertEquals(getMetadata("staticMethod", TestClass, { static: true, name: "staticMethod" }), {
    name: "ecma static method",
  });
});
