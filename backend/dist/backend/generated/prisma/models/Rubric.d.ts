import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model Rubric
 *
 */
export type RubricModel = runtime.Types.Result.DefaultSelection<Prisma.$RubricPayload>;
export type AggregateRubric = {
    _count: RubricCountAggregateOutputType | null;
    _min: RubricMinAggregateOutputType | null;
    _max: RubricMaxAggregateOutputType | null;
};
export type RubricMinAggregateOutputType = {
    id: string | null;
    title: string | null;
    description: string | null;
    active: boolean | null;
};
export type RubricMaxAggregateOutputType = {
    id: string | null;
    title: string | null;
    description: string | null;
    active: boolean | null;
};
export type RubricCountAggregateOutputType = {
    id: number;
    title: number;
    description: number;
    active: number;
    _all: number;
};
export type RubricMinAggregateInputType = {
    id?: true;
    title?: true;
    description?: true;
    active?: true;
};
export type RubricMaxAggregateInputType = {
    id?: true;
    title?: true;
    description?: true;
    active?: true;
};
export type RubricCountAggregateInputType = {
    id?: true;
    title?: true;
    description?: true;
    active?: true;
    _all?: true;
};
export type RubricAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Rubric to aggregate.
     */
    where?: Prisma.RubricWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Rubrics to fetch.
     */
    orderBy?: Prisma.RubricOrderByWithRelationInput | Prisma.RubricOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.RubricWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Rubrics from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Rubrics.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Rubrics
    **/
    _count?: true | RubricCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: RubricMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: RubricMaxAggregateInputType;
};
export type GetRubricAggregateType<T extends RubricAggregateArgs> = {
    [P in keyof T & keyof AggregateRubric]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateRubric[P]> : Prisma.GetScalarType<T[P], AggregateRubric[P]>;
};
export type RubricGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RubricWhereInput;
    orderBy?: Prisma.RubricOrderByWithAggregationInput | Prisma.RubricOrderByWithAggregationInput[];
    by: Prisma.RubricScalarFieldEnum[] | Prisma.RubricScalarFieldEnum;
    having?: Prisma.RubricScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: RubricCountAggregateInputType | true;
    _min?: RubricMinAggregateInputType;
    _max?: RubricMaxAggregateInputType;
};
export type RubricGroupByOutputType = {
    id: string;
    title: string;
    description: string;
    active: boolean;
    _count: RubricCountAggregateOutputType | null;
    _min: RubricMinAggregateOutputType | null;
    _max: RubricMaxAggregateOutputType | null;
};
type GetRubricGroupByPayload<T extends RubricGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<RubricGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof RubricGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], RubricGroupByOutputType[P]> : Prisma.GetScalarType<T[P], RubricGroupByOutputType[P]>;
}>>;
export type RubricWhereInput = {
    AND?: Prisma.RubricWhereInput | Prisma.RubricWhereInput[];
    OR?: Prisma.RubricWhereInput[];
    NOT?: Prisma.RubricWhereInput | Prisma.RubricWhereInput[];
    id?: Prisma.UuidFilter<"Rubric"> | string;
    title?: Prisma.StringFilter<"Rubric"> | string;
    description?: Prisma.StringFilter<"Rubric"> | string;
    active?: Prisma.BoolFilter<"Rubric"> | boolean;
    assignedUsers?: Prisma.UserListRelationFilter;
    inProgressUsers?: Prisma.UserListRelationFilter;
    completedUsers?: Prisma.UserListRelationFilter;
    scales?: Prisma.ScaleListRelationFilter;
};
export type RubricOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    assignedUsers?: Prisma.UserOrderByRelationAggregateInput;
    inProgressUsers?: Prisma.UserOrderByRelationAggregateInput;
    completedUsers?: Prisma.UserOrderByRelationAggregateInput;
    scales?: Prisma.ScaleOrderByRelationAggregateInput;
};
export type RubricWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.RubricWhereInput | Prisma.RubricWhereInput[];
    OR?: Prisma.RubricWhereInput[];
    NOT?: Prisma.RubricWhereInput | Prisma.RubricWhereInput[];
    title?: Prisma.StringFilter<"Rubric"> | string;
    description?: Prisma.StringFilter<"Rubric"> | string;
    active?: Prisma.BoolFilter<"Rubric"> | boolean;
    assignedUsers?: Prisma.UserListRelationFilter;
    inProgressUsers?: Prisma.UserListRelationFilter;
    completedUsers?: Prisma.UserListRelationFilter;
    scales?: Prisma.ScaleListRelationFilter;
}, "id">;
export type RubricOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    _count?: Prisma.RubricCountOrderByAggregateInput;
    _max?: Prisma.RubricMaxOrderByAggregateInput;
    _min?: Prisma.RubricMinOrderByAggregateInput;
};
export type RubricScalarWhereWithAggregatesInput = {
    AND?: Prisma.RubricScalarWhereWithAggregatesInput | Prisma.RubricScalarWhereWithAggregatesInput[];
    OR?: Prisma.RubricScalarWhereWithAggregatesInput[];
    NOT?: Prisma.RubricScalarWhereWithAggregatesInput | Prisma.RubricScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"Rubric"> | string;
    title?: Prisma.StringWithAggregatesFilter<"Rubric"> | string;
    description?: Prisma.StringWithAggregatesFilter<"Rubric"> | string;
    active?: Prisma.BoolWithAggregatesFilter<"Rubric"> | boolean;
};
export type RubricCreateInput = {
    id?: string;
    title: string;
    description: string;
    active?: boolean;
    assignedUsers?: Prisma.UserCreateNestedManyWithoutAssignedRubricsInput;
    inProgressUsers?: Prisma.UserCreateNestedManyWithoutInProgressRubricsInput;
    completedUsers?: Prisma.UserCreateNestedManyWithoutCompletedRubricsInput;
    scales?: Prisma.ScaleCreateNestedManyWithoutRubricInput;
};
export type RubricUncheckedCreateInput = {
    id?: string;
    title: string;
    description: string;
    active?: boolean;
    assignedUsers?: Prisma.UserUncheckedCreateNestedManyWithoutAssignedRubricsInput;
    inProgressUsers?: Prisma.UserUncheckedCreateNestedManyWithoutInProgressRubricsInput;
    completedUsers?: Prisma.UserUncheckedCreateNestedManyWithoutCompletedRubricsInput;
    scales?: Prisma.ScaleUncheckedCreateNestedManyWithoutRubricInput;
};
export type RubricUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    assignedUsers?: Prisma.UserUpdateManyWithoutAssignedRubricsNestedInput;
    inProgressUsers?: Prisma.UserUpdateManyWithoutInProgressRubricsNestedInput;
    completedUsers?: Prisma.UserUpdateManyWithoutCompletedRubricsNestedInput;
    scales?: Prisma.ScaleUpdateManyWithoutRubricNestedInput;
};
export type RubricUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    assignedUsers?: Prisma.UserUncheckedUpdateManyWithoutAssignedRubricsNestedInput;
    inProgressUsers?: Prisma.UserUncheckedUpdateManyWithoutInProgressRubricsNestedInput;
    completedUsers?: Prisma.UserUncheckedUpdateManyWithoutCompletedRubricsNestedInput;
    scales?: Prisma.ScaleUncheckedUpdateManyWithoutRubricNestedInput;
};
export type RubricCreateManyInput = {
    id?: string;
    title: string;
    description: string;
    active?: boolean;
};
export type RubricUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type RubricUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type RubricListRelationFilter = {
    every?: Prisma.RubricWhereInput;
    some?: Prisma.RubricWhereInput;
    none?: Prisma.RubricWhereInput;
};
export type RubricOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type RubricCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
};
export type RubricMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
};
export type RubricMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
};
export type RubricScalarRelationFilter = {
    is?: Prisma.RubricWhereInput;
    isNot?: Prisma.RubricWhereInput;
};
export type RubricCreateNestedManyWithoutAssignedUsersInput = {
    create?: Prisma.XOR<Prisma.RubricCreateWithoutAssignedUsersInput, Prisma.RubricUncheckedCreateWithoutAssignedUsersInput> | Prisma.RubricCreateWithoutAssignedUsersInput[] | Prisma.RubricUncheckedCreateWithoutAssignedUsersInput[];
    connectOrCreate?: Prisma.RubricCreateOrConnectWithoutAssignedUsersInput | Prisma.RubricCreateOrConnectWithoutAssignedUsersInput[];
    connect?: Prisma.RubricWhereUniqueInput | Prisma.RubricWhereUniqueInput[];
};
export type RubricCreateNestedManyWithoutInProgressUsersInput = {
    create?: Prisma.XOR<Prisma.RubricCreateWithoutInProgressUsersInput, Prisma.RubricUncheckedCreateWithoutInProgressUsersInput> | Prisma.RubricCreateWithoutInProgressUsersInput[] | Prisma.RubricUncheckedCreateWithoutInProgressUsersInput[];
    connectOrCreate?: Prisma.RubricCreateOrConnectWithoutInProgressUsersInput | Prisma.RubricCreateOrConnectWithoutInProgressUsersInput[];
    connect?: Prisma.RubricWhereUniqueInput | Prisma.RubricWhereUniqueInput[];
};
export type RubricCreateNestedManyWithoutCompletedUsersInput = {
    create?: Prisma.XOR<Prisma.RubricCreateWithoutCompletedUsersInput, Prisma.RubricUncheckedCreateWithoutCompletedUsersInput> | Prisma.RubricCreateWithoutCompletedUsersInput[] | Prisma.RubricUncheckedCreateWithoutCompletedUsersInput[];
    connectOrCreate?: Prisma.RubricCreateOrConnectWithoutCompletedUsersInput | Prisma.RubricCreateOrConnectWithoutCompletedUsersInput[];
    connect?: Prisma.RubricWhereUniqueInput | Prisma.RubricWhereUniqueInput[];
};
export type RubricUncheckedCreateNestedManyWithoutAssignedUsersInput = {
    create?: Prisma.XOR<Prisma.RubricCreateWithoutAssignedUsersInput, Prisma.RubricUncheckedCreateWithoutAssignedUsersInput> | Prisma.RubricCreateWithoutAssignedUsersInput[] | Prisma.RubricUncheckedCreateWithoutAssignedUsersInput[];
    connectOrCreate?: Prisma.RubricCreateOrConnectWithoutAssignedUsersInput | Prisma.RubricCreateOrConnectWithoutAssignedUsersInput[];
    connect?: Prisma.RubricWhereUniqueInput | Prisma.RubricWhereUniqueInput[];
};
export type RubricUncheckedCreateNestedManyWithoutInProgressUsersInput = {
    create?: Prisma.XOR<Prisma.RubricCreateWithoutInProgressUsersInput, Prisma.RubricUncheckedCreateWithoutInProgressUsersInput> | Prisma.RubricCreateWithoutInProgressUsersInput[] | Prisma.RubricUncheckedCreateWithoutInProgressUsersInput[];
    connectOrCreate?: Prisma.RubricCreateOrConnectWithoutInProgressUsersInput | Prisma.RubricCreateOrConnectWithoutInProgressUsersInput[];
    connect?: Prisma.RubricWhereUniqueInput | Prisma.RubricWhereUniqueInput[];
};
export type RubricUncheckedCreateNestedManyWithoutCompletedUsersInput = {
    create?: Prisma.XOR<Prisma.RubricCreateWithoutCompletedUsersInput, Prisma.RubricUncheckedCreateWithoutCompletedUsersInput> | Prisma.RubricCreateWithoutCompletedUsersInput[] | Prisma.RubricUncheckedCreateWithoutCompletedUsersInput[];
    connectOrCreate?: Prisma.RubricCreateOrConnectWithoutCompletedUsersInput | Prisma.RubricCreateOrConnectWithoutCompletedUsersInput[];
    connect?: Prisma.RubricWhereUniqueInput | Prisma.RubricWhereUniqueInput[];
};
export type RubricUpdateManyWithoutAssignedUsersNestedInput = {
    create?: Prisma.XOR<Prisma.RubricCreateWithoutAssignedUsersInput, Prisma.RubricUncheckedCreateWithoutAssignedUsersInput> | Prisma.RubricCreateWithoutAssignedUsersInput[] | Prisma.RubricUncheckedCreateWithoutAssignedUsersInput[];
    connectOrCreate?: Prisma.RubricCreateOrConnectWithoutAssignedUsersInput | Prisma.RubricCreateOrConnectWithoutAssignedUsersInput[];
    upsert?: Prisma.RubricUpsertWithWhereUniqueWithoutAssignedUsersInput | Prisma.RubricUpsertWithWhereUniqueWithoutAssignedUsersInput[];
    set?: Prisma.RubricWhereUniqueInput | Prisma.RubricWhereUniqueInput[];
    disconnect?: Prisma.RubricWhereUniqueInput | Prisma.RubricWhereUniqueInput[];
    delete?: Prisma.RubricWhereUniqueInput | Prisma.RubricWhereUniqueInput[];
    connect?: Prisma.RubricWhereUniqueInput | Prisma.RubricWhereUniqueInput[];
    update?: Prisma.RubricUpdateWithWhereUniqueWithoutAssignedUsersInput | Prisma.RubricUpdateWithWhereUniqueWithoutAssignedUsersInput[];
    updateMany?: Prisma.RubricUpdateManyWithWhereWithoutAssignedUsersInput | Prisma.RubricUpdateManyWithWhereWithoutAssignedUsersInput[];
    deleteMany?: Prisma.RubricScalarWhereInput | Prisma.RubricScalarWhereInput[];
};
export type RubricUpdateManyWithoutInProgressUsersNestedInput = {
    create?: Prisma.XOR<Prisma.RubricCreateWithoutInProgressUsersInput, Prisma.RubricUncheckedCreateWithoutInProgressUsersInput> | Prisma.RubricCreateWithoutInProgressUsersInput[] | Prisma.RubricUncheckedCreateWithoutInProgressUsersInput[];
    connectOrCreate?: Prisma.RubricCreateOrConnectWithoutInProgressUsersInput | Prisma.RubricCreateOrConnectWithoutInProgressUsersInput[];
    upsert?: Prisma.RubricUpsertWithWhereUniqueWithoutInProgressUsersInput | Prisma.RubricUpsertWithWhereUniqueWithoutInProgressUsersInput[];
    set?: Prisma.RubricWhereUniqueInput | Prisma.RubricWhereUniqueInput[];
    disconnect?: Prisma.RubricWhereUniqueInput | Prisma.RubricWhereUniqueInput[];
    delete?: Prisma.RubricWhereUniqueInput | Prisma.RubricWhereUniqueInput[];
    connect?: Prisma.RubricWhereUniqueInput | Prisma.RubricWhereUniqueInput[];
    update?: Prisma.RubricUpdateWithWhereUniqueWithoutInProgressUsersInput | Prisma.RubricUpdateWithWhereUniqueWithoutInProgressUsersInput[];
    updateMany?: Prisma.RubricUpdateManyWithWhereWithoutInProgressUsersInput | Prisma.RubricUpdateManyWithWhereWithoutInProgressUsersInput[];
    deleteMany?: Prisma.RubricScalarWhereInput | Prisma.RubricScalarWhereInput[];
};
export type RubricUpdateManyWithoutCompletedUsersNestedInput = {
    create?: Prisma.XOR<Prisma.RubricCreateWithoutCompletedUsersInput, Prisma.RubricUncheckedCreateWithoutCompletedUsersInput> | Prisma.RubricCreateWithoutCompletedUsersInput[] | Prisma.RubricUncheckedCreateWithoutCompletedUsersInput[];
    connectOrCreate?: Prisma.RubricCreateOrConnectWithoutCompletedUsersInput | Prisma.RubricCreateOrConnectWithoutCompletedUsersInput[];
    upsert?: Prisma.RubricUpsertWithWhereUniqueWithoutCompletedUsersInput | Prisma.RubricUpsertWithWhereUniqueWithoutCompletedUsersInput[];
    set?: Prisma.RubricWhereUniqueInput | Prisma.RubricWhereUniqueInput[];
    disconnect?: Prisma.RubricWhereUniqueInput | Prisma.RubricWhereUniqueInput[];
    delete?: Prisma.RubricWhereUniqueInput | Prisma.RubricWhereUniqueInput[];
    connect?: Prisma.RubricWhereUniqueInput | Prisma.RubricWhereUniqueInput[];
    update?: Prisma.RubricUpdateWithWhereUniqueWithoutCompletedUsersInput | Prisma.RubricUpdateWithWhereUniqueWithoutCompletedUsersInput[];
    updateMany?: Prisma.RubricUpdateManyWithWhereWithoutCompletedUsersInput | Prisma.RubricUpdateManyWithWhereWithoutCompletedUsersInput[];
    deleteMany?: Prisma.RubricScalarWhereInput | Prisma.RubricScalarWhereInput[];
};
export type RubricUncheckedUpdateManyWithoutAssignedUsersNestedInput = {
    create?: Prisma.XOR<Prisma.RubricCreateWithoutAssignedUsersInput, Prisma.RubricUncheckedCreateWithoutAssignedUsersInput> | Prisma.RubricCreateWithoutAssignedUsersInput[] | Prisma.RubricUncheckedCreateWithoutAssignedUsersInput[];
    connectOrCreate?: Prisma.RubricCreateOrConnectWithoutAssignedUsersInput | Prisma.RubricCreateOrConnectWithoutAssignedUsersInput[];
    upsert?: Prisma.RubricUpsertWithWhereUniqueWithoutAssignedUsersInput | Prisma.RubricUpsertWithWhereUniqueWithoutAssignedUsersInput[];
    set?: Prisma.RubricWhereUniqueInput | Prisma.RubricWhereUniqueInput[];
    disconnect?: Prisma.RubricWhereUniqueInput | Prisma.RubricWhereUniqueInput[];
    delete?: Prisma.RubricWhereUniqueInput | Prisma.RubricWhereUniqueInput[];
    connect?: Prisma.RubricWhereUniqueInput | Prisma.RubricWhereUniqueInput[];
    update?: Prisma.RubricUpdateWithWhereUniqueWithoutAssignedUsersInput | Prisma.RubricUpdateWithWhereUniqueWithoutAssignedUsersInput[];
    updateMany?: Prisma.RubricUpdateManyWithWhereWithoutAssignedUsersInput | Prisma.RubricUpdateManyWithWhereWithoutAssignedUsersInput[];
    deleteMany?: Prisma.RubricScalarWhereInput | Prisma.RubricScalarWhereInput[];
};
export type RubricUncheckedUpdateManyWithoutInProgressUsersNestedInput = {
    create?: Prisma.XOR<Prisma.RubricCreateWithoutInProgressUsersInput, Prisma.RubricUncheckedCreateWithoutInProgressUsersInput> | Prisma.RubricCreateWithoutInProgressUsersInput[] | Prisma.RubricUncheckedCreateWithoutInProgressUsersInput[];
    connectOrCreate?: Prisma.RubricCreateOrConnectWithoutInProgressUsersInput | Prisma.RubricCreateOrConnectWithoutInProgressUsersInput[];
    upsert?: Prisma.RubricUpsertWithWhereUniqueWithoutInProgressUsersInput | Prisma.RubricUpsertWithWhereUniqueWithoutInProgressUsersInput[];
    set?: Prisma.RubricWhereUniqueInput | Prisma.RubricWhereUniqueInput[];
    disconnect?: Prisma.RubricWhereUniqueInput | Prisma.RubricWhereUniqueInput[];
    delete?: Prisma.RubricWhereUniqueInput | Prisma.RubricWhereUniqueInput[];
    connect?: Prisma.RubricWhereUniqueInput | Prisma.RubricWhereUniqueInput[];
    update?: Prisma.RubricUpdateWithWhereUniqueWithoutInProgressUsersInput | Prisma.RubricUpdateWithWhereUniqueWithoutInProgressUsersInput[];
    updateMany?: Prisma.RubricUpdateManyWithWhereWithoutInProgressUsersInput | Prisma.RubricUpdateManyWithWhereWithoutInProgressUsersInput[];
    deleteMany?: Prisma.RubricScalarWhereInput | Prisma.RubricScalarWhereInput[];
};
export type RubricUncheckedUpdateManyWithoutCompletedUsersNestedInput = {
    create?: Prisma.XOR<Prisma.RubricCreateWithoutCompletedUsersInput, Prisma.RubricUncheckedCreateWithoutCompletedUsersInput> | Prisma.RubricCreateWithoutCompletedUsersInput[] | Prisma.RubricUncheckedCreateWithoutCompletedUsersInput[];
    connectOrCreate?: Prisma.RubricCreateOrConnectWithoutCompletedUsersInput | Prisma.RubricCreateOrConnectWithoutCompletedUsersInput[];
    upsert?: Prisma.RubricUpsertWithWhereUniqueWithoutCompletedUsersInput | Prisma.RubricUpsertWithWhereUniqueWithoutCompletedUsersInput[];
    set?: Prisma.RubricWhereUniqueInput | Prisma.RubricWhereUniqueInput[];
    disconnect?: Prisma.RubricWhereUniqueInput | Prisma.RubricWhereUniqueInput[];
    delete?: Prisma.RubricWhereUniqueInput | Prisma.RubricWhereUniqueInput[];
    connect?: Prisma.RubricWhereUniqueInput | Prisma.RubricWhereUniqueInput[];
    update?: Prisma.RubricUpdateWithWhereUniqueWithoutCompletedUsersInput | Prisma.RubricUpdateWithWhereUniqueWithoutCompletedUsersInput[];
    updateMany?: Prisma.RubricUpdateManyWithWhereWithoutCompletedUsersInput | Prisma.RubricUpdateManyWithWhereWithoutCompletedUsersInput[];
    deleteMany?: Prisma.RubricScalarWhereInput | Prisma.RubricScalarWhereInput[];
};
export type BoolFieldUpdateOperationsInput = {
    set?: boolean;
};
export type RubricCreateNestedOneWithoutScalesInput = {
    create?: Prisma.XOR<Prisma.RubricCreateWithoutScalesInput, Prisma.RubricUncheckedCreateWithoutScalesInput>;
    connectOrCreate?: Prisma.RubricCreateOrConnectWithoutScalesInput;
    connect?: Prisma.RubricWhereUniqueInput;
};
export type RubricUpdateOneRequiredWithoutScalesNestedInput = {
    create?: Prisma.XOR<Prisma.RubricCreateWithoutScalesInput, Prisma.RubricUncheckedCreateWithoutScalesInput>;
    connectOrCreate?: Prisma.RubricCreateOrConnectWithoutScalesInput;
    upsert?: Prisma.RubricUpsertWithoutScalesInput;
    connect?: Prisma.RubricWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.RubricUpdateToOneWithWhereWithoutScalesInput, Prisma.RubricUpdateWithoutScalesInput>, Prisma.RubricUncheckedUpdateWithoutScalesInput>;
};
export type RubricCreateWithoutAssignedUsersInput = {
    id?: string;
    title: string;
    description: string;
    active?: boolean;
    inProgressUsers?: Prisma.UserCreateNestedManyWithoutInProgressRubricsInput;
    completedUsers?: Prisma.UserCreateNestedManyWithoutCompletedRubricsInput;
    scales?: Prisma.ScaleCreateNestedManyWithoutRubricInput;
};
export type RubricUncheckedCreateWithoutAssignedUsersInput = {
    id?: string;
    title: string;
    description: string;
    active?: boolean;
    inProgressUsers?: Prisma.UserUncheckedCreateNestedManyWithoutInProgressRubricsInput;
    completedUsers?: Prisma.UserUncheckedCreateNestedManyWithoutCompletedRubricsInput;
    scales?: Prisma.ScaleUncheckedCreateNestedManyWithoutRubricInput;
};
export type RubricCreateOrConnectWithoutAssignedUsersInput = {
    where: Prisma.RubricWhereUniqueInput;
    create: Prisma.XOR<Prisma.RubricCreateWithoutAssignedUsersInput, Prisma.RubricUncheckedCreateWithoutAssignedUsersInput>;
};
export type RubricCreateWithoutInProgressUsersInput = {
    id?: string;
    title: string;
    description: string;
    active?: boolean;
    assignedUsers?: Prisma.UserCreateNestedManyWithoutAssignedRubricsInput;
    completedUsers?: Prisma.UserCreateNestedManyWithoutCompletedRubricsInput;
    scales?: Prisma.ScaleCreateNestedManyWithoutRubricInput;
};
export type RubricUncheckedCreateWithoutInProgressUsersInput = {
    id?: string;
    title: string;
    description: string;
    active?: boolean;
    assignedUsers?: Prisma.UserUncheckedCreateNestedManyWithoutAssignedRubricsInput;
    completedUsers?: Prisma.UserUncheckedCreateNestedManyWithoutCompletedRubricsInput;
    scales?: Prisma.ScaleUncheckedCreateNestedManyWithoutRubricInput;
};
export type RubricCreateOrConnectWithoutInProgressUsersInput = {
    where: Prisma.RubricWhereUniqueInput;
    create: Prisma.XOR<Prisma.RubricCreateWithoutInProgressUsersInput, Prisma.RubricUncheckedCreateWithoutInProgressUsersInput>;
};
export type RubricCreateWithoutCompletedUsersInput = {
    id?: string;
    title: string;
    description: string;
    active?: boolean;
    assignedUsers?: Prisma.UserCreateNestedManyWithoutAssignedRubricsInput;
    inProgressUsers?: Prisma.UserCreateNestedManyWithoutInProgressRubricsInput;
    scales?: Prisma.ScaleCreateNestedManyWithoutRubricInput;
};
export type RubricUncheckedCreateWithoutCompletedUsersInput = {
    id?: string;
    title: string;
    description: string;
    active?: boolean;
    assignedUsers?: Prisma.UserUncheckedCreateNestedManyWithoutAssignedRubricsInput;
    inProgressUsers?: Prisma.UserUncheckedCreateNestedManyWithoutInProgressRubricsInput;
    scales?: Prisma.ScaleUncheckedCreateNestedManyWithoutRubricInput;
};
export type RubricCreateOrConnectWithoutCompletedUsersInput = {
    where: Prisma.RubricWhereUniqueInput;
    create: Prisma.XOR<Prisma.RubricCreateWithoutCompletedUsersInput, Prisma.RubricUncheckedCreateWithoutCompletedUsersInput>;
};
export type RubricUpsertWithWhereUniqueWithoutAssignedUsersInput = {
    where: Prisma.RubricWhereUniqueInput;
    update: Prisma.XOR<Prisma.RubricUpdateWithoutAssignedUsersInput, Prisma.RubricUncheckedUpdateWithoutAssignedUsersInput>;
    create: Prisma.XOR<Prisma.RubricCreateWithoutAssignedUsersInput, Prisma.RubricUncheckedCreateWithoutAssignedUsersInput>;
};
export type RubricUpdateWithWhereUniqueWithoutAssignedUsersInput = {
    where: Prisma.RubricWhereUniqueInput;
    data: Prisma.XOR<Prisma.RubricUpdateWithoutAssignedUsersInput, Prisma.RubricUncheckedUpdateWithoutAssignedUsersInput>;
};
export type RubricUpdateManyWithWhereWithoutAssignedUsersInput = {
    where: Prisma.RubricScalarWhereInput;
    data: Prisma.XOR<Prisma.RubricUpdateManyMutationInput, Prisma.RubricUncheckedUpdateManyWithoutAssignedUsersInput>;
};
export type RubricScalarWhereInput = {
    AND?: Prisma.RubricScalarWhereInput | Prisma.RubricScalarWhereInput[];
    OR?: Prisma.RubricScalarWhereInput[];
    NOT?: Prisma.RubricScalarWhereInput | Prisma.RubricScalarWhereInput[];
    id?: Prisma.UuidFilter<"Rubric"> | string;
    title?: Prisma.StringFilter<"Rubric"> | string;
    description?: Prisma.StringFilter<"Rubric"> | string;
    active?: Prisma.BoolFilter<"Rubric"> | boolean;
};
export type RubricUpsertWithWhereUniqueWithoutInProgressUsersInput = {
    where: Prisma.RubricWhereUniqueInput;
    update: Prisma.XOR<Prisma.RubricUpdateWithoutInProgressUsersInput, Prisma.RubricUncheckedUpdateWithoutInProgressUsersInput>;
    create: Prisma.XOR<Prisma.RubricCreateWithoutInProgressUsersInput, Prisma.RubricUncheckedCreateWithoutInProgressUsersInput>;
};
export type RubricUpdateWithWhereUniqueWithoutInProgressUsersInput = {
    where: Prisma.RubricWhereUniqueInput;
    data: Prisma.XOR<Prisma.RubricUpdateWithoutInProgressUsersInput, Prisma.RubricUncheckedUpdateWithoutInProgressUsersInput>;
};
export type RubricUpdateManyWithWhereWithoutInProgressUsersInput = {
    where: Prisma.RubricScalarWhereInput;
    data: Prisma.XOR<Prisma.RubricUpdateManyMutationInput, Prisma.RubricUncheckedUpdateManyWithoutInProgressUsersInput>;
};
export type RubricUpsertWithWhereUniqueWithoutCompletedUsersInput = {
    where: Prisma.RubricWhereUniqueInput;
    update: Prisma.XOR<Prisma.RubricUpdateWithoutCompletedUsersInput, Prisma.RubricUncheckedUpdateWithoutCompletedUsersInput>;
    create: Prisma.XOR<Prisma.RubricCreateWithoutCompletedUsersInput, Prisma.RubricUncheckedCreateWithoutCompletedUsersInput>;
};
export type RubricUpdateWithWhereUniqueWithoutCompletedUsersInput = {
    where: Prisma.RubricWhereUniqueInput;
    data: Prisma.XOR<Prisma.RubricUpdateWithoutCompletedUsersInput, Prisma.RubricUncheckedUpdateWithoutCompletedUsersInput>;
};
export type RubricUpdateManyWithWhereWithoutCompletedUsersInput = {
    where: Prisma.RubricScalarWhereInput;
    data: Prisma.XOR<Prisma.RubricUpdateManyMutationInput, Prisma.RubricUncheckedUpdateManyWithoutCompletedUsersInput>;
};
export type RubricCreateWithoutScalesInput = {
    id?: string;
    title: string;
    description: string;
    active?: boolean;
    assignedUsers?: Prisma.UserCreateNestedManyWithoutAssignedRubricsInput;
    inProgressUsers?: Prisma.UserCreateNestedManyWithoutInProgressRubricsInput;
    completedUsers?: Prisma.UserCreateNestedManyWithoutCompletedRubricsInput;
};
export type RubricUncheckedCreateWithoutScalesInput = {
    id?: string;
    title: string;
    description: string;
    active?: boolean;
    assignedUsers?: Prisma.UserUncheckedCreateNestedManyWithoutAssignedRubricsInput;
    inProgressUsers?: Prisma.UserUncheckedCreateNestedManyWithoutInProgressRubricsInput;
    completedUsers?: Prisma.UserUncheckedCreateNestedManyWithoutCompletedRubricsInput;
};
export type RubricCreateOrConnectWithoutScalesInput = {
    where: Prisma.RubricWhereUniqueInput;
    create: Prisma.XOR<Prisma.RubricCreateWithoutScalesInput, Prisma.RubricUncheckedCreateWithoutScalesInput>;
};
export type RubricUpsertWithoutScalesInput = {
    update: Prisma.XOR<Prisma.RubricUpdateWithoutScalesInput, Prisma.RubricUncheckedUpdateWithoutScalesInput>;
    create: Prisma.XOR<Prisma.RubricCreateWithoutScalesInput, Prisma.RubricUncheckedCreateWithoutScalesInput>;
    where?: Prisma.RubricWhereInput;
};
export type RubricUpdateToOneWithWhereWithoutScalesInput = {
    where?: Prisma.RubricWhereInput;
    data: Prisma.XOR<Prisma.RubricUpdateWithoutScalesInput, Prisma.RubricUncheckedUpdateWithoutScalesInput>;
};
export type RubricUpdateWithoutScalesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    assignedUsers?: Prisma.UserUpdateManyWithoutAssignedRubricsNestedInput;
    inProgressUsers?: Prisma.UserUpdateManyWithoutInProgressRubricsNestedInput;
    completedUsers?: Prisma.UserUpdateManyWithoutCompletedRubricsNestedInput;
};
export type RubricUncheckedUpdateWithoutScalesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    assignedUsers?: Prisma.UserUncheckedUpdateManyWithoutAssignedRubricsNestedInput;
    inProgressUsers?: Prisma.UserUncheckedUpdateManyWithoutInProgressRubricsNestedInput;
    completedUsers?: Prisma.UserUncheckedUpdateManyWithoutCompletedRubricsNestedInput;
};
export type RubricUpdateWithoutAssignedUsersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    inProgressUsers?: Prisma.UserUpdateManyWithoutInProgressRubricsNestedInput;
    completedUsers?: Prisma.UserUpdateManyWithoutCompletedRubricsNestedInput;
    scales?: Prisma.ScaleUpdateManyWithoutRubricNestedInput;
};
export type RubricUncheckedUpdateWithoutAssignedUsersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    inProgressUsers?: Prisma.UserUncheckedUpdateManyWithoutInProgressRubricsNestedInput;
    completedUsers?: Prisma.UserUncheckedUpdateManyWithoutCompletedRubricsNestedInput;
    scales?: Prisma.ScaleUncheckedUpdateManyWithoutRubricNestedInput;
};
export type RubricUncheckedUpdateManyWithoutAssignedUsersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type RubricUpdateWithoutInProgressUsersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    assignedUsers?: Prisma.UserUpdateManyWithoutAssignedRubricsNestedInput;
    completedUsers?: Prisma.UserUpdateManyWithoutCompletedRubricsNestedInput;
    scales?: Prisma.ScaleUpdateManyWithoutRubricNestedInput;
};
export type RubricUncheckedUpdateWithoutInProgressUsersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    assignedUsers?: Prisma.UserUncheckedUpdateManyWithoutAssignedRubricsNestedInput;
    completedUsers?: Prisma.UserUncheckedUpdateManyWithoutCompletedRubricsNestedInput;
    scales?: Prisma.ScaleUncheckedUpdateManyWithoutRubricNestedInput;
};
export type RubricUncheckedUpdateManyWithoutInProgressUsersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type RubricUpdateWithoutCompletedUsersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    assignedUsers?: Prisma.UserUpdateManyWithoutAssignedRubricsNestedInput;
    inProgressUsers?: Prisma.UserUpdateManyWithoutInProgressRubricsNestedInput;
    scales?: Prisma.ScaleUpdateManyWithoutRubricNestedInput;
};
export type RubricUncheckedUpdateWithoutCompletedUsersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    assignedUsers?: Prisma.UserUncheckedUpdateManyWithoutAssignedRubricsNestedInput;
    inProgressUsers?: Prisma.UserUncheckedUpdateManyWithoutInProgressRubricsNestedInput;
    scales?: Prisma.ScaleUncheckedUpdateManyWithoutRubricNestedInput;
};
export type RubricUncheckedUpdateManyWithoutCompletedUsersInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
/**
 * Count Type RubricCountOutputType
 */
export type RubricCountOutputType = {
    assignedUsers: number;
    inProgressUsers: number;
    completedUsers: number;
    scales: number;
};
export type RubricCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    assignedUsers?: boolean | RubricCountOutputTypeCountAssignedUsersArgs;
    inProgressUsers?: boolean | RubricCountOutputTypeCountInProgressUsersArgs;
    completedUsers?: boolean | RubricCountOutputTypeCountCompletedUsersArgs;
    scales?: boolean | RubricCountOutputTypeCountScalesArgs;
};
/**
 * RubricCountOutputType without action
 */
export type RubricCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the RubricCountOutputType
     */
    select?: Prisma.RubricCountOutputTypeSelect<ExtArgs> | null;
};
/**
 * RubricCountOutputType without action
 */
export type RubricCountOutputTypeCountAssignedUsersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
};
/**
 * RubricCountOutputType without action
 */
export type RubricCountOutputTypeCountInProgressUsersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
};
/**
 * RubricCountOutputType without action
 */
export type RubricCountOutputTypeCountCompletedUsersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
};
/**
 * RubricCountOutputType without action
 */
export type RubricCountOutputTypeCountScalesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ScaleWhereInput;
};
export type RubricSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    title?: boolean;
    description?: boolean;
    active?: boolean;
    assignedUsers?: boolean | Prisma.Rubric$assignedUsersArgs<ExtArgs>;
    inProgressUsers?: boolean | Prisma.Rubric$inProgressUsersArgs<ExtArgs>;
    completedUsers?: boolean | Prisma.Rubric$completedUsersArgs<ExtArgs>;
    scales?: boolean | Prisma.Rubric$scalesArgs<ExtArgs>;
    _count?: boolean | Prisma.RubricCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["rubric"]>;
export type RubricSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    title?: boolean;
    description?: boolean;
    active?: boolean;
}, ExtArgs["result"]["rubric"]>;
export type RubricSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    title?: boolean;
    description?: boolean;
    active?: boolean;
}, ExtArgs["result"]["rubric"]>;
export type RubricSelectScalar = {
    id?: boolean;
    title?: boolean;
    description?: boolean;
    active?: boolean;
};
export type RubricOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "title" | "description" | "active", ExtArgs["result"]["rubric"]>;
export type RubricInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    assignedUsers?: boolean | Prisma.Rubric$assignedUsersArgs<ExtArgs>;
    inProgressUsers?: boolean | Prisma.Rubric$inProgressUsersArgs<ExtArgs>;
    completedUsers?: boolean | Prisma.Rubric$completedUsersArgs<ExtArgs>;
    scales?: boolean | Prisma.Rubric$scalesArgs<ExtArgs>;
    _count?: boolean | Prisma.RubricCountOutputTypeDefaultArgs<ExtArgs>;
};
export type RubricIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type RubricIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $RubricPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Rubric";
    objects: {
        assignedUsers: Prisma.$UserPayload<ExtArgs>[];
        inProgressUsers: Prisma.$UserPayload<ExtArgs>[];
        completedUsers: Prisma.$UserPayload<ExtArgs>[];
        scales: Prisma.$ScalePayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        title: string;
        description: string;
        active: boolean;
    }, ExtArgs["result"]["rubric"]>;
    composites: {};
};
export type RubricGetPayload<S extends boolean | null | undefined | RubricDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$RubricPayload, S>;
export type RubricCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<RubricFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: RubricCountAggregateInputType | true;
};
export interface RubricDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Rubric'];
        meta: {
            name: 'Rubric';
        };
    };
    /**
     * Find zero or one Rubric that matches the filter.
     * @param {RubricFindUniqueArgs} args - Arguments to find a Rubric
     * @example
     * // Get one Rubric
     * const rubric = await prisma.rubric.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends RubricFindUniqueArgs>(args: Prisma.SelectSubset<T, RubricFindUniqueArgs<ExtArgs>>): Prisma.Prisma__RubricClient<runtime.Types.Result.GetResult<Prisma.$RubricPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Rubric that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {RubricFindUniqueOrThrowArgs} args - Arguments to find a Rubric
     * @example
     * // Get one Rubric
     * const rubric = await prisma.rubric.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends RubricFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, RubricFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__RubricClient<runtime.Types.Result.GetResult<Prisma.$RubricPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Rubric that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RubricFindFirstArgs} args - Arguments to find a Rubric
     * @example
     * // Get one Rubric
     * const rubric = await prisma.rubric.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends RubricFindFirstArgs>(args?: Prisma.SelectSubset<T, RubricFindFirstArgs<ExtArgs>>): Prisma.Prisma__RubricClient<runtime.Types.Result.GetResult<Prisma.$RubricPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Rubric that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RubricFindFirstOrThrowArgs} args - Arguments to find a Rubric
     * @example
     * // Get one Rubric
     * const rubric = await prisma.rubric.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends RubricFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, RubricFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__RubricClient<runtime.Types.Result.GetResult<Prisma.$RubricPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Rubrics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RubricFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Rubrics
     * const rubrics = await prisma.rubric.findMany()
     *
     * // Get first 10 Rubrics
     * const rubrics = await prisma.rubric.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const rubricWithIdOnly = await prisma.rubric.findMany({ select: { id: true } })
     *
     */
    findMany<T extends RubricFindManyArgs>(args?: Prisma.SelectSubset<T, RubricFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RubricPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Rubric.
     * @param {RubricCreateArgs} args - Arguments to create a Rubric.
     * @example
     * // Create one Rubric
     * const Rubric = await prisma.rubric.create({
     *   data: {
     *     // ... data to create a Rubric
     *   }
     * })
     *
     */
    create<T extends RubricCreateArgs>(args: Prisma.SelectSubset<T, RubricCreateArgs<ExtArgs>>): Prisma.Prisma__RubricClient<runtime.Types.Result.GetResult<Prisma.$RubricPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Rubrics.
     * @param {RubricCreateManyArgs} args - Arguments to create many Rubrics.
     * @example
     * // Create many Rubrics
     * const rubric = await prisma.rubric.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends RubricCreateManyArgs>(args?: Prisma.SelectSubset<T, RubricCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many Rubrics and returns the data saved in the database.
     * @param {RubricCreateManyAndReturnArgs} args - Arguments to create many Rubrics.
     * @example
     * // Create many Rubrics
     * const rubric = await prisma.rubric.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Rubrics and only return the `id`
     * const rubricWithIdOnly = await prisma.rubric.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends RubricCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, RubricCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RubricPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a Rubric.
     * @param {RubricDeleteArgs} args - Arguments to delete one Rubric.
     * @example
     * // Delete one Rubric
     * const Rubric = await prisma.rubric.delete({
     *   where: {
     *     // ... filter to delete one Rubric
     *   }
     * })
     *
     */
    delete<T extends RubricDeleteArgs>(args: Prisma.SelectSubset<T, RubricDeleteArgs<ExtArgs>>): Prisma.Prisma__RubricClient<runtime.Types.Result.GetResult<Prisma.$RubricPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Rubric.
     * @param {RubricUpdateArgs} args - Arguments to update one Rubric.
     * @example
     * // Update one Rubric
     * const rubric = await prisma.rubric.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends RubricUpdateArgs>(args: Prisma.SelectSubset<T, RubricUpdateArgs<ExtArgs>>): Prisma.Prisma__RubricClient<runtime.Types.Result.GetResult<Prisma.$RubricPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Rubrics.
     * @param {RubricDeleteManyArgs} args - Arguments to filter Rubrics to delete.
     * @example
     * // Delete a few Rubrics
     * const { count } = await prisma.rubric.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends RubricDeleteManyArgs>(args?: Prisma.SelectSubset<T, RubricDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Rubrics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RubricUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Rubrics
     * const rubric = await prisma.rubric.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends RubricUpdateManyArgs>(args: Prisma.SelectSubset<T, RubricUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Rubrics and returns the data updated in the database.
     * @param {RubricUpdateManyAndReturnArgs} args - Arguments to update many Rubrics.
     * @example
     * // Update many Rubrics
     * const rubric = await prisma.rubric.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Rubrics and only return the `id`
     * const rubricWithIdOnly = await prisma.rubric.updateManyAndReturn({
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
    updateManyAndReturn<T extends RubricUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, RubricUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RubricPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one Rubric.
     * @param {RubricUpsertArgs} args - Arguments to update or create a Rubric.
     * @example
     * // Update or create a Rubric
     * const rubric = await prisma.rubric.upsert({
     *   create: {
     *     // ... data to create a Rubric
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Rubric we want to update
     *   }
     * })
     */
    upsert<T extends RubricUpsertArgs>(args: Prisma.SelectSubset<T, RubricUpsertArgs<ExtArgs>>): Prisma.Prisma__RubricClient<runtime.Types.Result.GetResult<Prisma.$RubricPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of Rubrics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RubricCountArgs} args - Arguments to filter Rubrics to count.
     * @example
     * // Count the number of Rubrics
     * const count = await prisma.rubric.count({
     *   where: {
     *     // ... the filter for the Rubrics we want to count
     *   }
     * })
    **/
    count<T extends RubricCountArgs>(args?: Prisma.Subset<T, RubricCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], RubricCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Rubric.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RubricAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends RubricAggregateArgs>(args: Prisma.Subset<T, RubricAggregateArgs>): Prisma.PrismaPromise<GetRubricAggregateType<T>>;
    /**
     * Group by Rubric.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {RubricGroupByArgs} args - Group by arguments.
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
    groupBy<T extends RubricGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: RubricGroupByArgs['orderBy'];
    } : {
        orderBy?: RubricGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, RubricGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRubricGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Rubric model
     */
    readonly fields: RubricFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for Rubric.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__RubricClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    assignedUsers<T extends Prisma.Rubric$assignedUsersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Rubric$assignedUsersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    inProgressUsers<T extends Prisma.Rubric$inProgressUsersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Rubric$inProgressUsersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    completedUsers<T extends Prisma.Rubric$completedUsersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Rubric$completedUsersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    scales<T extends Prisma.Rubric$scalesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Rubric$scalesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ScalePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
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
 * Fields of the Rubric model
 */
export interface RubricFieldRefs {
    readonly id: Prisma.FieldRef<"Rubric", 'String'>;
    readonly title: Prisma.FieldRef<"Rubric", 'String'>;
    readonly description: Prisma.FieldRef<"Rubric", 'String'>;
    readonly active: Prisma.FieldRef<"Rubric", 'Boolean'>;
}
/**
 * Rubric findUnique
 */
export type RubricFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rubric
     */
    select?: Prisma.RubricSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Rubric
     */
    omit?: Prisma.RubricOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RubricInclude<ExtArgs> | null;
    /**
     * Filter, which Rubric to fetch.
     */
    where: Prisma.RubricWhereUniqueInput;
};
/**
 * Rubric findUniqueOrThrow
 */
export type RubricFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rubric
     */
    select?: Prisma.RubricSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Rubric
     */
    omit?: Prisma.RubricOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RubricInclude<ExtArgs> | null;
    /**
     * Filter, which Rubric to fetch.
     */
    where: Prisma.RubricWhereUniqueInput;
};
/**
 * Rubric findFirst
 */
export type RubricFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rubric
     */
    select?: Prisma.RubricSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Rubric
     */
    omit?: Prisma.RubricOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RubricInclude<ExtArgs> | null;
    /**
     * Filter, which Rubric to fetch.
     */
    where?: Prisma.RubricWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Rubrics to fetch.
     */
    orderBy?: Prisma.RubricOrderByWithRelationInput | Prisma.RubricOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Rubrics.
     */
    cursor?: Prisma.RubricWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Rubrics from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Rubrics.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Rubrics.
     */
    distinct?: Prisma.RubricScalarFieldEnum | Prisma.RubricScalarFieldEnum[];
};
/**
 * Rubric findFirstOrThrow
 */
export type RubricFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rubric
     */
    select?: Prisma.RubricSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Rubric
     */
    omit?: Prisma.RubricOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RubricInclude<ExtArgs> | null;
    /**
     * Filter, which Rubric to fetch.
     */
    where?: Prisma.RubricWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Rubrics to fetch.
     */
    orderBy?: Prisma.RubricOrderByWithRelationInput | Prisma.RubricOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Rubrics.
     */
    cursor?: Prisma.RubricWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Rubrics from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Rubrics.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Rubrics.
     */
    distinct?: Prisma.RubricScalarFieldEnum | Prisma.RubricScalarFieldEnum[];
};
/**
 * Rubric findMany
 */
export type RubricFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rubric
     */
    select?: Prisma.RubricSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Rubric
     */
    omit?: Prisma.RubricOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RubricInclude<ExtArgs> | null;
    /**
     * Filter, which Rubrics to fetch.
     */
    where?: Prisma.RubricWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Rubrics to fetch.
     */
    orderBy?: Prisma.RubricOrderByWithRelationInput | Prisma.RubricOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Rubrics.
     */
    cursor?: Prisma.RubricWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Rubrics from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Rubrics.
     */
    skip?: number;
    distinct?: Prisma.RubricScalarFieldEnum | Prisma.RubricScalarFieldEnum[];
};
/**
 * Rubric create
 */
export type RubricCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rubric
     */
    select?: Prisma.RubricSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Rubric
     */
    omit?: Prisma.RubricOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RubricInclude<ExtArgs> | null;
    /**
     * The data needed to create a Rubric.
     */
    data: Prisma.XOR<Prisma.RubricCreateInput, Prisma.RubricUncheckedCreateInput>;
};
/**
 * Rubric createMany
 */
export type RubricCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many Rubrics.
     */
    data: Prisma.RubricCreateManyInput | Prisma.RubricCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * Rubric createManyAndReturn
 */
export type RubricCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rubric
     */
    select?: Prisma.RubricSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Rubric
     */
    omit?: Prisma.RubricOmit<ExtArgs> | null;
    /**
     * The data used to create many Rubrics.
     */
    data: Prisma.RubricCreateManyInput | Prisma.RubricCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * Rubric update
 */
export type RubricUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rubric
     */
    select?: Prisma.RubricSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Rubric
     */
    omit?: Prisma.RubricOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RubricInclude<ExtArgs> | null;
    /**
     * The data needed to update a Rubric.
     */
    data: Prisma.XOR<Prisma.RubricUpdateInput, Prisma.RubricUncheckedUpdateInput>;
    /**
     * Choose, which Rubric to update.
     */
    where: Prisma.RubricWhereUniqueInput;
};
/**
 * Rubric updateMany
 */
export type RubricUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update Rubrics.
     */
    data: Prisma.XOR<Prisma.RubricUpdateManyMutationInput, Prisma.RubricUncheckedUpdateManyInput>;
    /**
     * Filter which Rubrics to update
     */
    where?: Prisma.RubricWhereInput;
    /**
     * Limit how many Rubrics to update.
     */
    limit?: number;
};
/**
 * Rubric updateManyAndReturn
 */
export type RubricUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rubric
     */
    select?: Prisma.RubricSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Rubric
     */
    omit?: Prisma.RubricOmit<ExtArgs> | null;
    /**
     * The data used to update Rubrics.
     */
    data: Prisma.XOR<Prisma.RubricUpdateManyMutationInput, Prisma.RubricUncheckedUpdateManyInput>;
    /**
     * Filter which Rubrics to update
     */
    where?: Prisma.RubricWhereInput;
    /**
     * Limit how many Rubrics to update.
     */
    limit?: number;
};
/**
 * Rubric upsert
 */
export type RubricUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rubric
     */
    select?: Prisma.RubricSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Rubric
     */
    omit?: Prisma.RubricOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RubricInclude<ExtArgs> | null;
    /**
     * The filter to search for the Rubric to update in case it exists.
     */
    where: Prisma.RubricWhereUniqueInput;
    /**
     * In case the Rubric found by the `where` argument doesn't exist, create a new Rubric with this data.
     */
    create: Prisma.XOR<Prisma.RubricCreateInput, Prisma.RubricUncheckedCreateInput>;
    /**
     * In case the Rubric was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.RubricUpdateInput, Prisma.RubricUncheckedUpdateInput>;
};
/**
 * Rubric delete
 */
export type RubricDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rubric
     */
    select?: Prisma.RubricSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Rubric
     */
    omit?: Prisma.RubricOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RubricInclude<ExtArgs> | null;
    /**
     * Filter which Rubric to delete.
     */
    where: Prisma.RubricWhereUniqueInput;
};
/**
 * Rubric deleteMany
 */
export type RubricDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Rubrics to delete
     */
    where?: Prisma.RubricWhereInput;
    /**
     * Limit how many Rubrics to delete.
     */
    limit?: number;
};
/**
 * Rubric.assignedUsers
 */
export type Rubric$assignedUsersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: Prisma.UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: Prisma.UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
/**
 * Rubric.inProgressUsers
 */
export type Rubric$inProgressUsersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: Prisma.UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: Prisma.UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
/**
 * Rubric.completedUsers
 */
export type Rubric$completedUsersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: Prisma.UserSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the User
     */
    omit?: Prisma.UserOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
/**
 * Rubric.scales
 */
export type Rubric$scalesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Scale
     */
    select?: Prisma.ScaleSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Scale
     */
    omit?: Prisma.ScaleOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ScaleInclude<ExtArgs> | null;
    where?: Prisma.ScaleWhereInput;
    orderBy?: Prisma.ScaleOrderByWithRelationInput | Prisma.ScaleOrderByWithRelationInput[];
    cursor?: Prisma.ScaleWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ScaleScalarFieldEnum | Prisma.ScaleScalarFieldEnum[];
};
/**
 * Rubric without action
 */
export type RubricDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Rubric
     */
    select?: Prisma.RubricSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Rubric
     */
    omit?: Prisma.RubricOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.RubricInclude<ExtArgs> | null;
};
export {};
//# sourceMappingURL=Rubric.d.ts.map