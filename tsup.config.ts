import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src"],
  target: 'es2020',
  format: ["cjs", "esm"], // Build for commonJS and ESmodules
  dts: true, // Generate declaration file (.d.ts)
  splitting: false,
  sourcemap: true,
  clean: true,
});