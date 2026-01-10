# Unhead Dynamic Import Regression Reproduction

This repository creates a minimal reproduction of the regression introduced in `@unhead/react` v2.0.18.

The issue is that `transformHtmlTemplate` uses a dynamic `import()` which causes a crash in Node.js CommonJS environments (like standard Jest setups) with the error:
`TypeError: A dynamic import callback was invoked without --experimental-vm-modules`

## Critical Requirement

This reproduction fails ONLY if your Babel configuration preserves dynamic imports (e.g. via `exclude: ["proposal-dynamic-import"]` or strictly modern targets). If Babel transpiles `import()` to `Promise.resolve(require(...))`, the error will be masked.

This repo includes a `babel.config.json` that mimics the production environment where this failure was observed.

## How to run

1. Install dependencies:
   ```bash
   yarn install
   ```

2. Run the reproduction script:
   ```bash
   bash reproduce.sh
   ```

## Expected Output

The script will demonstrate:
1. **v2.0.17**: ✅ PASS (No dynamic import usage)
2. **v2.0.18**: ✅ SUCCESS (Test FAILS with `ERR_VM_DYNAMIC_IMPORT_CALLBACK_MISSING_FLAG`)

## Manual Reproduction

```bash
# Working
yarn add @unhead/react@2.0.17 unhead@2.0.17 --silent
yarn jest repro.test.js

# Broken
yarn add @unhead/react@2.0.18 unhead@2.0.18 --silent
yarn jest repro.test.js
```
