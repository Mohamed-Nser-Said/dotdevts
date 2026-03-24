export type PathSpec = string | number | Path | { absolutePath: () => string };

export class Path {
	private readonly spec: PathSpec;

	constructor(spec: PathSpec) {
		this.spec = spec;
	}

	absolutePath(): string {
		const { spec } = this;
		if (typeof spec === "string") return spec;
		if (typeof spec === "number") {
			const obj = syslib.getobject(spec);
			return obj && typeof obj.path === "function" ? obj.path() : "";
		}
		return spec.absolutePath();
	}

	name(): string {
		const parts = this.absolutePath().split("/");
		return parts[parts.length - 1] ?? "";
	}

	parentPath(): Path {
		const parts = this.absolutePath().split("/");
		parts.pop();
		return new Path(parts.join("/"));
	}

	parentPathAsString(): string {
		return this.parentPath().absolutePath();
	}

	join(path: string) {
		if (!path.startsWith("/"))
			return `${this.absolutePath()}/${path}`;
		else return `${this.absolutePath()}${path}`;
	}
}
