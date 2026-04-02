
local J = require("dkjson")
local objspec = syslib.getcorepath()
local prop_attrs = syslib.model.flags.SysPropAttributes
-- select only CONFIGURABLE properties and exclude VOLATILE and DYNAMIC
local props, props_len = syslib.listproperties(objspec, "|wb", prop_attrs.PROP_CONFIGURABLE, prop_attrs.PROP_VOLATILE & prop_attrs.PROP_DYNAMIC)

local mass_entry = {}
for i = 1, props_len, 2 do -- 2 because default result format is FV
    local prop_path, prop_value = props[i], props[i + 1]
        mass_entry[prop_path] = prop_value
end
Host.io.write("./props.json", J.encode(mass_entry))