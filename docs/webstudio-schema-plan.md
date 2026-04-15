# WebStudio Schema Plan

Reference document mapping the official WebStudio JSON schema (v1.100) to the `webstudio-builder` TypeScript SDK.

Source: `13043-1.100.8.25461/webstudio/drawio/custom-plugins/webstudio-model-schema.json`

---

## 1. Widget Types

### Schema → Builder mapping

| Schema type         | Schema interface                 | Builder class         | Status       |
| ------------------- | -------------------------------- | --------------------- | ------------ |
| `advancedform`      | `IAdvancedFormWidgetModel`       | `AdvancedForm`        | **New**      |
| `batchtable`        | `IBatchTableWidgetModel`         | —                     | Deferred     |
| `button`            | `IButtonWidgetModel`             | `Button`              | Exists       |
| `chart`             | `IChartWidgetModel`              | `Chart`               | Exists       |
| `container`         | `IContainerWidgetModel`          | `Container`           | **New**      |
| `diagrams`          | `IDiagramsWidgetModel`           | `Diagrams`            | **New**      |
| `diagrams-editor`   | `IDiagramsEditorWidgetModel`     | —                     | Deferred     |
| `editor`            | `IEditorWidgetModel`             | `Editor`              | Exists       |
| `eventtable`        | `IEventTableWidgetModel`         | `EventTable`          | **New**      |
| `faceplate`         | `IFaceplateWidgetModel`          | `Faceplate`           | Exists       |
| `filegrid`          | `IFileGridWidgetModel`           | —                     | Deferred     |
| `form`              | `IFormWidgetModel`               | `Form`                | Exists       |
| `iframe`            | `IIFrameWidgetModel`             | `IFrame`              | Exists       |
| `image`             | `IImageWidgetModel`              | `Image`               | Exists       |
| `markdownviewer`    | `IMarkdownViewerWidgetModel`     | `MarkdownViewer`      | Exists       |
| `messagedebugger`   | `IMessageDebuggerWidgetModel`    | —                     | Deferred     |
| `modeltree`         | `IModelTreeWidgetModel`          | `ModelTree`           | **New**      |
| `plotly`            | `IPlotlyWidgetModel`             | `Plotly`              | Exists       |
| `reportviewer`      | `IReportViewerWidgetModel`       | `ReportViewer`        | **New**      |
| `table`             | `ITableWidgetModel`              | `Table`               | Exists       |
| `tabs`              | `ITabsWidgetModel`               | `TabContainer`        | Exists       |
| `text`              | `ITextWidgetModel`               | `Text`                | Exists       |
| `timeperiodtable`   | `ITimePeriodTableWidgetModel`    | `TimePeriodTable`     | **New**      |
| `transformeditor`   | `ITransformEditorWidgetModel`    | —                     | Deferred     |
| `tree`              | `ITreeWidgetModel`               | `Tree`                | Exists       |
| `video`             | `IVideoWidgetModel`              | `Video`               | **New**      |
| `treebase`          | `ITreeBaseWidgetModel`           | (base)                | Internal     |

### Common widget properties (all widgets)

Every widget in the schema shares these base properties:

- `id` — Unique widget identifier
- `name` — Display name
- `type` — Widget type discriminator
- `actions` — Action hook pipelines
- `captionBar` — Caption bar configuration
- `dataSource` — Data binding configuration
- `dragSource` / `dropTarget` — Drag & drop support
- `layout` — Grid position `{ x, y, w, h }`
- `toolbars` — Toolbar configuration
- `options` — Widget-specific options (including `style`, `styleByTheme`)

### Lifecycle action hooks (common across widgets)

These hooks appear on widgets that define explicit action schemas:

| Hook              | Purpose                               |
| ----------------- | ------------------------------------- |
| `didLoad`         | After widget first loads              |
| `willFetch`       | Before data source fetch              |
| `willRefresh`     | Before widget refresh                 |
| `willUpdate`      | Before incoming update                |
| `didFetch`        | After data source fetch               |
| `didRefresh`      | After widget refresh                  |
| `didUpdate`       | After incoming update                 |
| `didChangeTheme`  | After theme change                    |

### Widget-specific hooks

| Widget     | Extra hooks                                            |
| ---------- | ------------------------------------------------------ |
| button     | `onClick`                                              |
| text       | `onClick`                                              |
| image      | `onClick`                                              |
| plotly     | `onClick`                                              |
| form       | `onSubmit`                                             |
| advancedform | `onChange`, `onFocus`, `onBlur`, `onChanged`, `onValidationError`, `onSubmit`, `onValidate` |
| table      | `onSave`, `onSelect`, `onSelectionChanged`, `onSubmit` |
| tree       | `onClick`, `onSelect`, `onSelectionChanged`            |
| chart      | `onDataPointClick`, `onNewChart`                       |
| tabs       | `onActiveTabChanged`                                   |
| container  | (lifecycle only)                                       |

---

## 2. Action Types

### Schema → Builder mapping

| Action type              | Schema interface                        | Window method         | Status       |
| ------------------------ | --------------------------------------- | --------------------- | ------------ |
| `action`                 | `IActionActionModel`                    | `action()`            | Exists       |
| `collect`                | `ICollectActionModel`                   | `collect()`           | Exists       |
| `consoleLog`             | `IConsoleLogActionModel`                | `consoleLog()`        | Exists       |
| `convert`                | `IConvertActionModel`                   | `convert()`           | Exists       |
| `copy`                   | `ICopyActionModel`                      | `copy()`              | Exists       |
| `delegate`               | `IDelegateActionModel`                  | `delegate()`          | Exists       |
| `dismiss`                | `IDismissActionModel`                   | `dismiss()`           | Exists       |
| `environment`            | `IEnvironmentActionModel`               | —                     | **New**      |
| `fetch`                  | `IFetchActionModel`                     | `fetch()`             | **New**      |
| `function`               | `IFunctionActionModel`                  | `functionCall()`      | Exists       |
| `gettime`                | `IGetTimeActionModel`                   | —                     | **New**      |
| `internationalization`   | `IInternationalizationActionModel`      | —                     | **New**      |
| `load-compilation`       | `ILoadCompilationActionModel`           | —                     | **New**      |
| `modify`                 | `IModifyActionModel`                    | `modify()`            | Exists       |
| `notify`                 | `INotifyActionModel`                    | `notify()`            | Exists       |
| `open-file`              | `IOpenFileActionModel`                  | `openFile()`          | Exists       |
| `openLink`               | `IOpenLinkActionModel`                  | `openLink()`          | Exists       |
| `passthrough`            | `IPassthroughActionModel`               | `passthrough()`       | Exists       |
| `perform-default-onClick`| `IPerformDefaultOnClickActionModel`     | —                     | Deferred     |
| `prompt`                 | `IPromptActionModel`                    | `prompt()`            | Exists       |
| `read`                   | `IReadActionModel`                      | `read()`              | Exists       |
| `read-bpr-header-table-data` | `IReadBPRHeaderTableDataActionModel` | —                     | Deferred     |
| `read-event-table-data`  | `IReadEventTableDataActionModel`        | —                     | Deferred     |
| `read-historical-data`   | `IReadHistoricalDataActionModel`        | —                     | Exists (type)|
| `read-raw-historical-data`| `IReadRawHistoricalDataActionModel`    | —                     | Exists (type)|
| `read-write`             | `IReadWriteActionModel`                 | —                     | Exists (type)|
| `refresh`                | `IRefreshActionModel`                   | `refresh()`           | Exists       |
| `save-file`              | `ISaveFileActionModel`                  | `saveFile()`          | Exists       |
| `send`                   | `ISendActionModel`                      | `send()`              | Exists       |
| `setActiveDiagramsPage`  | `ISetActiveDiagramsPageActionModel`     | —                     | **New**      |
| `subscribe`              | `ISubscribeActionModel`                 | `subscribe()`         | Exists       |
| `switch`                 | `ISwitchActionModel`                    | `switch()`            | Exists       |
| `tpm-oee`                | `ITPMOEEActionModel`                    | —                     | Deferred     |
| `transform`              | `ITransformActionModel`                 | `transform()`         | Exists       |
| `wait`                   | `IWaitActionModel`                      | `wait()`              | Exists       |
| `write`                  | `IWriteActionModel`                     | `write()`             | Exists       |

---

## 3. Communication Topics (send action)

Topics define typed widget-to-widget messaging via the `send` action.

| Topic                    | Payload fields                  | Target widget           |
| ------------------------ | ------------------------------- | ----------------------- |
| `refresh`                | (any)                           | Any                     |
| `update`                 | (any)                           | Any                     |
| `addTab`                 | `tab`, `activateTab`            | `tabs`                  |
| `setActiveTab`           | `id`, `activate`                | `tabs`                  |
| `addPens`                | `pens`                          | `chart`                 |
| `setTagTable`            | `tagTable`, `prompt`            | `chart`                 |
| `setTimeSpan`            | `starttime`, `endtime`          | `chart`                 |
| `setCursors`             | `id`, `timestamp`, `locked`     | `chart`                 |
| `addCursors`             | `id`, `timestamp`, `locked`     | `chart`                 |
| `loadCompilation`        | (LoadCompilationActionModel)    | `container` / `tabs`    |
| `newChart`               | (empty)                         | `chart`                 |
| `cleanUpChart`           | (empty)                         | `chart`                 |
| `selectRows`             | `rowIndex`                      | `table`                 |
| `setActiveDiagramsPage`  | (page id/name)                  | `diagrams`              |
| `selectTreeNode`         | `id`                            | `tree`                  |

---

## 4. Key Enums

### Aggregate types (for historical data actions)

```
AGG_TYPE_RAW, AGG_TYPE_AVERAGE, AGG_TYPE_COUNT, AGG_TYPE_DELTA,
AGG_TYPE_MAXIMUM, AGG_TYPE_MINIMUM, AGG_TYPE_RANGE, AGG_TYPE_TOTAL,
AGG_TYPE_INTERPOLATIVE, AGG_TYPE_SAMPLE, AGG_TYPE_BESTFIT,
AGG_TYPE_START, AGG_TYPE_END, AGG_TYPE_STARTBOUND, AGG_TYPE_ENDBOUND,
AGG_TYPE_TIMEAVERAGE, AGG_TYPE_TIMEAVERAGE2, AGG_TYPE_TOTAL2,
AGG_TYPE_MINIMUM2, AGG_TYPE_MAXIMUM2, AGG_TYPE_RANGE2,
AGG_TYPE_WORSTQUALITY, AGG_TYPE_WORSTQUALITY2, ...
```

### Tab activation modes

```
first, last, next, nextWithRotate, previous, previousWithRotate, none
```

### Load compilation sub-types

```
function, object-name, compilation-field
```

### Load compilation history modes

```
none, pushState, replaceState
```

### Environment queries

```
getLocale, getTheme, getTimezone
```

### Form UI widget types

```
select, datepicker, radio, textarea, password, color,
data-url, updown, range, hidden, checkbox, checkboxes, text, number, integer
```

---

## 5. Implementation phases

### Phase 1 — Schema metadata & typed messages ✅
- `webstudio-builder/scripts/extract-schema.js` — parse schema, generate metadata
- `webstudio-builder/src/generated/schema-meta.ts` — widget types, action types, send topics as string unions
- `webstudio-builder/src/core/messages.ts` — typed send helpers per topic

### Phase 2 — New widget wrappers
- `Container.ts` — embeds a sub-compilation
- `Diagrams.ts` — draw.io diagrams with animations
- `AdvancedForm.ts` — react-jsonschema-form based widget
- `EventTable.ts` — event data in tabular view
- `Video.ts` — video player widget
- `ModelTree.ts` — inmation model tree browser
- `ReportViewer.ts` — report/document viewer
- `TimePeriodTable.ts` — time-period filtered table

### Phase 3 — Missing Window action methods
- `environment()` — read browser locale/theme/timezone
- `getTime()` — convert time values
- `internationalization()` — locale queries
- `loadCompilation()` — switch compilations
- `fetch()` — fetch data by path
- `setActiveDiagramsPage()` — control diagram page

### Phase 4 — Align existing types
- Verify all existing model interfaces match schema required/optional fields
- Add missing optional fields where useful (`dragSource`, `dropTarget`, `tooltip`)
- Add typed action hooks from schema to existing widgets

---

## 6. Files to create/modify

### New files
```
docs/webstudio-schema-plan.md                          (this file)
webstudio-builder/scripts/extract-schema.js             schema parser
webstudio-builder/src/generated/schema-meta.ts          generated constants
webstudio-builder/src/core/messages.ts                  typed send helpers
webstudio-builder/src/widgets/Container.ts              container widget
webstudio-builder/src/widgets/Diagrams.ts               diagrams widget
webstudio-builder/src/widgets/AdvancedForm.ts           advanced form widget
webstudio-builder/src/widgets/EventTable.ts             event table widget
webstudio-builder/src/widgets/Video.ts                  video widget
webstudio-builder/src/widgets/ModelTree.ts              model tree widget
webstudio-builder/src/widgets/ReportViewer.ts           report viewer widget
webstudio-builder/src/widgets/TimePeriodTable.ts        time period table widget
examples/webstudio/schema-driven-demo.ts                example using new widgets
```

### Modified files
```
webstudio-builder/src/core/types.ts                     new model interfaces + action types
webstudio-builder/src/core/Window.ts                    new action methods
```
