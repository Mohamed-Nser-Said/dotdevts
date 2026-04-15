/**
 * Fluent (LINQ-ish) MongoDB query builder.
 *
 * Goal:
 * - Make it easier to discover operators like `$eq`, `$gte`, `$in` via IntelliSense
 * - Keep the runtime output as a plain Mongo filter object (Lua table)
 *
 * Example:
 *   const q = mq<MyDoc>()
 *     .where("runId").eq(runId)
 *     .where("value").gte(42)
 *     .build();
 *
 *   myDataStore.findOneValue<MyDoc>(q)
 */

export type KeyOf<T> = Extract<keyof T, string>;

export class MongoQueryBuilder<T extends Mongo.Document = Mongo.Document> {
    private query: Mongo.Query<T>;
    private hasAny: boolean;

    constructor(initial?: Mongo.Query<T>) {
        this.query = (initial ?? ({} as unknown as Mongo.Query<T>)) as Mongo.Query<T>;
        this.hasAny = initial !== undefined;
    }

    /**
     * Start / continue adding conditions on a field.
     *
     * Two authoring styles are supported:
     * 1) String field name (runtime):
     *    mq<T>().where("runId").eq(runId)
     *
     * 2) Predicate lambda (compile-time macro via the TSTL plugin):
     *    mq<T>().where(doc => doc.runId === runId)
     *    mq<T>().where(doc => doc.value >= 42)
     *
     * The predicate form is transformed at build time into the string+operator form.
     */
    where<K extends KeyOf<T>>(field: K): MongoFieldBuilder<T, K>;
    where(predicate: (doc: T) => boolean): MongoQueryBuilder<T>;
    where(arg: unknown): any {
        // The predicate form is expected to be rewritten by the TypeScriptToLua plugin.
        // If it reaches runtime, the plugin didn't run (or didn't match the expression).
        if (typeof arg === "function") {
            throw new Error(
                "MongoQueryBuilder.where(predicate) is a compile-time macro. " +
                "Use a simple comparison like doc => doc.field === value, " +
                "and ensure the TSTL plugin (tstl-plugins/toLuaString.js) is enabled."
            );
        }

        return new MongoFieldBuilder<T, any>(this, arg as any);
    }

    /** Combine the current query with another filter using `$and`. */
    and(filter: Mongo.Query<T>): this {
        // NOTE:
        // The inmation lua-mongo binding used here rejects `$and: [ ... ]` (arrays).
        // To keep this builder usable in this environment, `and()` performs a best-effort
        // shallow merge of the two filters.
        //
        // If a conflicting primitive value is encountered (e.g. {a:1} AND {a:2}),
        // we throw to avoid silently producing an incorrect query.
        if (!this.hasAny) {
            this.query = filter;
            this.hasAny = true;
            return this;
        }

        for (const k in filter as any) {
            const nextVal = (filter as any)[k];
            const curVal = (this.query as any)[k];
            if (curVal === undefined) {
                (this.query as any)[k] = nextVal;
                continue;
            }

            // If both are objects (operator objects), merge.
            if (typeof curVal === "object" && typeof nextVal === "object") {
                (this.query as any)[k] = { ...(curVal as any), ...(nextVal as any) };
                continue;
            }

            // Primitive + operator object: convert primitive to {$eq: primitive} and merge.
            if (typeof curVal !== "object" && typeof nextVal === "object") {
                (this.query as any)[k] = { $eq: curVal, ...(nextVal as any) };
                continue;
            }

            // Operator object + primitive: convert primitive to {$eq: primitive} and merge.
            if (typeof curVal === "object" && typeof nextVal !== "object") {
                (this.query as any)[k] = { ...(curVal as any), $eq: nextVal };
                continue;
            }

            // Primitive + primitive
            if (curVal !== nextVal) {
                throw new Error(
                    `MongoQueryBuilder.and() conflict on field '${String(k)}': ${String(curVal)} vs ${String(nextVal)}`,
                );
            }
        }

        this.hasAny = true;
        return this;
    }

    /** Combine the current query with another filter using `$or`. */
    or(filter: Mongo.Query<T>): this {
        // The inmation lua-mongo binding used in this repo may reject `$or: [ ... ]`.
        // If you need OR queries, prefer writing the raw Mongo query object and test it
        // against your environment.
        throw new Error("MongoQueryBuilder.or() is not supported by this environment's lua-mongo binding");
    }

    /** Return the built filter. */
    build(): Mongo.Query<T> {
        return this.query;
    }

    // Internal: set/merge field condition
    _setField(field: string, value: unknown): void {
        (this.query as any)[field] = value;
        this.hasAny = true;
    }

    _mergeFieldOps(field: string, ops: Record<string, unknown>): void {
        const existing = (this.query as any)[field];
        if (!existing) {
            (this.query as any)[field] = ops;
            this.hasAny = true;
            return;
        }

        // If it's already an object, merge operators.
        if (typeof existing === "object") {
            (this.query as any)[field] = { ...(existing as any), ...ops };
            this.hasAny = true;
            return;
        }

        // Existing is a primitive. Convert it to `$eq` and merge operator object.
        (this.query as any)[field] = { $eq: existing, ...ops };
        this.hasAny = true;
    }
}

export class MongoFieldBuilder<T extends Mongo.Document, K extends KeyOf<T>> {
    constructor(
        private readonly parent: MongoQueryBuilder<T>,
        private readonly field: K,
    ) { }

    /** Direct match `{ field: value }` (no operator object). */
    is(value: T[K]): MongoQueryBuilder<T> {
        this.parent._setField(this.field, value as unknown);
        return this.parent;
    }

    eq(value: T[K]): MongoQueryBuilder<T> {
        this.parent._mergeFieldOps(this.field, { $eq: value as unknown });
        return this.parent;
    }

    ne(value: T[K]): MongoQueryBuilder<T> {
        this.parent._mergeFieldOps(this.field, { $ne: value as unknown });
        return this.parent;
    }

    gt(value: T[K]): MongoQueryBuilder<T> {
        this.parent._mergeFieldOps(this.field, { $gt: value as unknown });
        return this.parent;
    }

    gte(value: T[K]): MongoQueryBuilder<T> {
        this.parent._mergeFieldOps(this.field, { $gte: value as unknown });
        return this.parent;
    }

    lt(value: T[K]): MongoQueryBuilder<T> {
        this.parent._mergeFieldOps(this.field, { $lt: value as unknown });
        return this.parent;
    }

    lte(value: T[K]): MongoQueryBuilder<T> {
        this.parent._mergeFieldOps(this.field, { $lte: value as unknown });
        return this.parent;
    }

    in(values: ReadonlyArray<T[K]>): MongoQueryBuilder<T> {
        this.parent._mergeFieldOps(this.field, { $in: values as unknown });
        return this.parent;
    }

    nin(values: ReadonlyArray<T[K]>): MongoQueryBuilder<T> {
        this.parent._mergeFieldOps(this.field, { $nin: values as unknown });
        return this.parent;
    }

    exists(value = true): MongoQueryBuilder<T> {
        this.parent._mergeFieldOps(this.field, { $exists: value });
        return this.parent;
    }
}

/** Factory function (shorter to type). */
export function mq<T extends Mongo.Document = Mongo.Document>(initial?: Mongo.Query<T>): MongoQueryBuilder<T> {
    return new MongoQueryBuilder<T>(initial);
}
