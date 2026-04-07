-- Bundled by luabundle {"version":"1.7.0"}
local __bundle_require, __bundle_loaded, __bundle_register, __bundle_modules = (function(superRequire)
	local loadingPlaceholder = {[{}] = true}

	local register
	local modules = {}

	local require
	local loaded = {}

	register = function(name, body)
		if not modules[name] then
			modules[name] = body
		end
	end

	require = function(name)
		local loadedModule = loaded[name]

		if loadedModule then
			if loadedModule == loadingPlaceholder then
				return nil
			end
		else
			if not modules[name] then
				if not superRequire then
					local identifier = type(name) == 'string' and '\"' .. name .. '\"' or tostring(name)
					error('Tried to require ' .. identifier .. ', but no such module has been registered')
				else
					return superRequire(name)
				end
			end

			loaded[name] = loadingPlaceholder
			loadedModule = modules[name](require, loaded, register, modules)
			loaded[name] = loadedModule
		end

		return loadedModule
	end

	return require, loaded, register, modules
end)(require)
__bundle_register("__root", function(require, _LOADED, __bundle_register, __bundle_modules)
local page = require("page")
end)
__bundle_register("page", function(require, _LOADED, __bundle_register, __bundle_modules)
local ____exports = {}
local ____App = require("cts-webstudio-builder.src.core.App")
local App = ____App.App
local ____VLayout = require("cts-webstudio-builder.src.layouts.VLayout")
local VLayout = ____VLayout.VLayout
local ____Button = require("cts-webstudio-builder.src.widgets.Button")
local Button = ____Button.Button
local ____Text = require("cts-webstudio-builder.src.widgets.Text")
local Text = ____Text.Text
--- Very simple WebStudio example page.
-- 
-- Renders:
-- - a title
-- - a status text
-- - a button that shows a notification and updates the status text
function ____exports.createSimpleWebStudioPage(self)
    local title = __TS__New(Text, {name = "Title", text = "Simple WebStudio Example", title = "Overview"})
    local status = __TS__New(Text, {name = "Status", text = "Status: waiting for click", title = "Status"})
    local button = __TS__New(Button, {name = "HelloButton", label = "Click me"}):onClicked(function(____, ctx)
        ctx:notify("Hello from dotdevts WebStudio")
        ctx:consoleLog("Hello from dotdevts WebStudio")
        ctx:modify(status.model.id, {{name = "model.text", value = "Status: button clicked"}})
    end)
    local app = __TS__New(
        App,
        {layout = __TS__New(VLayout, {rows = {1, 1, 1}})}
    )
    app:add(title, {col = 1, row = 1})
    app:add(status, {col = 1, row = 2})
    app:add(button, {col = 1, row = 3})
    return app:build()
end
____exports.page = ____exports.createSimpleWebStudioPage(nil)
____exports.default = ____exports.page
return ____exports

end)
__bundle_register("cts-webstudio-builder.src.widgets.Text", function(require, _LOADED, __bundle_register, __bundle_modules)
local ____exports = {}
local defaultStyle = {
    color = "grey",
    textAlign = "center",
    fontSize = "26px",
    fontWeight = "bold",
    fontFamily = "\"Courier New\", Courier, sans-serif"
}
____exports.Text = __TS__Class()
local Text = ____exports.Text
Text.name = "Text"
function Text.prototype.____constructor(self, props)
    props = props or ({})
    local showCaption = props.showCaption ~= false
    local captionBar = showCaption and ({hidden = false, title = props.title or props.name or "Text Widget"}) or false
    self.model = {
        type = "text",
        name = props.name or "Text",
        description = "Text Widget",
        text = props.text or "Your text here",
        captionBar = captionBar,
        options = {style = props.style or defaultStyle},
        id = syslib.uuid()
    }
end
function Text.prototype.setText(self, text)
    return {type = "modify", id = self.model.id, set = {{name = "model.text", value = text}}}
end
function Text.prototype.getModel(self)
    return self.model
end
return ____exports

end)
__bundle_register("cts-webstudio-builder.src.widgets.Button", function(require, _LOADED, __bundle_register, __bundle_modules)
local ____exports = {}
local ____Window = require("cts-webstudio-builder.src.core.Window")
local Window = ____Window.Window
local defaultStyle = {
    fontSize = "16px",
    borderRadius = "4px",
    backgroundColor = "#007bff",
    color = "#ffffff",
    padding = "10px 20px",
    cursor = "pointer"
}
____exports.Button = __TS__Class()
local Button = ____exports.Button
Button.name = "Button"
function Button.prototype.____constructor(self, props)
    props = props or ({})
    self.window = props.window and props.window or __TS__New(Window)
    self.model = {
        type = "button",
        name = props.name or "Button",
        captionBar = false,
        description = "Button",
        label = props.label or props.name or "Button",
        id = syslib.uuid(),
        disabled = props.disabled or false,
        actions = {onClick = {}},
        options = {style = props.style or defaultStyle},
        toolbars = {}
    }
end
function Button.prototype.onClicked(self, handler)
    if not self.model.actions then
        self.model.actions = {onClick = {}}
    end
    if not self.model.actions.onClick then
        self.model.actions.onClick = {}
    end
    handler(nil, self.window)
    local recorded = self.window:getActions()
    for ____, step in ipairs(recorded) do
        local ____self_model_actions_onClick_0 = self.model.actions.onClick
        ____self_model_actions_onClick_0[#____self_model_actions_onClick_0 + 1] = step
    end
    self.window:reset()
    return self
end
function Button.prototype.getModel(self)
    return self.model
end
return ____exports

end)
__bundle_register("cts-webstudio-builder.src.core.Window", function(require, _LOADED, __bundle_register, __bundle_modules)
local ____exports = {}
--- Action recorder — passed as `ctx` to widget event handlers (e.g. Button.onClicked).
-- Each method appends a typed action to the internal pipeline, then Button
-- harvests the recorded steps via getActions() and resets via reset().
-- 
-- Pipeline model reference:
--   https://docs.inmation.com/webapps/1.108/webstudio/ReferenceDocs/actions/index.html
____exports.Window = __TS__Class()
local Window = ____exports.Window
Window.name = "Window"
function Window.prototype.____constructor(self, props)
    self._actions = {}
    self._defaultTopic = props and props.defaultTopic and props.defaultTopic or "test"
end
function Window.prototype.notify(self, payload, topic)
    local action = {type = "notify", message = {payload = payload, topic = topic and topic or self._defaultTopic}}
    local ____self__actions_0 = self._actions
    ____self__actions_0[#____self__actions_0 + 1] = action
    return self
end
function Window.prototype.read(self, message, path)
    local action = {type = "read"}
    if message ~= nil then
        action.message = message
    end
    if path ~= nil then
        action.path = path
    end
    local ____self__actions_1 = self._actions
    ____self__actions_1[#____self__actions_1 + 1] = action
    return self
end
function Window.prototype.write(self, message, path)
    local action = {type = "write"}
    if message ~= nil then
        action.message = message
    end
    if path ~= nil then
        action.path = path
    end
    local ____self__actions_2 = self._actions
    ____self__actions_2[#____self__actions_2 + 1] = action
    return self
end
function Window.prototype.send(self, message, to)
    local action = {type = "send"}
    if message ~= nil then
        action.message = message
    end
    if to ~= nil then
        action.to = to
    end
    local ____self__actions_3 = self._actions
    ____self__actions_3[#____self__actions_3 + 1] = action
    return self
end
function Window.prototype.passthrough(self, message)
    local action = {type = "passthrough"}
    if message ~= nil then
        action.message = message
    end
    local ____self__actions_4 = self._actions
    ____self__actions_4[#____self__actions_4 + 1] = action
    return self
end
function Window.prototype.wait(self, duration)
    local action = {type = "wait", duration = duration}
    local ____self__actions_5 = self._actions
    ____self__actions_5[#____self__actions_5 + 1] = action
    return self
end
function Window.prototype.consoleLog(self, message)
    local action = {type = "consoleLog", message = message}
    local ____self__actions_6 = self._actions
    ____self__actions_6[#____self__actions_6 + 1] = action
    return self
end
function Window.prototype.openLink(self, url, target)
    local action = {type = "openLink", url = url}
    if target ~= nil then
        action.target = target
    end
    local ____self__actions_7 = self._actions
    ____self__actions_7[#____self__actions_7 + 1] = action
    return self
end
function Window.prototype.transform(self, script)
    local action = {type = "transform", script = script}
    local ____self__actions_8 = self._actions
    ____self__actions_8[#____self__actions_8 + 1] = action
    return self
end
function Window.prototype.modify(self, id, set)
    local action = {type = "modify", id = id, set = set}
    local ____self__actions_9 = self._actions
    ____self__actions_9[#____self__actions_9 + 1] = action
    return self
end
function Window.prototype.parallel(self, actions)
    local group = actions
    local ____self__actions_10 = self._actions
    ____self__actions_10[#____self__actions_10 + 1] = group
    return self
end
function Window.prototype.getActions(self)
    return self._actions
end
function Window.prototype.reset(self)
    self._actions = {}
end
return ____exports

end)
__bundle_register("cts-webstudio-builder.src.layouts.VLayout", function(require, _LOADED, __bundle_register, __bundle_modules)
local ____exports = {}
local ____Grid = require("cts-webstudio-builder.src.layouts.Grid")
local Grid = ____Grid.Grid
local ____Layout = require("cts-webstudio-builder.src.layouts.Layout")
local Layout = ____Layout.Layout
____exports.VLayout = __TS__Class()
local VLayout = ____exports.VLayout
VLayout.name = "VLayout"
function VLayout.prototype.____constructor(self, options)
    local grid = __TS__New(Grid, {columns = {1}, rows = options.rows})
    self.layout = __TS__New(Layout, grid)
end
function VLayout.prototype.addWidget(self, widget, row)
    self.layout:addWidget(widget, 1, row)
end
function VLayout.prototype.getModel(self)
    return self.layout:getModel()
end
return ____exports

end)
__bundle_register("cts-webstudio-builder.src.layouts.Layout", function(require, _LOADED, __bundle_register, __bundle_modules)
local ____exports = {}
local function makeCompilation(self)
    return {version = "1", widgets = {}, options = {
        stacking = "none",
        numberOfColumns = 96,
        numberOfRows = {type = "count", value = 96},
        padding = {x = 0, y = 0},
        spacing = {x = 0, y = 0}
    }}
end
____exports.Layout = __TS__Class()
local Layout = ____exports.Layout
Layout.name = "Layout"
function Layout.prototype.____constructor(self, grid)
    self.model = makeCompilation(nil)
    self.grid = grid
end
function Layout.prototype.addWidget(self, widget, col, row)
    local widgetModel
    if type(widget.getModel) == "function" then
        widgetModel = widget:getModel()
    else
        widgetModel = widget
    end
    local widgetCopy = {}
    for k in pairs(widgetModel) do
        widgetCopy[k] = widgetModel[k]
    end
    local cell = self.grid:getCell(col, row)
    widgetCopy.layout = {x = cell.x, y = cell.y, w = cell.w, h = cell.h}
    local ____self_model_widgets_0 = self.model.widgets
    ____self_model_widgets_0[#____self_model_widgets_0 + 1] = widgetCopy
end
function Layout.prototype.getModel(self)
    return self.model
end
return ____exports

end)
__bundle_register("cts-webstudio-builder.src.layouts.Grid", function(require, _LOADED, __bundle_register, __bundle_modules)
local ____exports = {}
____exports.Grid = __TS__Class()
local Grid = ____exports.Grid
Grid.name = "Grid"
function Grid.prototype.____constructor(self, options)
    options = options or ({})
    self.columns = options.columns or ({1})
    self.rows = options.rows or ({1})
    self.modelOptions = {numberOfColumns = 96, numberOfRows = {type = "count", value = 96}, padding = {x = 0, y = 0}, spacing = {x = 0, y = 0}}
    self.totalColumnsSize = 0
    self.totalRowsSize = 0
    for ____, col in ipairs(self.columns) do
        self.totalColumnsSize = self.totalColumnsSize + col
    end
    for ____, row in ipairs(self.rows) do
        self.totalRowsSize = self.totalRowsSize + row
    end
end
function Grid.prototype.getCell(self, col, row)
    return {
        x = self:getColumnStartingPosition(col),
        y = self:getRowStartingPosition(row),
        w = self:getColumnSize(col),
        h = self:getRowSize(row)
    }
end
function Grid.prototype.getColumnSize(self, col)
    if col < 1 or col > #self.columns then
        return 0
    end
    return math.floor(self.modelOptions.numberOfColumns * (self.columns[col] / self.totalColumnsSize))
end
function Grid.prototype.getRowSize(self, row)
    if row < 1 or row > #self.rows then
        return 0
    end
    return math.floor(self.modelOptions.numberOfRows.value * (self.rows[row] / self.totalRowsSize))
end
function Grid.prototype.getColumnStartingPosition(self, col)
    if col < 1 or col > #self.columns then
        return 0
    end
    local x = 0
    do
        local idx = 1
        while idx < col do
            x = x + self:getColumnSize(idx)
            idx = idx + 1
        end
    end
    return x
end
function Grid.prototype.getRowStartingPosition(self, row)
    if row < 1 or row > #self.rows then
        return 0
    end
    local y = 0
    do
        local idx = 1
        while idx < row do
            y = y + self:getRowSize(idx)
            idx = idx + 1
        end
    end
    return y
end
return ____exports

end)
__bundle_register("cts-webstudio-builder.src.core.App", function(require, _LOADED, __bundle_register, __bundle_modules)
local ____exports = {}
local ____WidgetRegistry = require("cts-webstudio-builder.src.widgets.WidgetRegistry")
local WidgetRegistry = ____WidgetRegistry.WidgetRegistry
local DEFAULT_OPTIONS = {
    stacking = "none",
    numberOfColumns = 96,
    numberOfRows = {type = "count", value = 96},
    padding = {x = 0, y = 0},
    spacing = {x = 0, y = 0}
}
____exports.App = __TS__Class()
local App = ____exports.App
App.name = "App"
function App.prototype.____constructor(self, config)
    config = config or ({})
    self.widgets = {}
    self.layout = config.layout
    self.registry = __TS__New(WidgetRegistry)
    self.compilation = {version = "1", widgets = {}, options = {
        stacking = DEFAULT_OPTIONS.stacking,
        numberOfColumns = DEFAULT_OPTIONS.numberOfColumns,
        numberOfRows = {type = DEFAULT_OPTIONS.numberOfRows.type, value = DEFAULT_OPTIONS.numberOfRows.value},
        padding = {x = 0, y = 0},
        spacing = {x = 0, y = 0}
    }}
end
function App.prototype.create(self, widgetType, props)
    return widgetType(nil, props or ({}))
end
function App.prototype.setLayout(self, layout)
    self.layout = layout
    return self
end
function App.prototype.add(self, widget, position, row)
    local col
    local rowPos
    if type(position) == "table" then
        col = position.col
        rowPos = position.row
    elseif type(position) == "number" then
        col = position
        rowPos = row
    end
    local widgetName
    if widget.model and widget.model.name then
        widgetName = widget.model.name
    elseif widget.name then
        widgetName = widget.name
    end
    if widgetName then
        self.registry:register(widgetName, widget)
    end
    if self.layout and col ~= nil and rowPos ~= nil then
        self.layout:addWidget(widget, col, rowPos)
    else
        local ____self_widgets_0 = self.widgets
        ____self_widgets_0[#____self_widgets_0 + 1] = widget
    end
    return self
end
function App.prototype.addWidget(self, widget, col, row)
    return self:add(widget, col, row)
end
function App.prototype.compile(self, config)
    config = config or ({})
    if config.layout then
        self:setLayout(config.layout)
    end
    if config.widgets then
        for ____, wc in ipairs(config.widgets) do
            local pos = wc.position or ({col = wc.col, row = wc.row})
            self:add(wc.widget, pos)
        end
    end
    return self:build()
end
function App.prototype._copySerializable(self, source)
    if type(source) ~= "table" or source == nil then
        return source
    end
    local copy = {}
    for k in pairs(source) do
        local v = source[k]
        if type(v) == "function" then
        elseif type(v) == "table" and v ~= nil then
            copy[k] = self:_copySerializable(v)
        else
            copy[k] = v
        end
    end
    return copy
end
function App.prototype.build(self)
    if self.layout then
        return self.layout:getModel()
    end
    local compilation = {version = "1", widgets = {}, options = {
        stacking = "none",
        numberOfColumns = 96,
        numberOfRows = {type = "count", value = 96},
        padding = {x = 0, y = 0},
        spacing = {x = 0, y = 0}
    }}
    for ____, widget in ipairs(self.widgets) do
        local widgetModel
        if type(widget.getModel) == "function" then
            widgetModel = widget:getModel()
        else
            widgetModel = widget
        end
        local widgetCopy = self:_copySerializable(widgetModel)
        if not widgetCopy.layout then
            widgetCopy.layout = {x = 0, y = 0, w = 48, h = 48}
        end
        local ____compilation_widgets_1 = compilation.widgets
        ____compilation_widgets_1[#____compilation_widgets_1 + 1] = widgetCopy
    end
    return compilation
end
return ____exports

end)
__bundle_register("cts-webstudio-builder.src.widgets.WidgetRegistry", function(require, _LOADED, __bundle_register, __bundle_modules)
local ____exports = {}
____exports.WidgetRegistry = __TS__Class()
local WidgetRegistry = ____exports.WidgetRegistry
WidgetRegistry.name = "WidgetRegistry"
function WidgetRegistry.prototype.____constructor(self)
    self.widgets = {}
end
function WidgetRegistry.prototype.register(self, name, widget)
    if name ~= nil then
        self.widgets[name] = widget
    end
end
function WidgetRegistry.prototype.get(self, name)
    return self.widgets[name]
end
function WidgetRegistry.prototype.clear(self)
    self.widgets = {}
end
return ____exports

end)
return __bundle_require("__root")