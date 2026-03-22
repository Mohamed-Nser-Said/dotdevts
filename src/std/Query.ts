/**
 * Query<T> — a lightweight, chainable data query builder.
 *
 * Inspired by LINQ / IQueryable: wrap any array, chain operations,
 * and terminate with forEach / toArray / first / count.
 *
 * All operations are eager (immediate) and non-mutating.
 *
 * Usage:
 *   Query.from(data)
 *     .where(r => r.active)
 *     .join(Query.from(other), l => l.id, r => r.foreignId)
 *     .forEach(pair => console.log(pair.left.name, pair.right.value));
 */
export class Query<T> {
    _data: T[];

    constructor(data: T[]) {
        this._data = [];
        for (const item of data) this._data.push(item);
    }

    /** Wrap any array in a Query. */
    static from<T>(data: T[]): Query<T> {
        return new Query<T>(data);
    }

    // ── Chainable ─────────────────────────────────────────────────────────

    /** Keep only rows that match the predicate. */
    where(predicate: (item: T) => boolean): Query<T> {
        const result: T[] = [];
        for (const item of this._data) {
            if (predicate(item)) result.push(item);
        }
        return new Query<T>(result);
    }

    /** Transform each row into a new shape. */
    select<U>(projection: (item: T) => U): Query<U> {
        const result: U[] = [];
        for (const item of this._data) result.push(projection(item));
        return new Query<U>(result);
    }

    /**
     * Inner join with another Query on matching string keys.
     * Each matched pair is returned as { left: T, right: R }.
     */
    join<R>(
        other: Query<R>,
        leftKey: (l: T) => string,
        rightKey: (r: R) => string,
    ): Query<{ left: T; right: R }> {
        const result: { left: T; right: R }[] = [];
        const rightData = other.toArray();
        for (const l of this._data) {
            const lk = leftKey(l);
            for (const r of rightData) {
                if (rightKey(r) === lk) {
                    result.push({ left: l, right: r });
                    break;
                }
            }
        }
        return new Query<{ left: T; right: R }>(result);
    }

    /**
     * Keep only the most-recent row per group.
     * Within each group (identified by groupKey), the row with the
     * highest timeKey value wins.
     */
    latestBy(groupKey: (item: T) => string, timeKey: (item: T) => number): Query<T> {
        const best: Record<string, T> = {};
        const bestTime: Record<string, number> = {};
        for (const item of this._data) {
            const k = groupKey(item);
            const t = timeKey(item);
            const prev = bestTime[k];
            if (prev === undefined || t > prev) {
                best[k] = item;
                bestTime[k] = t;
            }
        }
        const result: T[] = [];
        for (const k in best) result.push(best[k]);
        return new Query<T>(result);
    }

    /** Sort rows by a key ascending. */
    orderBy(key: (item: T) => number | string): Query<T> {
        const result: T[] = [];
        for (const item of this._data) result.push(item);
        for (let i = 1; i < result.length; i++) {
            const cur = result[i];
            const curKey = key(cur);
            let j = i - 1;
            while (j >= 0 && key(result[j]) > curKey) {
                result[j + 1] = result[j];
                j--;
            }
            result[j + 1] = cur;
        }
        return new Query<T>(result);
    }

    // ── Terminals ─────────────────────────────────────────────────────────

    /** Run an action for each row. */
    forEach(action: (item: T) => void): void {
        for (const item of this._data) action(item);
    }

    /** Return all rows as a plain array. */
    toArray(): T[] {
        const result: T[] = [];
        for (const item of this._data) result.push(item);
        return result;
    }

    /** First row, or undefined if empty. */
    first(): T | undefined {
        if (this._data.length === 0) return undefined;
        return this._data[0];
    }

    /** Number of rows. */
    count(): number {
        return this._data.length;
    }
}
