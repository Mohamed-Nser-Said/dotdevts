import * as dkjson from "dkjson";
import { IObject } from "./IObject";
import { Path } from "./Path";
import { DataFrame } from "../std/DataFrame";

export type HistoryTransporterTag = {
	Path: string;
	Name: string;
	SourcePath?: string;
	Historian?: number;
};

export type HistoryTransporterOptions = {
	TagConfiguration?: HistoryTransporterTag[];
	OverWrite?: boolean;
};

export class HistoryTransporter extends IObject {
	type = "HistoryTransporter";

	constructor(path: string | number | Path, opts?: HistoryTransporterOptions) {
		super(path, syslib.model.classes.HistoryTransporter);

		const tagConfig = dkjson.encode(
			DataFrame.fromList<HistoryTransporterTag>(opts?.TagConfiguration ?? []).toMassTable("urn:id:23:24")
		);

		if (!syslib.getobject(this.path.absolutePath()) || opts?.OverWrite) {
			syslib.mass([{
				class: syslib.model.classes.HistoryTransporter,
				operation: syslib.model.codes.MassOp.UPSERT,
				path: this.path.absolutePath(),
				ObjectName: this.path.name(),
				HistoryTransporterConfiguration: tagConfig,
				HistoryTransporterMode: syslib.model.codes.HistoryTransporterMode.HTM_CONTINUOUS,
				ResetStatus: false,
				Reload: false,
				DelayReflection: false,
				ForceCustom: false,
				"AcquisitionOptions.HistoryHandover": false,
				"AcquisitionOptions.OverlapLastKnownGood": false,
				"AcquisitionOptions.Overfetch": false,
				"AcquisitionOptions.BasketCalls": false,
				"Scheduling.ScheduleSimple.SimpleRecurrence": syslib.model.codes.SimpleRecurrence.SR_SEC_30,
				"TransporterNewItemPreset.TransporterArchiveSelector": 33,
			}]);
		}
	}

	setArchive(archive: number | { getId(): number }): void {
		const archiveId = typeof archive === "number" ? archive : archive.getId();
		syslib.setvalue(
			this.path.absolutePath() + ".TransporterNewItemPreset.TransporterArchiveSelector",
			archiveId
		);
	}

	setTagConfiguration(tags: HistoryTransporterTag[]): void {
		const tagConfig = dkjson.encode(
			DataFrame.fromList<HistoryTransporterTag>(tags).toMassTable("urn:id:23:24")
		);
		syslib.mass([{
			class: syslib.model.classes.HistoryTransporter,
			operation: syslib.model.codes.MassOp.UPDATE,
			path: this.path.absolutePath(),
			HistoryTransporterConfiguration: tagConfig,
		}]);
	}

	setMode(mode: number): void {
		syslib.mass([{
			class: syslib.model.classes.HistoryTransporter,
			operation: syslib.model.codes.MassOp.UPDATE,
			path: this.path.absolutePath(),
			HistoryTransporterMode: mode,
		}]);
	}

	reload(): void {
		syslib.setvalue(this.path.absolutePath() + ".Reload", true);
	}

	static appendable(parent: IObject, name: string, opts?: HistoryTransporterOptions): HistoryTransporter {
		return new HistoryTransporter(parent.path.absolutePath() + "/" + name, opts);
	}
}
