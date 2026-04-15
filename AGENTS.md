# AGENTS

## Project overview

**dotdevts** is a TypeScript SDK for the [inmation](https://inmation.com) system, compiled to Lua via [TypeScriptToLua (TSTL)](https://typescripttolua.github.io/). It provides typed wrappers for inmation objects, MongoDB data stores, history transporting, scheduled actions, and standard utilities — all with full IntelliSense in VS Code while targeting inmation's Lua 5.3 runtime.

## Build and run

| Command                  | Description                                                                        |
| ------------------------ | ---------------------------------------------------------------------------------- |
| `npm run build`          | Compile TS → Lua (output in `build/`)                                              |
| `npm run dev`            | Compile in watch mode                                                              |
| `npm run main`           | Build + run via `froge` against the `win1000` connection                           |
| `npm run mainc`          | Build + run via `cts`                                                              |
| `npm run webstudio:run`  | Build + run the simple WebStudio page with `cts run ./build/examples/webstudio/page.lua` |
| `npm run webstudio:push` | Build + push the simple WebStudio page with `cts ws --push ... --func createSimpleWebStudioPage` |
| `npm run verify:setfunc` | Build + verify the TSTL plugin rewrote `setFunc`/`onTriggerFunc` calls             |

Entry point: `main.ts` → imports examples, calls one of them. Toggle which example runs by editing `main.ts`.
WebStudio entry: `examples/webstudio/page.ts` → exports `createSimpleWebStudioPage()` for `cts ws --push`.

## Tests

- Validation is done via example scripts under `examples/`, `npm run main`, and the WebStudio checks `npm run webstudio:run` / `npm run webstudio:push`.
- `scripts/verify-setfunc.js` is a post-build assertion that plugin-compiled Lua is correct.
- No test runner (jest/vitest) is configured yet.

## Project structure

```
main.ts                 Entry point (imports + runs one example)
prelude.ts              Installs TSTL lualib globals into _G before other imports
tsconfig.json           TSTL config: Lua 5.3, strict, plugin registration
inmation-compose.json   froge/cts connection profiles
luabundle.json          Lua bundler config (ignored native modules)

src/
├── core/               Core, Connector
├── children/           ObjectChildren, CoreChildren; `VariableChildren` / `GenericFolderChildren` re-exported from `objects/VariableGroup.ts` / `objects/GenericFolder.ts` (Lua require order)
├── objects/            inmation object wrappers (Variable, GenericFolder, ActionItem, TableHolder, IndustrialScope, …)
├── datastores/         CustomTimeSeriesDataStore, GTSB, CustomEventDataStore, DataStoreGroup, DataStoreConfiguration
├── DataSources/        OpcUaDataSource
├── history/            Archive, HistoryTransporter, HistoryTransferController, HistorianMapping
├── components/         ScheduledActions (compile-time action scripts)
├── shared/             IObject (base class), Path, CustomTable, toLua macro
├── std/                MongoQuery (fluent builder), Query (LINQ), DataFrame, Debug, Document, File, Workspace
└── extern/             Type declarations (.d.ts) for syslib, mongo, dkjson, syslib-mongo-augment

examples/               Runnable examples (feature demos + WebStudio page)
├── webstudio/
│   └── page.ts         Very simple WebStudio example (title, status text, button)
tstl-plugins/           TypeScriptToLua compiler plugin
scripts/                Post-build verification scripts
build/                  Generated Lua output (do not edit)
```

## Architecture

### Object model
- `IObject` (base) → holds a `Path`, a `syslib` model object ref, and a `CustomTable<T>`.
- `VariableChildren` → `ObjectChildren` → `CoreChildren`: each level adds typed `.children.Xxx()` factory methods; `GenericFolderChildren` narrows what you can create under a folder; `NamespaceChildren` (in `Namespace.ts`) covers logical namespace paths.
- `Core` extends `IObject`: the root entry point. `core.children.CustomTimeSeriesDataStore(...)`, `core.children.GenericFolder(...)`, etc.
- Objects are created via `syslib.mass([{ class, operation: MassOp.UPSERT, path, ... }])`.

### MongoDB / data stores
- `CustomTimeSeriesDataStore` wraps `syslib.getmongoconnection()` and exposes:
  - Low-level: `getCollection()`, `findIterator()`, `findAll()`, `findOneValue()`, `readAll()`
  - LINQ-ish: `ds.query<T>().where(...).map(...).limit(n).value`
- `MongoQueryBuilder` (`mq<T>()`) builds typed filter objects with IntelliSense for `$eq/$gt/$gte/$in/...`.
- Fluent `.where(doc => doc.field OP value)` is a **compile-time macro** (see plugin section below).

### Standard library (`src/std/`)
- `Query<T>` — LINQ-style in-memory pipeline: `.where()`, `.select()`, `.join()`, `.orderBy()`, `.toArray()`
- `DataFrame<T>` — tabular data container with `.select()`, `.find()`, `.summary()`
- `Debug.dump()` — safe recursive serializer (handles `userdata`, cycles, depth limits)
- `Document` — line-based text manipulation
- `File` — `Host.io` / `Host.os.exec` wrappers + CSV parsing
- `Workspace` — `Host.workspace.info()` wrapper

## TSTL plugin: compile-time macros

The plugin at `tstl-plugins/toLuaString.js` rewrites certain call patterns **at compile time**:

| TypeScript pattern                    | Compiled Lua result                   |
| ------------------------------------- | ------------------------------------- |
| `toLua(() => { ... })`                | `"<lua chunk string>"`                |
| `obj.setFunc(() => { ... })`          | `obj:setScript("<lua chunk>")`        |
| `obj.onTriggerFunc(() => { ... })`    | `obj:onTrigger("<lua chunk>")`        |
| `obj.addAction(() => { ... }, opts?)` | `obj:addAction("<lua chunk>", opts?)` |
| `.where(doc => doc.field === val)`    | `.where("field"):eq(val)`             |
| `.where(doc => doc.field >= val)`     | `.where("field"):gte(val)`            |

**Comparison operators**: `===`/`==` → `eq`, `!==`/`!=` → `ne`, `>` → `gt`, `>=` → `gte`, `<` → `lt`, `<=` → `lte`.

**Constraints** for toLua/setFunc/addAction: zero-arg function, block body, no closures, no JS features requiring lualib helpers (arrays, classes, spread, etc.). The plugin emits a diagnostic error if violated.

## TypeScript / TSTL rules

### Target runtime is Lua 5.3 (not Node.js)
- Generated code runs inside inmation's Lua VM. JS built-ins like `Date`, `Promise`, `Array.from` do **not** exist.
- `console.log(...)` compiles to `print(...)`. In some inmation environments only the first argument prints — use single-string interpolation: `` console.log(`value=${x}`) ``.
- Use `syslib.now()` for timestamps instead of `Date.now()`.
- Standalone runnable modules (for example `examples/webstudio/page.ts`) should import the workspace `prelude` first so TSTL globals like `__TS__Class` / `__TS__New` are available when executing the compiled Lua directly.

### Types are compile-time only
- TypeScript types are erased. You cannot reflect on them at runtime.
- Use `typeof x === "string"` for runtime checks (compiles to Lua `type(x) == "string"`).

### TSTL calling conventions
- Lua iterators (e.g. lua-mongo `cursor:iterator()`) expect the state/cursor as argument #1. TSTL function calls normally inject a leading `nil` for `self`. Model iterator functions with `@noSelf` to prevent this.
- When wrapping lua-mongo cursors, call the iterator as `it(cursor, control)` — see `CustomTimeSeriesDataStore.findIterator()`.

### External API typings (`src/extern/`)
- `syslib.d.ts` — declares `syslib.*` functions, model classes/codes/properties, `Host.*` APIs.
- `mongo.d.ts` — declares `Mongo` namespace: `Filter<T>`, `Query<T>`, `FieldOperators`, `Cursor`, `Collection`, etc.
- `syslib-mongo-augment.d.ts` — augments `syslib.getmongoconnection()` to return richly-typed `Mongo.Collection`.
- `dkjson.d.ts` — JSON encode/decode (cannot handle `userdata` — use `Debug.dump()` instead).
- `syslib-types.ts` — re-exports `SysLib` namespace types as named imports.

### Adding/improving types
- To add IntelliSense for a new syslib function: edit `src/extern/syslib.d.ts`.
- To add new Mongo operators: edit `src/extern/mongo.d.ts` (`FieldOperators<T>` or `RootOperators<T>`).
- To type a new inmation object class: create a new file in `src/objects/`, extend `IObject`.

## Known runtime constraints (inmation + lua-mongo)

- `syslib.mass()` is the primary way to create/update inmation objects (UPSERT pattern).
- lua-mongo rejects `nil` as a query argument — always pass `{}` for "no filter".
- lua-mongo may reject `$and: [...]` / `$or: [...]` array-based logical operators. The fluent builder avoids `$and` arrays; `.or()` throws an explicit error.
- `dkjson.encode()` crashes on Mongo `_id` fields (`userdata`). Use `Debug.dump()` for safe logging.
- `cursor.iterator(handler)` may behave inconsistently — mapping is done in the TS wrapper post-iteration for reliability.

## WebStudio layout / scaling notes

- `options.numberOfRows` controls whether a page scales-to-fit or becomes scrollable:
  - omit it / `type: "square"` → row height follows column width (default auto behavior).
  - `type: "count"` → the full compilation is scaled to fit the current viewport height. This is good for single-screen dashboards, but long pages will look cramped because all rows shrink to fit.
  - `type: "height"` → each grid row gets a fixed pixel height (`value`), so tall pages can scroll normally. Prefer this for long WebStudio pages like `examples/webstudio/page.ts`.
- For long pages, use something like `numberOfRows: { type: "height", value: 30 }` instead of a large numeric count such as `numberOfRows: 320`.
- `gap` and `padding` in `GridLayout` map to WebStudio `spacing` / `padding`; with `count` mode, very large row counts make widgets appear jammed together because the rows are compressed.
- `cts-webstudio-builder/src/layouts/Grid.ts` was adjusted to preserve row units in fixed-height modes (`height` / `square`) so spacing and scrolling behave correctly after compilation.

## WebStudio actions notes (reviewed against WebStudio 1.110 docs)

- Every widget may define an `actions` object keyed by hook (`onClick`, `willRefresh`, etc.); each hook value is an **action pipeline**.
- Pipelines receive and pass a **message object**. `message.payload` is the main data channel; use `key` when you need to preserve existing payload fields while adding action results.
- Named `action` lookup prefers the widget’s own `actions` collection, then the current compilation’s `actions` collection. **Declaring a named action higher up does not by itself change execution context.**
- For nested tabs / prompt content / container sub-compilations, widget IDs and routes are resolved relative to the **current compilation**. Use `delegate` when a named action must run in the context where it is defined (for example parent/root scope or a peer tab).
- Use plain string IDs for widgets in the same compilation, prefer `route` IDs for nested widgets/tabs, and use `"self"` for the current widget when possible.
- `modify` works on the widget’s work model and typically refreshes/updates the target. Prefer targeted fields like `model.text` or `model.options.style.fontSize` instead of replacing whole sub-objects unless intended.
- `send` does **not** change the current pipeline output; it forwards a message to another widget. Topic `refresh` is the default; use topic `update` when you want the recipient to update without running a data-source refresh.
- `prompt` expects a **single widget model** in `message.payload`; to show a larger UI, wrap it in a container/tabs widget. `dismiss` closes the most recently shown prompt/floating tab.
- Nested action arrays behave like **parallel branches starting from the same input message**; only the output from the **last** nested array continues down the outer pipeline.
- Use `catch` on risky actions (`function`, `load-compilation`, reads/writes) so failures surface to users via `notify` instead of only appearing in the browser console.
- In this repo’s builder, `Window.action(name)` emits `{ type: "action", name }`, `Window.parallel([...])` models nested action arrays, and container-like helpers (`HLayoutContainer`, `GridLayoutContainer`, `Page`, `NavBar`) should expose local `addAction()` support when child widgets need named actions in the same compilation scope.

## Coding conventions

- **Object creation**: use `syslib.mass([{ class, operation: MassOp.UPSERT, path, ... }])`.
- **Path handling**: use `path.absolutePath()` for string concatenation; `path.join(name)` for child paths.
- **Namespace**: a conceptual container (not a real inmation object) for creating children under a path.
- **Logging**: prefer `` console.log(`key=${value}`) `` (single string) over `console.log("key", value)`.
- **Semicolons**: enforced by ESLint (`"semi": ["error", "always"]`).
- **Strict mode**: `tsconfig.json` has `"strict": true`.
