import { assertEquals } from "@std/assert/equals";
import {
  defineMetadataDecorator,
  getMetadata,
  getMetadataKeys,
  getOwnMetadata,
  getOwnMetadataKeys,
  hasMetadata,
  hasOwnMetadata,
} from "./metadata.ts";

Deno.test("defineMetadataDecorator with typescript experimental decorator", () => {
  class TestClass {
    static staticField: string;
    static staticMethod() {}
    instanceField!: string;
    instanceMethod() {}
  }

  defineMetadataDecorator("class", { name: "ts class" })(TestClass);
  defineMetadataDecorator("staticField", { name: "ts static field" })(TestClass, "staticField");
  defineMetadataDecorator("staticMethod", { name: "ts static method" })(TestClass, "staticMethod", {
    configurable: true,
    enumerable: false,
    value: TestClass.staticMethod,
    writable: true,
  });
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

  // getMetadataKeys
  assertEquals(getMetadataKeys(TestClass), ["class"]);
  assertEquals(getMetadataKeys(TestClass, { static: false, name: "instanceField" }), ["instanceField"]);
  assertEquals(getMetadataKeys(TestClass, { static: true, name: "staticField" }), ["staticField"]);
  assertEquals(getMetadataKeys(TestClass, { static: true, name: "staticMethod" }), ["staticMethod"]);
  assertEquals(getMetadataKeys(TestClass, { static: false, name: "instanceMethod" }), ["instanceMethod"]);

  // hasMetadata
  assertEquals(hasMetadata("class", TestClass), true);
  assertEquals(hasMetadata("instanceField", TestClass, { static: false, name: "instanceField" }), true);
  assertEquals(hasMetadata("instanceMethod", TestClass, { static: false, name: "instanceMethod" }), true);
  assertEquals(hasMetadata("staticField", TestClass, { static: true, name: "staticField" }), true);
  assertEquals(hasMetadata("staticMethod", TestClass, { static: true, name: "staticMethod" }), true);

  assertEquals(hasMetadata("unknown", TestClass), false);

  // getMetadata
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
    static staticField: string;
    @defineMetadataDecorator("staticMethod", { name: "ecma static method" })
    static staticMethod() {}
    @defineMetadataDecorator("instanceField", { name: "ecma instance field" })
    instanceField!: string;
    @defineMetadataDecorator("instanceMethod", { name: "ecma instance method" })
    instanceMethod() {}
  }

  // getMetadataKeys
  assertEquals(getMetadataKeys(TestClass), ["class"]);
  assertEquals(getMetadataKeys(TestClass, { static: false, name: "instanceField" }), ["instanceField"]);
  assertEquals(getMetadataKeys(TestClass, { static: true, name: "staticField" }), ["staticField"]);
  assertEquals(getMetadataKeys(TestClass, { static: true, name: "staticMethod" }), ["staticMethod"]);
  assertEquals(getMetadataKeys(TestClass, { static: false, name: "instanceMethod" }), ["instanceMethod"]);

  // hasMetadata
  assertEquals(hasMetadata("class", TestClass), true);
  assertEquals(hasMetadata("instanceField", TestClass, { static: false, name: "instanceField" }), true);
  assertEquals(hasMetadata("instanceMethod", TestClass, { static: false, name: "instanceMethod" }), true);
  assertEquals(hasMetadata("staticField", TestClass, { static: true, name: "staticField" }), true);
  assertEquals(hasMetadata("staticMethod", TestClass, { static: true, name: "staticMethod" }), true);

  assertEquals(hasMetadata("unknown", TestClass), false);

  // getMetadata
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

Deno.test("defineMetadataDecorator, inherit with typescript experimental decorator", () => {
  class TestClass1 {
    static staticField: string;
    static staticMethod() {}
    instanceField: string = "";
    instanceMethod() {}
  }

  defineMetadataDecorator("class", { name: "TestClass1" })(TestClass1);
  defineMetadataDecorator("class1", { name: "TestClass1 only" })(TestClass1);
  defineMetadataDecorator("staticField", { name: "Test1 static field" })(TestClass1, "staticField");
  defineMetadataDecorator("staticField1", { name: "Test1 static field only" })(TestClass1, "staticField");
  defineMetadataDecorator("staticMethod", { name: "Test1 static method" })(TestClass1, "staticMethod");
  defineMetadataDecorator("staticMethod1", { name: "Test1 static method only" })(TestClass1, "staticMethod");
  defineMetadataDecorator("instanceField", { name: "Test1 instance field" })(TestClass1.prototype, "instanceField");
  defineMetadataDecorator("instanceField1", { name: "Test1 instance field only" })(
    TestClass1.prototype,
    "instanceField",
  );
  defineMetadataDecorator("instanceMethod", { name: "Test1 instance method" })(TestClass1.prototype, "instanceMethod");
  defineMetadataDecorator("instanceMethod1", { name: "Test1 instance method only" })(
    TestClass1.prototype,
    "instanceMethod",
  );

  class TestClass2 extends TestClass1 {
    static override staticField: string;
    static override staticMethod() {}
    override instanceField: string = "";
    override instanceMethod() {}
  }

  defineMetadataDecorator("class", (value) => ({ ...(value as Record<string, string>), extended: true }))(TestClass2);
  defineMetadataDecorator("class2", { name: "TestClass2 only" })(TestClass2);
  defineMetadataDecorator("staticField", (value) => ({ ...(value as Record<string, string>), extended: true }))(
    TestClass2,
    "staticField",
  );
  defineMetadataDecorator("staticField2", { name: "Test2 static field only" })(TestClass2, "staticField");
  defineMetadataDecorator("staticMethod", (value) => ({ ...(value as Record<string, string>), extended: true }))(
    TestClass2,
    "staticMethod",
  );
  defineMetadataDecorator("staticMethod2", { name: "Test2 static method only" })(TestClass2, "staticMethod");
  defineMetadataDecorator("instanceField", (value) => ({ ...(value as Record<string, string>), extended: true }))(
    TestClass2.prototype,
    "instanceField",
  );
  defineMetadataDecorator("instanceField2", { name: "Test2 instance field only" })(
    TestClass2.prototype,
    "instanceField",
  );
  defineMetadataDecorator("instanceMethod", (value) => ({ ...(value as Record<string, string>), extended: true }))(
    TestClass2.prototype,
    "instanceMethod",
  );
  defineMetadataDecorator("instanceMethod2", { name: "Test2 instance method only" })(
    TestClass2.prototype,
    "instanceMethod",
  );

  // getMetadataKeys
  assertEquals(getMetadataKeys(TestClass1), ["class", "class1"]);
  assertEquals(getMetadataKeys(TestClass1, { static: false, name: "instanceField" }), [
    "instanceField",
    "instanceField1",
  ]);
  assertEquals(getMetadataKeys(TestClass1, { static: true, name: "staticField" }), ["staticField", "staticField1"]);
  assertEquals(getMetadataKeys(TestClass1, { static: true, name: "staticMethod" }), ["staticMethod", "staticMethod1"]);
  assertEquals(getMetadataKeys(TestClass1, { static: false, name: "instanceMethod" }), [
    "instanceMethod",
    "instanceMethod1",
  ]);

  assertEquals(getMetadataKeys(TestClass2), ["class", "class2", "class1"]);
  assertEquals(getMetadataKeys(TestClass2, { static: false, name: "instanceField" }), [
    "instanceField",
    "instanceField2",
    "instanceField1",
  ]);
  assertEquals(getMetadataKeys(TestClass2, { static: true, name: "staticField" }), [
    "staticField",
    "staticField2",
    "staticField1",
  ]);
  assertEquals(getMetadataKeys(TestClass2, { static: true, name: "staticMethod" }), [
    "staticMethod",
    "staticMethod2",
    "staticMethod1",
  ]);
  assertEquals(getMetadataKeys(TestClass2, { static: false, name: "instanceMethod" }), [
    "instanceMethod",
    "instanceMethod2",
    "instanceMethod1",
  ]);

  // getOwnMetadataKeys
  assertEquals(getOwnMetadataKeys(TestClass1), ["class", "class1"]);
  assertEquals(getOwnMetadataKeys(TestClass1, { static: false, name: "instanceField" }), [
    "instanceField",
    "instanceField1",
  ]);
  assertEquals(getOwnMetadataKeys(TestClass1, { static: true, name: "staticField" }), ["staticField", "staticField1"]);
  assertEquals(getOwnMetadataKeys(TestClass1, { static: true, name: "staticMethod" }), [
    "staticMethod",
    "staticMethod1",
  ]);
  assertEquals(getOwnMetadataKeys(TestClass1, { static: false, name: "instanceMethod" }), [
    "instanceMethod",
    "instanceMethod1",
  ]);

  assertEquals(getOwnMetadataKeys(TestClass2), ["class", "class2"]);
  assertEquals(getOwnMetadataKeys(TestClass2, { static: false, name: "instanceField" }), [
    "instanceField",
    "instanceField2",
  ]);
  assertEquals(getOwnMetadataKeys(TestClass2, { static: true, name: "staticField" }), [
    "staticField",
    "staticField2",
  ]);
  assertEquals(getOwnMetadataKeys(TestClass2, { static: true, name: "staticMethod" }), [
    "staticMethod",
    "staticMethod2",
  ]);
  assertEquals(getOwnMetadataKeys(TestClass2, { static: false, name: "instanceMethod" }), [
    "instanceMethod",
    "instanceMethod2",
  ]);

  // hasMetadata
  assertEquals(hasMetadata("class", TestClass1), true);
  assertEquals(hasMetadata("class1", TestClass1), true);
  assertEquals(hasMetadata("class2", TestClass1), false);

  assertEquals(hasMetadata("class", TestClass2), true);
  assertEquals(hasMetadata("class1", TestClass2), true);
  assertEquals(hasMetadata("class2", TestClass2), true);

  // hasOwnMetadata
  assertEquals(hasOwnMetadata("class", TestClass1), true);
  assertEquals(hasOwnMetadata("class1", TestClass1), true);
  assertEquals(hasOwnMetadata("class2", TestClass1), false);

  assertEquals(hasOwnMetadata("class", TestClass2), true);
  assertEquals(hasOwnMetadata("class1", TestClass2), false);
  assertEquals(hasOwnMetadata("class2", TestClass2), true);

  // getMetadata
  assertEquals(getMetadata("class", TestClass1), { name: "TestClass1" });
  assertEquals(getMetadata("class", TestClass2), { name: "TestClass1", extended: true });

  assertEquals(getMetadata("class1", TestClass1), { name: "TestClass1 only" });
  assertEquals(getMetadata("class1", TestClass2), { name: "TestClass1 only" }); // inherit

  assertEquals(getMetadata("class2", TestClass1), undefined);
  assertEquals(getMetadata("class2", TestClass2), { name: "TestClass2 only" });

  assertEquals(getMetadata("staticField", TestClass1, { static: true, name: "staticField" }), {
    name: "Test1 static field",
  });
  assertEquals(getMetadata("staticField", TestClass2, { static: true, name: "staticField" }), {
    name: "Test1 static field",
    extended: true,
  });

  assertEquals(getMetadata("staticField1", TestClass1, { static: true, name: "staticField" }), {
    name: "Test1 static field only",
  });
  assertEquals(getMetadata("staticField1", TestClass2, { static: true, name: "staticField" }), {
    name: "Test1 static field only",
  });

  assertEquals(getMetadata("staticField2", TestClass1, { static: true, name: "staticField" }), undefined);
  assertEquals(getMetadata("staticField2", TestClass2, { static: true, name: "staticField" }), {
    name: "Test2 static field only",
  });

  assertEquals(getMetadata("staticMethod", TestClass1, { static: true, name: "staticMethod" }), {
    name: "Test1 static method",
  });
  assertEquals(getMetadata("staticMethod", TestClass2, { static: true, name: "staticMethod" }), {
    name: "Test1 static method",
    extended: true,
  });

  assertEquals(getMetadata("staticMethod1", TestClass1, { static: true, name: "staticMethod" }), {
    name: "Test1 static method only",
  });
  assertEquals(getMetadata("staticMethod1", TestClass2, { static: true, name: "staticMethod" }), {
    name: "Test1 static method only",
  });

  assertEquals(getMetadata("staticMethod2", TestClass1, { static: true, name: "staticMethod" }), undefined);
  assertEquals(getMetadata("staticMethod2", TestClass2, { static: true, name: "staticMethod" }), {
    name: "Test2 static method only",
  });

  assertEquals(getMetadata("instanceField", TestClass1, { static: false, name: "instanceField" }), {
    name: "Test1 instance field",
  });
  assertEquals(getMetadata("instanceField", TestClass2, { static: false, name: "instanceField" }), {
    name: "Test1 instance field",
    extended: true,
  });

  assertEquals(getMetadata("instanceField1", TestClass1, { static: false, name: "instanceField" }), {
    name: "Test1 instance field only",
  });
  assertEquals(getMetadata("instanceField1", TestClass2, { static: false, name: "instanceField" }), {
    name: "Test1 instance field only",
  });

  assertEquals(getMetadata("instanceField2", TestClass1, { static: false, name: "instanceField" }), undefined);
  assertEquals(getMetadata("instanceField2", TestClass2, { static: false, name: "instanceField" }), {
    name: "Test2 instance field only",
  });

  assertEquals(getMetadata("instanceMethod", TestClass1, { static: false, name: "instanceMethod" }), {
    name: "Test1 instance method",
  });
  assertEquals(getMetadata("instanceMethod", TestClass2, { static: false, name: "instanceMethod" }), {
    name: "Test1 instance method",
    extended: true,
  });

  assertEquals(getMetadata("instanceMethod1", TestClass1, { static: false, name: "instanceMethod" }), {
    name: "Test1 instance method only",
  });
  assertEquals(getMetadata("instanceMethod1", TestClass2, { static: false, name: "instanceMethod" }), {
    name: "Test1 instance method only",
  });

  assertEquals(getMetadata("instanceMethod2", TestClass1, { static: false, name: "instanceMethod" }), undefined);
  assertEquals(getMetadata("instanceMethod2", TestClass2, { static: false, name: "instanceMethod" }), {
    name: "Test2 instance method only",
  });

  // getOwnMetadata
  assertEquals(getOwnMetadata("class", TestClass1), { name: "TestClass1" });
  assertEquals(getOwnMetadata("class", TestClass2), { name: "TestClass1", extended: true });

  assertEquals(getOwnMetadata("class1", TestClass1), { name: "TestClass1 only" });
  assertEquals(getOwnMetadata("class1", TestClass2), undefined);

  assertEquals(getOwnMetadata("class2", TestClass1), undefined);
  assertEquals(getOwnMetadata("class2", TestClass2), { name: "TestClass2 only" });

  assertEquals(getOwnMetadata("staticField", TestClass1, { static: true, name: "staticField" }), {
    name: "Test1 static field",
  });
  assertEquals(getOwnMetadata("staticField", TestClass2, { static: true, name: "staticField" }), {
    name: "Test1 static field",
    extended: true,
  });

  assertEquals(getOwnMetadata("staticField1", TestClass1, { static: true, name: "staticField" }), {
    name: "Test1 static field only",
  });
  assertEquals(getOwnMetadata("staticField1", TestClass2, { static: true, name: "staticField" }), undefined);

  assertEquals(getOwnMetadata("staticField2", TestClass1, { static: true, name: "staticField" }), undefined);
  assertEquals(getOwnMetadata("staticField2", TestClass2, { static: true, name: "staticField" }), {
    name: "Test2 static field only",
  });

  assertEquals(getOwnMetadata("staticMethod", TestClass1, { static: true, name: "staticMethod" }), {
    name: "Test1 static method",
  });
  assertEquals(getOwnMetadata("staticMethod", TestClass2, { static: true, name: "staticMethod" }), {
    name: "Test1 static method",
    extended: true,
  });

  assertEquals(getOwnMetadata("staticMethod1", TestClass1, { static: true, name: "staticMethod" }), {
    name: "Test1 static method only",
  });
  assertEquals(getOwnMetadata("staticMethod1", TestClass2, { static: true, name: "staticMethod" }), undefined);

  assertEquals(getOwnMetadata("staticMethod2", TestClass1, { static: true, name: "staticMethod" }), undefined);
  assertEquals(getOwnMetadata("staticMethod2", TestClass2, { static: true, name: "staticMethod" }), {
    name: "Test2 static method only",
  });

  assertEquals(getOwnMetadata("instanceField", TestClass1, { static: false, name: "instanceField" }), {
    name: "Test1 instance field",
  });
  assertEquals(getOwnMetadata("instanceField", TestClass2, { static: false, name: "instanceField" }), {
    name: "Test1 instance field",
    extended: true,
  });

  assertEquals(getOwnMetadata("instanceField1", TestClass1, { static: false, name: "instanceField" }), {
    name: "Test1 instance field only",
  });
  assertEquals(getOwnMetadata("instanceField1", TestClass2, { static: false, name: "instanceField" }), undefined);

  assertEquals(getOwnMetadata("instanceField2", TestClass1, { static: false, name: "instanceField" }), undefined);
  assertEquals(getOwnMetadata("instanceField2", TestClass2, { static: false, name: "instanceField" }), {
    name: "Test2 instance field only",
  });

  assertEquals(getOwnMetadata("instanceMethod", TestClass1, { static: false, name: "instanceMethod" }), {
    name: "Test1 instance method",
  });
  assertEquals(getOwnMetadata("instanceMethod", TestClass2, { static: false, name: "instanceMethod" }), {
    name: "Test1 instance method",
    extended: true,
  });

  assertEquals(getOwnMetadata("instanceMethod1", TestClass1, { static: false, name: "instanceMethod" }), {
    name: "Test1 instance method only",
  });
  assertEquals(getOwnMetadata("instanceMethod1", TestClass2, { static: false, name: "instanceMethod" }), undefined);

  assertEquals(getOwnMetadata("instanceMethod2", TestClass1, { static: false, name: "instanceMethod" }), undefined);
  assertEquals(getOwnMetadata("instanceMethod2", TestClass2, { static: false, name: "instanceMethod" }), {
    name: "Test2 instance method only",
  });
});

Deno.test("defineMetadataDecorator, inherit with ecma decorator", () => {
  @defineMetadataDecorator("class", { name: "TestClass1" })
  @defineMetadataDecorator("class1", { name: "TestClass1 only" })
  class TestClass1 {
    @defineMetadataDecorator("staticField", { name: "Test1 static field" })
    @defineMetadataDecorator("staticField1", { name: "Test1 static field only" })
    static staticField: string;
    @defineMetadataDecorator("staticMethod", { name: "Test1 static method" })
    @defineMetadataDecorator("staticMethod1", { name: "Test1 static method only" })
    static staticMethod() {}
    @defineMetadataDecorator("instanceField", { name: "Test1 instance field" })
    @defineMetadataDecorator("instanceField1", { name: "Test1 instance field only" })
    instanceField: string = "";
    @defineMetadataDecorator("instanceMethod", { name: "Test1 instance method" })
    @defineMetadataDecorator("instanceMethod1", { name: "Test1 instance method only" })
    instanceMethod() {}
  }

  @defineMetadataDecorator("class", (value) => ({ ...(value as Record<string, string>), extended: true }))
  @defineMetadataDecorator("class2", { name: "TestClass2 only" })
  class TestClass2 extends TestClass1 {
    @defineMetadataDecorator("staticField", (value) => ({ ...(value as Record<string, string>), extended: true }))
    @defineMetadataDecorator("staticField2", { name: "Test2 static field only" })
    static override staticField: string;
    @defineMetadataDecorator("staticMethod", (value) => ({ ...(value as Record<string, string>), extended: true }))
    @defineMetadataDecorator("staticMethod2", { name: "Test2 static method only" })
    static override staticMethod() {}
    @defineMetadataDecorator("instanceField", (value) => ({ ...(value as Record<string, string>), extended: true }))
    @defineMetadataDecorator("instanceField2", { name: "Test2 instance field only" })
    override instanceField: string = "";
    @defineMetadataDecorator("instanceMethod", (value) => ({ ...(value as Record<string, string>), extended: true }))
    @defineMetadataDecorator("instanceMethod2", { name: "Test2 instance method only" })
    override instanceMethod() {}
  }

  // getMetadataKeys
  assertEquals(getMetadataKeys(TestClass1), ["class1", "class"]);
  assertEquals(getMetadataKeys(TestClass1, { static: false, name: "instanceField" }), [
    "instanceField1",
    "instanceField",
  ]);
  assertEquals(getMetadataKeys(TestClass1, { static: true, name: "staticField" }), ["staticField1", "staticField"]);
  assertEquals(getMetadataKeys(TestClass1, { static: true, name: "staticMethod" }), ["staticMethod1", "staticMethod"]);
  assertEquals(getMetadataKeys(TestClass1, { static: false, name: "instanceMethod" }), [
    "instanceMethod1",
    "instanceMethod",
  ]);

  assertEquals(getMetadataKeys(TestClass2), ["class2", "class", "class1"]);
  assertEquals(getMetadataKeys(TestClass2, { static: false, name: "instanceField" }), [
    "instanceField2",
    "instanceField",
    "instanceField1",
  ]);
  assertEquals(getMetadataKeys(TestClass2, { static: true, name: "staticField" }), [
    "staticField2",
    "staticField",
    "staticField1",
  ]);
  assertEquals(getMetadataKeys(TestClass2, { static: true, name: "staticMethod" }), [
    "staticMethod2",
    "staticMethod",
    "staticMethod1",
  ]);
  assertEquals(getMetadataKeys(TestClass2, { static: false, name: "instanceMethod" }), [
    "instanceMethod2",
    "instanceMethod",
    "instanceMethod1",
  ]);

  // getOwnMetadataKeys
  assertEquals(getOwnMetadataKeys(TestClass1), ["class1", "class"]);
  assertEquals(getOwnMetadataKeys(TestClass1, { static: false, name: "instanceField" }), [
    "instanceField1",
    "instanceField",
  ]);
  assertEquals(getOwnMetadataKeys(TestClass1, { static: true, name: "staticField" }), ["staticField1", "staticField"]);
  assertEquals(getOwnMetadataKeys(TestClass1, { static: true, name: "staticMethod" }), [
    "staticMethod1",
    "staticMethod",
  ]);
  assertEquals(getOwnMetadataKeys(TestClass1, { static: false, name: "instanceMethod" }), [
    "instanceMethod1",
    "instanceMethod",
  ]);

  assertEquals(getOwnMetadataKeys(TestClass2), ["class2", "class"]);
  assertEquals(getOwnMetadataKeys(TestClass2, { static: false, name: "instanceField" }), [
    "instanceField2",
    "instanceField",
  ]);
  assertEquals(getOwnMetadataKeys(TestClass2, { static: true, name: "staticField" }), [
    "staticField2",
    "staticField",
  ]);
  assertEquals(getOwnMetadataKeys(TestClass2, { static: true, name: "staticMethod" }), [
    "staticMethod2",
    "staticMethod",
  ]);
  assertEquals(getOwnMetadataKeys(TestClass2, { static: false, name: "instanceMethod" }), [
    "instanceMethod2",
    "instanceMethod",
  ]);

  // hasMetadata
  assertEquals(hasMetadata("class", TestClass1), true);
  assertEquals(hasMetadata("class1", TestClass1), true);
  assertEquals(hasMetadata("class2", TestClass1), false);

  assertEquals(hasMetadata("class", TestClass2), true);
  assertEquals(hasMetadata("class1", TestClass2), true);
  assertEquals(hasMetadata("class2", TestClass2), true);

  // hasOwnMetadata
  assertEquals(hasOwnMetadata("class", TestClass1), true);
  assertEquals(hasOwnMetadata("class1", TestClass1), true);
  assertEquals(hasOwnMetadata("class2", TestClass1), false);

  assertEquals(hasOwnMetadata("class", TestClass2), true);
  assertEquals(hasOwnMetadata("class1", TestClass2), false);
  assertEquals(hasOwnMetadata("class2", TestClass2), true);

  // getMetadata
  assertEquals(getMetadata("class", TestClass1), { name: "TestClass1" });
  assertEquals(getMetadata("class", TestClass2), { name: "TestClass1", extended: true });

  assertEquals(getMetadata("class1", TestClass1), { name: "TestClass1 only" });
  assertEquals(getMetadata("class1", TestClass2), { name: "TestClass1 only" }); // inherit

  assertEquals(getMetadata("class2", TestClass1), undefined);
  assertEquals(getMetadata("class2", TestClass2), { name: "TestClass2 only" });

  assertEquals(getMetadata("staticField", TestClass1, { static: true, name: "staticField" }), {
    name: "Test1 static field",
  });
  assertEquals(getMetadata("staticField", TestClass2, { static: true, name: "staticField" }), {
    name: "Test1 static field",
    extended: true,
  });

  assertEquals(getMetadata("staticField1", TestClass1, { static: true, name: "staticField" }), {
    name: "Test1 static field only",
  });
  assertEquals(getMetadata("staticField1", TestClass2, { static: true, name: "staticField" }), {
    name: "Test1 static field only",
  });

  assertEquals(getMetadata("staticField2", TestClass1, { static: true, name: "staticField" }), undefined);
  assertEquals(getMetadata("staticField2", TestClass2, { static: true, name: "staticField" }), {
    name: "Test2 static field only",
  });

  assertEquals(getMetadata("staticMethod", TestClass1, { static: true, name: "staticMethod" }), {
    name: "Test1 static method",
  });
  assertEquals(getMetadata("staticMethod", TestClass2, { static: true, name: "staticMethod" }), {
    name: "Test1 static method",
    extended: true,
  });

  assertEquals(getMetadata("staticMethod1", TestClass1, { static: true, name: "staticMethod" }), {
    name: "Test1 static method only",
  });
  assertEquals(getMetadata("staticMethod1", TestClass2, { static: true, name: "staticMethod" }), {
    name: "Test1 static method only",
  });

  assertEquals(getMetadata("staticMethod2", TestClass1, { static: true, name: "staticMethod" }), undefined);
  assertEquals(getMetadata("staticMethod2", TestClass2, { static: true, name: "staticMethod" }), {
    name: "Test2 static method only",
  });

  assertEquals(getMetadata("instanceField", TestClass1, { static: false, name: "instanceField" }), {
    name: "Test1 instance field",
  });
  assertEquals(getMetadata("instanceField", TestClass2, { static: false, name: "instanceField" }), {
    name: "Test1 instance field",
    extended: true,
  });

  assertEquals(getMetadata("instanceField1", TestClass1, { static: false, name: "instanceField" }), {
    name: "Test1 instance field only",
  });
  assertEquals(getMetadata("instanceField1", TestClass2, { static: false, name: "instanceField" }), {
    name: "Test1 instance field only",
  });

  assertEquals(getMetadata("instanceField2", TestClass1, { static: false, name: "instanceField" }), undefined);
  assertEquals(getMetadata("instanceField2", TestClass2, { static: false, name: "instanceField" }), {
    name: "Test2 instance field only",
  });

  assertEquals(getMetadata("instanceMethod", TestClass1, { static: false, name: "instanceMethod" }), {
    name: "Test1 instance method",
  });
  assertEquals(getMetadata("instanceMethod", TestClass2, { static: false, name: "instanceMethod" }), {
    name: "Test1 instance method",
    extended: true,
  });

  assertEquals(getMetadata("instanceMethod1", TestClass1, { static: false, name: "instanceMethod" }), {
    name: "Test1 instance method only",
  });
  assertEquals(getMetadata("instanceMethod1", TestClass2, { static: false, name: "instanceMethod" }), {
    name: "Test1 instance method only",
  });

  assertEquals(getMetadata("instanceMethod2", TestClass1, { static: false, name: "instanceMethod" }), undefined);
  assertEquals(getMetadata("instanceMethod2", TestClass2, { static: false, name: "instanceMethod" }), {
    name: "Test2 instance method only",
  });

  // getOwnMetadata
  assertEquals(getOwnMetadata("class", TestClass1), { name: "TestClass1" });
  assertEquals(getOwnMetadata("class", TestClass2), { name: "TestClass1", extended: true });

  assertEquals(getOwnMetadata("class1", TestClass1), { name: "TestClass1 only" });
  assertEquals(getOwnMetadata("class1", TestClass2), undefined);

  assertEquals(getOwnMetadata("class2", TestClass1), undefined);
  assertEquals(getOwnMetadata("class2", TestClass2), { name: "TestClass2 only" });

  assertEquals(getOwnMetadata("staticField", TestClass1, { static: true, name: "staticField" }), {
    name: "Test1 static field",
  });
  assertEquals(getOwnMetadata("staticField", TestClass2, { static: true, name: "staticField" }), {
    name: "Test1 static field",
    extended: true,
  });

  assertEquals(getOwnMetadata("staticField1", TestClass1, { static: true, name: "staticField" }), {
    name: "Test1 static field only",
  });
  assertEquals(getOwnMetadata("staticField1", TestClass2, { static: true, name: "staticField" }), undefined);

  assertEquals(getOwnMetadata("staticField2", TestClass1, { static: true, name: "staticField" }), undefined);
  assertEquals(getOwnMetadata("staticField2", TestClass2, { static: true, name: "staticField" }), {
    name: "Test2 static field only",
  });

  assertEquals(getOwnMetadata("staticMethod", TestClass1, { static: true, name: "staticMethod" }), {
    name: "Test1 static method",
  });
  assertEquals(getOwnMetadata("staticMethod", TestClass2, { static: true, name: "staticMethod" }), {
    name: "Test1 static method",
    extended: true,
  });

  assertEquals(getOwnMetadata("staticMethod1", TestClass1, { static: true, name: "staticMethod" }), {
    name: "Test1 static method only",
  });
  assertEquals(getOwnMetadata("staticMethod1", TestClass2, { static: true, name: "staticMethod" }), undefined);

  assertEquals(getOwnMetadata("staticMethod2", TestClass1, { static: true, name: "staticMethod" }), undefined);
  assertEquals(getOwnMetadata("staticMethod2", TestClass2, { static: true, name: "staticMethod" }), {
    name: "Test2 static method only",
  });

  assertEquals(getOwnMetadata("instanceField", TestClass1, { static: false, name: "instanceField" }), {
    name: "Test1 instance field",
  });
  assertEquals(getOwnMetadata("instanceField", TestClass2, { static: false, name: "instanceField" }), {
    name: "Test1 instance field",
    extended: true,
  });

  assertEquals(getOwnMetadata("instanceField1", TestClass1, { static: false, name: "instanceField" }), {
    name: "Test1 instance field only",
  });
  assertEquals(getOwnMetadata("instanceField1", TestClass2, { static: false, name: "instanceField" }), undefined);

  assertEquals(getOwnMetadata("instanceField2", TestClass1, { static: false, name: "instanceField" }), undefined);
  assertEquals(getOwnMetadata("instanceField2", TestClass2, { static: false, name: "instanceField" }), {
    name: "Test2 instance field only",
  });

  assertEquals(getOwnMetadata("instanceMethod", TestClass1, { static: false, name: "instanceMethod" }), {
    name: "Test1 instance method",
  });
  assertEquals(getOwnMetadata("instanceMethod", TestClass2, { static: false, name: "instanceMethod" }), {
    name: "Test1 instance method",
    extended: true,
  });

  assertEquals(getOwnMetadata("instanceMethod1", TestClass1, { static: false, name: "instanceMethod" }), {
    name: "Test1 instance method only",
  });
  assertEquals(getOwnMetadata("instanceMethod1", TestClass2, { static: false, name: "instanceMethod" }), undefined);

  assertEquals(getOwnMetadata("instanceMethod2", TestClass1, { static: false, name: "instanceMethod" }), undefined);
  assertEquals(getOwnMetadata("instanceMethod2", TestClass2, { static: false, name: "instanceMethod" }), {
    name: "Test2 instance method only",
  });
});
