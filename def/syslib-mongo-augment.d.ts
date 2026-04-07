// Enhancements for MongoDB typings returned by inmation `syslib.getmongoconnection()`.
//
// Why this file exists:
// - `src/extern/syslib.d.ts` intentionally keeps `SysLib.MongoCollection` minimal.
// - This repo also ships richer typings for the `mongo` Lua module in `src/extern/mongo.d.ts`.
// - In practice, the object returned by `syslib.getmongoconnection(...).getCollection(...)`
//   behaves like the lua-mongo Collection, so we can safely expose the richer API for
//   better IntelliSense when writing TypeScript.
//
// This file only adds overloads / compatible signatures and does not change runtime behavior.

declare namespace SysLib {
    interface MongoClient {
        /**
         * Returns a lua-mongo collection handle.
         *
         * Note: this overload is compatible with the existing declaration in `syslib.d.ts`.
         */
        getCollection(database: string, collection: string): Mongo.Collection;
    }

    interface MongoCollection {
        /** Typed `find` overload (supports options like sort/skip/limit). */
        find<T = Mongo.Document>(query?: Mongo.Query, options?: Mongo.FindOptions): Mongo.Cursor<T>;

        /** Typed `findOne` overload (supports options like sort/skip/limit). */
        findOne<T = Mongo.Document>(query?: Mongo.Query, options?: Mongo.FindOptions): Mongo.BSONDocument<T> | undefined;

        /** Keep insert typed to lua-mongo's BSONValue. */
        insert(document: Mongo.BSONValue): unknown;

        update(query: Mongo.Query, update: Mongo.Update): unknown;
        updateOne(filter: Mongo.Query, update: Mongo.Update): unknown;
        updateMany(filter: Mongo.Query, update: Mongo.Update): unknown;

        remove(query: Mongo.Query): unknown;
        deleteOne(filter: Mongo.Query): unknown;
        deleteMany(filter: Mongo.Query): unknown;

        drop(): unknown;

        createBulkOperation(): Mongo.BulkOperation;
    }
}
