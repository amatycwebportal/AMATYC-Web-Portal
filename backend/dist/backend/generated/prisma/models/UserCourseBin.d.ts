import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model UserCourseBin
 *
 */
export type UserCourseBinModel = runtime.Types.Result.DefaultSelection<Prisma.$UserCourseBinPayload>;
export type AggregateUserCourseBin = {
    _count: UserCourseBinCountAggregateOutputType | null;
    _min: UserCourseBinMinAggregateOutputType | null;
    _max: UserCourseBinMaxAggregateOutputType | null;
};
export type UserCourseBinMinAggregateOutputType = {
    userId: string | null;
    courseBinId: string | null;
};
export type UserCourseBinMaxAggregateOutputType = {
    userId: string | null;
    courseBinId: string | null;
};
export type UserCourseBinCountAggregateOutputType = {
    userId: number;
    courseBinId: number;
    _all: number;
};
export type UserCourseBinMinAggregateInputType = {
    userId?: true;
    courseBinId?: true;
};
export type UserCourseBinMaxAggregateInputType = {
    userId?: true;
    courseBinId?: true;
};
export type UserCourseBinCountAggregateInputType = {
    userId?: true;
    courseBinId?: true;
    _all?: true;
};
export type UserCourseBinAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which UserCourseBin to aggregate.
     */
    where?: Prisma.UserCourseBinWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of UserCourseBins to fetch.
     */
    orderBy?: Prisma.UserCourseBinOrderByWithRelationInput | Prisma.UserCourseBinOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.UserCourseBinWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` UserCourseBins from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` UserCourseBins.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned UserCourseBins
    **/
    _count?: true | UserCourseBinCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: UserCourseBinMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: UserCourseBinMaxAggregateInputType;
};
export type GetUserCourseBinAggregateType<T extends UserCourseBinAggregateArgs> = {
    [P in keyof T & keyof AggregateUserCourseBin]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateUserCourseBin[P]> : Prisma.GetScalarType<T[P], AggregateUserCourseBin[P]>;
};
export type UserCourseBinGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserCourseBinWhereInput;
    orderBy?: Prisma.UserCourseBinOrderByWithAggregationInput | Prisma.UserCourseBinOrderByWithAggregationInput[];
    by: Prisma.UserCourseBinScalarFieldEnum[] | Prisma.UserCourseBinScalarFieldEnum;
    having?: Prisma.UserCourseBinScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: UserCourseBinCountAggregateInputType | true;
    _min?: UserCourseBinMinAggregateInputType;
    _max?: UserCourseBinMaxAggregateInputType;
};
export type UserCourseBinGroupByOutputType = {
    userId: string;
    courseBinId: string;
    _count: UserCourseBinCountAggregateOutputType | null;
    _min: UserCourseBinMinAggregateOutputType | null;
    _max: UserCourseBinMaxAggregateOutputType | null;
};
type GetUserCourseBinGroupByPayload<T extends UserCourseBinGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<UserCourseBinGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof UserCourseBinGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], UserCourseBinGroupByOutputType[P]> : Prisma.GetScalarType<T[P], UserCourseBinGroupByOutputType[P]>;
}>>;
export type UserCourseBinWhereInput = {
    AND?: Prisma.UserCourseBinWhereInput | Prisma.UserCourseBinWhereInput[];
    OR?: Prisma.UserCourseBinWhereInput[];
    NOT?: Prisma.UserCourseBinWhereInput | Prisma.UserCourseBinWhereInput[];
    userId?: Prisma.UuidFilter<"UserCourseBin"> | string;
    courseBinId?: Prisma.UuidFilter<"UserCourseBin"> | string;
    courseBin?: Prisma.XOR<Prisma.CourseBinScalarRelationFilter, Prisma.CourseBinWhereInput>;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type UserCourseBinOrderByWithRelationInput = {
    userId?: Prisma.SortOrder;
    courseBinId?: Prisma.SortOrder;
    courseBin?: Prisma.CourseBinOrderByWithRelationInput;
    user?: Prisma.UserOrderByWithRelationInput;
};
export type UserCourseBinWhereUniqueInput = Prisma.AtLeast<{
    userId_courseBinId?: Prisma.UserCourseBinUserIdCourseBinIdCompoundUniqueInput;
    AND?: Prisma.UserCourseBinWhereInput | Prisma.UserCourseBinWhereInput[];
    OR?: Prisma.UserCourseBinWhereInput[];
    NOT?: Prisma.UserCourseBinWhereInput | Prisma.UserCourseBinWhereInput[];
    userId?: Prisma.UuidFilter<"UserCourseBin"> | string;
    courseBinId?: Prisma.UuidFilter<"UserCourseBin"> | string;
    courseBin?: Prisma.XOR<Prisma.CourseBinScalarRelationFilter, Prisma.CourseBinWhereInput>;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "userId_courseBinId">;
export type UserCourseBinOrderByWithAggregationInput = {
    userId?: Prisma.SortOrder;
    courseBinId?: Prisma.SortOrder;
    _count?: Prisma.UserCourseBinCountOrderByAggregateInput;
    _max?: Prisma.UserCourseBinMaxOrderByAggregateInput;
    _min?: Prisma.UserCourseBinMinOrderByAggregateInput;
};
export type UserCourseBinScalarWhereWithAggregatesInput = {
    AND?: Prisma.UserCourseBinScalarWhereWithAggregatesInput | Prisma.UserCourseBinScalarWhereWithAggregatesInput[];
    OR?: Prisma.UserCourseBinScalarWhereWithAggregatesInput[];
    NOT?: Prisma.UserCourseBinScalarWhereWithAggregatesInput | Prisma.UserCourseBinScalarWhereWithAggregatesInput[];
    userId?: Prisma.UuidWithAggregatesFilter<"UserCourseBin"> | string;
    courseBinId?: Prisma.UuidWithAggregatesFilter<"UserCourseBin"> | string;
};
export type UserCourseBinCreateInput = {
    courseBin: Prisma.CourseBinCreateNestedOneWithoutUserCourseBinsInput;
    user: Prisma.UserCreateNestedOneWithoutUserCourseBinsInput;
};
export type UserCourseBinUncheckedCreateInput = {
    userId: string;
    courseBinId: string;
};
export type UserCourseBinUpdateInput = {
    courseBin?: Prisma.CourseBinUpdateOneRequiredWithoutUserCourseBinsNestedInput;
    user?: Prisma.UserUpdateOneRequiredWithoutUserCourseBinsNestedInput;
};
export type UserCourseBinUncheckedUpdateInput = {
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    courseBinId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type UserCourseBinCreateManyInput = {
    userId: string;
    courseBinId: string;
};
export type UserCourseBinUpdateManyMutationInput = {};
export type UserCourseBinUncheckedUpdateManyInput = {
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    courseBinId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type UserCourseBinListRelationFilter = {
    every?: Prisma.UserCourseBinWhereInput;
    some?: Prisma.UserCourseBinWhereInput;
    none?: Prisma.UserCourseBinWhereInput;
};
export type UserCourseBinOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type UserCourseBinUserIdCourseBinIdCompoundUniqueInput = {
    userId: string;
    courseBinId: string;
};
export type UserCourseBinCountOrderByAggregateInput = {
    userId?: Prisma.SortOrder;
    courseBinId?: Prisma.SortOrder;
};
export type UserCourseBinMaxOrderByAggregateInput = {
    userId?: Prisma.SortOrder;
    courseBinId?: Prisma.SortOrder;
};
export type UserCourseBinMinOrderByAggregateInput = {
    userId?: Prisma.SortOrder;
    courseBinId?: Prisma.SortOrder;
};
export type UserCourseBinCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.UserCourseBinCreateWithoutUserInput, Prisma.UserCourseBinUncheckedCreateWithoutUserInput> | Prisma.UserCourseBinCreateWithoutUserInput[] | Prisma.UserCourseBinUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.UserCourseBinCreateOrConnectWithoutUserInput | Prisma.UserCourseBinCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.UserCourseBinCreateManyUserInputEnvelope;
    connect?: Prisma.UserCourseBinWhereUniqueInput | Prisma.UserCourseBinWhereUniqueInput[];
};
export type UserCourseBinUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.UserCourseBinCreateWithoutUserInput, Prisma.UserCourseBinUncheckedCreateWithoutUserInput> | Prisma.UserCourseBinCreateWithoutUserInput[] | Prisma.UserCourseBinUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.UserCourseBinCreateOrConnectWithoutUserInput | Prisma.UserCourseBinCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.UserCourseBinCreateManyUserInputEnvelope;
    connect?: Prisma.UserCourseBinWhereUniqueInput | Prisma.UserCourseBinWhereUniqueInput[];
};
export type UserCourseBinUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.UserCourseBinCreateWithoutUserInput, Prisma.UserCourseBinUncheckedCreateWithoutUserInput> | Prisma.UserCourseBinCreateWithoutUserInput[] | Prisma.UserCourseBinUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.UserCourseBinCreateOrConnectWithoutUserInput | Prisma.UserCourseBinCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.UserCourseBinUpsertWithWhereUniqueWithoutUserInput | Prisma.UserCourseBinUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.UserCourseBinCreateManyUserInputEnvelope;
    set?: Prisma.UserCourseBinWhereUniqueInput | Prisma.UserCourseBinWhereUniqueInput[];
    disconnect?: Prisma.UserCourseBinWhereUniqueInput | Prisma.UserCourseBinWhereUniqueInput[];
    delete?: Prisma.UserCourseBinWhereUniqueInput | Prisma.UserCourseBinWhereUniqueInput[];
    connect?: Prisma.UserCourseBinWhereUniqueInput | Prisma.UserCourseBinWhereUniqueInput[];
    update?: Prisma.UserCourseBinUpdateWithWhereUniqueWithoutUserInput | Prisma.UserCourseBinUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.UserCourseBinUpdateManyWithWhereWithoutUserInput | Prisma.UserCourseBinUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.UserCourseBinScalarWhereInput | Prisma.UserCourseBinScalarWhereInput[];
};
export type UserCourseBinUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.UserCourseBinCreateWithoutUserInput, Prisma.UserCourseBinUncheckedCreateWithoutUserInput> | Prisma.UserCourseBinCreateWithoutUserInput[] | Prisma.UserCourseBinUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.UserCourseBinCreateOrConnectWithoutUserInput | Prisma.UserCourseBinCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.UserCourseBinUpsertWithWhereUniqueWithoutUserInput | Prisma.UserCourseBinUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.UserCourseBinCreateManyUserInputEnvelope;
    set?: Prisma.UserCourseBinWhereUniqueInput | Prisma.UserCourseBinWhereUniqueInput[];
    disconnect?: Prisma.UserCourseBinWhereUniqueInput | Prisma.UserCourseBinWhereUniqueInput[];
    delete?: Prisma.UserCourseBinWhereUniqueInput | Prisma.UserCourseBinWhereUniqueInput[];
    connect?: Prisma.UserCourseBinWhereUniqueInput | Prisma.UserCourseBinWhereUniqueInput[];
    update?: Prisma.UserCourseBinUpdateWithWhereUniqueWithoutUserInput | Prisma.UserCourseBinUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.UserCourseBinUpdateManyWithWhereWithoutUserInput | Prisma.UserCourseBinUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.UserCourseBinScalarWhereInput | Prisma.UserCourseBinScalarWhereInput[];
};
export type UserCourseBinCreateNestedManyWithoutCourseBinInput = {
    create?: Prisma.XOR<Prisma.UserCourseBinCreateWithoutCourseBinInput, Prisma.UserCourseBinUncheckedCreateWithoutCourseBinInput> | Prisma.UserCourseBinCreateWithoutCourseBinInput[] | Prisma.UserCourseBinUncheckedCreateWithoutCourseBinInput[];
    connectOrCreate?: Prisma.UserCourseBinCreateOrConnectWithoutCourseBinInput | Prisma.UserCourseBinCreateOrConnectWithoutCourseBinInput[];
    createMany?: Prisma.UserCourseBinCreateManyCourseBinInputEnvelope;
    connect?: Prisma.UserCourseBinWhereUniqueInput | Prisma.UserCourseBinWhereUniqueInput[];
};
export type UserCourseBinUncheckedCreateNestedManyWithoutCourseBinInput = {
    create?: Prisma.XOR<Prisma.UserCourseBinCreateWithoutCourseBinInput, Prisma.UserCourseBinUncheckedCreateWithoutCourseBinInput> | Prisma.UserCourseBinCreateWithoutCourseBinInput[] | Prisma.UserCourseBinUncheckedCreateWithoutCourseBinInput[];
    connectOrCreate?: Prisma.UserCourseBinCreateOrConnectWithoutCourseBinInput | Prisma.UserCourseBinCreateOrConnectWithoutCourseBinInput[];
    createMany?: Prisma.UserCourseBinCreateManyCourseBinInputEnvelope;
    connect?: Prisma.UserCourseBinWhereUniqueInput | Prisma.UserCourseBinWhereUniqueInput[];
};
export type UserCourseBinUpdateManyWithoutCourseBinNestedInput = {
    create?: Prisma.XOR<Prisma.UserCourseBinCreateWithoutCourseBinInput, Prisma.UserCourseBinUncheckedCreateWithoutCourseBinInput> | Prisma.UserCourseBinCreateWithoutCourseBinInput[] | Prisma.UserCourseBinUncheckedCreateWithoutCourseBinInput[];
    connectOrCreate?: Prisma.UserCourseBinCreateOrConnectWithoutCourseBinInput | Prisma.UserCourseBinCreateOrConnectWithoutCourseBinInput[];
    upsert?: Prisma.UserCourseBinUpsertWithWhereUniqueWithoutCourseBinInput | Prisma.UserCourseBinUpsertWithWhereUniqueWithoutCourseBinInput[];
    createMany?: Prisma.UserCourseBinCreateManyCourseBinInputEnvelope;
    set?: Prisma.UserCourseBinWhereUniqueInput | Prisma.UserCourseBinWhereUniqueInput[];
    disconnect?: Prisma.UserCourseBinWhereUniqueInput | Prisma.UserCourseBinWhereUniqueInput[];
    delete?: Prisma.UserCourseBinWhereUniqueInput | Prisma.UserCourseBinWhereUniqueInput[];
    connect?: Prisma.UserCourseBinWhereUniqueInput | Prisma.UserCourseBinWhereUniqueInput[];
    update?: Prisma.UserCourseBinUpdateWithWhereUniqueWithoutCourseBinInput | Prisma.UserCourseBinUpdateWithWhereUniqueWithoutCourseBinInput[];
    updateMany?: Prisma.UserCourseBinUpdateManyWithWhereWithoutCourseBinInput | Prisma.UserCourseBinUpdateManyWithWhereWithoutCourseBinInput[];
    deleteMany?: Prisma.UserCourseBinScalarWhereInput | Prisma.UserCourseBinScalarWhereInput[];
};
export type UserCourseBinUncheckedUpdateManyWithoutCourseBinNestedInput = {
    create?: Prisma.XOR<Prisma.UserCourseBinCreateWithoutCourseBinInput, Prisma.UserCourseBinUncheckedCreateWithoutCourseBinInput> | Prisma.UserCourseBinCreateWithoutCourseBinInput[] | Prisma.UserCourseBinUncheckedCreateWithoutCourseBinInput[];
    connectOrCreate?: Prisma.UserCourseBinCreateOrConnectWithoutCourseBinInput | Prisma.UserCourseBinCreateOrConnectWithoutCourseBinInput[];
    upsert?: Prisma.UserCourseBinUpsertWithWhereUniqueWithoutCourseBinInput | Prisma.UserCourseBinUpsertWithWhereUniqueWithoutCourseBinInput[];
    createMany?: Prisma.UserCourseBinCreateManyCourseBinInputEnvelope;
    set?: Prisma.UserCourseBinWhereUniqueInput | Prisma.UserCourseBinWhereUniqueInput[];
    disconnect?: Prisma.UserCourseBinWhereUniqueInput | Prisma.UserCourseBinWhereUniqueInput[];
    delete?: Prisma.UserCourseBinWhereUniqueInput | Prisma.UserCourseBinWhereUniqueInput[];
    connect?: Prisma.UserCourseBinWhereUniqueInput | Prisma.UserCourseBinWhereUniqueInput[];
    update?: Prisma.UserCourseBinUpdateWithWhereUniqueWithoutCourseBinInput | Prisma.UserCourseBinUpdateWithWhereUniqueWithoutCourseBinInput[];
    updateMany?: Prisma.UserCourseBinUpdateManyWithWhereWithoutCourseBinInput | Prisma.UserCourseBinUpdateManyWithWhereWithoutCourseBinInput[];
    deleteMany?: Prisma.UserCourseBinScalarWhereInput | Prisma.UserCourseBinScalarWhereInput[];
};
export type UserCourseBinCreateWithoutUserInput = {
    courseBin: Prisma.CourseBinCreateNestedOneWithoutUserCourseBinsInput;
};
export type UserCourseBinUncheckedCreateWithoutUserInput = {
    courseBinId: string;
};
export type UserCourseBinCreateOrConnectWithoutUserInput = {
    where: Prisma.UserCourseBinWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCourseBinCreateWithoutUserInput, Prisma.UserCourseBinUncheckedCreateWithoutUserInput>;
};
export type UserCourseBinCreateManyUserInputEnvelope = {
    data: Prisma.UserCourseBinCreateManyUserInput | Prisma.UserCourseBinCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type UserCourseBinUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.UserCourseBinWhereUniqueInput;
    update: Prisma.XOR<Prisma.UserCourseBinUpdateWithoutUserInput, Prisma.UserCourseBinUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.UserCourseBinCreateWithoutUserInput, Prisma.UserCourseBinUncheckedCreateWithoutUserInput>;
};
export type UserCourseBinUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.UserCourseBinWhereUniqueInput;
    data: Prisma.XOR<Prisma.UserCourseBinUpdateWithoutUserInput, Prisma.UserCourseBinUncheckedUpdateWithoutUserInput>;
};
export type UserCourseBinUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.UserCourseBinScalarWhereInput;
    data: Prisma.XOR<Prisma.UserCourseBinUpdateManyMutationInput, Prisma.UserCourseBinUncheckedUpdateManyWithoutUserInput>;
};
export type UserCourseBinScalarWhereInput = {
    AND?: Prisma.UserCourseBinScalarWhereInput | Prisma.UserCourseBinScalarWhereInput[];
    OR?: Prisma.UserCourseBinScalarWhereInput[];
    NOT?: Prisma.UserCourseBinScalarWhereInput | Prisma.UserCourseBinScalarWhereInput[];
    userId?: Prisma.UuidFilter<"UserCourseBin"> | string;
    courseBinId?: Prisma.UuidFilter<"UserCourseBin"> | string;
};
export type UserCourseBinCreateWithoutCourseBinInput = {
    user: Prisma.UserCreateNestedOneWithoutUserCourseBinsInput;
};
export type UserCourseBinUncheckedCreateWithoutCourseBinInput = {
    userId: string;
};
export type UserCourseBinCreateOrConnectWithoutCourseBinInput = {
    where: Prisma.UserCourseBinWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCourseBinCreateWithoutCourseBinInput, Prisma.UserCourseBinUncheckedCreateWithoutCourseBinInput>;
};
export type UserCourseBinCreateManyCourseBinInputEnvelope = {
    data: Prisma.UserCourseBinCreateManyCourseBinInput | Prisma.UserCourseBinCreateManyCourseBinInput[];
    skipDuplicates?: boolean;
};
export type UserCourseBinUpsertWithWhereUniqueWithoutCourseBinInput = {
    where: Prisma.UserCourseBinWhereUniqueInput;
    update: Prisma.XOR<Prisma.UserCourseBinUpdateWithoutCourseBinInput, Prisma.UserCourseBinUncheckedUpdateWithoutCourseBinInput>;
    create: Prisma.XOR<Prisma.UserCourseBinCreateWithoutCourseBinInput, Prisma.UserCourseBinUncheckedCreateWithoutCourseBinInput>;
};
export type UserCourseBinUpdateWithWhereUniqueWithoutCourseBinInput = {
    where: Prisma.UserCourseBinWhereUniqueInput;
    data: Prisma.XOR<Prisma.UserCourseBinUpdateWithoutCourseBinInput, Prisma.UserCourseBinUncheckedUpdateWithoutCourseBinInput>;
};
export type UserCourseBinUpdateManyWithWhereWithoutCourseBinInput = {
    where: Prisma.UserCourseBinScalarWhereInput;
    data: Prisma.XOR<Prisma.UserCourseBinUpdateManyMutationInput, Prisma.UserCourseBinUncheckedUpdateManyWithoutCourseBinInput>;
};
export type UserCourseBinCreateManyUserInput = {
    courseBinId: string;
};
export type UserCourseBinUpdateWithoutUserInput = {
    courseBin?: Prisma.CourseBinUpdateOneRequiredWithoutUserCourseBinsNestedInput;
};
export type UserCourseBinUncheckedUpdateWithoutUserInput = {
    courseBinId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type UserCourseBinUncheckedUpdateManyWithoutUserInput = {
    courseBinId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type UserCourseBinCreateManyCourseBinInput = {
    userId: string;
};
export type UserCourseBinUpdateWithoutCourseBinInput = {
    user?: Prisma.UserUpdateOneRequiredWithoutUserCourseBinsNestedInput;
};
export type UserCourseBinUncheckedUpdateWithoutCourseBinInput = {
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type UserCourseBinUncheckedUpdateManyWithoutCourseBinInput = {
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type UserCourseBinSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    userId?: boolean;
    courseBinId?: boolean;
    courseBin?: boolean | Prisma.CourseBinDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["userCourseBin"]>;
export type UserCourseBinSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    userId?: boolean;
    courseBinId?: boolean;
    courseBin?: boolean | Prisma.CourseBinDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["userCourseBin"]>;
export type UserCourseBinSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    userId?: boolean;
    courseBinId?: boolean;
    courseBin?: boolean | Prisma.CourseBinDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["userCourseBin"]>;
export type UserCourseBinSelectScalar = {
    userId?: boolean;
    courseBinId?: boolean;
};
export type UserCourseBinOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"userId" | "courseBinId", ExtArgs["result"]["userCourseBin"]>;
export type UserCourseBinInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    courseBin?: boolean | Prisma.CourseBinDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type UserCourseBinIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    courseBin?: boolean | Prisma.CourseBinDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type UserCourseBinIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    courseBin?: boolean | Prisma.CourseBinDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $UserCourseBinPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "UserCourseBin";
    objects: {
        courseBin: Prisma.$CourseBinPayload<ExtArgs>;
        user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        userId: string;
        courseBinId: string;
    }, ExtArgs["result"]["userCourseBin"]>;
    composites: {};
};
export type UserCourseBinGetPayload<S extends boolean | null | undefined | UserCourseBinDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$UserCourseBinPayload, S>;
export type UserCourseBinCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<UserCourseBinFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: UserCourseBinCountAggregateInputType | true;
};
export interface UserCourseBinDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['UserCourseBin'];
        meta: {
            name: 'UserCourseBin';
        };
    };
    /**
     * Find zero or one UserCourseBin that matches the filter.
     * @param {UserCourseBinFindUniqueArgs} args - Arguments to find a UserCourseBin
     * @example
     * // Get one UserCourseBin
     * const userCourseBin = await prisma.userCourseBin.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserCourseBinFindUniqueArgs>(args: Prisma.SelectSubset<T, UserCourseBinFindUniqueArgs<ExtArgs>>): Prisma.Prisma__UserCourseBinClient<runtime.Types.Result.GetResult<Prisma.$UserCourseBinPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one UserCourseBin that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserCourseBinFindUniqueOrThrowArgs} args - Arguments to find a UserCourseBin
     * @example
     * // Get one UserCourseBin
     * const userCourseBin = await prisma.userCourseBin.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserCourseBinFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, UserCourseBinFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserCourseBinClient<runtime.Types.Result.GetResult<Prisma.$UserCourseBinPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first UserCourseBin that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCourseBinFindFirstArgs} args - Arguments to find a UserCourseBin
     * @example
     * // Get one UserCourseBin
     * const userCourseBin = await prisma.userCourseBin.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserCourseBinFindFirstArgs>(args?: Prisma.SelectSubset<T, UserCourseBinFindFirstArgs<ExtArgs>>): Prisma.Prisma__UserCourseBinClient<runtime.Types.Result.GetResult<Prisma.$UserCourseBinPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first UserCourseBin that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCourseBinFindFirstOrThrowArgs} args - Arguments to find a UserCourseBin
     * @example
     * // Get one UserCourseBin
     * const userCourseBin = await prisma.userCourseBin.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserCourseBinFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, UserCourseBinFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserCourseBinClient<runtime.Types.Result.GetResult<Prisma.$UserCourseBinPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more UserCourseBins that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCourseBinFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserCourseBins
     * const userCourseBins = await prisma.userCourseBin.findMany()
     *
     * // Get first 10 UserCourseBins
     * const userCourseBins = await prisma.userCourseBin.findMany({ take: 10 })
     *
     * // Only select the `userId`
     * const userCourseBinWithUserIdOnly = await prisma.userCourseBin.findMany({ select: { userId: true } })
     *
     */
    findMany<T extends UserCourseBinFindManyArgs>(args?: Prisma.SelectSubset<T, UserCourseBinFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserCourseBinPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a UserCourseBin.
     * @param {UserCourseBinCreateArgs} args - Arguments to create a UserCourseBin.
     * @example
     * // Create one UserCourseBin
     * const UserCourseBin = await prisma.userCourseBin.create({
     *   data: {
     *     // ... data to create a UserCourseBin
     *   }
     * })
     *
     */
    create<T extends UserCourseBinCreateArgs>(args: Prisma.SelectSubset<T, UserCourseBinCreateArgs<ExtArgs>>): Prisma.Prisma__UserCourseBinClient<runtime.Types.Result.GetResult<Prisma.$UserCourseBinPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many UserCourseBins.
     * @param {UserCourseBinCreateManyArgs} args - Arguments to create many UserCourseBins.
     * @example
     * // Create many UserCourseBins
     * const userCourseBin = await prisma.userCourseBin.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends UserCourseBinCreateManyArgs>(args?: Prisma.SelectSubset<T, UserCourseBinCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many UserCourseBins and returns the data saved in the database.
     * @param {UserCourseBinCreateManyAndReturnArgs} args - Arguments to create many UserCourseBins.
     * @example
     * // Create many UserCourseBins
     * const userCourseBin = await prisma.userCourseBin.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many UserCourseBins and only return the `userId`
     * const userCourseBinWithUserIdOnly = await prisma.userCourseBin.createManyAndReturn({
     *   select: { userId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends UserCourseBinCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, UserCourseBinCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserCourseBinPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a UserCourseBin.
     * @param {UserCourseBinDeleteArgs} args - Arguments to delete one UserCourseBin.
     * @example
     * // Delete one UserCourseBin
     * const UserCourseBin = await prisma.userCourseBin.delete({
     *   where: {
     *     // ... filter to delete one UserCourseBin
     *   }
     * })
     *
     */
    delete<T extends UserCourseBinDeleteArgs>(args: Prisma.SelectSubset<T, UserCourseBinDeleteArgs<ExtArgs>>): Prisma.Prisma__UserCourseBinClient<runtime.Types.Result.GetResult<Prisma.$UserCourseBinPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one UserCourseBin.
     * @param {UserCourseBinUpdateArgs} args - Arguments to update one UserCourseBin.
     * @example
     * // Update one UserCourseBin
     * const userCourseBin = await prisma.userCourseBin.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends UserCourseBinUpdateArgs>(args: Prisma.SelectSubset<T, UserCourseBinUpdateArgs<ExtArgs>>): Prisma.Prisma__UserCourseBinClient<runtime.Types.Result.GetResult<Prisma.$UserCourseBinPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more UserCourseBins.
     * @param {UserCourseBinDeleteManyArgs} args - Arguments to filter UserCourseBins to delete.
     * @example
     * // Delete a few UserCourseBins
     * const { count } = await prisma.userCourseBin.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends UserCourseBinDeleteManyArgs>(args?: Prisma.SelectSubset<T, UserCourseBinDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more UserCourseBins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCourseBinUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserCourseBins
     * const userCourseBin = await prisma.userCourseBin.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends UserCourseBinUpdateManyArgs>(args: Prisma.SelectSubset<T, UserCourseBinUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more UserCourseBins and returns the data updated in the database.
     * @param {UserCourseBinUpdateManyAndReturnArgs} args - Arguments to update many UserCourseBins.
     * @example
     * // Update many UserCourseBins
     * const userCourseBin = await prisma.userCourseBin.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more UserCourseBins and only return the `userId`
     * const userCourseBinWithUserIdOnly = await prisma.userCourseBin.updateManyAndReturn({
     *   select: { userId: true },
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
    updateManyAndReturn<T extends UserCourseBinUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, UserCourseBinUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserCourseBinPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one UserCourseBin.
     * @param {UserCourseBinUpsertArgs} args - Arguments to update or create a UserCourseBin.
     * @example
     * // Update or create a UserCourseBin
     * const userCourseBin = await prisma.userCourseBin.upsert({
     *   create: {
     *     // ... data to create a UserCourseBin
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserCourseBin we want to update
     *   }
     * })
     */
    upsert<T extends UserCourseBinUpsertArgs>(args: Prisma.SelectSubset<T, UserCourseBinUpsertArgs<ExtArgs>>): Prisma.Prisma__UserCourseBinClient<runtime.Types.Result.GetResult<Prisma.$UserCourseBinPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of UserCourseBins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCourseBinCountArgs} args - Arguments to filter UserCourseBins to count.
     * @example
     * // Count the number of UserCourseBins
     * const count = await prisma.userCourseBin.count({
     *   where: {
     *     // ... the filter for the UserCourseBins we want to count
     *   }
     * })
    **/
    count<T extends UserCourseBinCountArgs>(args?: Prisma.Subset<T, UserCourseBinCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], UserCourseBinCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a UserCourseBin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCourseBinAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends UserCourseBinAggregateArgs>(args: Prisma.Subset<T, UserCourseBinAggregateArgs>): Prisma.PrismaPromise<GetUserCourseBinAggregateType<T>>;
    /**
     * Group by UserCourseBin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCourseBinGroupByArgs} args - Group by arguments.
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
    groupBy<T extends UserCourseBinGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: UserCourseBinGroupByArgs['orderBy'];
    } : {
        orderBy?: UserCourseBinGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, UserCourseBinGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserCourseBinGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the UserCourseBin model
     */
    readonly fields: UserCourseBinFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for UserCourseBin.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__UserCourseBinClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    courseBin<T extends Prisma.CourseBinDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CourseBinDefaultArgs<ExtArgs>>): Prisma.Prisma__CourseBinClient<runtime.Types.Result.GetResult<Prisma.$CourseBinPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the UserCourseBin model
 */
export interface UserCourseBinFieldRefs {
    readonly userId: Prisma.FieldRef<"UserCourseBin", 'String'>;
    readonly courseBinId: Prisma.FieldRef<"UserCourseBin", 'String'>;
}
/**
 * UserCourseBin findUnique
 */
export type UserCourseBinFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCourseBin
     */
    select?: Prisma.UserCourseBinSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserCourseBin
     */
    omit?: Prisma.UserCourseBinOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserCourseBinInclude<ExtArgs> | null;
    /**
     * Filter, which UserCourseBin to fetch.
     */
    where: Prisma.UserCourseBinWhereUniqueInput;
};
/**
 * UserCourseBin findUniqueOrThrow
 */
export type UserCourseBinFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCourseBin
     */
    select?: Prisma.UserCourseBinSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserCourseBin
     */
    omit?: Prisma.UserCourseBinOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserCourseBinInclude<ExtArgs> | null;
    /**
     * Filter, which UserCourseBin to fetch.
     */
    where: Prisma.UserCourseBinWhereUniqueInput;
};
/**
 * UserCourseBin findFirst
 */
export type UserCourseBinFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCourseBin
     */
    select?: Prisma.UserCourseBinSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserCourseBin
     */
    omit?: Prisma.UserCourseBinOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserCourseBinInclude<ExtArgs> | null;
    /**
     * Filter, which UserCourseBin to fetch.
     */
    where?: Prisma.UserCourseBinWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of UserCourseBins to fetch.
     */
    orderBy?: Prisma.UserCourseBinOrderByWithRelationInput | Prisma.UserCourseBinOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for UserCourseBins.
     */
    cursor?: Prisma.UserCourseBinWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` UserCourseBins from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` UserCourseBins.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of UserCourseBins.
     */
    distinct?: Prisma.UserCourseBinScalarFieldEnum | Prisma.UserCourseBinScalarFieldEnum[];
};
/**
 * UserCourseBin findFirstOrThrow
 */
export type UserCourseBinFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCourseBin
     */
    select?: Prisma.UserCourseBinSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserCourseBin
     */
    omit?: Prisma.UserCourseBinOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserCourseBinInclude<ExtArgs> | null;
    /**
     * Filter, which UserCourseBin to fetch.
     */
    where?: Prisma.UserCourseBinWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of UserCourseBins to fetch.
     */
    orderBy?: Prisma.UserCourseBinOrderByWithRelationInput | Prisma.UserCourseBinOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for UserCourseBins.
     */
    cursor?: Prisma.UserCourseBinWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` UserCourseBins from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` UserCourseBins.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of UserCourseBins.
     */
    distinct?: Prisma.UserCourseBinScalarFieldEnum | Prisma.UserCourseBinScalarFieldEnum[];
};
/**
 * UserCourseBin findMany
 */
export type UserCourseBinFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCourseBin
     */
    select?: Prisma.UserCourseBinSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserCourseBin
     */
    omit?: Prisma.UserCourseBinOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserCourseBinInclude<ExtArgs> | null;
    /**
     * Filter, which UserCourseBins to fetch.
     */
    where?: Prisma.UserCourseBinWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of UserCourseBins to fetch.
     */
    orderBy?: Prisma.UserCourseBinOrderByWithRelationInput | Prisma.UserCourseBinOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing UserCourseBins.
     */
    cursor?: Prisma.UserCourseBinWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` UserCourseBins from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` UserCourseBins.
     */
    skip?: number;
    distinct?: Prisma.UserCourseBinScalarFieldEnum | Prisma.UserCourseBinScalarFieldEnum[];
};
/**
 * UserCourseBin create
 */
export type UserCourseBinCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCourseBin
     */
    select?: Prisma.UserCourseBinSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserCourseBin
     */
    omit?: Prisma.UserCourseBinOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserCourseBinInclude<ExtArgs> | null;
    /**
     * The data needed to create a UserCourseBin.
     */
    data: Prisma.XOR<Prisma.UserCourseBinCreateInput, Prisma.UserCourseBinUncheckedCreateInput>;
};
/**
 * UserCourseBin createMany
 */
export type UserCourseBinCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserCourseBins.
     */
    data: Prisma.UserCourseBinCreateManyInput | Prisma.UserCourseBinCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * UserCourseBin createManyAndReturn
 */
export type UserCourseBinCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCourseBin
     */
    select?: Prisma.UserCourseBinSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the UserCourseBin
     */
    omit?: Prisma.UserCourseBinOmit<ExtArgs> | null;
    /**
     * The data used to create many UserCourseBins.
     */
    data: Prisma.UserCourseBinCreateManyInput | Prisma.UserCourseBinCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserCourseBinIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * UserCourseBin update
 */
export type UserCourseBinUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCourseBin
     */
    select?: Prisma.UserCourseBinSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserCourseBin
     */
    omit?: Prisma.UserCourseBinOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserCourseBinInclude<ExtArgs> | null;
    /**
     * The data needed to update a UserCourseBin.
     */
    data: Prisma.XOR<Prisma.UserCourseBinUpdateInput, Prisma.UserCourseBinUncheckedUpdateInput>;
    /**
     * Choose, which UserCourseBin to update.
     */
    where: Prisma.UserCourseBinWhereUniqueInput;
};
/**
 * UserCourseBin updateMany
 */
export type UserCourseBinUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update UserCourseBins.
     */
    data: Prisma.XOR<Prisma.UserCourseBinUpdateManyMutationInput, Prisma.UserCourseBinUncheckedUpdateManyInput>;
    /**
     * Filter which UserCourseBins to update
     */
    where?: Prisma.UserCourseBinWhereInput;
    /**
     * Limit how many UserCourseBins to update.
     */
    limit?: number;
};
/**
 * UserCourseBin updateManyAndReturn
 */
export type UserCourseBinUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCourseBin
     */
    select?: Prisma.UserCourseBinSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the UserCourseBin
     */
    omit?: Prisma.UserCourseBinOmit<ExtArgs> | null;
    /**
     * The data used to update UserCourseBins.
     */
    data: Prisma.XOR<Prisma.UserCourseBinUpdateManyMutationInput, Prisma.UserCourseBinUncheckedUpdateManyInput>;
    /**
     * Filter which UserCourseBins to update
     */
    where?: Prisma.UserCourseBinWhereInput;
    /**
     * Limit how many UserCourseBins to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserCourseBinIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * UserCourseBin upsert
 */
export type UserCourseBinUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCourseBin
     */
    select?: Prisma.UserCourseBinSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserCourseBin
     */
    omit?: Prisma.UserCourseBinOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserCourseBinInclude<ExtArgs> | null;
    /**
     * The filter to search for the UserCourseBin to update in case it exists.
     */
    where: Prisma.UserCourseBinWhereUniqueInput;
    /**
     * In case the UserCourseBin found by the `where` argument doesn't exist, create a new UserCourseBin with this data.
     */
    create: Prisma.XOR<Prisma.UserCourseBinCreateInput, Prisma.UserCourseBinUncheckedCreateInput>;
    /**
     * In case the UserCourseBin was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.UserCourseBinUpdateInput, Prisma.UserCourseBinUncheckedUpdateInput>;
};
/**
 * UserCourseBin delete
 */
export type UserCourseBinDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCourseBin
     */
    select?: Prisma.UserCourseBinSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserCourseBin
     */
    omit?: Prisma.UserCourseBinOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserCourseBinInclude<ExtArgs> | null;
    /**
     * Filter which UserCourseBin to delete.
     */
    where: Prisma.UserCourseBinWhereUniqueInput;
};
/**
 * UserCourseBin deleteMany
 */
export type UserCourseBinDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which UserCourseBins to delete
     */
    where?: Prisma.UserCourseBinWhereInput;
    /**
     * Limit how many UserCourseBins to delete.
     */
    limit?: number;
};
/**
 * UserCourseBin without action
 */
export type UserCourseBinDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCourseBin
     */
    select?: Prisma.UserCourseBinSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the UserCourseBin
     */
    omit?: Prisma.UserCourseBinOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.UserCourseBinInclude<ExtArgs> | null;
};
export {};
//# sourceMappingURL=UserCourseBin.d.ts.map