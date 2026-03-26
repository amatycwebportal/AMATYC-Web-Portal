import * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "./prismaNamespace";
export type LogOptions<ClientOptions extends Prisma.PrismaClientOptions> = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never;
export interface PrismaClientConstructor {
    /**
   * ## Prisma Client
   *
   * Type-safe database client for TypeScript
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Institutions
   * const institutions = await prisma.institution.findMany()
   * ```
   *
   * Read more in our [docs](https://pris.ly/d/client).
   */
    new <Options extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions, LogOpts extends LogOptions<Options> = LogOptions<Options>, OmitOpts extends Prisma.PrismaClientOptions['omit'] = Options extends {
        omit: infer U;
    } ? U : Prisma.PrismaClientOptions['omit'], ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs>(options: Prisma.Subset<Options, Prisma.PrismaClientOptions>): PrismaClient<LogOpts, OmitOpts, ExtArgs>;
}
/**
 * ## Prisma Client
 *
 * Type-safe database client for TypeScript
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Institutions
 * const institutions = await prisma.institution.findMany()
 * ```
 *
 * Read more in our [docs](https://pris.ly/d/client).
 */
export interface PrismaClient<in LogOpts extends Prisma.LogLevel = never, in out OmitOpts extends Prisma.PrismaClientOptions['omit'] = undefined, in out ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['other'];
    };
    $on<V extends LogOpts>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;
    /**
     * Connect with the database
     */
    $connect(): runtime.Types.Utils.JsPromise<void>;
    /**
     * Disconnect from the database
     */
    $disconnect(): runtime.Types.Utils.JsPromise<void>;
    /**
       * Executes a prepared raw query and returns the number of affected rows.
       * @example
       * ```
       * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
       * ```
       *
       * Read more in our [docs](https://pris.ly/d/raw-queries).
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
     * Read more in our [docs](https://pris.ly/d/raw-queries).
     */
    $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;
    /**
     * Performs a prepared raw query and returns the `SELECT` data.
     * @example
     * ```
     * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
     * ```
     *
     * Read more in our [docs](https://pris.ly/d/raw-queries).
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
     * Read more in our [docs](https://pris.ly/d/raw-queries).
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
    $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: {
        isolationLevel?: Prisma.TransactionIsolationLevel;
    }): runtime.Types.Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>;
    $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => runtime.Types.Utils.JsPromise<R>, options?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: Prisma.TransactionIsolationLevel;
    }): runtime.Types.Utils.JsPromise<R>;
    $extends: runtime.Types.Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<OmitOpts>, ExtArgs, runtime.Types.Utils.Call<Prisma.TypeMapCb<OmitOpts>, {
        extArgs: ExtArgs;
    }>>;
    /**
 * `prisma.institution`: Exposes CRUD operations for the **Institution** model.
  * Example usage:
  * ```ts
  * // Fetch zero or more Institutions
  * const institutions = await prisma.institution.findMany()
  * ```
  */
    get institution(): Prisma.InstitutionDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.user`: Exposes CRUD operations for the **User** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Users
      * const users = await prisma.user.findMany()
      * ```
      */
    get user(): Prisma.UserDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.rubricVersion`: Exposes CRUD operations for the **RubricVersion** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more RubricVersions
      * const rubricVersions = await prisma.rubricVersion.findMany()
      * ```
      */
    get rubricVersion(): Prisma.RubricVersionDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.scale`: Exposes CRUD operations for the **Scale** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Scales
      * const scales = await prisma.scale.findMany()
      * ```
      */
    get scale(): Prisma.ScaleDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.scaleVersion`: Exposes CRUD operations for the **ScaleVersion** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ScaleVersions
      * const scaleVersions = await prisma.scaleVersion.findMany()
      * ```
      */
    get scaleVersion(): Prisma.ScaleVersionDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.scaleVersionBin`: Exposes CRUD operations for the **ScaleVersionBin** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ScaleVersionBins
      * const scaleVersionBins = await prisma.scaleVersionBin.findMany()
      * ```
      */
    get scaleVersionBin(): Prisma.ScaleVersionBinDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.userRubricAssignment`: Exposes CRUD operations for the **UserRubricAssignment** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more UserRubricAssignments
      * const userRubricAssignments = await prisma.userRubricAssignment.findMany()
      * ```
      */
    get userRubricAssignment(): Prisma.UserRubricAssignmentDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.rubric`: Exposes CRUD operations for the **Rubric** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Rubrics
      * const rubrics = await prisma.rubric.findMany()
      * ```
      */
    get rubric(): Prisma.RubricDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.response`: Exposes CRUD operations for the **Response** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Responses
      * const responses = await prisma.response.findMany()
      * ```
      */
    get response(): Prisma.ResponseDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.predefinedCourseBin`: Exposes CRUD operations for the **PredefinedCourseBin** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more PredefinedCourseBins
      * const predefinedCourseBins = await prisma.predefinedCourseBin.findMany()
      * ```
      */
    get predefinedCourseBin(): Prisma.PredefinedCourseBinDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.courseBin`: Exposes CRUD operations for the **CourseBin** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more CourseBins
      * const courseBins = await prisma.courseBin.findMany()
      * ```
      */
    get courseBin(): Prisma.CourseBinDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.course`: Exposes CRUD operations for the **Course** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Courses
      * const courses = await prisma.course.findMany()
      * ```
      */
    get course(): Prisma.CourseDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.scaleBin`: Exposes CRUD operations for the **ScaleBin** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more ScaleBins
      * const scaleBins = await prisma.scaleBin.findMany()
      * ```
      */
    get scaleBin(): Prisma.ScaleBinDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.userCourseBin`: Exposes CRUD operations for the **UserCourseBin** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more UserCourseBins
      * const userCourseBins = await prisma.userCourseBin.findMany()
      * ```
      */
    get userCourseBin(): Prisma.UserCourseBinDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    /**
     * `prisma.invitation`: Exposes CRUD operations for the **Invitation** model.
      * Example usage:
      * ```ts
      * // Fetch zero or more Invitations
      * const invitations = await prisma.invitation.findMany()
      * ```
      */
    get invitation(): Prisma.InvitationDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
}
export declare function getPrismaClientClass(): PrismaClientConstructor;
//# sourceMappingURL=class.d.ts.map