/**
 * Build the connection string stored on inmation Custom*Store Mongo properties.
 * The runtime typically expects `host:port` (no `mongodb://` URI), matching DataStudio defaults.
 *
 * @param connection Full string as configured in the model, or host + port.
 * @param fallback Used when `connection` is undefined (e.g. lab hostname).
 */
export function inmationMongoConnectionString(
	connection: string | { host: string; port: number } | undefined,
	fallback: string,
): string {
	if (connection === undefined) {
		return fallback;
	}
	if (typeof connection === "string") {
		return connection;
	}
	return `${connection.host}:${connection.port}`;
}
