declare namespace Mongo {
  /**
   * A reasonably-typed BSON value model.
   *
   * Note: this file is used for IntelliSense / typechecking in TypeScript.
   * It does not change runtime behavior of inmation's lua-mongo bindings.
   */
  type BSONScalar = string | number | boolean | null;

  /**
   * Non-recursive BSON approximation (intentionally shallow).
   *
   * We avoid fully-recursive types here because TypeScript rejects circular
   * type aliases in `.d.ts` files.
   */
  type BSONLeaf = BSONScalar | undefined | Date | ObjectID | Binary;
  type BSONObject = Record<string, BSONLeaf | Record<string, unknown> | ReadonlyArray<unknown>>;
  type BSONArray = ReadonlyArray<BSONLeaf | Record<string, unknown>>;
  type BSONValue = BSONLeaf | BSONObject | BSONArray;

  type Document = Record<string, BSONValue>;

  /** Field-level operators such as `{ age: { $gt: 5 } }`. */
  type Condition<T> = T | FieldOperators<T>;

  interface FieldOperators<T> {
    $eq?: T;
    $ne?: T;
    $gt?: T;
    $gte?: T;
    $lt?: T;
    $lte?: T;
    $in?: readonly T[];
    $nin?: readonly T[];
    $exists?: boolean;
    $regex?: string;
    /** Regex options, e.g. "i" for case-insensitive. */
    $options?: string;
    $size?: number;
    $all?: readonly T[];
    $elemMatch?: Filter<Document>;
    $not?: Condition<T>;
  }

  /** Root-level operators such as `{ $and: [ ... ] }`. */
  interface RootOperators<TSchema extends Document> {
    $and?: readonly Filter<TSchema>[];
    $or?: readonly Filter<TSchema>[];
    $nor?: readonly Filter<TSchema>[];
    $expr?: BSONValue;
    $text?: {
      $search: string;
      $language?: string;
      $caseSensitive?: boolean;
      $diacriticSensitive?: boolean;
    };
  }

  /**
   * A MongoDB filter (query) object.
   *
   * If you pass a document type parameter to `find<TDoc>(...)`, you'll get
   * IntelliSense for both field names (when known) and operators like `$gt`.
   */
  type Filter<TSchema extends Document = Document> = RootOperators<TSchema> & {
    [K in keyof TSchema]?: Condition<TSchema[K]>;
  };

  /** Alias kept for existing code. */
  type Query<TSchema extends Document = Document> = Filter<TSchema>;

  interface UpdateOperators<TSchema extends Document> {
    $set?: Partial<TSchema>;
    $unset?: Record<string, "" | 0 | 1 | true>;
    $inc?: Record<string, number>;
    $push?: Record<string, BSONValue>;
    $pull?: Record<string, BSONValue>;
    $addToSet?: Record<string, BSONValue>;
    $rename?: Record<string, string>;
  }

  type UpdateFilter<TSchema extends Document = Document> = UpdateOperators<TSchema>;
  /** Replacement document or operator-based update. */
  type Update<TSchema extends Document = Document> = UpdateFilter<TSchema> | Partial<TSchema>;

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

  /**
   * Iterator function used by lua-mongo cursors.
   *
   * This is designed for Lua's generic-for protocol and expects the cursor
   * (state) as the first argument.
   *
   * Marked `@noSelf` so TypeScriptToLua does NOT inject an extra leading `nil`
   * when calling it.
   */
  interface CursorIter<T> {
    /** @noSelf */
    (cursor: Cursor<any>, control?: unknown): T | undefined;
  }

  interface Cursor<T = Document> {
    iterator(): CursorIter<T>;
    iterator<U>(handler: (doc: unknown) => U): CursorIter<U>;
  }

  interface BulkOperation {
    insert(document: BSONValue): BulkOperation;
    replaceOne<TSchema extends Document = Document>(filter: Query<TSchema>, replacement: BSONValue): BulkOperation;
    updateOne<TSchema extends Document = Document>(filter: Query<TSchema>, update: Update<TSchema>): BulkOperation;
    updateMany<TSchema extends Document = Document>(filter: Query<TSchema>, update: Update<TSchema>): BulkOperation;
    removeOne<TSchema extends Document = Document>(filter: Query<TSchema>): BulkOperation;
    remove<TSchema extends Document = Document>(filter: Query<TSchema>): BulkOperation;
    execute(): unknown;
  }

  interface Collection {
    drop(): unknown;
    insert(document: BSONValue): unknown;
    find<TSchema extends Document = Document>(query?: Query<TSchema>, options?: FindOptions): Cursor<TSchema>;
    findOne<TSchema extends Document = Document>(query?: Query<TSchema>, options?: FindOptions): BSONDocument<TSchema> | undefined;
    update<TSchema extends Document = Document>(query: Query<TSchema>, update: Update<TSchema>): unknown;
    updateOne<TSchema extends Document = Document>(filter: Query<TSchema>, update: Update<TSchema>): unknown;
    updateMany<TSchema extends Document = Document>(filter: Query<TSchema>, update: Update<TSchema>): unknown;
    remove<TSchema extends Document = Document>(query: Query<TSchema>): unknown;
    deleteOne<TSchema extends Document = Document>(filter: Query<TSchema>): unknown;
    deleteMany<TSchema extends Document = Document>(filter: Query<TSchema>): unknown;
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