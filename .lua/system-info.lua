local out = {}
local J = require("dkjson")

for index ,class in pairs(syslib.model.classes) do

    -- print({k,v.tag, v.code, v.toplevel, v.version_major, v.version_minor, v.sortorder})
    table.insert(out, {
        tag = class.tag,
        code = class.code,
        toplevel = class.toplevel,
        version_major = class.version_major,
        version_minor = class.version_minor,
        sortorder = class.sortorder,
    })

end

Host.io.write("./out.json", J.encode(out))