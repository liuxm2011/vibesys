
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Topic
 * 
 */
export type Topic = $Result.DefaultSelection<Prisma.$TopicPayload>
/**
 * Model Project
 * 
 */
export type Project = $Result.DefaultSelection<Prisma.$ProjectPayload>
/**
 * Model Document
 * 
 */
export type Document = $Result.DefaultSelection<Prisma.$DocumentPayload>
/**
 * Model GraduationDocument
 * 
 */
export type GraduationDocument = $Result.DefaultSelection<Prisma.$GraduationDocumentPayload>
/**
 * Model SystemConfig
 * 
 */
export type SystemConfig = $Result.DefaultSelection<Prisma.$SystemConfigPayload>
/**
 * Model UserApiSetting
 * 
 */
export type UserApiSetting = $Result.DefaultSelection<Prisma.$UserApiSettingPayload>
/**
 * Model ApiProvider
 * 
 */
export type ApiProvider = $Result.DefaultSelection<Prisma.$ApiProviderPayload>
/**
 * Model AiUsageLog
 * 
 */
export type AiUsageLog = $Result.DefaultSelection<Prisma.$AiUsageLogPayload>
/**
 * Model ThesisTopic
 * 
 */
export type ThesisTopic = $Result.DefaultSelection<Prisma.$ThesisTopicPayload>
/**
 * Model ThesisProject
 * 
 */
export type ThesisProject = $Result.DefaultSelection<Prisma.$ThesisProjectPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const Role: {
  STUDENT: 'STUDENT',
  ADMIN: 'ADMIN',
  VIEWER: 'VIEWER'
};

export type Role = (typeof Role)[keyof typeof Role]


export const Status: {
  ACTIVE: 'ACTIVE',
  BANNED: 'BANNED'
};

export type Status = (typeof Status)[keyof typeof Status]


export const Domain: {
  SE: 'SE',
  BD: 'BD'
};

export type Domain = (typeof Domain)[keyof typeof Domain]


export const TopicType: {
  SYSTEM: 'SYSTEM',
  CUSTOM: 'CUSTOM'
};

export type TopicType = (typeof TopicType)[keyof typeof TopicType]


export const Platform: {
  WEB: 'WEB',
  IOS: 'IOS',
  ANDROID: 'ANDROID',
  WECHAT_MINI: 'WECHAT_MINI',
  WINDOWS_DESKTOP: 'WINDOWS_DESKTOP',
  MAC_DESKTOP: 'MAC_DESKTOP'
};

export type Platform = (typeof Platform)[keyof typeof Platform]


export const ProjectStatus: {
  NOT_STARTED: 'NOT_STARTED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED'
};

export type ProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus]


export const ReviewStatus: {
  NONE: 'NONE',
  PENDING_FIX: 'PENDING_FIX',
  ACCEPTED: 'ACCEPTED',
  DISCARDED: 'DISCARDED'
};

export type ReviewStatus = (typeof ReviewStatus)[keyof typeof ReviewStatus]


export const DocType: {
  PRD: 'PRD',
  FRONTEND: 'FRONTEND',
  BACKEND: 'BACKEND',
  API: 'API',
  TASK: 'TASK',
  CONTEXT_STATE: 'CONTEXT_STATE',
  AGENTS: 'AGENTS'
};

export type DocType = (typeof DocType)[keyof typeof DocType]


export const GraduationDocType: {
  TASK_BOOK: 'TASK_BOOK',
  PROPOSAL: 'PROPOSAL',
  PREPARATION: 'PREPARATION',
  DRAFTING: 'DRAFTING',
  MIDTERM_CHECK: 'MIDTERM_CHECK',
  REFINEMENT: 'REFINEMENT'
};

export type GraduationDocType = (typeof GraduationDocType)[keyof typeof GraduationDocType]

}

export type Role = $Enums.Role

export const Role: typeof $Enums.Role

export type Status = $Enums.Status

export const Status: typeof $Enums.Status

export type Domain = $Enums.Domain

export const Domain: typeof $Enums.Domain

export type TopicType = $Enums.TopicType

export const TopicType: typeof $Enums.TopicType

export type Platform = $Enums.Platform

export const Platform: typeof $Enums.Platform

export type ProjectStatus = $Enums.ProjectStatus

export const ProjectStatus: typeof $Enums.ProjectStatus

export type ReviewStatus = $Enums.ReviewStatus

export const ReviewStatus: typeof $Enums.ReviewStatus

export type DocType = $Enums.DocType

export const DocType: typeof $Enums.DocType

export type GraduationDocType = $Enums.GraduationDocType

export const GraduationDocType: typeof $Enums.GraduationDocType

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.topic`: Exposes CRUD operations for the **Topic** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Topics
    * const topics = await prisma.topic.findMany()
    * ```
    */
  get topic(): Prisma.TopicDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.project`: Exposes CRUD operations for the **Project** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Projects
    * const projects = await prisma.project.findMany()
    * ```
    */
  get project(): Prisma.ProjectDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.document`: Exposes CRUD operations for the **Document** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Documents
    * const documents = await prisma.document.findMany()
    * ```
    */
  get document(): Prisma.DocumentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.graduationDocument`: Exposes CRUD operations for the **GraduationDocument** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GraduationDocuments
    * const graduationDocuments = await prisma.graduationDocument.findMany()
    * ```
    */
  get graduationDocument(): Prisma.GraduationDocumentDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.systemConfig`: Exposes CRUD operations for the **SystemConfig** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SystemConfigs
    * const systemConfigs = await prisma.systemConfig.findMany()
    * ```
    */
  get systemConfig(): Prisma.SystemConfigDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.userApiSetting`: Exposes CRUD operations for the **UserApiSetting** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserApiSettings
    * const userApiSettings = await prisma.userApiSetting.findMany()
    * ```
    */
  get userApiSetting(): Prisma.UserApiSettingDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.apiProvider`: Exposes CRUD operations for the **ApiProvider** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ApiProviders
    * const apiProviders = await prisma.apiProvider.findMany()
    * ```
    */
  get apiProvider(): Prisma.ApiProviderDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.aiUsageLog`: Exposes CRUD operations for the **AiUsageLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more AiUsageLogs
    * const aiUsageLogs = await prisma.aiUsageLog.findMany()
    * ```
    */
  get aiUsageLog(): Prisma.AiUsageLogDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.thesisTopic`: Exposes CRUD operations for the **ThesisTopic** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ThesisTopics
    * const thesisTopics = await prisma.thesisTopic.findMany()
    * ```
    */
  get thesisTopic(): Prisma.ThesisTopicDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.thesisProject`: Exposes CRUD operations for the **ThesisProject** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ThesisProjects
    * const thesisProjects = await prisma.thesisProject.findMany()
    * ```
    */
  get thesisProject(): Prisma.ThesisProjectDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.3
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Topic: 'Topic',
    Project: 'Project',
    Document: 'Document',
    GraduationDocument: 'GraduationDocument',
    SystemConfig: 'SystemConfig',
    UserApiSetting: 'UserApiSetting',
    ApiProvider: 'ApiProvider',
    AiUsageLog: 'AiUsageLog',
    ThesisTopic: 'ThesisTopic',
    ThesisProject: 'ThesisProject'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "topic" | "project" | "document" | "graduationDocument" | "systemConfig" | "userApiSetting" | "apiProvider" | "aiUsageLog" | "thesisTopic" | "thesisProject"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Topic: {
        payload: Prisma.$TopicPayload<ExtArgs>
        fields: Prisma.TopicFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TopicFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TopicFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicPayload>
          }
          findFirst: {
            args: Prisma.TopicFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TopicFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicPayload>
          }
          findMany: {
            args: Prisma.TopicFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicPayload>[]
          }
          create: {
            args: Prisma.TopicCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicPayload>
          }
          createMany: {
            args: Prisma.TopicCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TopicCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicPayload>[]
          }
          delete: {
            args: Prisma.TopicDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicPayload>
          }
          update: {
            args: Prisma.TopicUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicPayload>
          }
          deleteMany: {
            args: Prisma.TopicDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TopicUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TopicUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicPayload>[]
          }
          upsert: {
            args: Prisma.TopicUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TopicPayload>
          }
          aggregate: {
            args: Prisma.TopicAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTopic>
          }
          groupBy: {
            args: Prisma.TopicGroupByArgs<ExtArgs>
            result: $Utils.Optional<TopicGroupByOutputType>[]
          }
          count: {
            args: Prisma.TopicCountArgs<ExtArgs>
            result: $Utils.Optional<TopicCountAggregateOutputType> | number
          }
        }
      }
      Project: {
        payload: Prisma.$ProjectPayload<ExtArgs>
        fields: Prisma.ProjectFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ProjectFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ProjectFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          findFirst: {
            args: Prisma.ProjectFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ProjectFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          findMany: {
            args: Prisma.ProjectFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          create: {
            args: Prisma.ProjectCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          createMany: {
            args: Prisma.ProjectCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ProjectCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          delete: {
            args: Prisma.ProjectDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          update: {
            args: Prisma.ProjectUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          deleteMany: {
            args: Prisma.ProjectDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ProjectUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ProjectUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>[]
          }
          upsert: {
            args: Prisma.ProjectUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ProjectPayload>
          }
          aggregate: {
            args: Prisma.ProjectAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateProject>
          }
          groupBy: {
            args: Prisma.ProjectGroupByArgs<ExtArgs>
            result: $Utils.Optional<ProjectGroupByOutputType>[]
          }
          count: {
            args: Prisma.ProjectCountArgs<ExtArgs>
            result: $Utils.Optional<ProjectCountAggregateOutputType> | number
          }
        }
      }
      Document: {
        payload: Prisma.$DocumentPayload<ExtArgs>
        fields: Prisma.DocumentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DocumentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DocumentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          findFirst: {
            args: Prisma.DocumentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DocumentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          findMany: {
            args: Prisma.DocumentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>[]
          }
          create: {
            args: Prisma.DocumentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          createMany: {
            args: Prisma.DocumentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DocumentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>[]
          }
          delete: {
            args: Prisma.DocumentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          update: {
            args: Prisma.DocumentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          deleteMany: {
            args: Prisma.DocumentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DocumentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DocumentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>[]
          }
          upsert: {
            args: Prisma.DocumentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DocumentPayload>
          }
          aggregate: {
            args: Prisma.DocumentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDocument>
          }
          groupBy: {
            args: Prisma.DocumentGroupByArgs<ExtArgs>
            result: $Utils.Optional<DocumentGroupByOutputType>[]
          }
          count: {
            args: Prisma.DocumentCountArgs<ExtArgs>
            result: $Utils.Optional<DocumentCountAggregateOutputType> | number
          }
        }
      }
      GraduationDocument: {
        payload: Prisma.$GraduationDocumentPayload<ExtArgs>
        fields: Prisma.GraduationDocumentFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GraduationDocumentFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GraduationDocumentPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GraduationDocumentFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GraduationDocumentPayload>
          }
          findFirst: {
            args: Prisma.GraduationDocumentFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GraduationDocumentPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GraduationDocumentFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GraduationDocumentPayload>
          }
          findMany: {
            args: Prisma.GraduationDocumentFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GraduationDocumentPayload>[]
          }
          create: {
            args: Prisma.GraduationDocumentCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GraduationDocumentPayload>
          }
          createMany: {
            args: Prisma.GraduationDocumentCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.GraduationDocumentCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GraduationDocumentPayload>[]
          }
          delete: {
            args: Prisma.GraduationDocumentDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GraduationDocumentPayload>
          }
          update: {
            args: Prisma.GraduationDocumentUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GraduationDocumentPayload>
          }
          deleteMany: {
            args: Prisma.GraduationDocumentDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GraduationDocumentUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.GraduationDocumentUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GraduationDocumentPayload>[]
          }
          upsert: {
            args: Prisma.GraduationDocumentUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GraduationDocumentPayload>
          }
          aggregate: {
            args: Prisma.GraduationDocumentAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGraduationDocument>
          }
          groupBy: {
            args: Prisma.GraduationDocumentGroupByArgs<ExtArgs>
            result: $Utils.Optional<GraduationDocumentGroupByOutputType>[]
          }
          count: {
            args: Prisma.GraduationDocumentCountArgs<ExtArgs>
            result: $Utils.Optional<GraduationDocumentCountAggregateOutputType> | number
          }
        }
      }
      SystemConfig: {
        payload: Prisma.$SystemConfigPayload<ExtArgs>
        fields: Prisma.SystemConfigFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SystemConfigFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SystemConfigFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload>
          }
          findFirst: {
            args: Prisma.SystemConfigFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SystemConfigFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload>
          }
          findMany: {
            args: Prisma.SystemConfigFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload>[]
          }
          create: {
            args: Prisma.SystemConfigCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload>
          }
          createMany: {
            args: Prisma.SystemConfigCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SystemConfigCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload>[]
          }
          delete: {
            args: Prisma.SystemConfigDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload>
          }
          update: {
            args: Prisma.SystemConfigUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload>
          }
          deleteMany: {
            args: Prisma.SystemConfigDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SystemConfigUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SystemConfigUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload>[]
          }
          upsert: {
            args: Prisma.SystemConfigUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SystemConfigPayload>
          }
          aggregate: {
            args: Prisma.SystemConfigAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSystemConfig>
          }
          groupBy: {
            args: Prisma.SystemConfigGroupByArgs<ExtArgs>
            result: $Utils.Optional<SystemConfigGroupByOutputType>[]
          }
          count: {
            args: Prisma.SystemConfigCountArgs<ExtArgs>
            result: $Utils.Optional<SystemConfigCountAggregateOutputType> | number
          }
        }
      }
      UserApiSetting: {
        payload: Prisma.$UserApiSettingPayload<ExtArgs>
        fields: Prisma.UserApiSettingFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserApiSettingFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserApiSettingPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserApiSettingFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserApiSettingPayload>
          }
          findFirst: {
            args: Prisma.UserApiSettingFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserApiSettingPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserApiSettingFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserApiSettingPayload>
          }
          findMany: {
            args: Prisma.UserApiSettingFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserApiSettingPayload>[]
          }
          create: {
            args: Prisma.UserApiSettingCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserApiSettingPayload>
          }
          createMany: {
            args: Prisma.UserApiSettingCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserApiSettingCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserApiSettingPayload>[]
          }
          delete: {
            args: Prisma.UserApiSettingDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserApiSettingPayload>
          }
          update: {
            args: Prisma.UserApiSettingUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserApiSettingPayload>
          }
          deleteMany: {
            args: Prisma.UserApiSettingDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserApiSettingUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserApiSettingUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserApiSettingPayload>[]
          }
          upsert: {
            args: Prisma.UserApiSettingUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserApiSettingPayload>
          }
          aggregate: {
            args: Prisma.UserApiSettingAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserApiSetting>
          }
          groupBy: {
            args: Prisma.UserApiSettingGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserApiSettingGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserApiSettingCountArgs<ExtArgs>
            result: $Utils.Optional<UserApiSettingCountAggregateOutputType> | number
          }
        }
      }
      ApiProvider: {
        payload: Prisma.$ApiProviderPayload<ExtArgs>
        fields: Prisma.ApiProviderFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ApiProviderFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiProviderPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ApiProviderFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiProviderPayload>
          }
          findFirst: {
            args: Prisma.ApiProviderFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiProviderPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ApiProviderFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiProviderPayload>
          }
          findMany: {
            args: Prisma.ApiProviderFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiProviderPayload>[]
          }
          create: {
            args: Prisma.ApiProviderCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiProviderPayload>
          }
          createMany: {
            args: Prisma.ApiProviderCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ApiProviderCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiProviderPayload>[]
          }
          delete: {
            args: Prisma.ApiProviderDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiProviderPayload>
          }
          update: {
            args: Prisma.ApiProviderUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiProviderPayload>
          }
          deleteMany: {
            args: Prisma.ApiProviderDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ApiProviderUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ApiProviderUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiProviderPayload>[]
          }
          upsert: {
            args: Prisma.ApiProviderUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ApiProviderPayload>
          }
          aggregate: {
            args: Prisma.ApiProviderAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateApiProvider>
          }
          groupBy: {
            args: Prisma.ApiProviderGroupByArgs<ExtArgs>
            result: $Utils.Optional<ApiProviderGroupByOutputType>[]
          }
          count: {
            args: Prisma.ApiProviderCountArgs<ExtArgs>
            result: $Utils.Optional<ApiProviderCountAggregateOutputType> | number
          }
        }
      }
      AiUsageLog: {
        payload: Prisma.$AiUsageLogPayload<ExtArgs>
        fields: Prisma.AiUsageLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.AiUsageLogFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiUsageLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.AiUsageLogFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiUsageLogPayload>
          }
          findFirst: {
            args: Prisma.AiUsageLogFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiUsageLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.AiUsageLogFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiUsageLogPayload>
          }
          findMany: {
            args: Prisma.AiUsageLogFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiUsageLogPayload>[]
          }
          create: {
            args: Prisma.AiUsageLogCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiUsageLogPayload>
          }
          createMany: {
            args: Prisma.AiUsageLogCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.AiUsageLogCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiUsageLogPayload>[]
          }
          delete: {
            args: Prisma.AiUsageLogDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiUsageLogPayload>
          }
          update: {
            args: Prisma.AiUsageLogUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiUsageLogPayload>
          }
          deleteMany: {
            args: Prisma.AiUsageLogDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.AiUsageLogUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.AiUsageLogUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiUsageLogPayload>[]
          }
          upsert: {
            args: Prisma.AiUsageLogUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$AiUsageLogPayload>
          }
          aggregate: {
            args: Prisma.AiUsageLogAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateAiUsageLog>
          }
          groupBy: {
            args: Prisma.AiUsageLogGroupByArgs<ExtArgs>
            result: $Utils.Optional<AiUsageLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.AiUsageLogCountArgs<ExtArgs>
            result: $Utils.Optional<AiUsageLogCountAggregateOutputType> | number
          }
        }
      }
      ThesisTopic: {
        payload: Prisma.$ThesisTopicPayload<ExtArgs>
        fields: Prisma.ThesisTopicFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ThesisTopicFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThesisTopicPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ThesisTopicFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThesisTopicPayload>
          }
          findFirst: {
            args: Prisma.ThesisTopicFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThesisTopicPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ThesisTopicFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThesisTopicPayload>
          }
          findMany: {
            args: Prisma.ThesisTopicFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThesisTopicPayload>[]
          }
          create: {
            args: Prisma.ThesisTopicCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThesisTopicPayload>
          }
          createMany: {
            args: Prisma.ThesisTopicCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ThesisTopicCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThesisTopicPayload>[]
          }
          delete: {
            args: Prisma.ThesisTopicDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThesisTopicPayload>
          }
          update: {
            args: Prisma.ThesisTopicUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThesisTopicPayload>
          }
          deleteMany: {
            args: Prisma.ThesisTopicDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ThesisTopicUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ThesisTopicUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThesisTopicPayload>[]
          }
          upsert: {
            args: Prisma.ThesisTopicUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThesisTopicPayload>
          }
          aggregate: {
            args: Prisma.ThesisTopicAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateThesisTopic>
          }
          groupBy: {
            args: Prisma.ThesisTopicGroupByArgs<ExtArgs>
            result: $Utils.Optional<ThesisTopicGroupByOutputType>[]
          }
          count: {
            args: Prisma.ThesisTopicCountArgs<ExtArgs>
            result: $Utils.Optional<ThesisTopicCountAggregateOutputType> | number
          }
        }
      }
      ThesisProject: {
        payload: Prisma.$ThesisProjectPayload<ExtArgs>
        fields: Prisma.ThesisProjectFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ThesisProjectFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThesisProjectPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ThesisProjectFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThesisProjectPayload>
          }
          findFirst: {
            args: Prisma.ThesisProjectFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThesisProjectPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ThesisProjectFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThesisProjectPayload>
          }
          findMany: {
            args: Prisma.ThesisProjectFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThesisProjectPayload>[]
          }
          create: {
            args: Prisma.ThesisProjectCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThesisProjectPayload>
          }
          createMany: {
            args: Prisma.ThesisProjectCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ThesisProjectCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThesisProjectPayload>[]
          }
          delete: {
            args: Prisma.ThesisProjectDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThesisProjectPayload>
          }
          update: {
            args: Prisma.ThesisProjectUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThesisProjectPayload>
          }
          deleteMany: {
            args: Prisma.ThesisProjectDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ThesisProjectUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ThesisProjectUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThesisProjectPayload>[]
          }
          upsert: {
            args: Prisma.ThesisProjectUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ThesisProjectPayload>
          }
          aggregate: {
            args: Prisma.ThesisProjectAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateThesisProject>
          }
          groupBy: {
            args: Prisma.ThesisProjectGroupByArgs<ExtArgs>
            result: $Utils.Optional<ThesisProjectGroupByOutputType>[]
          }
          count: {
            args: Prisma.ThesisProjectCountArgs<ExtArgs>
            result: $Utils.Optional<ThesisProjectCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    topic?: TopicOmit
    project?: ProjectOmit
    document?: DocumentOmit
    graduationDocument?: GraduationDocumentOmit
    systemConfig?: SystemConfigOmit
    userApiSetting?: UserApiSettingOmit
    apiProvider?: ApiProviderOmit
    aiUsageLog?: AiUsageLogOmit
    thesisTopic?: ThesisTopicOmit
    thesisProject?: ThesisProjectOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    projects: number
    customTopics: number
    lockedThesisTopics: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    projects?: boolean | UserCountOutputTypeCountProjectsArgs
    customTopics?: boolean | UserCountOutputTypeCountCustomTopicsArgs
    lockedThesisTopics?: boolean | UserCountOutputTypeCountLockedThesisTopicsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountProjectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountCustomTopicsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TopicWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountLockedThesisTopicsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ThesisTopicWhereInput
  }


  /**
   * Count Type TopicCountOutputType
   */

  export type TopicCountOutputType = {
    projects: number
  }

  export type TopicCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    projects?: boolean | TopicCountOutputTypeCountProjectsArgs
  }

  // Custom InputTypes
  /**
   * TopicCountOutputType without action
   */
  export type TopicCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TopicCountOutputType
     */
    select?: TopicCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TopicCountOutputType without action
   */
  export type TopicCountOutputTypeCountProjectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectWhereInput
  }


  /**
   * Count Type ProjectCountOutputType
   */

  export type ProjectCountOutputType = {
    documents: number
    graduationDocuments: number
  }

  export type ProjectCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    documents?: boolean | ProjectCountOutputTypeCountDocumentsArgs
    graduationDocuments?: boolean | ProjectCountOutputTypeCountGraduationDocumentsArgs
  }

  // Custom InputTypes
  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ProjectCountOutputType
     */
    select?: ProjectCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountDocumentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DocumentWhereInput
  }

  /**
   * ProjectCountOutputType without action
   */
  export type ProjectCountOutputTypeCountGraduationDocumentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GraduationDocumentWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserAvgAggregateOutputType = {
    id: number | null
  }

  export type UserSumAggregateOutputType = {
    id: number | null
  }

  export type UserMinAggregateOutputType = {
    id: number | null
    studentId: string | null
    name: string | null
    major: string | null
    grade: string | null
    class: string | null
    password: string | null
    role: $Enums.Role | null
    status: $Enums.Status | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: number | null
    studentId: string | null
    name: string | null
    major: string | null
    grade: string | null
    class: string | null
    password: string | null
    role: $Enums.Role | null
    status: $Enums.Status | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    studentId: number
    name: number
    major: number
    grade: number
    class: number
    password: number
    role: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserAvgAggregateInputType = {
    id?: true
  }

  export type UserSumAggregateInputType = {
    id?: true
  }

  export type UserMinAggregateInputType = {
    id?: true
    studentId?: true
    name?: true
    major?: true
    grade?: true
    class?: true
    password?: true
    role?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    studentId?: true
    name?: true
    major?: true
    grade?: true
    class?: true
    password?: true
    role?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    studentId?: true
    name?: true
    major?: true
    grade?: true
    class?: true
    password?: true
    role?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _avg?: UserAvgAggregateInputType
    _sum?: UserSumAggregateInputType
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: number
    studentId: string
    name: string
    major: string
    grade: string
    class: string
    password: string
    role: $Enums.Role
    status: $Enums.Status
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _avg: UserAvgAggregateOutputType | null
    _sum: UserSumAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studentId?: boolean
    name?: boolean
    major?: boolean
    grade?: boolean
    class?: boolean
    password?: boolean
    role?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    projects?: boolean | User$projectsArgs<ExtArgs>
    customTopics?: boolean | User$customTopicsArgs<ExtArgs>
    thesisProject?: boolean | User$thesisProjectArgs<ExtArgs>
    lockedThesisTopics?: boolean | User$lockedThesisTopicsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studentId?: boolean
    name?: boolean
    major?: boolean
    grade?: boolean
    class?: boolean
    password?: boolean
    role?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    studentId?: boolean
    name?: boolean
    major?: boolean
    grade?: boolean
    class?: boolean
    password?: boolean
    role?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    studentId?: boolean
    name?: boolean
    major?: boolean
    grade?: boolean
    class?: boolean
    password?: boolean
    role?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "studentId" | "name" | "major" | "grade" | "class" | "password" | "role" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    projects?: boolean | User$projectsArgs<ExtArgs>
    customTopics?: boolean | User$customTopicsArgs<ExtArgs>
    thesisProject?: boolean | User$thesisProjectArgs<ExtArgs>
    lockedThesisTopics?: boolean | User$lockedThesisTopicsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      projects: Prisma.$ProjectPayload<ExtArgs>[]
      customTopics: Prisma.$TopicPayload<ExtArgs>[]
      thesisProject: Prisma.$ThesisProjectPayload<ExtArgs> | null
      lockedThesisTopics: Prisma.$ThesisTopicPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      studentId: string
      name: string
      major: string
      grade: string
      class: string
      password: string
      role: $Enums.Role
      status: $Enums.Status
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    projects<T extends User$projectsArgs<ExtArgs> = {}>(args?: Subset<T, User$projectsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    customTopics<T extends User$customTopicsArgs<ExtArgs> = {}>(args?: Subset<T, User$customTopicsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TopicPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    thesisProject<T extends User$thesisProjectArgs<ExtArgs> = {}>(args?: Subset<T, User$thesisProjectArgs<ExtArgs>>): Prisma__ThesisProjectClient<$Result.GetResult<Prisma.$ThesisProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    lockedThesisTopics<T extends User$lockedThesisTopicsArgs<ExtArgs> = {}>(args?: Subset<T, User$lockedThesisTopicsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ThesisTopicPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'Int'>
    readonly studentId: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly major: FieldRef<"User", 'String'>
    readonly grade: FieldRef<"User", 'String'>
    readonly class: FieldRef<"User", 'String'>
    readonly password: FieldRef<"User", 'String'>
    readonly role: FieldRef<"User", 'Role'>
    readonly status: FieldRef<"User", 'Status'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.projects
   */
  export type User$projectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    where?: ProjectWhereInput
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    cursor?: ProjectWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * User.customTopics
   */
  export type User$customTopicsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Topic
     */
    select?: TopicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Topic
     */
    omit?: TopicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicInclude<ExtArgs> | null
    where?: TopicWhereInput
    orderBy?: TopicOrderByWithRelationInput | TopicOrderByWithRelationInput[]
    cursor?: TopicWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TopicScalarFieldEnum | TopicScalarFieldEnum[]
  }

  /**
   * User.thesisProject
   */
  export type User$thesisProjectArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ThesisProject
     */
    select?: ThesisProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ThesisProject
     */
    omit?: ThesisProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThesisProjectInclude<ExtArgs> | null
    where?: ThesisProjectWhereInput
  }

  /**
   * User.lockedThesisTopics
   */
  export type User$lockedThesisTopicsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ThesisTopic
     */
    select?: ThesisTopicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ThesisTopic
     */
    omit?: ThesisTopicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThesisTopicInclude<ExtArgs> | null
    where?: ThesisTopicWhereInput
    orderBy?: ThesisTopicOrderByWithRelationInput | ThesisTopicOrderByWithRelationInput[]
    cursor?: ThesisTopicWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ThesisTopicScalarFieldEnum | ThesisTopicScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Topic
   */

  export type AggregateTopic = {
    _count: TopicCountAggregateOutputType | null
    _avg: TopicAvgAggregateOutputType | null
    _sum: TopicSumAggregateOutputType | null
    _min: TopicMinAggregateOutputType | null
    _max: TopicMaxAggregateOutputType | null
  }

  export type TopicAvgAggregateOutputType = {
    id: number | null
    creatorId: number | null
  }

  export type TopicSumAggregateOutputType = {
    id: number | null
    creatorId: number | null
  }

  export type TopicMinAggregateOutputType = {
    id: number | null
    title: string | null
    description: string | null
    background: string | null
    objectives: string | null
    domain: $Enums.Domain | null
    platform: $Enums.Platform | null
    type: $Enums.TopicType | null
    creatorId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TopicMaxAggregateOutputType = {
    id: number | null
    title: string | null
    description: string | null
    background: string | null
    objectives: string | null
    domain: $Enums.Domain | null
    platform: $Enums.Platform | null
    type: $Enums.TopicType | null
    creatorId: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TopicCountAggregateOutputType = {
    id: number
    title: number
    description: number
    background: number
    objectives: number
    domain: number
    platform: number
    techStack: number
    type: number
    creatorId: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TopicAvgAggregateInputType = {
    id?: true
    creatorId?: true
  }

  export type TopicSumAggregateInputType = {
    id?: true
    creatorId?: true
  }

  export type TopicMinAggregateInputType = {
    id?: true
    title?: true
    description?: true
    background?: true
    objectives?: true
    domain?: true
    platform?: true
    type?: true
    creatorId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TopicMaxAggregateInputType = {
    id?: true
    title?: true
    description?: true
    background?: true
    objectives?: true
    domain?: true
    platform?: true
    type?: true
    creatorId?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TopicCountAggregateInputType = {
    id?: true
    title?: true
    description?: true
    background?: true
    objectives?: true
    domain?: true
    platform?: true
    techStack?: true
    type?: true
    creatorId?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TopicAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Topic to aggregate.
     */
    where?: TopicWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Topics to fetch.
     */
    orderBy?: TopicOrderByWithRelationInput | TopicOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TopicWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Topics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Topics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Topics
    **/
    _count?: true | TopicCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TopicAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TopicSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TopicMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TopicMaxAggregateInputType
  }

  export type GetTopicAggregateType<T extends TopicAggregateArgs> = {
        [P in keyof T & keyof AggregateTopic]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTopic[P]>
      : GetScalarType<T[P], AggregateTopic[P]>
  }




  export type TopicGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TopicWhereInput
    orderBy?: TopicOrderByWithAggregationInput | TopicOrderByWithAggregationInput[]
    by: TopicScalarFieldEnum[] | TopicScalarFieldEnum
    having?: TopicScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TopicCountAggregateInputType | true
    _avg?: TopicAvgAggregateInputType
    _sum?: TopicSumAggregateInputType
    _min?: TopicMinAggregateInputType
    _max?: TopicMaxAggregateInputType
  }

  export type TopicGroupByOutputType = {
    id: number
    title: string
    description: string
    background: string | null
    objectives: string | null
    domain: $Enums.Domain
    platform: $Enums.Platform
    techStack: JsonValue
    type: $Enums.TopicType
    creatorId: number | null
    createdAt: Date
    updatedAt: Date
    _count: TopicCountAggregateOutputType | null
    _avg: TopicAvgAggregateOutputType | null
    _sum: TopicSumAggregateOutputType | null
    _min: TopicMinAggregateOutputType | null
    _max: TopicMaxAggregateOutputType | null
  }

  type GetTopicGroupByPayload<T extends TopicGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TopicGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TopicGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TopicGroupByOutputType[P]>
            : GetScalarType<T[P], TopicGroupByOutputType[P]>
        }
      >
    >


  export type TopicSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    background?: boolean
    objectives?: boolean
    domain?: boolean
    platform?: boolean
    techStack?: boolean
    type?: boolean
    creatorId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    creator?: boolean | Topic$creatorArgs<ExtArgs>
    projects?: boolean | Topic$projectsArgs<ExtArgs>
    _count?: boolean | TopicCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["topic"]>

  export type TopicSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    background?: boolean
    objectives?: boolean
    domain?: boolean
    platform?: boolean
    techStack?: boolean
    type?: boolean
    creatorId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    creator?: boolean | Topic$creatorArgs<ExtArgs>
  }, ExtArgs["result"]["topic"]>

  export type TopicSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    description?: boolean
    background?: boolean
    objectives?: boolean
    domain?: boolean
    platform?: boolean
    techStack?: boolean
    type?: boolean
    creatorId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    creator?: boolean | Topic$creatorArgs<ExtArgs>
  }, ExtArgs["result"]["topic"]>

  export type TopicSelectScalar = {
    id?: boolean
    title?: boolean
    description?: boolean
    background?: boolean
    objectives?: boolean
    domain?: boolean
    platform?: boolean
    techStack?: boolean
    type?: boolean
    creatorId?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TopicOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "description" | "background" | "objectives" | "domain" | "platform" | "techStack" | "type" | "creatorId" | "createdAt" | "updatedAt", ExtArgs["result"]["topic"]>
  export type TopicInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    creator?: boolean | Topic$creatorArgs<ExtArgs>
    projects?: boolean | Topic$projectsArgs<ExtArgs>
    _count?: boolean | TopicCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TopicIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    creator?: boolean | Topic$creatorArgs<ExtArgs>
  }
  export type TopicIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    creator?: boolean | Topic$creatorArgs<ExtArgs>
  }

  export type $TopicPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Topic"
    objects: {
      creator: Prisma.$UserPayload<ExtArgs> | null
      projects: Prisma.$ProjectPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      title: string
      description: string
      background: string | null
      objectives: string | null
      domain: $Enums.Domain
      platform: $Enums.Platform
      techStack: Prisma.JsonValue
      type: $Enums.TopicType
      creatorId: number | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["topic"]>
    composites: {}
  }

  type TopicGetPayload<S extends boolean | null | undefined | TopicDefaultArgs> = $Result.GetResult<Prisma.$TopicPayload, S>

  type TopicCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TopicFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TopicCountAggregateInputType | true
    }

  export interface TopicDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Topic'], meta: { name: 'Topic' } }
    /**
     * Find zero or one Topic that matches the filter.
     * @param {TopicFindUniqueArgs} args - Arguments to find a Topic
     * @example
     * // Get one Topic
     * const topic = await prisma.topic.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TopicFindUniqueArgs>(args: SelectSubset<T, TopicFindUniqueArgs<ExtArgs>>): Prisma__TopicClient<$Result.GetResult<Prisma.$TopicPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Topic that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TopicFindUniqueOrThrowArgs} args - Arguments to find a Topic
     * @example
     * // Get one Topic
     * const topic = await prisma.topic.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TopicFindUniqueOrThrowArgs>(args: SelectSubset<T, TopicFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TopicClient<$Result.GetResult<Prisma.$TopicPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Topic that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicFindFirstArgs} args - Arguments to find a Topic
     * @example
     * // Get one Topic
     * const topic = await prisma.topic.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TopicFindFirstArgs>(args?: SelectSubset<T, TopicFindFirstArgs<ExtArgs>>): Prisma__TopicClient<$Result.GetResult<Prisma.$TopicPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Topic that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicFindFirstOrThrowArgs} args - Arguments to find a Topic
     * @example
     * // Get one Topic
     * const topic = await prisma.topic.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TopicFindFirstOrThrowArgs>(args?: SelectSubset<T, TopicFindFirstOrThrowArgs<ExtArgs>>): Prisma__TopicClient<$Result.GetResult<Prisma.$TopicPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Topics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Topics
     * const topics = await prisma.topic.findMany()
     * 
     * // Get first 10 Topics
     * const topics = await prisma.topic.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const topicWithIdOnly = await prisma.topic.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TopicFindManyArgs>(args?: SelectSubset<T, TopicFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TopicPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Topic.
     * @param {TopicCreateArgs} args - Arguments to create a Topic.
     * @example
     * // Create one Topic
     * const Topic = await prisma.topic.create({
     *   data: {
     *     // ... data to create a Topic
     *   }
     * })
     * 
     */
    create<T extends TopicCreateArgs>(args: SelectSubset<T, TopicCreateArgs<ExtArgs>>): Prisma__TopicClient<$Result.GetResult<Prisma.$TopicPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Topics.
     * @param {TopicCreateManyArgs} args - Arguments to create many Topics.
     * @example
     * // Create many Topics
     * const topic = await prisma.topic.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TopicCreateManyArgs>(args?: SelectSubset<T, TopicCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Topics and returns the data saved in the database.
     * @param {TopicCreateManyAndReturnArgs} args - Arguments to create many Topics.
     * @example
     * // Create many Topics
     * const topic = await prisma.topic.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Topics and only return the `id`
     * const topicWithIdOnly = await prisma.topic.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TopicCreateManyAndReturnArgs>(args?: SelectSubset<T, TopicCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TopicPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Topic.
     * @param {TopicDeleteArgs} args - Arguments to delete one Topic.
     * @example
     * // Delete one Topic
     * const Topic = await prisma.topic.delete({
     *   where: {
     *     // ... filter to delete one Topic
     *   }
     * })
     * 
     */
    delete<T extends TopicDeleteArgs>(args: SelectSubset<T, TopicDeleteArgs<ExtArgs>>): Prisma__TopicClient<$Result.GetResult<Prisma.$TopicPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Topic.
     * @param {TopicUpdateArgs} args - Arguments to update one Topic.
     * @example
     * // Update one Topic
     * const topic = await prisma.topic.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TopicUpdateArgs>(args: SelectSubset<T, TopicUpdateArgs<ExtArgs>>): Prisma__TopicClient<$Result.GetResult<Prisma.$TopicPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Topics.
     * @param {TopicDeleteManyArgs} args - Arguments to filter Topics to delete.
     * @example
     * // Delete a few Topics
     * const { count } = await prisma.topic.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TopicDeleteManyArgs>(args?: SelectSubset<T, TopicDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Topics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Topics
     * const topic = await prisma.topic.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TopicUpdateManyArgs>(args: SelectSubset<T, TopicUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Topics and returns the data updated in the database.
     * @param {TopicUpdateManyAndReturnArgs} args - Arguments to update many Topics.
     * @example
     * // Update many Topics
     * const topic = await prisma.topic.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Topics and only return the `id`
     * const topicWithIdOnly = await prisma.topic.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TopicUpdateManyAndReturnArgs>(args: SelectSubset<T, TopicUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TopicPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Topic.
     * @param {TopicUpsertArgs} args - Arguments to update or create a Topic.
     * @example
     * // Update or create a Topic
     * const topic = await prisma.topic.upsert({
     *   create: {
     *     // ... data to create a Topic
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Topic we want to update
     *   }
     * })
     */
    upsert<T extends TopicUpsertArgs>(args: SelectSubset<T, TopicUpsertArgs<ExtArgs>>): Prisma__TopicClient<$Result.GetResult<Prisma.$TopicPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Topics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicCountArgs} args - Arguments to filter Topics to count.
     * @example
     * // Count the number of Topics
     * const count = await prisma.topic.count({
     *   where: {
     *     // ... the filter for the Topics we want to count
     *   }
     * })
    **/
    count<T extends TopicCountArgs>(
      args?: Subset<T, TopicCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TopicCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Topic.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TopicAggregateArgs>(args: Subset<T, TopicAggregateArgs>): Prisma.PrismaPromise<GetTopicAggregateType<T>>

    /**
     * Group by Topic.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TopicGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TopicGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TopicGroupByArgs['orderBy'] }
        : { orderBy?: TopicGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TopicGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTopicGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Topic model
   */
  readonly fields: TopicFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Topic.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TopicClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    creator<T extends Topic$creatorArgs<ExtArgs> = {}>(args?: Subset<T, Topic$creatorArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    projects<T extends Topic$projectsArgs<ExtArgs> = {}>(args?: Subset<T, Topic$projectsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Topic model
   */
  interface TopicFieldRefs {
    readonly id: FieldRef<"Topic", 'Int'>
    readonly title: FieldRef<"Topic", 'String'>
    readonly description: FieldRef<"Topic", 'String'>
    readonly background: FieldRef<"Topic", 'String'>
    readonly objectives: FieldRef<"Topic", 'String'>
    readonly domain: FieldRef<"Topic", 'Domain'>
    readonly platform: FieldRef<"Topic", 'Platform'>
    readonly techStack: FieldRef<"Topic", 'Json'>
    readonly type: FieldRef<"Topic", 'TopicType'>
    readonly creatorId: FieldRef<"Topic", 'Int'>
    readonly createdAt: FieldRef<"Topic", 'DateTime'>
    readonly updatedAt: FieldRef<"Topic", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Topic findUnique
   */
  export type TopicFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Topic
     */
    select?: TopicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Topic
     */
    omit?: TopicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicInclude<ExtArgs> | null
    /**
     * Filter, which Topic to fetch.
     */
    where: TopicWhereUniqueInput
  }

  /**
   * Topic findUniqueOrThrow
   */
  export type TopicFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Topic
     */
    select?: TopicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Topic
     */
    omit?: TopicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicInclude<ExtArgs> | null
    /**
     * Filter, which Topic to fetch.
     */
    where: TopicWhereUniqueInput
  }

  /**
   * Topic findFirst
   */
  export type TopicFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Topic
     */
    select?: TopicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Topic
     */
    omit?: TopicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicInclude<ExtArgs> | null
    /**
     * Filter, which Topic to fetch.
     */
    where?: TopicWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Topics to fetch.
     */
    orderBy?: TopicOrderByWithRelationInput | TopicOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Topics.
     */
    cursor?: TopicWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Topics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Topics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Topics.
     */
    distinct?: TopicScalarFieldEnum | TopicScalarFieldEnum[]
  }

  /**
   * Topic findFirstOrThrow
   */
  export type TopicFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Topic
     */
    select?: TopicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Topic
     */
    omit?: TopicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicInclude<ExtArgs> | null
    /**
     * Filter, which Topic to fetch.
     */
    where?: TopicWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Topics to fetch.
     */
    orderBy?: TopicOrderByWithRelationInput | TopicOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Topics.
     */
    cursor?: TopicWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Topics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Topics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Topics.
     */
    distinct?: TopicScalarFieldEnum | TopicScalarFieldEnum[]
  }

  /**
   * Topic findMany
   */
  export type TopicFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Topic
     */
    select?: TopicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Topic
     */
    omit?: TopicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicInclude<ExtArgs> | null
    /**
     * Filter, which Topics to fetch.
     */
    where?: TopicWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Topics to fetch.
     */
    orderBy?: TopicOrderByWithRelationInput | TopicOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Topics.
     */
    cursor?: TopicWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Topics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Topics.
     */
    skip?: number
    distinct?: TopicScalarFieldEnum | TopicScalarFieldEnum[]
  }

  /**
   * Topic create
   */
  export type TopicCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Topic
     */
    select?: TopicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Topic
     */
    omit?: TopicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicInclude<ExtArgs> | null
    /**
     * The data needed to create a Topic.
     */
    data: XOR<TopicCreateInput, TopicUncheckedCreateInput>
  }

  /**
   * Topic createMany
   */
  export type TopicCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Topics.
     */
    data: TopicCreateManyInput | TopicCreateManyInput[]
  }

  /**
   * Topic createManyAndReturn
   */
  export type TopicCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Topic
     */
    select?: TopicSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Topic
     */
    omit?: TopicOmit<ExtArgs> | null
    /**
     * The data used to create many Topics.
     */
    data: TopicCreateManyInput | TopicCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Topic update
   */
  export type TopicUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Topic
     */
    select?: TopicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Topic
     */
    omit?: TopicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicInclude<ExtArgs> | null
    /**
     * The data needed to update a Topic.
     */
    data: XOR<TopicUpdateInput, TopicUncheckedUpdateInput>
    /**
     * Choose, which Topic to update.
     */
    where: TopicWhereUniqueInput
  }

  /**
   * Topic updateMany
   */
  export type TopicUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Topics.
     */
    data: XOR<TopicUpdateManyMutationInput, TopicUncheckedUpdateManyInput>
    /**
     * Filter which Topics to update
     */
    where?: TopicWhereInput
    /**
     * Limit how many Topics to update.
     */
    limit?: number
  }

  /**
   * Topic updateManyAndReturn
   */
  export type TopicUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Topic
     */
    select?: TopicSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Topic
     */
    omit?: TopicOmit<ExtArgs> | null
    /**
     * The data used to update Topics.
     */
    data: XOR<TopicUpdateManyMutationInput, TopicUncheckedUpdateManyInput>
    /**
     * Filter which Topics to update
     */
    where?: TopicWhereInput
    /**
     * Limit how many Topics to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Topic upsert
   */
  export type TopicUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Topic
     */
    select?: TopicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Topic
     */
    omit?: TopicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicInclude<ExtArgs> | null
    /**
     * The filter to search for the Topic to update in case it exists.
     */
    where: TopicWhereUniqueInput
    /**
     * In case the Topic found by the `where` argument doesn't exist, create a new Topic with this data.
     */
    create: XOR<TopicCreateInput, TopicUncheckedCreateInput>
    /**
     * In case the Topic was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TopicUpdateInput, TopicUncheckedUpdateInput>
  }

  /**
   * Topic delete
   */
  export type TopicDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Topic
     */
    select?: TopicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Topic
     */
    omit?: TopicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicInclude<ExtArgs> | null
    /**
     * Filter which Topic to delete.
     */
    where: TopicWhereUniqueInput
  }

  /**
   * Topic deleteMany
   */
  export type TopicDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Topics to delete
     */
    where?: TopicWhereInput
    /**
     * Limit how many Topics to delete.
     */
    limit?: number
  }

  /**
   * Topic.creator
   */
  export type Topic$creatorArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * Topic.projects
   */
  export type Topic$projectsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    where?: ProjectWhereInput
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    cursor?: ProjectWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Topic without action
   */
  export type TopicDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Topic
     */
    select?: TopicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Topic
     */
    omit?: TopicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TopicInclude<ExtArgs> | null
  }


  /**
   * Model Project
   */

  export type AggregateProject = {
    _count: ProjectCountAggregateOutputType | null
    _avg: ProjectAvgAggregateOutputType | null
    _sum: ProjectSumAggregateOutputType | null
    _min: ProjectMinAggregateOutputType | null
    _max: ProjectMaxAggregateOutputType | null
  }

  export type ProjectAvgAggregateOutputType = {
    id: number | null
    userId: number | null
    topicId: number | null
  }

  export type ProjectSumAggregateOutputType = {
    id: number | null
    userId: number | null
    topicId: number | null
  }

  export type ProjectMinAggregateOutputType = {
    id: number | null
    userId: number | null
    topicId: number | null
    status: $Enums.ProjectStatus | null
    techStack: string | null
    reviewStatus: $Enums.ReviewStatus | null
    repoUrl: string | null
    deployUrl: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProjectMaxAggregateOutputType = {
    id: number | null
    userId: number | null
    topicId: number | null
    status: $Enums.ProjectStatus | null
    techStack: string | null
    reviewStatus: $Enums.ReviewStatus | null
    repoUrl: string | null
    deployUrl: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ProjectCountAggregateOutputType = {
    id: number
    userId: number
    topicId: number
    status: number
    techStack: number
    documentsRef: number
    reviewStatus: number
    reviewResult: number
    repoUrl: number
    repoSyncData: number
    deployUrl: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ProjectAvgAggregateInputType = {
    id?: true
    userId?: true
    topicId?: true
  }

  export type ProjectSumAggregateInputType = {
    id?: true
    userId?: true
    topicId?: true
  }

  export type ProjectMinAggregateInputType = {
    id?: true
    userId?: true
    topicId?: true
    status?: true
    techStack?: true
    reviewStatus?: true
    repoUrl?: true
    deployUrl?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProjectMaxAggregateInputType = {
    id?: true
    userId?: true
    topicId?: true
    status?: true
    techStack?: true
    reviewStatus?: true
    repoUrl?: true
    deployUrl?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ProjectCountAggregateInputType = {
    id?: true
    userId?: true
    topicId?: true
    status?: true
    techStack?: true
    documentsRef?: true
    reviewStatus?: true
    reviewResult?: true
    repoUrl?: true
    repoSyncData?: true
    deployUrl?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ProjectAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Project to aggregate.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Projects
    **/
    _count?: true | ProjectCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ProjectAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ProjectSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ProjectMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ProjectMaxAggregateInputType
  }

  export type GetProjectAggregateType<T extends ProjectAggregateArgs> = {
        [P in keyof T & keyof AggregateProject]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateProject[P]>
      : GetScalarType<T[P], AggregateProject[P]>
  }




  export type ProjectGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ProjectWhereInput
    orderBy?: ProjectOrderByWithAggregationInput | ProjectOrderByWithAggregationInput[]
    by: ProjectScalarFieldEnum[] | ProjectScalarFieldEnum
    having?: ProjectScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ProjectCountAggregateInputType | true
    _avg?: ProjectAvgAggregateInputType
    _sum?: ProjectSumAggregateInputType
    _min?: ProjectMinAggregateInputType
    _max?: ProjectMaxAggregateInputType
  }

  export type ProjectGroupByOutputType = {
    id: number
    userId: number
    topicId: number
    status: $Enums.ProjectStatus
    techStack: string | null
    documentsRef: JsonValue | null
    reviewStatus: $Enums.ReviewStatus
    reviewResult: JsonValue | null
    repoUrl: string | null
    repoSyncData: JsonValue | null
    deployUrl: string | null
    createdAt: Date
    updatedAt: Date
    _count: ProjectCountAggregateOutputType | null
    _avg: ProjectAvgAggregateOutputType | null
    _sum: ProjectSumAggregateOutputType | null
    _min: ProjectMinAggregateOutputType | null
    _max: ProjectMaxAggregateOutputType | null
  }

  type GetProjectGroupByPayload<T extends ProjectGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ProjectGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ProjectGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ProjectGroupByOutputType[P]>
            : GetScalarType<T[P], ProjectGroupByOutputType[P]>
        }
      >
    >


  export type ProjectSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    topicId?: boolean
    status?: boolean
    techStack?: boolean
    documentsRef?: boolean
    reviewStatus?: boolean
    reviewResult?: boolean
    repoUrl?: boolean
    repoSyncData?: boolean
    deployUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    topic?: boolean | TopicDefaultArgs<ExtArgs>
    documents?: boolean | Project$documentsArgs<ExtArgs>
    graduationDocuments?: boolean | Project$graduationDocumentsArgs<ExtArgs>
    thesisProject?: boolean | Project$thesisProjectArgs<ExtArgs>
    _count?: boolean | ProjectCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    topicId?: boolean
    status?: boolean
    techStack?: boolean
    documentsRef?: boolean
    reviewStatus?: boolean
    reviewResult?: boolean
    repoUrl?: boolean
    repoSyncData?: boolean
    deployUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    topic?: boolean | TopicDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    topicId?: boolean
    status?: boolean
    techStack?: boolean
    documentsRef?: boolean
    reviewStatus?: boolean
    reviewResult?: boolean
    repoUrl?: boolean
    repoSyncData?: boolean
    deployUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    topic?: boolean | TopicDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["project"]>

  export type ProjectSelectScalar = {
    id?: boolean
    userId?: boolean
    topicId?: boolean
    status?: boolean
    techStack?: boolean
    documentsRef?: boolean
    reviewStatus?: boolean
    reviewResult?: boolean
    repoUrl?: boolean
    repoSyncData?: boolean
    deployUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ProjectOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "topicId" | "status" | "techStack" | "documentsRef" | "reviewStatus" | "reviewResult" | "repoUrl" | "repoSyncData" | "deployUrl" | "createdAt" | "updatedAt", ExtArgs["result"]["project"]>
  export type ProjectInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    topic?: boolean | TopicDefaultArgs<ExtArgs>
    documents?: boolean | Project$documentsArgs<ExtArgs>
    graduationDocuments?: boolean | Project$graduationDocumentsArgs<ExtArgs>
    thesisProject?: boolean | Project$thesisProjectArgs<ExtArgs>
    _count?: boolean | ProjectCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type ProjectIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    topic?: boolean | TopicDefaultArgs<ExtArgs>
  }
  export type ProjectIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    topic?: boolean | TopicDefaultArgs<ExtArgs>
  }

  export type $ProjectPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Project"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      topic: Prisma.$TopicPayload<ExtArgs>
      documents: Prisma.$DocumentPayload<ExtArgs>[]
      graduationDocuments: Prisma.$GraduationDocumentPayload<ExtArgs>[]
      thesisProject: Prisma.$ThesisProjectPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: number
      topicId: number
      status: $Enums.ProjectStatus
      techStack: string | null
      documentsRef: Prisma.JsonValue | null
      reviewStatus: $Enums.ReviewStatus
      reviewResult: Prisma.JsonValue | null
      repoUrl: string | null
      repoSyncData: Prisma.JsonValue | null
      deployUrl: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["project"]>
    composites: {}
  }

  type ProjectGetPayload<S extends boolean | null | undefined | ProjectDefaultArgs> = $Result.GetResult<Prisma.$ProjectPayload, S>

  type ProjectCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ProjectFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ProjectCountAggregateInputType | true
    }

  export interface ProjectDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Project'], meta: { name: 'Project' } }
    /**
     * Find zero or one Project that matches the filter.
     * @param {ProjectFindUniqueArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ProjectFindUniqueArgs>(args: SelectSubset<T, ProjectFindUniqueArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Project that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ProjectFindUniqueOrThrowArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ProjectFindUniqueOrThrowArgs>(args: SelectSubset<T, ProjectFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Project that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindFirstArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ProjectFindFirstArgs>(args?: SelectSubset<T, ProjectFindFirstArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Project that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindFirstOrThrowArgs} args - Arguments to find a Project
     * @example
     * // Get one Project
     * const project = await prisma.project.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ProjectFindFirstOrThrowArgs>(args?: SelectSubset<T, ProjectFindFirstOrThrowArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Projects that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Projects
     * const projects = await prisma.project.findMany()
     * 
     * // Get first 10 Projects
     * const projects = await prisma.project.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const projectWithIdOnly = await prisma.project.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ProjectFindManyArgs>(args?: SelectSubset<T, ProjectFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Project.
     * @param {ProjectCreateArgs} args - Arguments to create a Project.
     * @example
     * // Create one Project
     * const Project = await prisma.project.create({
     *   data: {
     *     // ... data to create a Project
     *   }
     * })
     * 
     */
    create<T extends ProjectCreateArgs>(args: SelectSubset<T, ProjectCreateArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Projects.
     * @param {ProjectCreateManyArgs} args - Arguments to create many Projects.
     * @example
     * // Create many Projects
     * const project = await prisma.project.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ProjectCreateManyArgs>(args?: SelectSubset<T, ProjectCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Projects and returns the data saved in the database.
     * @param {ProjectCreateManyAndReturnArgs} args - Arguments to create many Projects.
     * @example
     * // Create many Projects
     * const project = await prisma.project.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Projects and only return the `id`
     * const projectWithIdOnly = await prisma.project.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ProjectCreateManyAndReturnArgs>(args?: SelectSubset<T, ProjectCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Project.
     * @param {ProjectDeleteArgs} args - Arguments to delete one Project.
     * @example
     * // Delete one Project
     * const Project = await prisma.project.delete({
     *   where: {
     *     // ... filter to delete one Project
     *   }
     * })
     * 
     */
    delete<T extends ProjectDeleteArgs>(args: SelectSubset<T, ProjectDeleteArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Project.
     * @param {ProjectUpdateArgs} args - Arguments to update one Project.
     * @example
     * // Update one Project
     * const project = await prisma.project.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ProjectUpdateArgs>(args: SelectSubset<T, ProjectUpdateArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Projects.
     * @param {ProjectDeleteManyArgs} args - Arguments to filter Projects to delete.
     * @example
     * // Delete a few Projects
     * const { count } = await prisma.project.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ProjectDeleteManyArgs>(args?: SelectSubset<T, ProjectDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Projects
     * const project = await prisma.project.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ProjectUpdateManyArgs>(args: SelectSubset<T, ProjectUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Projects and returns the data updated in the database.
     * @param {ProjectUpdateManyAndReturnArgs} args - Arguments to update many Projects.
     * @example
     * // Update many Projects
     * const project = await prisma.project.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Projects and only return the `id`
     * const projectWithIdOnly = await prisma.project.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ProjectUpdateManyAndReturnArgs>(args: SelectSubset<T, ProjectUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Project.
     * @param {ProjectUpsertArgs} args - Arguments to update or create a Project.
     * @example
     * // Update or create a Project
     * const project = await prisma.project.upsert({
     *   create: {
     *     // ... data to create a Project
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Project we want to update
     *   }
     * })
     */
    upsert<T extends ProjectUpsertArgs>(args: SelectSubset<T, ProjectUpsertArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Projects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectCountArgs} args - Arguments to filter Projects to count.
     * @example
     * // Count the number of Projects
     * const count = await prisma.project.count({
     *   where: {
     *     // ... the filter for the Projects we want to count
     *   }
     * })
    **/
    count<T extends ProjectCountArgs>(
      args?: Subset<T, ProjectCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ProjectCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Project.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ProjectAggregateArgs>(args: Subset<T, ProjectAggregateArgs>): Prisma.PrismaPromise<GetProjectAggregateType<T>>

    /**
     * Group by Project.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ProjectGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ProjectGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ProjectGroupByArgs['orderBy'] }
        : { orderBy?: ProjectGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ProjectGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProjectGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Project model
   */
  readonly fields: ProjectFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Project.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ProjectClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    topic<T extends TopicDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TopicDefaultArgs<ExtArgs>>): Prisma__TopicClient<$Result.GetResult<Prisma.$TopicPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    documents<T extends Project$documentsArgs<ExtArgs> = {}>(args?: Subset<T, Project$documentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    graduationDocuments<T extends Project$graduationDocumentsArgs<ExtArgs> = {}>(args?: Subset<T, Project$graduationDocumentsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GraduationDocumentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    thesisProject<T extends Project$thesisProjectArgs<ExtArgs> = {}>(args?: Subset<T, Project$thesisProjectArgs<ExtArgs>>): Prisma__ThesisProjectClient<$Result.GetResult<Prisma.$ThesisProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Project model
   */
  interface ProjectFieldRefs {
    readonly id: FieldRef<"Project", 'Int'>
    readonly userId: FieldRef<"Project", 'Int'>
    readonly topicId: FieldRef<"Project", 'Int'>
    readonly status: FieldRef<"Project", 'ProjectStatus'>
    readonly techStack: FieldRef<"Project", 'String'>
    readonly documentsRef: FieldRef<"Project", 'Json'>
    readonly reviewStatus: FieldRef<"Project", 'ReviewStatus'>
    readonly reviewResult: FieldRef<"Project", 'Json'>
    readonly repoUrl: FieldRef<"Project", 'String'>
    readonly repoSyncData: FieldRef<"Project", 'Json'>
    readonly deployUrl: FieldRef<"Project", 'String'>
    readonly createdAt: FieldRef<"Project", 'DateTime'>
    readonly updatedAt: FieldRef<"Project", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Project findUnique
   */
  export type ProjectFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project findUniqueOrThrow
   */
  export type ProjectFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project findFirst
   */
  export type ProjectFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project findFirstOrThrow
   */
  export type ProjectFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Project to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Projects.
     */
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project findMany
   */
  export type ProjectFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter, which Projects to fetch.
     */
    where?: ProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Projects to fetch.
     */
    orderBy?: ProjectOrderByWithRelationInput | ProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Projects.
     */
    cursor?: ProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Projects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Projects.
     */
    skip?: number
    distinct?: ProjectScalarFieldEnum | ProjectScalarFieldEnum[]
  }

  /**
   * Project create
   */
  export type ProjectCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The data needed to create a Project.
     */
    data: XOR<ProjectCreateInput, ProjectUncheckedCreateInput>
  }

  /**
   * Project createMany
   */
  export type ProjectCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Projects.
     */
    data: ProjectCreateManyInput | ProjectCreateManyInput[]
  }

  /**
   * Project createManyAndReturn
   */
  export type ProjectCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * The data used to create many Projects.
     */
    data: ProjectCreateManyInput | ProjectCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Project update
   */
  export type ProjectUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The data needed to update a Project.
     */
    data: XOR<ProjectUpdateInput, ProjectUncheckedUpdateInput>
    /**
     * Choose, which Project to update.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project updateMany
   */
  export type ProjectUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Projects.
     */
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyInput>
    /**
     * Filter which Projects to update
     */
    where?: ProjectWhereInput
    /**
     * Limit how many Projects to update.
     */
    limit?: number
  }

  /**
   * Project updateManyAndReturn
   */
  export type ProjectUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * The data used to update Projects.
     */
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyInput>
    /**
     * Filter which Projects to update
     */
    where?: ProjectWhereInput
    /**
     * Limit how many Projects to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Project upsert
   */
  export type ProjectUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * The filter to search for the Project to update in case it exists.
     */
    where: ProjectWhereUniqueInput
    /**
     * In case the Project found by the `where` argument doesn't exist, create a new Project with this data.
     */
    create: XOR<ProjectCreateInput, ProjectUncheckedCreateInput>
    /**
     * In case the Project was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ProjectUpdateInput, ProjectUncheckedUpdateInput>
  }

  /**
   * Project delete
   */
  export type ProjectDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    /**
     * Filter which Project to delete.
     */
    where: ProjectWhereUniqueInput
  }

  /**
   * Project deleteMany
   */
  export type ProjectDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Projects to delete
     */
    where?: ProjectWhereInput
    /**
     * Limit how many Projects to delete.
     */
    limit?: number
  }

  /**
   * Project.documents
   */
  export type Project$documentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    where?: DocumentWhereInput
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    cursor?: DocumentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DocumentScalarFieldEnum | DocumentScalarFieldEnum[]
  }

  /**
   * Project.graduationDocuments
   */
  export type Project$graduationDocumentsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GraduationDocument
     */
    select?: GraduationDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GraduationDocument
     */
    omit?: GraduationDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GraduationDocumentInclude<ExtArgs> | null
    where?: GraduationDocumentWhereInput
    orderBy?: GraduationDocumentOrderByWithRelationInput | GraduationDocumentOrderByWithRelationInput[]
    cursor?: GraduationDocumentWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GraduationDocumentScalarFieldEnum | GraduationDocumentScalarFieldEnum[]
  }

  /**
   * Project.thesisProject
   */
  export type Project$thesisProjectArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ThesisProject
     */
    select?: ThesisProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ThesisProject
     */
    omit?: ThesisProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThesisProjectInclude<ExtArgs> | null
    where?: ThesisProjectWhereInput
  }

  /**
   * Project without action
   */
  export type ProjectDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
  }


  /**
   * Model Document
   */

  export type AggregateDocument = {
    _count: DocumentCountAggregateOutputType | null
    _avg: DocumentAvgAggregateOutputType | null
    _sum: DocumentSumAggregateOutputType | null
    _min: DocumentMinAggregateOutputType | null
    _max: DocumentMaxAggregateOutputType | null
  }

  export type DocumentAvgAggregateOutputType = {
    id: number | null
    projectId: number | null
  }

  export type DocumentSumAggregateOutputType = {
    id: number | null
    projectId: number | null
  }

  export type DocumentMinAggregateOutputType = {
    id: number | null
    projectId: number | null
    docType: $Enums.DocType | null
    content: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DocumentMaxAggregateOutputType = {
    id: number | null
    projectId: number | null
    docType: $Enums.DocType | null
    content: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DocumentCountAggregateOutputType = {
    id: number
    projectId: number
    docType: number
    content: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DocumentAvgAggregateInputType = {
    id?: true
    projectId?: true
  }

  export type DocumentSumAggregateInputType = {
    id?: true
    projectId?: true
  }

  export type DocumentMinAggregateInputType = {
    id?: true
    projectId?: true
    docType?: true
    content?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DocumentMaxAggregateInputType = {
    id?: true
    projectId?: true
    docType?: true
    content?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DocumentCountAggregateInputType = {
    id?: true
    projectId?: true
    docType?: true
    content?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DocumentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Document to aggregate.
     */
    where?: DocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Documents to fetch.
     */
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Documents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Documents
    **/
    _count?: true | DocumentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DocumentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DocumentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DocumentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DocumentMaxAggregateInputType
  }

  export type GetDocumentAggregateType<T extends DocumentAggregateArgs> = {
        [P in keyof T & keyof AggregateDocument]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDocument[P]>
      : GetScalarType<T[P], AggregateDocument[P]>
  }




  export type DocumentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DocumentWhereInput
    orderBy?: DocumentOrderByWithAggregationInput | DocumentOrderByWithAggregationInput[]
    by: DocumentScalarFieldEnum[] | DocumentScalarFieldEnum
    having?: DocumentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DocumentCountAggregateInputType | true
    _avg?: DocumentAvgAggregateInputType
    _sum?: DocumentSumAggregateInputType
    _min?: DocumentMinAggregateInputType
    _max?: DocumentMaxAggregateInputType
  }

  export type DocumentGroupByOutputType = {
    id: number
    projectId: number
    docType: $Enums.DocType
    content: string
    createdAt: Date
    updatedAt: Date
    _count: DocumentCountAggregateOutputType | null
    _avg: DocumentAvgAggregateOutputType | null
    _sum: DocumentSumAggregateOutputType | null
    _min: DocumentMinAggregateOutputType | null
    _max: DocumentMaxAggregateOutputType | null
  }

  type GetDocumentGroupByPayload<T extends DocumentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DocumentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DocumentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DocumentGroupByOutputType[P]>
            : GetScalarType<T[P], DocumentGroupByOutputType[P]>
        }
      >
    >


  export type DocumentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    docType?: boolean
    content?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["document"]>

  export type DocumentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    docType?: boolean
    content?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["document"]>

  export type DocumentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    docType?: boolean
    content?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["document"]>

  export type DocumentSelectScalar = {
    id?: boolean
    projectId?: boolean
    docType?: boolean
    content?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type DocumentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "projectId" | "docType" | "content" | "createdAt" | "updatedAt", ExtArgs["result"]["document"]>
  export type DocumentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type DocumentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type DocumentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }

  export type $DocumentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Document"
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      projectId: number
      docType: $Enums.DocType
      content: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["document"]>
    composites: {}
  }

  type DocumentGetPayload<S extends boolean | null | undefined | DocumentDefaultArgs> = $Result.GetResult<Prisma.$DocumentPayload, S>

  type DocumentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DocumentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DocumentCountAggregateInputType | true
    }

  export interface DocumentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Document'], meta: { name: 'Document' } }
    /**
     * Find zero or one Document that matches the filter.
     * @param {DocumentFindUniqueArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DocumentFindUniqueArgs>(args: SelectSubset<T, DocumentFindUniqueArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Document that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DocumentFindUniqueOrThrowArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DocumentFindUniqueOrThrowArgs>(args: SelectSubset<T, DocumentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Document that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentFindFirstArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DocumentFindFirstArgs>(args?: SelectSubset<T, DocumentFindFirstArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Document that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentFindFirstOrThrowArgs} args - Arguments to find a Document
     * @example
     * // Get one Document
     * const document = await prisma.document.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DocumentFindFirstOrThrowArgs>(args?: SelectSubset<T, DocumentFindFirstOrThrowArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Documents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Documents
     * const documents = await prisma.document.findMany()
     * 
     * // Get first 10 Documents
     * const documents = await prisma.document.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const documentWithIdOnly = await prisma.document.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DocumentFindManyArgs>(args?: SelectSubset<T, DocumentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Document.
     * @param {DocumentCreateArgs} args - Arguments to create a Document.
     * @example
     * // Create one Document
     * const Document = await prisma.document.create({
     *   data: {
     *     // ... data to create a Document
     *   }
     * })
     * 
     */
    create<T extends DocumentCreateArgs>(args: SelectSubset<T, DocumentCreateArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Documents.
     * @param {DocumentCreateManyArgs} args - Arguments to create many Documents.
     * @example
     * // Create many Documents
     * const document = await prisma.document.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DocumentCreateManyArgs>(args?: SelectSubset<T, DocumentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Documents and returns the data saved in the database.
     * @param {DocumentCreateManyAndReturnArgs} args - Arguments to create many Documents.
     * @example
     * // Create many Documents
     * const document = await prisma.document.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Documents and only return the `id`
     * const documentWithIdOnly = await prisma.document.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DocumentCreateManyAndReturnArgs>(args?: SelectSubset<T, DocumentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Document.
     * @param {DocumentDeleteArgs} args - Arguments to delete one Document.
     * @example
     * // Delete one Document
     * const Document = await prisma.document.delete({
     *   where: {
     *     // ... filter to delete one Document
     *   }
     * })
     * 
     */
    delete<T extends DocumentDeleteArgs>(args: SelectSubset<T, DocumentDeleteArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Document.
     * @param {DocumentUpdateArgs} args - Arguments to update one Document.
     * @example
     * // Update one Document
     * const document = await prisma.document.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DocumentUpdateArgs>(args: SelectSubset<T, DocumentUpdateArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Documents.
     * @param {DocumentDeleteManyArgs} args - Arguments to filter Documents to delete.
     * @example
     * // Delete a few Documents
     * const { count } = await prisma.document.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DocumentDeleteManyArgs>(args?: SelectSubset<T, DocumentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Documents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Documents
     * const document = await prisma.document.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DocumentUpdateManyArgs>(args: SelectSubset<T, DocumentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Documents and returns the data updated in the database.
     * @param {DocumentUpdateManyAndReturnArgs} args - Arguments to update many Documents.
     * @example
     * // Update many Documents
     * const document = await prisma.document.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Documents and only return the `id`
     * const documentWithIdOnly = await prisma.document.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DocumentUpdateManyAndReturnArgs>(args: SelectSubset<T, DocumentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Document.
     * @param {DocumentUpsertArgs} args - Arguments to update or create a Document.
     * @example
     * // Update or create a Document
     * const document = await prisma.document.upsert({
     *   create: {
     *     // ... data to create a Document
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Document we want to update
     *   }
     * })
     */
    upsert<T extends DocumentUpsertArgs>(args: SelectSubset<T, DocumentUpsertArgs<ExtArgs>>): Prisma__DocumentClient<$Result.GetResult<Prisma.$DocumentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Documents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentCountArgs} args - Arguments to filter Documents to count.
     * @example
     * // Count the number of Documents
     * const count = await prisma.document.count({
     *   where: {
     *     // ... the filter for the Documents we want to count
     *   }
     * })
    **/
    count<T extends DocumentCountArgs>(
      args?: Subset<T, DocumentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DocumentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Document.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DocumentAggregateArgs>(args: Subset<T, DocumentAggregateArgs>): Prisma.PrismaPromise<GetDocumentAggregateType<T>>

    /**
     * Group by Document.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DocumentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DocumentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DocumentGroupByArgs['orderBy'] }
        : { orderBy?: DocumentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DocumentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDocumentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Document model
   */
  readonly fields: DocumentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Document.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DocumentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectDefaultArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Document model
   */
  interface DocumentFieldRefs {
    readonly id: FieldRef<"Document", 'Int'>
    readonly projectId: FieldRef<"Document", 'Int'>
    readonly docType: FieldRef<"Document", 'DocType'>
    readonly content: FieldRef<"Document", 'String'>
    readonly createdAt: FieldRef<"Document", 'DateTime'>
    readonly updatedAt: FieldRef<"Document", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Document findUnique
   */
  export type DocumentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Document to fetch.
     */
    where: DocumentWhereUniqueInput
  }

  /**
   * Document findUniqueOrThrow
   */
  export type DocumentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Document to fetch.
     */
    where: DocumentWhereUniqueInput
  }

  /**
   * Document findFirst
   */
  export type DocumentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Document to fetch.
     */
    where?: DocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Documents to fetch.
     */
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Documents.
     */
    cursor?: DocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Documents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Documents.
     */
    distinct?: DocumentScalarFieldEnum | DocumentScalarFieldEnum[]
  }

  /**
   * Document findFirstOrThrow
   */
  export type DocumentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Document to fetch.
     */
    where?: DocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Documents to fetch.
     */
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Documents.
     */
    cursor?: DocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Documents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Documents.
     */
    distinct?: DocumentScalarFieldEnum | DocumentScalarFieldEnum[]
  }

  /**
   * Document findMany
   */
  export type DocumentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter, which Documents to fetch.
     */
    where?: DocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Documents to fetch.
     */
    orderBy?: DocumentOrderByWithRelationInput | DocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Documents.
     */
    cursor?: DocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Documents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Documents.
     */
    skip?: number
    distinct?: DocumentScalarFieldEnum | DocumentScalarFieldEnum[]
  }

  /**
   * Document create
   */
  export type DocumentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * The data needed to create a Document.
     */
    data: XOR<DocumentCreateInput, DocumentUncheckedCreateInput>
  }

  /**
   * Document createMany
   */
  export type DocumentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Documents.
     */
    data: DocumentCreateManyInput | DocumentCreateManyInput[]
  }

  /**
   * Document createManyAndReturn
   */
  export type DocumentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * The data used to create many Documents.
     */
    data: DocumentCreateManyInput | DocumentCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Document update
   */
  export type DocumentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * The data needed to update a Document.
     */
    data: XOR<DocumentUpdateInput, DocumentUncheckedUpdateInput>
    /**
     * Choose, which Document to update.
     */
    where: DocumentWhereUniqueInput
  }

  /**
   * Document updateMany
   */
  export type DocumentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Documents.
     */
    data: XOR<DocumentUpdateManyMutationInput, DocumentUncheckedUpdateManyInput>
    /**
     * Filter which Documents to update
     */
    where?: DocumentWhereInput
    /**
     * Limit how many Documents to update.
     */
    limit?: number
  }

  /**
   * Document updateManyAndReturn
   */
  export type DocumentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * The data used to update Documents.
     */
    data: XOR<DocumentUpdateManyMutationInput, DocumentUncheckedUpdateManyInput>
    /**
     * Filter which Documents to update
     */
    where?: DocumentWhereInput
    /**
     * Limit how many Documents to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Document upsert
   */
  export type DocumentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * The filter to search for the Document to update in case it exists.
     */
    where: DocumentWhereUniqueInput
    /**
     * In case the Document found by the `where` argument doesn't exist, create a new Document with this data.
     */
    create: XOR<DocumentCreateInput, DocumentUncheckedCreateInput>
    /**
     * In case the Document was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DocumentUpdateInput, DocumentUncheckedUpdateInput>
  }

  /**
   * Document delete
   */
  export type DocumentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
    /**
     * Filter which Document to delete.
     */
    where: DocumentWhereUniqueInput
  }

  /**
   * Document deleteMany
   */
  export type DocumentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Documents to delete
     */
    where?: DocumentWhereInput
    /**
     * Limit how many Documents to delete.
     */
    limit?: number
  }

  /**
   * Document without action
   */
  export type DocumentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Document
     */
    select?: DocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Document
     */
    omit?: DocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DocumentInclude<ExtArgs> | null
  }


  /**
   * Model GraduationDocument
   */

  export type AggregateGraduationDocument = {
    _count: GraduationDocumentCountAggregateOutputType | null
    _avg: GraduationDocumentAvgAggregateOutputType | null
    _sum: GraduationDocumentSumAggregateOutputType | null
    _min: GraduationDocumentMinAggregateOutputType | null
    _max: GraduationDocumentMaxAggregateOutputType | null
  }

  export type GraduationDocumentAvgAggregateOutputType = {
    id: number | null
    projectId: number | null
  }

  export type GraduationDocumentSumAggregateOutputType = {
    id: number | null
    projectId: number | null
  }

  export type GraduationDocumentMinAggregateOutputType = {
    id: number | null
    projectId: number | null
    docType: $Enums.GraduationDocType | null
    content: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type GraduationDocumentMaxAggregateOutputType = {
    id: number | null
    projectId: number | null
    docType: $Enums.GraduationDocType | null
    content: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type GraduationDocumentCountAggregateOutputType = {
    id: number
    projectId: number
    docType: number
    content: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type GraduationDocumentAvgAggregateInputType = {
    id?: true
    projectId?: true
  }

  export type GraduationDocumentSumAggregateInputType = {
    id?: true
    projectId?: true
  }

  export type GraduationDocumentMinAggregateInputType = {
    id?: true
    projectId?: true
    docType?: true
    content?: true
    createdAt?: true
    updatedAt?: true
  }

  export type GraduationDocumentMaxAggregateInputType = {
    id?: true
    projectId?: true
    docType?: true
    content?: true
    createdAt?: true
    updatedAt?: true
  }

  export type GraduationDocumentCountAggregateInputType = {
    id?: true
    projectId?: true
    docType?: true
    content?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type GraduationDocumentAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GraduationDocument to aggregate.
     */
    where?: GraduationDocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GraduationDocuments to fetch.
     */
    orderBy?: GraduationDocumentOrderByWithRelationInput | GraduationDocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GraduationDocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GraduationDocuments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GraduationDocuments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GraduationDocuments
    **/
    _count?: true | GraduationDocumentCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GraduationDocumentAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GraduationDocumentSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GraduationDocumentMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GraduationDocumentMaxAggregateInputType
  }

  export type GetGraduationDocumentAggregateType<T extends GraduationDocumentAggregateArgs> = {
        [P in keyof T & keyof AggregateGraduationDocument]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGraduationDocument[P]>
      : GetScalarType<T[P], AggregateGraduationDocument[P]>
  }




  export type GraduationDocumentGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GraduationDocumentWhereInput
    orderBy?: GraduationDocumentOrderByWithAggregationInput | GraduationDocumentOrderByWithAggregationInput[]
    by: GraduationDocumentScalarFieldEnum[] | GraduationDocumentScalarFieldEnum
    having?: GraduationDocumentScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GraduationDocumentCountAggregateInputType | true
    _avg?: GraduationDocumentAvgAggregateInputType
    _sum?: GraduationDocumentSumAggregateInputType
    _min?: GraduationDocumentMinAggregateInputType
    _max?: GraduationDocumentMaxAggregateInputType
  }

  export type GraduationDocumentGroupByOutputType = {
    id: number
    projectId: number
    docType: $Enums.GraduationDocType
    content: string
    createdAt: Date
    updatedAt: Date
    _count: GraduationDocumentCountAggregateOutputType | null
    _avg: GraduationDocumentAvgAggregateOutputType | null
    _sum: GraduationDocumentSumAggregateOutputType | null
    _min: GraduationDocumentMinAggregateOutputType | null
    _max: GraduationDocumentMaxAggregateOutputType | null
  }

  type GetGraduationDocumentGroupByPayload<T extends GraduationDocumentGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GraduationDocumentGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GraduationDocumentGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GraduationDocumentGroupByOutputType[P]>
            : GetScalarType<T[P], GraduationDocumentGroupByOutputType[P]>
        }
      >
    >


  export type GraduationDocumentSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    docType?: boolean
    content?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["graduationDocument"]>

  export type GraduationDocumentSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    docType?: boolean
    content?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["graduationDocument"]>

  export type GraduationDocumentSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    projectId?: boolean
    docType?: boolean
    content?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["graduationDocument"]>

  export type GraduationDocumentSelectScalar = {
    id?: boolean
    projectId?: boolean
    docType?: boolean
    content?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type GraduationDocumentOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "projectId" | "docType" | "content" | "createdAt" | "updatedAt", ExtArgs["result"]["graduationDocument"]>
  export type GraduationDocumentInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type GraduationDocumentIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }
  export type GraduationDocumentIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    project?: boolean | ProjectDefaultArgs<ExtArgs>
  }

  export type $GraduationDocumentPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GraduationDocument"
    objects: {
      project: Prisma.$ProjectPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      projectId: number
      docType: $Enums.GraduationDocType
      content: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["graduationDocument"]>
    composites: {}
  }

  type GraduationDocumentGetPayload<S extends boolean | null | undefined | GraduationDocumentDefaultArgs> = $Result.GetResult<Prisma.$GraduationDocumentPayload, S>

  type GraduationDocumentCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<GraduationDocumentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: GraduationDocumentCountAggregateInputType | true
    }

  export interface GraduationDocumentDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GraduationDocument'], meta: { name: 'GraduationDocument' } }
    /**
     * Find zero or one GraduationDocument that matches the filter.
     * @param {GraduationDocumentFindUniqueArgs} args - Arguments to find a GraduationDocument
     * @example
     * // Get one GraduationDocument
     * const graduationDocument = await prisma.graduationDocument.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GraduationDocumentFindUniqueArgs>(args: SelectSubset<T, GraduationDocumentFindUniqueArgs<ExtArgs>>): Prisma__GraduationDocumentClient<$Result.GetResult<Prisma.$GraduationDocumentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one GraduationDocument that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {GraduationDocumentFindUniqueOrThrowArgs} args - Arguments to find a GraduationDocument
     * @example
     * // Get one GraduationDocument
     * const graduationDocument = await prisma.graduationDocument.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GraduationDocumentFindUniqueOrThrowArgs>(args: SelectSubset<T, GraduationDocumentFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GraduationDocumentClient<$Result.GetResult<Prisma.$GraduationDocumentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GraduationDocument that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GraduationDocumentFindFirstArgs} args - Arguments to find a GraduationDocument
     * @example
     * // Get one GraduationDocument
     * const graduationDocument = await prisma.graduationDocument.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GraduationDocumentFindFirstArgs>(args?: SelectSubset<T, GraduationDocumentFindFirstArgs<ExtArgs>>): Prisma__GraduationDocumentClient<$Result.GetResult<Prisma.$GraduationDocumentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first GraduationDocument that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GraduationDocumentFindFirstOrThrowArgs} args - Arguments to find a GraduationDocument
     * @example
     * // Get one GraduationDocument
     * const graduationDocument = await prisma.graduationDocument.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GraduationDocumentFindFirstOrThrowArgs>(args?: SelectSubset<T, GraduationDocumentFindFirstOrThrowArgs<ExtArgs>>): Prisma__GraduationDocumentClient<$Result.GetResult<Prisma.$GraduationDocumentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more GraduationDocuments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GraduationDocumentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GraduationDocuments
     * const graduationDocuments = await prisma.graduationDocument.findMany()
     * 
     * // Get first 10 GraduationDocuments
     * const graduationDocuments = await prisma.graduationDocument.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const graduationDocumentWithIdOnly = await prisma.graduationDocument.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GraduationDocumentFindManyArgs>(args?: SelectSubset<T, GraduationDocumentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GraduationDocumentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a GraduationDocument.
     * @param {GraduationDocumentCreateArgs} args - Arguments to create a GraduationDocument.
     * @example
     * // Create one GraduationDocument
     * const GraduationDocument = await prisma.graduationDocument.create({
     *   data: {
     *     // ... data to create a GraduationDocument
     *   }
     * })
     * 
     */
    create<T extends GraduationDocumentCreateArgs>(args: SelectSubset<T, GraduationDocumentCreateArgs<ExtArgs>>): Prisma__GraduationDocumentClient<$Result.GetResult<Prisma.$GraduationDocumentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many GraduationDocuments.
     * @param {GraduationDocumentCreateManyArgs} args - Arguments to create many GraduationDocuments.
     * @example
     * // Create many GraduationDocuments
     * const graduationDocument = await prisma.graduationDocument.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GraduationDocumentCreateManyArgs>(args?: SelectSubset<T, GraduationDocumentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many GraduationDocuments and returns the data saved in the database.
     * @param {GraduationDocumentCreateManyAndReturnArgs} args - Arguments to create many GraduationDocuments.
     * @example
     * // Create many GraduationDocuments
     * const graduationDocument = await prisma.graduationDocument.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many GraduationDocuments and only return the `id`
     * const graduationDocumentWithIdOnly = await prisma.graduationDocument.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends GraduationDocumentCreateManyAndReturnArgs>(args?: SelectSubset<T, GraduationDocumentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GraduationDocumentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a GraduationDocument.
     * @param {GraduationDocumentDeleteArgs} args - Arguments to delete one GraduationDocument.
     * @example
     * // Delete one GraduationDocument
     * const GraduationDocument = await prisma.graduationDocument.delete({
     *   where: {
     *     // ... filter to delete one GraduationDocument
     *   }
     * })
     * 
     */
    delete<T extends GraduationDocumentDeleteArgs>(args: SelectSubset<T, GraduationDocumentDeleteArgs<ExtArgs>>): Prisma__GraduationDocumentClient<$Result.GetResult<Prisma.$GraduationDocumentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one GraduationDocument.
     * @param {GraduationDocumentUpdateArgs} args - Arguments to update one GraduationDocument.
     * @example
     * // Update one GraduationDocument
     * const graduationDocument = await prisma.graduationDocument.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GraduationDocumentUpdateArgs>(args: SelectSubset<T, GraduationDocumentUpdateArgs<ExtArgs>>): Prisma__GraduationDocumentClient<$Result.GetResult<Prisma.$GraduationDocumentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more GraduationDocuments.
     * @param {GraduationDocumentDeleteManyArgs} args - Arguments to filter GraduationDocuments to delete.
     * @example
     * // Delete a few GraduationDocuments
     * const { count } = await prisma.graduationDocument.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GraduationDocumentDeleteManyArgs>(args?: SelectSubset<T, GraduationDocumentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GraduationDocuments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GraduationDocumentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GraduationDocuments
     * const graduationDocument = await prisma.graduationDocument.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GraduationDocumentUpdateManyArgs>(args: SelectSubset<T, GraduationDocumentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GraduationDocuments and returns the data updated in the database.
     * @param {GraduationDocumentUpdateManyAndReturnArgs} args - Arguments to update many GraduationDocuments.
     * @example
     * // Update many GraduationDocuments
     * const graduationDocument = await prisma.graduationDocument.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more GraduationDocuments and only return the `id`
     * const graduationDocumentWithIdOnly = await prisma.graduationDocument.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends GraduationDocumentUpdateManyAndReturnArgs>(args: SelectSubset<T, GraduationDocumentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GraduationDocumentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one GraduationDocument.
     * @param {GraduationDocumentUpsertArgs} args - Arguments to update or create a GraduationDocument.
     * @example
     * // Update or create a GraduationDocument
     * const graduationDocument = await prisma.graduationDocument.upsert({
     *   create: {
     *     // ... data to create a GraduationDocument
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GraduationDocument we want to update
     *   }
     * })
     */
    upsert<T extends GraduationDocumentUpsertArgs>(args: SelectSubset<T, GraduationDocumentUpsertArgs<ExtArgs>>): Prisma__GraduationDocumentClient<$Result.GetResult<Prisma.$GraduationDocumentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of GraduationDocuments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GraduationDocumentCountArgs} args - Arguments to filter GraduationDocuments to count.
     * @example
     * // Count the number of GraduationDocuments
     * const count = await prisma.graduationDocument.count({
     *   where: {
     *     // ... the filter for the GraduationDocuments we want to count
     *   }
     * })
    **/
    count<T extends GraduationDocumentCountArgs>(
      args?: Subset<T, GraduationDocumentCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GraduationDocumentCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GraduationDocument.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GraduationDocumentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GraduationDocumentAggregateArgs>(args: Subset<T, GraduationDocumentAggregateArgs>): Prisma.PrismaPromise<GetGraduationDocumentAggregateType<T>>

    /**
     * Group by GraduationDocument.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GraduationDocumentGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GraduationDocumentGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GraduationDocumentGroupByArgs['orderBy'] }
        : { orderBy?: GraduationDocumentGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GraduationDocumentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGraduationDocumentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GraduationDocument model
   */
  readonly fields: GraduationDocumentFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GraduationDocument.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GraduationDocumentClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    project<T extends ProjectDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ProjectDefaultArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the GraduationDocument model
   */
  interface GraduationDocumentFieldRefs {
    readonly id: FieldRef<"GraduationDocument", 'Int'>
    readonly projectId: FieldRef<"GraduationDocument", 'Int'>
    readonly docType: FieldRef<"GraduationDocument", 'GraduationDocType'>
    readonly content: FieldRef<"GraduationDocument", 'String'>
    readonly createdAt: FieldRef<"GraduationDocument", 'DateTime'>
    readonly updatedAt: FieldRef<"GraduationDocument", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * GraduationDocument findUnique
   */
  export type GraduationDocumentFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GraduationDocument
     */
    select?: GraduationDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GraduationDocument
     */
    omit?: GraduationDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GraduationDocumentInclude<ExtArgs> | null
    /**
     * Filter, which GraduationDocument to fetch.
     */
    where: GraduationDocumentWhereUniqueInput
  }

  /**
   * GraduationDocument findUniqueOrThrow
   */
  export type GraduationDocumentFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GraduationDocument
     */
    select?: GraduationDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GraduationDocument
     */
    omit?: GraduationDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GraduationDocumentInclude<ExtArgs> | null
    /**
     * Filter, which GraduationDocument to fetch.
     */
    where: GraduationDocumentWhereUniqueInput
  }

  /**
   * GraduationDocument findFirst
   */
  export type GraduationDocumentFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GraduationDocument
     */
    select?: GraduationDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GraduationDocument
     */
    omit?: GraduationDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GraduationDocumentInclude<ExtArgs> | null
    /**
     * Filter, which GraduationDocument to fetch.
     */
    where?: GraduationDocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GraduationDocuments to fetch.
     */
    orderBy?: GraduationDocumentOrderByWithRelationInput | GraduationDocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GraduationDocuments.
     */
    cursor?: GraduationDocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GraduationDocuments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GraduationDocuments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GraduationDocuments.
     */
    distinct?: GraduationDocumentScalarFieldEnum | GraduationDocumentScalarFieldEnum[]
  }

  /**
   * GraduationDocument findFirstOrThrow
   */
  export type GraduationDocumentFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GraduationDocument
     */
    select?: GraduationDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GraduationDocument
     */
    omit?: GraduationDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GraduationDocumentInclude<ExtArgs> | null
    /**
     * Filter, which GraduationDocument to fetch.
     */
    where?: GraduationDocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GraduationDocuments to fetch.
     */
    orderBy?: GraduationDocumentOrderByWithRelationInput | GraduationDocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GraduationDocuments.
     */
    cursor?: GraduationDocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GraduationDocuments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GraduationDocuments.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GraduationDocuments.
     */
    distinct?: GraduationDocumentScalarFieldEnum | GraduationDocumentScalarFieldEnum[]
  }

  /**
   * GraduationDocument findMany
   */
  export type GraduationDocumentFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GraduationDocument
     */
    select?: GraduationDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GraduationDocument
     */
    omit?: GraduationDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GraduationDocumentInclude<ExtArgs> | null
    /**
     * Filter, which GraduationDocuments to fetch.
     */
    where?: GraduationDocumentWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GraduationDocuments to fetch.
     */
    orderBy?: GraduationDocumentOrderByWithRelationInput | GraduationDocumentOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GraduationDocuments.
     */
    cursor?: GraduationDocumentWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GraduationDocuments from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GraduationDocuments.
     */
    skip?: number
    distinct?: GraduationDocumentScalarFieldEnum | GraduationDocumentScalarFieldEnum[]
  }

  /**
   * GraduationDocument create
   */
  export type GraduationDocumentCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GraduationDocument
     */
    select?: GraduationDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GraduationDocument
     */
    omit?: GraduationDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GraduationDocumentInclude<ExtArgs> | null
    /**
     * The data needed to create a GraduationDocument.
     */
    data: XOR<GraduationDocumentCreateInput, GraduationDocumentUncheckedCreateInput>
  }

  /**
   * GraduationDocument createMany
   */
  export type GraduationDocumentCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GraduationDocuments.
     */
    data: GraduationDocumentCreateManyInput | GraduationDocumentCreateManyInput[]
  }

  /**
   * GraduationDocument createManyAndReturn
   */
  export type GraduationDocumentCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GraduationDocument
     */
    select?: GraduationDocumentSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GraduationDocument
     */
    omit?: GraduationDocumentOmit<ExtArgs> | null
    /**
     * The data used to create many GraduationDocuments.
     */
    data: GraduationDocumentCreateManyInput | GraduationDocumentCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GraduationDocumentIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * GraduationDocument update
   */
  export type GraduationDocumentUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GraduationDocument
     */
    select?: GraduationDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GraduationDocument
     */
    omit?: GraduationDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GraduationDocumentInclude<ExtArgs> | null
    /**
     * The data needed to update a GraduationDocument.
     */
    data: XOR<GraduationDocumentUpdateInput, GraduationDocumentUncheckedUpdateInput>
    /**
     * Choose, which GraduationDocument to update.
     */
    where: GraduationDocumentWhereUniqueInput
  }

  /**
   * GraduationDocument updateMany
   */
  export type GraduationDocumentUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GraduationDocuments.
     */
    data: XOR<GraduationDocumentUpdateManyMutationInput, GraduationDocumentUncheckedUpdateManyInput>
    /**
     * Filter which GraduationDocuments to update
     */
    where?: GraduationDocumentWhereInput
    /**
     * Limit how many GraduationDocuments to update.
     */
    limit?: number
  }

  /**
   * GraduationDocument updateManyAndReturn
   */
  export type GraduationDocumentUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GraduationDocument
     */
    select?: GraduationDocumentSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the GraduationDocument
     */
    omit?: GraduationDocumentOmit<ExtArgs> | null
    /**
     * The data used to update GraduationDocuments.
     */
    data: XOR<GraduationDocumentUpdateManyMutationInput, GraduationDocumentUncheckedUpdateManyInput>
    /**
     * Filter which GraduationDocuments to update
     */
    where?: GraduationDocumentWhereInput
    /**
     * Limit how many GraduationDocuments to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GraduationDocumentIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * GraduationDocument upsert
   */
  export type GraduationDocumentUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GraduationDocument
     */
    select?: GraduationDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GraduationDocument
     */
    omit?: GraduationDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GraduationDocumentInclude<ExtArgs> | null
    /**
     * The filter to search for the GraduationDocument to update in case it exists.
     */
    where: GraduationDocumentWhereUniqueInput
    /**
     * In case the GraduationDocument found by the `where` argument doesn't exist, create a new GraduationDocument with this data.
     */
    create: XOR<GraduationDocumentCreateInput, GraduationDocumentUncheckedCreateInput>
    /**
     * In case the GraduationDocument was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GraduationDocumentUpdateInput, GraduationDocumentUncheckedUpdateInput>
  }

  /**
   * GraduationDocument delete
   */
  export type GraduationDocumentDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GraduationDocument
     */
    select?: GraduationDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GraduationDocument
     */
    omit?: GraduationDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GraduationDocumentInclude<ExtArgs> | null
    /**
     * Filter which GraduationDocument to delete.
     */
    where: GraduationDocumentWhereUniqueInput
  }

  /**
   * GraduationDocument deleteMany
   */
  export type GraduationDocumentDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GraduationDocuments to delete
     */
    where?: GraduationDocumentWhereInput
    /**
     * Limit how many GraduationDocuments to delete.
     */
    limit?: number
  }

  /**
   * GraduationDocument without action
   */
  export type GraduationDocumentDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GraduationDocument
     */
    select?: GraduationDocumentSelect<ExtArgs> | null
    /**
     * Omit specific fields from the GraduationDocument
     */
    omit?: GraduationDocumentOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GraduationDocumentInclude<ExtArgs> | null
  }


  /**
   * Model SystemConfig
   */

  export type AggregateSystemConfig = {
    _count: SystemConfigCountAggregateOutputType | null
    _avg: SystemConfigAvgAggregateOutputType | null
    _sum: SystemConfigSumAggregateOutputType | null
    _min: SystemConfigMinAggregateOutputType | null
    _max: SystemConfigMaxAggregateOutputType | null
  }

  export type SystemConfigAvgAggregateOutputType = {
    id: number | null
  }

  export type SystemConfigSumAggregateOutputType = {
    id: number | null
  }

  export type SystemConfigMinAggregateOutputType = {
    id: number | null
    key: string | null
    value: string | null
    description: string | null
    updatedAt: Date | null
  }

  export type SystemConfigMaxAggregateOutputType = {
    id: number | null
    key: string | null
    value: string | null
    description: string | null
    updatedAt: Date | null
  }

  export type SystemConfigCountAggregateOutputType = {
    id: number
    key: number
    value: number
    description: number
    updatedAt: number
    _all: number
  }


  export type SystemConfigAvgAggregateInputType = {
    id?: true
  }

  export type SystemConfigSumAggregateInputType = {
    id?: true
  }

  export type SystemConfigMinAggregateInputType = {
    id?: true
    key?: true
    value?: true
    description?: true
    updatedAt?: true
  }

  export type SystemConfigMaxAggregateInputType = {
    id?: true
    key?: true
    value?: true
    description?: true
    updatedAt?: true
  }

  export type SystemConfigCountAggregateInputType = {
    id?: true
    key?: true
    value?: true
    description?: true
    updatedAt?: true
    _all?: true
  }

  export type SystemConfigAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SystemConfig to aggregate.
     */
    where?: SystemConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemConfigs to fetch.
     */
    orderBy?: SystemConfigOrderByWithRelationInput | SystemConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SystemConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SystemConfigs
    **/
    _count?: true | SystemConfigCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SystemConfigAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SystemConfigSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SystemConfigMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SystemConfigMaxAggregateInputType
  }

  export type GetSystemConfigAggregateType<T extends SystemConfigAggregateArgs> = {
        [P in keyof T & keyof AggregateSystemConfig]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSystemConfig[P]>
      : GetScalarType<T[P], AggregateSystemConfig[P]>
  }




  export type SystemConfigGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SystemConfigWhereInput
    orderBy?: SystemConfigOrderByWithAggregationInput | SystemConfigOrderByWithAggregationInput[]
    by: SystemConfigScalarFieldEnum[] | SystemConfigScalarFieldEnum
    having?: SystemConfigScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SystemConfigCountAggregateInputType | true
    _avg?: SystemConfigAvgAggregateInputType
    _sum?: SystemConfigSumAggregateInputType
    _min?: SystemConfigMinAggregateInputType
    _max?: SystemConfigMaxAggregateInputType
  }

  export type SystemConfigGroupByOutputType = {
    id: number
    key: string
    value: string
    description: string | null
    updatedAt: Date
    _count: SystemConfigCountAggregateOutputType | null
    _avg: SystemConfigAvgAggregateOutputType | null
    _sum: SystemConfigSumAggregateOutputType | null
    _min: SystemConfigMinAggregateOutputType | null
    _max: SystemConfigMaxAggregateOutputType | null
  }

  type GetSystemConfigGroupByPayload<T extends SystemConfigGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SystemConfigGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SystemConfigGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SystemConfigGroupByOutputType[P]>
            : GetScalarType<T[P], SystemConfigGroupByOutputType[P]>
        }
      >
    >


  export type SystemConfigSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    key?: boolean
    value?: boolean
    description?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["systemConfig"]>

  export type SystemConfigSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    key?: boolean
    value?: boolean
    description?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["systemConfig"]>

  export type SystemConfigSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    key?: boolean
    value?: boolean
    description?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["systemConfig"]>

  export type SystemConfigSelectScalar = {
    id?: boolean
    key?: boolean
    value?: boolean
    description?: boolean
    updatedAt?: boolean
  }

  export type SystemConfigOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "key" | "value" | "description" | "updatedAt", ExtArgs["result"]["systemConfig"]>

  export type $SystemConfigPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SystemConfig"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      key: string
      value: string
      description: string | null
      updatedAt: Date
    }, ExtArgs["result"]["systemConfig"]>
    composites: {}
  }

  type SystemConfigGetPayload<S extends boolean | null | undefined | SystemConfigDefaultArgs> = $Result.GetResult<Prisma.$SystemConfigPayload, S>

  type SystemConfigCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SystemConfigFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SystemConfigCountAggregateInputType | true
    }

  export interface SystemConfigDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SystemConfig'], meta: { name: 'SystemConfig' } }
    /**
     * Find zero or one SystemConfig that matches the filter.
     * @param {SystemConfigFindUniqueArgs} args - Arguments to find a SystemConfig
     * @example
     * // Get one SystemConfig
     * const systemConfig = await prisma.systemConfig.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SystemConfigFindUniqueArgs>(args: SelectSubset<T, SystemConfigFindUniqueArgs<ExtArgs>>): Prisma__SystemConfigClient<$Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SystemConfig that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SystemConfigFindUniqueOrThrowArgs} args - Arguments to find a SystemConfig
     * @example
     * // Get one SystemConfig
     * const systemConfig = await prisma.systemConfig.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SystemConfigFindUniqueOrThrowArgs>(args: SelectSubset<T, SystemConfigFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SystemConfigClient<$Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SystemConfig that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemConfigFindFirstArgs} args - Arguments to find a SystemConfig
     * @example
     * // Get one SystemConfig
     * const systemConfig = await prisma.systemConfig.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SystemConfigFindFirstArgs>(args?: SelectSubset<T, SystemConfigFindFirstArgs<ExtArgs>>): Prisma__SystemConfigClient<$Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SystemConfig that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemConfigFindFirstOrThrowArgs} args - Arguments to find a SystemConfig
     * @example
     * // Get one SystemConfig
     * const systemConfig = await prisma.systemConfig.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SystemConfigFindFirstOrThrowArgs>(args?: SelectSubset<T, SystemConfigFindFirstOrThrowArgs<ExtArgs>>): Prisma__SystemConfigClient<$Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SystemConfigs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemConfigFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SystemConfigs
     * const systemConfigs = await prisma.systemConfig.findMany()
     * 
     * // Get first 10 SystemConfigs
     * const systemConfigs = await prisma.systemConfig.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const systemConfigWithIdOnly = await prisma.systemConfig.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SystemConfigFindManyArgs>(args?: SelectSubset<T, SystemConfigFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SystemConfig.
     * @param {SystemConfigCreateArgs} args - Arguments to create a SystemConfig.
     * @example
     * // Create one SystemConfig
     * const SystemConfig = await prisma.systemConfig.create({
     *   data: {
     *     // ... data to create a SystemConfig
     *   }
     * })
     * 
     */
    create<T extends SystemConfigCreateArgs>(args: SelectSubset<T, SystemConfigCreateArgs<ExtArgs>>): Prisma__SystemConfigClient<$Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SystemConfigs.
     * @param {SystemConfigCreateManyArgs} args - Arguments to create many SystemConfigs.
     * @example
     * // Create many SystemConfigs
     * const systemConfig = await prisma.systemConfig.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SystemConfigCreateManyArgs>(args?: SelectSubset<T, SystemConfigCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SystemConfigs and returns the data saved in the database.
     * @param {SystemConfigCreateManyAndReturnArgs} args - Arguments to create many SystemConfigs.
     * @example
     * // Create many SystemConfigs
     * const systemConfig = await prisma.systemConfig.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SystemConfigs and only return the `id`
     * const systemConfigWithIdOnly = await prisma.systemConfig.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SystemConfigCreateManyAndReturnArgs>(args?: SelectSubset<T, SystemConfigCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SystemConfig.
     * @param {SystemConfigDeleteArgs} args - Arguments to delete one SystemConfig.
     * @example
     * // Delete one SystemConfig
     * const SystemConfig = await prisma.systemConfig.delete({
     *   where: {
     *     // ... filter to delete one SystemConfig
     *   }
     * })
     * 
     */
    delete<T extends SystemConfigDeleteArgs>(args: SelectSubset<T, SystemConfigDeleteArgs<ExtArgs>>): Prisma__SystemConfigClient<$Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SystemConfig.
     * @param {SystemConfigUpdateArgs} args - Arguments to update one SystemConfig.
     * @example
     * // Update one SystemConfig
     * const systemConfig = await prisma.systemConfig.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SystemConfigUpdateArgs>(args: SelectSubset<T, SystemConfigUpdateArgs<ExtArgs>>): Prisma__SystemConfigClient<$Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SystemConfigs.
     * @param {SystemConfigDeleteManyArgs} args - Arguments to filter SystemConfigs to delete.
     * @example
     * // Delete a few SystemConfigs
     * const { count } = await prisma.systemConfig.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SystemConfigDeleteManyArgs>(args?: SelectSubset<T, SystemConfigDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SystemConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemConfigUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SystemConfigs
     * const systemConfig = await prisma.systemConfig.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SystemConfigUpdateManyArgs>(args: SelectSubset<T, SystemConfigUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SystemConfigs and returns the data updated in the database.
     * @param {SystemConfigUpdateManyAndReturnArgs} args - Arguments to update many SystemConfigs.
     * @example
     * // Update many SystemConfigs
     * const systemConfig = await prisma.systemConfig.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SystemConfigs and only return the `id`
     * const systemConfigWithIdOnly = await prisma.systemConfig.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SystemConfigUpdateManyAndReturnArgs>(args: SelectSubset<T, SystemConfigUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SystemConfig.
     * @param {SystemConfigUpsertArgs} args - Arguments to update or create a SystemConfig.
     * @example
     * // Update or create a SystemConfig
     * const systemConfig = await prisma.systemConfig.upsert({
     *   create: {
     *     // ... data to create a SystemConfig
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SystemConfig we want to update
     *   }
     * })
     */
    upsert<T extends SystemConfigUpsertArgs>(args: SelectSubset<T, SystemConfigUpsertArgs<ExtArgs>>): Prisma__SystemConfigClient<$Result.GetResult<Prisma.$SystemConfigPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SystemConfigs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemConfigCountArgs} args - Arguments to filter SystemConfigs to count.
     * @example
     * // Count the number of SystemConfigs
     * const count = await prisma.systemConfig.count({
     *   where: {
     *     // ... the filter for the SystemConfigs we want to count
     *   }
     * })
    **/
    count<T extends SystemConfigCountArgs>(
      args?: Subset<T, SystemConfigCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SystemConfigCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SystemConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemConfigAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SystemConfigAggregateArgs>(args: Subset<T, SystemConfigAggregateArgs>): Prisma.PrismaPromise<GetSystemConfigAggregateType<T>>

    /**
     * Group by SystemConfig.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SystemConfigGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SystemConfigGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SystemConfigGroupByArgs['orderBy'] }
        : { orderBy?: SystemConfigGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SystemConfigGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSystemConfigGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SystemConfig model
   */
  readonly fields: SystemConfigFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SystemConfig.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SystemConfigClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SystemConfig model
   */
  interface SystemConfigFieldRefs {
    readonly id: FieldRef<"SystemConfig", 'Int'>
    readonly key: FieldRef<"SystemConfig", 'String'>
    readonly value: FieldRef<"SystemConfig", 'String'>
    readonly description: FieldRef<"SystemConfig", 'String'>
    readonly updatedAt: FieldRef<"SystemConfig", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SystemConfig findUnique
   */
  export type SystemConfigFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
    /**
     * Filter, which SystemConfig to fetch.
     */
    where: SystemConfigWhereUniqueInput
  }

  /**
   * SystemConfig findUniqueOrThrow
   */
  export type SystemConfigFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
    /**
     * Filter, which SystemConfig to fetch.
     */
    where: SystemConfigWhereUniqueInput
  }

  /**
   * SystemConfig findFirst
   */
  export type SystemConfigFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
    /**
     * Filter, which SystemConfig to fetch.
     */
    where?: SystemConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemConfigs to fetch.
     */
    orderBy?: SystemConfigOrderByWithRelationInput | SystemConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SystemConfigs.
     */
    cursor?: SystemConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SystemConfigs.
     */
    distinct?: SystemConfigScalarFieldEnum | SystemConfigScalarFieldEnum[]
  }

  /**
   * SystemConfig findFirstOrThrow
   */
  export type SystemConfigFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
    /**
     * Filter, which SystemConfig to fetch.
     */
    where?: SystemConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemConfigs to fetch.
     */
    orderBy?: SystemConfigOrderByWithRelationInput | SystemConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SystemConfigs.
     */
    cursor?: SystemConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemConfigs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SystemConfigs.
     */
    distinct?: SystemConfigScalarFieldEnum | SystemConfigScalarFieldEnum[]
  }

  /**
   * SystemConfig findMany
   */
  export type SystemConfigFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
    /**
     * Filter, which SystemConfigs to fetch.
     */
    where?: SystemConfigWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SystemConfigs to fetch.
     */
    orderBy?: SystemConfigOrderByWithRelationInput | SystemConfigOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SystemConfigs.
     */
    cursor?: SystemConfigWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SystemConfigs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SystemConfigs.
     */
    skip?: number
    distinct?: SystemConfigScalarFieldEnum | SystemConfigScalarFieldEnum[]
  }

  /**
   * SystemConfig create
   */
  export type SystemConfigCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
    /**
     * The data needed to create a SystemConfig.
     */
    data: XOR<SystemConfigCreateInput, SystemConfigUncheckedCreateInput>
  }

  /**
   * SystemConfig createMany
   */
  export type SystemConfigCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SystemConfigs.
     */
    data: SystemConfigCreateManyInput | SystemConfigCreateManyInput[]
  }

  /**
   * SystemConfig createManyAndReturn
   */
  export type SystemConfigCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
    /**
     * The data used to create many SystemConfigs.
     */
    data: SystemConfigCreateManyInput | SystemConfigCreateManyInput[]
  }

  /**
   * SystemConfig update
   */
  export type SystemConfigUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
    /**
     * The data needed to update a SystemConfig.
     */
    data: XOR<SystemConfigUpdateInput, SystemConfigUncheckedUpdateInput>
    /**
     * Choose, which SystemConfig to update.
     */
    where: SystemConfigWhereUniqueInput
  }

  /**
   * SystemConfig updateMany
   */
  export type SystemConfigUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SystemConfigs.
     */
    data: XOR<SystemConfigUpdateManyMutationInput, SystemConfigUncheckedUpdateManyInput>
    /**
     * Filter which SystemConfigs to update
     */
    where?: SystemConfigWhereInput
    /**
     * Limit how many SystemConfigs to update.
     */
    limit?: number
  }

  /**
   * SystemConfig updateManyAndReturn
   */
  export type SystemConfigUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
    /**
     * The data used to update SystemConfigs.
     */
    data: XOR<SystemConfigUpdateManyMutationInput, SystemConfigUncheckedUpdateManyInput>
    /**
     * Filter which SystemConfigs to update
     */
    where?: SystemConfigWhereInput
    /**
     * Limit how many SystemConfigs to update.
     */
    limit?: number
  }

  /**
   * SystemConfig upsert
   */
  export type SystemConfigUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
    /**
     * The filter to search for the SystemConfig to update in case it exists.
     */
    where: SystemConfigWhereUniqueInput
    /**
     * In case the SystemConfig found by the `where` argument doesn't exist, create a new SystemConfig with this data.
     */
    create: XOR<SystemConfigCreateInput, SystemConfigUncheckedCreateInput>
    /**
     * In case the SystemConfig was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SystemConfigUpdateInput, SystemConfigUncheckedUpdateInput>
  }

  /**
   * SystemConfig delete
   */
  export type SystemConfigDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
    /**
     * Filter which SystemConfig to delete.
     */
    where: SystemConfigWhereUniqueInput
  }

  /**
   * SystemConfig deleteMany
   */
  export type SystemConfigDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SystemConfigs to delete
     */
    where?: SystemConfigWhereInput
    /**
     * Limit how many SystemConfigs to delete.
     */
    limit?: number
  }

  /**
   * SystemConfig without action
   */
  export type SystemConfigDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SystemConfig
     */
    select?: SystemConfigSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SystemConfig
     */
    omit?: SystemConfigOmit<ExtArgs> | null
  }


  /**
   * Model UserApiSetting
   */

  export type AggregateUserApiSetting = {
    _count: UserApiSettingCountAggregateOutputType | null
    _avg: UserApiSettingAvgAggregateOutputType | null
    _sum: UserApiSettingSumAggregateOutputType | null
    _min: UserApiSettingMinAggregateOutputType | null
    _max: UserApiSettingMaxAggregateOutputType | null
  }

  export type UserApiSettingAvgAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type UserApiSettingSumAggregateOutputType = {
    id: number | null
    userId: number | null
  }

  export type UserApiSettingMinAggregateOutputType = {
    id: number | null
    userId: number | null
    baseURL: string | null
    apiKey: string | null
    model: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserApiSettingMaxAggregateOutputType = {
    id: number | null
    userId: number | null
    baseURL: string | null
    apiKey: string | null
    model: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserApiSettingCountAggregateOutputType = {
    id: number
    userId: number
    baseURL: number
    apiKey: number
    model: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserApiSettingAvgAggregateInputType = {
    id?: true
    userId?: true
  }

  export type UserApiSettingSumAggregateInputType = {
    id?: true
    userId?: true
  }

  export type UserApiSettingMinAggregateInputType = {
    id?: true
    userId?: true
    baseURL?: true
    apiKey?: true
    model?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserApiSettingMaxAggregateInputType = {
    id?: true
    userId?: true
    baseURL?: true
    apiKey?: true
    model?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserApiSettingCountAggregateInputType = {
    id?: true
    userId?: true
    baseURL?: true
    apiKey?: true
    model?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserApiSettingAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserApiSetting to aggregate.
     */
    where?: UserApiSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserApiSettings to fetch.
     */
    orderBy?: UserApiSettingOrderByWithRelationInput | UserApiSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserApiSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserApiSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserApiSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserApiSettings
    **/
    _count?: true | UserApiSettingCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UserApiSettingAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UserApiSettingSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserApiSettingMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserApiSettingMaxAggregateInputType
  }

  export type GetUserApiSettingAggregateType<T extends UserApiSettingAggregateArgs> = {
        [P in keyof T & keyof AggregateUserApiSetting]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserApiSetting[P]>
      : GetScalarType<T[P], AggregateUserApiSetting[P]>
  }




  export type UserApiSettingGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserApiSettingWhereInput
    orderBy?: UserApiSettingOrderByWithAggregationInput | UserApiSettingOrderByWithAggregationInput[]
    by: UserApiSettingScalarFieldEnum[] | UserApiSettingScalarFieldEnum
    having?: UserApiSettingScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserApiSettingCountAggregateInputType | true
    _avg?: UserApiSettingAvgAggregateInputType
    _sum?: UserApiSettingSumAggregateInputType
    _min?: UserApiSettingMinAggregateInputType
    _max?: UserApiSettingMaxAggregateInputType
  }

  export type UserApiSettingGroupByOutputType = {
    id: number
    userId: number
    baseURL: string
    apiKey: string
    model: string
    createdAt: Date
    updatedAt: Date
    _count: UserApiSettingCountAggregateOutputType | null
    _avg: UserApiSettingAvgAggregateOutputType | null
    _sum: UserApiSettingSumAggregateOutputType | null
    _min: UserApiSettingMinAggregateOutputType | null
    _max: UserApiSettingMaxAggregateOutputType | null
  }

  type GetUserApiSettingGroupByPayload<T extends UserApiSettingGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserApiSettingGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserApiSettingGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserApiSettingGroupByOutputType[P]>
            : GetScalarType<T[P], UserApiSettingGroupByOutputType[P]>
        }
      >
    >


  export type UserApiSettingSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    baseURL?: boolean
    apiKey?: boolean
    model?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["userApiSetting"]>

  export type UserApiSettingSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    baseURL?: boolean
    apiKey?: boolean
    model?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["userApiSetting"]>

  export type UserApiSettingSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    baseURL?: boolean
    apiKey?: boolean
    model?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["userApiSetting"]>

  export type UserApiSettingSelectScalar = {
    id?: boolean
    userId?: boolean
    baseURL?: boolean
    apiKey?: boolean
    model?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserApiSettingOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "baseURL" | "apiKey" | "model" | "createdAt" | "updatedAt", ExtArgs["result"]["userApiSetting"]>

  export type $UserApiSettingPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserApiSetting"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: number
      baseURL: string
      apiKey: string
      model: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["userApiSetting"]>
    composites: {}
  }

  type UserApiSettingGetPayload<S extends boolean | null | undefined | UserApiSettingDefaultArgs> = $Result.GetResult<Prisma.$UserApiSettingPayload, S>

  type UserApiSettingCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserApiSettingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserApiSettingCountAggregateInputType | true
    }

  export interface UserApiSettingDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserApiSetting'], meta: { name: 'UserApiSetting' } }
    /**
     * Find zero or one UserApiSetting that matches the filter.
     * @param {UserApiSettingFindUniqueArgs} args - Arguments to find a UserApiSetting
     * @example
     * // Get one UserApiSetting
     * const userApiSetting = await prisma.userApiSetting.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserApiSettingFindUniqueArgs>(args: SelectSubset<T, UserApiSettingFindUniqueArgs<ExtArgs>>): Prisma__UserApiSettingClient<$Result.GetResult<Prisma.$UserApiSettingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one UserApiSetting that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserApiSettingFindUniqueOrThrowArgs} args - Arguments to find a UserApiSetting
     * @example
     * // Get one UserApiSetting
     * const userApiSetting = await prisma.userApiSetting.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserApiSettingFindUniqueOrThrowArgs>(args: SelectSubset<T, UserApiSettingFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserApiSettingClient<$Result.GetResult<Prisma.$UserApiSettingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserApiSetting that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserApiSettingFindFirstArgs} args - Arguments to find a UserApiSetting
     * @example
     * // Get one UserApiSetting
     * const userApiSetting = await prisma.userApiSetting.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserApiSettingFindFirstArgs>(args?: SelectSubset<T, UserApiSettingFindFirstArgs<ExtArgs>>): Prisma__UserApiSettingClient<$Result.GetResult<Prisma.$UserApiSettingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first UserApiSetting that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserApiSettingFindFirstOrThrowArgs} args - Arguments to find a UserApiSetting
     * @example
     * // Get one UserApiSetting
     * const userApiSetting = await prisma.userApiSetting.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserApiSettingFindFirstOrThrowArgs>(args?: SelectSubset<T, UserApiSettingFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserApiSettingClient<$Result.GetResult<Prisma.$UserApiSettingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more UserApiSettings that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserApiSettingFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserApiSettings
     * const userApiSettings = await prisma.userApiSetting.findMany()
     * 
     * // Get first 10 UserApiSettings
     * const userApiSettings = await prisma.userApiSetting.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userApiSettingWithIdOnly = await prisma.userApiSetting.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserApiSettingFindManyArgs>(args?: SelectSubset<T, UserApiSettingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserApiSettingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a UserApiSetting.
     * @param {UserApiSettingCreateArgs} args - Arguments to create a UserApiSetting.
     * @example
     * // Create one UserApiSetting
     * const UserApiSetting = await prisma.userApiSetting.create({
     *   data: {
     *     // ... data to create a UserApiSetting
     *   }
     * })
     * 
     */
    create<T extends UserApiSettingCreateArgs>(args: SelectSubset<T, UserApiSettingCreateArgs<ExtArgs>>): Prisma__UserApiSettingClient<$Result.GetResult<Prisma.$UserApiSettingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many UserApiSettings.
     * @param {UserApiSettingCreateManyArgs} args - Arguments to create many UserApiSettings.
     * @example
     * // Create many UserApiSettings
     * const userApiSetting = await prisma.userApiSetting.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserApiSettingCreateManyArgs>(args?: SelectSubset<T, UserApiSettingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UserApiSettings and returns the data saved in the database.
     * @param {UserApiSettingCreateManyAndReturnArgs} args - Arguments to create many UserApiSettings.
     * @example
     * // Create many UserApiSettings
     * const userApiSetting = await prisma.userApiSetting.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UserApiSettings and only return the `id`
     * const userApiSettingWithIdOnly = await prisma.userApiSetting.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserApiSettingCreateManyAndReturnArgs>(args?: SelectSubset<T, UserApiSettingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserApiSettingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a UserApiSetting.
     * @param {UserApiSettingDeleteArgs} args - Arguments to delete one UserApiSetting.
     * @example
     * // Delete one UserApiSetting
     * const UserApiSetting = await prisma.userApiSetting.delete({
     *   where: {
     *     // ... filter to delete one UserApiSetting
     *   }
     * })
     * 
     */
    delete<T extends UserApiSettingDeleteArgs>(args: SelectSubset<T, UserApiSettingDeleteArgs<ExtArgs>>): Prisma__UserApiSettingClient<$Result.GetResult<Prisma.$UserApiSettingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one UserApiSetting.
     * @param {UserApiSettingUpdateArgs} args - Arguments to update one UserApiSetting.
     * @example
     * // Update one UserApiSetting
     * const userApiSetting = await prisma.userApiSetting.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserApiSettingUpdateArgs>(args: SelectSubset<T, UserApiSettingUpdateArgs<ExtArgs>>): Prisma__UserApiSettingClient<$Result.GetResult<Prisma.$UserApiSettingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more UserApiSettings.
     * @param {UserApiSettingDeleteManyArgs} args - Arguments to filter UserApiSettings to delete.
     * @example
     * // Delete a few UserApiSettings
     * const { count } = await prisma.userApiSetting.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserApiSettingDeleteManyArgs>(args?: SelectSubset<T, UserApiSettingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserApiSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserApiSettingUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserApiSettings
     * const userApiSetting = await prisma.userApiSetting.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserApiSettingUpdateManyArgs>(args: SelectSubset<T, UserApiSettingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserApiSettings and returns the data updated in the database.
     * @param {UserApiSettingUpdateManyAndReturnArgs} args - Arguments to update many UserApiSettings.
     * @example
     * // Update many UserApiSettings
     * const userApiSetting = await prisma.userApiSetting.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more UserApiSettings and only return the `id`
     * const userApiSettingWithIdOnly = await prisma.userApiSetting.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserApiSettingUpdateManyAndReturnArgs>(args: SelectSubset<T, UserApiSettingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserApiSettingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one UserApiSetting.
     * @param {UserApiSettingUpsertArgs} args - Arguments to update or create a UserApiSetting.
     * @example
     * // Update or create a UserApiSetting
     * const userApiSetting = await prisma.userApiSetting.upsert({
     *   create: {
     *     // ... data to create a UserApiSetting
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserApiSetting we want to update
     *   }
     * })
     */
    upsert<T extends UserApiSettingUpsertArgs>(args: SelectSubset<T, UserApiSettingUpsertArgs<ExtArgs>>): Prisma__UserApiSettingClient<$Result.GetResult<Prisma.$UserApiSettingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of UserApiSettings.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserApiSettingCountArgs} args - Arguments to filter UserApiSettings to count.
     * @example
     * // Count the number of UserApiSettings
     * const count = await prisma.userApiSetting.count({
     *   where: {
     *     // ... the filter for the UserApiSettings we want to count
     *   }
     * })
    **/
    count<T extends UserApiSettingCountArgs>(
      args?: Subset<T, UserApiSettingCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserApiSettingCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserApiSetting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserApiSettingAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserApiSettingAggregateArgs>(args: Subset<T, UserApiSettingAggregateArgs>): Prisma.PrismaPromise<GetUserApiSettingAggregateType<T>>

    /**
     * Group by UserApiSetting.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserApiSettingGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserApiSettingGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserApiSettingGroupByArgs['orderBy'] }
        : { orderBy?: UserApiSettingGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserApiSettingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserApiSettingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserApiSetting model
   */
  readonly fields: UserApiSettingFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserApiSetting.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserApiSettingClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserApiSetting model
   */
  interface UserApiSettingFieldRefs {
    readonly id: FieldRef<"UserApiSetting", 'Int'>
    readonly userId: FieldRef<"UserApiSetting", 'Int'>
    readonly baseURL: FieldRef<"UserApiSetting", 'String'>
    readonly apiKey: FieldRef<"UserApiSetting", 'String'>
    readonly model: FieldRef<"UserApiSetting", 'String'>
    readonly createdAt: FieldRef<"UserApiSetting", 'DateTime'>
    readonly updatedAt: FieldRef<"UserApiSetting", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserApiSetting findUnique
   */
  export type UserApiSettingFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserApiSetting
     */
    select?: UserApiSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserApiSetting
     */
    omit?: UserApiSettingOmit<ExtArgs> | null
    /**
     * Filter, which UserApiSetting to fetch.
     */
    where: UserApiSettingWhereUniqueInput
  }

  /**
   * UserApiSetting findUniqueOrThrow
   */
  export type UserApiSettingFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserApiSetting
     */
    select?: UserApiSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserApiSetting
     */
    omit?: UserApiSettingOmit<ExtArgs> | null
    /**
     * Filter, which UserApiSetting to fetch.
     */
    where: UserApiSettingWhereUniqueInput
  }

  /**
   * UserApiSetting findFirst
   */
  export type UserApiSettingFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserApiSetting
     */
    select?: UserApiSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserApiSetting
     */
    omit?: UserApiSettingOmit<ExtArgs> | null
    /**
     * Filter, which UserApiSetting to fetch.
     */
    where?: UserApiSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserApiSettings to fetch.
     */
    orderBy?: UserApiSettingOrderByWithRelationInput | UserApiSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserApiSettings.
     */
    cursor?: UserApiSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserApiSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserApiSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserApiSettings.
     */
    distinct?: UserApiSettingScalarFieldEnum | UserApiSettingScalarFieldEnum[]
  }

  /**
   * UserApiSetting findFirstOrThrow
   */
  export type UserApiSettingFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserApiSetting
     */
    select?: UserApiSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserApiSetting
     */
    omit?: UserApiSettingOmit<ExtArgs> | null
    /**
     * Filter, which UserApiSetting to fetch.
     */
    where?: UserApiSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserApiSettings to fetch.
     */
    orderBy?: UserApiSettingOrderByWithRelationInput | UserApiSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserApiSettings.
     */
    cursor?: UserApiSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserApiSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserApiSettings.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserApiSettings.
     */
    distinct?: UserApiSettingScalarFieldEnum | UserApiSettingScalarFieldEnum[]
  }

  /**
   * UserApiSetting findMany
   */
  export type UserApiSettingFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserApiSetting
     */
    select?: UserApiSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserApiSetting
     */
    omit?: UserApiSettingOmit<ExtArgs> | null
    /**
     * Filter, which UserApiSettings to fetch.
     */
    where?: UserApiSettingWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserApiSettings to fetch.
     */
    orderBy?: UserApiSettingOrderByWithRelationInput | UserApiSettingOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserApiSettings.
     */
    cursor?: UserApiSettingWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserApiSettings from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserApiSettings.
     */
    skip?: number
    distinct?: UserApiSettingScalarFieldEnum | UserApiSettingScalarFieldEnum[]
  }

  /**
   * UserApiSetting create
   */
  export type UserApiSettingCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserApiSetting
     */
    select?: UserApiSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserApiSetting
     */
    omit?: UserApiSettingOmit<ExtArgs> | null
    /**
     * The data needed to create a UserApiSetting.
     */
    data: XOR<UserApiSettingCreateInput, UserApiSettingUncheckedCreateInput>
  }

  /**
   * UserApiSetting createMany
   */
  export type UserApiSettingCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserApiSettings.
     */
    data: UserApiSettingCreateManyInput | UserApiSettingCreateManyInput[]
  }

  /**
   * UserApiSetting createManyAndReturn
   */
  export type UserApiSettingCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserApiSetting
     */
    select?: UserApiSettingSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserApiSetting
     */
    omit?: UserApiSettingOmit<ExtArgs> | null
    /**
     * The data used to create many UserApiSettings.
     */
    data: UserApiSettingCreateManyInput | UserApiSettingCreateManyInput[]
  }

  /**
   * UserApiSetting update
   */
  export type UserApiSettingUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserApiSetting
     */
    select?: UserApiSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserApiSetting
     */
    omit?: UserApiSettingOmit<ExtArgs> | null
    /**
     * The data needed to update a UserApiSetting.
     */
    data: XOR<UserApiSettingUpdateInput, UserApiSettingUncheckedUpdateInput>
    /**
     * Choose, which UserApiSetting to update.
     */
    where: UserApiSettingWhereUniqueInput
  }

  /**
   * UserApiSetting updateMany
   */
  export type UserApiSettingUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserApiSettings.
     */
    data: XOR<UserApiSettingUpdateManyMutationInput, UserApiSettingUncheckedUpdateManyInput>
    /**
     * Filter which UserApiSettings to update
     */
    where?: UserApiSettingWhereInput
    /**
     * Limit how many UserApiSettings to update.
     */
    limit?: number
  }

  /**
   * UserApiSetting updateManyAndReturn
   */
  export type UserApiSettingUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserApiSetting
     */
    select?: UserApiSettingSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the UserApiSetting
     */
    omit?: UserApiSettingOmit<ExtArgs> | null
    /**
     * The data used to update UserApiSettings.
     */
    data: XOR<UserApiSettingUpdateManyMutationInput, UserApiSettingUncheckedUpdateManyInput>
    /**
     * Filter which UserApiSettings to update
     */
    where?: UserApiSettingWhereInput
    /**
     * Limit how many UserApiSettings to update.
     */
    limit?: number
  }

  /**
   * UserApiSetting upsert
   */
  export type UserApiSettingUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserApiSetting
     */
    select?: UserApiSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserApiSetting
     */
    omit?: UserApiSettingOmit<ExtArgs> | null
    /**
     * The filter to search for the UserApiSetting to update in case it exists.
     */
    where: UserApiSettingWhereUniqueInput
    /**
     * In case the UserApiSetting found by the `where` argument doesn't exist, create a new UserApiSetting with this data.
     */
    create: XOR<UserApiSettingCreateInput, UserApiSettingUncheckedCreateInput>
    /**
     * In case the UserApiSetting was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserApiSettingUpdateInput, UserApiSettingUncheckedUpdateInput>
  }

  /**
   * UserApiSetting delete
   */
  export type UserApiSettingDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserApiSetting
     */
    select?: UserApiSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserApiSetting
     */
    omit?: UserApiSettingOmit<ExtArgs> | null
    /**
     * Filter which UserApiSetting to delete.
     */
    where: UserApiSettingWhereUniqueInput
  }

  /**
   * UserApiSetting deleteMany
   */
  export type UserApiSettingDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserApiSettings to delete
     */
    where?: UserApiSettingWhereInput
    /**
     * Limit how many UserApiSettings to delete.
     */
    limit?: number
  }

  /**
   * UserApiSetting without action
   */
  export type UserApiSettingDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserApiSetting
     */
    select?: UserApiSettingSelect<ExtArgs> | null
    /**
     * Omit specific fields from the UserApiSetting
     */
    omit?: UserApiSettingOmit<ExtArgs> | null
  }


  /**
   * Model ApiProvider
   */

  export type AggregateApiProvider = {
    _count: ApiProviderCountAggregateOutputType | null
    _avg: ApiProviderAvgAggregateOutputType | null
    _sum: ApiProviderSumAggregateOutputType | null
    _min: ApiProviderMinAggregateOutputType | null
    _max: ApiProviderMaxAggregateOutputType | null
  }

  export type ApiProviderAvgAggregateOutputType = {
    id: number | null
    orderIndex: number | null
  }

  export type ApiProviderSumAggregateOutputType = {
    id: number | null
    orderIndex: number | null
  }

  export type ApiProviderMinAggregateOutputType = {
    id: number | null
    name: string | null
    providerType: string | null
    baseURL: string | null
    apiKey: string | null
    model: string | null
    isActive: boolean | null
    orderIndex: number | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ApiProviderMaxAggregateOutputType = {
    id: number | null
    name: string | null
    providerType: string | null
    baseURL: string | null
    apiKey: string | null
    model: string | null
    isActive: boolean | null
    orderIndex: number | null
    description: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ApiProviderCountAggregateOutputType = {
    id: number
    name: number
    providerType: number
    baseURL: number
    apiKey: number
    model: number
    isActive: number
    orderIndex: number
    description: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ApiProviderAvgAggregateInputType = {
    id?: true
    orderIndex?: true
  }

  export type ApiProviderSumAggregateInputType = {
    id?: true
    orderIndex?: true
  }

  export type ApiProviderMinAggregateInputType = {
    id?: true
    name?: true
    providerType?: true
    baseURL?: true
    apiKey?: true
    model?: true
    isActive?: true
    orderIndex?: true
    description?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ApiProviderMaxAggregateInputType = {
    id?: true
    name?: true
    providerType?: true
    baseURL?: true
    apiKey?: true
    model?: true
    isActive?: true
    orderIndex?: true
    description?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ApiProviderCountAggregateInputType = {
    id?: true
    name?: true
    providerType?: true
    baseURL?: true
    apiKey?: true
    model?: true
    isActive?: true
    orderIndex?: true
    description?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ApiProviderAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ApiProvider to aggregate.
     */
    where?: ApiProviderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ApiProviders to fetch.
     */
    orderBy?: ApiProviderOrderByWithRelationInput | ApiProviderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ApiProviderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ApiProviders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ApiProviders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ApiProviders
    **/
    _count?: true | ApiProviderCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ApiProviderAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ApiProviderSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ApiProviderMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ApiProviderMaxAggregateInputType
  }

  export type GetApiProviderAggregateType<T extends ApiProviderAggregateArgs> = {
        [P in keyof T & keyof AggregateApiProvider]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateApiProvider[P]>
      : GetScalarType<T[P], AggregateApiProvider[P]>
  }




  export type ApiProviderGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ApiProviderWhereInput
    orderBy?: ApiProviderOrderByWithAggregationInput | ApiProviderOrderByWithAggregationInput[]
    by: ApiProviderScalarFieldEnum[] | ApiProviderScalarFieldEnum
    having?: ApiProviderScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ApiProviderCountAggregateInputType | true
    _avg?: ApiProviderAvgAggregateInputType
    _sum?: ApiProviderSumAggregateInputType
    _min?: ApiProviderMinAggregateInputType
    _max?: ApiProviderMaxAggregateInputType
  }

  export type ApiProviderGroupByOutputType = {
    id: number
    name: string
    providerType: string
    baseURL: string
    apiKey: string
    model: string
    isActive: boolean
    orderIndex: number
    description: string | null
    createdAt: Date
    updatedAt: Date
    _count: ApiProviderCountAggregateOutputType | null
    _avg: ApiProviderAvgAggregateOutputType | null
    _sum: ApiProviderSumAggregateOutputType | null
    _min: ApiProviderMinAggregateOutputType | null
    _max: ApiProviderMaxAggregateOutputType | null
  }

  type GetApiProviderGroupByPayload<T extends ApiProviderGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ApiProviderGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ApiProviderGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ApiProviderGroupByOutputType[P]>
            : GetScalarType<T[P], ApiProviderGroupByOutputType[P]>
        }
      >
    >


  export type ApiProviderSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    providerType?: boolean
    baseURL?: boolean
    apiKey?: boolean
    model?: boolean
    isActive?: boolean
    orderIndex?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["apiProvider"]>

  export type ApiProviderSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    providerType?: boolean
    baseURL?: boolean
    apiKey?: boolean
    model?: boolean
    isActive?: boolean
    orderIndex?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["apiProvider"]>

  export type ApiProviderSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    providerType?: boolean
    baseURL?: boolean
    apiKey?: boolean
    model?: boolean
    isActive?: boolean
    orderIndex?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["apiProvider"]>

  export type ApiProviderSelectScalar = {
    id?: boolean
    name?: boolean
    providerType?: boolean
    baseURL?: boolean
    apiKey?: boolean
    model?: boolean
    isActive?: boolean
    orderIndex?: boolean
    description?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ApiProviderOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "name" | "providerType" | "baseURL" | "apiKey" | "model" | "isActive" | "orderIndex" | "description" | "createdAt" | "updatedAt", ExtArgs["result"]["apiProvider"]>

  export type $ApiProviderPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ApiProvider"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      name: string
      providerType: string
      baseURL: string
      apiKey: string
      model: string
      isActive: boolean
      orderIndex: number
      description: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["apiProvider"]>
    composites: {}
  }

  type ApiProviderGetPayload<S extends boolean | null | undefined | ApiProviderDefaultArgs> = $Result.GetResult<Prisma.$ApiProviderPayload, S>

  type ApiProviderCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ApiProviderFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ApiProviderCountAggregateInputType | true
    }

  export interface ApiProviderDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ApiProvider'], meta: { name: 'ApiProvider' } }
    /**
     * Find zero or one ApiProvider that matches the filter.
     * @param {ApiProviderFindUniqueArgs} args - Arguments to find a ApiProvider
     * @example
     * // Get one ApiProvider
     * const apiProvider = await prisma.apiProvider.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ApiProviderFindUniqueArgs>(args: SelectSubset<T, ApiProviderFindUniqueArgs<ExtArgs>>): Prisma__ApiProviderClient<$Result.GetResult<Prisma.$ApiProviderPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ApiProvider that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ApiProviderFindUniqueOrThrowArgs} args - Arguments to find a ApiProvider
     * @example
     * // Get one ApiProvider
     * const apiProvider = await prisma.apiProvider.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ApiProviderFindUniqueOrThrowArgs>(args: SelectSubset<T, ApiProviderFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ApiProviderClient<$Result.GetResult<Prisma.$ApiProviderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ApiProvider that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiProviderFindFirstArgs} args - Arguments to find a ApiProvider
     * @example
     * // Get one ApiProvider
     * const apiProvider = await prisma.apiProvider.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ApiProviderFindFirstArgs>(args?: SelectSubset<T, ApiProviderFindFirstArgs<ExtArgs>>): Prisma__ApiProviderClient<$Result.GetResult<Prisma.$ApiProviderPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ApiProvider that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiProviderFindFirstOrThrowArgs} args - Arguments to find a ApiProvider
     * @example
     * // Get one ApiProvider
     * const apiProvider = await prisma.apiProvider.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ApiProviderFindFirstOrThrowArgs>(args?: SelectSubset<T, ApiProviderFindFirstOrThrowArgs<ExtArgs>>): Prisma__ApiProviderClient<$Result.GetResult<Prisma.$ApiProviderPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ApiProviders that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiProviderFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ApiProviders
     * const apiProviders = await prisma.apiProvider.findMany()
     * 
     * // Get first 10 ApiProviders
     * const apiProviders = await prisma.apiProvider.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const apiProviderWithIdOnly = await prisma.apiProvider.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ApiProviderFindManyArgs>(args?: SelectSubset<T, ApiProviderFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApiProviderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ApiProvider.
     * @param {ApiProviderCreateArgs} args - Arguments to create a ApiProvider.
     * @example
     * // Create one ApiProvider
     * const ApiProvider = await prisma.apiProvider.create({
     *   data: {
     *     // ... data to create a ApiProvider
     *   }
     * })
     * 
     */
    create<T extends ApiProviderCreateArgs>(args: SelectSubset<T, ApiProviderCreateArgs<ExtArgs>>): Prisma__ApiProviderClient<$Result.GetResult<Prisma.$ApiProviderPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ApiProviders.
     * @param {ApiProviderCreateManyArgs} args - Arguments to create many ApiProviders.
     * @example
     * // Create many ApiProviders
     * const apiProvider = await prisma.apiProvider.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ApiProviderCreateManyArgs>(args?: SelectSubset<T, ApiProviderCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ApiProviders and returns the data saved in the database.
     * @param {ApiProviderCreateManyAndReturnArgs} args - Arguments to create many ApiProviders.
     * @example
     * // Create many ApiProviders
     * const apiProvider = await prisma.apiProvider.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ApiProviders and only return the `id`
     * const apiProviderWithIdOnly = await prisma.apiProvider.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ApiProviderCreateManyAndReturnArgs>(args?: SelectSubset<T, ApiProviderCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApiProviderPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ApiProvider.
     * @param {ApiProviderDeleteArgs} args - Arguments to delete one ApiProvider.
     * @example
     * // Delete one ApiProvider
     * const ApiProvider = await prisma.apiProvider.delete({
     *   where: {
     *     // ... filter to delete one ApiProvider
     *   }
     * })
     * 
     */
    delete<T extends ApiProviderDeleteArgs>(args: SelectSubset<T, ApiProviderDeleteArgs<ExtArgs>>): Prisma__ApiProviderClient<$Result.GetResult<Prisma.$ApiProviderPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ApiProvider.
     * @param {ApiProviderUpdateArgs} args - Arguments to update one ApiProvider.
     * @example
     * // Update one ApiProvider
     * const apiProvider = await prisma.apiProvider.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ApiProviderUpdateArgs>(args: SelectSubset<T, ApiProviderUpdateArgs<ExtArgs>>): Prisma__ApiProviderClient<$Result.GetResult<Prisma.$ApiProviderPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ApiProviders.
     * @param {ApiProviderDeleteManyArgs} args - Arguments to filter ApiProviders to delete.
     * @example
     * // Delete a few ApiProviders
     * const { count } = await prisma.apiProvider.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ApiProviderDeleteManyArgs>(args?: SelectSubset<T, ApiProviderDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ApiProviders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiProviderUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ApiProviders
     * const apiProvider = await prisma.apiProvider.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ApiProviderUpdateManyArgs>(args: SelectSubset<T, ApiProviderUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ApiProviders and returns the data updated in the database.
     * @param {ApiProviderUpdateManyAndReturnArgs} args - Arguments to update many ApiProviders.
     * @example
     * // Update many ApiProviders
     * const apiProvider = await prisma.apiProvider.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ApiProviders and only return the `id`
     * const apiProviderWithIdOnly = await prisma.apiProvider.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ApiProviderUpdateManyAndReturnArgs>(args: SelectSubset<T, ApiProviderUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ApiProviderPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ApiProvider.
     * @param {ApiProviderUpsertArgs} args - Arguments to update or create a ApiProvider.
     * @example
     * // Update or create a ApiProvider
     * const apiProvider = await prisma.apiProvider.upsert({
     *   create: {
     *     // ... data to create a ApiProvider
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ApiProvider we want to update
     *   }
     * })
     */
    upsert<T extends ApiProviderUpsertArgs>(args: SelectSubset<T, ApiProviderUpsertArgs<ExtArgs>>): Prisma__ApiProviderClient<$Result.GetResult<Prisma.$ApiProviderPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ApiProviders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiProviderCountArgs} args - Arguments to filter ApiProviders to count.
     * @example
     * // Count the number of ApiProviders
     * const count = await prisma.apiProvider.count({
     *   where: {
     *     // ... the filter for the ApiProviders we want to count
     *   }
     * })
    **/
    count<T extends ApiProviderCountArgs>(
      args?: Subset<T, ApiProviderCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ApiProviderCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ApiProvider.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiProviderAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ApiProviderAggregateArgs>(args: Subset<T, ApiProviderAggregateArgs>): Prisma.PrismaPromise<GetApiProviderAggregateType<T>>

    /**
     * Group by ApiProvider.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ApiProviderGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ApiProviderGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ApiProviderGroupByArgs['orderBy'] }
        : { orderBy?: ApiProviderGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ApiProviderGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetApiProviderGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ApiProvider model
   */
  readonly fields: ApiProviderFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ApiProvider.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ApiProviderClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ApiProvider model
   */
  interface ApiProviderFieldRefs {
    readonly id: FieldRef<"ApiProvider", 'Int'>
    readonly name: FieldRef<"ApiProvider", 'String'>
    readonly providerType: FieldRef<"ApiProvider", 'String'>
    readonly baseURL: FieldRef<"ApiProvider", 'String'>
    readonly apiKey: FieldRef<"ApiProvider", 'String'>
    readonly model: FieldRef<"ApiProvider", 'String'>
    readonly isActive: FieldRef<"ApiProvider", 'Boolean'>
    readonly orderIndex: FieldRef<"ApiProvider", 'Int'>
    readonly description: FieldRef<"ApiProvider", 'String'>
    readonly createdAt: FieldRef<"ApiProvider", 'DateTime'>
    readonly updatedAt: FieldRef<"ApiProvider", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ApiProvider findUnique
   */
  export type ApiProviderFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiProvider
     */
    select?: ApiProviderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiProvider
     */
    omit?: ApiProviderOmit<ExtArgs> | null
    /**
     * Filter, which ApiProvider to fetch.
     */
    where: ApiProviderWhereUniqueInput
  }

  /**
   * ApiProvider findUniqueOrThrow
   */
  export type ApiProviderFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiProvider
     */
    select?: ApiProviderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiProvider
     */
    omit?: ApiProviderOmit<ExtArgs> | null
    /**
     * Filter, which ApiProvider to fetch.
     */
    where: ApiProviderWhereUniqueInput
  }

  /**
   * ApiProvider findFirst
   */
  export type ApiProviderFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiProvider
     */
    select?: ApiProviderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiProvider
     */
    omit?: ApiProviderOmit<ExtArgs> | null
    /**
     * Filter, which ApiProvider to fetch.
     */
    where?: ApiProviderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ApiProviders to fetch.
     */
    orderBy?: ApiProviderOrderByWithRelationInput | ApiProviderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ApiProviders.
     */
    cursor?: ApiProviderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ApiProviders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ApiProviders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ApiProviders.
     */
    distinct?: ApiProviderScalarFieldEnum | ApiProviderScalarFieldEnum[]
  }

  /**
   * ApiProvider findFirstOrThrow
   */
  export type ApiProviderFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiProvider
     */
    select?: ApiProviderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiProvider
     */
    omit?: ApiProviderOmit<ExtArgs> | null
    /**
     * Filter, which ApiProvider to fetch.
     */
    where?: ApiProviderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ApiProviders to fetch.
     */
    orderBy?: ApiProviderOrderByWithRelationInput | ApiProviderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ApiProviders.
     */
    cursor?: ApiProviderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ApiProviders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ApiProviders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ApiProviders.
     */
    distinct?: ApiProviderScalarFieldEnum | ApiProviderScalarFieldEnum[]
  }

  /**
   * ApiProvider findMany
   */
  export type ApiProviderFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiProvider
     */
    select?: ApiProviderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiProvider
     */
    omit?: ApiProviderOmit<ExtArgs> | null
    /**
     * Filter, which ApiProviders to fetch.
     */
    where?: ApiProviderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ApiProviders to fetch.
     */
    orderBy?: ApiProviderOrderByWithRelationInput | ApiProviderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ApiProviders.
     */
    cursor?: ApiProviderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ApiProviders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ApiProviders.
     */
    skip?: number
    distinct?: ApiProviderScalarFieldEnum | ApiProviderScalarFieldEnum[]
  }

  /**
   * ApiProvider create
   */
  export type ApiProviderCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiProvider
     */
    select?: ApiProviderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiProvider
     */
    omit?: ApiProviderOmit<ExtArgs> | null
    /**
     * The data needed to create a ApiProvider.
     */
    data: XOR<ApiProviderCreateInput, ApiProviderUncheckedCreateInput>
  }

  /**
   * ApiProvider createMany
   */
  export type ApiProviderCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ApiProviders.
     */
    data: ApiProviderCreateManyInput | ApiProviderCreateManyInput[]
  }

  /**
   * ApiProvider createManyAndReturn
   */
  export type ApiProviderCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiProvider
     */
    select?: ApiProviderSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ApiProvider
     */
    omit?: ApiProviderOmit<ExtArgs> | null
    /**
     * The data used to create many ApiProviders.
     */
    data: ApiProviderCreateManyInput | ApiProviderCreateManyInput[]
  }

  /**
   * ApiProvider update
   */
  export type ApiProviderUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiProvider
     */
    select?: ApiProviderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiProvider
     */
    omit?: ApiProviderOmit<ExtArgs> | null
    /**
     * The data needed to update a ApiProvider.
     */
    data: XOR<ApiProviderUpdateInput, ApiProviderUncheckedUpdateInput>
    /**
     * Choose, which ApiProvider to update.
     */
    where: ApiProviderWhereUniqueInput
  }

  /**
   * ApiProvider updateMany
   */
  export type ApiProviderUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ApiProviders.
     */
    data: XOR<ApiProviderUpdateManyMutationInput, ApiProviderUncheckedUpdateManyInput>
    /**
     * Filter which ApiProviders to update
     */
    where?: ApiProviderWhereInput
    /**
     * Limit how many ApiProviders to update.
     */
    limit?: number
  }

  /**
   * ApiProvider updateManyAndReturn
   */
  export type ApiProviderUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiProvider
     */
    select?: ApiProviderSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ApiProvider
     */
    omit?: ApiProviderOmit<ExtArgs> | null
    /**
     * The data used to update ApiProviders.
     */
    data: XOR<ApiProviderUpdateManyMutationInput, ApiProviderUncheckedUpdateManyInput>
    /**
     * Filter which ApiProviders to update
     */
    where?: ApiProviderWhereInput
    /**
     * Limit how many ApiProviders to update.
     */
    limit?: number
  }

  /**
   * ApiProvider upsert
   */
  export type ApiProviderUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiProvider
     */
    select?: ApiProviderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiProvider
     */
    omit?: ApiProviderOmit<ExtArgs> | null
    /**
     * The filter to search for the ApiProvider to update in case it exists.
     */
    where: ApiProviderWhereUniqueInput
    /**
     * In case the ApiProvider found by the `where` argument doesn't exist, create a new ApiProvider with this data.
     */
    create: XOR<ApiProviderCreateInput, ApiProviderUncheckedCreateInput>
    /**
     * In case the ApiProvider was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ApiProviderUpdateInput, ApiProviderUncheckedUpdateInput>
  }

  /**
   * ApiProvider delete
   */
  export type ApiProviderDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiProvider
     */
    select?: ApiProviderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiProvider
     */
    omit?: ApiProviderOmit<ExtArgs> | null
    /**
     * Filter which ApiProvider to delete.
     */
    where: ApiProviderWhereUniqueInput
  }

  /**
   * ApiProvider deleteMany
   */
  export type ApiProviderDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ApiProviders to delete
     */
    where?: ApiProviderWhereInput
    /**
     * Limit how many ApiProviders to delete.
     */
    limit?: number
  }

  /**
   * ApiProvider without action
   */
  export type ApiProviderDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ApiProvider
     */
    select?: ApiProviderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ApiProvider
     */
    omit?: ApiProviderOmit<ExtArgs> | null
  }


  /**
   * Model AiUsageLog
   */

  export type AggregateAiUsageLog = {
    _count: AiUsageLogCountAggregateOutputType | null
    _avg: AiUsageLogAvgAggregateOutputType | null
    _sum: AiUsageLogSumAggregateOutputType | null
    _min: AiUsageLogMinAggregateOutputType | null
    _max: AiUsageLogMaxAggregateOutputType | null
  }

  export type AiUsageLogAvgAggregateOutputType = {
    id: number | null
    userId: number | null
    projectId: number | null
    promptTokens: number | null
    completionTokens: number | null
    totalTokens: number | null
  }

  export type AiUsageLogSumAggregateOutputType = {
    id: number | null
    userId: number | null
    projectId: number | null
    promptTokens: number | null
    completionTokens: number | null
    totalTokens: number | null
  }

  export type AiUsageLogMinAggregateOutputType = {
    id: number | null
    userId: number | null
    projectId: number | null
    docType: string | null
    operation: string | null
    promptTokens: number | null
    completionTokens: number | null
    totalTokens: number | null
    status: string | null
    errorMessage: string | null
    createdAt: Date | null
  }

  export type AiUsageLogMaxAggregateOutputType = {
    id: number | null
    userId: number | null
    projectId: number | null
    docType: string | null
    operation: string | null
    promptTokens: number | null
    completionTokens: number | null
    totalTokens: number | null
    status: string | null
    errorMessage: string | null
    createdAt: Date | null
  }

  export type AiUsageLogCountAggregateOutputType = {
    id: number
    userId: number
    projectId: number
    docType: number
    operation: number
    promptTokens: number
    completionTokens: number
    totalTokens: number
    status: number
    errorMessage: number
    createdAt: number
    _all: number
  }


  export type AiUsageLogAvgAggregateInputType = {
    id?: true
    userId?: true
    projectId?: true
    promptTokens?: true
    completionTokens?: true
    totalTokens?: true
  }

  export type AiUsageLogSumAggregateInputType = {
    id?: true
    userId?: true
    projectId?: true
    promptTokens?: true
    completionTokens?: true
    totalTokens?: true
  }

  export type AiUsageLogMinAggregateInputType = {
    id?: true
    userId?: true
    projectId?: true
    docType?: true
    operation?: true
    promptTokens?: true
    completionTokens?: true
    totalTokens?: true
    status?: true
    errorMessage?: true
    createdAt?: true
  }

  export type AiUsageLogMaxAggregateInputType = {
    id?: true
    userId?: true
    projectId?: true
    docType?: true
    operation?: true
    promptTokens?: true
    completionTokens?: true
    totalTokens?: true
    status?: true
    errorMessage?: true
    createdAt?: true
  }

  export type AiUsageLogCountAggregateInputType = {
    id?: true
    userId?: true
    projectId?: true
    docType?: true
    operation?: true
    promptTokens?: true
    completionTokens?: true
    totalTokens?: true
    status?: true
    errorMessage?: true
    createdAt?: true
    _all?: true
  }

  export type AiUsageLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiUsageLog to aggregate.
     */
    where?: AiUsageLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiUsageLogs to fetch.
     */
    orderBy?: AiUsageLogOrderByWithRelationInput | AiUsageLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: AiUsageLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiUsageLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiUsageLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned AiUsageLogs
    **/
    _count?: true | AiUsageLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: AiUsageLogAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: AiUsageLogSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: AiUsageLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: AiUsageLogMaxAggregateInputType
  }

  export type GetAiUsageLogAggregateType<T extends AiUsageLogAggregateArgs> = {
        [P in keyof T & keyof AggregateAiUsageLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateAiUsageLog[P]>
      : GetScalarType<T[P], AggregateAiUsageLog[P]>
  }




  export type AiUsageLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: AiUsageLogWhereInput
    orderBy?: AiUsageLogOrderByWithAggregationInput | AiUsageLogOrderByWithAggregationInput[]
    by: AiUsageLogScalarFieldEnum[] | AiUsageLogScalarFieldEnum
    having?: AiUsageLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: AiUsageLogCountAggregateInputType | true
    _avg?: AiUsageLogAvgAggregateInputType
    _sum?: AiUsageLogSumAggregateInputType
    _min?: AiUsageLogMinAggregateInputType
    _max?: AiUsageLogMaxAggregateInputType
  }

  export type AiUsageLogGroupByOutputType = {
    id: number
    userId: number
    projectId: number | null
    docType: string | null
    operation: string
    promptTokens: number
    completionTokens: number
    totalTokens: number
    status: string
    errorMessage: string | null
    createdAt: Date
    _count: AiUsageLogCountAggregateOutputType | null
    _avg: AiUsageLogAvgAggregateOutputType | null
    _sum: AiUsageLogSumAggregateOutputType | null
    _min: AiUsageLogMinAggregateOutputType | null
    _max: AiUsageLogMaxAggregateOutputType | null
  }

  type GetAiUsageLogGroupByPayload<T extends AiUsageLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<AiUsageLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof AiUsageLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], AiUsageLogGroupByOutputType[P]>
            : GetScalarType<T[P], AiUsageLogGroupByOutputType[P]>
        }
      >
    >


  export type AiUsageLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    projectId?: boolean
    docType?: boolean
    operation?: boolean
    promptTokens?: boolean
    completionTokens?: boolean
    totalTokens?: boolean
    status?: boolean
    errorMessage?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["aiUsageLog"]>

  export type AiUsageLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    projectId?: boolean
    docType?: boolean
    operation?: boolean
    promptTokens?: boolean
    completionTokens?: boolean
    totalTokens?: boolean
    status?: boolean
    errorMessage?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["aiUsageLog"]>

  export type AiUsageLogSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    projectId?: boolean
    docType?: boolean
    operation?: boolean
    promptTokens?: boolean
    completionTokens?: boolean
    totalTokens?: boolean
    status?: boolean
    errorMessage?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["aiUsageLog"]>

  export type AiUsageLogSelectScalar = {
    id?: boolean
    userId?: boolean
    projectId?: boolean
    docType?: boolean
    operation?: boolean
    promptTokens?: boolean
    completionTokens?: boolean
    totalTokens?: boolean
    status?: boolean
    errorMessage?: boolean
    createdAt?: boolean
  }

  export type AiUsageLogOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "projectId" | "docType" | "operation" | "promptTokens" | "completionTokens" | "totalTokens" | "status" | "errorMessage" | "createdAt", ExtArgs["result"]["aiUsageLog"]>

  export type $AiUsageLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "AiUsageLog"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: number
      projectId: number | null
      docType: string | null
      operation: string
      promptTokens: number
      completionTokens: number
      totalTokens: number
      status: string
      errorMessage: string | null
      createdAt: Date
    }, ExtArgs["result"]["aiUsageLog"]>
    composites: {}
  }

  type AiUsageLogGetPayload<S extends boolean | null | undefined | AiUsageLogDefaultArgs> = $Result.GetResult<Prisma.$AiUsageLogPayload, S>

  type AiUsageLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<AiUsageLogFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: AiUsageLogCountAggregateInputType | true
    }

  export interface AiUsageLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['AiUsageLog'], meta: { name: 'AiUsageLog' } }
    /**
     * Find zero or one AiUsageLog that matches the filter.
     * @param {AiUsageLogFindUniqueArgs} args - Arguments to find a AiUsageLog
     * @example
     * // Get one AiUsageLog
     * const aiUsageLog = await prisma.aiUsageLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends AiUsageLogFindUniqueArgs>(args: SelectSubset<T, AiUsageLogFindUniqueArgs<ExtArgs>>): Prisma__AiUsageLogClient<$Result.GetResult<Prisma.$AiUsageLogPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one AiUsageLog that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {AiUsageLogFindUniqueOrThrowArgs} args - Arguments to find a AiUsageLog
     * @example
     * // Get one AiUsageLog
     * const aiUsageLog = await prisma.aiUsageLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends AiUsageLogFindUniqueOrThrowArgs>(args: SelectSubset<T, AiUsageLogFindUniqueOrThrowArgs<ExtArgs>>): Prisma__AiUsageLogClient<$Result.GetResult<Prisma.$AiUsageLogPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AiUsageLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiUsageLogFindFirstArgs} args - Arguments to find a AiUsageLog
     * @example
     * // Get one AiUsageLog
     * const aiUsageLog = await prisma.aiUsageLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends AiUsageLogFindFirstArgs>(args?: SelectSubset<T, AiUsageLogFindFirstArgs<ExtArgs>>): Prisma__AiUsageLogClient<$Result.GetResult<Prisma.$AiUsageLogPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first AiUsageLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiUsageLogFindFirstOrThrowArgs} args - Arguments to find a AiUsageLog
     * @example
     * // Get one AiUsageLog
     * const aiUsageLog = await prisma.aiUsageLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends AiUsageLogFindFirstOrThrowArgs>(args?: SelectSubset<T, AiUsageLogFindFirstOrThrowArgs<ExtArgs>>): Prisma__AiUsageLogClient<$Result.GetResult<Prisma.$AiUsageLogPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more AiUsageLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiUsageLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all AiUsageLogs
     * const aiUsageLogs = await prisma.aiUsageLog.findMany()
     * 
     * // Get first 10 AiUsageLogs
     * const aiUsageLogs = await prisma.aiUsageLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const aiUsageLogWithIdOnly = await prisma.aiUsageLog.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends AiUsageLogFindManyArgs>(args?: SelectSubset<T, AiUsageLogFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiUsageLogPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a AiUsageLog.
     * @param {AiUsageLogCreateArgs} args - Arguments to create a AiUsageLog.
     * @example
     * // Create one AiUsageLog
     * const AiUsageLog = await prisma.aiUsageLog.create({
     *   data: {
     *     // ... data to create a AiUsageLog
     *   }
     * })
     * 
     */
    create<T extends AiUsageLogCreateArgs>(args: SelectSubset<T, AiUsageLogCreateArgs<ExtArgs>>): Prisma__AiUsageLogClient<$Result.GetResult<Prisma.$AiUsageLogPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many AiUsageLogs.
     * @param {AiUsageLogCreateManyArgs} args - Arguments to create many AiUsageLogs.
     * @example
     * // Create many AiUsageLogs
     * const aiUsageLog = await prisma.aiUsageLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends AiUsageLogCreateManyArgs>(args?: SelectSubset<T, AiUsageLogCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many AiUsageLogs and returns the data saved in the database.
     * @param {AiUsageLogCreateManyAndReturnArgs} args - Arguments to create many AiUsageLogs.
     * @example
     * // Create many AiUsageLogs
     * const aiUsageLog = await prisma.aiUsageLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many AiUsageLogs and only return the `id`
     * const aiUsageLogWithIdOnly = await prisma.aiUsageLog.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends AiUsageLogCreateManyAndReturnArgs>(args?: SelectSubset<T, AiUsageLogCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiUsageLogPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a AiUsageLog.
     * @param {AiUsageLogDeleteArgs} args - Arguments to delete one AiUsageLog.
     * @example
     * // Delete one AiUsageLog
     * const AiUsageLog = await prisma.aiUsageLog.delete({
     *   where: {
     *     // ... filter to delete one AiUsageLog
     *   }
     * })
     * 
     */
    delete<T extends AiUsageLogDeleteArgs>(args: SelectSubset<T, AiUsageLogDeleteArgs<ExtArgs>>): Prisma__AiUsageLogClient<$Result.GetResult<Prisma.$AiUsageLogPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one AiUsageLog.
     * @param {AiUsageLogUpdateArgs} args - Arguments to update one AiUsageLog.
     * @example
     * // Update one AiUsageLog
     * const aiUsageLog = await prisma.aiUsageLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends AiUsageLogUpdateArgs>(args: SelectSubset<T, AiUsageLogUpdateArgs<ExtArgs>>): Prisma__AiUsageLogClient<$Result.GetResult<Prisma.$AiUsageLogPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more AiUsageLogs.
     * @param {AiUsageLogDeleteManyArgs} args - Arguments to filter AiUsageLogs to delete.
     * @example
     * // Delete a few AiUsageLogs
     * const { count } = await prisma.aiUsageLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends AiUsageLogDeleteManyArgs>(args?: SelectSubset<T, AiUsageLogDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AiUsageLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiUsageLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many AiUsageLogs
     * const aiUsageLog = await prisma.aiUsageLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends AiUsageLogUpdateManyArgs>(args: SelectSubset<T, AiUsageLogUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more AiUsageLogs and returns the data updated in the database.
     * @param {AiUsageLogUpdateManyAndReturnArgs} args - Arguments to update many AiUsageLogs.
     * @example
     * // Update many AiUsageLogs
     * const aiUsageLog = await prisma.aiUsageLog.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more AiUsageLogs and only return the `id`
     * const aiUsageLogWithIdOnly = await prisma.aiUsageLog.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends AiUsageLogUpdateManyAndReturnArgs>(args: SelectSubset<T, AiUsageLogUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$AiUsageLogPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one AiUsageLog.
     * @param {AiUsageLogUpsertArgs} args - Arguments to update or create a AiUsageLog.
     * @example
     * // Update or create a AiUsageLog
     * const aiUsageLog = await prisma.aiUsageLog.upsert({
     *   create: {
     *     // ... data to create a AiUsageLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the AiUsageLog we want to update
     *   }
     * })
     */
    upsert<T extends AiUsageLogUpsertArgs>(args: SelectSubset<T, AiUsageLogUpsertArgs<ExtArgs>>): Prisma__AiUsageLogClient<$Result.GetResult<Prisma.$AiUsageLogPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of AiUsageLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiUsageLogCountArgs} args - Arguments to filter AiUsageLogs to count.
     * @example
     * // Count the number of AiUsageLogs
     * const count = await prisma.aiUsageLog.count({
     *   where: {
     *     // ... the filter for the AiUsageLogs we want to count
     *   }
     * })
    **/
    count<T extends AiUsageLogCountArgs>(
      args?: Subset<T, AiUsageLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], AiUsageLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a AiUsageLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiUsageLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends AiUsageLogAggregateArgs>(args: Subset<T, AiUsageLogAggregateArgs>): Prisma.PrismaPromise<GetAiUsageLogAggregateType<T>>

    /**
     * Group by AiUsageLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {AiUsageLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends AiUsageLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: AiUsageLogGroupByArgs['orderBy'] }
        : { orderBy?: AiUsageLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, AiUsageLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAiUsageLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the AiUsageLog model
   */
  readonly fields: AiUsageLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for AiUsageLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__AiUsageLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the AiUsageLog model
   */
  interface AiUsageLogFieldRefs {
    readonly id: FieldRef<"AiUsageLog", 'Int'>
    readonly userId: FieldRef<"AiUsageLog", 'Int'>
    readonly projectId: FieldRef<"AiUsageLog", 'Int'>
    readonly docType: FieldRef<"AiUsageLog", 'String'>
    readonly operation: FieldRef<"AiUsageLog", 'String'>
    readonly promptTokens: FieldRef<"AiUsageLog", 'Int'>
    readonly completionTokens: FieldRef<"AiUsageLog", 'Int'>
    readonly totalTokens: FieldRef<"AiUsageLog", 'Int'>
    readonly status: FieldRef<"AiUsageLog", 'String'>
    readonly errorMessage: FieldRef<"AiUsageLog", 'String'>
    readonly createdAt: FieldRef<"AiUsageLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * AiUsageLog findUnique
   */
  export type AiUsageLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiUsageLog
     */
    select?: AiUsageLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiUsageLog
     */
    omit?: AiUsageLogOmit<ExtArgs> | null
    /**
     * Filter, which AiUsageLog to fetch.
     */
    where: AiUsageLogWhereUniqueInput
  }

  /**
   * AiUsageLog findUniqueOrThrow
   */
  export type AiUsageLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiUsageLog
     */
    select?: AiUsageLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiUsageLog
     */
    omit?: AiUsageLogOmit<ExtArgs> | null
    /**
     * Filter, which AiUsageLog to fetch.
     */
    where: AiUsageLogWhereUniqueInput
  }

  /**
   * AiUsageLog findFirst
   */
  export type AiUsageLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiUsageLog
     */
    select?: AiUsageLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiUsageLog
     */
    omit?: AiUsageLogOmit<ExtArgs> | null
    /**
     * Filter, which AiUsageLog to fetch.
     */
    where?: AiUsageLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiUsageLogs to fetch.
     */
    orderBy?: AiUsageLogOrderByWithRelationInput | AiUsageLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiUsageLogs.
     */
    cursor?: AiUsageLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiUsageLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiUsageLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiUsageLogs.
     */
    distinct?: AiUsageLogScalarFieldEnum | AiUsageLogScalarFieldEnum[]
  }

  /**
   * AiUsageLog findFirstOrThrow
   */
  export type AiUsageLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiUsageLog
     */
    select?: AiUsageLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiUsageLog
     */
    omit?: AiUsageLogOmit<ExtArgs> | null
    /**
     * Filter, which AiUsageLog to fetch.
     */
    where?: AiUsageLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiUsageLogs to fetch.
     */
    orderBy?: AiUsageLogOrderByWithRelationInput | AiUsageLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for AiUsageLogs.
     */
    cursor?: AiUsageLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiUsageLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiUsageLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of AiUsageLogs.
     */
    distinct?: AiUsageLogScalarFieldEnum | AiUsageLogScalarFieldEnum[]
  }

  /**
   * AiUsageLog findMany
   */
  export type AiUsageLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiUsageLog
     */
    select?: AiUsageLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiUsageLog
     */
    omit?: AiUsageLogOmit<ExtArgs> | null
    /**
     * Filter, which AiUsageLogs to fetch.
     */
    where?: AiUsageLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of AiUsageLogs to fetch.
     */
    orderBy?: AiUsageLogOrderByWithRelationInput | AiUsageLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing AiUsageLogs.
     */
    cursor?: AiUsageLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` AiUsageLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` AiUsageLogs.
     */
    skip?: number
    distinct?: AiUsageLogScalarFieldEnum | AiUsageLogScalarFieldEnum[]
  }

  /**
   * AiUsageLog create
   */
  export type AiUsageLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiUsageLog
     */
    select?: AiUsageLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiUsageLog
     */
    omit?: AiUsageLogOmit<ExtArgs> | null
    /**
     * The data needed to create a AiUsageLog.
     */
    data: XOR<AiUsageLogCreateInput, AiUsageLogUncheckedCreateInput>
  }

  /**
   * AiUsageLog createMany
   */
  export type AiUsageLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many AiUsageLogs.
     */
    data: AiUsageLogCreateManyInput | AiUsageLogCreateManyInput[]
  }

  /**
   * AiUsageLog createManyAndReturn
   */
  export type AiUsageLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiUsageLog
     */
    select?: AiUsageLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AiUsageLog
     */
    omit?: AiUsageLogOmit<ExtArgs> | null
    /**
     * The data used to create many AiUsageLogs.
     */
    data: AiUsageLogCreateManyInput | AiUsageLogCreateManyInput[]
  }

  /**
   * AiUsageLog update
   */
  export type AiUsageLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiUsageLog
     */
    select?: AiUsageLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiUsageLog
     */
    omit?: AiUsageLogOmit<ExtArgs> | null
    /**
     * The data needed to update a AiUsageLog.
     */
    data: XOR<AiUsageLogUpdateInput, AiUsageLogUncheckedUpdateInput>
    /**
     * Choose, which AiUsageLog to update.
     */
    where: AiUsageLogWhereUniqueInput
  }

  /**
   * AiUsageLog updateMany
   */
  export type AiUsageLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update AiUsageLogs.
     */
    data: XOR<AiUsageLogUpdateManyMutationInput, AiUsageLogUncheckedUpdateManyInput>
    /**
     * Filter which AiUsageLogs to update
     */
    where?: AiUsageLogWhereInput
    /**
     * Limit how many AiUsageLogs to update.
     */
    limit?: number
  }

  /**
   * AiUsageLog updateManyAndReturn
   */
  export type AiUsageLogUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiUsageLog
     */
    select?: AiUsageLogSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the AiUsageLog
     */
    omit?: AiUsageLogOmit<ExtArgs> | null
    /**
     * The data used to update AiUsageLogs.
     */
    data: XOR<AiUsageLogUpdateManyMutationInput, AiUsageLogUncheckedUpdateManyInput>
    /**
     * Filter which AiUsageLogs to update
     */
    where?: AiUsageLogWhereInput
    /**
     * Limit how many AiUsageLogs to update.
     */
    limit?: number
  }

  /**
   * AiUsageLog upsert
   */
  export type AiUsageLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiUsageLog
     */
    select?: AiUsageLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiUsageLog
     */
    omit?: AiUsageLogOmit<ExtArgs> | null
    /**
     * The filter to search for the AiUsageLog to update in case it exists.
     */
    where: AiUsageLogWhereUniqueInput
    /**
     * In case the AiUsageLog found by the `where` argument doesn't exist, create a new AiUsageLog with this data.
     */
    create: XOR<AiUsageLogCreateInput, AiUsageLogUncheckedCreateInput>
    /**
     * In case the AiUsageLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<AiUsageLogUpdateInput, AiUsageLogUncheckedUpdateInput>
  }

  /**
   * AiUsageLog delete
   */
  export type AiUsageLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiUsageLog
     */
    select?: AiUsageLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiUsageLog
     */
    omit?: AiUsageLogOmit<ExtArgs> | null
    /**
     * Filter which AiUsageLog to delete.
     */
    where: AiUsageLogWhereUniqueInput
  }

  /**
   * AiUsageLog deleteMany
   */
  export type AiUsageLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which AiUsageLogs to delete
     */
    where?: AiUsageLogWhereInput
    /**
     * Limit how many AiUsageLogs to delete.
     */
    limit?: number
  }

  /**
   * AiUsageLog without action
   */
  export type AiUsageLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the AiUsageLog
     */
    select?: AiUsageLogSelect<ExtArgs> | null
    /**
     * Omit specific fields from the AiUsageLog
     */
    omit?: AiUsageLogOmit<ExtArgs> | null
  }


  /**
   * Model ThesisTopic
   */

  export type AggregateThesisTopic = {
    _count: ThesisTopicCountAggregateOutputType | null
    _avg: ThesisTopicAvgAggregateOutputType | null
    _sum: ThesisTopicSumAggregateOutputType | null
    _min: ThesisTopicMinAggregateOutputType | null
    _max: ThesisTopicMaxAggregateOutputType | null
  }

  export type ThesisTopicAvgAggregateOutputType = {
    id: number | null
    lockedByUserId: number | null
  }

  export type ThesisTopicSumAggregateOutputType = {
    id: number | null
    lockedByUserId: number | null
  }

  export type ThesisTopicMinAggregateOutputType = {
    id: number | null
    title: string | null
    category: string | null
    datasetName: string | null
    datasetUrl: string | null
    datasetSize: string | null
    isLocked: boolean | null
    lockedAt: Date | null
    lockedByUserId: number | null
    createdAt: Date | null
  }

  export type ThesisTopicMaxAggregateOutputType = {
    id: number | null
    title: string | null
    category: string | null
    datasetName: string | null
    datasetUrl: string | null
    datasetSize: string | null
    isLocked: boolean | null
    lockedAt: Date | null
    lockedByUserId: number | null
    createdAt: Date | null
  }

  export type ThesisTopicCountAggregateOutputType = {
    id: number
    title: number
    category: number
    datasetName: number
    datasetUrl: number
    datasetSize: number
    isLocked: number
    lockedAt: number
    lockedByUserId: number
    createdAt: number
    _all: number
  }


  export type ThesisTopicAvgAggregateInputType = {
    id?: true
    lockedByUserId?: true
  }

  export type ThesisTopicSumAggregateInputType = {
    id?: true
    lockedByUserId?: true
  }

  export type ThesisTopicMinAggregateInputType = {
    id?: true
    title?: true
    category?: true
    datasetName?: true
    datasetUrl?: true
    datasetSize?: true
    isLocked?: true
    lockedAt?: true
    lockedByUserId?: true
    createdAt?: true
  }

  export type ThesisTopicMaxAggregateInputType = {
    id?: true
    title?: true
    category?: true
    datasetName?: true
    datasetUrl?: true
    datasetSize?: true
    isLocked?: true
    lockedAt?: true
    lockedByUserId?: true
    createdAt?: true
  }

  export type ThesisTopicCountAggregateInputType = {
    id?: true
    title?: true
    category?: true
    datasetName?: true
    datasetUrl?: true
    datasetSize?: true
    isLocked?: true
    lockedAt?: true
    lockedByUserId?: true
    createdAt?: true
    _all?: true
  }

  export type ThesisTopicAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ThesisTopic to aggregate.
     */
    where?: ThesisTopicWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ThesisTopics to fetch.
     */
    orderBy?: ThesisTopicOrderByWithRelationInput | ThesisTopicOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ThesisTopicWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ThesisTopics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ThesisTopics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ThesisTopics
    **/
    _count?: true | ThesisTopicCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ThesisTopicAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ThesisTopicSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ThesisTopicMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ThesisTopicMaxAggregateInputType
  }

  export type GetThesisTopicAggregateType<T extends ThesisTopicAggregateArgs> = {
        [P in keyof T & keyof AggregateThesisTopic]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateThesisTopic[P]>
      : GetScalarType<T[P], AggregateThesisTopic[P]>
  }




  export type ThesisTopicGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ThesisTopicWhereInput
    orderBy?: ThesisTopicOrderByWithAggregationInput | ThesisTopicOrderByWithAggregationInput[]
    by: ThesisTopicScalarFieldEnum[] | ThesisTopicScalarFieldEnum
    having?: ThesisTopicScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ThesisTopicCountAggregateInputType | true
    _avg?: ThesisTopicAvgAggregateInputType
    _sum?: ThesisTopicSumAggregateInputType
    _min?: ThesisTopicMinAggregateInputType
    _max?: ThesisTopicMaxAggregateInputType
  }

  export type ThesisTopicGroupByOutputType = {
    id: number
    title: string
    category: string
    datasetName: string
    datasetUrl: string
    datasetSize: string
    isLocked: boolean
    lockedAt: Date | null
    lockedByUserId: number | null
    createdAt: Date
    _count: ThesisTopicCountAggregateOutputType | null
    _avg: ThesisTopicAvgAggregateOutputType | null
    _sum: ThesisTopicSumAggregateOutputType | null
    _min: ThesisTopicMinAggregateOutputType | null
    _max: ThesisTopicMaxAggregateOutputType | null
  }

  type GetThesisTopicGroupByPayload<T extends ThesisTopicGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ThesisTopicGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ThesisTopicGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ThesisTopicGroupByOutputType[P]>
            : GetScalarType<T[P], ThesisTopicGroupByOutputType[P]>
        }
      >
    >


  export type ThesisTopicSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    category?: boolean
    datasetName?: boolean
    datasetUrl?: boolean
    datasetSize?: boolean
    isLocked?: boolean
    lockedAt?: boolean
    lockedByUserId?: boolean
    createdAt?: boolean
    lockedBy?: boolean | ThesisTopic$lockedByArgs<ExtArgs>
    project?: boolean | ThesisTopic$projectArgs<ExtArgs>
  }, ExtArgs["result"]["thesisTopic"]>

  export type ThesisTopicSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    category?: boolean
    datasetName?: boolean
    datasetUrl?: boolean
    datasetSize?: boolean
    isLocked?: boolean
    lockedAt?: boolean
    lockedByUserId?: boolean
    createdAt?: boolean
    lockedBy?: boolean | ThesisTopic$lockedByArgs<ExtArgs>
  }, ExtArgs["result"]["thesisTopic"]>

  export type ThesisTopicSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    title?: boolean
    category?: boolean
    datasetName?: boolean
    datasetUrl?: boolean
    datasetSize?: boolean
    isLocked?: boolean
    lockedAt?: boolean
    lockedByUserId?: boolean
    createdAt?: boolean
    lockedBy?: boolean | ThesisTopic$lockedByArgs<ExtArgs>
  }, ExtArgs["result"]["thesisTopic"]>

  export type ThesisTopicSelectScalar = {
    id?: boolean
    title?: boolean
    category?: boolean
    datasetName?: boolean
    datasetUrl?: boolean
    datasetSize?: boolean
    isLocked?: boolean
    lockedAt?: boolean
    lockedByUserId?: boolean
    createdAt?: boolean
  }

  export type ThesisTopicOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "title" | "category" | "datasetName" | "datasetUrl" | "datasetSize" | "isLocked" | "lockedAt" | "lockedByUserId" | "createdAt", ExtArgs["result"]["thesisTopic"]>
  export type ThesisTopicInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lockedBy?: boolean | ThesisTopic$lockedByArgs<ExtArgs>
    project?: boolean | ThesisTopic$projectArgs<ExtArgs>
  }
  export type ThesisTopicIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lockedBy?: boolean | ThesisTopic$lockedByArgs<ExtArgs>
  }
  export type ThesisTopicIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lockedBy?: boolean | ThesisTopic$lockedByArgs<ExtArgs>
  }

  export type $ThesisTopicPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ThesisTopic"
    objects: {
      lockedBy: Prisma.$UserPayload<ExtArgs> | null
      project: Prisma.$ThesisProjectPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      title: string
      category: string
      datasetName: string
      datasetUrl: string
      datasetSize: string
      isLocked: boolean
      lockedAt: Date | null
      lockedByUserId: number | null
      createdAt: Date
    }, ExtArgs["result"]["thesisTopic"]>
    composites: {}
  }

  type ThesisTopicGetPayload<S extends boolean | null | undefined | ThesisTopicDefaultArgs> = $Result.GetResult<Prisma.$ThesisTopicPayload, S>

  type ThesisTopicCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ThesisTopicFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ThesisTopicCountAggregateInputType | true
    }

  export interface ThesisTopicDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ThesisTopic'], meta: { name: 'ThesisTopic' } }
    /**
     * Find zero or one ThesisTopic that matches the filter.
     * @param {ThesisTopicFindUniqueArgs} args - Arguments to find a ThesisTopic
     * @example
     * // Get one ThesisTopic
     * const thesisTopic = await prisma.thesisTopic.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ThesisTopicFindUniqueArgs>(args: SelectSubset<T, ThesisTopicFindUniqueArgs<ExtArgs>>): Prisma__ThesisTopicClient<$Result.GetResult<Prisma.$ThesisTopicPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ThesisTopic that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ThesisTopicFindUniqueOrThrowArgs} args - Arguments to find a ThesisTopic
     * @example
     * // Get one ThesisTopic
     * const thesisTopic = await prisma.thesisTopic.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ThesisTopicFindUniqueOrThrowArgs>(args: SelectSubset<T, ThesisTopicFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ThesisTopicClient<$Result.GetResult<Prisma.$ThesisTopicPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ThesisTopic that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ThesisTopicFindFirstArgs} args - Arguments to find a ThesisTopic
     * @example
     * // Get one ThesisTopic
     * const thesisTopic = await prisma.thesisTopic.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ThesisTopicFindFirstArgs>(args?: SelectSubset<T, ThesisTopicFindFirstArgs<ExtArgs>>): Prisma__ThesisTopicClient<$Result.GetResult<Prisma.$ThesisTopicPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ThesisTopic that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ThesisTopicFindFirstOrThrowArgs} args - Arguments to find a ThesisTopic
     * @example
     * // Get one ThesisTopic
     * const thesisTopic = await prisma.thesisTopic.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ThesisTopicFindFirstOrThrowArgs>(args?: SelectSubset<T, ThesisTopicFindFirstOrThrowArgs<ExtArgs>>): Prisma__ThesisTopicClient<$Result.GetResult<Prisma.$ThesisTopicPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ThesisTopics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ThesisTopicFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ThesisTopics
     * const thesisTopics = await prisma.thesisTopic.findMany()
     * 
     * // Get first 10 ThesisTopics
     * const thesisTopics = await prisma.thesisTopic.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const thesisTopicWithIdOnly = await prisma.thesisTopic.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ThesisTopicFindManyArgs>(args?: SelectSubset<T, ThesisTopicFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ThesisTopicPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ThesisTopic.
     * @param {ThesisTopicCreateArgs} args - Arguments to create a ThesisTopic.
     * @example
     * // Create one ThesisTopic
     * const ThesisTopic = await prisma.thesisTopic.create({
     *   data: {
     *     // ... data to create a ThesisTopic
     *   }
     * })
     * 
     */
    create<T extends ThesisTopicCreateArgs>(args: SelectSubset<T, ThesisTopicCreateArgs<ExtArgs>>): Prisma__ThesisTopicClient<$Result.GetResult<Prisma.$ThesisTopicPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ThesisTopics.
     * @param {ThesisTopicCreateManyArgs} args - Arguments to create many ThesisTopics.
     * @example
     * // Create many ThesisTopics
     * const thesisTopic = await prisma.thesisTopic.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ThesisTopicCreateManyArgs>(args?: SelectSubset<T, ThesisTopicCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ThesisTopics and returns the data saved in the database.
     * @param {ThesisTopicCreateManyAndReturnArgs} args - Arguments to create many ThesisTopics.
     * @example
     * // Create many ThesisTopics
     * const thesisTopic = await prisma.thesisTopic.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ThesisTopics and only return the `id`
     * const thesisTopicWithIdOnly = await prisma.thesisTopic.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ThesisTopicCreateManyAndReturnArgs>(args?: SelectSubset<T, ThesisTopicCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ThesisTopicPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ThesisTopic.
     * @param {ThesisTopicDeleteArgs} args - Arguments to delete one ThesisTopic.
     * @example
     * // Delete one ThesisTopic
     * const ThesisTopic = await prisma.thesisTopic.delete({
     *   where: {
     *     // ... filter to delete one ThesisTopic
     *   }
     * })
     * 
     */
    delete<T extends ThesisTopicDeleteArgs>(args: SelectSubset<T, ThesisTopicDeleteArgs<ExtArgs>>): Prisma__ThesisTopicClient<$Result.GetResult<Prisma.$ThesisTopicPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ThesisTopic.
     * @param {ThesisTopicUpdateArgs} args - Arguments to update one ThesisTopic.
     * @example
     * // Update one ThesisTopic
     * const thesisTopic = await prisma.thesisTopic.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ThesisTopicUpdateArgs>(args: SelectSubset<T, ThesisTopicUpdateArgs<ExtArgs>>): Prisma__ThesisTopicClient<$Result.GetResult<Prisma.$ThesisTopicPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ThesisTopics.
     * @param {ThesisTopicDeleteManyArgs} args - Arguments to filter ThesisTopics to delete.
     * @example
     * // Delete a few ThesisTopics
     * const { count } = await prisma.thesisTopic.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ThesisTopicDeleteManyArgs>(args?: SelectSubset<T, ThesisTopicDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ThesisTopics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ThesisTopicUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ThesisTopics
     * const thesisTopic = await prisma.thesisTopic.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ThesisTopicUpdateManyArgs>(args: SelectSubset<T, ThesisTopicUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ThesisTopics and returns the data updated in the database.
     * @param {ThesisTopicUpdateManyAndReturnArgs} args - Arguments to update many ThesisTopics.
     * @example
     * // Update many ThesisTopics
     * const thesisTopic = await prisma.thesisTopic.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ThesisTopics and only return the `id`
     * const thesisTopicWithIdOnly = await prisma.thesisTopic.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ThesisTopicUpdateManyAndReturnArgs>(args: SelectSubset<T, ThesisTopicUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ThesisTopicPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ThesisTopic.
     * @param {ThesisTopicUpsertArgs} args - Arguments to update or create a ThesisTopic.
     * @example
     * // Update or create a ThesisTopic
     * const thesisTopic = await prisma.thesisTopic.upsert({
     *   create: {
     *     // ... data to create a ThesisTopic
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ThesisTopic we want to update
     *   }
     * })
     */
    upsert<T extends ThesisTopicUpsertArgs>(args: SelectSubset<T, ThesisTopicUpsertArgs<ExtArgs>>): Prisma__ThesisTopicClient<$Result.GetResult<Prisma.$ThesisTopicPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ThesisTopics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ThesisTopicCountArgs} args - Arguments to filter ThesisTopics to count.
     * @example
     * // Count the number of ThesisTopics
     * const count = await prisma.thesisTopic.count({
     *   where: {
     *     // ... the filter for the ThesisTopics we want to count
     *   }
     * })
    **/
    count<T extends ThesisTopicCountArgs>(
      args?: Subset<T, ThesisTopicCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ThesisTopicCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ThesisTopic.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ThesisTopicAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ThesisTopicAggregateArgs>(args: Subset<T, ThesisTopicAggregateArgs>): Prisma.PrismaPromise<GetThesisTopicAggregateType<T>>

    /**
     * Group by ThesisTopic.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ThesisTopicGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ThesisTopicGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ThesisTopicGroupByArgs['orderBy'] }
        : { orderBy?: ThesisTopicGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ThesisTopicGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetThesisTopicGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ThesisTopic model
   */
  readonly fields: ThesisTopicFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ThesisTopic.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ThesisTopicClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    lockedBy<T extends ThesisTopic$lockedByArgs<ExtArgs> = {}>(args?: Subset<T, ThesisTopic$lockedByArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    project<T extends ThesisTopic$projectArgs<ExtArgs> = {}>(args?: Subset<T, ThesisTopic$projectArgs<ExtArgs>>): Prisma__ThesisProjectClient<$Result.GetResult<Prisma.$ThesisProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ThesisTopic model
   */
  interface ThesisTopicFieldRefs {
    readonly id: FieldRef<"ThesisTopic", 'Int'>
    readonly title: FieldRef<"ThesisTopic", 'String'>
    readonly category: FieldRef<"ThesisTopic", 'String'>
    readonly datasetName: FieldRef<"ThesisTopic", 'String'>
    readonly datasetUrl: FieldRef<"ThesisTopic", 'String'>
    readonly datasetSize: FieldRef<"ThesisTopic", 'String'>
    readonly isLocked: FieldRef<"ThesisTopic", 'Boolean'>
    readonly lockedAt: FieldRef<"ThesisTopic", 'DateTime'>
    readonly lockedByUserId: FieldRef<"ThesisTopic", 'Int'>
    readonly createdAt: FieldRef<"ThesisTopic", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ThesisTopic findUnique
   */
  export type ThesisTopicFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ThesisTopic
     */
    select?: ThesisTopicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ThesisTopic
     */
    omit?: ThesisTopicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThesisTopicInclude<ExtArgs> | null
    /**
     * Filter, which ThesisTopic to fetch.
     */
    where: ThesisTopicWhereUniqueInput
  }

  /**
   * ThesisTopic findUniqueOrThrow
   */
  export type ThesisTopicFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ThesisTopic
     */
    select?: ThesisTopicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ThesisTopic
     */
    omit?: ThesisTopicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThesisTopicInclude<ExtArgs> | null
    /**
     * Filter, which ThesisTopic to fetch.
     */
    where: ThesisTopicWhereUniqueInput
  }

  /**
   * ThesisTopic findFirst
   */
  export type ThesisTopicFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ThesisTopic
     */
    select?: ThesisTopicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ThesisTopic
     */
    omit?: ThesisTopicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThesisTopicInclude<ExtArgs> | null
    /**
     * Filter, which ThesisTopic to fetch.
     */
    where?: ThesisTopicWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ThesisTopics to fetch.
     */
    orderBy?: ThesisTopicOrderByWithRelationInput | ThesisTopicOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ThesisTopics.
     */
    cursor?: ThesisTopicWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ThesisTopics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ThesisTopics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ThesisTopics.
     */
    distinct?: ThesisTopicScalarFieldEnum | ThesisTopicScalarFieldEnum[]
  }

  /**
   * ThesisTopic findFirstOrThrow
   */
  export type ThesisTopicFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ThesisTopic
     */
    select?: ThesisTopicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ThesisTopic
     */
    omit?: ThesisTopicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThesisTopicInclude<ExtArgs> | null
    /**
     * Filter, which ThesisTopic to fetch.
     */
    where?: ThesisTopicWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ThesisTopics to fetch.
     */
    orderBy?: ThesisTopicOrderByWithRelationInput | ThesisTopicOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ThesisTopics.
     */
    cursor?: ThesisTopicWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ThesisTopics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ThesisTopics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ThesisTopics.
     */
    distinct?: ThesisTopicScalarFieldEnum | ThesisTopicScalarFieldEnum[]
  }

  /**
   * ThesisTopic findMany
   */
  export type ThesisTopicFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ThesisTopic
     */
    select?: ThesisTopicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ThesisTopic
     */
    omit?: ThesisTopicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThesisTopicInclude<ExtArgs> | null
    /**
     * Filter, which ThesisTopics to fetch.
     */
    where?: ThesisTopicWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ThesisTopics to fetch.
     */
    orderBy?: ThesisTopicOrderByWithRelationInput | ThesisTopicOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ThesisTopics.
     */
    cursor?: ThesisTopicWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ThesisTopics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ThesisTopics.
     */
    skip?: number
    distinct?: ThesisTopicScalarFieldEnum | ThesisTopicScalarFieldEnum[]
  }

  /**
   * ThesisTopic create
   */
  export type ThesisTopicCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ThesisTopic
     */
    select?: ThesisTopicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ThesisTopic
     */
    omit?: ThesisTopicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThesisTopicInclude<ExtArgs> | null
    /**
     * The data needed to create a ThesisTopic.
     */
    data: XOR<ThesisTopicCreateInput, ThesisTopicUncheckedCreateInput>
  }

  /**
   * ThesisTopic createMany
   */
  export type ThesisTopicCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ThesisTopics.
     */
    data: ThesisTopicCreateManyInput | ThesisTopicCreateManyInput[]
  }

  /**
   * ThesisTopic createManyAndReturn
   */
  export type ThesisTopicCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ThesisTopic
     */
    select?: ThesisTopicSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ThesisTopic
     */
    omit?: ThesisTopicOmit<ExtArgs> | null
    /**
     * The data used to create many ThesisTopics.
     */
    data: ThesisTopicCreateManyInput | ThesisTopicCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThesisTopicIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ThesisTopic update
   */
  export type ThesisTopicUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ThesisTopic
     */
    select?: ThesisTopicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ThesisTopic
     */
    omit?: ThesisTopicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThesisTopicInclude<ExtArgs> | null
    /**
     * The data needed to update a ThesisTopic.
     */
    data: XOR<ThesisTopicUpdateInput, ThesisTopicUncheckedUpdateInput>
    /**
     * Choose, which ThesisTopic to update.
     */
    where: ThesisTopicWhereUniqueInput
  }

  /**
   * ThesisTopic updateMany
   */
  export type ThesisTopicUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ThesisTopics.
     */
    data: XOR<ThesisTopicUpdateManyMutationInput, ThesisTopicUncheckedUpdateManyInput>
    /**
     * Filter which ThesisTopics to update
     */
    where?: ThesisTopicWhereInput
    /**
     * Limit how many ThesisTopics to update.
     */
    limit?: number
  }

  /**
   * ThesisTopic updateManyAndReturn
   */
  export type ThesisTopicUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ThesisTopic
     */
    select?: ThesisTopicSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ThesisTopic
     */
    omit?: ThesisTopicOmit<ExtArgs> | null
    /**
     * The data used to update ThesisTopics.
     */
    data: XOR<ThesisTopicUpdateManyMutationInput, ThesisTopicUncheckedUpdateManyInput>
    /**
     * Filter which ThesisTopics to update
     */
    where?: ThesisTopicWhereInput
    /**
     * Limit how many ThesisTopics to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThesisTopicIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ThesisTopic upsert
   */
  export type ThesisTopicUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ThesisTopic
     */
    select?: ThesisTopicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ThesisTopic
     */
    omit?: ThesisTopicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThesisTopicInclude<ExtArgs> | null
    /**
     * The filter to search for the ThesisTopic to update in case it exists.
     */
    where: ThesisTopicWhereUniqueInput
    /**
     * In case the ThesisTopic found by the `where` argument doesn't exist, create a new ThesisTopic with this data.
     */
    create: XOR<ThesisTopicCreateInput, ThesisTopicUncheckedCreateInput>
    /**
     * In case the ThesisTopic was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ThesisTopicUpdateInput, ThesisTopicUncheckedUpdateInput>
  }

  /**
   * ThesisTopic delete
   */
  export type ThesisTopicDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ThesisTopic
     */
    select?: ThesisTopicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ThesisTopic
     */
    omit?: ThesisTopicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThesisTopicInclude<ExtArgs> | null
    /**
     * Filter which ThesisTopic to delete.
     */
    where: ThesisTopicWhereUniqueInput
  }

  /**
   * ThesisTopic deleteMany
   */
  export type ThesisTopicDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ThesisTopics to delete
     */
    where?: ThesisTopicWhereInput
    /**
     * Limit how many ThesisTopics to delete.
     */
    limit?: number
  }

  /**
   * ThesisTopic.lockedBy
   */
  export type ThesisTopic$lockedByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    where?: UserWhereInput
  }

  /**
   * ThesisTopic.project
   */
  export type ThesisTopic$projectArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ThesisProject
     */
    select?: ThesisProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ThesisProject
     */
    omit?: ThesisProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThesisProjectInclude<ExtArgs> | null
    where?: ThesisProjectWhereInput
  }

  /**
   * ThesisTopic without action
   */
  export type ThesisTopicDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ThesisTopic
     */
    select?: ThesisTopicSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ThesisTopic
     */
    omit?: ThesisTopicOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThesisTopicInclude<ExtArgs> | null
  }


  /**
   * Model ThesisProject
   */

  export type AggregateThesisProject = {
    _count: ThesisProjectCountAggregateOutputType | null
    _avg: ThesisProjectAvgAggregateOutputType | null
    _sum: ThesisProjectSumAggregateOutputType | null
    _min: ThesisProjectMinAggregateOutputType | null
    _max: ThesisProjectMaxAggregateOutputType | null
  }

  export type ThesisProjectAvgAggregateOutputType = {
    id: number | null
    userId: number | null
    topicId: number | null
    projectId: number | null
  }

  export type ThesisProjectSumAggregateOutputType = {
    id: number | null
    userId: number | null
    topicId: number | null
    projectId: number | null
  }

  export type ThesisProjectMinAggregateOutputType = {
    id: number | null
    userId: number | null
    topicId: number | null
    projectId: number | null
    repoUrl: string | null
    deployUrl: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ThesisProjectMaxAggregateOutputType = {
    id: number | null
    userId: number | null
    topicId: number | null
    projectId: number | null
    repoUrl: string | null
    deployUrl: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ThesisProjectCountAggregateOutputType = {
    id: number
    userId: number
    topicId: number
    projectId: number
    repoUrl: number
    deployUrl: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ThesisProjectAvgAggregateInputType = {
    id?: true
    userId?: true
    topicId?: true
    projectId?: true
  }

  export type ThesisProjectSumAggregateInputType = {
    id?: true
    userId?: true
    topicId?: true
    projectId?: true
  }

  export type ThesisProjectMinAggregateInputType = {
    id?: true
    userId?: true
    topicId?: true
    projectId?: true
    repoUrl?: true
    deployUrl?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ThesisProjectMaxAggregateInputType = {
    id?: true
    userId?: true
    topicId?: true
    projectId?: true
    repoUrl?: true
    deployUrl?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ThesisProjectCountAggregateInputType = {
    id?: true
    userId?: true
    topicId?: true
    projectId?: true
    repoUrl?: true
    deployUrl?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ThesisProjectAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ThesisProject to aggregate.
     */
    where?: ThesisProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ThesisProjects to fetch.
     */
    orderBy?: ThesisProjectOrderByWithRelationInput | ThesisProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ThesisProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ThesisProjects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ThesisProjects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ThesisProjects
    **/
    _count?: true | ThesisProjectCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ThesisProjectAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ThesisProjectSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ThesisProjectMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ThesisProjectMaxAggregateInputType
  }

  export type GetThesisProjectAggregateType<T extends ThesisProjectAggregateArgs> = {
        [P in keyof T & keyof AggregateThesisProject]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateThesisProject[P]>
      : GetScalarType<T[P], AggregateThesisProject[P]>
  }




  export type ThesisProjectGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ThesisProjectWhereInput
    orderBy?: ThesisProjectOrderByWithAggregationInput | ThesisProjectOrderByWithAggregationInput[]
    by: ThesisProjectScalarFieldEnum[] | ThesisProjectScalarFieldEnum
    having?: ThesisProjectScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ThesisProjectCountAggregateInputType | true
    _avg?: ThesisProjectAvgAggregateInputType
    _sum?: ThesisProjectSumAggregateInputType
    _min?: ThesisProjectMinAggregateInputType
    _max?: ThesisProjectMaxAggregateInputType
  }

  export type ThesisProjectGroupByOutputType = {
    id: number
    userId: number
    topicId: number
    projectId: number | null
    repoUrl: string | null
    deployUrl: string | null
    createdAt: Date
    updatedAt: Date
    _count: ThesisProjectCountAggregateOutputType | null
    _avg: ThesisProjectAvgAggregateOutputType | null
    _sum: ThesisProjectSumAggregateOutputType | null
    _min: ThesisProjectMinAggregateOutputType | null
    _max: ThesisProjectMaxAggregateOutputType | null
  }

  type GetThesisProjectGroupByPayload<T extends ThesisProjectGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ThesisProjectGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ThesisProjectGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ThesisProjectGroupByOutputType[P]>
            : GetScalarType<T[P], ThesisProjectGroupByOutputType[P]>
        }
      >
    >


  export type ThesisProjectSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    topicId?: boolean
    projectId?: boolean
    repoUrl?: boolean
    deployUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    topic?: boolean | ThesisTopicDefaultArgs<ExtArgs>
    project?: boolean | ThesisProject$projectArgs<ExtArgs>
  }, ExtArgs["result"]["thesisProject"]>

  export type ThesisProjectSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    topicId?: boolean
    projectId?: boolean
    repoUrl?: boolean
    deployUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    topic?: boolean | ThesisTopicDefaultArgs<ExtArgs>
    project?: boolean | ThesisProject$projectArgs<ExtArgs>
  }, ExtArgs["result"]["thesisProject"]>

  export type ThesisProjectSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    topicId?: boolean
    projectId?: boolean
    repoUrl?: boolean
    deployUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    topic?: boolean | ThesisTopicDefaultArgs<ExtArgs>
    project?: boolean | ThesisProject$projectArgs<ExtArgs>
  }, ExtArgs["result"]["thesisProject"]>

  export type ThesisProjectSelectScalar = {
    id?: boolean
    userId?: boolean
    topicId?: boolean
    projectId?: boolean
    repoUrl?: boolean
    deployUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ThesisProjectOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "topicId" | "projectId" | "repoUrl" | "deployUrl" | "createdAt" | "updatedAt", ExtArgs["result"]["thesisProject"]>
  export type ThesisProjectInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    topic?: boolean | ThesisTopicDefaultArgs<ExtArgs>
    project?: boolean | ThesisProject$projectArgs<ExtArgs>
  }
  export type ThesisProjectIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    topic?: boolean | ThesisTopicDefaultArgs<ExtArgs>
    project?: boolean | ThesisProject$projectArgs<ExtArgs>
  }
  export type ThesisProjectIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    topic?: boolean | ThesisTopicDefaultArgs<ExtArgs>
    project?: boolean | ThesisProject$projectArgs<ExtArgs>
  }

  export type $ThesisProjectPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ThesisProject"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      topic: Prisma.$ThesisTopicPayload<ExtArgs>
      project: Prisma.$ProjectPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      userId: number
      topicId: number
      projectId: number | null
      repoUrl: string | null
      deployUrl: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["thesisProject"]>
    composites: {}
  }

  type ThesisProjectGetPayload<S extends boolean | null | undefined | ThesisProjectDefaultArgs> = $Result.GetResult<Prisma.$ThesisProjectPayload, S>

  type ThesisProjectCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ThesisProjectFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ThesisProjectCountAggregateInputType | true
    }

  export interface ThesisProjectDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ThesisProject'], meta: { name: 'ThesisProject' } }
    /**
     * Find zero or one ThesisProject that matches the filter.
     * @param {ThesisProjectFindUniqueArgs} args - Arguments to find a ThesisProject
     * @example
     * // Get one ThesisProject
     * const thesisProject = await prisma.thesisProject.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ThesisProjectFindUniqueArgs>(args: SelectSubset<T, ThesisProjectFindUniqueArgs<ExtArgs>>): Prisma__ThesisProjectClient<$Result.GetResult<Prisma.$ThesisProjectPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ThesisProject that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ThesisProjectFindUniqueOrThrowArgs} args - Arguments to find a ThesisProject
     * @example
     * // Get one ThesisProject
     * const thesisProject = await prisma.thesisProject.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ThesisProjectFindUniqueOrThrowArgs>(args: SelectSubset<T, ThesisProjectFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ThesisProjectClient<$Result.GetResult<Prisma.$ThesisProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ThesisProject that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ThesisProjectFindFirstArgs} args - Arguments to find a ThesisProject
     * @example
     * // Get one ThesisProject
     * const thesisProject = await prisma.thesisProject.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ThesisProjectFindFirstArgs>(args?: SelectSubset<T, ThesisProjectFindFirstArgs<ExtArgs>>): Prisma__ThesisProjectClient<$Result.GetResult<Prisma.$ThesisProjectPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ThesisProject that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ThesisProjectFindFirstOrThrowArgs} args - Arguments to find a ThesisProject
     * @example
     * // Get one ThesisProject
     * const thesisProject = await prisma.thesisProject.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ThesisProjectFindFirstOrThrowArgs>(args?: SelectSubset<T, ThesisProjectFindFirstOrThrowArgs<ExtArgs>>): Prisma__ThesisProjectClient<$Result.GetResult<Prisma.$ThesisProjectPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ThesisProjects that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ThesisProjectFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ThesisProjects
     * const thesisProjects = await prisma.thesisProject.findMany()
     * 
     * // Get first 10 ThesisProjects
     * const thesisProjects = await prisma.thesisProject.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const thesisProjectWithIdOnly = await prisma.thesisProject.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ThesisProjectFindManyArgs>(args?: SelectSubset<T, ThesisProjectFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ThesisProjectPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ThesisProject.
     * @param {ThesisProjectCreateArgs} args - Arguments to create a ThesisProject.
     * @example
     * // Create one ThesisProject
     * const ThesisProject = await prisma.thesisProject.create({
     *   data: {
     *     // ... data to create a ThesisProject
     *   }
     * })
     * 
     */
    create<T extends ThesisProjectCreateArgs>(args: SelectSubset<T, ThesisProjectCreateArgs<ExtArgs>>): Prisma__ThesisProjectClient<$Result.GetResult<Prisma.$ThesisProjectPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ThesisProjects.
     * @param {ThesisProjectCreateManyArgs} args - Arguments to create many ThesisProjects.
     * @example
     * // Create many ThesisProjects
     * const thesisProject = await prisma.thesisProject.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ThesisProjectCreateManyArgs>(args?: SelectSubset<T, ThesisProjectCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ThesisProjects and returns the data saved in the database.
     * @param {ThesisProjectCreateManyAndReturnArgs} args - Arguments to create many ThesisProjects.
     * @example
     * // Create many ThesisProjects
     * const thesisProject = await prisma.thesisProject.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ThesisProjects and only return the `id`
     * const thesisProjectWithIdOnly = await prisma.thesisProject.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ThesisProjectCreateManyAndReturnArgs>(args?: SelectSubset<T, ThesisProjectCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ThesisProjectPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ThesisProject.
     * @param {ThesisProjectDeleteArgs} args - Arguments to delete one ThesisProject.
     * @example
     * // Delete one ThesisProject
     * const ThesisProject = await prisma.thesisProject.delete({
     *   where: {
     *     // ... filter to delete one ThesisProject
     *   }
     * })
     * 
     */
    delete<T extends ThesisProjectDeleteArgs>(args: SelectSubset<T, ThesisProjectDeleteArgs<ExtArgs>>): Prisma__ThesisProjectClient<$Result.GetResult<Prisma.$ThesisProjectPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ThesisProject.
     * @param {ThesisProjectUpdateArgs} args - Arguments to update one ThesisProject.
     * @example
     * // Update one ThesisProject
     * const thesisProject = await prisma.thesisProject.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ThesisProjectUpdateArgs>(args: SelectSubset<T, ThesisProjectUpdateArgs<ExtArgs>>): Prisma__ThesisProjectClient<$Result.GetResult<Prisma.$ThesisProjectPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ThesisProjects.
     * @param {ThesisProjectDeleteManyArgs} args - Arguments to filter ThesisProjects to delete.
     * @example
     * // Delete a few ThesisProjects
     * const { count } = await prisma.thesisProject.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ThesisProjectDeleteManyArgs>(args?: SelectSubset<T, ThesisProjectDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ThesisProjects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ThesisProjectUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ThesisProjects
     * const thesisProject = await prisma.thesisProject.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ThesisProjectUpdateManyArgs>(args: SelectSubset<T, ThesisProjectUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ThesisProjects and returns the data updated in the database.
     * @param {ThesisProjectUpdateManyAndReturnArgs} args - Arguments to update many ThesisProjects.
     * @example
     * // Update many ThesisProjects
     * const thesisProject = await prisma.thesisProject.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ThesisProjects and only return the `id`
     * const thesisProjectWithIdOnly = await prisma.thesisProject.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ThesisProjectUpdateManyAndReturnArgs>(args: SelectSubset<T, ThesisProjectUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ThesisProjectPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ThesisProject.
     * @param {ThesisProjectUpsertArgs} args - Arguments to update or create a ThesisProject.
     * @example
     * // Update or create a ThesisProject
     * const thesisProject = await prisma.thesisProject.upsert({
     *   create: {
     *     // ... data to create a ThesisProject
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ThesisProject we want to update
     *   }
     * })
     */
    upsert<T extends ThesisProjectUpsertArgs>(args: SelectSubset<T, ThesisProjectUpsertArgs<ExtArgs>>): Prisma__ThesisProjectClient<$Result.GetResult<Prisma.$ThesisProjectPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ThesisProjects.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ThesisProjectCountArgs} args - Arguments to filter ThesisProjects to count.
     * @example
     * // Count the number of ThesisProjects
     * const count = await prisma.thesisProject.count({
     *   where: {
     *     // ... the filter for the ThesisProjects we want to count
     *   }
     * })
    **/
    count<T extends ThesisProjectCountArgs>(
      args?: Subset<T, ThesisProjectCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ThesisProjectCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ThesisProject.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ThesisProjectAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ThesisProjectAggregateArgs>(args: Subset<T, ThesisProjectAggregateArgs>): Prisma.PrismaPromise<GetThesisProjectAggregateType<T>>

    /**
     * Group by ThesisProject.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ThesisProjectGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ThesisProjectGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ThesisProjectGroupByArgs['orderBy'] }
        : { orderBy?: ThesisProjectGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ThesisProjectGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetThesisProjectGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ThesisProject model
   */
  readonly fields: ThesisProjectFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ThesisProject.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ThesisProjectClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    topic<T extends ThesisTopicDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ThesisTopicDefaultArgs<ExtArgs>>): Prisma__ThesisTopicClient<$Result.GetResult<Prisma.$ThesisTopicPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    project<T extends ThesisProject$projectArgs<ExtArgs> = {}>(args?: Subset<T, ThesisProject$projectArgs<ExtArgs>>): Prisma__ProjectClient<$Result.GetResult<Prisma.$ProjectPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ThesisProject model
   */
  interface ThesisProjectFieldRefs {
    readonly id: FieldRef<"ThesisProject", 'Int'>
    readonly userId: FieldRef<"ThesisProject", 'Int'>
    readonly topicId: FieldRef<"ThesisProject", 'Int'>
    readonly projectId: FieldRef<"ThesisProject", 'Int'>
    readonly repoUrl: FieldRef<"ThesisProject", 'String'>
    readonly deployUrl: FieldRef<"ThesisProject", 'String'>
    readonly createdAt: FieldRef<"ThesisProject", 'DateTime'>
    readonly updatedAt: FieldRef<"ThesisProject", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ThesisProject findUnique
   */
  export type ThesisProjectFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ThesisProject
     */
    select?: ThesisProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ThesisProject
     */
    omit?: ThesisProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThesisProjectInclude<ExtArgs> | null
    /**
     * Filter, which ThesisProject to fetch.
     */
    where: ThesisProjectWhereUniqueInput
  }

  /**
   * ThesisProject findUniqueOrThrow
   */
  export type ThesisProjectFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ThesisProject
     */
    select?: ThesisProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ThesisProject
     */
    omit?: ThesisProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThesisProjectInclude<ExtArgs> | null
    /**
     * Filter, which ThesisProject to fetch.
     */
    where: ThesisProjectWhereUniqueInput
  }

  /**
   * ThesisProject findFirst
   */
  export type ThesisProjectFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ThesisProject
     */
    select?: ThesisProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ThesisProject
     */
    omit?: ThesisProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThesisProjectInclude<ExtArgs> | null
    /**
     * Filter, which ThesisProject to fetch.
     */
    where?: ThesisProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ThesisProjects to fetch.
     */
    orderBy?: ThesisProjectOrderByWithRelationInput | ThesisProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ThesisProjects.
     */
    cursor?: ThesisProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ThesisProjects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ThesisProjects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ThesisProjects.
     */
    distinct?: ThesisProjectScalarFieldEnum | ThesisProjectScalarFieldEnum[]
  }

  /**
   * ThesisProject findFirstOrThrow
   */
  export type ThesisProjectFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ThesisProject
     */
    select?: ThesisProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ThesisProject
     */
    omit?: ThesisProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThesisProjectInclude<ExtArgs> | null
    /**
     * Filter, which ThesisProject to fetch.
     */
    where?: ThesisProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ThesisProjects to fetch.
     */
    orderBy?: ThesisProjectOrderByWithRelationInput | ThesisProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ThesisProjects.
     */
    cursor?: ThesisProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ThesisProjects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ThesisProjects.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ThesisProjects.
     */
    distinct?: ThesisProjectScalarFieldEnum | ThesisProjectScalarFieldEnum[]
  }

  /**
   * ThesisProject findMany
   */
  export type ThesisProjectFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ThesisProject
     */
    select?: ThesisProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ThesisProject
     */
    omit?: ThesisProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThesisProjectInclude<ExtArgs> | null
    /**
     * Filter, which ThesisProjects to fetch.
     */
    where?: ThesisProjectWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ThesisProjects to fetch.
     */
    orderBy?: ThesisProjectOrderByWithRelationInput | ThesisProjectOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ThesisProjects.
     */
    cursor?: ThesisProjectWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ThesisProjects from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ThesisProjects.
     */
    skip?: number
    distinct?: ThesisProjectScalarFieldEnum | ThesisProjectScalarFieldEnum[]
  }

  /**
   * ThesisProject create
   */
  export type ThesisProjectCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ThesisProject
     */
    select?: ThesisProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ThesisProject
     */
    omit?: ThesisProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThesisProjectInclude<ExtArgs> | null
    /**
     * The data needed to create a ThesisProject.
     */
    data: XOR<ThesisProjectCreateInput, ThesisProjectUncheckedCreateInput>
  }

  /**
   * ThesisProject createMany
   */
  export type ThesisProjectCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ThesisProjects.
     */
    data: ThesisProjectCreateManyInput | ThesisProjectCreateManyInput[]
  }

  /**
   * ThesisProject createManyAndReturn
   */
  export type ThesisProjectCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ThesisProject
     */
    select?: ThesisProjectSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ThesisProject
     */
    omit?: ThesisProjectOmit<ExtArgs> | null
    /**
     * The data used to create many ThesisProjects.
     */
    data: ThesisProjectCreateManyInput | ThesisProjectCreateManyInput[]
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThesisProjectIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ThesisProject update
   */
  export type ThesisProjectUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ThesisProject
     */
    select?: ThesisProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ThesisProject
     */
    omit?: ThesisProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThesisProjectInclude<ExtArgs> | null
    /**
     * The data needed to update a ThesisProject.
     */
    data: XOR<ThesisProjectUpdateInput, ThesisProjectUncheckedUpdateInput>
    /**
     * Choose, which ThesisProject to update.
     */
    where: ThesisProjectWhereUniqueInput
  }

  /**
   * ThesisProject updateMany
   */
  export type ThesisProjectUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ThesisProjects.
     */
    data: XOR<ThesisProjectUpdateManyMutationInput, ThesisProjectUncheckedUpdateManyInput>
    /**
     * Filter which ThesisProjects to update
     */
    where?: ThesisProjectWhereInput
    /**
     * Limit how many ThesisProjects to update.
     */
    limit?: number
  }

  /**
   * ThesisProject updateManyAndReturn
   */
  export type ThesisProjectUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ThesisProject
     */
    select?: ThesisProjectSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ThesisProject
     */
    omit?: ThesisProjectOmit<ExtArgs> | null
    /**
     * The data used to update ThesisProjects.
     */
    data: XOR<ThesisProjectUpdateManyMutationInput, ThesisProjectUncheckedUpdateManyInput>
    /**
     * Filter which ThesisProjects to update
     */
    where?: ThesisProjectWhereInput
    /**
     * Limit how many ThesisProjects to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThesisProjectIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ThesisProject upsert
   */
  export type ThesisProjectUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ThesisProject
     */
    select?: ThesisProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ThesisProject
     */
    omit?: ThesisProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThesisProjectInclude<ExtArgs> | null
    /**
     * The filter to search for the ThesisProject to update in case it exists.
     */
    where: ThesisProjectWhereUniqueInput
    /**
     * In case the ThesisProject found by the `where` argument doesn't exist, create a new ThesisProject with this data.
     */
    create: XOR<ThesisProjectCreateInput, ThesisProjectUncheckedCreateInput>
    /**
     * In case the ThesisProject was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ThesisProjectUpdateInput, ThesisProjectUncheckedUpdateInput>
  }

  /**
   * ThesisProject delete
   */
  export type ThesisProjectDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ThesisProject
     */
    select?: ThesisProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ThesisProject
     */
    omit?: ThesisProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThesisProjectInclude<ExtArgs> | null
    /**
     * Filter which ThesisProject to delete.
     */
    where: ThesisProjectWhereUniqueInput
  }

  /**
   * ThesisProject deleteMany
   */
  export type ThesisProjectDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ThesisProjects to delete
     */
    where?: ThesisProjectWhereInput
    /**
     * Limit how many ThesisProjects to delete.
     */
    limit?: number
  }

  /**
   * ThesisProject.project
   */
  export type ThesisProject$projectArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Project
     */
    select?: ProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Project
     */
    omit?: ProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ProjectInclude<ExtArgs> | null
    where?: ProjectWhereInput
  }

  /**
   * ThesisProject without action
   */
  export type ThesisProjectDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ThesisProject
     */
    select?: ThesisProjectSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ThesisProject
     */
    omit?: ThesisProjectOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ThesisProjectInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    studentId: 'studentId',
    name: 'name',
    major: 'major',
    grade: 'grade',
    class: 'class',
    password: 'password',
    role: 'role',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const TopicScalarFieldEnum: {
    id: 'id',
    title: 'title',
    description: 'description',
    background: 'background',
    objectives: 'objectives',
    domain: 'domain',
    platform: 'platform',
    techStack: 'techStack',
    type: 'type',
    creatorId: 'creatorId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TopicScalarFieldEnum = (typeof TopicScalarFieldEnum)[keyof typeof TopicScalarFieldEnum]


  export const ProjectScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    topicId: 'topicId',
    status: 'status',
    techStack: 'techStack',
    documentsRef: 'documentsRef',
    reviewStatus: 'reviewStatus',
    reviewResult: 'reviewResult',
    repoUrl: 'repoUrl',
    repoSyncData: 'repoSyncData',
    deployUrl: 'deployUrl',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ProjectScalarFieldEnum = (typeof ProjectScalarFieldEnum)[keyof typeof ProjectScalarFieldEnum]


  export const DocumentScalarFieldEnum: {
    id: 'id',
    projectId: 'projectId',
    docType: 'docType',
    content: 'content',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type DocumentScalarFieldEnum = (typeof DocumentScalarFieldEnum)[keyof typeof DocumentScalarFieldEnum]


  export const GraduationDocumentScalarFieldEnum: {
    id: 'id',
    projectId: 'projectId',
    docType: 'docType',
    content: 'content',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type GraduationDocumentScalarFieldEnum = (typeof GraduationDocumentScalarFieldEnum)[keyof typeof GraduationDocumentScalarFieldEnum]


  export const SystemConfigScalarFieldEnum: {
    id: 'id',
    key: 'key',
    value: 'value',
    description: 'description',
    updatedAt: 'updatedAt'
  };

  export type SystemConfigScalarFieldEnum = (typeof SystemConfigScalarFieldEnum)[keyof typeof SystemConfigScalarFieldEnum]


  export const UserApiSettingScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    baseURL: 'baseURL',
    apiKey: 'apiKey',
    model: 'model',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserApiSettingScalarFieldEnum = (typeof UserApiSettingScalarFieldEnum)[keyof typeof UserApiSettingScalarFieldEnum]


  export const ApiProviderScalarFieldEnum: {
    id: 'id',
    name: 'name',
    providerType: 'providerType',
    baseURL: 'baseURL',
    apiKey: 'apiKey',
    model: 'model',
    isActive: 'isActive',
    orderIndex: 'orderIndex',
    description: 'description',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ApiProviderScalarFieldEnum = (typeof ApiProviderScalarFieldEnum)[keyof typeof ApiProviderScalarFieldEnum]


  export const AiUsageLogScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    projectId: 'projectId',
    docType: 'docType',
    operation: 'operation',
    promptTokens: 'promptTokens',
    completionTokens: 'completionTokens',
    totalTokens: 'totalTokens',
    status: 'status',
    errorMessage: 'errorMessage',
    createdAt: 'createdAt'
  };

  export type AiUsageLogScalarFieldEnum = (typeof AiUsageLogScalarFieldEnum)[keyof typeof AiUsageLogScalarFieldEnum]


  export const ThesisTopicScalarFieldEnum: {
    id: 'id',
    title: 'title',
    category: 'category',
    datasetName: 'datasetName',
    datasetUrl: 'datasetUrl',
    datasetSize: 'datasetSize',
    isLocked: 'isLocked',
    lockedAt: 'lockedAt',
    lockedByUserId: 'lockedByUserId',
    createdAt: 'createdAt'
  };

  export type ThesisTopicScalarFieldEnum = (typeof ThesisTopicScalarFieldEnum)[keyof typeof ThesisTopicScalarFieldEnum]


  export const ThesisProjectScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    topicId: 'topicId',
    projectId: 'projectId',
    repoUrl: 'repoUrl',
    deployUrl: 'deployUrl',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ThesisProjectScalarFieldEnum = (typeof ThesisProjectScalarFieldEnum)[keyof typeof ThesisProjectScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'Role'
   */
  export type EnumRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Role'>
    


  /**
   * Reference to a field of type 'Status'
   */
  export type EnumStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Status'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'Domain'
   */
  export type EnumDomainFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Domain'>
    


  /**
   * Reference to a field of type 'Platform'
   */
  export type EnumPlatformFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Platform'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'TopicType'
   */
  export type EnumTopicTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TopicType'>
    


  /**
   * Reference to a field of type 'ProjectStatus'
   */
  export type EnumProjectStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ProjectStatus'>
    


  /**
   * Reference to a field of type 'ReviewStatus'
   */
  export type EnumReviewStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'ReviewStatus'>
    


  /**
   * Reference to a field of type 'DocType'
   */
  export type EnumDocTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DocType'>
    


  /**
   * Reference to a field of type 'GraduationDocType'
   */
  export type EnumGraduationDocTypeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'GraduationDocType'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: IntFilter<"User"> | number
    studentId?: StringFilter<"User"> | string
    name?: StringFilter<"User"> | string
    major?: StringFilter<"User"> | string
    grade?: StringFilter<"User"> | string
    class?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    status?: EnumStatusFilter<"User"> | $Enums.Status
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    projects?: ProjectListRelationFilter
    customTopics?: TopicListRelationFilter
    thesisProject?: XOR<ThesisProjectNullableScalarRelationFilter, ThesisProjectWhereInput> | null
    lockedThesisTopics?: ThesisTopicListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    studentId?: SortOrder
    name?: SortOrder
    major?: SortOrder
    grade?: SortOrder
    class?: SortOrder
    password?: SortOrder
    role?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    projects?: ProjectOrderByRelationAggregateInput
    customTopics?: TopicOrderByRelationAggregateInput
    thesisProject?: ThesisProjectOrderByWithRelationInput
    lockedThesisTopics?: ThesisTopicOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    studentId?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringFilter<"User"> | string
    major?: StringFilter<"User"> | string
    grade?: StringFilter<"User"> | string
    class?: StringFilter<"User"> | string
    password?: StringFilter<"User"> | string
    role?: EnumRoleFilter<"User"> | $Enums.Role
    status?: EnumStatusFilter<"User"> | $Enums.Status
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    projects?: ProjectListRelationFilter
    customTopics?: TopicListRelationFilter
    thesisProject?: XOR<ThesisProjectNullableScalarRelationFilter, ThesisProjectWhereInput> | null
    lockedThesisTopics?: ThesisTopicListRelationFilter
  }, "id" | "studentId">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    studentId?: SortOrder
    name?: SortOrder
    major?: SortOrder
    grade?: SortOrder
    class?: SortOrder
    password?: SortOrder
    role?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _avg?: UserAvgOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
    _sum?: UserSumOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"User"> | number
    studentId?: StringWithAggregatesFilter<"User"> | string
    name?: StringWithAggregatesFilter<"User"> | string
    major?: StringWithAggregatesFilter<"User"> | string
    grade?: StringWithAggregatesFilter<"User"> | string
    class?: StringWithAggregatesFilter<"User"> | string
    password?: StringWithAggregatesFilter<"User"> | string
    role?: EnumRoleWithAggregatesFilter<"User"> | $Enums.Role
    status?: EnumStatusWithAggregatesFilter<"User"> | $Enums.Status
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type TopicWhereInput = {
    AND?: TopicWhereInput | TopicWhereInput[]
    OR?: TopicWhereInput[]
    NOT?: TopicWhereInput | TopicWhereInput[]
    id?: IntFilter<"Topic"> | number
    title?: StringFilter<"Topic"> | string
    description?: StringFilter<"Topic"> | string
    background?: StringNullableFilter<"Topic"> | string | null
    objectives?: StringNullableFilter<"Topic"> | string | null
    domain?: EnumDomainFilter<"Topic"> | $Enums.Domain
    platform?: EnumPlatformFilter<"Topic"> | $Enums.Platform
    techStack?: JsonFilter<"Topic">
    type?: EnumTopicTypeFilter<"Topic"> | $Enums.TopicType
    creatorId?: IntNullableFilter<"Topic"> | number | null
    createdAt?: DateTimeFilter<"Topic"> | Date | string
    updatedAt?: DateTimeFilter<"Topic"> | Date | string
    creator?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    projects?: ProjectListRelationFilter
  }

  export type TopicOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    background?: SortOrderInput | SortOrder
    objectives?: SortOrderInput | SortOrder
    domain?: SortOrder
    platform?: SortOrder
    techStack?: SortOrder
    type?: SortOrder
    creatorId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    creator?: UserOrderByWithRelationInput
    projects?: ProjectOrderByRelationAggregateInput
  }

  export type TopicWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: TopicWhereInput | TopicWhereInput[]
    OR?: TopicWhereInput[]
    NOT?: TopicWhereInput | TopicWhereInput[]
    title?: StringFilter<"Topic"> | string
    description?: StringFilter<"Topic"> | string
    background?: StringNullableFilter<"Topic"> | string | null
    objectives?: StringNullableFilter<"Topic"> | string | null
    domain?: EnumDomainFilter<"Topic"> | $Enums.Domain
    platform?: EnumPlatformFilter<"Topic"> | $Enums.Platform
    techStack?: JsonFilter<"Topic">
    type?: EnumTopicTypeFilter<"Topic"> | $Enums.TopicType
    creatorId?: IntNullableFilter<"Topic"> | number | null
    createdAt?: DateTimeFilter<"Topic"> | Date | string
    updatedAt?: DateTimeFilter<"Topic"> | Date | string
    creator?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    projects?: ProjectListRelationFilter
  }, "id">

  export type TopicOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    background?: SortOrderInput | SortOrder
    objectives?: SortOrderInput | SortOrder
    domain?: SortOrder
    platform?: SortOrder
    techStack?: SortOrder
    type?: SortOrder
    creatorId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TopicCountOrderByAggregateInput
    _avg?: TopicAvgOrderByAggregateInput
    _max?: TopicMaxOrderByAggregateInput
    _min?: TopicMinOrderByAggregateInput
    _sum?: TopicSumOrderByAggregateInput
  }

  export type TopicScalarWhereWithAggregatesInput = {
    AND?: TopicScalarWhereWithAggregatesInput | TopicScalarWhereWithAggregatesInput[]
    OR?: TopicScalarWhereWithAggregatesInput[]
    NOT?: TopicScalarWhereWithAggregatesInput | TopicScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Topic"> | number
    title?: StringWithAggregatesFilter<"Topic"> | string
    description?: StringWithAggregatesFilter<"Topic"> | string
    background?: StringNullableWithAggregatesFilter<"Topic"> | string | null
    objectives?: StringNullableWithAggregatesFilter<"Topic"> | string | null
    domain?: EnumDomainWithAggregatesFilter<"Topic"> | $Enums.Domain
    platform?: EnumPlatformWithAggregatesFilter<"Topic"> | $Enums.Platform
    techStack?: JsonWithAggregatesFilter<"Topic">
    type?: EnumTopicTypeWithAggregatesFilter<"Topic"> | $Enums.TopicType
    creatorId?: IntNullableWithAggregatesFilter<"Topic"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"Topic"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Topic"> | Date | string
  }

  export type ProjectWhereInput = {
    AND?: ProjectWhereInput | ProjectWhereInput[]
    OR?: ProjectWhereInput[]
    NOT?: ProjectWhereInput | ProjectWhereInput[]
    id?: IntFilter<"Project"> | number
    userId?: IntFilter<"Project"> | number
    topicId?: IntFilter<"Project"> | number
    status?: EnumProjectStatusFilter<"Project"> | $Enums.ProjectStatus
    techStack?: StringNullableFilter<"Project"> | string | null
    documentsRef?: JsonNullableFilter<"Project">
    reviewStatus?: EnumReviewStatusFilter<"Project"> | $Enums.ReviewStatus
    reviewResult?: JsonNullableFilter<"Project">
    repoUrl?: StringNullableFilter<"Project"> | string | null
    repoSyncData?: JsonNullableFilter<"Project">
    deployUrl?: StringNullableFilter<"Project"> | string | null
    createdAt?: DateTimeFilter<"Project"> | Date | string
    updatedAt?: DateTimeFilter<"Project"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    topic?: XOR<TopicScalarRelationFilter, TopicWhereInput>
    documents?: DocumentListRelationFilter
    graduationDocuments?: GraduationDocumentListRelationFilter
    thesisProject?: XOR<ThesisProjectNullableScalarRelationFilter, ThesisProjectWhereInput> | null
  }

  export type ProjectOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    topicId?: SortOrder
    status?: SortOrder
    techStack?: SortOrderInput | SortOrder
    documentsRef?: SortOrderInput | SortOrder
    reviewStatus?: SortOrder
    reviewResult?: SortOrderInput | SortOrder
    repoUrl?: SortOrderInput | SortOrder
    repoSyncData?: SortOrderInput | SortOrder
    deployUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    topic?: TopicOrderByWithRelationInput
    documents?: DocumentOrderByRelationAggregateInput
    graduationDocuments?: GraduationDocumentOrderByRelationAggregateInput
    thesisProject?: ThesisProjectOrderByWithRelationInput
  }

  export type ProjectWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: ProjectWhereInput | ProjectWhereInput[]
    OR?: ProjectWhereInput[]
    NOT?: ProjectWhereInput | ProjectWhereInput[]
    userId?: IntFilter<"Project"> | number
    topicId?: IntFilter<"Project"> | number
    status?: EnumProjectStatusFilter<"Project"> | $Enums.ProjectStatus
    techStack?: StringNullableFilter<"Project"> | string | null
    documentsRef?: JsonNullableFilter<"Project">
    reviewStatus?: EnumReviewStatusFilter<"Project"> | $Enums.ReviewStatus
    reviewResult?: JsonNullableFilter<"Project">
    repoUrl?: StringNullableFilter<"Project"> | string | null
    repoSyncData?: JsonNullableFilter<"Project">
    deployUrl?: StringNullableFilter<"Project"> | string | null
    createdAt?: DateTimeFilter<"Project"> | Date | string
    updatedAt?: DateTimeFilter<"Project"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    topic?: XOR<TopicScalarRelationFilter, TopicWhereInput>
    documents?: DocumentListRelationFilter
    graduationDocuments?: GraduationDocumentListRelationFilter
    thesisProject?: XOR<ThesisProjectNullableScalarRelationFilter, ThesisProjectWhereInput> | null
  }, "id">

  export type ProjectOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    topicId?: SortOrder
    status?: SortOrder
    techStack?: SortOrderInput | SortOrder
    documentsRef?: SortOrderInput | SortOrder
    reviewStatus?: SortOrder
    reviewResult?: SortOrderInput | SortOrder
    repoUrl?: SortOrderInput | SortOrder
    repoSyncData?: SortOrderInput | SortOrder
    deployUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ProjectCountOrderByAggregateInput
    _avg?: ProjectAvgOrderByAggregateInput
    _max?: ProjectMaxOrderByAggregateInput
    _min?: ProjectMinOrderByAggregateInput
    _sum?: ProjectSumOrderByAggregateInput
  }

  export type ProjectScalarWhereWithAggregatesInput = {
    AND?: ProjectScalarWhereWithAggregatesInput | ProjectScalarWhereWithAggregatesInput[]
    OR?: ProjectScalarWhereWithAggregatesInput[]
    NOT?: ProjectScalarWhereWithAggregatesInput | ProjectScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Project"> | number
    userId?: IntWithAggregatesFilter<"Project"> | number
    topicId?: IntWithAggregatesFilter<"Project"> | number
    status?: EnumProjectStatusWithAggregatesFilter<"Project"> | $Enums.ProjectStatus
    techStack?: StringNullableWithAggregatesFilter<"Project"> | string | null
    documentsRef?: JsonNullableWithAggregatesFilter<"Project">
    reviewStatus?: EnumReviewStatusWithAggregatesFilter<"Project"> | $Enums.ReviewStatus
    reviewResult?: JsonNullableWithAggregatesFilter<"Project">
    repoUrl?: StringNullableWithAggregatesFilter<"Project"> | string | null
    repoSyncData?: JsonNullableWithAggregatesFilter<"Project">
    deployUrl?: StringNullableWithAggregatesFilter<"Project"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Project"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Project"> | Date | string
  }

  export type DocumentWhereInput = {
    AND?: DocumentWhereInput | DocumentWhereInput[]
    OR?: DocumentWhereInput[]
    NOT?: DocumentWhereInput | DocumentWhereInput[]
    id?: IntFilter<"Document"> | number
    projectId?: IntFilter<"Document"> | number
    docType?: EnumDocTypeFilter<"Document"> | $Enums.DocType
    content?: StringFilter<"Document"> | string
    createdAt?: DateTimeFilter<"Document"> | Date | string
    updatedAt?: DateTimeFilter<"Document"> | Date | string
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
  }

  export type DocumentOrderByWithRelationInput = {
    id?: SortOrder
    projectId?: SortOrder
    docType?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    project?: ProjectOrderByWithRelationInput
  }

  export type DocumentWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    projectId_docType?: DocumentProjectIdDocTypeCompoundUniqueInput
    AND?: DocumentWhereInput | DocumentWhereInput[]
    OR?: DocumentWhereInput[]
    NOT?: DocumentWhereInput | DocumentWhereInput[]
    projectId?: IntFilter<"Document"> | number
    docType?: EnumDocTypeFilter<"Document"> | $Enums.DocType
    content?: StringFilter<"Document"> | string
    createdAt?: DateTimeFilter<"Document"> | Date | string
    updatedAt?: DateTimeFilter<"Document"> | Date | string
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
  }, "id" | "projectId_docType">

  export type DocumentOrderByWithAggregationInput = {
    id?: SortOrder
    projectId?: SortOrder
    docType?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DocumentCountOrderByAggregateInput
    _avg?: DocumentAvgOrderByAggregateInput
    _max?: DocumentMaxOrderByAggregateInput
    _min?: DocumentMinOrderByAggregateInput
    _sum?: DocumentSumOrderByAggregateInput
  }

  export type DocumentScalarWhereWithAggregatesInput = {
    AND?: DocumentScalarWhereWithAggregatesInput | DocumentScalarWhereWithAggregatesInput[]
    OR?: DocumentScalarWhereWithAggregatesInput[]
    NOT?: DocumentScalarWhereWithAggregatesInput | DocumentScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"Document"> | number
    projectId?: IntWithAggregatesFilter<"Document"> | number
    docType?: EnumDocTypeWithAggregatesFilter<"Document"> | $Enums.DocType
    content?: StringWithAggregatesFilter<"Document"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Document"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Document"> | Date | string
  }

  export type GraduationDocumentWhereInput = {
    AND?: GraduationDocumentWhereInput | GraduationDocumentWhereInput[]
    OR?: GraduationDocumentWhereInput[]
    NOT?: GraduationDocumentWhereInput | GraduationDocumentWhereInput[]
    id?: IntFilter<"GraduationDocument"> | number
    projectId?: IntFilter<"GraduationDocument"> | number
    docType?: EnumGraduationDocTypeFilter<"GraduationDocument"> | $Enums.GraduationDocType
    content?: StringFilter<"GraduationDocument"> | string
    createdAt?: DateTimeFilter<"GraduationDocument"> | Date | string
    updatedAt?: DateTimeFilter<"GraduationDocument"> | Date | string
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
  }

  export type GraduationDocumentOrderByWithRelationInput = {
    id?: SortOrder
    projectId?: SortOrder
    docType?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    project?: ProjectOrderByWithRelationInput
  }

  export type GraduationDocumentWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    projectId_docType?: GraduationDocumentProjectIdDocTypeCompoundUniqueInput
    AND?: GraduationDocumentWhereInput | GraduationDocumentWhereInput[]
    OR?: GraduationDocumentWhereInput[]
    NOT?: GraduationDocumentWhereInput | GraduationDocumentWhereInput[]
    projectId?: IntFilter<"GraduationDocument"> | number
    docType?: EnumGraduationDocTypeFilter<"GraduationDocument"> | $Enums.GraduationDocType
    content?: StringFilter<"GraduationDocument"> | string
    createdAt?: DateTimeFilter<"GraduationDocument"> | Date | string
    updatedAt?: DateTimeFilter<"GraduationDocument"> | Date | string
    project?: XOR<ProjectScalarRelationFilter, ProjectWhereInput>
  }, "id" | "projectId_docType">

  export type GraduationDocumentOrderByWithAggregationInput = {
    id?: SortOrder
    projectId?: SortOrder
    docType?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: GraduationDocumentCountOrderByAggregateInput
    _avg?: GraduationDocumentAvgOrderByAggregateInput
    _max?: GraduationDocumentMaxOrderByAggregateInput
    _min?: GraduationDocumentMinOrderByAggregateInput
    _sum?: GraduationDocumentSumOrderByAggregateInput
  }

  export type GraduationDocumentScalarWhereWithAggregatesInput = {
    AND?: GraduationDocumentScalarWhereWithAggregatesInput | GraduationDocumentScalarWhereWithAggregatesInput[]
    OR?: GraduationDocumentScalarWhereWithAggregatesInput[]
    NOT?: GraduationDocumentScalarWhereWithAggregatesInput | GraduationDocumentScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"GraduationDocument"> | number
    projectId?: IntWithAggregatesFilter<"GraduationDocument"> | number
    docType?: EnumGraduationDocTypeWithAggregatesFilter<"GraduationDocument"> | $Enums.GraduationDocType
    content?: StringWithAggregatesFilter<"GraduationDocument"> | string
    createdAt?: DateTimeWithAggregatesFilter<"GraduationDocument"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"GraduationDocument"> | Date | string
  }

  export type SystemConfigWhereInput = {
    AND?: SystemConfigWhereInput | SystemConfigWhereInput[]
    OR?: SystemConfigWhereInput[]
    NOT?: SystemConfigWhereInput | SystemConfigWhereInput[]
    id?: IntFilter<"SystemConfig"> | number
    key?: StringFilter<"SystemConfig"> | string
    value?: StringFilter<"SystemConfig"> | string
    description?: StringNullableFilter<"SystemConfig"> | string | null
    updatedAt?: DateTimeFilter<"SystemConfig"> | Date | string
  }

  export type SystemConfigOrderByWithRelationInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
    description?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
  }

  export type SystemConfigWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    key?: string
    AND?: SystemConfigWhereInput | SystemConfigWhereInput[]
    OR?: SystemConfigWhereInput[]
    NOT?: SystemConfigWhereInput | SystemConfigWhereInput[]
    value?: StringFilter<"SystemConfig"> | string
    description?: StringNullableFilter<"SystemConfig"> | string | null
    updatedAt?: DateTimeFilter<"SystemConfig"> | Date | string
  }, "id" | "key">

  export type SystemConfigOrderByWithAggregationInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
    description?: SortOrderInput | SortOrder
    updatedAt?: SortOrder
    _count?: SystemConfigCountOrderByAggregateInput
    _avg?: SystemConfigAvgOrderByAggregateInput
    _max?: SystemConfigMaxOrderByAggregateInput
    _min?: SystemConfigMinOrderByAggregateInput
    _sum?: SystemConfigSumOrderByAggregateInput
  }

  export type SystemConfigScalarWhereWithAggregatesInput = {
    AND?: SystemConfigScalarWhereWithAggregatesInput | SystemConfigScalarWhereWithAggregatesInput[]
    OR?: SystemConfigScalarWhereWithAggregatesInput[]
    NOT?: SystemConfigScalarWhereWithAggregatesInput | SystemConfigScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"SystemConfig"> | number
    key?: StringWithAggregatesFilter<"SystemConfig"> | string
    value?: StringWithAggregatesFilter<"SystemConfig"> | string
    description?: StringNullableWithAggregatesFilter<"SystemConfig"> | string | null
    updatedAt?: DateTimeWithAggregatesFilter<"SystemConfig"> | Date | string
  }

  export type UserApiSettingWhereInput = {
    AND?: UserApiSettingWhereInput | UserApiSettingWhereInput[]
    OR?: UserApiSettingWhereInput[]
    NOT?: UserApiSettingWhereInput | UserApiSettingWhereInput[]
    id?: IntFilter<"UserApiSetting"> | number
    userId?: IntFilter<"UserApiSetting"> | number
    baseURL?: StringFilter<"UserApiSetting"> | string
    apiKey?: StringFilter<"UserApiSetting"> | string
    model?: StringFilter<"UserApiSetting"> | string
    createdAt?: DateTimeFilter<"UserApiSetting"> | Date | string
    updatedAt?: DateTimeFilter<"UserApiSetting"> | Date | string
  }

  export type UserApiSettingOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    baseURL?: SortOrder
    apiKey?: SortOrder
    model?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserApiSettingWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    userId?: number
    AND?: UserApiSettingWhereInput | UserApiSettingWhereInput[]
    OR?: UserApiSettingWhereInput[]
    NOT?: UserApiSettingWhereInput | UserApiSettingWhereInput[]
    baseURL?: StringFilter<"UserApiSetting"> | string
    apiKey?: StringFilter<"UserApiSetting"> | string
    model?: StringFilter<"UserApiSetting"> | string
    createdAt?: DateTimeFilter<"UserApiSetting"> | Date | string
    updatedAt?: DateTimeFilter<"UserApiSetting"> | Date | string
  }, "id" | "userId">

  export type UserApiSettingOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    baseURL?: SortOrder
    apiKey?: SortOrder
    model?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserApiSettingCountOrderByAggregateInput
    _avg?: UserApiSettingAvgOrderByAggregateInput
    _max?: UserApiSettingMaxOrderByAggregateInput
    _min?: UserApiSettingMinOrderByAggregateInput
    _sum?: UserApiSettingSumOrderByAggregateInput
  }

  export type UserApiSettingScalarWhereWithAggregatesInput = {
    AND?: UserApiSettingScalarWhereWithAggregatesInput | UserApiSettingScalarWhereWithAggregatesInput[]
    OR?: UserApiSettingScalarWhereWithAggregatesInput[]
    NOT?: UserApiSettingScalarWhereWithAggregatesInput | UserApiSettingScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"UserApiSetting"> | number
    userId?: IntWithAggregatesFilter<"UserApiSetting"> | number
    baseURL?: StringWithAggregatesFilter<"UserApiSetting"> | string
    apiKey?: StringWithAggregatesFilter<"UserApiSetting"> | string
    model?: StringWithAggregatesFilter<"UserApiSetting"> | string
    createdAt?: DateTimeWithAggregatesFilter<"UserApiSetting"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"UserApiSetting"> | Date | string
  }

  export type ApiProviderWhereInput = {
    AND?: ApiProviderWhereInput | ApiProviderWhereInput[]
    OR?: ApiProviderWhereInput[]
    NOT?: ApiProviderWhereInput | ApiProviderWhereInput[]
    id?: IntFilter<"ApiProvider"> | number
    name?: StringFilter<"ApiProvider"> | string
    providerType?: StringFilter<"ApiProvider"> | string
    baseURL?: StringFilter<"ApiProvider"> | string
    apiKey?: StringFilter<"ApiProvider"> | string
    model?: StringFilter<"ApiProvider"> | string
    isActive?: BoolFilter<"ApiProvider"> | boolean
    orderIndex?: IntFilter<"ApiProvider"> | number
    description?: StringNullableFilter<"ApiProvider"> | string | null
    createdAt?: DateTimeFilter<"ApiProvider"> | Date | string
    updatedAt?: DateTimeFilter<"ApiProvider"> | Date | string
  }

  export type ApiProviderOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    providerType?: SortOrder
    baseURL?: SortOrder
    apiKey?: SortOrder
    model?: SortOrder
    isActive?: SortOrder
    orderIndex?: SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ApiProviderWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: ApiProviderWhereInput | ApiProviderWhereInput[]
    OR?: ApiProviderWhereInput[]
    NOT?: ApiProviderWhereInput | ApiProviderWhereInput[]
    name?: StringFilter<"ApiProvider"> | string
    providerType?: StringFilter<"ApiProvider"> | string
    baseURL?: StringFilter<"ApiProvider"> | string
    apiKey?: StringFilter<"ApiProvider"> | string
    model?: StringFilter<"ApiProvider"> | string
    isActive?: BoolFilter<"ApiProvider"> | boolean
    orderIndex?: IntFilter<"ApiProvider"> | number
    description?: StringNullableFilter<"ApiProvider"> | string | null
    createdAt?: DateTimeFilter<"ApiProvider"> | Date | string
    updatedAt?: DateTimeFilter<"ApiProvider"> | Date | string
  }, "id">

  export type ApiProviderOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    providerType?: SortOrder
    baseURL?: SortOrder
    apiKey?: SortOrder
    model?: SortOrder
    isActive?: SortOrder
    orderIndex?: SortOrder
    description?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ApiProviderCountOrderByAggregateInput
    _avg?: ApiProviderAvgOrderByAggregateInput
    _max?: ApiProviderMaxOrderByAggregateInput
    _min?: ApiProviderMinOrderByAggregateInput
    _sum?: ApiProviderSumOrderByAggregateInput
  }

  export type ApiProviderScalarWhereWithAggregatesInput = {
    AND?: ApiProviderScalarWhereWithAggregatesInput | ApiProviderScalarWhereWithAggregatesInput[]
    OR?: ApiProviderScalarWhereWithAggregatesInput[]
    NOT?: ApiProviderScalarWhereWithAggregatesInput | ApiProviderScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"ApiProvider"> | number
    name?: StringWithAggregatesFilter<"ApiProvider"> | string
    providerType?: StringWithAggregatesFilter<"ApiProvider"> | string
    baseURL?: StringWithAggregatesFilter<"ApiProvider"> | string
    apiKey?: StringWithAggregatesFilter<"ApiProvider"> | string
    model?: StringWithAggregatesFilter<"ApiProvider"> | string
    isActive?: BoolWithAggregatesFilter<"ApiProvider"> | boolean
    orderIndex?: IntWithAggregatesFilter<"ApiProvider"> | number
    description?: StringNullableWithAggregatesFilter<"ApiProvider"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ApiProvider"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ApiProvider"> | Date | string
  }

  export type AiUsageLogWhereInput = {
    AND?: AiUsageLogWhereInput | AiUsageLogWhereInput[]
    OR?: AiUsageLogWhereInput[]
    NOT?: AiUsageLogWhereInput | AiUsageLogWhereInput[]
    id?: IntFilter<"AiUsageLog"> | number
    userId?: IntFilter<"AiUsageLog"> | number
    projectId?: IntNullableFilter<"AiUsageLog"> | number | null
    docType?: StringNullableFilter<"AiUsageLog"> | string | null
    operation?: StringFilter<"AiUsageLog"> | string
    promptTokens?: IntFilter<"AiUsageLog"> | number
    completionTokens?: IntFilter<"AiUsageLog"> | number
    totalTokens?: IntFilter<"AiUsageLog"> | number
    status?: StringFilter<"AiUsageLog"> | string
    errorMessage?: StringNullableFilter<"AiUsageLog"> | string | null
    createdAt?: DateTimeFilter<"AiUsageLog"> | Date | string
  }

  export type AiUsageLogOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    projectId?: SortOrderInput | SortOrder
    docType?: SortOrderInput | SortOrder
    operation?: SortOrder
    promptTokens?: SortOrder
    completionTokens?: SortOrder
    totalTokens?: SortOrder
    status?: SortOrder
    errorMessage?: SortOrderInput | SortOrder
    createdAt?: SortOrder
  }

  export type AiUsageLogWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: AiUsageLogWhereInput | AiUsageLogWhereInput[]
    OR?: AiUsageLogWhereInput[]
    NOT?: AiUsageLogWhereInput | AiUsageLogWhereInput[]
    userId?: IntFilter<"AiUsageLog"> | number
    projectId?: IntNullableFilter<"AiUsageLog"> | number | null
    docType?: StringNullableFilter<"AiUsageLog"> | string | null
    operation?: StringFilter<"AiUsageLog"> | string
    promptTokens?: IntFilter<"AiUsageLog"> | number
    completionTokens?: IntFilter<"AiUsageLog"> | number
    totalTokens?: IntFilter<"AiUsageLog"> | number
    status?: StringFilter<"AiUsageLog"> | string
    errorMessage?: StringNullableFilter<"AiUsageLog"> | string | null
    createdAt?: DateTimeFilter<"AiUsageLog"> | Date | string
  }, "id">

  export type AiUsageLogOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    projectId?: SortOrderInput | SortOrder
    docType?: SortOrderInput | SortOrder
    operation?: SortOrder
    promptTokens?: SortOrder
    completionTokens?: SortOrder
    totalTokens?: SortOrder
    status?: SortOrder
    errorMessage?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: AiUsageLogCountOrderByAggregateInput
    _avg?: AiUsageLogAvgOrderByAggregateInput
    _max?: AiUsageLogMaxOrderByAggregateInput
    _min?: AiUsageLogMinOrderByAggregateInput
    _sum?: AiUsageLogSumOrderByAggregateInput
  }

  export type AiUsageLogScalarWhereWithAggregatesInput = {
    AND?: AiUsageLogScalarWhereWithAggregatesInput | AiUsageLogScalarWhereWithAggregatesInput[]
    OR?: AiUsageLogScalarWhereWithAggregatesInput[]
    NOT?: AiUsageLogScalarWhereWithAggregatesInput | AiUsageLogScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"AiUsageLog"> | number
    userId?: IntWithAggregatesFilter<"AiUsageLog"> | number
    projectId?: IntNullableWithAggregatesFilter<"AiUsageLog"> | number | null
    docType?: StringNullableWithAggregatesFilter<"AiUsageLog"> | string | null
    operation?: StringWithAggregatesFilter<"AiUsageLog"> | string
    promptTokens?: IntWithAggregatesFilter<"AiUsageLog"> | number
    completionTokens?: IntWithAggregatesFilter<"AiUsageLog"> | number
    totalTokens?: IntWithAggregatesFilter<"AiUsageLog"> | number
    status?: StringWithAggregatesFilter<"AiUsageLog"> | string
    errorMessage?: StringNullableWithAggregatesFilter<"AiUsageLog"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"AiUsageLog"> | Date | string
  }

  export type ThesisTopicWhereInput = {
    AND?: ThesisTopicWhereInput | ThesisTopicWhereInput[]
    OR?: ThesisTopicWhereInput[]
    NOT?: ThesisTopicWhereInput | ThesisTopicWhereInput[]
    id?: IntFilter<"ThesisTopic"> | number
    title?: StringFilter<"ThesisTopic"> | string
    category?: StringFilter<"ThesisTopic"> | string
    datasetName?: StringFilter<"ThesisTopic"> | string
    datasetUrl?: StringFilter<"ThesisTopic"> | string
    datasetSize?: StringFilter<"ThesisTopic"> | string
    isLocked?: BoolFilter<"ThesisTopic"> | boolean
    lockedAt?: DateTimeNullableFilter<"ThesisTopic"> | Date | string | null
    lockedByUserId?: IntNullableFilter<"ThesisTopic"> | number | null
    createdAt?: DateTimeFilter<"ThesisTopic"> | Date | string
    lockedBy?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    project?: XOR<ThesisProjectNullableScalarRelationFilter, ThesisProjectWhereInput> | null
  }

  export type ThesisTopicOrderByWithRelationInput = {
    id?: SortOrder
    title?: SortOrder
    category?: SortOrder
    datasetName?: SortOrder
    datasetUrl?: SortOrder
    datasetSize?: SortOrder
    isLocked?: SortOrder
    lockedAt?: SortOrderInput | SortOrder
    lockedByUserId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    lockedBy?: UserOrderByWithRelationInput
    project?: ThesisProjectOrderByWithRelationInput
  }

  export type ThesisTopicWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: ThesisTopicWhereInput | ThesisTopicWhereInput[]
    OR?: ThesisTopicWhereInput[]
    NOT?: ThesisTopicWhereInput | ThesisTopicWhereInput[]
    title?: StringFilter<"ThesisTopic"> | string
    category?: StringFilter<"ThesisTopic"> | string
    datasetName?: StringFilter<"ThesisTopic"> | string
    datasetUrl?: StringFilter<"ThesisTopic"> | string
    datasetSize?: StringFilter<"ThesisTopic"> | string
    isLocked?: BoolFilter<"ThesisTopic"> | boolean
    lockedAt?: DateTimeNullableFilter<"ThesisTopic"> | Date | string | null
    lockedByUserId?: IntNullableFilter<"ThesisTopic"> | number | null
    createdAt?: DateTimeFilter<"ThesisTopic"> | Date | string
    lockedBy?: XOR<UserNullableScalarRelationFilter, UserWhereInput> | null
    project?: XOR<ThesisProjectNullableScalarRelationFilter, ThesisProjectWhereInput> | null
  }, "id">

  export type ThesisTopicOrderByWithAggregationInput = {
    id?: SortOrder
    title?: SortOrder
    category?: SortOrder
    datasetName?: SortOrder
    datasetUrl?: SortOrder
    datasetSize?: SortOrder
    isLocked?: SortOrder
    lockedAt?: SortOrderInput | SortOrder
    lockedByUserId?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: ThesisTopicCountOrderByAggregateInput
    _avg?: ThesisTopicAvgOrderByAggregateInput
    _max?: ThesisTopicMaxOrderByAggregateInput
    _min?: ThesisTopicMinOrderByAggregateInput
    _sum?: ThesisTopicSumOrderByAggregateInput
  }

  export type ThesisTopicScalarWhereWithAggregatesInput = {
    AND?: ThesisTopicScalarWhereWithAggregatesInput | ThesisTopicScalarWhereWithAggregatesInput[]
    OR?: ThesisTopicScalarWhereWithAggregatesInput[]
    NOT?: ThesisTopicScalarWhereWithAggregatesInput | ThesisTopicScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"ThesisTopic"> | number
    title?: StringWithAggregatesFilter<"ThesisTopic"> | string
    category?: StringWithAggregatesFilter<"ThesisTopic"> | string
    datasetName?: StringWithAggregatesFilter<"ThesisTopic"> | string
    datasetUrl?: StringWithAggregatesFilter<"ThesisTopic"> | string
    datasetSize?: StringWithAggregatesFilter<"ThesisTopic"> | string
    isLocked?: BoolWithAggregatesFilter<"ThesisTopic"> | boolean
    lockedAt?: DateTimeNullableWithAggregatesFilter<"ThesisTopic"> | Date | string | null
    lockedByUserId?: IntNullableWithAggregatesFilter<"ThesisTopic"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"ThesisTopic"> | Date | string
  }

  export type ThesisProjectWhereInput = {
    AND?: ThesisProjectWhereInput | ThesisProjectWhereInput[]
    OR?: ThesisProjectWhereInput[]
    NOT?: ThesisProjectWhereInput | ThesisProjectWhereInput[]
    id?: IntFilter<"ThesisProject"> | number
    userId?: IntFilter<"ThesisProject"> | number
    topicId?: IntFilter<"ThesisProject"> | number
    projectId?: IntNullableFilter<"ThesisProject"> | number | null
    repoUrl?: StringNullableFilter<"ThesisProject"> | string | null
    deployUrl?: StringNullableFilter<"ThesisProject"> | string | null
    createdAt?: DateTimeFilter<"ThesisProject"> | Date | string
    updatedAt?: DateTimeFilter<"ThesisProject"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    topic?: XOR<ThesisTopicScalarRelationFilter, ThesisTopicWhereInput>
    project?: XOR<ProjectNullableScalarRelationFilter, ProjectWhereInput> | null
  }

  export type ThesisProjectOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    topicId?: SortOrder
    projectId?: SortOrderInput | SortOrder
    repoUrl?: SortOrderInput | SortOrder
    deployUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    topic?: ThesisTopicOrderByWithRelationInput
    project?: ProjectOrderByWithRelationInput
  }

  export type ThesisProjectWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    userId?: number
    topicId?: number
    projectId?: number
    AND?: ThesisProjectWhereInput | ThesisProjectWhereInput[]
    OR?: ThesisProjectWhereInput[]
    NOT?: ThesisProjectWhereInput | ThesisProjectWhereInput[]
    repoUrl?: StringNullableFilter<"ThesisProject"> | string | null
    deployUrl?: StringNullableFilter<"ThesisProject"> | string | null
    createdAt?: DateTimeFilter<"ThesisProject"> | Date | string
    updatedAt?: DateTimeFilter<"ThesisProject"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    topic?: XOR<ThesisTopicScalarRelationFilter, ThesisTopicWhereInput>
    project?: XOR<ProjectNullableScalarRelationFilter, ProjectWhereInput> | null
  }, "id" | "userId" | "topicId" | "projectId">

  export type ThesisProjectOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    topicId?: SortOrder
    projectId?: SortOrderInput | SortOrder
    repoUrl?: SortOrderInput | SortOrder
    deployUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ThesisProjectCountOrderByAggregateInput
    _avg?: ThesisProjectAvgOrderByAggregateInput
    _max?: ThesisProjectMaxOrderByAggregateInput
    _min?: ThesisProjectMinOrderByAggregateInput
    _sum?: ThesisProjectSumOrderByAggregateInput
  }

  export type ThesisProjectScalarWhereWithAggregatesInput = {
    AND?: ThesisProjectScalarWhereWithAggregatesInput | ThesisProjectScalarWhereWithAggregatesInput[]
    OR?: ThesisProjectScalarWhereWithAggregatesInput[]
    NOT?: ThesisProjectScalarWhereWithAggregatesInput | ThesisProjectScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"ThesisProject"> | number
    userId?: IntWithAggregatesFilter<"ThesisProject"> | number
    topicId?: IntWithAggregatesFilter<"ThesisProject"> | number
    projectId?: IntNullableWithAggregatesFilter<"ThesisProject"> | number | null
    repoUrl?: StringNullableWithAggregatesFilter<"ThesisProject"> | string | null
    deployUrl?: StringNullableWithAggregatesFilter<"ThesisProject"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"ThesisProject"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ThesisProject"> | Date | string
  }

  export type UserCreateInput = {
    studentId: string
    name: string
    major: string
    grade: string
    class: string
    password: string
    role?: $Enums.Role
    status?: $Enums.Status
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectCreateNestedManyWithoutUserInput
    customTopics?: TopicCreateNestedManyWithoutCreatorInput
    thesisProject?: ThesisProjectCreateNestedOneWithoutUserInput
    lockedThesisTopics?: ThesisTopicCreateNestedManyWithoutLockedByInput
  }

  export type UserUncheckedCreateInput = {
    id?: number
    studentId: string
    name: string
    major: string
    grade: string
    class: string
    password: string
    role?: $Enums.Role
    status?: $Enums.Status
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectUncheckedCreateNestedManyWithoutUserInput
    customTopics?: TopicUncheckedCreateNestedManyWithoutCreatorInput
    thesisProject?: ThesisProjectUncheckedCreateNestedOneWithoutUserInput
    lockedThesisTopics?: ThesisTopicUncheckedCreateNestedManyWithoutLockedByInput
  }

  export type UserUpdateInput = {
    studentId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    major?: StringFieldUpdateOperationsInput | string
    grade?: StringFieldUpdateOperationsInput | string
    class?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUpdateManyWithoutUserNestedInput
    customTopics?: TopicUpdateManyWithoutCreatorNestedInput
    thesisProject?: ThesisProjectUpdateOneWithoutUserNestedInput
    lockedThesisTopics?: ThesisTopicUpdateManyWithoutLockedByNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    studentId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    major?: StringFieldUpdateOperationsInput | string
    grade?: StringFieldUpdateOperationsInput | string
    class?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUncheckedUpdateManyWithoutUserNestedInput
    customTopics?: TopicUncheckedUpdateManyWithoutCreatorNestedInput
    thesisProject?: ThesisProjectUncheckedUpdateOneWithoutUserNestedInput
    lockedThesisTopics?: ThesisTopicUncheckedUpdateManyWithoutLockedByNestedInput
  }

  export type UserCreateManyInput = {
    id?: number
    studentId: string
    name: string
    major: string
    grade: string
    class: string
    password: string
    role?: $Enums.Role
    status?: $Enums.Status
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    studentId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    major?: StringFieldUpdateOperationsInput | string
    grade?: StringFieldUpdateOperationsInput | string
    class?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    studentId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    major?: StringFieldUpdateOperationsInput | string
    grade?: StringFieldUpdateOperationsInput | string
    class?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TopicCreateInput = {
    title: string
    description: string
    background?: string | null
    objectives?: string | null
    domain: $Enums.Domain
    platform?: $Enums.Platform
    techStack: JsonNullValueInput | InputJsonValue
    type?: $Enums.TopicType
    createdAt?: Date | string
    updatedAt?: Date | string
    creator?: UserCreateNestedOneWithoutCustomTopicsInput
    projects?: ProjectCreateNestedManyWithoutTopicInput
  }

  export type TopicUncheckedCreateInput = {
    id?: number
    title: string
    description: string
    background?: string | null
    objectives?: string | null
    domain: $Enums.Domain
    platform?: $Enums.Platform
    techStack: JsonNullValueInput | InputJsonValue
    type?: $Enums.TopicType
    creatorId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectUncheckedCreateNestedManyWithoutTopicInput
  }

  export type TopicUpdateInput = {
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    background?: NullableStringFieldUpdateOperationsInput | string | null
    objectives?: NullableStringFieldUpdateOperationsInput | string | null
    domain?: EnumDomainFieldUpdateOperationsInput | $Enums.Domain
    platform?: EnumPlatformFieldUpdateOperationsInput | $Enums.Platform
    techStack?: JsonNullValueInput | InputJsonValue
    type?: EnumTopicTypeFieldUpdateOperationsInput | $Enums.TopicType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    creator?: UserUpdateOneWithoutCustomTopicsNestedInput
    projects?: ProjectUpdateManyWithoutTopicNestedInput
  }

  export type TopicUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    background?: NullableStringFieldUpdateOperationsInput | string | null
    objectives?: NullableStringFieldUpdateOperationsInput | string | null
    domain?: EnumDomainFieldUpdateOperationsInput | $Enums.Domain
    platform?: EnumPlatformFieldUpdateOperationsInput | $Enums.Platform
    techStack?: JsonNullValueInput | InputJsonValue
    type?: EnumTopicTypeFieldUpdateOperationsInput | $Enums.TopicType
    creatorId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUncheckedUpdateManyWithoutTopicNestedInput
  }

  export type TopicCreateManyInput = {
    id?: number
    title: string
    description: string
    background?: string | null
    objectives?: string | null
    domain: $Enums.Domain
    platform?: $Enums.Platform
    techStack: JsonNullValueInput | InputJsonValue
    type?: $Enums.TopicType
    creatorId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TopicUpdateManyMutationInput = {
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    background?: NullableStringFieldUpdateOperationsInput | string | null
    objectives?: NullableStringFieldUpdateOperationsInput | string | null
    domain?: EnumDomainFieldUpdateOperationsInput | $Enums.Domain
    platform?: EnumPlatformFieldUpdateOperationsInput | $Enums.Platform
    techStack?: JsonNullValueInput | InputJsonValue
    type?: EnumTopicTypeFieldUpdateOperationsInput | $Enums.TopicType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TopicUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    background?: NullableStringFieldUpdateOperationsInput | string | null
    objectives?: NullableStringFieldUpdateOperationsInput | string | null
    domain?: EnumDomainFieldUpdateOperationsInput | $Enums.Domain
    platform?: EnumPlatformFieldUpdateOperationsInput | $Enums.Platform
    techStack?: JsonNullValueInput | InputJsonValue
    type?: EnumTopicTypeFieldUpdateOperationsInput | $Enums.TopicType
    creatorId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectCreateInput = {
    status?: $Enums.ProjectStatus
    techStack?: string | null
    documentsRef?: NullableJsonNullValueInput | InputJsonValue
    reviewStatus?: $Enums.ReviewStatus
    reviewResult?: NullableJsonNullValueInput | InputJsonValue
    repoUrl?: string | null
    repoSyncData?: NullableJsonNullValueInput | InputJsonValue
    deployUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutProjectsInput
    topic: TopicCreateNestedOneWithoutProjectsInput
    documents?: DocumentCreateNestedManyWithoutProjectInput
    graduationDocuments?: GraduationDocumentCreateNestedManyWithoutProjectInput
    thesisProject?: ThesisProjectCreateNestedOneWithoutProjectInput
  }

  export type ProjectUncheckedCreateInput = {
    id?: number
    userId: number
    topicId: number
    status?: $Enums.ProjectStatus
    techStack?: string | null
    documentsRef?: NullableJsonNullValueInput | InputJsonValue
    reviewStatus?: $Enums.ReviewStatus
    reviewResult?: NullableJsonNullValueInput | InputJsonValue
    repoUrl?: string | null
    repoSyncData?: NullableJsonNullValueInput | InputJsonValue
    deployUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    documents?: DocumentUncheckedCreateNestedManyWithoutProjectInput
    graduationDocuments?: GraduationDocumentUncheckedCreateNestedManyWithoutProjectInput
    thesisProject?: ThesisProjectUncheckedCreateNestedOneWithoutProjectInput
  }

  export type ProjectUpdateInput = {
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    techStack?: NullableStringFieldUpdateOperationsInput | string | null
    documentsRef?: NullableJsonNullValueInput | InputJsonValue
    reviewStatus?: EnumReviewStatusFieldUpdateOperationsInput | $Enums.ReviewStatus
    reviewResult?: NullableJsonNullValueInput | InputJsonValue
    repoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    repoSyncData?: NullableJsonNullValueInput | InputJsonValue
    deployUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutProjectsNestedInput
    topic?: TopicUpdateOneRequiredWithoutProjectsNestedInput
    documents?: DocumentUpdateManyWithoutProjectNestedInput
    graduationDocuments?: GraduationDocumentUpdateManyWithoutProjectNestedInput
    thesisProject?: ThesisProjectUpdateOneWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    topicId?: IntFieldUpdateOperationsInput | number
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    techStack?: NullableStringFieldUpdateOperationsInput | string | null
    documentsRef?: NullableJsonNullValueInput | InputJsonValue
    reviewStatus?: EnumReviewStatusFieldUpdateOperationsInput | $Enums.ReviewStatus
    reviewResult?: NullableJsonNullValueInput | InputJsonValue
    repoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    repoSyncData?: NullableJsonNullValueInput | InputJsonValue
    deployUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    documents?: DocumentUncheckedUpdateManyWithoutProjectNestedInput
    graduationDocuments?: GraduationDocumentUncheckedUpdateManyWithoutProjectNestedInput
    thesisProject?: ThesisProjectUncheckedUpdateOneWithoutProjectNestedInput
  }

  export type ProjectCreateManyInput = {
    id?: number
    userId: number
    topicId: number
    status?: $Enums.ProjectStatus
    techStack?: string | null
    documentsRef?: NullableJsonNullValueInput | InputJsonValue
    reviewStatus?: $Enums.ReviewStatus
    reviewResult?: NullableJsonNullValueInput | InputJsonValue
    repoUrl?: string | null
    repoSyncData?: NullableJsonNullValueInput | InputJsonValue
    deployUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProjectUpdateManyMutationInput = {
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    techStack?: NullableStringFieldUpdateOperationsInput | string | null
    documentsRef?: NullableJsonNullValueInput | InputJsonValue
    reviewStatus?: EnumReviewStatusFieldUpdateOperationsInput | $Enums.ReviewStatus
    reviewResult?: NullableJsonNullValueInput | InputJsonValue
    repoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    repoSyncData?: NullableJsonNullValueInput | InputJsonValue
    deployUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    topicId?: IntFieldUpdateOperationsInput | number
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    techStack?: NullableStringFieldUpdateOperationsInput | string | null
    documentsRef?: NullableJsonNullValueInput | InputJsonValue
    reviewStatus?: EnumReviewStatusFieldUpdateOperationsInput | $Enums.ReviewStatus
    reviewResult?: NullableJsonNullValueInput | InputJsonValue
    repoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    repoSyncData?: NullableJsonNullValueInput | InputJsonValue
    deployUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentCreateInput = {
    docType: $Enums.DocType
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    project: ProjectCreateNestedOneWithoutDocumentsInput
  }

  export type DocumentUncheckedCreateInput = {
    id?: number
    projectId: number
    docType: $Enums.DocType
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DocumentUpdateInput = {
    docType?: EnumDocTypeFieldUpdateOperationsInput | $Enums.DocType
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutDocumentsNestedInput
  }

  export type DocumentUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    projectId?: IntFieldUpdateOperationsInput | number
    docType?: EnumDocTypeFieldUpdateOperationsInput | $Enums.DocType
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentCreateManyInput = {
    id?: number
    projectId: number
    docType: $Enums.DocType
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DocumentUpdateManyMutationInput = {
    docType?: EnumDocTypeFieldUpdateOperationsInput | $Enums.DocType
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    projectId?: IntFieldUpdateOperationsInput | number
    docType?: EnumDocTypeFieldUpdateOperationsInput | $Enums.DocType
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GraduationDocumentCreateInput = {
    docType: $Enums.GraduationDocType
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
    project: ProjectCreateNestedOneWithoutGraduationDocumentsInput
  }

  export type GraduationDocumentUncheckedCreateInput = {
    id?: number
    projectId: number
    docType: $Enums.GraduationDocType
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GraduationDocumentUpdateInput = {
    docType?: EnumGraduationDocTypeFieldUpdateOperationsInput | $Enums.GraduationDocType
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ProjectUpdateOneRequiredWithoutGraduationDocumentsNestedInput
  }

  export type GraduationDocumentUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    projectId?: IntFieldUpdateOperationsInput | number
    docType?: EnumGraduationDocTypeFieldUpdateOperationsInput | $Enums.GraduationDocType
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GraduationDocumentCreateManyInput = {
    id?: number
    projectId: number
    docType: $Enums.GraduationDocType
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GraduationDocumentUpdateManyMutationInput = {
    docType?: EnumGraduationDocTypeFieldUpdateOperationsInput | $Enums.GraduationDocType
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GraduationDocumentUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    projectId?: IntFieldUpdateOperationsInput | number
    docType?: EnumGraduationDocTypeFieldUpdateOperationsInput | $Enums.GraduationDocType
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SystemConfigCreateInput = {
    key: string
    value: string
    description?: string | null
    updatedAt?: Date | string
  }

  export type SystemConfigUncheckedCreateInput = {
    id?: number
    key: string
    value: string
    description?: string | null
    updatedAt?: Date | string
  }

  export type SystemConfigUpdateInput = {
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SystemConfigUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SystemConfigCreateManyInput = {
    id?: number
    key: string
    value: string
    description?: string | null
    updatedAt?: Date | string
  }

  export type SystemConfigUpdateManyMutationInput = {
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SystemConfigUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    key?: StringFieldUpdateOperationsInput | string
    value?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserApiSettingCreateInput = {
    userId: number
    baseURL: string
    apiKey: string
    model: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserApiSettingUncheckedCreateInput = {
    id?: number
    userId: number
    baseURL: string
    apiKey: string
    model: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserApiSettingUpdateInput = {
    userId?: IntFieldUpdateOperationsInput | number
    baseURL?: StringFieldUpdateOperationsInput | string
    apiKey?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserApiSettingUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    baseURL?: StringFieldUpdateOperationsInput | string
    apiKey?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserApiSettingCreateManyInput = {
    id?: number
    userId: number
    baseURL: string
    apiKey: string
    model: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserApiSettingUpdateManyMutationInput = {
    userId?: IntFieldUpdateOperationsInput | number
    baseURL?: StringFieldUpdateOperationsInput | string
    apiKey?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserApiSettingUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    baseURL?: StringFieldUpdateOperationsInput | string
    apiKey?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApiProviderCreateInput = {
    name: string
    providerType: string
    baseURL: string
    apiKey: string
    model: string
    isActive?: boolean
    orderIndex?: number
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ApiProviderUncheckedCreateInput = {
    id?: number
    name: string
    providerType: string
    baseURL: string
    apiKey: string
    model: string
    isActive?: boolean
    orderIndex?: number
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ApiProviderUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    providerType?: StringFieldUpdateOperationsInput | string
    baseURL?: StringFieldUpdateOperationsInput | string
    apiKey?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    orderIndex?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApiProviderUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    providerType?: StringFieldUpdateOperationsInput | string
    baseURL?: StringFieldUpdateOperationsInput | string
    apiKey?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    orderIndex?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApiProviderCreateManyInput = {
    id?: number
    name: string
    providerType: string
    baseURL: string
    apiKey: string
    model: string
    isActive?: boolean
    orderIndex?: number
    description?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ApiProviderUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    providerType?: StringFieldUpdateOperationsInput | string
    baseURL?: StringFieldUpdateOperationsInput | string
    apiKey?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    orderIndex?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ApiProviderUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    name?: StringFieldUpdateOperationsInput | string
    providerType?: StringFieldUpdateOperationsInput | string
    baseURL?: StringFieldUpdateOperationsInput | string
    apiKey?: StringFieldUpdateOperationsInput | string
    model?: StringFieldUpdateOperationsInput | string
    isActive?: BoolFieldUpdateOperationsInput | boolean
    orderIndex?: IntFieldUpdateOperationsInput | number
    description?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiUsageLogCreateInput = {
    userId: number
    projectId?: number | null
    docType?: string | null
    operation: string
    promptTokens?: number
    completionTokens?: number
    totalTokens?: number
    status?: string
    errorMessage?: string | null
    createdAt?: Date | string
  }

  export type AiUsageLogUncheckedCreateInput = {
    id?: number
    userId: number
    projectId?: number | null
    docType?: string | null
    operation: string
    promptTokens?: number
    completionTokens?: number
    totalTokens?: number
    status?: string
    errorMessage?: string | null
    createdAt?: Date | string
  }

  export type AiUsageLogUpdateInput = {
    userId?: IntFieldUpdateOperationsInput | number
    projectId?: NullableIntFieldUpdateOperationsInput | number | null
    docType?: NullableStringFieldUpdateOperationsInput | string | null
    operation?: StringFieldUpdateOperationsInput | string
    promptTokens?: IntFieldUpdateOperationsInput | number
    completionTokens?: IntFieldUpdateOperationsInput | number
    totalTokens?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiUsageLogUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    projectId?: NullableIntFieldUpdateOperationsInput | number | null
    docType?: NullableStringFieldUpdateOperationsInput | string | null
    operation?: StringFieldUpdateOperationsInput | string
    promptTokens?: IntFieldUpdateOperationsInput | number
    completionTokens?: IntFieldUpdateOperationsInput | number
    totalTokens?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiUsageLogCreateManyInput = {
    id?: number
    userId: number
    projectId?: number | null
    docType?: string | null
    operation: string
    promptTokens?: number
    completionTokens?: number
    totalTokens?: number
    status?: string
    errorMessage?: string | null
    createdAt?: Date | string
  }

  export type AiUsageLogUpdateManyMutationInput = {
    userId?: IntFieldUpdateOperationsInput | number
    projectId?: NullableIntFieldUpdateOperationsInput | number | null
    docType?: NullableStringFieldUpdateOperationsInput | string | null
    operation?: StringFieldUpdateOperationsInput | string
    promptTokens?: IntFieldUpdateOperationsInput | number
    completionTokens?: IntFieldUpdateOperationsInput | number
    totalTokens?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type AiUsageLogUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    projectId?: NullableIntFieldUpdateOperationsInput | number | null
    docType?: NullableStringFieldUpdateOperationsInput | string | null
    operation?: StringFieldUpdateOperationsInput | string
    promptTokens?: IntFieldUpdateOperationsInput | number
    completionTokens?: IntFieldUpdateOperationsInput | number
    totalTokens?: IntFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    errorMessage?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ThesisTopicCreateInput = {
    title: string
    category: string
    datasetName: string
    datasetUrl: string
    datasetSize: string
    isLocked?: boolean
    lockedAt?: Date | string | null
    createdAt?: Date | string
    lockedBy?: UserCreateNestedOneWithoutLockedThesisTopicsInput
    project?: ThesisProjectCreateNestedOneWithoutTopicInput
  }

  export type ThesisTopicUncheckedCreateInput = {
    id?: number
    title: string
    category: string
    datasetName: string
    datasetUrl: string
    datasetSize: string
    isLocked?: boolean
    lockedAt?: Date | string | null
    lockedByUserId?: number | null
    createdAt?: Date | string
    project?: ThesisProjectUncheckedCreateNestedOneWithoutTopicInput
  }

  export type ThesisTopicUpdateInput = {
    title?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    datasetName?: StringFieldUpdateOperationsInput | string
    datasetUrl?: StringFieldUpdateOperationsInput | string
    datasetSize?: StringFieldUpdateOperationsInput | string
    isLocked?: BoolFieldUpdateOperationsInput | boolean
    lockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lockedBy?: UserUpdateOneWithoutLockedThesisTopicsNestedInput
    project?: ThesisProjectUpdateOneWithoutTopicNestedInput
  }

  export type ThesisTopicUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    datasetName?: StringFieldUpdateOperationsInput | string
    datasetUrl?: StringFieldUpdateOperationsInput | string
    datasetSize?: StringFieldUpdateOperationsInput | string
    isLocked?: BoolFieldUpdateOperationsInput | boolean
    lockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lockedByUserId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ThesisProjectUncheckedUpdateOneWithoutTopicNestedInput
  }

  export type ThesisTopicCreateManyInput = {
    id?: number
    title: string
    category: string
    datasetName: string
    datasetUrl: string
    datasetSize: string
    isLocked?: boolean
    lockedAt?: Date | string | null
    lockedByUserId?: number | null
    createdAt?: Date | string
  }

  export type ThesisTopicUpdateManyMutationInput = {
    title?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    datasetName?: StringFieldUpdateOperationsInput | string
    datasetUrl?: StringFieldUpdateOperationsInput | string
    datasetSize?: StringFieldUpdateOperationsInput | string
    isLocked?: BoolFieldUpdateOperationsInput | boolean
    lockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ThesisTopicUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    datasetName?: StringFieldUpdateOperationsInput | string
    datasetUrl?: StringFieldUpdateOperationsInput | string
    datasetSize?: StringFieldUpdateOperationsInput | string
    isLocked?: BoolFieldUpdateOperationsInput | boolean
    lockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lockedByUserId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ThesisProjectCreateInput = {
    repoUrl?: string | null
    deployUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutThesisProjectInput
    topic: ThesisTopicCreateNestedOneWithoutProjectInput
    project?: ProjectCreateNestedOneWithoutThesisProjectInput
  }

  export type ThesisProjectUncheckedCreateInput = {
    id?: number
    userId: number
    topicId: number
    projectId?: number | null
    repoUrl?: string | null
    deployUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ThesisProjectUpdateInput = {
    repoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    deployUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutThesisProjectNestedInput
    topic?: ThesisTopicUpdateOneRequiredWithoutProjectNestedInput
    project?: ProjectUpdateOneWithoutThesisProjectNestedInput
  }

  export type ThesisProjectUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    topicId?: IntFieldUpdateOperationsInput | number
    projectId?: NullableIntFieldUpdateOperationsInput | number | null
    repoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    deployUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ThesisProjectCreateManyInput = {
    id?: number
    userId: number
    topicId: number
    projectId?: number | null
    repoUrl?: string | null
    deployUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ThesisProjectUpdateManyMutationInput = {
    repoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    deployUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ThesisProjectUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    topicId?: IntFieldUpdateOperationsInput | number
    projectId?: NullableIntFieldUpdateOperationsInput | number | null
    repoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    deployUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type EnumStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.Status | EnumStatusFieldRefInput<$PrismaModel>
    in?: $Enums.Status[]
    notIn?: $Enums.Status[]
    not?: NestedEnumStatusFilter<$PrismaModel> | $Enums.Status
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type ProjectListRelationFilter = {
    every?: ProjectWhereInput
    some?: ProjectWhereInput
    none?: ProjectWhereInput
  }

  export type TopicListRelationFilter = {
    every?: TopicWhereInput
    some?: TopicWhereInput
    none?: TopicWhereInput
  }

  export type ThesisProjectNullableScalarRelationFilter = {
    is?: ThesisProjectWhereInput | null
    isNot?: ThesisProjectWhereInput | null
  }

  export type ThesisTopicListRelationFilter = {
    every?: ThesisTopicWhereInput
    some?: ThesisTopicWhereInput
    none?: ThesisTopicWhereInput
  }

  export type ProjectOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TopicOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ThesisTopicOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
    name?: SortOrder
    major?: SortOrder
    grade?: SortOrder
    class?: SortOrder
    password?: SortOrder
    role?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
    name?: SortOrder
    major?: SortOrder
    grade?: SortOrder
    class?: SortOrder
    password?: SortOrder
    role?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    studentId?: SortOrder
    name?: SortOrder
    major?: SortOrder
    grade?: SortOrder
    class?: SortOrder
    password?: SortOrder
    role?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type EnumStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Status | EnumStatusFieldRefInput<$PrismaModel>
    in?: $Enums.Status[]
    notIn?: $Enums.Status[]
    not?: NestedEnumStatusWithAggregatesFilter<$PrismaModel> | $Enums.Status
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStatusFilter<$PrismaModel>
    _max?: NestedEnumStatusFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EnumDomainFilter<$PrismaModel = never> = {
    equals?: $Enums.Domain | EnumDomainFieldRefInput<$PrismaModel>
    in?: $Enums.Domain[]
    notIn?: $Enums.Domain[]
    not?: NestedEnumDomainFilter<$PrismaModel> | $Enums.Domain
  }

  export type EnumPlatformFilter<$PrismaModel = never> = {
    equals?: $Enums.Platform | EnumPlatformFieldRefInput<$PrismaModel>
    in?: $Enums.Platform[]
    notIn?: $Enums.Platform[]
    not?: NestedEnumPlatformFilter<$PrismaModel> | $Enums.Platform
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type EnumTopicTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.TopicType | EnumTopicTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TopicType[]
    notIn?: $Enums.TopicType[]
    not?: NestedEnumTopicTypeFilter<$PrismaModel> | $Enums.TopicType
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type UserNullableScalarRelationFilter = {
    is?: UserWhereInput | null
    isNot?: UserWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type TopicCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    background?: SortOrder
    objectives?: SortOrder
    domain?: SortOrder
    platform?: SortOrder
    techStack?: SortOrder
    type?: SortOrder
    creatorId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TopicAvgOrderByAggregateInput = {
    id?: SortOrder
    creatorId?: SortOrder
  }

  export type TopicMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    background?: SortOrder
    objectives?: SortOrder
    domain?: SortOrder
    platform?: SortOrder
    type?: SortOrder
    creatorId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TopicMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    description?: SortOrder
    background?: SortOrder
    objectives?: SortOrder
    domain?: SortOrder
    platform?: SortOrder
    type?: SortOrder
    creatorId?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TopicSumOrderByAggregateInput = {
    id?: SortOrder
    creatorId?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumDomainWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Domain | EnumDomainFieldRefInput<$PrismaModel>
    in?: $Enums.Domain[]
    notIn?: $Enums.Domain[]
    not?: NestedEnumDomainWithAggregatesFilter<$PrismaModel> | $Enums.Domain
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDomainFilter<$PrismaModel>
    _max?: NestedEnumDomainFilter<$PrismaModel>
  }

  export type EnumPlatformWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Platform | EnumPlatformFieldRefInput<$PrismaModel>
    in?: $Enums.Platform[]
    notIn?: $Enums.Platform[]
    not?: NestedEnumPlatformWithAggregatesFilter<$PrismaModel> | $Enums.Platform
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPlatformFilter<$PrismaModel>
    _max?: NestedEnumPlatformFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type EnumTopicTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TopicType | EnumTopicTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TopicType[]
    notIn?: $Enums.TopicType[]
    not?: NestedEnumTopicTypeWithAggregatesFilter<$PrismaModel> | $Enums.TopicType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTopicTypeFilter<$PrismaModel>
    _max?: NestedEnumTopicTypeFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type EnumProjectStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ProjectStatus | EnumProjectStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProjectStatus[]
    notIn?: $Enums.ProjectStatus[]
    not?: NestedEnumProjectStatusFilter<$PrismaModel> | $Enums.ProjectStatus
  }
  export type JsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type EnumReviewStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ReviewStatus | EnumReviewStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReviewStatus[]
    notIn?: $Enums.ReviewStatus[]
    not?: NestedEnumReviewStatusFilter<$PrismaModel> | $Enums.ReviewStatus
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type TopicScalarRelationFilter = {
    is?: TopicWhereInput
    isNot?: TopicWhereInput
  }

  export type DocumentListRelationFilter = {
    every?: DocumentWhereInput
    some?: DocumentWhereInput
    none?: DocumentWhereInput
  }

  export type GraduationDocumentListRelationFilter = {
    every?: GraduationDocumentWhereInput
    some?: GraduationDocumentWhereInput
    none?: GraduationDocumentWhereInput
  }

  export type DocumentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GraduationDocumentOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ProjectCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    topicId?: SortOrder
    status?: SortOrder
    techStack?: SortOrder
    documentsRef?: SortOrder
    reviewStatus?: SortOrder
    reviewResult?: SortOrder
    repoUrl?: SortOrder
    repoSyncData?: SortOrder
    deployUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProjectAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    topicId?: SortOrder
  }

  export type ProjectMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    topicId?: SortOrder
    status?: SortOrder
    techStack?: SortOrder
    reviewStatus?: SortOrder
    repoUrl?: SortOrder
    deployUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProjectMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    topicId?: SortOrder
    status?: SortOrder
    techStack?: SortOrder
    reviewStatus?: SortOrder
    repoUrl?: SortOrder
    deployUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ProjectSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    topicId?: SortOrder
  }

  export type EnumProjectStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProjectStatus | EnumProjectStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProjectStatus[]
    notIn?: $Enums.ProjectStatus[]
    not?: NestedEnumProjectStatusWithAggregatesFilter<$PrismaModel> | $Enums.ProjectStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProjectStatusFilter<$PrismaModel>
    _max?: NestedEnumProjectStatusFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type EnumReviewStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ReviewStatus | EnumReviewStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReviewStatus[]
    notIn?: $Enums.ReviewStatus[]
    not?: NestedEnumReviewStatusWithAggregatesFilter<$PrismaModel> | $Enums.ReviewStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumReviewStatusFilter<$PrismaModel>
    _max?: NestedEnumReviewStatusFilter<$PrismaModel>
  }

  export type EnumDocTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.DocType | EnumDocTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DocType[]
    notIn?: $Enums.DocType[]
    not?: NestedEnumDocTypeFilter<$PrismaModel> | $Enums.DocType
  }

  export type ProjectScalarRelationFilter = {
    is?: ProjectWhereInput
    isNot?: ProjectWhereInput
  }

  export type DocumentProjectIdDocTypeCompoundUniqueInput = {
    projectId: number
    docType: $Enums.DocType
  }

  export type DocumentCountOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    docType?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DocumentAvgOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
  }

  export type DocumentMaxOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    docType?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DocumentMinOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    docType?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DocumentSumOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
  }

  export type EnumDocTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DocType | EnumDocTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DocType[]
    notIn?: $Enums.DocType[]
    not?: NestedEnumDocTypeWithAggregatesFilter<$PrismaModel> | $Enums.DocType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDocTypeFilter<$PrismaModel>
    _max?: NestedEnumDocTypeFilter<$PrismaModel>
  }

  export type EnumGraduationDocTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.GraduationDocType | EnumGraduationDocTypeFieldRefInput<$PrismaModel>
    in?: $Enums.GraduationDocType[]
    notIn?: $Enums.GraduationDocType[]
    not?: NestedEnumGraduationDocTypeFilter<$PrismaModel> | $Enums.GraduationDocType
  }

  export type GraduationDocumentProjectIdDocTypeCompoundUniqueInput = {
    projectId: number
    docType: $Enums.GraduationDocType
  }

  export type GraduationDocumentCountOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    docType?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GraduationDocumentAvgOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
  }

  export type GraduationDocumentMaxOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    docType?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GraduationDocumentMinOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
    docType?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GraduationDocumentSumOrderByAggregateInput = {
    id?: SortOrder
    projectId?: SortOrder
  }

  export type EnumGraduationDocTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.GraduationDocType | EnumGraduationDocTypeFieldRefInput<$PrismaModel>
    in?: $Enums.GraduationDocType[]
    notIn?: $Enums.GraduationDocType[]
    not?: NestedEnumGraduationDocTypeWithAggregatesFilter<$PrismaModel> | $Enums.GraduationDocType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumGraduationDocTypeFilter<$PrismaModel>
    _max?: NestedEnumGraduationDocTypeFilter<$PrismaModel>
  }

  export type SystemConfigCountOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
    description?: SortOrder
    updatedAt?: SortOrder
  }

  export type SystemConfigAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type SystemConfigMaxOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
    description?: SortOrder
    updatedAt?: SortOrder
  }

  export type SystemConfigMinOrderByAggregateInput = {
    id?: SortOrder
    key?: SortOrder
    value?: SortOrder
    description?: SortOrder
    updatedAt?: SortOrder
  }

  export type SystemConfigSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type UserApiSettingCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    baseURL?: SortOrder
    apiKey?: SortOrder
    model?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserApiSettingAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type UserApiSettingMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    baseURL?: SortOrder
    apiKey?: SortOrder
    model?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserApiSettingMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    baseURL?: SortOrder
    apiKey?: SortOrder
    model?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserApiSettingSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type ApiProviderCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    providerType?: SortOrder
    baseURL?: SortOrder
    apiKey?: SortOrder
    model?: SortOrder
    isActive?: SortOrder
    orderIndex?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ApiProviderAvgOrderByAggregateInput = {
    id?: SortOrder
    orderIndex?: SortOrder
  }

  export type ApiProviderMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    providerType?: SortOrder
    baseURL?: SortOrder
    apiKey?: SortOrder
    model?: SortOrder
    isActive?: SortOrder
    orderIndex?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ApiProviderMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    providerType?: SortOrder
    baseURL?: SortOrder
    apiKey?: SortOrder
    model?: SortOrder
    isActive?: SortOrder
    orderIndex?: SortOrder
    description?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ApiProviderSumOrderByAggregateInput = {
    id?: SortOrder
    orderIndex?: SortOrder
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type AiUsageLogCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    projectId?: SortOrder
    docType?: SortOrder
    operation?: SortOrder
    promptTokens?: SortOrder
    completionTokens?: SortOrder
    totalTokens?: SortOrder
    status?: SortOrder
    errorMessage?: SortOrder
    createdAt?: SortOrder
  }

  export type AiUsageLogAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    projectId?: SortOrder
    promptTokens?: SortOrder
    completionTokens?: SortOrder
    totalTokens?: SortOrder
  }

  export type AiUsageLogMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    projectId?: SortOrder
    docType?: SortOrder
    operation?: SortOrder
    promptTokens?: SortOrder
    completionTokens?: SortOrder
    totalTokens?: SortOrder
    status?: SortOrder
    errorMessage?: SortOrder
    createdAt?: SortOrder
  }

  export type AiUsageLogMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    projectId?: SortOrder
    docType?: SortOrder
    operation?: SortOrder
    promptTokens?: SortOrder
    completionTokens?: SortOrder
    totalTokens?: SortOrder
    status?: SortOrder
    errorMessage?: SortOrder
    createdAt?: SortOrder
  }

  export type AiUsageLogSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    projectId?: SortOrder
    promptTokens?: SortOrder
    completionTokens?: SortOrder
    totalTokens?: SortOrder
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type ThesisTopicCountOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    category?: SortOrder
    datasetName?: SortOrder
    datasetUrl?: SortOrder
    datasetSize?: SortOrder
    isLocked?: SortOrder
    lockedAt?: SortOrder
    lockedByUserId?: SortOrder
    createdAt?: SortOrder
  }

  export type ThesisTopicAvgOrderByAggregateInput = {
    id?: SortOrder
    lockedByUserId?: SortOrder
  }

  export type ThesisTopicMaxOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    category?: SortOrder
    datasetName?: SortOrder
    datasetUrl?: SortOrder
    datasetSize?: SortOrder
    isLocked?: SortOrder
    lockedAt?: SortOrder
    lockedByUserId?: SortOrder
    createdAt?: SortOrder
  }

  export type ThesisTopicMinOrderByAggregateInput = {
    id?: SortOrder
    title?: SortOrder
    category?: SortOrder
    datasetName?: SortOrder
    datasetUrl?: SortOrder
    datasetSize?: SortOrder
    isLocked?: SortOrder
    lockedAt?: SortOrder
    lockedByUserId?: SortOrder
    createdAt?: SortOrder
  }

  export type ThesisTopicSumOrderByAggregateInput = {
    id?: SortOrder
    lockedByUserId?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type ThesisTopicScalarRelationFilter = {
    is?: ThesisTopicWhereInput
    isNot?: ThesisTopicWhereInput
  }

  export type ProjectNullableScalarRelationFilter = {
    is?: ProjectWhereInput | null
    isNot?: ProjectWhereInput | null
  }

  export type ThesisProjectCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    topicId?: SortOrder
    projectId?: SortOrder
    repoUrl?: SortOrder
    deployUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ThesisProjectAvgOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    topicId?: SortOrder
    projectId?: SortOrder
  }

  export type ThesisProjectMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    topicId?: SortOrder
    projectId?: SortOrder
    repoUrl?: SortOrder
    deployUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ThesisProjectMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    topicId?: SortOrder
    projectId?: SortOrder
    repoUrl?: SortOrder
    deployUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ThesisProjectSumOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    topicId?: SortOrder
    projectId?: SortOrder
  }

  export type ProjectCreateNestedManyWithoutUserInput = {
    create?: XOR<ProjectCreateWithoutUserInput, ProjectUncheckedCreateWithoutUserInput> | ProjectCreateWithoutUserInput[] | ProjectUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutUserInput | ProjectCreateOrConnectWithoutUserInput[]
    createMany?: ProjectCreateManyUserInputEnvelope
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
  }

  export type TopicCreateNestedManyWithoutCreatorInput = {
    create?: XOR<TopicCreateWithoutCreatorInput, TopicUncheckedCreateWithoutCreatorInput> | TopicCreateWithoutCreatorInput[] | TopicUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: TopicCreateOrConnectWithoutCreatorInput | TopicCreateOrConnectWithoutCreatorInput[]
    createMany?: TopicCreateManyCreatorInputEnvelope
    connect?: TopicWhereUniqueInput | TopicWhereUniqueInput[]
  }

  export type ThesisProjectCreateNestedOneWithoutUserInput = {
    create?: XOR<ThesisProjectCreateWithoutUserInput, ThesisProjectUncheckedCreateWithoutUserInput>
    connectOrCreate?: ThesisProjectCreateOrConnectWithoutUserInput
    connect?: ThesisProjectWhereUniqueInput
  }

  export type ThesisTopicCreateNestedManyWithoutLockedByInput = {
    create?: XOR<ThesisTopicCreateWithoutLockedByInput, ThesisTopicUncheckedCreateWithoutLockedByInput> | ThesisTopicCreateWithoutLockedByInput[] | ThesisTopicUncheckedCreateWithoutLockedByInput[]
    connectOrCreate?: ThesisTopicCreateOrConnectWithoutLockedByInput | ThesisTopicCreateOrConnectWithoutLockedByInput[]
    createMany?: ThesisTopicCreateManyLockedByInputEnvelope
    connect?: ThesisTopicWhereUniqueInput | ThesisTopicWhereUniqueInput[]
  }

  export type ProjectUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ProjectCreateWithoutUserInput, ProjectUncheckedCreateWithoutUserInput> | ProjectCreateWithoutUserInput[] | ProjectUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutUserInput | ProjectCreateOrConnectWithoutUserInput[]
    createMany?: ProjectCreateManyUserInputEnvelope
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
  }

  export type TopicUncheckedCreateNestedManyWithoutCreatorInput = {
    create?: XOR<TopicCreateWithoutCreatorInput, TopicUncheckedCreateWithoutCreatorInput> | TopicCreateWithoutCreatorInput[] | TopicUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: TopicCreateOrConnectWithoutCreatorInput | TopicCreateOrConnectWithoutCreatorInput[]
    createMany?: TopicCreateManyCreatorInputEnvelope
    connect?: TopicWhereUniqueInput | TopicWhereUniqueInput[]
  }

  export type ThesisProjectUncheckedCreateNestedOneWithoutUserInput = {
    create?: XOR<ThesisProjectCreateWithoutUserInput, ThesisProjectUncheckedCreateWithoutUserInput>
    connectOrCreate?: ThesisProjectCreateOrConnectWithoutUserInput
    connect?: ThesisProjectWhereUniqueInput
  }

  export type ThesisTopicUncheckedCreateNestedManyWithoutLockedByInput = {
    create?: XOR<ThesisTopicCreateWithoutLockedByInput, ThesisTopicUncheckedCreateWithoutLockedByInput> | ThesisTopicCreateWithoutLockedByInput[] | ThesisTopicUncheckedCreateWithoutLockedByInput[]
    connectOrCreate?: ThesisTopicCreateOrConnectWithoutLockedByInput | ThesisTopicCreateOrConnectWithoutLockedByInput[]
    createMany?: ThesisTopicCreateManyLockedByInputEnvelope
    connect?: ThesisTopicWhereUniqueInput | ThesisTopicWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumRoleFieldUpdateOperationsInput = {
    set?: $Enums.Role
  }

  export type EnumStatusFieldUpdateOperationsInput = {
    set?: $Enums.Status
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ProjectUpdateManyWithoutUserNestedInput = {
    create?: XOR<ProjectCreateWithoutUserInput, ProjectUncheckedCreateWithoutUserInput> | ProjectCreateWithoutUserInput[] | ProjectUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutUserInput | ProjectCreateOrConnectWithoutUserInput[]
    upsert?: ProjectUpsertWithWhereUniqueWithoutUserInput | ProjectUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ProjectCreateManyUserInputEnvelope
    set?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    disconnect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    delete?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    update?: ProjectUpdateWithWhereUniqueWithoutUserInput | ProjectUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ProjectUpdateManyWithWhereWithoutUserInput | ProjectUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
  }

  export type TopicUpdateManyWithoutCreatorNestedInput = {
    create?: XOR<TopicCreateWithoutCreatorInput, TopicUncheckedCreateWithoutCreatorInput> | TopicCreateWithoutCreatorInput[] | TopicUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: TopicCreateOrConnectWithoutCreatorInput | TopicCreateOrConnectWithoutCreatorInput[]
    upsert?: TopicUpsertWithWhereUniqueWithoutCreatorInput | TopicUpsertWithWhereUniqueWithoutCreatorInput[]
    createMany?: TopicCreateManyCreatorInputEnvelope
    set?: TopicWhereUniqueInput | TopicWhereUniqueInput[]
    disconnect?: TopicWhereUniqueInput | TopicWhereUniqueInput[]
    delete?: TopicWhereUniqueInput | TopicWhereUniqueInput[]
    connect?: TopicWhereUniqueInput | TopicWhereUniqueInput[]
    update?: TopicUpdateWithWhereUniqueWithoutCreatorInput | TopicUpdateWithWhereUniqueWithoutCreatorInput[]
    updateMany?: TopicUpdateManyWithWhereWithoutCreatorInput | TopicUpdateManyWithWhereWithoutCreatorInput[]
    deleteMany?: TopicScalarWhereInput | TopicScalarWhereInput[]
  }

  export type ThesisProjectUpdateOneWithoutUserNestedInput = {
    create?: XOR<ThesisProjectCreateWithoutUserInput, ThesisProjectUncheckedCreateWithoutUserInput>
    connectOrCreate?: ThesisProjectCreateOrConnectWithoutUserInput
    upsert?: ThesisProjectUpsertWithoutUserInput
    disconnect?: ThesisProjectWhereInput | boolean
    delete?: ThesisProjectWhereInput | boolean
    connect?: ThesisProjectWhereUniqueInput
    update?: XOR<XOR<ThesisProjectUpdateToOneWithWhereWithoutUserInput, ThesisProjectUpdateWithoutUserInput>, ThesisProjectUncheckedUpdateWithoutUserInput>
  }

  export type ThesisTopicUpdateManyWithoutLockedByNestedInput = {
    create?: XOR<ThesisTopicCreateWithoutLockedByInput, ThesisTopicUncheckedCreateWithoutLockedByInput> | ThesisTopicCreateWithoutLockedByInput[] | ThesisTopicUncheckedCreateWithoutLockedByInput[]
    connectOrCreate?: ThesisTopicCreateOrConnectWithoutLockedByInput | ThesisTopicCreateOrConnectWithoutLockedByInput[]
    upsert?: ThesisTopicUpsertWithWhereUniqueWithoutLockedByInput | ThesisTopicUpsertWithWhereUniqueWithoutLockedByInput[]
    createMany?: ThesisTopicCreateManyLockedByInputEnvelope
    set?: ThesisTopicWhereUniqueInput | ThesisTopicWhereUniqueInput[]
    disconnect?: ThesisTopicWhereUniqueInput | ThesisTopicWhereUniqueInput[]
    delete?: ThesisTopicWhereUniqueInput | ThesisTopicWhereUniqueInput[]
    connect?: ThesisTopicWhereUniqueInput | ThesisTopicWhereUniqueInput[]
    update?: ThesisTopicUpdateWithWhereUniqueWithoutLockedByInput | ThesisTopicUpdateWithWhereUniqueWithoutLockedByInput[]
    updateMany?: ThesisTopicUpdateManyWithWhereWithoutLockedByInput | ThesisTopicUpdateManyWithWhereWithoutLockedByInput[]
    deleteMany?: ThesisTopicScalarWhereInput | ThesisTopicScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ProjectUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ProjectCreateWithoutUserInput, ProjectUncheckedCreateWithoutUserInput> | ProjectCreateWithoutUserInput[] | ProjectUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutUserInput | ProjectCreateOrConnectWithoutUserInput[]
    upsert?: ProjectUpsertWithWhereUniqueWithoutUserInput | ProjectUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ProjectCreateManyUserInputEnvelope
    set?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    disconnect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    delete?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    update?: ProjectUpdateWithWhereUniqueWithoutUserInput | ProjectUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ProjectUpdateManyWithWhereWithoutUserInput | ProjectUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
  }

  export type TopicUncheckedUpdateManyWithoutCreatorNestedInput = {
    create?: XOR<TopicCreateWithoutCreatorInput, TopicUncheckedCreateWithoutCreatorInput> | TopicCreateWithoutCreatorInput[] | TopicUncheckedCreateWithoutCreatorInput[]
    connectOrCreate?: TopicCreateOrConnectWithoutCreatorInput | TopicCreateOrConnectWithoutCreatorInput[]
    upsert?: TopicUpsertWithWhereUniqueWithoutCreatorInput | TopicUpsertWithWhereUniqueWithoutCreatorInput[]
    createMany?: TopicCreateManyCreatorInputEnvelope
    set?: TopicWhereUniqueInput | TopicWhereUniqueInput[]
    disconnect?: TopicWhereUniqueInput | TopicWhereUniqueInput[]
    delete?: TopicWhereUniqueInput | TopicWhereUniqueInput[]
    connect?: TopicWhereUniqueInput | TopicWhereUniqueInput[]
    update?: TopicUpdateWithWhereUniqueWithoutCreatorInput | TopicUpdateWithWhereUniqueWithoutCreatorInput[]
    updateMany?: TopicUpdateManyWithWhereWithoutCreatorInput | TopicUpdateManyWithWhereWithoutCreatorInput[]
    deleteMany?: TopicScalarWhereInput | TopicScalarWhereInput[]
  }

  export type ThesisProjectUncheckedUpdateOneWithoutUserNestedInput = {
    create?: XOR<ThesisProjectCreateWithoutUserInput, ThesisProjectUncheckedCreateWithoutUserInput>
    connectOrCreate?: ThesisProjectCreateOrConnectWithoutUserInput
    upsert?: ThesisProjectUpsertWithoutUserInput
    disconnect?: ThesisProjectWhereInput | boolean
    delete?: ThesisProjectWhereInput | boolean
    connect?: ThesisProjectWhereUniqueInput
    update?: XOR<XOR<ThesisProjectUpdateToOneWithWhereWithoutUserInput, ThesisProjectUpdateWithoutUserInput>, ThesisProjectUncheckedUpdateWithoutUserInput>
  }

  export type ThesisTopicUncheckedUpdateManyWithoutLockedByNestedInput = {
    create?: XOR<ThesisTopicCreateWithoutLockedByInput, ThesisTopicUncheckedCreateWithoutLockedByInput> | ThesisTopicCreateWithoutLockedByInput[] | ThesisTopicUncheckedCreateWithoutLockedByInput[]
    connectOrCreate?: ThesisTopicCreateOrConnectWithoutLockedByInput | ThesisTopicCreateOrConnectWithoutLockedByInput[]
    upsert?: ThesisTopicUpsertWithWhereUniqueWithoutLockedByInput | ThesisTopicUpsertWithWhereUniqueWithoutLockedByInput[]
    createMany?: ThesisTopicCreateManyLockedByInputEnvelope
    set?: ThesisTopicWhereUniqueInput | ThesisTopicWhereUniqueInput[]
    disconnect?: ThesisTopicWhereUniqueInput | ThesisTopicWhereUniqueInput[]
    delete?: ThesisTopicWhereUniqueInput | ThesisTopicWhereUniqueInput[]
    connect?: ThesisTopicWhereUniqueInput | ThesisTopicWhereUniqueInput[]
    update?: ThesisTopicUpdateWithWhereUniqueWithoutLockedByInput | ThesisTopicUpdateWithWhereUniqueWithoutLockedByInput[]
    updateMany?: ThesisTopicUpdateManyWithWhereWithoutLockedByInput | ThesisTopicUpdateManyWithWhereWithoutLockedByInput[]
    deleteMany?: ThesisTopicScalarWhereInput | ThesisTopicScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutCustomTopicsInput = {
    create?: XOR<UserCreateWithoutCustomTopicsInput, UserUncheckedCreateWithoutCustomTopicsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCustomTopicsInput
    connect?: UserWhereUniqueInput
  }

  export type ProjectCreateNestedManyWithoutTopicInput = {
    create?: XOR<ProjectCreateWithoutTopicInput, ProjectUncheckedCreateWithoutTopicInput> | ProjectCreateWithoutTopicInput[] | ProjectUncheckedCreateWithoutTopicInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutTopicInput | ProjectCreateOrConnectWithoutTopicInput[]
    createMany?: ProjectCreateManyTopicInputEnvelope
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
  }

  export type ProjectUncheckedCreateNestedManyWithoutTopicInput = {
    create?: XOR<ProjectCreateWithoutTopicInput, ProjectUncheckedCreateWithoutTopicInput> | ProjectCreateWithoutTopicInput[] | ProjectUncheckedCreateWithoutTopicInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutTopicInput | ProjectCreateOrConnectWithoutTopicInput[]
    createMany?: ProjectCreateManyTopicInputEnvelope
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumDomainFieldUpdateOperationsInput = {
    set?: $Enums.Domain
  }

  export type EnumPlatformFieldUpdateOperationsInput = {
    set?: $Enums.Platform
  }

  export type EnumTopicTypeFieldUpdateOperationsInput = {
    set?: $Enums.TopicType
  }

  export type UserUpdateOneWithoutCustomTopicsNestedInput = {
    create?: XOR<UserCreateWithoutCustomTopicsInput, UserUncheckedCreateWithoutCustomTopicsInput>
    connectOrCreate?: UserCreateOrConnectWithoutCustomTopicsInput
    upsert?: UserUpsertWithoutCustomTopicsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutCustomTopicsInput, UserUpdateWithoutCustomTopicsInput>, UserUncheckedUpdateWithoutCustomTopicsInput>
  }

  export type ProjectUpdateManyWithoutTopicNestedInput = {
    create?: XOR<ProjectCreateWithoutTopicInput, ProjectUncheckedCreateWithoutTopicInput> | ProjectCreateWithoutTopicInput[] | ProjectUncheckedCreateWithoutTopicInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutTopicInput | ProjectCreateOrConnectWithoutTopicInput[]
    upsert?: ProjectUpsertWithWhereUniqueWithoutTopicInput | ProjectUpsertWithWhereUniqueWithoutTopicInput[]
    createMany?: ProjectCreateManyTopicInputEnvelope
    set?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    disconnect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    delete?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    update?: ProjectUpdateWithWhereUniqueWithoutTopicInput | ProjectUpdateWithWhereUniqueWithoutTopicInput[]
    updateMany?: ProjectUpdateManyWithWhereWithoutTopicInput | ProjectUpdateManyWithWhereWithoutTopicInput[]
    deleteMany?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ProjectUncheckedUpdateManyWithoutTopicNestedInput = {
    create?: XOR<ProjectCreateWithoutTopicInput, ProjectUncheckedCreateWithoutTopicInput> | ProjectCreateWithoutTopicInput[] | ProjectUncheckedCreateWithoutTopicInput[]
    connectOrCreate?: ProjectCreateOrConnectWithoutTopicInput | ProjectCreateOrConnectWithoutTopicInput[]
    upsert?: ProjectUpsertWithWhereUniqueWithoutTopicInput | ProjectUpsertWithWhereUniqueWithoutTopicInput[]
    createMany?: ProjectCreateManyTopicInputEnvelope
    set?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    disconnect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    delete?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    connect?: ProjectWhereUniqueInput | ProjectWhereUniqueInput[]
    update?: ProjectUpdateWithWhereUniqueWithoutTopicInput | ProjectUpdateWithWhereUniqueWithoutTopicInput[]
    updateMany?: ProjectUpdateManyWithWhereWithoutTopicInput | ProjectUpdateManyWithWhereWithoutTopicInput[]
    deleteMany?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutProjectsInput = {
    create?: XOR<UserCreateWithoutProjectsInput, UserUncheckedCreateWithoutProjectsInput>
    connectOrCreate?: UserCreateOrConnectWithoutProjectsInput
    connect?: UserWhereUniqueInput
  }

  export type TopicCreateNestedOneWithoutProjectsInput = {
    create?: XOR<TopicCreateWithoutProjectsInput, TopicUncheckedCreateWithoutProjectsInput>
    connectOrCreate?: TopicCreateOrConnectWithoutProjectsInput
    connect?: TopicWhereUniqueInput
  }

  export type DocumentCreateNestedManyWithoutProjectInput = {
    create?: XOR<DocumentCreateWithoutProjectInput, DocumentUncheckedCreateWithoutProjectInput> | DocumentCreateWithoutProjectInput[] | DocumentUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: DocumentCreateOrConnectWithoutProjectInput | DocumentCreateOrConnectWithoutProjectInput[]
    createMany?: DocumentCreateManyProjectInputEnvelope
    connect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
  }

  export type GraduationDocumentCreateNestedManyWithoutProjectInput = {
    create?: XOR<GraduationDocumentCreateWithoutProjectInput, GraduationDocumentUncheckedCreateWithoutProjectInput> | GraduationDocumentCreateWithoutProjectInput[] | GraduationDocumentUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: GraduationDocumentCreateOrConnectWithoutProjectInput | GraduationDocumentCreateOrConnectWithoutProjectInput[]
    createMany?: GraduationDocumentCreateManyProjectInputEnvelope
    connect?: GraduationDocumentWhereUniqueInput | GraduationDocumentWhereUniqueInput[]
  }

  export type ThesisProjectCreateNestedOneWithoutProjectInput = {
    create?: XOR<ThesisProjectCreateWithoutProjectInput, ThesisProjectUncheckedCreateWithoutProjectInput>
    connectOrCreate?: ThesisProjectCreateOrConnectWithoutProjectInput
    connect?: ThesisProjectWhereUniqueInput
  }

  export type DocumentUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<DocumentCreateWithoutProjectInput, DocumentUncheckedCreateWithoutProjectInput> | DocumentCreateWithoutProjectInput[] | DocumentUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: DocumentCreateOrConnectWithoutProjectInput | DocumentCreateOrConnectWithoutProjectInput[]
    createMany?: DocumentCreateManyProjectInputEnvelope
    connect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
  }

  export type GraduationDocumentUncheckedCreateNestedManyWithoutProjectInput = {
    create?: XOR<GraduationDocumentCreateWithoutProjectInput, GraduationDocumentUncheckedCreateWithoutProjectInput> | GraduationDocumentCreateWithoutProjectInput[] | GraduationDocumentUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: GraduationDocumentCreateOrConnectWithoutProjectInput | GraduationDocumentCreateOrConnectWithoutProjectInput[]
    createMany?: GraduationDocumentCreateManyProjectInputEnvelope
    connect?: GraduationDocumentWhereUniqueInput | GraduationDocumentWhereUniqueInput[]
  }

  export type ThesisProjectUncheckedCreateNestedOneWithoutProjectInput = {
    create?: XOR<ThesisProjectCreateWithoutProjectInput, ThesisProjectUncheckedCreateWithoutProjectInput>
    connectOrCreate?: ThesisProjectCreateOrConnectWithoutProjectInput
    connect?: ThesisProjectWhereUniqueInput
  }

  export type EnumProjectStatusFieldUpdateOperationsInput = {
    set?: $Enums.ProjectStatus
  }

  export type EnumReviewStatusFieldUpdateOperationsInput = {
    set?: $Enums.ReviewStatus
  }

  export type UserUpdateOneRequiredWithoutProjectsNestedInput = {
    create?: XOR<UserCreateWithoutProjectsInput, UserUncheckedCreateWithoutProjectsInput>
    connectOrCreate?: UserCreateOrConnectWithoutProjectsInput
    upsert?: UserUpsertWithoutProjectsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutProjectsInput, UserUpdateWithoutProjectsInput>, UserUncheckedUpdateWithoutProjectsInput>
  }

  export type TopicUpdateOneRequiredWithoutProjectsNestedInput = {
    create?: XOR<TopicCreateWithoutProjectsInput, TopicUncheckedCreateWithoutProjectsInput>
    connectOrCreate?: TopicCreateOrConnectWithoutProjectsInput
    upsert?: TopicUpsertWithoutProjectsInput
    connect?: TopicWhereUniqueInput
    update?: XOR<XOR<TopicUpdateToOneWithWhereWithoutProjectsInput, TopicUpdateWithoutProjectsInput>, TopicUncheckedUpdateWithoutProjectsInput>
  }

  export type DocumentUpdateManyWithoutProjectNestedInput = {
    create?: XOR<DocumentCreateWithoutProjectInput, DocumentUncheckedCreateWithoutProjectInput> | DocumentCreateWithoutProjectInput[] | DocumentUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: DocumentCreateOrConnectWithoutProjectInput | DocumentCreateOrConnectWithoutProjectInput[]
    upsert?: DocumentUpsertWithWhereUniqueWithoutProjectInput | DocumentUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: DocumentCreateManyProjectInputEnvelope
    set?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    disconnect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    delete?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    connect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    update?: DocumentUpdateWithWhereUniqueWithoutProjectInput | DocumentUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: DocumentUpdateManyWithWhereWithoutProjectInput | DocumentUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: DocumentScalarWhereInput | DocumentScalarWhereInput[]
  }

  export type GraduationDocumentUpdateManyWithoutProjectNestedInput = {
    create?: XOR<GraduationDocumentCreateWithoutProjectInput, GraduationDocumentUncheckedCreateWithoutProjectInput> | GraduationDocumentCreateWithoutProjectInput[] | GraduationDocumentUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: GraduationDocumentCreateOrConnectWithoutProjectInput | GraduationDocumentCreateOrConnectWithoutProjectInput[]
    upsert?: GraduationDocumentUpsertWithWhereUniqueWithoutProjectInput | GraduationDocumentUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: GraduationDocumentCreateManyProjectInputEnvelope
    set?: GraduationDocumentWhereUniqueInput | GraduationDocumentWhereUniqueInput[]
    disconnect?: GraduationDocumentWhereUniqueInput | GraduationDocumentWhereUniqueInput[]
    delete?: GraduationDocumentWhereUniqueInput | GraduationDocumentWhereUniqueInput[]
    connect?: GraduationDocumentWhereUniqueInput | GraduationDocumentWhereUniqueInput[]
    update?: GraduationDocumentUpdateWithWhereUniqueWithoutProjectInput | GraduationDocumentUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: GraduationDocumentUpdateManyWithWhereWithoutProjectInput | GraduationDocumentUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: GraduationDocumentScalarWhereInput | GraduationDocumentScalarWhereInput[]
  }

  export type ThesisProjectUpdateOneWithoutProjectNestedInput = {
    create?: XOR<ThesisProjectCreateWithoutProjectInput, ThesisProjectUncheckedCreateWithoutProjectInput>
    connectOrCreate?: ThesisProjectCreateOrConnectWithoutProjectInput
    upsert?: ThesisProjectUpsertWithoutProjectInput
    disconnect?: ThesisProjectWhereInput | boolean
    delete?: ThesisProjectWhereInput | boolean
    connect?: ThesisProjectWhereUniqueInput
    update?: XOR<XOR<ThesisProjectUpdateToOneWithWhereWithoutProjectInput, ThesisProjectUpdateWithoutProjectInput>, ThesisProjectUncheckedUpdateWithoutProjectInput>
  }

  export type DocumentUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<DocumentCreateWithoutProjectInput, DocumentUncheckedCreateWithoutProjectInput> | DocumentCreateWithoutProjectInput[] | DocumentUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: DocumentCreateOrConnectWithoutProjectInput | DocumentCreateOrConnectWithoutProjectInput[]
    upsert?: DocumentUpsertWithWhereUniqueWithoutProjectInput | DocumentUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: DocumentCreateManyProjectInputEnvelope
    set?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    disconnect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    delete?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    connect?: DocumentWhereUniqueInput | DocumentWhereUniqueInput[]
    update?: DocumentUpdateWithWhereUniqueWithoutProjectInput | DocumentUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: DocumentUpdateManyWithWhereWithoutProjectInput | DocumentUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: DocumentScalarWhereInput | DocumentScalarWhereInput[]
  }

  export type GraduationDocumentUncheckedUpdateManyWithoutProjectNestedInput = {
    create?: XOR<GraduationDocumentCreateWithoutProjectInput, GraduationDocumentUncheckedCreateWithoutProjectInput> | GraduationDocumentCreateWithoutProjectInput[] | GraduationDocumentUncheckedCreateWithoutProjectInput[]
    connectOrCreate?: GraduationDocumentCreateOrConnectWithoutProjectInput | GraduationDocumentCreateOrConnectWithoutProjectInput[]
    upsert?: GraduationDocumentUpsertWithWhereUniqueWithoutProjectInput | GraduationDocumentUpsertWithWhereUniqueWithoutProjectInput[]
    createMany?: GraduationDocumentCreateManyProjectInputEnvelope
    set?: GraduationDocumentWhereUniqueInput | GraduationDocumentWhereUniqueInput[]
    disconnect?: GraduationDocumentWhereUniqueInput | GraduationDocumentWhereUniqueInput[]
    delete?: GraduationDocumentWhereUniqueInput | GraduationDocumentWhereUniqueInput[]
    connect?: GraduationDocumentWhereUniqueInput | GraduationDocumentWhereUniqueInput[]
    update?: GraduationDocumentUpdateWithWhereUniqueWithoutProjectInput | GraduationDocumentUpdateWithWhereUniqueWithoutProjectInput[]
    updateMany?: GraduationDocumentUpdateManyWithWhereWithoutProjectInput | GraduationDocumentUpdateManyWithWhereWithoutProjectInput[]
    deleteMany?: GraduationDocumentScalarWhereInput | GraduationDocumentScalarWhereInput[]
  }

  export type ThesisProjectUncheckedUpdateOneWithoutProjectNestedInput = {
    create?: XOR<ThesisProjectCreateWithoutProjectInput, ThesisProjectUncheckedCreateWithoutProjectInput>
    connectOrCreate?: ThesisProjectCreateOrConnectWithoutProjectInput
    upsert?: ThesisProjectUpsertWithoutProjectInput
    disconnect?: ThesisProjectWhereInput | boolean
    delete?: ThesisProjectWhereInput | boolean
    connect?: ThesisProjectWhereUniqueInput
    update?: XOR<XOR<ThesisProjectUpdateToOneWithWhereWithoutProjectInput, ThesisProjectUpdateWithoutProjectInput>, ThesisProjectUncheckedUpdateWithoutProjectInput>
  }

  export type ProjectCreateNestedOneWithoutDocumentsInput = {
    create?: XOR<ProjectCreateWithoutDocumentsInput, ProjectUncheckedCreateWithoutDocumentsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutDocumentsInput
    connect?: ProjectWhereUniqueInput
  }

  export type EnumDocTypeFieldUpdateOperationsInput = {
    set?: $Enums.DocType
  }

  export type ProjectUpdateOneRequiredWithoutDocumentsNestedInput = {
    create?: XOR<ProjectCreateWithoutDocumentsInput, ProjectUncheckedCreateWithoutDocumentsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutDocumentsInput
    upsert?: ProjectUpsertWithoutDocumentsInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutDocumentsInput, ProjectUpdateWithoutDocumentsInput>, ProjectUncheckedUpdateWithoutDocumentsInput>
  }

  export type ProjectCreateNestedOneWithoutGraduationDocumentsInput = {
    create?: XOR<ProjectCreateWithoutGraduationDocumentsInput, ProjectUncheckedCreateWithoutGraduationDocumentsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutGraduationDocumentsInput
    connect?: ProjectWhereUniqueInput
  }

  export type EnumGraduationDocTypeFieldUpdateOperationsInput = {
    set?: $Enums.GraduationDocType
  }

  export type ProjectUpdateOneRequiredWithoutGraduationDocumentsNestedInput = {
    create?: XOR<ProjectCreateWithoutGraduationDocumentsInput, ProjectUncheckedCreateWithoutGraduationDocumentsInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutGraduationDocumentsInput
    upsert?: ProjectUpsertWithoutGraduationDocumentsInput
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutGraduationDocumentsInput, ProjectUpdateWithoutGraduationDocumentsInput>, ProjectUncheckedUpdateWithoutGraduationDocumentsInput>
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type UserCreateNestedOneWithoutLockedThesisTopicsInput = {
    create?: XOR<UserCreateWithoutLockedThesisTopicsInput, UserUncheckedCreateWithoutLockedThesisTopicsInput>
    connectOrCreate?: UserCreateOrConnectWithoutLockedThesisTopicsInput
    connect?: UserWhereUniqueInput
  }

  export type ThesisProjectCreateNestedOneWithoutTopicInput = {
    create?: XOR<ThesisProjectCreateWithoutTopicInput, ThesisProjectUncheckedCreateWithoutTopicInput>
    connectOrCreate?: ThesisProjectCreateOrConnectWithoutTopicInput
    connect?: ThesisProjectWhereUniqueInput
  }

  export type ThesisProjectUncheckedCreateNestedOneWithoutTopicInput = {
    create?: XOR<ThesisProjectCreateWithoutTopicInput, ThesisProjectUncheckedCreateWithoutTopicInput>
    connectOrCreate?: ThesisProjectCreateOrConnectWithoutTopicInput
    connect?: ThesisProjectWhereUniqueInput
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type UserUpdateOneWithoutLockedThesisTopicsNestedInput = {
    create?: XOR<UserCreateWithoutLockedThesisTopicsInput, UserUncheckedCreateWithoutLockedThesisTopicsInput>
    connectOrCreate?: UserCreateOrConnectWithoutLockedThesisTopicsInput
    upsert?: UserUpsertWithoutLockedThesisTopicsInput
    disconnect?: UserWhereInput | boolean
    delete?: UserWhereInput | boolean
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutLockedThesisTopicsInput, UserUpdateWithoutLockedThesisTopicsInput>, UserUncheckedUpdateWithoutLockedThesisTopicsInput>
  }

  export type ThesisProjectUpdateOneWithoutTopicNestedInput = {
    create?: XOR<ThesisProjectCreateWithoutTopicInput, ThesisProjectUncheckedCreateWithoutTopicInput>
    connectOrCreate?: ThesisProjectCreateOrConnectWithoutTopicInput
    upsert?: ThesisProjectUpsertWithoutTopicInput
    disconnect?: ThesisProjectWhereInput | boolean
    delete?: ThesisProjectWhereInput | boolean
    connect?: ThesisProjectWhereUniqueInput
    update?: XOR<XOR<ThesisProjectUpdateToOneWithWhereWithoutTopicInput, ThesisProjectUpdateWithoutTopicInput>, ThesisProjectUncheckedUpdateWithoutTopicInput>
  }

  export type ThesisProjectUncheckedUpdateOneWithoutTopicNestedInput = {
    create?: XOR<ThesisProjectCreateWithoutTopicInput, ThesisProjectUncheckedCreateWithoutTopicInput>
    connectOrCreate?: ThesisProjectCreateOrConnectWithoutTopicInput
    upsert?: ThesisProjectUpsertWithoutTopicInput
    disconnect?: ThesisProjectWhereInput | boolean
    delete?: ThesisProjectWhereInput | boolean
    connect?: ThesisProjectWhereUniqueInput
    update?: XOR<XOR<ThesisProjectUpdateToOneWithWhereWithoutTopicInput, ThesisProjectUpdateWithoutTopicInput>, ThesisProjectUncheckedUpdateWithoutTopicInput>
  }

  export type UserCreateNestedOneWithoutThesisProjectInput = {
    create?: XOR<UserCreateWithoutThesisProjectInput, UserUncheckedCreateWithoutThesisProjectInput>
    connectOrCreate?: UserCreateOrConnectWithoutThesisProjectInput
    connect?: UserWhereUniqueInput
  }

  export type ThesisTopicCreateNestedOneWithoutProjectInput = {
    create?: XOR<ThesisTopicCreateWithoutProjectInput, ThesisTopicUncheckedCreateWithoutProjectInput>
    connectOrCreate?: ThesisTopicCreateOrConnectWithoutProjectInput
    connect?: ThesisTopicWhereUniqueInput
  }

  export type ProjectCreateNestedOneWithoutThesisProjectInput = {
    create?: XOR<ProjectCreateWithoutThesisProjectInput, ProjectUncheckedCreateWithoutThesisProjectInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutThesisProjectInput
    connect?: ProjectWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutThesisProjectNestedInput = {
    create?: XOR<UserCreateWithoutThesisProjectInput, UserUncheckedCreateWithoutThesisProjectInput>
    connectOrCreate?: UserCreateOrConnectWithoutThesisProjectInput
    upsert?: UserUpsertWithoutThesisProjectInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutThesisProjectInput, UserUpdateWithoutThesisProjectInput>, UserUncheckedUpdateWithoutThesisProjectInput>
  }

  export type ThesisTopicUpdateOneRequiredWithoutProjectNestedInput = {
    create?: XOR<ThesisTopicCreateWithoutProjectInput, ThesisTopicUncheckedCreateWithoutProjectInput>
    connectOrCreate?: ThesisTopicCreateOrConnectWithoutProjectInput
    upsert?: ThesisTopicUpsertWithoutProjectInput
    connect?: ThesisTopicWhereUniqueInput
    update?: XOR<XOR<ThesisTopicUpdateToOneWithWhereWithoutProjectInput, ThesisTopicUpdateWithoutProjectInput>, ThesisTopicUncheckedUpdateWithoutProjectInput>
  }

  export type ProjectUpdateOneWithoutThesisProjectNestedInput = {
    create?: XOR<ProjectCreateWithoutThesisProjectInput, ProjectUncheckedCreateWithoutThesisProjectInput>
    connectOrCreate?: ProjectCreateOrConnectWithoutThesisProjectInput
    upsert?: ProjectUpsertWithoutThesisProjectInput
    disconnect?: ProjectWhereInput | boolean
    delete?: ProjectWhereInput | boolean
    connect?: ProjectWhereUniqueInput
    update?: XOR<XOR<ProjectUpdateToOneWithWhereWithoutThesisProjectInput, ProjectUpdateWithoutThesisProjectInput>, ProjectUncheckedUpdateWithoutThesisProjectInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleFilter<$PrismaModel> | $Enums.Role
  }

  export type NestedEnumStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.Status | EnumStatusFieldRefInput<$PrismaModel>
    in?: $Enums.Status[]
    notIn?: $Enums.Status[]
    not?: NestedEnumStatusFilter<$PrismaModel> | $Enums.Status
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedEnumRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Role | EnumRoleFieldRefInput<$PrismaModel>
    in?: $Enums.Role[]
    notIn?: $Enums.Role[]
    not?: NestedEnumRoleWithAggregatesFilter<$PrismaModel> | $Enums.Role
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumRoleFilter<$PrismaModel>
    _max?: NestedEnumRoleFilter<$PrismaModel>
  }

  export type NestedEnumStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Status | EnumStatusFieldRefInput<$PrismaModel>
    in?: $Enums.Status[]
    notIn?: $Enums.Status[]
    not?: NestedEnumStatusWithAggregatesFilter<$PrismaModel> | $Enums.Status
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumStatusFilter<$PrismaModel>
    _max?: NestedEnumStatusFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumDomainFilter<$PrismaModel = never> = {
    equals?: $Enums.Domain | EnumDomainFieldRefInput<$PrismaModel>
    in?: $Enums.Domain[]
    notIn?: $Enums.Domain[]
    not?: NestedEnumDomainFilter<$PrismaModel> | $Enums.Domain
  }

  export type NestedEnumPlatformFilter<$PrismaModel = never> = {
    equals?: $Enums.Platform | EnumPlatformFieldRefInput<$PrismaModel>
    in?: $Enums.Platform[]
    notIn?: $Enums.Platform[]
    not?: NestedEnumPlatformFilter<$PrismaModel> | $Enums.Platform
  }

  export type NestedEnumTopicTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.TopicType | EnumTopicTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TopicType[]
    notIn?: $Enums.TopicType[]
    not?: NestedEnumTopicTypeFilter<$PrismaModel> | $Enums.TopicType
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedEnumDomainWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Domain | EnumDomainFieldRefInput<$PrismaModel>
    in?: $Enums.Domain[]
    notIn?: $Enums.Domain[]
    not?: NestedEnumDomainWithAggregatesFilter<$PrismaModel> | $Enums.Domain
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDomainFilter<$PrismaModel>
    _max?: NestedEnumDomainFilter<$PrismaModel>
  }

  export type NestedEnumPlatformWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Platform | EnumPlatformFieldRefInput<$PrismaModel>
    in?: $Enums.Platform[]
    notIn?: $Enums.Platform[]
    not?: NestedEnumPlatformWithAggregatesFilter<$PrismaModel> | $Enums.Platform
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPlatformFilter<$PrismaModel>
    _max?: NestedEnumPlatformFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumTopicTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TopicType | EnumTopicTypeFieldRefInput<$PrismaModel>
    in?: $Enums.TopicType[]
    notIn?: $Enums.TopicType[]
    not?: NestedEnumTopicTypeWithAggregatesFilter<$PrismaModel> | $Enums.TopicType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTopicTypeFilter<$PrismaModel>
    _max?: NestedEnumTopicTypeFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumProjectStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ProjectStatus | EnumProjectStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProjectStatus[]
    notIn?: $Enums.ProjectStatus[]
    not?: NestedEnumProjectStatusFilter<$PrismaModel> | $Enums.ProjectStatus
  }

  export type NestedEnumReviewStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ReviewStatus | EnumReviewStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReviewStatus[]
    notIn?: $Enums.ReviewStatus[]
    not?: NestedEnumReviewStatusFilter<$PrismaModel> | $Enums.ReviewStatus
  }

  export type NestedEnumProjectStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProjectStatus | EnumProjectStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ProjectStatus[]
    notIn?: $Enums.ProjectStatus[]
    not?: NestedEnumProjectStatusWithAggregatesFilter<$PrismaModel> | $Enums.ProjectStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumProjectStatusFilter<$PrismaModel>
    _max?: NestedEnumProjectStatusFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedEnumReviewStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ReviewStatus | EnumReviewStatusFieldRefInput<$PrismaModel>
    in?: $Enums.ReviewStatus[]
    notIn?: $Enums.ReviewStatus[]
    not?: NestedEnumReviewStatusWithAggregatesFilter<$PrismaModel> | $Enums.ReviewStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumReviewStatusFilter<$PrismaModel>
    _max?: NestedEnumReviewStatusFilter<$PrismaModel>
  }

  export type NestedEnumDocTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.DocType | EnumDocTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DocType[]
    notIn?: $Enums.DocType[]
    not?: NestedEnumDocTypeFilter<$PrismaModel> | $Enums.DocType
  }

  export type NestedEnumDocTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DocType | EnumDocTypeFieldRefInput<$PrismaModel>
    in?: $Enums.DocType[]
    notIn?: $Enums.DocType[]
    not?: NestedEnumDocTypeWithAggregatesFilter<$PrismaModel> | $Enums.DocType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumDocTypeFilter<$PrismaModel>
    _max?: NestedEnumDocTypeFilter<$PrismaModel>
  }

  export type NestedEnumGraduationDocTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.GraduationDocType | EnumGraduationDocTypeFieldRefInput<$PrismaModel>
    in?: $Enums.GraduationDocType[]
    notIn?: $Enums.GraduationDocType[]
    not?: NestedEnumGraduationDocTypeFilter<$PrismaModel> | $Enums.GraduationDocType
  }

  export type NestedEnumGraduationDocTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.GraduationDocType | EnumGraduationDocTypeFieldRefInput<$PrismaModel>
    in?: $Enums.GraduationDocType[]
    notIn?: $Enums.GraduationDocType[]
    not?: NestedEnumGraduationDocTypeWithAggregatesFilter<$PrismaModel> | $Enums.GraduationDocType
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumGraduationDocTypeFilter<$PrismaModel>
    _max?: NestedEnumGraduationDocTypeFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type ProjectCreateWithoutUserInput = {
    status?: $Enums.ProjectStatus
    techStack?: string | null
    documentsRef?: NullableJsonNullValueInput | InputJsonValue
    reviewStatus?: $Enums.ReviewStatus
    reviewResult?: NullableJsonNullValueInput | InputJsonValue
    repoUrl?: string | null
    repoSyncData?: NullableJsonNullValueInput | InputJsonValue
    deployUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    topic: TopicCreateNestedOneWithoutProjectsInput
    documents?: DocumentCreateNestedManyWithoutProjectInput
    graduationDocuments?: GraduationDocumentCreateNestedManyWithoutProjectInput
    thesisProject?: ThesisProjectCreateNestedOneWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutUserInput = {
    id?: number
    topicId: number
    status?: $Enums.ProjectStatus
    techStack?: string | null
    documentsRef?: NullableJsonNullValueInput | InputJsonValue
    reviewStatus?: $Enums.ReviewStatus
    reviewResult?: NullableJsonNullValueInput | InputJsonValue
    repoUrl?: string | null
    repoSyncData?: NullableJsonNullValueInput | InputJsonValue
    deployUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    documents?: DocumentUncheckedCreateNestedManyWithoutProjectInput
    graduationDocuments?: GraduationDocumentUncheckedCreateNestedManyWithoutProjectInput
    thesisProject?: ThesisProjectUncheckedCreateNestedOneWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutUserInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutUserInput, ProjectUncheckedCreateWithoutUserInput>
  }

  export type ProjectCreateManyUserInputEnvelope = {
    data: ProjectCreateManyUserInput | ProjectCreateManyUserInput[]
  }

  export type TopicCreateWithoutCreatorInput = {
    title: string
    description: string
    background?: string | null
    objectives?: string | null
    domain: $Enums.Domain
    platform?: $Enums.Platform
    techStack: JsonNullValueInput | InputJsonValue
    type?: $Enums.TopicType
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectCreateNestedManyWithoutTopicInput
  }

  export type TopicUncheckedCreateWithoutCreatorInput = {
    id?: number
    title: string
    description: string
    background?: string | null
    objectives?: string | null
    domain: $Enums.Domain
    platform?: $Enums.Platform
    techStack: JsonNullValueInput | InputJsonValue
    type?: $Enums.TopicType
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectUncheckedCreateNestedManyWithoutTopicInput
  }

  export type TopicCreateOrConnectWithoutCreatorInput = {
    where: TopicWhereUniqueInput
    create: XOR<TopicCreateWithoutCreatorInput, TopicUncheckedCreateWithoutCreatorInput>
  }

  export type TopicCreateManyCreatorInputEnvelope = {
    data: TopicCreateManyCreatorInput | TopicCreateManyCreatorInput[]
  }

  export type ThesisProjectCreateWithoutUserInput = {
    repoUrl?: string | null
    deployUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    topic: ThesisTopicCreateNestedOneWithoutProjectInput
    project?: ProjectCreateNestedOneWithoutThesisProjectInput
  }

  export type ThesisProjectUncheckedCreateWithoutUserInput = {
    id?: number
    topicId: number
    projectId?: number | null
    repoUrl?: string | null
    deployUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ThesisProjectCreateOrConnectWithoutUserInput = {
    where: ThesisProjectWhereUniqueInput
    create: XOR<ThesisProjectCreateWithoutUserInput, ThesisProjectUncheckedCreateWithoutUserInput>
  }

  export type ThesisTopicCreateWithoutLockedByInput = {
    title: string
    category: string
    datasetName: string
    datasetUrl: string
    datasetSize: string
    isLocked?: boolean
    lockedAt?: Date | string | null
    createdAt?: Date | string
    project?: ThesisProjectCreateNestedOneWithoutTopicInput
  }

  export type ThesisTopicUncheckedCreateWithoutLockedByInput = {
    id?: number
    title: string
    category: string
    datasetName: string
    datasetUrl: string
    datasetSize: string
    isLocked?: boolean
    lockedAt?: Date | string | null
    createdAt?: Date | string
    project?: ThesisProjectUncheckedCreateNestedOneWithoutTopicInput
  }

  export type ThesisTopicCreateOrConnectWithoutLockedByInput = {
    where: ThesisTopicWhereUniqueInput
    create: XOR<ThesisTopicCreateWithoutLockedByInput, ThesisTopicUncheckedCreateWithoutLockedByInput>
  }

  export type ThesisTopicCreateManyLockedByInputEnvelope = {
    data: ThesisTopicCreateManyLockedByInput | ThesisTopicCreateManyLockedByInput[]
  }

  export type ProjectUpsertWithWhereUniqueWithoutUserInput = {
    where: ProjectWhereUniqueInput
    update: XOR<ProjectUpdateWithoutUserInput, ProjectUncheckedUpdateWithoutUserInput>
    create: XOR<ProjectCreateWithoutUserInput, ProjectUncheckedCreateWithoutUserInput>
  }

  export type ProjectUpdateWithWhereUniqueWithoutUserInput = {
    where: ProjectWhereUniqueInput
    data: XOR<ProjectUpdateWithoutUserInput, ProjectUncheckedUpdateWithoutUserInput>
  }

  export type ProjectUpdateManyWithWhereWithoutUserInput = {
    where: ProjectScalarWhereInput
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyWithoutUserInput>
  }

  export type ProjectScalarWhereInput = {
    AND?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
    OR?: ProjectScalarWhereInput[]
    NOT?: ProjectScalarWhereInput | ProjectScalarWhereInput[]
    id?: IntFilter<"Project"> | number
    userId?: IntFilter<"Project"> | number
    topicId?: IntFilter<"Project"> | number
    status?: EnumProjectStatusFilter<"Project"> | $Enums.ProjectStatus
    techStack?: StringNullableFilter<"Project"> | string | null
    documentsRef?: JsonNullableFilter<"Project">
    reviewStatus?: EnumReviewStatusFilter<"Project"> | $Enums.ReviewStatus
    reviewResult?: JsonNullableFilter<"Project">
    repoUrl?: StringNullableFilter<"Project"> | string | null
    repoSyncData?: JsonNullableFilter<"Project">
    deployUrl?: StringNullableFilter<"Project"> | string | null
    createdAt?: DateTimeFilter<"Project"> | Date | string
    updatedAt?: DateTimeFilter<"Project"> | Date | string
  }

  export type TopicUpsertWithWhereUniqueWithoutCreatorInput = {
    where: TopicWhereUniqueInput
    update: XOR<TopicUpdateWithoutCreatorInput, TopicUncheckedUpdateWithoutCreatorInput>
    create: XOR<TopicCreateWithoutCreatorInput, TopicUncheckedCreateWithoutCreatorInput>
  }

  export type TopicUpdateWithWhereUniqueWithoutCreatorInput = {
    where: TopicWhereUniqueInput
    data: XOR<TopicUpdateWithoutCreatorInput, TopicUncheckedUpdateWithoutCreatorInput>
  }

  export type TopicUpdateManyWithWhereWithoutCreatorInput = {
    where: TopicScalarWhereInput
    data: XOR<TopicUpdateManyMutationInput, TopicUncheckedUpdateManyWithoutCreatorInput>
  }

  export type TopicScalarWhereInput = {
    AND?: TopicScalarWhereInput | TopicScalarWhereInput[]
    OR?: TopicScalarWhereInput[]
    NOT?: TopicScalarWhereInput | TopicScalarWhereInput[]
    id?: IntFilter<"Topic"> | number
    title?: StringFilter<"Topic"> | string
    description?: StringFilter<"Topic"> | string
    background?: StringNullableFilter<"Topic"> | string | null
    objectives?: StringNullableFilter<"Topic"> | string | null
    domain?: EnumDomainFilter<"Topic"> | $Enums.Domain
    platform?: EnumPlatformFilter<"Topic"> | $Enums.Platform
    techStack?: JsonFilter<"Topic">
    type?: EnumTopicTypeFilter<"Topic"> | $Enums.TopicType
    creatorId?: IntNullableFilter<"Topic"> | number | null
    createdAt?: DateTimeFilter<"Topic"> | Date | string
    updatedAt?: DateTimeFilter<"Topic"> | Date | string
  }

  export type ThesisProjectUpsertWithoutUserInput = {
    update: XOR<ThesisProjectUpdateWithoutUserInput, ThesisProjectUncheckedUpdateWithoutUserInput>
    create: XOR<ThesisProjectCreateWithoutUserInput, ThesisProjectUncheckedCreateWithoutUserInput>
    where?: ThesisProjectWhereInput
  }

  export type ThesisProjectUpdateToOneWithWhereWithoutUserInput = {
    where?: ThesisProjectWhereInput
    data: XOR<ThesisProjectUpdateWithoutUserInput, ThesisProjectUncheckedUpdateWithoutUserInput>
  }

  export type ThesisProjectUpdateWithoutUserInput = {
    repoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    deployUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    topic?: ThesisTopicUpdateOneRequiredWithoutProjectNestedInput
    project?: ProjectUpdateOneWithoutThesisProjectNestedInput
  }

  export type ThesisProjectUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    topicId?: IntFieldUpdateOperationsInput | number
    projectId?: NullableIntFieldUpdateOperationsInput | number | null
    repoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    deployUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ThesisTopicUpsertWithWhereUniqueWithoutLockedByInput = {
    where: ThesisTopicWhereUniqueInput
    update: XOR<ThesisTopicUpdateWithoutLockedByInput, ThesisTopicUncheckedUpdateWithoutLockedByInput>
    create: XOR<ThesisTopicCreateWithoutLockedByInput, ThesisTopicUncheckedCreateWithoutLockedByInput>
  }

  export type ThesisTopicUpdateWithWhereUniqueWithoutLockedByInput = {
    where: ThesisTopicWhereUniqueInput
    data: XOR<ThesisTopicUpdateWithoutLockedByInput, ThesisTopicUncheckedUpdateWithoutLockedByInput>
  }

  export type ThesisTopicUpdateManyWithWhereWithoutLockedByInput = {
    where: ThesisTopicScalarWhereInput
    data: XOR<ThesisTopicUpdateManyMutationInput, ThesisTopicUncheckedUpdateManyWithoutLockedByInput>
  }

  export type ThesisTopicScalarWhereInput = {
    AND?: ThesisTopicScalarWhereInput | ThesisTopicScalarWhereInput[]
    OR?: ThesisTopicScalarWhereInput[]
    NOT?: ThesisTopicScalarWhereInput | ThesisTopicScalarWhereInput[]
    id?: IntFilter<"ThesisTopic"> | number
    title?: StringFilter<"ThesisTopic"> | string
    category?: StringFilter<"ThesisTopic"> | string
    datasetName?: StringFilter<"ThesisTopic"> | string
    datasetUrl?: StringFilter<"ThesisTopic"> | string
    datasetSize?: StringFilter<"ThesisTopic"> | string
    isLocked?: BoolFilter<"ThesisTopic"> | boolean
    lockedAt?: DateTimeNullableFilter<"ThesisTopic"> | Date | string | null
    lockedByUserId?: IntNullableFilter<"ThesisTopic"> | number | null
    createdAt?: DateTimeFilter<"ThesisTopic"> | Date | string
  }

  export type UserCreateWithoutCustomTopicsInput = {
    studentId: string
    name: string
    major: string
    grade: string
    class: string
    password: string
    role?: $Enums.Role
    status?: $Enums.Status
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectCreateNestedManyWithoutUserInput
    thesisProject?: ThesisProjectCreateNestedOneWithoutUserInput
    lockedThesisTopics?: ThesisTopicCreateNestedManyWithoutLockedByInput
  }

  export type UserUncheckedCreateWithoutCustomTopicsInput = {
    id?: number
    studentId: string
    name: string
    major: string
    grade: string
    class: string
    password: string
    role?: $Enums.Role
    status?: $Enums.Status
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectUncheckedCreateNestedManyWithoutUserInput
    thesisProject?: ThesisProjectUncheckedCreateNestedOneWithoutUserInput
    lockedThesisTopics?: ThesisTopicUncheckedCreateNestedManyWithoutLockedByInput
  }

  export type UserCreateOrConnectWithoutCustomTopicsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutCustomTopicsInput, UserUncheckedCreateWithoutCustomTopicsInput>
  }

  export type ProjectCreateWithoutTopicInput = {
    status?: $Enums.ProjectStatus
    techStack?: string | null
    documentsRef?: NullableJsonNullValueInput | InputJsonValue
    reviewStatus?: $Enums.ReviewStatus
    reviewResult?: NullableJsonNullValueInput | InputJsonValue
    repoUrl?: string | null
    repoSyncData?: NullableJsonNullValueInput | InputJsonValue
    deployUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutProjectsInput
    documents?: DocumentCreateNestedManyWithoutProjectInput
    graduationDocuments?: GraduationDocumentCreateNestedManyWithoutProjectInput
    thesisProject?: ThesisProjectCreateNestedOneWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutTopicInput = {
    id?: number
    userId: number
    status?: $Enums.ProjectStatus
    techStack?: string | null
    documentsRef?: NullableJsonNullValueInput | InputJsonValue
    reviewStatus?: $Enums.ReviewStatus
    reviewResult?: NullableJsonNullValueInput | InputJsonValue
    repoUrl?: string | null
    repoSyncData?: NullableJsonNullValueInput | InputJsonValue
    deployUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    documents?: DocumentUncheckedCreateNestedManyWithoutProjectInput
    graduationDocuments?: GraduationDocumentUncheckedCreateNestedManyWithoutProjectInput
    thesisProject?: ThesisProjectUncheckedCreateNestedOneWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutTopicInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutTopicInput, ProjectUncheckedCreateWithoutTopicInput>
  }

  export type ProjectCreateManyTopicInputEnvelope = {
    data: ProjectCreateManyTopicInput | ProjectCreateManyTopicInput[]
  }

  export type UserUpsertWithoutCustomTopicsInput = {
    update: XOR<UserUpdateWithoutCustomTopicsInput, UserUncheckedUpdateWithoutCustomTopicsInput>
    create: XOR<UserCreateWithoutCustomTopicsInput, UserUncheckedCreateWithoutCustomTopicsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutCustomTopicsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutCustomTopicsInput, UserUncheckedUpdateWithoutCustomTopicsInput>
  }

  export type UserUpdateWithoutCustomTopicsInput = {
    studentId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    major?: StringFieldUpdateOperationsInput | string
    grade?: StringFieldUpdateOperationsInput | string
    class?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUpdateManyWithoutUserNestedInput
    thesisProject?: ThesisProjectUpdateOneWithoutUserNestedInput
    lockedThesisTopics?: ThesisTopicUpdateManyWithoutLockedByNestedInput
  }

  export type UserUncheckedUpdateWithoutCustomTopicsInput = {
    id?: IntFieldUpdateOperationsInput | number
    studentId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    major?: StringFieldUpdateOperationsInput | string
    grade?: StringFieldUpdateOperationsInput | string
    class?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUncheckedUpdateManyWithoutUserNestedInput
    thesisProject?: ThesisProjectUncheckedUpdateOneWithoutUserNestedInput
    lockedThesisTopics?: ThesisTopicUncheckedUpdateManyWithoutLockedByNestedInput
  }

  export type ProjectUpsertWithWhereUniqueWithoutTopicInput = {
    where: ProjectWhereUniqueInput
    update: XOR<ProjectUpdateWithoutTopicInput, ProjectUncheckedUpdateWithoutTopicInput>
    create: XOR<ProjectCreateWithoutTopicInput, ProjectUncheckedCreateWithoutTopicInput>
  }

  export type ProjectUpdateWithWhereUniqueWithoutTopicInput = {
    where: ProjectWhereUniqueInput
    data: XOR<ProjectUpdateWithoutTopicInput, ProjectUncheckedUpdateWithoutTopicInput>
  }

  export type ProjectUpdateManyWithWhereWithoutTopicInput = {
    where: ProjectScalarWhereInput
    data: XOR<ProjectUpdateManyMutationInput, ProjectUncheckedUpdateManyWithoutTopicInput>
  }

  export type UserCreateWithoutProjectsInput = {
    studentId: string
    name: string
    major: string
    grade: string
    class: string
    password: string
    role?: $Enums.Role
    status?: $Enums.Status
    createdAt?: Date | string
    updatedAt?: Date | string
    customTopics?: TopicCreateNestedManyWithoutCreatorInput
    thesisProject?: ThesisProjectCreateNestedOneWithoutUserInput
    lockedThesisTopics?: ThesisTopicCreateNestedManyWithoutLockedByInput
  }

  export type UserUncheckedCreateWithoutProjectsInput = {
    id?: number
    studentId: string
    name: string
    major: string
    grade: string
    class: string
    password: string
    role?: $Enums.Role
    status?: $Enums.Status
    createdAt?: Date | string
    updatedAt?: Date | string
    customTopics?: TopicUncheckedCreateNestedManyWithoutCreatorInput
    thesisProject?: ThesisProjectUncheckedCreateNestedOneWithoutUserInput
    lockedThesisTopics?: ThesisTopicUncheckedCreateNestedManyWithoutLockedByInput
  }

  export type UserCreateOrConnectWithoutProjectsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutProjectsInput, UserUncheckedCreateWithoutProjectsInput>
  }

  export type TopicCreateWithoutProjectsInput = {
    title: string
    description: string
    background?: string | null
    objectives?: string | null
    domain: $Enums.Domain
    platform?: $Enums.Platform
    techStack: JsonNullValueInput | InputJsonValue
    type?: $Enums.TopicType
    createdAt?: Date | string
    updatedAt?: Date | string
    creator?: UserCreateNestedOneWithoutCustomTopicsInput
  }

  export type TopicUncheckedCreateWithoutProjectsInput = {
    id?: number
    title: string
    description: string
    background?: string | null
    objectives?: string | null
    domain: $Enums.Domain
    platform?: $Enums.Platform
    techStack: JsonNullValueInput | InputJsonValue
    type?: $Enums.TopicType
    creatorId?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TopicCreateOrConnectWithoutProjectsInput = {
    where: TopicWhereUniqueInput
    create: XOR<TopicCreateWithoutProjectsInput, TopicUncheckedCreateWithoutProjectsInput>
  }

  export type DocumentCreateWithoutProjectInput = {
    docType: $Enums.DocType
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DocumentUncheckedCreateWithoutProjectInput = {
    id?: number
    docType: $Enums.DocType
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DocumentCreateOrConnectWithoutProjectInput = {
    where: DocumentWhereUniqueInput
    create: XOR<DocumentCreateWithoutProjectInput, DocumentUncheckedCreateWithoutProjectInput>
  }

  export type DocumentCreateManyProjectInputEnvelope = {
    data: DocumentCreateManyProjectInput | DocumentCreateManyProjectInput[]
  }

  export type GraduationDocumentCreateWithoutProjectInput = {
    docType: $Enums.GraduationDocType
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GraduationDocumentUncheckedCreateWithoutProjectInput = {
    id?: number
    docType: $Enums.GraduationDocType
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GraduationDocumentCreateOrConnectWithoutProjectInput = {
    where: GraduationDocumentWhereUniqueInput
    create: XOR<GraduationDocumentCreateWithoutProjectInput, GraduationDocumentUncheckedCreateWithoutProjectInput>
  }

  export type GraduationDocumentCreateManyProjectInputEnvelope = {
    data: GraduationDocumentCreateManyProjectInput | GraduationDocumentCreateManyProjectInput[]
  }

  export type ThesisProjectCreateWithoutProjectInput = {
    repoUrl?: string | null
    deployUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutThesisProjectInput
    topic: ThesisTopicCreateNestedOneWithoutProjectInput
  }

  export type ThesisProjectUncheckedCreateWithoutProjectInput = {
    id?: number
    userId: number
    topicId: number
    repoUrl?: string | null
    deployUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ThesisProjectCreateOrConnectWithoutProjectInput = {
    where: ThesisProjectWhereUniqueInput
    create: XOR<ThesisProjectCreateWithoutProjectInput, ThesisProjectUncheckedCreateWithoutProjectInput>
  }

  export type UserUpsertWithoutProjectsInput = {
    update: XOR<UserUpdateWithoutProjectsInput, UserUncheckedUpdateWithoutProjectsInput>
    create: XOR<UserCreateWithoutProjectsInput, UserUncheckedCreateWithoutProjectsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutProjectsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutProjectsInput, UserUncheckedUpdateWithoutProjectsInput>
  }

  export type UserUpdateWithoutProjectsInput = {
    studentId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    major?: StringFieldUpdateOperationsInput | string
    grade?: StringFieldUpdateOperationsInput | string
    class?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customTopics?: TopicUpdateManyWithoutCreatorNestedInput
    thesisProject?: ThesisProjectUpdateOneWithoutUserNestedInput
    lockedThesisTopics?: ThesisTopicUpdateManyWithoutLockedByNestedInput
  }

  export type UserUncheckedUpdateWithoutProjectsInput = {
    id?: IntFieldUpdateOperationsInput | number
    studentId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    major?: StringFieldUpdateOperationsInput | string
    grade?: StringFieldUpdateOperationsInput | string
    class?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    customTopics?: TopicUncheckedUpdateManyWithoutCreatorNestedInput
    thesisProject?: ThesisProjectUncheckedUpdateOneWithoutUserNestedInput
    lockedThesisTopics?: ThesisTopicUncheckedUpdateManyWithoutLockedByNestedInput
  }

  export type TopicUpsertWithoutProjectsInput = {
    update: XOR<TopicUpdateWithoutProjectsInput, TopicUncheckedUpdateWithoutProjectsInput>
    create: XOR<TopicCreateWithoutProjectsInput, TopicUncheckedCreateWithoutProjectsInput>
    where?: TopicWhereInput
  }

  export type TopicUpdateToOneWithWhereWithoutProjectsInput = {
    where?: TopicWhereInput
    data: XOR<TopicUpdateWithoutProjectsInput, TopicUncheckedUpdateWithoutProjectsInput>
  }

  export type TopicUpdateWithoutProjectsInput = {
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    background?: NullableStringFieldUpdateOperationsInput | string | null
    objectives?: NullableStringFieldUpdateOperationsInput | string | null
    domain?: EnumDomainFieldUpdateOperationsInput | $Enums.Domain
    platform?: EnumPlatformFieldUpdateOperationsInput | $Enums.Platform
    techStack?: JsonNullValueInput | InputJsonValue
    type?: EnumTopicTypeFieldUpdateOperationsInput | $Enums.TopicType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    creator?: UserUpdateOneWithoutCustomTopicsNestedInput
  }

  export type TopicUncheckedUpdateWithoutProjectsInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    background?: NullableStringFieldUpdateOperationsInput | string | null
    objectives?: NullableStringFieldUpdateOperationsInput | string | null
    domain?: EnumDomainFieldUpdateOperationsInput | $Enums.Domain
    platform?: EnumPlatformFieldUpdateOperationsInput | $Enums.Platform
    techStack?: JsonNullValueInput | InputJsonValue
    type?: EnumTopicTypeFieldUpdateOperationsInput | $Enums.TopicType
    creatorId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentUpsertWithWhereUniqueWithoutProjectInput = {
    where: DocumentWhereUniqueInput
    update: XOR<DocumentUpdateWithoutProjectInput, DocumentUncheckedUpdateWithoutProjectInput>
    create: XOR<DocumentCreateWithoutProjectInput, DocumentUncheckedCreateWithoutProjectInput>
  }

  export type DocumentUpdateWithWhereUniqueWithoutProjectInput = {
    where: DocumentWhereUniqueInput
    data: XOR<DocumentUpdateWithoutProjectInput, DocumentUncheckedUpdateWithoutProjectInput>
  }

  export type DocumentUpdateManyWithWhereWithoutProjectInput = {
    where: DocumentScalarWhereInput
    data: XOR<DocumentUpdateManyMutationInput, DocumentUncheckedUpdateManyWithoutProjectInput>
  }

  export type DocumentScalarWhereInput = {
    AND?: DocumentScalarWhereInput | DocumentScalarWhereInput[]
    OR?: DocumentScalarWhereInput[]
    NOT?: DocumentScalarWhereInput | DocumentScalarWhereInput[]
    id?: IntFilter<"Document"> | number
    projectId?: IntFilter<"Document"> | number
    docType?: EnumDocTypeFilter<"Document"> | $Enums.DocType
    content?: StringFilter<"Document"> | string
    createdAt?: DateTimeFilter<"Document"> | Date | string
    updatedAt?: DateTimeFilter<"Document"> | Date | string
  }

  export type GraduationDocumentUpsertWithWhereUniqueWithoutProjectInput = {
    where: GraduationDocumentWhereUniqueInput
    update: XOR<GraduationDocumentUpdateWithoutProjectInput, GraduationDocumentUncheckedUpdateWithoutProjectInput>
    create: XOR<GraduationDocumentCreateWithoutProjectInput, GraduationDocumentUncheckedCreateWithoutProjectInput>
  }

  export type GraduationDocumentUpdateWithWhereUniqueWithoutProjectInput = {
    where: GraduationDocumentWhereUniqueInput
    data: XOR<GraduationDocumentUpdateWithoutProjectInput, GraduationDocumentUncheckedUpdateWithoutProjectInput>
  }

  export type GraduationDocumentUpdateManyWithWhereWithoutProjectInput = {
    where: GraduationDocumentScalarWhereInput
    data: XOR<GraduationDocumentUpdateManyMutationInput, GraduationDocumentUncheckedUpdateManyWithoutProjectInput>
  }

  export type GraduationDocumentScalarWhereInput = {
    AND?: GraduationDocumentScalarWhereInput | GraduationDocumentScalarWhereInput[]
    OR?: GraduationDocumentScalarWhereInput[]
    NOT?: GraduationDocumentScalarWhereInput | GraduationDocumentScalarWhereInput[]
    id?: IntFilter<"GraduationDocument"> | number
    projectId?: IntFilter<"GraduationDocument"> | number
    docType?: EnumGraduationDocTypeFilter<"GraduationDocument"> | $Enums.GraduationDocType
    content?: StringFilter<"GraduationDocument"> | string
    createdAt?: DateTimeFilter<"GraduationDocument"> | Date | string
    updatedAt?: DateTimeFilter<"GraduationDocument"> | Date | string
  }

  export type ThesisProjectUpsertWithoutProjectInput = {
    update: XOR<ThesisProjectUpdateWithoutProjectInput, ThesisProjectUncheckedUpdateWithoutProjectInput>
    create: XOR<ThesisProjectCreateWithoutProjectInput, ThesisProjectUncheckedCreateWithoutProjectInput>
    where?: ThesisProjectWhereInput
  }

  export type ThesisProjectUpdateToOneWithWhereWithoutProjectInput = {
    where?: ThesisProjectWhereInput
    data: XOR<ThesisProjectUpdateWithoutProjectInput, ThesisProjectUncheckedUpdateWithoutProjectInput>
  }

  export type ThesisProjectUpdateWithoutProjectInput = {
    repoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    deployUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutThesisProjectNestedInput
    topic?: ThesisTopicUpdateOneRequiredWithoutProjectNestedInput
  }

  export type ThesisProjectUncheckedUpdateWithoutProjectInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    topicId?: IntFieldUpdateOperationsInput | number
    repoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    deployUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectCreateWithoutDocumentsInput = {
    status?: $Enums.ProjectStatus
    techStack?: string | null
    documentsRef?: NullableJsonNullValueInput | InputJsonValue
    reviewStatus?: $Enums.ReviewStatus
    reviewResult?: NullableJsonNullValueInput | InputJsonValue
    repoUrl?: string | null
    repoSyncData?: NullableJsonNullValueInput | InputJsonValue
    deployUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutProjectsInput
    topic: TopicCreateNestedOneWithoutProjectsInput
    graduationDocuments?: GraduationDocumentCreateNestedManyWithoutProjectInput
    thesisProject?: ThesisProjectCreateNestedOneWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutDocumentsInput = {
    id?: number
    userId: number
    topicId: number
    status?: $Enums.ProjectStatus
    techStack?: string | null
    documentsRef?: NullableJsonNullValueInput | InputJsonValue
    reviewStatus?: $Enums.ReviewStatus
    reviewResult?: NullableJsonNullValueInput | InputJsonValue
    repoUrl?: string | null
    repoSyncData?: NullableJsonNullValueInput | InputJsonValue
    deployUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    graduationDocuments?: GraduationDocumentUncheckedCreateNestedManyWithoutProjectInput
    thesisProject?: ThesisProjectUncheckedCreateNestedOneWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutDocumentsInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutDocumentsInput, ProjectUncheckedCreateWithoutDocumentsInput>
  }

  export type ProjectUpsertWithoutDocumentsInput = {
    update: XOR<ProjectUpdateWithoutDocumentsInput, ProjectUncheckedUpdateWithoutDocumentsInput>
    create: XOR<ProjectCreateWithoutDocumentsInput, ProjectUncheckedCreateWithoutDocumentsInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutDocumentsInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutDocumentsInput, ProjectUncheckedUpdateWithoutDocumentsInput>
  }

  export type ProjectUpdateWithoutDocumentsInput = {
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    techStack?: NullableStringFieldUpdateOperationsInput | string | null
    documentsRef?: NullableJsonNullValueInput | InputJsonValue
    reviewStatus?: EnumReviewStatusFieldUpdateOperationsInput | $Enums.ReviewStatus
    reviewResult?: NullableJsonNullValueInput | InputJsonValue
    repoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    repoSyncData?: NullableJsonNullValueInput | InputJsonValue
    deployUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutProjectsNestedInput
    topic?: TopicUpdateOneRequiredWithoutProjectsNestedInput
    graduationDocuments?: GraduationDocumentUpdateManyWithoutProjectNestedInput
    thesisProject?: ThesisProjectUpdateOneWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutDocumentsInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    topicId?: IntFieldUpdateOperationsInput | number
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    techStack?: NullableStringFieldUpdateOperationsInput | string | null
    documentsRef?: NullableJsonNullValueInput | InputJsonValue
    reviewStatus?: EnumReviewStatusFieldUpdateOperationsInput | $Enums.ReviewStatus
    reviewResult?: NullableJsonNullValueInput | InputJsonValue
    repoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    repoSyncData?: NullableJsonNullValueInput | InputJsonValue
    deployUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    graduationDocuments?: GraduationDocumentUncheckedUpdateManyWithoutProjectNestedInput
    thesisProject?: ThesisProjectUncheckedUpdateOneWithoutProjectNestedInput
  }

  export type ProjectCreateWithoutGraduationDocumentsInput = {
    status?: $Enums.ProjectStatus
    techStack?: string | null
    documentsRef?: NullableJsonNullValueInput | InputJsonValue
    reviewStatus?: $Enums.ReviewStatus
    reviewResult?: NullableJsonNullValueInput | InputJsonValue
    repoUrl?: string | null
    repoSyncData?: NullableJsonNullValueInput | InputJsonValue
    deployUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutProjectsInput
    topic: TopicCreateNestedOneWithoutProjectsInput
    documents?: DocumentCreateNestedManyWithoutProjectInput
    thesisProject?: ThesisProjectCreateNestedOneWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutGraduationDocumentsInput = {
    id?: number
    userId: number
    topicId: number
    status?: $Enums.ProjectStatus
    techStack?: string | null
    documentsRef?: NullableJsonNullValueInput | InputJsonValue
    reviewStatus?: $Enums.ReviewStatus
    reviewResult?: NullableJsonNullValueInput | InputJsonValue
    repoUrl?: string | null
    repoSyncData?: NullableJsonNullValueInput | InputJsonValue
    deployUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    documents?: DocumentUncheckedCreateNestedManyWithoutProjectInput
    thesisProject?: ThesisProjectUncheckedCreateNestedOneWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutGraduationDocumentsInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutGraduationDocumentsInput, ProjectUncheckedCreateWithoutGraduationDocumentsInput>
  }

  export type ProjectUpsertWithoutGraduationDocumentsInput = {
    update: XOR<ProjectUpdateWithoutGraduationDocumentsInput, ProjectUncheckedUpdateWithoutGraduationDocumentsInput>
    create: XOR<ProjectCreateWithoutGraduationDocumentsInput, ProjectUncheckedCreateWithoutGraduationDocumentsInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutGraduationDocumentsInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutGraduationDocumentsInput, ProjectUncheckedUpdateWithoutGraduationDocumentsInput>
  }

  export type ProjectUpdateWithoutGraduationDocumentsInput = {
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    techStack?: NullableStringFieldUpdateOperationsInput | string | null
    documentsRef?: NullableJsonNullValueInput | InputJsonValue
    reviewStatus?: EnumReviewStatusFieldUpdateOperationsInput | $Enums.ReviewStatus
    reviewResult?: NullableJsonNullValueInput | InputJsonValue
    repoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    repoSyncData?: NullableJsonNullValueInput | InputJsonValue
    deployUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutProjectsNestedInput
    topic?: TopicUpdateOneRequiredWithoutProjectsNestedInput
    documents?: DocumentUpdateManyWithoutProjectNestedInput
    thesisProject?: ThesisProjectUpdateOneWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutGraduationDocumentsInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    topicId?: IntFieldUpdateOperationsInput | number
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    techStack?: NullableStringFieldUpdateOperationsInput | string | null
    documentsRef?: NullableJsonNullValueInput | InputJsonValue
    reviewStatus?: EnumReviewStatusFieldUpdateOperationsInput | $Enums.ReviewStatus
    reviewResult?: NullableJsonNullValueInput | InputJsonValue
    repoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    repoSyncData?: NullableJsonNullValueInput | InputJsonValue
    deployUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    documents?: DocumentUncheckedUpdateManyWithoutProjectNestedInput
    thesisProject?: ThesisProjectUncheckedUpdateOneWithoutProjectNestedInput
  }

  export type UserCreateWithoutLockedThesisTopicsInput = {
    studentId: string
    name: string
    major: string
    grade: string
    class: string
    password: string
    role?: $Enums.Role
    status?: $Enums.Status
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectCreateNestedManyWithoutUserInput
    customTopics?: TopicCreateNestedManyWithoutCreatorInput
    thesisProject?: ThesisProjectCreateNestedOneWithoutUserInput
  }

  export type UserUncheckedCreateWithoutLockedThesisTopicsInput = {
    id?: number
    studentId: string
    name: string
    major: string
    grade: string
    class: string
    password: string
    role?: $Enums.Role
    status?: $Enums.Status
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectUncheckedCreateNestedManyWithoutUserInput
    customTopics?: TopicUncheckedCreateNestedManyWithoutCreatorInput
    thesisProject?: ThesisProjectUncheckedCreateNestedOneWithoutUserInput
  }

  export type UserCreateOrConnectWithoutLockedThesisTopicsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutLockedThesisTopicsInput, UserUncheckedCreateWithoutLockedThesisTopicsInput>
  }

  export type ThesisProjectCreateWithoutTopicInput = {
    repoUrl?: string | null
    deployUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutThesisProjectInput
    project?: ProjectCreateNestedOneWithoutThesisProjectInput
  }

  export type ThesisProjectUncheckedCreateWithoutTopicInput = {
    id?: number
    userId: number
    projectId?: number | null
    repoUrl?: string | null
    deployUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ThesisProjectCreateOrConnectWithoutTopicInput = {
    where: ThesisProjectWhereUniqueInput
    create: XOR<ThesisProjectCreateWithoutTopicInput, ThesisProjectUncheckedCreateWithoutTopicInput>
  }

  export type UserUpsertWithoutLockedThesisTopicsInput = {
    update: XOR<UserUpdateWithoutLockedThesisTopicsInput, UserUncheckedUpdateWithoutLockedThesisTopicsInput>
    create: XOR<UserCreateWithoutLockedThesisTopicsInput, UserUncheckedCreateWithoutLockedThesisTopicsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutLockedThesisTopicsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutLockedThesisTopicsInput, UserUncheckedUpdateWithoutLockedThesisTopicsInput>
  }

  export type UserUpdateWithoutLockedThesisTopicsInput = {
    studentId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    major?: StringFieldUpdateOperationsInput | string
    grade?: StringFieldUpdateOperationsInput | string
    class?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUpdateManyWithoutUserNestedInput
    customTopics?: TopicUpdateManyWithoutCreatorNestedInput
    thesisProject?: ThesisProjectUpdateOneWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutLockedThesisTopicsInput = {
    id?: IntFieldUpdateOperationsInput | number
    studentId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    major?: StringFieldUpdateOperationsInput | string
    grade?: StringFieldUpdateOperationsInput | string
    class?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUncheckedUpdateManyWithoutUserNestedInput
    customTopics?: TopicUncheckedUpdateManyWithoutCreatorNestedInput
    thesisProject?: ThesisProjectUncheckedUpdateOneWithoutUserNestedInput
  }

  export type ThesisProjectUpsertWithoutTopicInput = {
    update: XOR<ThesisProjectUpdateWithoutTopicInput, ThesisProjectUncheckedUpdateWithoutTopicInput>
    create: XOR<ThesisProjectCreateWithoutTopicInput, ThesisProjectUncheckedCreateWithoutTopicInput>
    where?: ThesisProjectWhereInput
  }

  export type ThesisProjectUpdateToOneWithWhereWithoutTopicInput = {
    where?: ThesisProjectWhereInput
    data: XOR<ThesisProjectUpdateWithoutTopicInput, ThesisProjectUncheckedUpdateWithoutTopicInput>
  }

  export type ThesisProjectUpdateWithoutTopicInput = {
    repoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    deployUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutThesisProjectNestedInput
    project?: ProjectUpdateOneWithoutThesisProjectNestedInput
  }

  export type ThesisProjectUncheckedUpdateWithoutTopicInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    projectId?: NullableIntFieldUpdateOperationsInput | number | null
    repoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    deployUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateWithoutThesisProjectInput = {
    studentId: string
    name: string
    major: string
    grade: string
    class: string
    password: string
    role?: $Enums.Role
    status?: $Enums.Status
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectCreateNestedManyWithoutUserInput
    customTopics?: TopicCreateNestedManyWithoutCreatorInput
    lockedThesisTopics?: ThesisTopicCreateNestedManyWithoutLockedByInput
  }

  export type UserUncheckedCreateWithoutThesisProjectInput = {
    id?: number
    studentId: string
    name: string
    major: string
    grade: string
    class: string
    password: string
    role?: $Enums.Role
    status?: $Enums.Status
    createdAt?: Date | string
    updatedAt?: Date | string
    projects?: ProjectUncheckedCreateNestedManyWithoutUserInput
    customTopics?: TopicUncheckedCreateNestedManyWithoutCreatorInput
    lockedThesisTopics?: ThesisTopicUncheckedCreateNestedManyWithoutLockedByInput
  }

  export type UserCreateOrConnectWithoutThesisProjectInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutThesisProjectInput, UserUncheckedCreateWithoutThesisProjectInput>
  }

  export type ThesisTopicCreateWithoutProjectInput = {
    title: string
    category: string
    datasetName: string
    datasetUrl: string
    datasetSize: string
    isLocked?: boolean
    lockedAt?: Date | string | null
    createdAt?: Date | string
    lockedBy?: UserCreateNestedOneWithoutLockedThesisTopicsInput
  }

  export type ThesisTopicUncheckedCreateWithoutProjectInput = {
    id?: number
    title: string
    category: string
    datasetName: string
    datasetUrl: string
    datasetSize: string
    isLocked?: boolean
    lockedAt?: Date | string | null
    lockedByUserId?: number | null
    createdAt?: Date | string
  }

  export type ThesisTopicCreateOrConnectWithoutProjectInput = {
    where: ThesisTopicWhereUniqueInput
    create: XOR<ThesisTopicCreateWithoutProjectInput, ThesisTopicUncheckedCreateWithoutProjectInput>
  }

  export type ProjectCreateWithoutThesisProjectInput = {
    status?: $Enums.ProjectStatus
    techStack?: string | null
    documentsRef?: NullableJsonNullValueInput | InputJsonValue
    reviewStatus?: $Enums.ReviewStatus
    reviewResult?: NullableJsonNullValueInput | InputJsonValue
    repoUrl?: string | null
    repoSyncData?: NullableJsonNullValueInput | InputJsonValue
    deployUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutProjectsInput
    topic: TopicCreateNestedOneWithoutProjectsInput
    documents?: DocumentCreateNestedManyWithoutProjectInput
    graduationDocuments?: GraduationDocumentCreateNestedManyWithoutProjectInput
  }

  export type ProjectUncheckedCreateWithoutThesisProjectInput = {
    id?: number
    userId: number
    topicId: number
    status?: $Enums.ProjectStatus
    techStack?: string | null
    documentsRef?: NullableJsonNullValueInput | InputJsonValue
    reviewStatus?: $Enums.ReviewStatus
    reviewResult?: NullableJsonNullValueInput | InputJsonValue
    repoUrl?: string | null
    repoSyncData?: NullableJsonNullValueInput | InputJsonValue
    deployUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    documents?: DocumentUncheckedCreateNestedManyWithoutProjectInput
    graduationDocuments?: GraduationDocumentUncheckedCreateNestedManyWithoutProjectInput
  }

  export type ProjectCreateOrConnectWithoutThesisProjectInput = {
    where: ProjectWhereUniqueInput
    create: XOR<ProjectCreateWithoutThesisProjectInput, ProjectUncheckedCreateWithoutThesisProjectInput>
  }

  export type UserUpsertWithoutThesisProjectInput = {
    update: XOR<UserUpdateWithoutThesisProjectInput, UserUncheckedUpdateWithoutThesisProjectInput>
    create: XOR<UserCreateWithoutThesisProjectInput, UserUncheckedCreateWithoutThesisProjectInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutThesisProjectInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutThesisProjectInput, UserUncheckedUpdateWithoutThesisProjectInput>
  }

  export type UserUpdateWithoutThesisProjectInput = {
    studentId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    major?: StringFieldUpdateOperationsInput | string
    grade?: StringFieldUpdateOperationsInput | string
    class?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUpdateManyWithoutUserNestedInput
    customTopics?: TopicUpdateManyWithoutCreatorNestedInput
    lockedThesisTopics?: ThesisTopicUpdateManyWithoutLockedByNestedInput
  }

  export type UserUncheckedUpdateWithoutThesisProjectInput = {
    id?: IntFieldUpdateOperationsInput | number
    studentId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    major?: StringFieldUpdateOperationsInput | string
    grade?: StringFieldUpdateOperationsInput | string
    class?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumRoleFieldUpdateOperationsInput | $Enums.Role
    status?: EnumStatusFieldUpdateOperationsInput | $Enums.Status
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUncheckedUpdateManyWithoutUserNestedInput
    customTopics?: TopicUncheckedUpdateManyWithoutCreatorNestedInput
    lockedThesisTopics?: ThesisTopicUncheckedUpdateManyWithoutLockedByNestedInput
  }

  export type ThesisTopicUpsertWithoutProjectInput = {
    update: XOR<ThesisTopicUpdateWithoutProjectInput, ThesisTopicUncheckedUpdateWithoutProjectInput>
    create: XOR<ThesisTopicCreateWithoutProjectInput, ThesisTopicUncheckedCreateWithoutProjectInput>
    where?: ThesisTopicWhereInput
  }

  export type ThesisTopicUpdateToOneWithWhereWithoutProjectInput = {
    where?: ThesisTopicWhereInput
    data: XOR<ThesisTopicUpdateWithoutProjectInput, ThesisTopicUncheckedUpdateWithoutProjectInput>
  }

  export type ThesisTopicUpdateWithoutProjectInput = {
    title?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    datasetName?: StringFieldUpdateOperationsInput | string
    datasetUrl?: StringFieldUpdateOperationsInput | string
    datasetSize?: StringFieldUpdateOperationsInput | string
    isLocked?: BoolFieldUpdateOperationsInput | boolean
    lockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lockedBy?: UserUpdateOneWithoutLockedThesisTopicsNestedInput
  }

  export type ThesisTopicUncheckedUpdateWithoutProjectInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    datasetName?: StringFieldUpdateOperationsInput | string
    datasetUrl?: StringFieldUpdateOperationsInput | string
    datasetSize?: StringFieldUpdateOperationsInput | string
    isLocked?: BoolFieldUpdateOperationsInput | boolean
    lockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lockedByUserId?: NullableIntFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectUpsertWithoutThesisProjectInput = {
    update: XOR<ProjectUpdateWithoutThesisProjectInput, ProjectUncheckedUpdateWithoutThesisProjectInput>
    create: XOR<ProjectCreateWithoutThesisProjectInput, ProjectUncheckedCreateWithoutThesisProjectInput>
    where?: ProjectWhereInput
  }

  export type ProjectUpdateToOneWithWhereWithoutThesisProjectInput = {
    where?: ProjectWhereInput
    data: XOR<ProjectUpdateWithoutThesisProjectInput, ProjectUncheckedUpdateWithoutThesisProjectInput>
  }

  export type ProjectUpdateWithoutThesisProjectInput = {
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    techStack?: NullableStringFieldUpdateOperationsInput | string | null
    documentsRef?: NullableJsonNullValueInput | InputJsonValue
    reviewStatus?: EnumReviewStatusFieldUpdateOperationsInput | $Enums.ReviewStatus
    reviewResult?: NullableJsonNullValueInput | InputJsonValue
    repoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    repoSyncData?: NullableJsonNullValueInput | InputJsonValue
    deployUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutProjectsNestedInput
    topic?: TopicUpdateOneRequiredWithoutProjectsNestedInput
    documents?: DocumentUpdateManyWithoutProjectNestedInput
    graduationDocuments?: GraduationDocumentUpdateManyWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutThesisProjectInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    topicId?: IntFieldUpdateOperationsInput | number
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    techStack?: NullableStringFieldUpdateOperationsInput | string | null
    documentsRef?: NullableJsonNullValueInput | InputJsonValue
    reviewStatus?: EnumReviewStatusFieldUpdateOperationsInput | $Enums.ReviewStatus
    reviewResult?: NullableJsonNullValueInput | InputJsonValue
    repoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    repoSyncData?: NullableJsonNullValueInput | InputJsonValue
    deployUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    documents?: DocumentUncheckedUpdateManyWithoutProjectNestedInput
    graduationDocuments?: GraduationDocumentUncheckedUpdateManyWithoutProjectNestedInput
  }

  export type ProjectCreateManyUserInput = {
    id?: number
    topicId: number
    status?: $Enums.ProjectStatus
    techStack?: string | null
    documentsRef?: NullableJsonNullValueInput | InputJsonValue
    reviewStatus?: $Enums.ReviewStatus
    reviewResult?: NullableJsonNullValueInput | InputJsonValue
    repoUrl?: string | null
    repoSyncData?: NullableJsonNullValueInput | InputJsonValue
    deployUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TopicCreateManyCreatorInput = {
    id?: number
    title: string
    description: string
    background?: string | null
    objectives?: string | null
    domain: $Enums.Domain
    platform?: $Enums.Platform
    techStack: JsonNullValueInput | InputJsonValue
    type?: $Enums.TopicType
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ThesisTopicCreateManyLockedByInput = {
    id?: number
    title: string
    category: string
    datasetName: string
    datasetUrl: string
    datasetSize: string
    isLocked?: boolean
    lockedAt?: Date | string | null
    createdAt?: Date | string
  }

  export type ProjectUpdateWithoutUserInput = {
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    techStack?: NullableStringFieldUpdateOperationsInput | string | null
    documentsRef?: NullableJsonNullValueInput | InputJsonValue
    reviewStatus?: EnumReviewStatusFieldUpdateOperationsInput | $Enums.ReviewStatus
    reviewResult?: NullableJsonNullValueInput | InputJsonValue
    repoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    repoSyncData?: NullableJsonNullValueInput | InputJsonValue
    deployUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    topic?: TopicUpdateOneRequiredWithoutProjectsNestedInput
    documents?: DocumentUpdateManyWithoutProjectNestedInput
    graduationDocuments?: GraduationDocumentUpdateManyWithoutProjectNestedInput
    thesisProject?: ThesisProjectUpdateOneWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    topicId?: IntFieldUpdateOperationsInput | number
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    techStack?: NullableStringFieldUpdateOperationsInput | string | null
    documentsRef?: NullableJsonNullValueInput | InputJsonValue
    reviewStatus?: EnumReviewStatusFieldUpdateOperationsInput | $Enums.ReviewStatus
    reviewResult?: NullableJsonNullValueInput | InputJsonValue
    repoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    repoSyncData?: NullableJsonNullValueInput | InputJsonValue
    deployUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    documents?: DocumentUncheckedUpdateManyWithoutProjectNestedInput
    graduationDocuments?: GraduationDocumentUncheckedUpdateManyWithoutProjectNestedInput
    thesisProject?: ThesisProjectUncheckedUpdateOneWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateManyWithoutUserInput = {
    id?: IntFieldUpdateOperationsInput | number
    topicId?: IntFieldUpdateOperationsInput | number
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    techStack?: NullableStringFieldUpdateOperationsInput | string | null
    documentsRef?: NullableJsonNullValueInput | InputJsonValue
    reviewStatus?: EnumReviewStatusFieldUpdateOperationsInput | $Enums.ReviewStatus
    reviewResult?: NullableJsonNullValueInput | InputJsonValue
    repoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    repoSyncData?: NullableJsonNullValueInput | InputJsonValue
    deployUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TopicUpdateWithoutCreatorInput = {
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    background?: NullableStringFieldUpdateOperationsInput | string | null
    objectives?: NullableStringFieldUpdateOperationsInput | string | null
    domain?: EnumDomainFieldUpdateOperationsInput | $Enums.Domain
    platform?: EnumPlatformFieldUpdateOperationsInput | $Enums.Platform
    techStack?: JsonNullValueInput | InputJsonValue
    type?: EnumTopicTypeFieldUpdateOperationsInput | $Enums.TopicType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUpdateManyWithoutTopicNestedInput
  }

  export type TopicUncheckedUpdateWithoutCreatorInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    background?: NullableStringFieldUpdateOperationsInput | string | null
    objectives?: NullableStringFieldUpdateOperationsInput | string | null
    domain?: EnumDomainFieldUpdateOperationsInput | $Enums.Domain
    platform?: EnumPlatformFieldUpdateOperationsInput | $Enums.Platform
    techStack?: JsonNullValueInput | InputJsonValue
    type?: EnumTopicTypeFieldUpdateOperationsInput | $Enums.TopicType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    projects?: ProjectUncheckedUpdateManyWithoutTopicNestedInput
  }

  export type TopicUncheckedUpdateManyWithoutCreatorInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    background?: NullableStringFieldUpdateOperationsInput | string | null
    objectives?: NullableStringFieldUpdateOperationsInput | string | null
    domain?: EnumDomainFieldUpdateOperationsInput | $Enums.Domain
    platform?: EnumPlatformFieldUpdateOperationsInput | $Enums.Platform
    techStack?: JsonNullValueInput | InputJsonValue
    type?: EnumTopicTypeFieldUpdateOperationsInput | $Enums.TopicType
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ThesisTopicUpdateWithoutLockedByInput = {
    title?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    datasetName?: StringFieldUpdateOperationsInput | string
    datasetUrl?: StringFieldUpdateOperationsInput | string
    datasetSize?: StringFieldUpdateOperationsInput | string
    isLocked?: BoolFieldUpdateOperationsInput | boolean
    lockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ThesisProjectUpdateOneWithoutTopicNestedInput
  }

  export type ThesisTopicUncheckedUpdateWithoutLockedByInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    datasetName?: StringFieldUpdateOperationsInput | string
    datasetUrl?: StringFieldUpdateOperationsInput | string
    datasetSize?: StringFieldUpdateOperationsInput | string
    isLocked?: BoolFieldUpdateOperationsInput | boolean
    lockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    project?: ThesisProjectUncheckedUpdateOneWithoutTopicNestedInput
  }

  export type ThesisTopicUncheckedUpdateManyWithoutLockedByInput = {
    id?: IntFieldUpdateOperationsInput | number
    title?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    datasetName?: StringFieldUpdateOperationsInput | string
    datasetUrl?: StringFieldUpdateOperationsInput | string
    datasetSize?: StringFieldUpdateOperationsInput | string
    isLocked?: BoolFieldUpdateOperationsInput | boolean
    lockedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ProjectCreateManyTopicInput = {
    id?: number
    userId: number
    status?: $Enums.ProjectStatus
    techStack?: string | null
    documentsRef?: NullableJsonNullValueInput | InputJsonValue
    reviewStatus?: $Enums.ReviewStatus
    reviewResult?: NullableJsonNullValueInput | InputJsonValue
    repoUrl?: string | null
    repoSyncData?: NullableJsonNullValueInput | InputJsonValue
    deployUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ProjectUpdateWithoutTopicInput = {
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    techStack?: NullableStringFieldUpdateOperationsInput | string | null
    documentsRef?: NullableJsonNullValueInput | InputJsonValue
    reviewStatus?: EnumReviewStatusFieldUpdateOperationsInput | $Enums.ReviewStatus
    reviewResult?: NullableJsonNullValueInput | InputJsonValue
    repoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    repoSyncData?: NullableJsonNullValueInput | InputJsonValue
    deployUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutProjectsNestedInput
    documents?: DocumentUpdateManyWithoutProjectNestedInput
    graduationDocuments?: GraduationDocumentUpdateManyWithoutProjectNestedInput
    thesisProject?: ThesisProjectUpdateOneWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateWithoutTopicInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    techStack?: NullableStringFieldUpdateOperationsInput | string | null
    documentsRef?: NullableJsonNullValueInput | InputJsonValue
    reviewStatus?: EnumReviewStatusFieldUpdateOperationsInput | $Enums.ReviewStatus
    reviewResult?: NullableJsonNullValueInput | InputJsonValue
    repoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    repoSyncData?: NullableJsonNullValueInput | InputJsonValue
    deployUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    documents?: DocumentUncheckedUpdateManyWithoutProjectNestedInput
    graduationDocuments?: GraduationDocumentUncheckedUpdateManyWithoutProjectNestedInput
    thesisProject?: ThesisProjectUncheckedUpdateOneWithoutProjectNestedInput
  }

  export type ProjectUncheckedUpdateManyWithoutTopicInput = {
    id?: IntFieldUpdateOperationsInput | number
    userId?: IntFieldUpdateOperationsInput | number
    status?: EnumProjectStatusFieldUpdateOperationsInput | $Enums.ProjectStatus
    techStack?: NullableStringFieldUpdateOperationsInput | string | null
    documentsRef?: NullableJsonNullValueInput | InputJsonValue
    reviewStatus?: EnumReviewStatusFieldUpdateOperationsInput | $Enums.ReviewStatus
    reviewResult?: NullableJsonNullValueInput | InputJsonValue
    repoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    repoSyncData?: NullableJsonNullValueInput | InputJsonValue
    deployUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentCreateManyProjectInput = {
    id?: number
    docType: $Enums.DocType
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type GraduationDocumentCreateManyProjectInput = {
    id?: number
    docType: $Enums.GraduationDocType
    content: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DocumentUpdateWithoutProjectInput = {
    docType?: EnumDocTypeFieldUpdateOperationsInput | $Enums.DocType
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentUncheckedUpdateWithoutProjectInput = {
    id?: IntFieldUpdateOperationsInput | number
    docType?: EnumDocTypeFieldUpdateOperationsInput | $Enums.DocType
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DocumentUncheckedUpdateManyWithoutProjectInput = {
    id?: IntFieldUpdateOperationsInput | number
    docType?: EnumDocTypeFieldUpdateOperationsInput | $Enums.DocType
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GraduationDocumentUpdateWithoutProjectInput = {
    docType?: EnumGraduationDocTypeFieldUpdateOperationsInput | $Enums.GraduationDocType
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GraduationDocumentUncheckedUpdateWithoutProjectInput = {
    id?: IntFieldUpdateOperationsInput | number
    docType?: EnumGraduationDocTypeFieldUpdateOperationsInput | $Enums.GraduationDocType
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GraduationDocumentUncheckedUpdateManyWithoutProjectInput = {
    id?: IntFieldUpdateOperationsInput | number
    docType?: EnumGraduationDocTypeFieldUpdateOperationsInput | $Enums.GraduationDocType
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}