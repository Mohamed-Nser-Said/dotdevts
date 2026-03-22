import { IObject } from "../shared/IObject";
import { Path } from "../shared/Path";
import { ScriptLibrary } from "../objects/ScriptLibrary";
import { DataStoreConfiguration } from "./DataStoreConfiguration";
import { VariableAddFactory } from "../core/VariableAddFactory";

export type GTSBOptions = {
	advancedLuaScript?: string;
	retryLatency?: number;
	suppressAcks?: boolean;
	parallel?: boolean;
	skipMass?: boolean;
	registerAsDataStore?: boolean;
	core?: string | IObject;
};

export class GTSB extends IObject {
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

	getId(core?: DataStoreConfiguration): number {
		const config = core ?? this.dataStoreConfiguration;
		const id = config.getIdByName(this.path.name());
		if (id === undefined) throw new Error(`DataStore '${this.path.name()}' not found`);
		return id;
	}

	onTrigger(script: string): void {
		syslib.setvalue(this.path.absolutePath() + ".AdvancedLuaScript", script);
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
