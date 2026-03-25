import { CustomTable } from "./CustomTable";
import { Path } from "./Path";

export type PermissionOptions = {
	AllowList?: boolean;
	AllowRead?: boolean;
	AllowWrite?: boolean;
	AllowModify?: boolean;
	AllowExecute?: boolean;
	AllowInheritable?: boolean;
};

export class IObject {
	path: Path;
	object: SysLib.Model.Object | undefined;
	class?: number;
	customTable: CustomTable<unknown>;
	type = "IObject";

	constructor(path: string | number | Path, classCode?: number) {
		this.path = new Path(path);
		this.object = syslib.getobject(this.path.absolutePath()) as SysLib.Model.Object | undefined;
		this.class = classCode;
		this.customTable = new CustomTable(this);
	}

	enable(): void {
		syslib.enableobject(this.path.absolutePath());
	}

	disable(): void {
		syslib.disableobject(this.path.absolutePath());
	}

	reInit(): void {
		this.disable();
		syslib.sleep(150);
		this.enable();
	}

	delete(silent?: boolean): boolean {
		try {
			syslib.deleteobject(this.path.absolutePath());
			return true;
		} catch (err) {
			if (!silent) throw new Error(`Failed to delete object: ${String(err)}`);
			return false;
		}
	}

	getReferences(): SysLib.Model.ReferenceList {
		return syslib.getreferences(this.path.absolutePath()) as SysLib.Model.ReferenceList;
	}

	private profileMask(permissionOptions: PermissionOptions = {}): number {
		const { codes, flags } = syslib.model;
		return (
codes.ReferenceType.SECURITY +
(permissionOptions.AllowList ? flags.SecurityAttributes.LIST : 0) +
(permissionOptions.AllowRead ? flags.SecurityAttributes.READ : 0) +
(permissionOptions.AllowWrite ? flags.SecurityAttributes.WRITE : 0) +
(permissionOptions.AllowModify ? flags.SecurityAttributes.MODIFY : 0) +
(permissionOptions.AllowExecute ? flags.SecurityAttributes.EXECUTE : 0) +
(permissionOptions.AllowInheritable ? flags.SecurityAttributes.INHERITABLE : 0)
);
	}

	setProfile(profilePath: unknown, permissionOptions: PermissionOptions = {}): void {
		const refs = this.getReferences();
		const permissionMask = this.profileMask(permissionOptions);
		const newRef = { path: profilePath, type: permissionMask } as SysLib.Model.Reference;

		for (let idx = 0; idx < refs.length; idx += 1) {
			const ref = refs[idx];
			if (ref.path === profilePath && ref.type === permissionMask) return;
			if (ref.path === profilePath) {
				ref.type = permissionMask;
				refs.splice(idx, 1);
				break;
			}
		}

		refs.push(newRef);
		syslib.mass([{ class: this.class, operation: syslib.model.codes.MassOp.UPSERT, path: this.path.absolutePath(), references: refs }]);
	}

	removeReferences(refs: string | string[] | ((ref: SysLib.Model.Reference) => boolean)): void {
		const currentRefs = this.getReferences();
		if (!currentRefs || currentRefs.length === 0) return;

		let pathsToRemove: string[];
		if (typeof refs === "string") {
			pathsToRemove = [refs];
		} else if (Array.isArray(refs)) {
			pathsToRemove = refs;
		} else {
			pathsToRemove = [];
			for (const ref of currentRefs) {
				if (refs(ref)) pathsToRemove.push(ref.path);
			}
		}

		if (pathsToRemove.length === 0) return;

		for (const p of pathsToRemove) {
			for (let idx = 0; idx < currentRefs.length; idx += 1) {
				if (currentRefs[idx].path === p) {
					currentRefs.splice(idx, 1);
					break;
				}
			}
		}

		syslib.mass([{ class: this.class, operation: syslib.model.codes.MassOp.UPSERT, path: this.path.absolutePath(), references: currentRefs }]);
	}

	setReferenceObject(path: string, name?: string): void {
		const refs = this.getReferences();
		const resolvedName = name ?? (syslib.splitpath(path)[1] as string);
		const newRef = { path, name: resolvedName, type: "OBJECT_LINK" } as SysLib.Model.Reference;

		for (let idx = 0; idx < refs.length; idx += 1) {
			const ref = refs[idx];
			if (ref.path === path && ref.type === "OBJECT_LINK" && ref.name === resolvedName) return;
			if (ref.path === path && ref.type === "OBJECT_LINK") {
				ref.name = resolvedName;
				refs.splice(idx, 1);
				break;
			}
		}

		refs.push(newRef);
		syslib.mass([{ class: this.class, operation: syslib.model.codes.MassOp.UPSERT, path: this.path.absolutePath(), references: refs }]);
	}

	parentService(): string {
		return syslib.getconnectorpath(this.path.absolutePath()) || syslib.getcorepath(this.path.absolutePath());
	}

	rename(newName: string): IObject {
		try {
			syslib.execute(
this.parentService(),
				`syslib.renameobject("${this.path.absolutePath()}", "${this.path.parentPath().absolutePath()}", "${newName}")`
			);
		} catch (err) {
			throw new Error(`Failed to rename object: ${String(err)}`);
		}
		return this;
	}

	moveTo(newParentPath: string): IObject {
		try {
			syslib.execute(
this.parentService(),
				`syslib.moveobject("${this.path.absolutePath()}", "${newParentPath}", "${this.path.name()}")`
			);
		} catch (err) {
			throw new Error(`Failed to move object: ${String(err)}`);
		}
		return this;
	}

	copyTo(newPath: string, name?: string): IObject {
		const abs = this.path.absolutePath();
		const propAttrs = syslib.model.flags.SysPropAttributes;
		const obj = syslib.getobject(abs);
		if (!obj) throw new Error(`Object not found: ${abs}`);

		const [props, propsLen] = syslib.listproperties(abs, "|wb", propAttrs.PROP_VISIBLE, propAttrs.PROP_VOLATILE & propAttrs.PROP_DYNAMIC);
		const code = (obj as unknown as { class?: number }).class ?? 0;
		const massEntry: Record<string, unknown> = {
			path: `${newPath}/${name ?? this.path.name()}`,
			class: code,
			operation: syslib.model.codes.MassOp.UPSERT,
			references: syslib.getreferences(abs),
		};

		const propsArray = props as unknown[];
		for (let i = 0; i < propsLen; i += 2) {
			massEntry[propsArray[i] as string] = propsArray[i + 1];
		}

		syslib.mass([massEntry]);
		return new IObject(massEntry.path as string, code);
	}

	setCustomProperty(key: string, value: unknown): void {
		this.setCustomPropertyMany({ [key]: value });
	}

	setCustomPropertyMany(customs: Record<string, unknown>): void {
		const base = `${this.path.absolutePath()}.CustomOptions.CustomProperties`;
		const keys = (syslib.getvalue(`${base}.CustomPropertyName`) as string[]) ?? [];
		const values = (syslib.getvalue(`${base}.CustomPropertyValue`) as unknown[]) ?? [];

		for (const key in customs) {
			const idx = keys.indexOf(key);
			if (idx >= 0) {
				values[idx] = customs[key];
			} else {
				keys.push(key);
				values.push(customs[key]);
			}
		}

		syslib.setvalue(`${base}.CustomPropertyName`, keys);
		syslib.setvalue(`${base}.CustomPropertyValue`, values);
	}

	toString(): string {
		return `${this.type}: ${this.path.absolutePath()}`;
	}

	// ---------------------------------------------------------------------------
	// Buffer API
	// ---------------------------------------------------------------------------

	buffer(name: string, input?: string, duration?: number, size?: number, transformFnOrAggPeriod?: string | number, aggType?: string): void {
		const abs = this.path.absolutePath();
		if (!input) {
			syslib.buffer(abs, name);
		} else if (aggType !== undefined) {
			syslib.buffer(abs, name, input, duration!, size!, transformFnOrAggPeriod as number, aggType);
		} else if (transformFnOrAggPeriod !== undefined) {
			syslib.buffer(abs, name, input, duration!, size!, transformFnOrAggPeriod as string);
		} else {
			syslib.buffer(abs, name, input, duration!, size!);
		}
	}

	attach(name: string, repeater?: string | number): void {
		const abs = this.path.absolutePath();
		if (repeater !== undefined) {
			syslib.attach(abs, name, repeater);
		} else {
			syslib.attach(abs, name);
		}
	}

	peek(name: string): [unknown[], number[], number[], number] {
		return syslib.peek(this.path.absolutePath(), name);
	}

	tear(name: string): [unknown[], number[], number[], number] {
		return syslib.tear(this.path.absolutePath(), name);
	}

	last(name: string): unknown {
		return syslib.last(this.path.absolutePath(), name);
	}

	listbuffer(): SysLib.ListBufferResult {
		return syslib.listbuffer(this.path.absolutePath());
	}

	// ---------------------------------------------------------------------------
	// Logs API
	// ---------------------------------------------------------------------------

	getLogs(startTime: number, endTime: number, maxLogs?: number): unknown[] {
		return syslib.getlogs(startTime, endTime, [this.path.absolutePath()], maxLogs);
	}
}
