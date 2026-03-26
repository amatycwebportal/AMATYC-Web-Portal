import * as runtime from "@prisma/client/runtime/client";
import * as $Class from "./internal/class";
import * as Prisma from "./internal/prismaNamespace";
export * as $Enums from './enums';
export * from "./enums";
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
export declare const PrismaClient: $Class.PrismaClientConstructor;
export type PrismaClient<LogOpts extends Prisma.LogLevel = never, OmitOpts extends Prisma.PrismaClientOptions["omit"] = Prisma.PrismaClientOptions["omit"], ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = $Class.PrismaClient<LogOpts, OmitOpts, ExtArgs>;
export { Prisma };
/**
 * Model Institution
 *
 */
export type Institution = Prisma.InstitutionModel;
/**
 * Model User
 *
 */
export type User = Prisma.UserModel;
/**
 * Model RubricVersion
 *
 */
export type RubricVersion = Prisma.RubricVersionModel;
/**
 * Model Scale
 *
 */
export type Scale = Prisma.ScaleModel;
/**
 * Model ScaleVersion
 *
 */
export type ScaleVersion = Prisma.ScaleVersionModel;
/**
 * Model ScaleVersionBin
 *
 */
export type ScaleVersionBin = Prisma.ScaleVersionBinModel;
/**
 * Model UserRubricAssignment
 *
 */
export type UserRubricAssignment = Prisma.UserRubricAssignmentModel;
/**
 * Model Rubric
 *
 */
export type Rubric = Prisma.RubricModel;
/**
 * Model Response
 *
 */
export type Response = Prisma.ResponseModel;
/**
 * Model PredefinedCourseBin
 *
 */
export type PredefinedCourseBin = Prisma.PredefinedCourseBinModel;
/**
 * Model CourseBin
 *
 */
export type CourseBin = Prisma.CourseBinModel;
/**
 * Model Course
 *
 */
export type Course = Prisma.CourseModel;
/**
 * Model ScaleBin
 *
 */
export type ScaleBin = Prisma.ScaleBinModel;
/**
 * Model UserCourseBin
 *
 */
export type UserCourseBin = Prisma.UserCourseBinModel;
/**
 * Model Invitation
 *
 */
export type Invitation = Prisma.InvitationModel;
//# sourceMappingURL=client.d.ts.map