import { IObject } from "../shared/IObject";
import { Path } from "../shared/Path";
import { ScriptLibrary } from "../objects/ScriptLibrary";
import { DataStoreConfiguration } from "./DataStoreConfiguration";
import { VariableAddFactory } from "../core/VariableAddFactory";
import { ScriptChunk } from "../shared/toLua";
import { IDataStore } from "../Interfaces/IDataStore";

export type GTSBOptions = {
	advancedLuaScript?: string;
	retryLatency?: number;
	suppressAcks?: boolean;
	parallel?: boolean;
	skipMass?: boolean;
	registerAsDataStore?: boolean;
	core?: string | IObject;
};

export class GTSB extends IObject implements IDataStore {
	type = "GTSB";
	scriptLibrary: ScriptLibrary;
	dataStoreConfiguration: DataStoreConfiguration;
	add: VariableAddFactory;

	constructor(path: string | number | Path, opts?: GTSBOptions) {
		super(path, syslib.model.classes.GenericTimeSeriesBuffer);
		this.scriptLibrary = new ScriptLibrary(this);

		// Resolve DataStoreConfiguration from the core option:
		//   string  → treat as a core path
		//   IObject with .dataStoreConfiguration (e.g., another GTSB) → reuse it directly
		//   IObject without .dataStoreConfiguration (e.g., a Core IObject) → use its path
		//   undefined → resolve with syslib.getcorepath()
		if (typeof opts?.core === "string") {
			this.dataStoreConfiguration = new DataStoreConfiguration(
				new IObject(opts.core, syslib.model.classes.Core)
			);
		} else if (opts?.core) {
			const coreWithDSC = opts.core as unknown as { dataStoreConfiguration?: DataStoreConfiguration };
			if (coreWithDSC.dataStoreConfiguration) {
				this.dataStoreConfiguration = coreWithDSC.dataStoreConfiguration;
			} else {
				this.dataStoreConfiguration = new DataStoreConfiguration(
					new IObject(opts.core.path.absolutePath(), syslib.model.classes.Core)
				);
			}
		} else {
			this.dataStoreConfiguration = new DataStoreConfiguration(
				new IObject(syslib.getcorepath(), syslib.model.classes.Core)
			);
		}

		this.add = new VariableAddFactory(() => this.path.absolutePath());

		if (!opts?.skipMass && (!syslib.getobject(this.path.absolutePath()) || opts?.advancedLuaScript)) {
			const retryLatency = opts?.retryLatency ?? 1;
			const suppressAcks = opts?.suppressAcks ?? false;
			const parallel = opts?.parallel ?? false;
			syslib.mass([{
				class: syslib.model.classes.GenericTimeSeriesBuffer,
				operation: syslib.model.codes.MassOp.UPSERT,
				path: this.path.absolutePath(),
				ObjectName: this.path.name(),
				AdvancedLuaScript: opts?.advancedLuaScript ?? "",
				"SaFGenericBufferProcessing.SaFGenericBufferRetryLatency": retryLatency,
				"SaFGenericBufferProcessing.SaFGenericBufferSuppressAcks": suppressAcks,
				"SaFGenericBufferProcessing.SaFGenericBufferParallel": parallel,
			}]);
		}
		// Always refresh after the potential mass call — super() may have cached undefined
		// for an object that mass just created (matches Teal behavior)
		this.object = syslib.getobject(this.path.absolutePath()) as SysLib.SysLibObject | undefined;

		if (opts?.registerAsDataStore) {
			this.dataStoreConfiguration.addDataStore(this);
		}
	}

	_uniqueID(): number {
		return 1;
	}

	/**
	 * Archive row id for this buffer’s registration (see {@link IDataStore}).
	 * @param core Optional Core (or any {@link IObject} sharing the target `dataStoreConfiguration`).
	 */
	getId(core?: IObject): number {
		let config: DataStoreConfiguration;
		if (!core) {
			config = this.dataStoreConfiguration;
		} else {
			const withDsc = core as IObject & { dataStoreConfiguration?: DataStoreConfiguration };
			config = withDsc.dataStoreConfiguration ?? new DataStoreConfiguration(core);
		}
		const id = config.getIdByName(this.path.name());
		if (id === undefined) throw new Error(`DataStore '${this.path.name()}' not found`);
		return id;
	}

	/**
	 * Set the processing script.
	 *
	 * Accepts either:
	 * - a raw Lua script chunk string, or
	 * - a TypeScript function (ScriptChunk) compiled to a Lua chunk string at build time.
	 *
	 * The function form relies on the TypeScriptToLua plugin `tstl-plugins/toLuaString.js`.
	 */
	onTrigger(script: string): void;
	onTrigger(fn: ScriptChunk): void;
	onTrigger(scriptOrFn: string | ScriptChunk): void {
		if (typeof scriptOrFn === "string") {
			syslib.setvalue(this.path.absolutePath() + ".AdvancedLuaScript", scriptOrFn);
			return;
		}
		throw new Error(
			"GTSB.onTrigger(fn) is a compile-time feature. Ensure the TypeScriptToLua luaPlugin `./tstl-plugins/toLuaString` is configured in tsconfig.json (tstl.luaPlugins)."
		);
	}

	delete(silent?: boolean): boolean {
		try {
			this.dataStoreConfiguration.removeDataStore(this);
		} catch (err) {
			if (!silent) throw new Error(`Failed to unregister DataStore: ${String(err)}`);
		}
		return super.delete(silent);
	}

	static appendable(parent: IObject, name: string, opts?: GTSBOptions): GTSB {
		return new GTSB(parent.path.absolutePath() + "/" + name, opts);
	}
}
