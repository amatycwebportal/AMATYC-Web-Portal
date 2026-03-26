import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model UserRubricAssignment
 *
 */
export type UserRubricAssignmentModel = runtime.Types.Result.DefaultSelection<Prisma.$UserRubricAssignmentPayload>;
export type AggregateUserRubricAssignment = {
    _count: UserRubricAssignmentCountAggregateOutputType | null;
    _min: UserRubricAssignmentMinAggregateOutputType | null;
    _max: UserRubricAssignmentMaxAggregateOutputType | null;
};
export type UserRubricAssignmentMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    rubricVersionId: string | null;
    status: $Enums.AssignmentStatus | null;
    assignedAt: Date | null;
    startedAt: Date | null;
    completedAt: Date | null;
};
export type UserRubricAssignmentMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    rubricVersionId: string | null;
    status: $Enums.AssignmentStatus | null;
    assignedAt: Date | null;
    startedAt: Date | null;
    completedAt: Date | null;
};
export type UserRubricAssignmentCountAggregateOutputType = {
    id: number;
    userId: number;
    rubricVersionId: number;
    status: number;
    assignedAt: number;
    startedAt: number;
    completedAt: number;
    _all: number;
};
export type UserRubricAssignmentMinAggregateInputType = {
    id?: true;
    userId?: true;
    rubricVersionId?: true;
    status?: true;
    assignedAt?: true;
    startedAt?: true;
    completedAt?: true;
};
export type UserRubricAssignmentMaxAggregateInputType = {
    id?: true;
    userId?: true;
    rubricVersionId?: true;
    status?: true;
    assignedAt?: true;
    startedAt?: true;
    completedAt?: true;
};
export type UserRubricAssignmentCountAggregateInputType = {
    id?: true;
    userId?: true;
    rubricVersionId?: true;
    status?: true;
    assignedAt?: true;
    startedAt?: true;
    completedAt?: true;
    _all?: true;
};
export type UserRubricAssignmentAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which UserRubricAssignment to aggregate.
     */
    where?: Prisma.UserRubricAssignmentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of UserRubricAssignments to fetch.
     */
    orderBy?: Prisma.UserRubricAssignmentOrderByWithRelationInput | Prisma.UserRubricAssignmentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.UserRubricAssignmentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` UserRubricAssignments from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` UserRubricAssignments.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned UserRubricAssignments
    **/
    _count?: true | UserRubricAssignmentCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: UserRubricAssignmentMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: UserRubricAssignmentMaxAggregateInputType;
};
export type GetUserRubricAssignmentAggregateType<T extends UserRubricAssignmentAggregateArgs> = {
    [P in keyof T & keyof AggregateUserRubricAssignment]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateUserRubricAssignment[P]> : Prisma.GetScalarType<T[P], AggregateUserRubricAssignment[P]>;
};
export type UserRubricAssignmentGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserRubricAssignmentWhereInput;
    orderBy?: Prisma.UserRubricAssignmentOrderByWithAggregationInput | Prisma.UserRubricAssignmentOrderByWithAggregationInput[];
    by: Prisma.UserRubricAssignmentScalarFieldEnum[] | Prisma.UserRubricAssignmentScalarFieldEnum;
    having?: Prisma.UserRubricAssignmentScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: UserRubricAssignmentCountAggregateInputType | true;
    _min?: UserRubricAssignmentMinAggregateInputType;
    _max?: UserRubricAssignmentMaxAggregateInputType;
};
export type UserRubricAssignmentGroupByOutputType = {
    id: string;
    userId: string;
    rubricVersionId: string;
    status: $Enums.AssignmentStatus;
    assignedAt: Date;
    startedAt: Date | null;
    completedAt: Date | null;
    _count: UserRubricAssignmentCountAggregateOutputType | null;
    _min: UserRubricAssignmentMinAggregateOutputType | null;
    _max: UserRubricAssignmentMaxAggregateOutputType | null;
};
type GetUserRubricAssignmentGroupByPayload<T extends UserRubricAssignmentGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<UserRubricAssignmentGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof UserRubricAssignmentGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], UserRubricAssignmentGroupByOutputType[P]> : Prisma.GetScalarType<T[P], UserRubricAssignmentGroupByOutputType[P]>;
}>>;
export type UserRubricAssignmentWhereInput = {
    AND?: Prisma.UserRubricAssignmentWhereInput | Prisma.UserRubricAssignmentWhereInput[];
    OR?: Prisma.UserRubricAssignmentWhereInput[];
    NOT?: Prisma.UserRubricAssignmentWhereInput | Prisma.UserRubricAssignmentWhereInput[];
    id?: Prisma.UuidFilter<"UserRubricAssignment"> | string;
    userId?: Prisma.UuidFilter<"UserRubricAssignment"> | string;
    rubricVersionId?: Prisma.UuidFilter<"UserRubricAssignment"> | string;
    status?: Prisma.EnumAssignmentStatusFilter<"UserRubricAssignment"> | $Enums.AssignmentStatus;
    assignedAt?: Prisma.DateTimeFilter<"UserRubricAssignment"> | Date | string;
    startedAt?: Prisma.DateTimeNullableFilter<"UserRubricAssignment"> | Date | string | null;
    completedAt?: Prisma.DateTimeNullableFilter<"UserRubricAssignment"> | Date | string | null;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    rubricVersion?: Prisma.XOR<Prisma.RubricVersionScalarRelationFilter, Prisma.RubricVersionWhereInput>;
};
export type UserRubricAssignmentOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    rubricVersionId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    assignedAt?: Prisma.SortOrder;
    startedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    completedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
    rubricVersion?: Prisma.RubricVersionOrderByWithRelationInput;
};
export type UserRubricAssignmentWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    userId_rubricVersionId?: Prisma.UserRubricAssignmentUserIdRubricVersionIdCompoundUniqueInput;
    AND?: Prisma.UserRubricAssignmentWhereInput | Prisma.UserRubricAssignmentWhereInput[];
    OR?: Prisma.UserRubricAssignmentWhereInput[];
    NOT?: Prisma.UserRubricAssignmentWhereInput | Prisma.UserRubricAssignmentWhereInput[];
    userId?: Prisma.UuidFilter<"UserRubricAssignment"> | string;
    rubricVersionId?: Prisma.UuidFilter<"UserRubricAssignment"> | string;
    status?: Prisma.EnumAssignmentStatusFilter<"UserRubricAssignment"> | $Enums.AssignmentStatus;
    assignedAt?: Prisma.DateTimeFilter<"UserRubricAssignment"> | Date | string;
    startedAt?: Prisma.DateTimeNullableFilter<"UserRubricAssignment"> | Date | string | null;
    completedAt?: Prisma.DateTimeNullableFilter<"UserRubricAssignment"> | Date | string | null;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    rubricVersion?: Prisma.XOR<Prisma.RubricVersionScalarRelationFilter, Prisma.RubricVersionWhereInput>;
}, "id" | "userId_rubricVersionId">;
export type UserRubricAssignmentOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    rubricVersionId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    assignedAt?: Prisma.SortOrder;
    startedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    completedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.UserRubricAssignmentCountOrderByAggregateInput;
    _max?: Prisma.UserRubricAssignmentMaxOrderByAggregateInput;
    _min?: Prisma.UserRubricAssignmentMinOrderByAggregateInput;
};
export type UserRubricAssignmentScalarWhereWithAggregatesInput = {
    AND?: Prisma.UserRubricAssignmentScalarWhereWithAggregatesInput | Prisma.UserRubricAssignmentScalarWhereWithAggregatesInput[];
    OR?: Prisma.UserRubricAssignmentScalarWhereWithAggregatesInput[];
    NOT?: Prisma.UserRubricAssignmentScalarWhereWithAggregatesInput | Prisma.UserRubricAssignmentScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"UserRubricAssignment"> | string;
    userId?: Prisma.UuidWithAggregatesFilter<"UserRubricAssignment"> | string;
    rubricVersionId?: Prisma.UuidWithAggregatesFilter<"UserRubricAssignment"> | string;
    status?: Prisma.EnumAssignmentStatusWithAggregatesFilter<"UserRubricAssignment"> | $Enums.AssignmentStatus;
    assignedAt?: Prisma.DateTimeWithAggregatesFilter<"UserRubricAssignment"> | Date | string;
    startedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"UserRubricAssignment"> | Date | string | null;
    completedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"UserRubricAssignment"> | Date | string | null;
};
export type UserRubricAssignmentCreateInput = {
    id?: string;
    status: $Enums.AssignmentStatus;
    assignedAt?: Date | string;
    startedAt?: Date | string | null;
    completedAt?: Date | string | null;
    user: Prisma.UserCreateNestedOneWithoutRubricAssignmentsInput;
    rubricVersion: Prisma.RubricVersionCreateNestedOneWithoutAssignmentsInput;
};
export type UserRubricAssignmentUncheckedCreateInput = {
    id?: string;
    userId: string;
    rubricVersionId: string;
    status: $Enums.AssignmentStatus;
    assignedAt?: Date | string;
    startedAt?: Date | string | null;
    completedAt?: Date | string | null;
};
export type UserRubricAssignmentUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumAssignmentStatusFieldUpdateOperationsInput | $Enums.AssignmentStatus;
    assignedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    startedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user?: Prisma.UserUpdateOneRequiredWithoutRubricAssignmentsNestedInput;
    rubricVersion?: Prisma.RubricVersionUpdateOneRequiredWithoutAssignmentsNestedInput;
};
export type UserRubricAssignmentUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    rubricVersionId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumAssignmentStatusFieldUpdateOperationsInput | $Enums.AssignmentStatus;
    assignedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    startedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type UserRubricAssignmentCreateManyInput = {
    id?: string;
    userId: string;
    rubricVersionId: string;
    status: $Enums.AssignmentStatus;
    assignedAt?: Date | string;
    startedAt?: Date | string | null;
    completedAt?: Date | string | null;
};
export type UserRubricAssignmentUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumAssignmentStatusFieldUpdateOperationsInput | $Enums.AssignmentStatus;
    assignedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    startedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type UserRubricAssignmentUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    rubricVersionId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumAssignmentStatusFieldUpdateOperationsInput | $Enums.AssignmentStatus;
    assignedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    startedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type UserRubricAssignmentListRelationFilter = {
    every?: Prisma.UserRubricAssignmentWhereInput;
    some?: Prisma.UserRubricAssignmentWhereInput;
    none?: Prisma.UserRubricAssignmentWhereInput;
};
export type UserRubricAssignmentOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type UserRubricAssignmentUserIdRubricVersionIdCompoundUniqueInput = {
    userId: string;
    rubricVersionId: string;
};
export type UserRubricAssignmentCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    rubricVersionId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    assignedAt?: Prisma.SortOrder;
    startedAt?: Prisma.SortOrder;
    completedAt?: Prisma.SortOrder;
};
export type UserRubricAssignmentMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    rubricVersionId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    assignedAt?: Prisma.SortOrder;
    startedAt?: Prisma.SortOrder;
    completedAt?: Prisma.SortOrder;
};
export type UserRubricAssignmentMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    rubricVersionId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    assignedAt?: Prisma.SortOrder;
    startedAt?: Prisma.SortOrder;
    completedAt?: Prisma.SortOrder;
};
export type UserRubricAssignmentCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.UserRubricAssignmentCreateWithoutUserInput, Prisma.UserRubricAssignmentUncheckedCreateWithoutUserInput> | Prisma.UserRubricAssignmentCreateWithoutUserInput[] | Prisma.UserRubricAssignmentUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.UserRubricAssignmentCreateOrConnectWithoutUserInput | Prisma.UserRubricAssignmentCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.UserRubricAssignmentCreateManyUserInputEnvelope;
    connect?: Prisma.UserRubricAssignmentWhereUniqueInput | Prisma.UserRubricAssignmentWhereUniqueInput[];
};
export type UserRubricAssignmentUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.UserRubricAssignmentCreateWithoutUserInput, Prisma.UserRubricAssignmentUncheckedCreateWithoutUserInput> | Prisma.UserRubricAssignmentCreateWithoutUserInput[] | Prisma.UserRubricAssignmentUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.UserRubricAssignmentCreateOrConnectWithoutUserInput | Prisma.UserRubricAssignmentCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.UserRubricAssignmentCreateManyUserInputEnvelope;
    connect?: Prisma.UserRubricAssignmentWhereUniqueInput | Prisma.UserRubricAssignmentWhereUniqueInput[];
};
export type UserRubricAssignmentUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.UserRubricAssignmentCreateWithoutUserInput, Prisma.UserRubricAssignmentUncheckedCreateWithoutUserInput> | Prisma.UserRubricAssignmentCreateWithoutUserInput[] | Prisma.UserRubricAssignmentUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.UserRubricAssignmentCreateOrConnectWithoutUserInput | Prisma.UserRubricAssignmentCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.UserRubricAssignmentUpsertWithWhereUniqueWithoutUserInput | Prisma.UserRubricAssignmentUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.UserRubricAssignmentCreateManyUserInputEnvelope;
    set?: Prisma.UserRubricAssignmentWhereUniqueInput | Prisma.UserRubricAssignmentWhereUniqueInput[];
    disconnect?: Prisma.UserRubricAssignmentWhereUniqueInput | Prisma.UserRubricAssignmentWhereUniqueInput[];
    delete?: Prisma.UserRubricAssignmentWhereUniqueInput | Prisma.UserRubricAssignmentWhereUniqueInput[];
    connect?: Prisma.UserRubricAssignmentWhereUniqueInput | Prisma.UserRubricAssignmentWhereUniqueInput[];
    update?: Prisma.UserRubricAssignmentUpdateWithWhereUniqueWithoutUserInput | Prisma.UserRubricAssignmentUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.UserRubricAssignmentUpdateManyWithWhereWithoutUserInput | Prisma.UserRubricAssignmentUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.UserRubricAssignmentScalarWhereInput | Prisma.UserRubricAssignmentScalarWhereInput[];
};
export type UserRubricAssignmentUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.UserRubricAssignmentCreateWithoutUserInput, Prisma.UserRubricAssignmentUncheckedCreateWithoutUserInput> | Prisma.UserRubricAssignmentCreateWithoutUserInput[] | Prisma.UserRubricAssignmentUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.UserRubricAssignmentCreateOrConnectWithoutUserInput | Prisma.UserRubricAssignmentCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.UserRubricAssignmentUpsertWithWhereUniqueWithoutUserInput | Prisma.UserRubricAssignmentUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.UserRubricAssignmentCreateManyUserInputEnvelope;
    set?: Prisma.UserRubricAssignmentWhereUniqueInput | Prisma.UserRubricAssignmentWhereUniqueInput[];
    disconnect?: Prisma.UserRubricAssignmentWhereUniqueInput | Prisma.UserRubricAssignmentWhereUniqueInput[];
    delete?: Prisma.UserRubricAssignmentWhereUniqueInput | Prisma.UserRubricAssignmentWhereUniqueInput[];
    connect?: Prisma.UserRubricAssignmentWhereUniqueInput | Prisma.UserRubricAssignmentWhereUniqueInput[];
    update?: Prisma.UserRubricAssignmentUpdateWithWhereUniqueWithoutUserInput | Prisma.UserRubricAssignmentUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.UserRubricAssignmentUpdateManyWithWhereWithoutUserInput | Prisma.UserRubricAssignmentUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.UserRubricAssignmentScalarWhereInput | Prisma.UserRubricAssignmentScalarWhereInput[];
};
export type UserRubricAssignmentCreateNestedManyWithoutRubricVersionInput = {
    create?: Prisma.XOR<Prisma.UserRubricAssignmentCreateWithoutRubricVersionInput, Prisma.UserRubricAssignmentUncheckedCreateWithoutRubricVersionInput> | Prisma.UserRubricAssignmentCreateWithoutRubricVersionInput[] | Prisma.UserRubricAssignmentUncheckedCreateWithoutRubricVersionInput[];
    connectOrCreate?: Prisma.UserRubricAssignmentCreateOrConnectWithoutRubricVersionInput | Prisma.UserRubricAssignmentCreateOrConnectWithoutRubricVersionInput[];
    createMany?: Prisma.UserRubricAssignmentCreateManyRubricVersionInputEnvelope;
    connect?: Prisma.UserRubricAssignmentWhereUniqueInput | Prisma.UserRubricAssignmentWhereUniqueInput[];
};
export type UserRubricAssignmentUncheckedCreateNestedManyWithoutRubricVersionInput = {
    create?: Prisma.XOR<Prisma.UserRubricAssignmentCreateWithoutRubricVersionInput, Prisma.UserRubricAssignmentUncheckedCreateWithoutRubricVersionInput> | Prisma.UserRubricAssignmentCreateWithoutRubricVersionInput[] | Prisma.UserRubricAssignmentUncheckedCreateWithoutRubricVersionInput[];
    connectOrCreate?: Prisma.UserRubricAssignmentCreateOrConnectWithoutRubricVersionInput | Prisma.UserRubricAssignmentCreateOrConnectWithoutRubricVersionInput[];
    createMany?: Prisma.UserRubricAssignmentCreateManyRubricVersionInputEnvelope;
    connect?: Prisma.UserRubricAssignmentWhereUniqueInput | Prisma.UserRubricAssignmentWhereUniqueInput[];
};
export type UserRubricAssignmentUpdateManyWithoutRubricVersionNestedInput = {
    create?: Prisma.XOR<Prisma.UserRubricAssignmentCreateWithoutRubricVersionInput, Prisma.UserRubricAssignmentUncheckedCreateWithoutRubricVersionInput> | Prisma.UserRubricAssignmentCreateWithoutRubricVersionInput[] | Prisma.UserRubricAssignmentUncheckedCreateWithoutRubricVersionInput[];
    connectOrCreate?: Prisma.UserRubricAssignmentCreateOrConnectWithoutRubricVersionInput | Prisma.UserRubricAssignmentCreateOrConnectWithoutRubricVersionInput[];
    upsert?: Prisma.UserRubricAssignmentUpsertWithWhereUniqueWithoutRubricVersionInput | Prisma.UserRubricAssignmentUpsertWithWhereUniqueWithoutRubricVersionInput[];
    createMany?: Prisma.UserRubricAssignmentCreateManyRubricVersionInputEnvelope;
    set?: Prisma.UserRubricAssignmentWhereUniqueInput | Prisma.UserRubricAssignmentWhereUniqueInput[];
    disconnect?: Prisma.UserRubricAssignmentWhereUniqueInput | Prisma.UserRubricAssignmentWhereUniqueInput[];
    delete?: Prisma.UserRubricAssignmentWhereUniqueInput | Prisma.UserRubricAssignmentWhereUniqueInput[];
    connect?: Prisma.UserRubricAssignmentWhereUniqueInput | Prisma.UserRubricAssignmentWhereUniqueInput[];
    update?: Prisma.UserRubricAssignmentUpdateWithWhereUniqueWithoutRubricVersionInput | Prisma.UserRubricAssignmentUpdateWithWhereUniqueWithoutRubricVersionInput[];
    updateMany?: Prisma.UserRubricAssignmentUpdateManyWithWhereWithoutRubricVersionInput | Prisma.UserRubricAssignmentUpdateManyWithWhereWithoutRubricVersionInput[];
    deleteMany?: Prisma.UserRubricAssignmentScalarWhereInput | Prisma.UserRubricAssignmentScalarWhereInput[];
};
export type UserRubricAssignmentUncheckedUpdateManyWithoutRubricVersionNestedInput = {
    create?: Prisma.XOR<Prisma.UserRubricAssignmentCreateWithoutRubricVersionInput, Prisma.UserRubricAssignmentUncheckedCreateWithoutRubricVersionInput> | Prisma.UserRubricAssignmentCreateWithoutRubricVersionInput[] | Prisma.UserRubricAssignmentUncheckedCreateWithoutRubricVersionInput[];
    connectOrCreate?: Prisma.UserRubricAssignmentCreateOrConnectWithoutRubricVersionInput | Prisma.UserRubricAssignmentCreateOrConnectWithoutRubricVersionInput[];
    upsert?: Prisma.UserRubricAssignmentUpsertWithWhereUniqueWithoutRubricVersionInput | Prisma.UserRubricAssignmentUpsertWithWhereUniqueWithoutRubricVersionInput[];
    createMany?: Prisma.UserRubricAssignmentCreateManyRubricVersionInputEnvelope;
    set?: Prisma.UserRubricAssignmentWhereUniqueInput | Prisma.UserRubricAssignmentWhereUniqueInput[];
    disconnect?: Prisma.UserRubricAssignmentWhereUniqueInput | Prisma.UserRubricAssignmentWhereUniqueInput[];
    delete?: Prisma.UserRubricAssignmentWhereUniqueInput | Prisma.UserRubricAssignmentWhereUniqueInput[];
    connect?: Prisma.UserRubricAssignmentWhereUniqueInput | Prisma.UserRubricAssignmentWhereUniqueInput[];
    update?: Prisma.UserRubricAssignmentUpdateWithWhereUniqueWithoutRubricVersionInput | Prisma.UserRubricAssignmentUpdateWithWhereUniqueWithoutRubricVersionInput[];
    updateMany?: Prisma.UserRubricAssignmentUpdateManyWithWhereWithoutRubricVersionInput | Prisma.UserRubricAssignmentUpdateManyWithWhereWithoutRubricVersionInput[];
    deleteMany?: Prisma.UserRubricAssignmentScalarWhereInput | Prisma.UserRubricAssignmentScalarWhereInput[];
};
export type EnumAssignmentStatusFieldUpdateOperationsInput = {
    set?: $Enums.AssignmentStatus;
};
export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null;
};
export type UserRubricAssignmentCreateWithoutUserInput = {
    id?: string;
    status: $Enums.AssignmentStatus;
    assignedAt?: Date | string;
    startedAt?: Date | string | null;
    completedAt?: Date | string | null;
    rubricVersion: Prisma.RubricVersionCreateNestedOneWithoutAssignmentsInput;
};
export type UserRubricAssignmentUncheckedCreateWithoutUserInput = {
    id?: string;
    rubricVersionId: string;
    status: $Enums.AssignmentStatus;
    assignedAt?: Date | string;
    startedAt?: Date | string | null;
    completedAt?: Date | string | null;
};
export type UserRubricAssignmentCreateOrConnectWithoutUserInput = {
    where: Prisma.UserRubricAssignmentWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserRubricAssignmentCreateWithoutUserInput, Prisma.UserRubricAssignmentUncheckedCreateWithoutUserInput>;
};
export type UserRubricAssignmentCreateManyUserInputEnvelope = {
    data: Prisma.UserRubricAssignmentCreateManyUserInput | Prisma.UserRubricAssignmentCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type UserRubricAssignmentUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.UserRubricAssignmentWhereUniqueInput;
    update: Prisma.XOR<Prisma.UserRubricAssignmentUpdateWithoutUserInput, Prisma.UserRubricAssignmentUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.UserRubricAssignmentCreateWithoutUserInput, Prisma.UserRubricAssignmentUncheckedCreateWithoutUserInput>;
};
export type UserRubricAssignmentUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.UserRubricAssignmentWhereUniqueInput;
    data: Prisma.XOR<Prisma.UserRubricAssignmentUpdateWithoutUserInput, Prisma.UserRubricAssignmentUncheckedUpdateWithoutUserInput>;
};
export type UserRubricAssignmentUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.UserRubricAssignmentScalarWhereInput;
    data: Prisma.XOR<Prisma.UserRubricAssignmentUpdateManyMutationInput, Prisma.UserRubricAssignmentUncheckedUpdateManyWithoutUserInput>;
};
export type UserRubricAssignmentScalarWhereInput = {
    AND?: Prisma.UserRubricAssignmentScalarWhereInput | Prisma.UserRubricAssignmentScalarWhereInput[];
    OR?: Prisma.UserRubricAssignmentScalarWhereInput[];
    NOT?: Prisma.UserRubricAssignmentScalarWhereInput | Prisma.UserRubricAssignmentScalarWhereInput[];
    id?: Prisma.UuidFilter<"UserRubricAssignment"> | string;
    userId?: Prisma.UuidFilter<"UserRubricAssignment"> | string;
    rubricVersionId?: Prisma.UuidFilter<"UserRubricAssignment"> | string;
    status?: Prisma.EnumAssignmentStatusFilter<"UserRubricAssignment"> | $Enums.AssignmentStatus;
    assignedAt?: Prisma.DateTimeFilter<"UserRubricAssignment"> | Date | string;
    startedAt?: Prisma.DateTimeNullableFilter<"UserRubricAssignment"> | Date | string | null;
    completedAt?: Prisma.DateTimeNullableFilter<"UserRubricAssignment"> | Date | string | null;
};
export type UserRubricAssignmentCreateWithoutRubricVersionInput = {
    id?: string;
    status: $Enums.AssignmentStatus;
    assignedAt?: Date | string;
    startedAt?: Date | string | null;
    completedAt?: Date | string | null;
    user: Prisma.UserCreateNestedOneWithoutRubricAssignmentsInput;
};
export type UserRubricAssignmentUncheckedCreateWithoutRubricVersionInput = {
    id?: string;
    userId: string;
    status: $Enums.AssignmentStatus;
    assignedAt?: Date | string;
    startedAt?: Date | string | null;
    completedAt?: Date | string | null;
};
export type UserRubricAssignmentCreateOrConnectWithoutRubricVersionInput = {
    where: Prisma.UserRubricAssignmentWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserRubricAssignmentCreateWithoutRubricVersionInput, Prisma.UserRubricAssignmentUncheckedCreateWithoutRubricVersionInput>;
};
export type UserRubricAssignmentCreateManyRubricVersionInputEnvelope = {
    data: Prisma.UserRubricAssignmentCreateManyRubricVersionInput | Prisma.UserRubricAssignmentCreateManyRubricVersionInput[];
    skipDuplicates?: boolean;
};
export type UserRubricAssignmentUpsertWithWhereUniqueWithoutRubricVersionInput = {
    where: Prisma.UserRubricAssignmentWhereUniqueInput;
    update: Prisma.XOR<Prisma.UserRubricAssignmentUpdateWithoutRubricVersionInput, Prisma.UserRubricAssignmentUncheckedUpdateWithoutRubricVersionInput>;
    create: Prisma.XOR<Prisma.UserRubricAssignmentCreateWithoutRubricVersionInput, Prisma.UserRubricAssignmentUncheckedCreateWithoutRubricVersionInput>;
};
export type UserRubricAssignmentUpdateWithWhereUniqueWithoutRubricVersionInput = {
    where: Prisma.UserRubricAssignmentWhereUniqueInput;
    data: Prisma.XOR<Prisma.UserRubricAssignmentUpdateWithoutRubricVersionInput, Prisma.UserRubricAssignmentUncheckedUpdateWithoutRubricVersionInput>;
};
export type UserRubricAssignmentUpdateManyWithWhereWithoutRubricVersionInput = {
    where: Prisma.UserRubricAssignmentScalarWhereInput;
    data: Prisma.XOR<Prisma.UserRubricAssignmentUpdateManyMutationInput, Prisma.UserRubricAssignmentUncheckedUpdateManyWithoutRubricVersionInput>;
};
export type UserRubricAssignmentCreateManyUserInput = {
    id?: string;
    rubricVersionId: string;
    status: $Enums.AssignmentStatus;
    assignedAt?: Date | string;
    startedAt?: Date | string | null;
    completedAt?: Date | string | null;
};
export type UserRubricAssignmentUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumAssignmentStatusFieldUpdateOperationsInput | $Enums.AssignmentStatus;
    assignedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    startedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    rubricVersion?: Prisma.RubricVersionUpdateOneRequiredWithoutAssignmentsNestedInput;
};
export type UserRubricAssignmentUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rubricVersionId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumAssignmentStatusFieldUpdateOperationsInput | $Enums.AssignmentStatus;
    assignedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    startedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type UserRubricAssignmentUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rubricVersionId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumAssignmentStatusFieldUpdateOperationsInput | $Enums.AssignmentStatus;
    assignedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    startedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type UserRubricAssignmentCreateManyRubricVersionInput = {
    id?: string;
    userId: string;
    status: $Enums.AssignmentStatus;
    assignedAt?: Date | string;
    startedAt?: Date | string | null;
    completedAt?: Date | string | null;
};
export type UserRubricAssignmentUpdateWithoutRubricVersionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumAssignmentStatusFieldUpdateOperationsInput | $Enums.AssignmentStatus;
    assignedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    startedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    user?: Prisma.UserUpdateOneRequiredWithoutRubricAssignmentsNestedInput;
};
export type UserRubricAssignmentUncheckedUpdateWithoutRubricVersionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumAssignmentStatusFieldUpdateOperationsInput | $Enums.AssignmentStatus;
    assignedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    startedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type UserRubricAssignmentUncheckedUpdateManyWithoutRubricVersionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumAssignmentStatusFieldUpdateOperationsInput | $Enums.AssignmentStatus;
    assignedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    startedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type UserRubricAssignmentSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    rubricVersionId?: boolean;
    status?: boolean;
    assignedAt?: boolean;
    startedAt?: boolean;
    completedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    rubricVersion?: boolean | Prisma.RubricVersionDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["userRubricAssignment"]>;
export type UserRubricAssignmentSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    rubricVersionId?: boolean;
    status?: boolean;
    assignedAt?: boolean;
    startedAt?: boolean;
    completedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    rubricVersion?: boolean | Prisma.RubricVersionDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["userRubricAssignment"]>;
export type UserRubricAssignmentSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    rubricVersionId?: boolean;
    status?: boolean;
    assignedAt?: boolean;
    startedAt?: boolean;
    completedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    rubricVersion?: boolean | Prisma.RubricVersionDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["userRubricAssignment"]>;
export type UserRubricAssignmentSelectScalar = {
    id?: boolean;
    userId?: boolean;
    rubricVersionId?: boolean;
    status?: boolean;
    assignedAt?: boolean;
    startedAt?: boolean;
    completedAt?: boolean;
};
export type UserRubricAssignmentOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "rubricVersionId" | "status" | "assignedAt" | "startedAt" | "completedAt", ExtArgs["result"]["userRubricAssignment"]>;
export type UserRubricAssignmentInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    rubricVersion?: boolean | Prisma.RubricVersionDefaultArgs<ExtArgs>;
};
export type UserRubricAssignmentIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    rubricVersion?: boolean | Prisma.RubricVersionDefaultArgs<ExtArgs>;
};
export type UserRubricAssignmentIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    rubricVersion?: boolean | Prisma.RubricVersionDefaultArgs<ExtArgs>;
};
export type $UserRubricAssignmentPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "UserRubricAssignment";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
        rubricVersion: Prisma.$RubricVersionPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        userId: string;
        rubricVersionId: string;
        status: $Enums.AssignmentStatus;
        assignedAt: Date;
        startedAt: Date | null;
        completedAt: Date | null;
    }, ExtArgs["result"]["userRubricAssignment"]>;
    composites: {};
};
export type UserRubricAssignmentGetPayload<S extends boolean | null | undefined | UserRubricAssignmentDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$UserRubricAssignmentPayload, S>;
export type UserRubricAssignmentCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<UserRubricAssignmentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: UserRubricAssignmentCountAggregateInputType | true;
};
export interface UserRubricAssignmentDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['UserRubricAssignment'];
        meta: {
            name: 'UserRubricAssignment';
        };
    };
    /**
     * Find zero or one UserRubricAssignment that matches the filter.
     * @param {UserRubricAssignmentFindUniqueArgs} args - Arguments to find a UserRubricAssignment
     * @example
     * // Get one UserRubricAssignment
     * const userRubricAssignment = await prisma.userRubricAssignment.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserRubricAssignmentFindUniqueArgs>(args: Prisma.SelectSubset<T, UserRubricAssignmentFindUniqueArgs<ExtArgs>>): Prisma.Prisma__UserRubricAssignmentClient<runtime.Types.Result.GetResult<Prisma.$UserRubricAssignmentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one UserRubricAssignment that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserRubricAssignmentFindUniqueOrThrowArgs} args - Arguments to find a UserRubricAssignment
     * @example
     * // Get one UserRubricAssignment
     * const userRubricAssignment = await prisma.userRubricAssignment.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserRubricAssignmentFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, UserRubricAssignmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserRubricAssignmentClient<runtime.Types.Result.GetResult<Prisma.$UserRubricAssignmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first UserRubricAssignment that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserRubricAssignmentFindFirstArgs} args - Arguments to find a UserRubricAssignment
     * @example
     * // Get one UserRubricAssignment
     * const userRubricAssignment = await prisma.userRubricAssignment.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserRubricAssignmentFindFirstArgs>(args?: Prisma.SelectSubset<T, UserRubricAssignmentFindFirstArgs<ExtArgs>>): Prisma.Prisma__UserRubricAssignmentClient<runtime.Types.Result.GetResult<Prisma.$UserRubricAssignmentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first UserRubricAssignment that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserRubricAssignmentFindFirstOrThrowArgs} args - Arguments to find a UserRubricAssignment
     * @example
     * // Get one UserRubricAssignment
     * const userRubricAssignment = await prisma.userRubricAssignment.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserRubricAssignmentFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, UserRubricAssignmentFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserRubricAssignmentClient<runtime.Types.Result.GetResult<Prisma.$UserRubricAssignmentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more UserRubricAssignments that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserRubricAssignmentFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserRubricAssignments
     * const userRubricAssignments = await prisma.userRubricAssignment.findMany()
     *
     * // Get first 10 UserRubricAssignments
     * const userRubricAssignments = await prisma.userRubricAssignment.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const userRubricAssignmentWithIdOnly = await prisma.userRubricAssignment.findMany({ select: { id: true } })
     *
     */
    findMany<T extends UserRubricAssignmentFindManyArgs>(args?: Prisma.SelectSubset<T, UserRubricAssignmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserRubricAssignmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a UserRubricAssignment.
     * @param {UserRubricAssignmentCreateArgs} args - Arguments to create a UserRubricAssignment.
     * @example
     * // Create one UserRubricAssignment
     * const UserRubricAssignment = await prisma.userRubricAssignment.create({
     *   data: {
     *     // ... data to create a UserRubricAssignment
     *   }
     * })
     *
     */
    create<T extends UserRubricAssignmentCreateArgs>(args: Prisma.SelectSubset<T, UserRubricAssignmentCreateArgs<ExtArgs>>): Prisma.Prisma__UserRubricAssignmentClient<runtime.Types.Result.GetResult<Prisma.$UserRubricAssignmentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many UserRubricAssignments.
     * @param {UserRubricAssignmentCreateManyArgs} args - Arguments to create many UserRubricAssignments.
     * @example
     * // Create many UserRubricAssignments
     * const userRubricAssignment = await prisma.userRubricAssignment.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends UserRubricAssignmentCreateManyArgs>(args?: Prisma.SelectSubset<T, UserRubricAssignmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many UserRubricAssignments and returns the data saved in the database.
     * @param {UserRubricAssignmentCreateManyAndReturnArgs} args - Arguments to create many UserRubricAssignments.
     * @example
     * // Create many UserRubricAssignments
     * const userRubricAssignment = await prisma.userRubricAssignment.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many UserRubricAssignments and only return the `id`
     * const userRubricAssignmentWithIdOnly = await prisma.userRubricAssignment.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends UserRubricAssignmentCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, UserRubricAssignmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserRubricAssignmentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a UserRubricAssignment.
     * @param {UserRubricAssignmentDeleteArgs} args - Arguments to delete one UserRubricAssignment.
     * @example
     * // Delete one UserRubricAssignment
     * const UserRubricAssignment = await prisma.userRubricAssignment.delete({
     *   where: {
     *     // ... filter to delete one UserRubricAssignment
     *   }
     * })
     *
     */
    delete<T extends UserRubricAssignmentDeleteArgs>(args: Prisma.SelectSubset<T, UserRubricAssignmentDeleteArgs<ExtArgs>>): Prisma.Prisma__UserRubricAssignmentClient<runtime.Types.Result.GetResult<Prisma.$UserRubricAssignmentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one UserRubricAssignment.
     * @param {UserRubricAssignmentUpdateArgs} args - Arguments to update one UserRubricAssignment.
     * @example
     * // Update one UserRubricAssignment
     * const userRubricAssignment = await prisma.userRubricAssignment.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends UserRubricAssignmentUpdateArgs>(args: Prisma.SelectSubset<T, UserRubricAssignmentUpdateArgs<ExtArgs>>): Prisma.Prisma__UserRubricAssignmentClient<runtime.Types.Result.GetResult<Prisma.$UserRubricAssignmentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more UserRubricAssignments.
     * @param {UserRubricAssignmentDeleteManyArgs} args - Arguments to filter UserRubricAssignments to delete.
     * @example
     * // Delete a few UserRubricAssignments
     * const { count } = await prisma.userRubricAssignment.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends UserRubricAssignmentDeleteManyArgs>(args?: Prisma.SelectSubset<T, UserRubricAssignmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more UserRubricAssignments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserRubricAssignmentUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserRubricAssignments
     * const userRubricAssignment = await prisma.userRubricAssignment.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends UserRubricAssignmentUpdateManyArgs>(args: Prisma.SelectSubset<T, UserRubricAssignmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more UserRubricAssignments and returns the data updated in the database.
     * @param {UserRubricAssignmentUpdateManyAndReturnArgs} args - Arguments to update many UserRubricAssignments.
     * @example
     * // Update many UserRubricAssignments
     * const userRubricAssignment = await prisma.userRubricAssignment.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more UserRubricAssignments and only return the `id`
     * const userRubricAssignmentWithIdOnly = await prisma.userRubricAssignment.updateManyAndReturn({
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
    updateManyAndReturn<T extends UserRubricAssignmentUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, UserRubricAssignmentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserRubricAssignmentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one UserRubricAssignment.
     * @param {UserRubricAssignmentUpsertArgs} args - Arguments to update or create a UserRubricAssignment.
     * @example
     * // Update or create a UserRubricAssignment
     * const userRubricAssignment = await prisma.userRubricAssignment.upsert({
     *   create: {
     *     // ... data to create a UserRubricAssignment
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserRubricAssignment we want to update
     *   }
     * })
     */
    upsert<T extends UserRubricAssignmentUpsertArgs>(args: Prisma.SelectSubset<T, UserRubricAssignmentUpsertArgs<ExtArgs>>): Prisma.Prisma__UserRubricAssignmentClient<runtime.Types.Result.GetResult<Prisma.$UserRubricAssignmentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of UserRubricAssignments.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserRubricAssignmentCountArgs} args - Arguments to filter UserRubricAssignments to count.
     * @example
     * // Count the number of UserRubricAssignments
     * const count = await prisma.userRubricAssignment.count({
     *   where: {
     *     // ... the filter for the UserRubricAssignments we want to count
     *   }
     * })
    **/
    count<T extends UserRubricAssignmentCountArgs>(args?: Prisma.Subset<T, UserRubricAssignmentCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], UserRubricAssignmentCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a UserRubricAssignment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserRubricAssignmentAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UserRubricAssignmentAggregateArgs>(args: Prisma.Subset<T, UserRubricAssignmentAggregateArgs>): Prisma.PrismaPromise<GetUserRubricAssignmentAggregateType<T>>;
    /**
     * Group by UserRubricAssignment.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserRubricAssignmentGroupByArgs} args - Group by arguments.
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
    groupBy<T extends UserRubricAssignmentGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: UserRubricAssignmentGroupByArgs['orderBy'];
    } : {
        orderBy?: UserRubricAssignmentGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, UserRubricAssignmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserRubricAssignmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the UserRubricAssignment model
     */
    readonly fields: UserRubricAssignmentFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for UserRubricAssignment.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__UserRubricAssignmentClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    rubricVersion<T extends Prisma.RubricVersionDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.RubricVersionDefaultArgs<ExtArgs>>): Prisma.Prisma__RubricVersionClient<runtime.Types.Result.GetResult<Prisma.$RubricVersionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
/**
 * Fields of the UserRubricAssignment model
 */
export interface UserRubricAssignmentFieldRefs {
    readonly id: Prisma.FieldRef<"UserRubricAssignment", 'String'>;
    readonly userId: Prisma.FieldRef<"UserRubricAssignment", 'String'>;
    readonly rubricVersionId: Prisma.FieldRef<"UserRubricAssignment", 'String'>;
    readonly status: Prisma.FieldRef<"UserRubricAssignment", 'AssignmentStatus'>;
    readonly assignedAt: Prisma.FieldRef<"UserRubricAssignment", 'DateTime'>;
    readonly startedAt: Prisma.FieldRef<"UserRubricAssignment", 'DateTime'>;
    readonly completedAt: Prisma.FieldRef<"UserRubricAssignment", 'DateTime'>;
}
/**
 * UserRubricAssignment findUnique
 */
export type UserRubricAssignmentFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRubricAssignment
     */
    select?: Prisma.UserRubricAssignmentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserRubricAssignment
     */
    omit?: Prisma.UserRubricAssignmentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserRubricAssignmentInclude<ExtArgs> | null;
    /**
     * Filter, which UserRubricAssignment to fetch.
     */
    where: Prisma.UserRubricAssignmentWhereUniqueInput;
};
/**
 * UserRubricAssignment findUniqueOrThrow
 */
export type UserRubricAssignmentFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRubricAssignment
     */
    select?: Prisma.UserRubricAssignmentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserRubricAssignment
     */
    omit?: Prisma.UserRubricAssignmentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserRubricAssignmentInclude<ExtArgs> | null;
    /**
     * Filter, which UserRubricAssignment to fetch.
     */
    where: Prisma.UserRubricAssignmentWhereUniqueInput;
};
/**
 * UserRubricAssignment findFirst
 */
export type UserRubricAssignmentFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRubricAssignment
     */
    select?: Prisma.UserRubricAssignmentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserRubricAssignment
     */
    omit?: Prisma.UserRubricAssignmentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserRubricAssignmentInclude<ExtArgs> | null;
    /**
     * Filter, which UserRubricAssignment to fetch.
     */
    where?: Prisma.UserRubricAssignmentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of UserRubricAssignments to fetch.
     */
    orderBy?: Prisma.UserRubricAssignmentOrderByWithRelationInput | Prisma.UserRubricAssignmentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for UserRubricAssignments.
     */
    cursor?: Prisma.UserRubricAssignmentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` UserRubricAssignments from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` UserRubricAssignments.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of UserRubricAssignments.
     */
    distinct?: Prisma.UserRubricAssignmentScalarFieldEnum | Prisma.UserRubricAssignmentScalarFieldEnum[];
};
/**
 * UserRubricAssignment findFirstOrThrow
 */
export type UserRubricAssignmentFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRubricAssignment
     */
    select?: Prisma.UserRubricAssignmentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserRubricAssignment
     */
    omit?: Prisma.UserRubricAssignmentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserRubricAssignmentInclude<ExtArgs> | null;
    /**
     * Filter, which UserRubricAssignment to fetch.
     */
    where?: Prisma.UserRubricAssignmentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of UserRubricAssignments to fetch.
     */
    orderBy?: Prisma.UserRubricAssignmentOrderByWithRelationInput | Prisma.UserRubricAssignmentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for UserRubricAssignments.
     */
    cursor?: Prisma.UserRubricAssignmentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` UserRubricAssignments from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` UserRubricAssignments.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of UserRubricAssignments.
     */
    distinct?: Prisma.UserRubricAssignmentScalarFieldEnum | Prisma.UserRubricAssignmentScalarFieldEnum[];
};
/**
 * UserRubricAssignment findMany
 */
export type UserRubricAssignmentFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRubricAssignment
     */
    select?: Prisma.UserRubricAssignmentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserRubricAssignment
     */
    omit?: Prisma.UserRubricAssignmentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserRubricAssignmentInclude<ExtArgs> | null;
    /**
     * Filter, which UserRubricAssignments to fetch.
     */
    where?: Prisma.UserRubricAssignmentWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of UserRubricAssignments to fetch.
     */
    orderBy?: Prisma.UserRubricAssignmentOrderByWithRelationInput | Prisma.UserRubricAssignmentOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing UserRubricAssignments.
     */
    cursor?: Prisma.UserRubricAssignmentWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` UserRubricAssignments from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` UserRubricAssignments.
     */
    skip?: number;
    distinct?: Prisma.UserRubricAssignmentScalarFieldEnum | Prisma.UserRubricAssignmentScalarFieldEnum[];
};
/**
 * UserRubricAssignment create
 */
export type UserRubricAssignmentCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRubricAssignment
     */
    select?: Prisma.UserRubricAssignmentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserRubricAssignment
     */
    omit?: Prisma.UserRubricAssignmentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserRubricAssignmentInclude<ExtArgs> | null;
    /**
     * The data needed to create a UserRubricAssignment.
     */
    data: Prisma.XOR<Prisma.UserRubricAssignmentCreateInput, Prisma.UserRubricAssignmentUncheckedCreateInput>;
};
/**
 * UserRubricAssignment createMany
 */
export type UserRubricAssignmentCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserRubricAssignments.
     */
    data: Prisma.UserRubricAssignmentCreateManyInput | Prisma.UserRubricAssignmentCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * UserRubricAssignment createManyAndReturn
 */
export type UserRubricAssignmentCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRubricAssignment
     */
    select?: Prisma.UserRubricAssignmentSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the UserRubricAssignment
     */
    omit?: Prisma.UserRubricAssignmentOmit<ExtArgs> | null;
    /**
     * The data used to create many UserRubricAssignments.
     */
    data: Prisma.UserRubricAssignmentCreateManyInput | Prisma.UserRubricAssignmentCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserRubricAssignmentIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * UserRubricAssignment update
 */
export type UserRubricAssignmentUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRubricAssignment
     */
    select?: Prisma.UserRubricAssignmentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserRubricAssignment
     */
    omit?: Prisma.UserRubricAssignmentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserRubricAssignmentInclude<ExtArgs> | null;
    /**
     * The data needed to update a UserRubricAssignment.
     */
    data: Prisma.XOR<Prisma.UserRubricAssignmentUpdateInput, Prisma.UserRubricAssignmentUncheckedUpdateInput>;
    /**
     * Choose, which UserRubricAssignment to update.
     */
    where: Prisma.UserRubricAssignmentWhereUniqueInput;
};
/**
 * UserRubricAssignment updateMany
 */
export type UserRubricAssignmentUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update UserRubricAssignments.
     */
    data: Prisma.XOR<Prisma.UserRubricAssignmentUpdateManyMutationInput, Prisma.UserRubricAssignmentUncheckedUpdateManyInput>;
    /**
     * Filter which UserRubricAssignments to update
     */
    where?: Prisma.UserRubricAssignmentWhereInput;
    /**
     * Limit how many UserRubricAssignments to update.
     */
    limit?: number;
};
/**
 * UserRubricAssignment updateManyAndReturn
 */
export type UserRubricAssignmentUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRubricAssignment
     */
    select?: Prisma.UserRubricAssignmentSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the UserRubricAssignment
     */
    omit?: Prisma.UserRubricAssignmentOmit<ExtArgs> | null;
    /**
     * The data used to update UserRubricAssignments.
     */
    data: Prisma.XOR<Prisma.UserRubricAssignmentUpdateManyMutationInput, Prisma.UserRubricAssignmentUncheckedUpdateManyInput>;
    /**
     * Filter which UserRubricAssignments to update
     */
    where?: Prisma.UserRubricAssignmentWhereInput;
    /**
     * Limit how many UserRubricAssignments to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserRubricAssignmentIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * UserRubricAssignment upsert
 */
export type UserRubricAssignmentUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRubricAssignment
     */
    select?: Prisma.UserRubricAssignmentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserRubricAssignment
     */
    omit?: Prisma.UserRubricAssignmentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserRubricAssignmentInclude<ExtArgs> | null;
    /**
     * The filter to search for the UserRubricAssignment to update in case it exists.
     */
    where: Prisma.UserRubricAssignmentWhereUniqueInput;
    /**
     * In case the UserRubricAssignment found by the `where` argument doesn't exist, create a new UserRubricAssignment with this data.
     */
    create: Prisma.XOR<Prisma.UserRubricAssignmentCreateInput, Prisma.UserRubricAssignmentUncheckedCreateInput>;
    /**
     * In case the UserRubricAssignment was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.UserRubricAssignmentUpdateInput, Prisma.UserRubricAssignmentUncheckedUpdateInput>;
};
/**
 * UserRubricAssignment delete
 */
export type UserRubricAssignmentDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRubricAssignment
     */
    select?: Prisma.UserRubricAssignmentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserRubricAssignment
     */
    omit?: Prisma.UserRubricAssignmentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserRubricAssignmentInclude<ExtArgs> | null;
    /**
     * Filter which UserRubricAssignment to delete.
     */
    where: Prisma.UserRubricAssignmentWhereUniqueInput;
};
/**
 * UserRubricAssignment deleteMany
 */
export type UserRubricAssignmentDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which UserRubricAssignments to delete
     */
    where?: Prisma.UserRubricAssignmentWhereInput;
    /**
     * Limit how many UserRubricAssignments to delete.
     */
    limit?: number;
};
/**
 * UserRubricAssignment without action
 */
export type UserRubricAssignmentDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserRubricAssignment
     */
    select?: Prisma.UserRubricAssignmentSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserRubricAssignment
     */
    omit?: Prisma.UserRubricAssignmentOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserRubricAssignmentInclude<ExtArgs> | null;
};
export {};
//# sourceMappingURL=UserRubricAssignment.d.ts.map