"use strict";

// Verifies that ActionItem.setFunc/onTriggerFunc were compiled away by the TSTL luaPlugin
// into setScript/onTrigger calls with a Lua chunk string literal.

const fs = require("fs");
const path = require("path");

function fail(msg) {
    console.error("[verify-setfunc] FAIL:", msg);
    process.exitCode = 1;
}

function ok(msg) {
    console.log("[verify-setfunc] OK:", msg);
}

const repoRoot = path.resolve(__dirname, "..");
const outFile = path.join(repoRoot, "build", "examples", "ActionItemExample.lua");

if (!fs.existsSync(outFile)) {
    fail(`Missing output file: ${outFile}. Run \"npm run build\" first.`);
    process.exit(1);
}

const lua = fs.readFileSync(outFile, "utf8");

// 1) Ensure setFunc/onTriggerFunc are not present in emitted Lua.
if (lua.includes("setFunc(") || lua.includes(":setFunc(")) {
    fail("Found 'setFunc' in emitted Lua; plugin transform may not have run.");
}
if (lua.includes("onTriggerFunc(") || lua.includes(":onTriggerFunc(")) {
    fail("Found 'onTriggerFunc' in emitted Lua; plugin transform may not have run.");
}

// 2) Ensure the compiled chunk string exists.
const expectedSnippet = 'basic:setScript("syslib.log(2, \\\"Hello from setFunc (compiled TS -> Lua chunk)\\\")")';
if (!lua.includes(expectedSnippet)) {
    fail("Did not find expected setScript chunk string in emitted Lua.\n" +
        "Expected snippet:\n" + expectedSnippet + "\n" +
        "Tip: ensure examples/ActionItemExample.ts still contains the setFunc() call with that exact message.");
}

ok("setFunc/onTriggerFunc were compiled into setScript/onTrigger with Lua chunk strings.");
