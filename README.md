# Mendly

Mendly is a utility library for TypeScript and JavaScript that extends the standard library with reader, writer, URI, enumerator, error, and device utilities.

## Installation

```bash
npm install mendly
```

## Importing Mendly

Use the package root for the portable surface.

```ts
import { mendly } from "mendly"
```

Use the Node entrypoint when you want filesystem-backed `Reader.open(...)` and `Writer.open(...)` registration.

```ts
import { mendly } from "mendly/node"
```

The package exports two public entrypoints:

- `mendly` resolves to the portable root and does not import Node built-ins.
- `mendly/node` resolves to the Node-specific entry and registers filesystem-backed `Reader` and `Writer` openers.

The published package uses standard npm package metadata only:

- `exports` defines the public ESM entrypoints for the portable root and the Node subpath.
- `types` points at the generated root declarations.
- `files` restricts the published tarball to `dist`, `LICENSE`, and `README.md`.

That means consumers should import from the package entrypoints, not from source files or generated internal paths.

## What Is Available

The portable `mendly` namespace is available in both environments and includes:

- `mendly.Reader`
- `mendly.Writer`
- `mendly.Uri`
- `mendly.Error`
- `mendly.Enumerator`
- `mendly.Enumerable`
- `mendly.Device`

## Browser And Node Behavior

### Node

Node consumers should use the Node entrypoint when they need filesystem-backed behavior. `Reader.open(...)` and `Writer.open(...)` can resolve `file:` resources through the registered filesystem-backed openers there.

```ts
import { mendly } from "mendly/node"

const input = mendly.Reader.open(mendly.Uri.parse("file:///tmp/input.txt")!)
const output = await mendly.Writer.open(mendly.Uri.parse("file:///tmp/output.txt")!)
```

### Browser

Browser consumers should use the portable root import:

```ts
import { mendly } from "mendly"

const reader = mendly.Reader.String.create("hello")
const writer = mendly.Writer.String.create()

await writer.writeLine("hello")
console.log(reader.read())
console.log(writer.result)
```

From the portable root:

- `mendly.Reader` and `mendly.Writer` keep their in-memory functionality.
- `Reader.open(...)` and `Writer.open(...)` remain callable.
- No filesystem-backed openers are registered.
- The root import does not pull `node:fs`, `node:path`, or `node:util` into the top-level graph.

That means file resources are not opened in browser builds:

```ts
import { mendly } from "mendly"

const resource = mendly.Uri.parse("file:///tmp/example.txt")!

console.log(mendly.Reader.open(resource))
console.log(await mendly.Writer.open(resource))
// undefined
// undefined
```

## Recommended Usage

- Import from `mendly`, not from generated `dist` files.
- Import from `mendly/node` only when the calling code explicitly needs filesystem access.
- Use `Reader.String` and `Writer.String` for browser-safe in-memory work.
- Use `Reader.open` and `Writer.open` for file resources only from `mendly/node`.
- Avoid deep-importing Node-only file-backed modules from browser-targeted applications.

## Migration

If you only consume the portable API, the import stays the same:

```ts
import { mendly } from "mendly"
```

What changed:

- The package root is now portable by default.
- Filesystem-backed `Reader.open(...)` and `Writer.open(...)` registration moved to `mendly/node`.
- Native Node ESM can load both published entrypoints directly from the package exports.

What to update if needed:

- If browser code previously relied on `Reader.open(...)` or `Writer.open(...)` for `file:` resources, switch that code to in-memory APIs such as `Reader.String.create(...)` and `Writer.String.create(...)`.
- If Node code previously relied on `import { mendly } from "mendly"` for filesystem-backed openers, switch that import to `import { mendly } from "mendly/node"`.
- If a downstream package added `mendly.js`, `mendly-node.js`, or resolver aliases to split browser and Node behavior, those shims can be removed in favor of the published entrypoints.

## Bundler Requirements

Your runtime or bundler must respect package `exports` so `mendly` resolves to the portable root and `mendly/node` resolves to the Node-specific entry. Modern Node ESM, Vite, Rollup, webpack 5, and esbuild do this by default.

## Package Verification

This package relies on the standard npm publishing flow. To inspect the exact published contents locally, run `npm pack --dry-run`.
