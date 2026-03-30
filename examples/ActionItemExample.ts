/**
 * ActionItemExample
 *
 * Demonstrates creating ActionItem objects, setting scripts, and using
 * the onTrigger builder for scheduled Lua execution.
 */

import { ActionItem } from "../src/objects/ActionItem";
import { GenericFolder } from "../src/objects/GenericFolder";


export function main(): void {
	const corePath = syslib.getcorepath();
	const rootPath = `${corePath}/examples/action-items`;

	const root = new GenericFolder(rootPath);

	// --- Basic ActionItem with no initial script ---
	const basic = new ActionItem(`${rootPath}/LogTime`);
	console.log(`Created action item: ${basic.path.absolutePath()}`);

	// --- Set a script via setScript ---
	basic.setScript(`
		local ts = syslib.gettime()
		syslib.log(2, "LogTime triggered at: " .. tostring(ts))
	`);
	console.log("Set script on LogTime");


	// --- ActionItem with script inline via options ---
	const inline = new ActionItem(`${rootPath}/InlineScript`, {
		script: `syslib.log(2, "InlineScript fired")`,
	});
	console.log(`Created with inline script: ${inline.path.absolutePath()}`);

	// --- onTrigger: fluent script setter, returns self ---
	const chained = new ActionItem(`${rootPath}/Chained`)
		.onTrigger(`syslib.log(2, "Chained trigger fired")`);
	console.log(`Created chained: ${chained.path.absolutePath()}`);

	// --- onTriggerFunc: fluent TS function setter ---
	const chainedFunc = new ActionItem(`${rootPath}/ChainedFunc`).onTrigger(() => {
		syslib.log(2, "ChainedFunc trigger fired");
	});
	console.log(`Created chainedFunc: ${chainedFunc.path.absolutePath()}`);

	// --- ActionItem.children: child variables ---
	const withChildren = new ActionItem(`${rootPath}/WithChildren`);
	const status = withChildren.children.Variable("Status", 0);
	const counter = withChildren.children.Variable("Counter", 0);
	console.log(`Child variable: ${status.path.absolutePath()}`);
	console.log(`Child variable: ${counter.path.absolutePath()}`);

	// --- Read/write value ---
	withChildren.setValue(1);
	const val = withChildren.getValue();
	console.log(`ActionItem value: ${val}`);

	// --- Archive configuration ---
	inline.archive.persistencyMode("persist dynamic values immediately");
	console.log("Configured archive on inline action item");

	// --- Static appendable factory ---
	const via = ActionItem.appendable(root, "ViaAppendable", {
		script: `syslib.log(2, "ViaAppendable fired")`,
	});
	console.log(`Created via appendable: ${via.path.absolutePath()}`);

	// --- GenericFolder.children.ActionItem builder ---
	const fromFolder = root.add.ActionItem("FromFolder", {
		script: `syslib.log(2, "FromFolder fired")`,
	});
	console.log(`Created from folder builder: ${fromFolder.path.absolutePath()}`);
}
