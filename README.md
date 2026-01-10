# Unhead Regression Reproduction Case

This repository provides a minimal reproduction for a regression introduced in `@unhead/react` (and `@unhead/schema`) version **2.0.18**.

## The Issue

Starting with v2.0.18, a dynamic `import()` was introduced in `transformHtmlTemplate` to lazily load the parser module. See: [transformHtmlTemplate.ts (v2.0.18)](https://github.com/unjs/unhead/blob/v2.0.18/packages/unhead/src/server/transformHtmlTemplate.ts#L10)

In Node.js environments running in **CommonJS** mode (e.g., standard Jest tests) where the transpiler (Babel/SWC) is configured to **preserve dynamic imports**, this results in a crash:
`TypeError: A dynamic import callback was invoked without --experimental-vm-modules`

## Why this happens

1.  **CJS Context**: Node.js requires special flags or ESM-first setup to handle `import()` in a CJS context.
2.  **Preserved Imports**: If your build pipeline targets modern Node or explicitly excludes dynamic import transpilation (e.g., to keep Webpack chunking working natively), the `import()` call survives and hits the Node/Jest runtime environment.

## Reproduction Steps

### 1. Automated (Recommended)

Run the included shell script which handles the version swapping and testing:
```bash
yarn install
bash reproduce.sh
```

### 2. Manual

```bash
# Verify v2.0.17 WORKS
yarn add @unhead/react@2.0.17 unhead@2.0.17 --silent
yarn jest repro.test.js --no-cache

# Verify v2.0.18 FAILS
yarn add @unhead/react@2.0.18 unhead@2.0.18 --silent
yarn jest repro.test.js --no-cache
```

## Environment Details

- **Node**: 22.x (or any version requiring flags for CJS dynamic imports)
- **Jest**: 30.x (using standard `babel-jest`)
- **Babel**: Configured with `exclude: ["proposal-dynamic-import"]` to ensure `import()` is preserved.

## Workaround

For users experiencing this, the current workarounds are:
1.  Downgrade to `2.0.17`.
2.  Transpile dynamic imports to `require()` in your test environment using `babel-plugin-dynamic-import-node`.
3.  Enable `--experimental-vm-modules` in Node (requires ESM setup in Jest).
