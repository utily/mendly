# Mendly

Mendly is a utility library for TypeScript and JavaScript that extends the standard library with reader, writer, URI, enumerator, error, and device utilities.

## Installation

```bash
npm install mendly
```

## Importing Mendly

Use the package root in both Node and browser-targeted code.

```ts
import { mendly } from "mendly"
```

The package uses conditional exports for the top-level entry:

- Node resolves to the default entry and includes file-backed `Reader` and `Writer` openers.
- Browser-targeted bundlers resolve to a browser-safe entry that keeps the same `mendly` namespace shape without importing Node built-ins.

## What Is Available

The top-level `mendly` namespace is available in both environments and includes:

- `mendly.Reader`
- `mendly.Writer`
- `mendly.Uri`
- `mendly.Error`
- `mendly.Enumerator`
- `mendly.Enumerable`
- `mendly.Device`

## Browser And Node Behavior

### Node

Node consumers keep the existing file-backed behavior. `Reader.open(...)` and `Writer.open(...)` can resolve `file:` resources through the registered filesystem-backed openers.

```ts
import { mendly } from "mendly"

const input = mendly.Reader.open(mendly.Uri.parse("file:///tmp/input.txt")!)
const output = await mendly.Writer.open(mendly.Uri.parse("file:///tmp/output.txt")!)
```

### Browser

Browser consumers should use the same top-level import:

```ts
import { mendly } from "mendly"

const reader = mendly.Reader.String.create("hello")
const writer = mendly.Writer.String.create() as mendly.Writer.String

await writer.writeLine("hello")
console.log(reader.read())
console.log(writer.result)
```

In browser builds:

- `mendly.Reader` and `mendly.Writer` keep their in-memory functionality.
- `Reader.open(...)` and `Writer.open(...)` remain callable.
- No filesystem-backed openers are registered.
- Browser resolution does not pull `node:fs`, `node:path`, or `node:util` into the top-level browser graph.

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
- Use `Reader.String` and `Writer.String` for browser-safe in-memory work.
- Use `Reader.open` and `Writer.open` for file resources only in Node environments.
- Avoid deep-importing Node-only file-backed modules from browser-targeted applications.

## Migration

If you already consume `mendly`, the intended import stays the same:

```ts
import { mendly } from "mendly"
```

What changed:

- Browser-targeted builds now resolve the package root to a browser-safe entry.
- The `mendly` namespace shape stays the same in both environments.
- Browser builds no longer register filesystem-backed `Reader.open(...)` and `Writer.open(...)` implementations.

What to update if needed:

- If browser code previously relied on `Reader.open(...)` or `Writer.open(...)` for `file:` resources, switch that code to in-memory APIs such as `Reader.String.create(...)` and `Writer.String.create(...)`.
- If an application deep-imports internal file-backed modules, move those imports back to the package root or keep them in Node-only code paths.
- If a bundler does not honor package export conditions, update the bundler configuration so browser builds resolve the package `browser` condition.

## Bundler Requirements

Your bundler or runtime must respect package `exports` conditions so the browser build can resolve the browser-safe top-level entry. Modern bundlers such as Vite, Rollup, webpack 5, and esbuild do this by default when targeting the browser.
