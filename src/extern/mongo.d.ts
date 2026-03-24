declare namespace Mongo {
  type Document = Record<string, unknown>;
  type BSONValue = unknown;
  type Query = BSONValue;
  type Update = BSONValue;

  interface FindOptions {
    sort?: Record<string, 1 | -1> | BSONValue;
    skip?: number;
    limit?: number;
    [key: string]: unknown;
  }

  interface BSONDocument<T = Document> {
    value(): T;
    value<U>(handler: (doc: unknown) => U): U;
    toString(): string;
  }

  interface ObjectID {
    toString(): string;
  }

  interface Binary {
    unpack(): unknown;
    toString(): string;
  }

  type LuaIterator<T> = () => T | undefined;

  interface Cursor<T = Document> {
    iterator(): LuaIterator<T>;
    iterator<U>(handler: (doc: unknown) => U): LuaIterator<U>;
  }

  interface BulkOperation {
    insert(document: BSONValue): BulkOperation;
    replaceOne(filter: Query, replacement: BSONValue): BulkOperation;
    updateOne(filter: Query, update: Update): BulkOperation;
    updateMany(filter: Query, update: Update): BulkOperation;
    removeOne(filter: Query): BulkOperation;
    remove(filter: Query): BulkOperation;
    execute(): unknown;
  }

  interface Collection {
    drop(): unknown;
    insert(document: BSONValue): unknown;
    find<T = Document>(query?: Query, options?: FindOptions): Cursor<T>;
    findOne<T = Document>(query?: Query, options?: FindOptions): BSONDocument<T> | undefined;
    update(query: Query, update: Update): unknown;
    updateOne(filter: Query, update: Update): unknown;
    updateMany(filter: Query, update: Update): unknown;
    remove(query: Query): unknown;
    deleteOne(filter: Query): unknown;
    deleteMany(filter: Query): unknown;
    createBulkOperation(): BulkOperation;
  }

  interface Client {
    getCollection(database: string, collection: string): Collection;
  }

  interface MongoStatic {
    /** @noSelf */
    Client(uri: string): Client;

    /** @noSelf */
    BSON<T = Document>(value?: BSONValue): BSONDocument<T>;

    /** @noSelf */
    ObjectID(hex?: string): ObjectID;

    /** @noSelf */
    Binary(value?: unknown): Binary;
  }
}

declare module "mongo" {
  const mongo: Mongo.MongoStatic;
  export = mongo;
}