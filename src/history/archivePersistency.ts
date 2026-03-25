/**
 * Numeric codes for Variable `ArchiveOptions.PersistencyMode` (inmation model).
 * Prefer these over raw numbers in application code.
 */
export const ArchivePersistency = {
	/** Do not persist dynamic values */
	DoNotPersist: 1,
	/** Persist periodically */
	Periodic: 2,
	/** Persist immediately */
	Immediate: 3,
	/** Persist when the hosting service stops */
	OnServiceStop: 4,
} as const;

export type ArchivePersistencyCode = (typeof ArchivePersistency)[keyof typeof ArchivePersistency];

/** Short labels accepted by {@link Archive.persistencyMode}. */
export type ArchivePersistencyLabel = keyof typeof ARCHIVE_PERSISTENCY_LABEL_TO_CODE;

const ARCHIVE_PERSISTENCY_LABEL_TO_CODE: Record<string, ArchivePersistencyCode> = {
	none: ArchivePersistency.DoNotPersist,
	periodic: ArchivePersistency.Periodic,
	immediate: ArchivePersistency.Immediate,
	onServiceStop: ArchivePersistency.OnServiceStop,
	"do not persist dynamic values": ArchivePersistency.DoNotPersist,
	"persist dynamic values periodically": ArchivePersistency.Periodic,
	"persist dynamic values immediately": ArchivePersistency.Immediate,
	"persist dynamic values when service is stopped": ArchivePersistency.OnServiceStop,
};

export function resolveArchivePersistencyCode(
	mode: ArchivePersistencyLabel | ArchivePersistencyCode,
): ArchivePersistencyCode {
	if (typeof mode === "number") {
		if (mode < 1 || mode > 4) {
			throw new Error(`Invalid Archive persistency code: ${mode} (expected 1–4)`);
		}
		return mode as ArchivePersistencyCode;
	}
	const code = ARCHIVE_PERSISTENCY_LABEL_TO_CODE[mode];
	if (code === undefined) {
		throw new Error(`Unknown Archive persistency mode: ${mode}`);
	}
	return code;
}
