declare module "dkjson" {
	/** @noSelf */
	export function encode(obj: unknown): string;
	/** @noSelf */
	export function decode(str: string): unknown;
}
