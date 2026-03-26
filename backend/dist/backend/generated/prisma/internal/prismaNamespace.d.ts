import * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../models";
import { type PrismaClient } from "./class";
export type * from '../models';
export type DMMF = typeof runtime.DMMF;
export type PrismaPromise<T> = runtime.Types.Public.PrismaPromise<T>;
/**
 * Prisma Errors
 */
export declare const PrismaClientKnownRequestError: typeof runtime.PrismaClientKnownRequestError;
export type PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
export declare const PrismaClientUnknownRequestError: typeof runtime.PrismaClientUnknownRequestError;
export type PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
export declare const PrismaClientRustPanicError: typeof runtime.PrismaClientRustPanicError;
export type PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
export declare const PrismaClientInitializationError: typeof runtime.PrismaClientInitializationError;
export type PrismaClientInitializationError = runtime.PrismaClientInitializationError;
export declare const PrismaClientValidationError: typeof runtime.PrismaClientValidationError;
export type PrismaClientValidationError = runtime.PrismaClientValidationError;
/**
 * Re-export of sql-template-tag
 */
export declare const sql: typeof runtime.sqltag;
export declare const empty: runtime.Sql;
export declare const join: typeof runtime.join;
export declare const raw: typeof runtime.raw;
export declare const Sql: typeof runtime.Sql;
export type Sql = runtime.Sql;
/**
 * Decimal.js
 */
export declare const Decimal: typeof runtime.Decimal;
export type Decimal = runtime.Decimal;
export type DecimalJsLike = runtime.DecimalJsLike;
/**
* Extensions
*/
export type Extension = runtime.Types.Extensions.UserArgs;
export declare const getExtensionContext: typeof runtime.Extensions.getExtensionContext;
export type Args<T, F extends runtime.Operation> = runtime.Types.Public.Args<T, F>;
export type Payload<T, F extends runtime.Operation = never> = runtime.Types.Public.Payload<T, F>;
export type Result<T, A, F extends runtime.Operation> = runtime.Types.Public.Result<T, A, F>;
export type Exact<A, W> = runtime.Types.Public.Exact<A, W>;
export type PrismaVersion = {
    client: string;
    engine: string;
};
/**
 * Prisma Client JS version: 7.4.0
 * Query Engine version: ab56fe763f921d033a6c195e7ddeb3e255bdbb57
 */
export declare const prismaVersion: PrismaVersion;
/**
 * Utility Types
 */
export type Bytes = runtime.Bytes;
export type JsonObject = runtime.JsonObject;
export type JsonArray = runtime.JsonArray;
export type JsonValue = runtime.JsonValue;
export type InputJsonObject = runtime.InputJsonObject;
export type InputJsonArray = runtime.InputJsonArray;
export type InputJsonValue = runtime.InputJsonValue;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
/**
 * Helper for filtering JSON entries that have `null` on the database (empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const DbNull: runtime.DbNullClass;
/**
 * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const JsonNull: runtime.JsonNullClass;
/**
 * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const AnyNull: runtime.AnyNullClass;
type SelectAndInclude = {
    select: any;
    include: any;
};
type SelectAndOmit = {
    select: any;
    omit: any;
};
/**
 * From T, pick a set of properties whose keys are in the union K
 */
type Prisma__Pick<T, K extends keyof T> = {
    [P in K]: T[P];
};
export type Enumerable<T> = T | Array<T>;
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
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & (T extends SelectAndInclude ? 'Please either choose `select` or `include`.' : T extends SelectAndOmit ? 'Please either choose `select` or `omit`.' : {});
/**
 * Subset + Intersection
 * @desc From `T` pick properties that exist in `U` and intersect `K`
 */
export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
} & K;
type Without<T, U> = {
    [P in Exclude<keyof T, keyof U>]?: never;
};
/**
 * XOR is needed to have a real mutually exclusive union type
 * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
 */
export type XOR<T, U> = T extends object ? U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : U : T;
/**
 * Is T a Record?
 */
type IsObject<T extends any> = T extends Array<any> ? False : T extends Date ? False : T extends Uint8Array ? False : T extends BigInt ? False : T extends object ? True : False;
/**
 * If it's T[], return T
 */
export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T;
/**
 * From ts-toolbelt
 */
type __Either<O extends object, K extends Key> = Omit<O, K> & {
    [P in K]: Prisma__Pick<O, P & keyof O>;
}[K];
type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>;
type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>;
type _Either<O extends object, K extends Key, strict extends Boolean> = {
    1: EitherStrict<O, K>;
    0: EitherLoose<O, K>;
}[strict];
export type Either<O extends object, K extends Key, strict extends Boolean = 1> = O extends unknown ? _Either<O, K, strict> : never;
export type Union = any;
export type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K];
} & {};
/** Helper Types for "Merge" **/
export type IntersectOf<U extends Union> = (U extends unknown ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
export type Overwrite<O extends object, O1 extends object> = {
    [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
} & {};
type _Merge<U extends object> = IntersectOf<Overwrite<U, {
    [K in keyof U]-?: At<U, K>;
}>>;
type Key = string | number | symbol;
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
type NoExpand<T> = T extends unknown ? T : never;
export type AtLeast<O extends object, K extends string> = NoExpand<O extends unknown ? (K extends keyof O ? {
    [P in K]: O[P];
} & O : O) | {
    [P in keyof O as P extends K ? P : never]-?: O[P];
} & O : never>;
type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;
export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
/** End Helper Types for "Merge" **/
export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;
export type Boolean = True | False;
export type True = 1;
export type False = 0;
export type Not<B extends Boolean> = {
    0: 1;
    1: 0;
}[B];
export type Extends<A1 extends any, A2 extends any> = [A1] extends [never] ? 0 : A1 extends A2 ? 1 : 0;
export type Has<U extends Union, U1 extends Union> = Not<Extends<Exclude<U1, U>, U1>>;
export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
        0: 0;
        1: 1;
    };
    1: {
        0: 1;
        1: 1;
    };
}[B1][B2];
export type Keys<U extends Union> = U extends unknown ? keyof U : never;
export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O ? O[P] : never;
} : never;
type FieldPaths<T, U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>> = IsObject<T> extends True ? U : T;
export type GetHavingFields<T> = {
    [K in keyof T]: Or<Or<Extends<'OR', K>, Extends<'AND', K>>, Extends<'NOT', K>> extends True ? T[K] extends infer TK ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never> : never : {} extends FieldPaths<T[K]> ? never : K;
}[keyof T];
/**
 * Convert tuple to union
 */
type _TupleToUnion<T> = T extends (infer E)[] ? E : never;
type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>;
export type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T;
/**
 * Like `Pick`, but additionally can also accept an array of keys
 */
export type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>;
/**
 * Exclude all keys with underscores
 */
export type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T;
export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>;
type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>;
export declare const ModelName: {
    readonly Institution: "Institution";
    readonly User: "User";
    readonly RubricVersion: "RubricVersion";
    readonly Scale: "Scale";
    readonly ScaleVersion: "ScaleVersion";
    readonly ScaleVersionBin: "ScaleVersionBin";
    readonly UserRubricAssignment: "UserRubricAssignment";
    readonly Rubric: "Rubric";
    readonly Response: "Response";
    readonly PredefinedCourseBin: "PredefinedCourseBin";
    readonly CourseBin: "CourseBin";
    readonly Course: "Course";
    readonly ScaleBin: "ScaleBin";
    readonly UserCourseBin: "UserCourseBin";
    readonly Invitation: "Invitation";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export interface TypeMapCb<GlobalOmitOptions = {}> extends runtime.Types.Utils.Fn<{
    extArgs: runtime.Types.Extensions.InternalArgs;
}, runtime.Types.Utils.Record<string, any>> {
    returns: TypeMap<this['params']['extArgs'], GlobalOmitOptions>;
}
export type TypeMap<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
        omit: GlobalOmitOptions;
    };
    meta: {
        modelProps: "institution" | "user" | "rubricVersion" | "scale" | "scaleVersion" | "scaleVersionBin" | "userRubricAssignment" | "rubric" | "response" | "predefinedCourseBin" | "courseBin" | "course" | "scaleBin" | "userCourseBin" | "invitation";
        txIsolationLevel: TransactionIsolationLevel;
    };
    model: {
        Institution: {
            payload: Prisma.$InstitutionPayload<ExtArgs>;
            fields: Prisma.InstitutionFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.InstitutionFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InstitutionPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.InstitutionFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InstitutionPayload>;
                };
                findFirst: {
                    args: Prisma.InstitutionFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InstitutionPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.InstitutionFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InstitutionPayload>;
                };
                findMany: {
                    args: Prisma.InstitutionFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InstitutionPayload>[];
                };
                create: {
                    args: Prisma.InstitutionCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InstitutionPayload>;
                };
                createMany: {
                    args: Prisma.InstitutionCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.InstitutionCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InstitutionPayload>[];
                };
                delete: {
                    args: Prisma.InstitutionDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InstitutionPayload>;
                };
                update: {
                    args: Prisma.InstitutionUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InstitutionPayload>;
                };
                deleteMany: {
                    args: Prisma.InstitutionDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.InstitutionUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.InstitutionUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InstitutionPayload>[];
                };
                upsert: {
                    args: Prisma.InstitutionUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InstitutionPayload>;
                };
                aggregate: {
                    args: Prisma.InstitutionAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateInstitution>;
                };
                groupBy: {
                    args: Prisma.InstitutionGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.InstitutionGroupByOutputType>[];
                };
                count: {
                    args: Prisma.InstitutionCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.InstitutionCountAggregateOutputType> | number;
                };
            };
        };
        User: {
            payload: Prisma.$UserPayload<ExtArgs>;
            fields: Prisma.UserFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.UserFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                findFirst: {
                    args: Prisma.UserFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                findMany: {
                    args: Prisma.UserFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                create: {
                    args: Prisma.UserCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                createMany: {
                    args: Prisma.UserCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                delete: {
                    args: Prisma.UserDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                update: {
                    args: Prisma.UserUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                deleteMany: {
                    args: Prisma.UserDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.UserUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>[];
                };
                upsert: {
                    args: Prisma.UserUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserPayload>;
                };
                aggregate: {
                    args: Prisma.UserAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateUser>;
                };
                groupBy: {
                    args: Prisma.UserGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserGroupByOutputType>[];
                };
                count: {
                    args: Prisma.UserCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserCountAggregateOutputType> | number;
                };
            };
        };
        RubricVersion: {
            payload: Prisma.$RubricVersionPayload<ExtArgs>;
            fields: Prisma.RubricVersionFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.RubricVersionFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RubricVersionPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.RubricVersionFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RubricVersionPayload>;
                };
                findFirst: {
                    args: Prisma.RubricVersionFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RubricVersionPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.RubricVersionFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RubricVersionPayload>;
                };
                findMany: {
                    args: Prisma.RubricVersionFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RubricVersionPayload>[];
                };
                create: {
                    args: Prisma.RubricVersionCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RubricVersionPayload>;
                };
                createMany: {
                    args: Prisma.RubricVersionCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.RubricVersionCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RubricVersionPayload>[];
                };
                delete: {
                    args: Prisma.RubricVersionDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RubricVersionPayload>;
                };
                update: {
                    args: Prisma.RubricVersionUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RubricVersionPayload>;
                };
                deleteMany: {
                    args: Prisma.RubricVersionDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.RubricVersionUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.RubricVersionUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RubricVersionPayload>[];
                };
                upsert: {
                    args: Prisma.RubricVersionUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RubricVersionPayload>;
                };
                aggregate: {
                    args: Prisma.RubricVersionAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateRubricVersion>;
                };
                groupBy: {
                    args: Prisma.RubricVersionGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RubricVersionGroupByOutputType>[];
                };
                count: {
                    args: Prisma.RubricVersionCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RubricVersionCountAggregateOutputType> | number;
                };
            };
        };
        Scale: {
            payload: Prisma.$ScalePayload<ExtArgs>;
            fields: Prisma.ScaleFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ScaleFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ScalePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ScaleFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ScalePayload>;
                };
                findFirst: {
                    args: Prisma.ScaleFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ScalePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ScaleFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ScalePayload>;
                };
                findMany: {
                    args: Prisma.ScaleFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ScalePayload>[];
                };
                create: {
                    args: Prisma.ScaleCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ScalePayload>;
                };
                createMany: {
                    args: Prisma.ScaleCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ScaleCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ScalePayload>[];
                };
                delete: {
                    args: Prisma.ScaleDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ScalePayload>;
                };
                update: {
                    args: Prisma.ScaleUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ScalePayload>;
                };
                deleteMany: {
                    args: Prisma.ScaleDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ScaleUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ScaleUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ScalePayload>[];
                };
                upsert: {
                    args: Prisma.ScaleUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ScalePayload>;
                };
                aggregate: {
                    args: Prisma.ScaleAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateScale>;
                };
                groupBy: {
                    args: Prisma.ScaleGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ScaleGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ScaleCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ScaleCountAggregateOutputType> | number;
                };
            };
        };
        ScaleVersion: {
            payload: Prisma.$ScaleVersionPayload<ExtArgs>;
            fields: Prisma.ScaleVersionFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ScaleVersionFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ScaleVersionPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ScaleVersionFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ScaleVersionPayload>;
                };
                findFirst: {
                    args: Prisma.ScaleVersionFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ScaleVersionPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ScaleVersionFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ScaleVersionPayload>;
                };
                findMany: {
                    args: Prisma.ScaleVersionFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ScaleVersionPayload>[];
                };
                create: {
                    args: Prisma.ScaleVersionCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ScaleVersionPayload>;
                };
                createMany: {
                    args: Prisma.ScaleVersionCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ScaleVersionCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ScaleVersionPayload>[];
                };
                delete: {
                    args: Prisma.ScaleVersionDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ScaleVersionPayload>;
                };
                update: {
                    args: Prisma.ScaleVersionUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ScaleVersionPayload>;
                };
                deleteMany: {
                    args: Prisma.ScaleVersionDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ScaleVersionUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ScaleVersionUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ScaleVersionPayload>[];
                };
                upsert: {
                    args: Prisma.ScaleVersionUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ScaleVersionPayload>;
                };
                aggregate: {
                    args: Prisma.ScaleVersionAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateScaleVersion>;
                };
                groupBy: {
                    args: Prisma.ScaleVersionGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ScaleVersionGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ScaleVersionCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ScaleVersionCountAggregateOutputType> | number;
                };
            };
        };
        ScaleVersionBin: {
            payload: Prisma.$ScaleVersionBinPayload<ExtArgs>;
            fields: Prisma.ScaleVersionBinFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ScaleVersionBinFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ScaleVersionBinPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ScaleVersionBinFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ScaleVersionBinPayload>;
                };
                findFirst: {
                    args: Prisma.ScaleVersionBinFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ScaleVersionBinPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ScaleVersionBinFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ScaleVersionBinPayload>;
                };
                findMany: {
                    args: Prisma.ScaleVersionBinFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ScaleVersionBinPayload>[];
                };
                create: {
                    args: Prisma.ScaleVersionBinCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ScaleVersionBinPayload>;
                };
                createMany: {
                    args: Prisma.ScaleVersionBinCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ScaleVersionBinCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ScaleVersionBinPayload>[];
                };
                delete: {
                    args: Prisma.ScaleVersionBinDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ScaleVersionBinPayload>;
                };
                update: {
                    args: Prisma.ScaleVersionBinUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ScaleVersionBinPayload>;
                };
                deleteMany: {
                    args: Prisma.ScaleVersionBinDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ScaleVersionBinUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ScaleVersionBinUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ScaleVersionBinPayload>[];
                };
                upsert: {
                    args: Prisma.ScaleVersionBinUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ScaleVersionBinPayload>;
                };
                aggregate: {
                    args: Prisma.ScaleVersionBinAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateScaleVersionBin>;
                };
                groupBy: {
                    args: Prisma.ScaleVersionBinGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ScaleVersionBinGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ScaleVersionBinCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ScaleVersionBinCountAggregateOutputType> | number;
                };
            };
        };
        UserRubricAssignment: {
            payload: Prisma.$UserRubricAssignmentPayload<ExtArgs>;
            fields: Prisma.UserRubricAssignmentFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.UserRubricAssignmentFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserRubricAssignmentPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.UserRubricAssignmentFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserRubricAssignmentPayload>;
                };
                findFirst: {
                    args: Prisma.UserRubricAssignmentFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserRubricAssignmentPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.UserRubricAssignmentFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserRubricAssignmentPayload>;
                };
                findMany: {
                    args: Prisma.UserRubricAssignmentFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserRubricAssignmentPayload>[];
                };
                create: {
                    args: Prisma.UserRubricAssignmentCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserRubricAssignmentPayload>;
                };
                createMany: {
                    args: Prisma.UserRubricAssignmentCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.UserRubricAssignmentCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserRubricAssignmentPayload>[];
                };
                delete: {
                    args: Prisma.UserRubricAssignmentDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserRubricAssignmentPayload>;
                };
                update: {
                    args: Prisma.UserRubricAssignmentUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserRubricAssignmentPayload>;
                };
                deleteMany: {
                    args: Prisma.UserRubricAssignmentDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.UserRubricAssignmentUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.UserRubricAssignmentUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserRubricAssignmentPayload>[];
                };
                upsert: {
                    args: Prisma.UserRubricAssignmentUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserRubricAssignmentPayload>;
                };
                aggregate: {
                    args: Prisma.UserRubricAssignmentAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateUserRubricAssignment>;
                };
                groupBy: {
                    args: Prisma.UserRubricAssignmentGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserRubricAssignmentGroupByOutputType>[];
                };
                count: {
                    args: Prisma.UserRubricAssignmentCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserRubricAssignmentCountAggregateOutputType> | number;
                };
            };
        };
        Rubric: {
            payload: Prisma.$RubricPayload<ExtArgs>;
            fields: Prisma.RubricFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.RubricFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RubricPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.RubricFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RubricPayload>;
                };
                findFirst: {
                    args: Prisma.RubricFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RubricPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.RubricFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RubricPayload>;
                };
                findMany: {
                    args: Prisma.RubricFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RubricPayload>[];
                };
                create: {
                    args: Prisma.RubricCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RubricPayload>;
                };
                createMany: {
                    args: Prisma.RubricCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.RubricCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RubricPayload>[];
                };
                delete: {
                    args: Prisma.RubricDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RubricPayload>;
                };
                update: {
                    args: Prisma.RubricUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RubricPayload>;
                };
                deleteMany: {
                    args: Prisma.RubricDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.RubricUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.RubricUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RubricPayload>[];
                };
                upsert: {
                    args: Prisma.RubricUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$RubricPayload>;
                };
                aggregate: {
                    args: Prisma.RubricAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateRubric>;
                };
                groupBy: {
                    args: Prisma.RubricGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RubricGroupByOutputType>[];
                };
                count: {
                    args: Prisma.RubricCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.RubricCountAggregateOutputType> | number;
                };
            };
        };
        Response: {
            payload: Prisma.$ResponsePayload<ExtArgs>;
            fields: Prisma.ResponseFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ResponseFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ResponsePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ResponseFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ResponsePayload>;
                };
                findFirst: {
                    args: Prisma.ResponseFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ResponsePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ResponseFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ResponsePayload>;
                };
                findMany: {
                    args: Prisma.ResponseFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ResponsePayload>[];
                };
                create: {
                    args: Prisma.ResponseCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ResponsePayload>;
                };
                createMany: {
                    args: Prisma.ResponseCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ResponseCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ResponsePayload>[];
                };
                delete: {
                    args: Prisma.ResponseDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ResponsePayload>;
                };
                update: {
                    args: Prisma.ResponseUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ResponsePayload>;
                };
                deleteMany: {
                    args: Prisma.ResponseDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ResponseUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ResponseUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ResponsePayload>[];
                };
                upsert: {
                    args: Prisma.ResponseUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ResponsePayload>;
                };
                aggregate: {
                    args: Prisma.ResponseAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateResponse>;
                };
                groupBy: {
                    args: Prisma.ResponseGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ResponseGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ResponseCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ResponseCountAggregateOutputType> | number;
                };
            };
        };
        PredefinedCourseBin: {
            payload: Prisma.$PredefinedCourseBinPayload<ExtArgs>;
            fields: Prisma.PredefinedCourseBinFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.PredefinedCourseBinFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PredefinedCourseBinPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.PredefinedCourseBinFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PredefinedCourseBinPayload>;
                };
                findFirst: {
                    args: Prisma.PredefinedCourseBinFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PredefinedCourseBinPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.PredefinedCourseBinFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PredefinedCourseBinPayload>;
                };
                findMany: {
                    args: Prisma.PredefinedCourseBinFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PredefinedCourseBinPayload>[];
                };
                create: {
                    args: Prisma.PredefinedCourseBinCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PredefinedCourseBinPayload>;
                };
                createMany: {
                    args: Prisma.PredefinedCourseBinCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.PredefinedCourseBinCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PredefinedCourseBinPayload>[];
                };
                delete: {
                    args: Prisma.PredefinedCourseBinDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PredefinedCourseBinPayload>;
                };
                update: {
                    args: Prisma.PredefinedCourseBinUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PredefinedCourseBinPayload>;
                };
                deleteMany: {
                    args: Prisma.PredefinedCourseBinDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.PredefinedCourseBinUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.PredefinedCourseBinUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PredefinedCourseBinPayload>[];
                };
                upsert: {
                    args: Prisma.PredefinedCourseBinUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$PredefinedCourseBinPayload>;
                };
                aggregate: {
                    args: Prisma.PredefinedCourseBinAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregatePredefinedCourseBin>;
                };
                groupBy: {
                    args: Prisma.PredefinedCourseBinGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PredefinedCourseBinGroupByOutputType>[];
                };
                count: {
                    args: Prisma.PredefinedCourseBinCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.PredefinedCourseBinCountAggregateOutputType> | number;
                };
            };
        };
        CourseBin: {
            payload: Prisma.$CourseBinPayload<ExtArgs>;
            fields: Prisma.CourseBinFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.CourseBinFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourseBinPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.CourseBinFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourseBinPayload>;
                };
                findFirst: {
                    args: Prisma.CourseBinFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourseBinPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.CourseBinFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourseBinPayload>;
                };
                findMany: {
                    args: Prisma.CourseBinFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourseBinPayload>[];
                };
                create: {
                    args: Prisma.CourseBinCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourseBinPayload>;
                };
                createMany: {
                    args: Prisma.CourseBinCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.CourseBinCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourseBinPayload>[];
                };
                delete: {
                    args: Prisma.CourseBinDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourseBinPayload>;
                };
                update: {
                    args: Prisma.CourseBinUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourseBinPayload>;
                };
                deleteMany: {
                    args: Prisma.CourseBinDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.CourseBinUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.CourseBinUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourseBinPayload>[];
                };
                upsert: {
                    args: Prisma.CourseBinUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CourseBinPayload>;
                };
                aggregate: {
                    args: Prisma.CourseBinAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateCourseBin>;
                };
                groupBy: {
                    args: Prisma.CourseBinGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CourseBinGroupByOutputType>[];
                };
                count: {
                    args: Prisma.CourseBinCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CourseBinCountAggregateOutputType> | number;
                };
            };
        };
        Course: {
            payload: Prisma.$CoursePayload<ExtArgs>;
            fields: Prisma.CourseFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.CourseFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CoursePayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.CourseFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CoursePayload>;
                };
                findFirst: {
                    args: Prisma.CourseFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CoursePayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.CourseFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CoursePayload>;
                };
                findMany: {
                    args: Prisma.CourseFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CoursePayload>[];
                };
                create: {
                    args: Prisma.CourseCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CoursePayload>;
                };
                createMany: {
                    args: Prisma.CourseCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.CourseCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CoursePayload>[];
                };
                delete: {
                    args: Prisma.CourseDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CoursePayload>;
                };
                update: {
                    args: Prisma.CourseUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CoursePayload>;
                };
                deleteMany: {
                    args: Prisma.CourseDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.CourseUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.CourseUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CoursePayload>[];
                };
                upsert: {
                    args: Prisma.CourseUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$CoursePayload>;
                };
                aggregate: {
                    args: Prisma.CourseAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateCourse>;
                };
                groupBy: {
                    args: Prisma.CourseGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CourseGroupByOutputType>[];
                };
                count: {
                    args: Prisma.CourseCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.CourseCountAggregateOutputType> | number;
                };
            };
        };
        ScaleBin: {
            payload: Prisma.$ScaleBinPayload<ExtArgs>;
            fields: Prisma.ScaleBinFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.ScaleBinFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ScaleBinPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.ScaleBinFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ScaleBinPayload>;
                };
                findFirst: {
                    args: Prisma.ScaleBinFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ScaleBinPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.ScaleBinFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ScaleBinPayload>;
                };
                findMany: {
                    args: Prisma.ScaleBinFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ScaleBinPayload>[];
                };
                create: {
                    args: Prisma.ScaleBinCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ScaleBinPayload>;
                };
                createMany: {
                    args: Prisma.ScaleBinCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.ScaleBinCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ScaleBinPayload>[];
                };
                delete: {
                    args: Prisma.ScaleBinDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ScaleBinPayload>;
                };
                update: {
                    args: Prisma.ScaleBinUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ScaleBinPayload>;
                };
                deleteMany: {
                    args: Prisma.ScaleBinDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.ScaleBinUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.ScaleBinUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ScaleBinPayload>[];
                };
                upsert: {
                    args: Prisma.ScaleBinUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$ScaleBinPayload>;
                };
                aggregate: {
                    args: Prisma.ScaleBinAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateScaleBin>;
                };
                groupBy: {
                    args: Prisma.ScaleBinGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ScaleBinGroupByOutputType>[];
                };
                count: {
                    args: Prisma.ScaleBinCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.ScaleBinCountAggregateOutputType> | number;
                };
            };
        };
        UserCourseBin: {
            payload: Prisma.$UserCourseBinPayload<ExtArgs>;
            fields: Prisma.UserCourseBinFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.UserCourseBinFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserCourseBinPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.UserCourseBinFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserCourseBinPayload>;
                };
                findFirst: {
                    args: Prisma.UserCourseBinFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserCourseBinPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.UserCourseBinFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserCourseBinPayload>;
                };
                findMany: {
                    args: Prisma.UserCourseBinFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserCourseBinPayload>[];
                };
                create: {
                    args: Prisma.UserCourseBinCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserCourseBinPayload>;
                };
                createMany: {
                    args: Prisma.UserCourseBinCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.UserCourseBinCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserCourseBinPayload>[];
                };
                delete: {
                    args: Prisma.UserCourseBinDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserCourseBinPayload>;
                };
                update: {
                    args: Prisma.UserCourseBinUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserCourseBinPayload>;
                };
                deleteMany: {
                    args: Prisma.UserCourseBinDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.UserCourseBinUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.UserCourseBinUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserCourseBinPayload>[];
                };
                upsert: {
                    args: Prisma.UserCourseBinUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$UserCourseBinPayload>;
                };
                aggregate: {
                    args: Prisma.UserCourseBinAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateUserCourseBin>;
                };
                groupBy: {
                    args: Prisma.UserCourseBinGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserCourseBinGroupByOutputType>[];
                };
                count: {
                    args: Prisma.UserCourseBinCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.UserCourseBinCountAggregateOutputType> | number;
                };
            };
        };
        Invitation: {
            payload: Prisma.$InvitationPayload<ExtArgs>;
            fields: Prisma.InvitationFieldRefs;
            operations: {
                findUnique: {
                    args: Prisma.InvitationFindUniqueArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InvitationPayload> | null;
                };
                findUniqueOrThrow: {
                    args: Prisma.InvitationFindUniqueOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InvitationPayload>;
                };
                findFirst: {
                    args: Prisma.InvitationFindFirstArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InvitationPayload> | null;
                };
                findFirstOrThrow: {
                    args: Prisma.InvitationFindFirstOrThrowArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InvitationPayload>;
                };
                findMany: {
                    args: Prisma.InvitationFindManyArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InvitationPayload>[];
                };
                create: {
                    args: Prisma.InvitationCreateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InvitationPayload>;
                };
                createMany: {
                    args: Prisma.InvitationCreateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                createManyAndReturn: {
                    args: Prisma.InvitationCreateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InvitationPayload>[];
                };
                delete: {
                    args: Prisma.InvitationDeleteArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InvitationPayload>;
                };
                update: {
                    args: Prisma.InvitationUpdateArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InvitationPayload>;
                };
                deleteMany: {
                    args: Prisma.InvitationDeleteManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateMany: {
                    args: Prisma.InvitationUpdateManyArgs<ExtArgs>;
                    result: BatchPayload;
                };
                updateManyAndReturn: {
                    args: Prisma.InvitationUpdateManyAndReturnArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InvitationPayload>[];
                };
                upsert: {
                    args: Prisma.InvitationUpsertArgs<ExtArgs>;
                    result: runtime.Types.Utils.PayloadToResult<Prisma.$InvitationPayload>;
                };
                aggregate: {
                    args: Prisma.InvitationAggregateArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.AggregateInvitation>;
                };
                groupBy: {
                    args: Prisma.InvitationGroupByArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.InvitationGroupByOutputType>[];
                };
                count: {
                    args: Prisma.InvitationCountArgs<ExtArgs>;
                    result: runtime.Types.Utils.Optional<Prisma.InvitationCountAggregateOutputType> | number;
                };
            };
        };
    };
} & {
    other: {
        payload: any;
        operations: {
            $executeRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $executeRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
            $queryRaw: {
                args: [query: TemplateStringsArray | Sql, ...values: any[]];
                result: any;
            };
            $queryRawUnsafe: {
                args: [query: string, ...values: any[]];
                result: any;
            };
        };
    };
};
/**
 * Enums
 */
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const InstitutionScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly createdAt: "createdAt";
};
export type InstitutionScalarFieldEnum = (typeof InstitutionScalarFieldEnum)[keyof typeof InstitutionScalarFieldEnum];
export declare const UserScalarFieldEnum: {
    readonly id: "id";
    readonly googleId: "googleId";
    readonly name: "name";
    readonly email: "email";
    readonly avatarUrl: "avatarUrl";
    readonly role: "role";
    readonly institutionId: "institutionId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const RubricVersionScalarFieldEnum: {
    readonly id: "id";
    readonly rubricId: "rubricId";
    readonly versionNum: "versionNum";
    readonly changelog: "changelog";
    readonly publishedAt: "publishedAt";
};
export type RubricVersionScalarFieldEnum = (typeof RubricVersionScalarFieldEnum)[keyof typeof RubricVersionScalarFieldEnum];
export declare const ScaleScalarFieldEnum: {
    readonly id: "id";
    readonly rubricId: "rubricId";
    readonly prompt: "prompt";
    readonly orderIndex: "orderIndex";
    readonly editable: "editable";
    readonly isGlobal: "isGlobal";
    readonly levelDescriptions: "levelDescriptions";
    readonly section: "section";
};
export type ScaleScalarFieldEnum = (typeof ScaleScalarFieldEnum)[keyof typeof ScaleScalarFieldEnum];
export declare const ScaleVersionScalarFieldEnum: {
    readonly id: "id";
    readonly rubricVersionId: "rubricVersionId";
    readonly originalScaleId: "originalScaleId";
    readonly prompt: "prompt";
    readonly orderIndex: "orderIndex";
    readonly isGlobal: "isGlobal";
    readonly editable: "editable";
    readonly levelDescriptions: "levelDescriptions";
    readonly section: "section";
};
export type ScaleVersionScalarFieldEnum = (typeof ScaleVersionScalarFieldEnum)[keyof typeof ScaleVersionScalarFieldEnum];
export declare const ScaleVersionBinScalarFieldEnum: {
    readonly scaleVersionId: "scaleVersionId";
    readonly predefinedBinId: "predefinedBinId";
};
export type ScaleVersionBinScalarFieldEnum = (typeof ScaleVersionBinScalarFieldEnum)[keyof typeof ScaleVersionBinScalarFieldEnum];
export declare const UserRubricAssignmentScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly rubricVersionId: "rubricVersionId";
    readonly status: "status";
    readonly assignedAt: "assignedAt";
    readonly startedAt: "startedAt";
    readonly completedAt: "completedAt";
};
export type UserRubricAssignmentScalarFieldEnum = (typeof UserRubricAssignmentScalarFieldEnum)[keyof typeof UserRubricAssignmentScalarFieldEnum];
export declare const RubricScalarFieldEnum: {
    readonly id: "id";
    readonly title: "title";
    readonly description: "description";
    readonly active: "active";
};
export type RubricScalarFieldEnum = (typeof RubricScalarFieldEnum)[keyof typeof RubricScalarFieldEnum];
export declare const ResponseScalarFieldEnum: {
    readonly id: "id";
    readonly userId: "userId";
    readonly scaleVersionId: "scaleVersionId";
    readonly rubricVersionId: "rubricVersionId";
    readonly courseId: "courseId";
    readonly score: "score";
    readonly submittedAt: "submittedAt";
    readonly scaleId: "scaleId";
};
export type ResponseScalarFieldEnum = (typeof ResponseScalarFieldEnum)[keyof typeof ResponseScalarFieldEnum];
export declare const PredefinedCourseBinScalarFieldEnum: {
    readonly id: "id";
    readonly binName: "binName";
};
export type PredefinedCourseBinScalarFieldEnum = (typeof PredefinedCourseBinScalarFieldEnum)[keyof typeof PredefinedCourseBinScalarFieldEnum];
export declare const CourseBinScalarFieldEnum: {
    readonly id: "id";
    readonly institutionId: "institutionId";
    readonly predefinedBinId: "predefinedBinId";
    readonly displayName: "displayName";
};
export type CourseBinScalarFieldEnum = (typeof CourseBinScalarFieldEnum)[keyof typeof CourseBinScalarFieldEnum];
export declare const CourseScalarFieldEnum: {
    readonly id: "id";
    readonly courseBinId: "courseBinId";
    readonly courseNumber: "courseNumber";
    readonly courseName: "courseName";
};
export type CourseScalarFieldEnum = (typeof CourseScalarFieldEnum)[keyof typeof CourseScalarFieldEnum];
export declare const ScaleBinScalarFieldEnum: {
    readonly scaleId: "scaleId";
    readonly predefinedBinId: "predefinedBinId";
};
export type ScaleBinScalarFieldEnum = (typeof ScaleBinScalarFieldEnum)[keyof typeof ScaleBinScalarFieldEnum];
export declare const UserCourseBinScalarFieldEnum: {
    readonly userId: "userId";
    readonly courseBinId: "courseBinId";
};
export type UserCourseBinScalarFieldEnum = (typeof UserCourseBinScalarFieldEnum)[keyof typeof UserCourseBinScalarFieldEnum];
export declare const InvitationScalarFieldEnum: {
    readonly id: "id";
    readonly email: "email";
    readonly institutionId: "institutionId";
    readonly role: "role";
    readonly token: "token";
    readonly invitedById: "invitedById";
    readonly acceptedAt: "acceptedAt";
    readonly expiresAt: "expiresAt";
    readonly createdAt: "createdAt";
};
export type InvitationScalarFieldEnum = (typeof InvitationScalarFieldEnum)[keyof typeof InvitationScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const NullableJsonNullValueInput: {
    readonly DbNull: runtime.DbNullClass;
    readonly JsonNull: runtime.JsonNullClass;
};
export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
export declare const JsonNullValueFilter: {
    readonly DbNull: runtime.DbNullClass;
    readonly JsonNull: runtime.JsonNullClass;
    readonly AnyNull: runtime.AnyNullClass;
};
export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter];
/**
 * Field references
 */
/**
 * Reference to a field of type 'String'
 */
export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>;
/**
 * Reference to a field of type 'String[]'
 */
export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>;
/**
 * Reference to a field of type 'DateTime'
 */
export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>;
/**
 * Reference to a field of type 'DateTime[]'
 */
export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>;
/**
 * Reference to a field of type 'UserRole'
 */
export type EnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole'>;
/**
 * Reference to a field of type 'UserRole[]'
 */
export type ListEnumUserRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'UserRole[]'>;
/**
 * Reference to a field of type 'Int'
 */
export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>;
/**
 * Reference to a field of type 'Int[]'
 */
export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>;
/**
 * Reference to a field of type 'Boolean'
 */
export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>;
/**
 * Reference to a field of type 'Json'
 */
export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>;
/**
 * Reference to a field of type 'QueryMode'
 */
export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>;
/**
 * Reference to a field of type 'AssignmentStatus'
 */
export type EnumAssignmentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AssignmentStatus'>;
/**
 * Reference to a field of type 'AssignmentStatus[]'
 */
export type ListEnumAssignmentStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'AssignmentStatus[]'>;
/**
 * Reference to a field of type 'Float'
 */
export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>;
/**
 * Reference to a field of type 'Float[]'
 */
export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>;
/**
 * Batch Payload for updateMany & deleteMany & createMany
 */
export type BatchPayload = {
    count: number;
};
export declare const defineExtension: runtime.Types.Extensions.ExtendsHook<"define", TypeMapCb, runtime.Types.Extensions.DefaultArgs>;
export type DefaultPrismaClient = PrismaClient;
export type ErrorFormat = 'pretty' | 'colorless' | 'minimal';
export type PrismaClientOptions = ({
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-pg`.
     */
    adapter: runtime.SqlDriverAdapterFactory;
    accelerateUrl?: never;
} | {
    /**
     * Prisma Accelerate URL allowing the client to connect through Accelerate instead of a direct database.
     */
    accelerateUrl: string;
    adapter?: never;
}) & {
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat;
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
     * Read more in our [docs](https://pris.ly/d/logging).
     */
    log?: (LogLevel | LogDefinition)[];
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: TransactionIsolationLevel;
    };
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
    omit?: GlobalOmitConfig;
    /**
     * SQL commenter plugins that add metadata to SQL queries as comments.
     * Comments follow the sqlcommenter format: https://google.github.io/sqlcommenter/
     *
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   adapter,
     *   comments: [
     *     traceContext(),
     *     queryInsights(),
     *   ],
     * })
     * ```
     */
    comments?: runtime.SqlCommenterPlugin[];
};
export type GlobalOmitConfig = {
    institution?: Prisma.InstitutionOmit;
    user?: Prisma.UserOmit;
    rubricVersion?: Prisma.RubricVersionOmit;
    scale?: Prisma.ScaleOmit;
    scaleVersion?: Prisma.ScaleVersionOmit;
    scaleVersionBin?: Prisma.ScaleVersionBinOmit;
    userRubricAssignment?: Prisma.UserRubricAssignmentOmit;
    rubric?: Prisma.RubricOmit;
    response?: Prisma.ResponseOmit;
    predefinedCourseBin?: Prisma.PredefinedCourseBinOmit;
    courseBin?: Prisma.CourseBinOmit;
    course?: Prisma.CourseOmit;
    scaleBin?: Prisma.ScaleBinOmit;
    userCourseBin?: Prisma.UserCourseBinOmit;
    invitation?: Prisma.InvitationOmit;
};
export type LogLevel = 'info' | 'query' | 'warn' | 'error';
export type LogDefinition = {
    level: LogLevel;
    emit: 'stdout' | 'event';
};
export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;
export type GetLogType<T> = CheckIsLogLevel<T extends LogDefinition ? T['level'] : T>;
export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition> ? GetLogType<T[number]> : never;
export type QueryEvent = {
    timestamp: Date;
    query: string;
    params: string;
    duration: number;
    target: string;
};
export type LogEvent = {
    timestamp: Date;
    message: string;
    target: string;
};
export type PrismaAction = 'findUnique' | 'findUniqueOrThrow' | 'findMany' | 'findFirst' | 'findFirstOrThrow' | 'create' | 'createMany' | 'createManyAndReturn' | 'update' | 'updateMany' | 'updateManyAndReturn' | 'upsert' | 'delete' | 'deleteMany' | 'executeRaw' | 'queryRaw' | 'aggregate' | 'count' | 'runCommandRaw' | 'findRaw' | 'groupBy';
/**
 * `PrismaClient` proxy available in interactive transactions.
 */
export type TransactionClient = Omit<DefaultPrismaClient, runtime.ITXClientDenyList>;
//# sourceMappingURL=prismaNamespace.d.ts.map