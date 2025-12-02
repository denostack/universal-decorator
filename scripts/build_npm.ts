import { build, emptyDir } from "@deno/dnt";
import { bgGreen } from "@std/fmt/colors";
import denoJson from "../deno.json" with { type: "json" };

const version = denoJson.version;

console.log(bgGreen(`version: ${version}`));

await emptyDir("./.npm");

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./.npm",
  shims: {
    deno: false,
  },
  test: false,
  compilerOptions: {
    lib: ["ES2021", "ESNext.Disposable", "ESNext.Decorators"],
  },
  package: {
    name: "universal-decorator",
    version,
    description:
      "This library bridges the gap between TC39 Proposal Decorators (Stage 3) and TypeScript Experimental Decorators, allowing you to write decorators that work in both environments.",
    keywords: [
      "decorators",
      "tc39-decorators",
      "typescript-decorators",
      "experimental-decorators",
      "metadata",
      "reflect-metadata",
      "deno",
      "npm",
    ],
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/denostack/universal-decorator.git",
    },
    bugs: {
      url: "https://github.com/denostack/universal-decorator/issues",
    },
  },
  postBuild() {
    Deno.copyFileSync("LICENSE", ".npm/LICENSE");
    Deno.copyFileSync("README.md", ".npm/README.md");
  },
});
