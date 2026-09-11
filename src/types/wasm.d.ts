// @cloudflare/vite-plugin treats a plain `.wasm` import as a "CompiledWasm"
// module: it's precompiled at build time into a Workers wasm_module binding,
// so the import resolves to an already-compiled WebAssembly.Module (not raw
// bytes) -- required because workerd disallows compiling WASM from bytes at
// request time. See src/lib/export/social-image.tsx and harfbuzz-shim.ts.
declare module "*.wasm" {
  const wasmModule: WebAssembly.Module;
  export default wasmModule;
}
