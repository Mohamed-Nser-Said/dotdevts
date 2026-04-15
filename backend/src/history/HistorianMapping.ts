import * as dkjson from "dkjson";
import { IObject } from "../shared/IObject";
import { DataFrame } from "../std/DataFrame";

export type HistorianTag = {
	EquipmentId: string;
	Tag: string;
	Path: string;
	Historian?: number;
	init?: unknown;
};

const EMPTY_JSON = `{
  "meta": {
    "id": "urn:id:62:7",
    "schema-ext": { "properties": {} }
  },
  "data": {
    "EquipmentId": [],
    "Tag": [],
    "Path": [],
    "Historian": []
  }
}`;

export class HistorianMapping {
	constructor(private readonly linkedObject: IObject) {}

	private get propPath(): string {
		return this.linkedObject.path.absolutePath() + ".MSIMsgDHistorianConfigList";
	}

	buildJSON(tags: HistorianTag[]): string {
		const equipmentIds: string[] = [];
		const tagNames: string[] = [];
		const paths: string[] = [];
		const historians: number[] = [];

		for (const t of tags) {
			equipmentIds.push(t.EquipmentId);
			tagNames.push(t.Tag);
			paths.push(t.Path);
			historians.push(t.Historian ?? 1);
		}

		return dkjson.encode({
			meta: { id: "urn:id:62:7", "schema-ext": { properties: {} } },
			data: {
				EquipmentId: equipmentIds,
				Tag: tagNames,
				Path: paths,
				Historian: historians,
			},
		});
	}

	list(predicate?: (tag: HistorianTag) => boolean): HistorianTag[] {
		const raw = syslib.getvalue(this.propPath);
		const tags: HistorianTag[] = [];

		if (raw) {
			const decoded = dkjson.decode(dkjson.encode(raw)) as HistorianTag[] | undefined;
			if (decoded && Array.isArray(decoded)) {
				for (const item of decoded) {
					const t = item as HistorianTag;
					tags.push({
						EquipmentId: t.EquipmentId,
						Tag: t.Tag,
						Historian: t.Historian,
						Path: t.Path,
						init: t.init,
					});
				}
			}
		}

		if (predicate) {
			const filtered: HistorianTag[] = [];
			for (const t of tags) {
				if (predicate(t)) filtered.push(t);
			}
			return filtered;
		}

		return tags;
	}

	append(tag: HistorianTag): void {
		const tags = this.list();
		tags.push(tag);
		syslib.setvalue(this.propPath, this.buildJSON(tags));
	}

	appendMany(tags: HistorianTag[]): void {
		const current = this.list();
		for (const t of tags) current.push(t);
		syslib.setvalue(this.propPath, this.buildJSON(current));
	}

	update(tag: HistorianTag): void {
		const tags = this.list();
		const updated: HistorianTag[] = [];
		for (const t of tags) {
			if (t.EquipmentId === tag.EquipmentId || t.Tag === tag.Tag) {
				updated.push({ ...t, Path: tag.Path, Historian: tag.Historian, Tag: tag.Tag, init: tag.init });
			} else {
				updated.push(t);
			}
		}
		syslib.setvalue(this.propPath, this.buildJSON(updated));
	}

	updateMany(fn: (tag: HistorianTag, index: number, all: HistorianTag[]) => HistorianTag): void {
		const tags = this.list();
		const updated: HistorianTag[] = [];
		for (let i = 0; i < tags.length; i += 1) {
			updated.push(fn(tags[i], i, tags));
		}
		this.set(updated);
	}

	count(predicate?: (tag: HistorianTag) => boolean): number {
		return this.list(predicate).length;
	}

	clear(): void {
		syslib.setvalue(this.propPath, EMPTY_JSON);
	}

	set(tags: HistorianTag[]): void {
		this.clear();
		this.appendMany(tags);
	}

	get(): DataFrame<HistorianTag> {
		return DataFrame.fromList<HistorianTag>(this.list());
	}

	forEach(fn: (tag: HistorianTag) => void): void {
		for (const t of this.list()) fn(t);
	}

	map<T>(fn: (tag: HistorianTag, index: number, all: HistorianTag[]) => T): T[] {
		const tags = this.list();
		const out: T[] = [];
		for (let i = 0; i < tags.length; i += 1) {
			out.push(fn(tags[i], i, tags));
		}
		return out;
	}
}
