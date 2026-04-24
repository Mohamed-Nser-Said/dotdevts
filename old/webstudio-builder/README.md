# Web Studio Builder

A progressive complexity framework for creating WebStudio compilations (JSON) with widgets, backend data connections, and widget interactions. Built with full LSP support for excellent developer experience.

## Quick Start

```lua
local App = require("App")
local Button = require("Button")

local app = App()
app:add(Button({label = "Click Me"}))
return app:build()
```

## Documentation

**Complete documentation is available in [`docs/README.md`](./docs/README.md)**

The documentation includes:
- Progressive complexity levels
- Complete API reference
- Development phases and roadmap
- Actions system development plan
- Examples and usage guides

## Development Status

- **Phase 1** ✅ - Enhanced Core with App API (Complete)
- **Phase 2** ⏳ - Actions System (In Development)
- **Phase 3** ⏳ - Component System (Planned)
- **Phase 4** ⏳ - Backend Framework (Planned)

## License

Copyright © 2025
