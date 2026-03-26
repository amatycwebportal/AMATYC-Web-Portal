import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model ScaleVersion
 *
 */
export type ScaleVersionModel = runtime.Types.Result.DefaultSelection<Prisma.$ScaleVersionPayload>;
export type AggregateScaleVersion = {
    _count: ScaleVersionCountAggregateOutputType | null;
    _avg: ScaleVersionAvgAggregateOutputType | null;
    _sum: ScaleVersionSumAggregateOutputType | null;
    _min: ScaleVersionMinAggregateOutputType | null;
    _max: ScaleVersionMaxAggregateOutputType | null;
};
export type ScaleVersionAvgAggregateOutputType = {
    orderIndex: number | null;
};
export type ScaleVersionSumAggregateOutputType = {
    orderIndex: number | null;
};
export type ScaleVersionMinAggregateOutputType = {
    id: string | null;
    rubricVersionId: string | null;
    originalScaleId: string | null;
    prompt: string | null;
    orderIndex: number | null;
    isGlobal: boolean | null;
    editable: boolean | null;
    section: string | null;
};
export type ScaleVersionMaxAggregateOutputType = {
    id: string | null;
    rubricVersionId: string | null;
    originalScaleId: string | null;
    prompt: string | null;
    orderIndex: number | null;
    isGlobal: boolean | null;
    editable: boolean | null;
    section: string | null;
};
export type ScaleVersionCountAggregateOutputType = {
    id: number;
    rubricVersionId: number;
    originalScaleId: number;
    prompt: number;
    orderIndex: number;
    isGlobal: number;
    editable: number;
    levelDescriptions: number;
    section: number;
    _all: number;
};
export type ScaleVersionAvgAggregateInputType = {
    orderIndex?: true;
};
export type ScaleVersionSumAggregateInputType = {
    orderIndex?: true;
};
export type ScaleVersionMinAggregateInputType = {
    id?: true;
    rubricVersionId?: true;
    originalScaleId?: true;
    prompt?: true;
    orderIndex?: true;
    isGlobal?: true;
    editable?: true;
    section?: true;
};
export type ScaleVersionMaxAggregateInputType = {
    id?: true;
    rubricVersionId?: true;
    originalScaleId?: true;
    prompt?: true;
    orderIndex?: true;
    isGlobal?: true;
    editable?: true;
    section?: true;
};
export type ScaleVersionCountAggregateInputType = {
    id?: true;
    rubricVersionId?: true;
    originalScaleId?: true;
    prompt?: true;
    orderIndex?: true;
    isGlobal?: true;
    editable?: true;
    levelDescriptions?: true;
    section?: true;
    _all?: true;
};
export type ScaleVersionAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which ScaleVersion to aggregate.
     */
    where?: Prisma.ScaleVersionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ScaleVersions to fetch.
     */
    orderBy?: Prisma.ScaleVersionOrderByWithRelationInput | Prisma.ScaleVersionOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.ScaleVersionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ScaleVersions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ScaleVersions.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned ScaleVersions
    **/
    _count?: true | ScaleVersionCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: ScaleVersionAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: ScaleVersionSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: ScaleVersionMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: ScaleVersionMaxAggregateInputType;
};
export type GetScaleVersionAggregateType<T extends ScaleVersionAggregateArgs> = {
    [P in keyof T & keyof AggregateScaleVersion]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateScaleVersion[P]> : Prisma.GetScalarType<T[P], AggregateScaleVersion[P]>;
};
export type ScaleVersionGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ScaleVersionWhereInput;
    orderBy?: Prisma.ScaleVersionOrderByWithAggregationInput | Prisma.ScaleVersionOrderByWithAggregationInput[];
    by: Prisma.ScaleVersionScalarFieldEnum[] | Prisma.ScaleVersionScalarFieldEnum;
    having?: Prisma.ScaleVersionScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ScaleVersionCountAggregateInputType | true;
    _avg?: ScaleVersionAvgAggregateInputType;
    _sum?: ScaleVersionSumAggregateInputType;
    _min?: ScaleVersionMinAggregateInputType;
    _max?: ScaleVersionMaxAggregateInputType;
};
export type ScaleVersionGroupByOutputType = {
    id: string;
    rubricVersionId: string;
    originalScaleId: string;
    prompt: string;
    orderIndex: number;
    isGlobal: boolean;
    editable: boolean;
    levelDescriptions: runtime.JsonValue | null;
    section: string | null;
    _count: ScaleVersionCountAggregateOutputType | null;
    _avg: ScaleVersionAvgAggregateOutputType | null;
    _sum: ScaleVersionSumAggregateOutputType | null;
    _min: ScaleVersionMinAggregateOutputType | null;
    _max: ScaleVersionMaxAggregateOutputType | null;
};
type GetScaleVersionGroupByPayload<T extends ScaleVersionGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ScaleVersionGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ScaleVersionGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ScaleVersionGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ScaleVersionGroupByOutputType[P]>;
}>>;
export type ScaleVersionWhereInput = {
    AND?: Prisma.ScaleVersionWhereInput | Prisma.ScaleVersionWhereInput[];
    OR?: Prisma.ScaleVersionWhereInput[];
    NOT?: Prisma.ScaleVersionWhereInput | Prisma.ScaleVersionWhereInput[];
    id?: Prisma.UuidFilter<"ScaleVersion"> | string;
    rubricVersionId?: Prisma.UuidFilter<"ScaleVersion"> | string;
    originalScaleId?: Prisma.UuidFilter<"ScaleVersion"> | string;
    prompt?: Prisma.StringFilter<"ScaleVersion"> | string;
    orderIndex?: Prisma.IntFilter<"ScaleVersion"> | number;
    isGlobal?: Prisma.BoolFilter<"ScaleVersion"> | boolean;
    editable?: Prisma.BoolFilter<"ScaleVersion"> | boolean;
    levelDescriptions?: Prisma.JsonNullableFilter<"ScaleVersion">;
    section?: Prisma.StringNullableFilter<"ScaleVersion"> | string | null;
    rubricVersion?: Prisma.XOR<Prisma.RubricVersionScalarRelationFilter, Prisma.RubricVersionWhereInput>;
    scaleVersionBins?: Prisma.ScaleVersionBinListRelationFilter;
    responses?: Prisma.ResponseListRelationFilter;
};
export type ScaleVersionOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    rubricVersionId?: Prisma.SortOrder;
    originalScaleId?: Prisma.SortOrder;
    prompt?: Prisma.SortOrder;
    orderIndex?: Prisma.SortOrder;
    isGlobal?: Prisma.SortOrder;
    editable?: Prisma.SortOrder;
    levelDescriptions?: Prisma.SortOrderInput | Prisma.SortOrder;
    section?: Prisma.SortOrderInput | Prisma.SortOrder;
    rubricVersion?: Prisma.RubricVersionOrderByWithRelationInput;
    scaleVersionBins?: Prisma.ScaleVersionBinOrderByRelationAggregateInput;
    responses?: Prisma.ResponseOrderByRelationAggregateInput;
};
export type ScaleVersionWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.ScaleVersionWhereInput | Prisma.ScaleVersionWhereInput[];
    OR?: Prisma.ScaleVersionWhereInput[];
    NOT?: Prisma.ScaleVersionWhereInput | Prisma.ScaleVersionWhereInput[];
    rubricVersionId?: Prisma.UuidFilter<"ScaleVersion"> | string;
    originalScaleId?: Prisma.UuidFilter<"ScaleVersion"> | string;
    prompt?: Prisma.StringFilter<"ScaleVersion"> | string;
    orderIndex?: Prisma.IntFilter<"ScaleVersion"> | number;
    isGlobal?: Prisma.BoolFilter<"ScaleVersion"> | boolean;
    editable?: Prisma.BoolFilter<"ScaleVersion"> | boolean;
    levelDescriptions?: Prisma.JsonNullableFilter<"ScaleVersion">;
    section?: Prisma.StringNullableFilter<"ScaleVersion"> | string | null;
    rubricVersion?: Prisma.XOR<Prisma.RubricVersionScalarRelationFilter, Prisma.RubricVersionWhereInput>;
    scaleVersionBins?: Prisma.ScaleVersionBinListRelationFilter;
    responses?: Prisma.ResponseListRelationFilter;
}, "id">;
export type ScaleVersionOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    rubricVersionId?: Prisma.SortOrder;
    originalScaleId?: Prisma.SortOrder;
    prompt?: Prisma.SortOrder;
    orderIndex?: Prisma.SortOrder;
    isGlobal?: Prisma.SortOrder;
    editable?: Prisma.SortOrder;
    levelDescriptions?: Prisma.SortOrderInput | Prisma.SortOrder;
    section?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.ScaleVersionCountOrderByAggregateInput;
    _avg?: Prisma.ScaleVersionAvgOrderByAggregateInput;
    _max?: Prisma.ScaleVersionMaxOrderByAggregateInput;
    _min?: Prisma.ScaleVersionMinOrderByAggregateInput;
    _sum?: Prisma.ScaleVersionSumOrderByAggregateInput;
};
export type ScaleVersionScalarWhereWithAggregatesInput = {
    AND?: Prisma.ScaleVersionScalarWhereWithAggregatesInput | Prisma.ScaleVersionScalarWhereWithAggregatesInput[];
    OR?: Prisma.ScaleVersionScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ScaleVersionScalarWhereWithAggregatesInput | Prisma.ScaleVersionScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"ScaleVersion"> | string;
    rubricVersionId?: Prisma.UuidWithAggregatesFilter<"ScaleVersion"> | string;
    originalScaleId?: Prisma.UuidWithAggregatesFilter<"ScaleVersion"> | string;
    prompt?: Prisma.StringWithAggregatesFilter<"ScaleVersion"> | string;
    orderIndex?: Prisma.IntWithAggregatesFilter<"ScaleVersion"> | number;
    isGlobal?: Prisma.BoolWithAggregatesFilter<"ScaleVersion"> | boolean;
    editable?: Prisma.BoolWithAggregatesFilter<"ScaleVersion"> | boolean;
    levelDescriptions?: Prisma.JsonNullableWithAggregatesFilter<"ScaleVersion">;
    section?: Prisma.StringNullableWithAggregatesFilter<"ScaleVersion"> | string | null;
};
export type ScaleVersionCreateInput = {
    id?: string;
    originalScaleId: string;
    prompt: string;
    orderIndex: number;
    isGlobal: boolean;
    editable: boolean;
    levelDescriptions?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    section?: string | null;
    rubricVersion: Prisma.RubricVersionCreateNestedOneWithoutScaleVersionsInput;
    scaleVersionBins?: Prisma.ScaleVersionBinCreateNestedManyWithoutScaleVersionInput;
    responses?: Prisma.ResponseCreateNestedManyWithoutScaleVersionInput;
};
export type ScaleVersionUncheckedCreateInput = {
    id?: string;
    rubricVersionId: string;
    originalScaleId: string;
    prompt: string;
    orderIndex: number;
    isGlobal: boolean;
    editable: boolean;
    levelDescriptions?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    section?: string | null;
    scaleVersionBins?: Prisma.ScaleVersionBinUncheckedCreateNestedManyWithoutScaleVersionInput;
    responses?: Prisma.ResponseUncheckedCreateNestedManyWithoutScaleVersionInput;
};
export type ScaleVersionUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    originalScaleId?: Prisma.StringFieldUpdateOperationsInput | string;
    prompt?: Prisma.StringFieldUpdateOperationsInput | string;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    isGlobal?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    editable?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    levelDescriptions?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    section?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    rubricVersion?: Prisma.RubricVersionUpdateOneRequiredWithoutScaleVersionsNestedInput;
    scaleVersionBins?: Prisma.ScaleVersionBinUpdateManyWithoutScaleVersionNestedInput;
    responses?: Prisma.ResponseUpdateManyWithoutScaleVersionNestedInput;
};
export type ScaleVersionUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rubricVersionId?: Prisma.StringFieldUpdateOperationsInput | string;
    originalScaleId?: Prisma.StringFieldUpdateOperationsInput | string;
    prompt?: Prisma.StringFieldUpdateOperationsInput | string;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    isGlobal?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    editable?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    levelDescriptions?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    section?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    scaleVersionBins?: Prisma.ScaleVersionBinUncheckedUpdateManyWithoutScaleVersionNestedInput;
    responses?: Prisma.ResponseUncheckedUpdateManyWithoutScaleVersionNestedInput;
};
export type ScaleVersionCreateManyInput = {
    id?: string;
    rubricVersionId: string;
    originalScaleId: string;
    prompt: string;
    orderIndex: number;
    isGlobal: boolean;
    editable: boolean;
    levelDescriptions?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    section?: string | null;
};
export type ScaleVersionUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    originalScaleId?: Prisma.StringFieldUpdateOperationsInput | string;
    prompt?: Prisma.StringFieldUpdateOperationsInput | string;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    isGlobal?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    editable?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    levelDescriptions?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    section?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type ScaleVersionUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rubricVersionId?: Prisma.StringFieldUpdateOperationsInput | string;
    originalScaleId?: Prisma.StringFieldUpdateOperationsInput | string;
    prompt?: Prisma.StringFieldUpdateOperationsInput | string;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    isGlobal?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    editable?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    levelDescriptions?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    section?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type ScaleVersionListRelationFilter = {
    every?: Prisma.ScaleVersionWhereInput;
    some?: Prisma.ScaleVersionWhereInput;
    none?: Prisma.ScaleVersionWhereInput;
};
export type ScaleVersionOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ScaleVersionCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    rubricVersionId?: Prisma.SortOrder;
    originalScaleId?: Prisma.SortOrder;
    prompt?: Prisma.SortOrder;
    orderIndex?: Prisma.SortOrder;
    isGlobal?: Prisma.SortOrder;
    editable?: Prisma.SortOrder;
    levelDescriptions?: Prisma.SortOrder;
    section?: Prisma.SortOrder;
};
export type ScaleVersionAvgOrderByAggregateInput = {
    orderIndex?: Prisma.SortOrder;
};
export type ScaleVersionMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    rubricVersionId?: Prisma.SortOrder;
    originalScaleId?: Prisma.SortOrder;
    prompt?: Prisma.SortOrder;
    orderIndex?: Prisma.SortOrder;
    isGlobal?: Prisma.SortOrder;
    editable?: Prisma.SortOrder;
    section?: Prisma.SortOrder;
};
export type ScaleVersionMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    rubricVersionId?: Prisma.SortOrder;
    originalScaleId?: Prisma.SortOrder;
    prompt?: Prisma.SortOrder;
    orderIndex?: Prisma.SortOrder;
    isGlobal?: Prisma.SortOrder;
    editable?: Prisma.SortOrder;
    section?: Prisma.SortOrder;
};
export type ScaleVersionSumOrderByAggregateInput = {
    orderIndex?: Prisma.SortOrder;
};
export type ScaleVersionScalarRelationFilter = {
    is?: Prisma.ScaleVersionWhereInput;
    isNot?: Prisma.ScaleVersionWhereInput;
};
export type ScaleVersionCreateNestedManyWithoutRubricVersionInput = {
    create?: Prisma.XOR<Prisma.ScaleVersionCreateWithoutRubricVersionInput, Prisma.ScaleVersionUncheckedCreateWithoutRubricVersionInput> | Prisma.ScaleVersionCreateWithoutRubricVersionInput[] | Prisma.ScaleVersionUncheckedCreateWithoutRubricVersionInput[];
    connectOrCreate?: Prisma.ScaleVersionCreateOrConnectWithoutRubricVersionInput | Prisma.ScaleVersionCreateOrConnectWithoutRubricVersionInput[];
    createMany?: Prisma.ScaleVersionCreateManyRubricVersionInputEnvelope;
    connect?: Prisma.ScaleVersionWhereUniqueInput | Prisma.ScaleVersionWhereUniqueInput[];
};
export type ScaleVersionUncheckedCreateNestedManyWithoutRubricVersionInput = {
    create?: Prisma.XOR<Prisma.ScaleVersionCreateWithoutRubricVersionInput, Prisma.ScaleVersionUncheckedCreateWithoutRubricVersionInput> | Prisma.ScaleVersionCreateWithoutRubricVersionInput[] | Prisma.ScaleVersionUncheckedCreateWithoutRubricVersionInput[];
    connectOrCreate?: Prisma.ScaleVersionCreateOrConnectWithoutRubricVersionInput | Prisma.ScaleVersionCreateOrConnectWithoutRubricVersionInput[];
    createMany?: Prisma.ScaleVersionCreateManyRubricVersionInputEnvelope;
    connect?: Prisma.ScaleVersionWhereUniqueInput | Prisma.ScaleVersionWhereUniqueInput[];
};
export type ScaleVersionUpdateManyWithoutRubricVersionNestedInput = {
    create?: Prisma.XOR<Prisma.ScaleVersionCreateWithoutRubricVersionInput, Prisma.ScaleVersionUncheckedCreateWithoutRubricVersionInput> | Prisma.ScaleVersionCreateWithoutRubricVersionInput[] | Prisma.ScaleVersionUncheckedCreateWithoutRubricVersionInput[];
    connectOrCreate?: Prisma.ScaleVersionCreateOrConnectWithoutRubricVersionInput | Prisma.ScaleVersionCreateOrConnectWithoutRubricVersionInput[];
    upsert?: Prisma.ScaleVersionUpsertWithWhereUniqueWithoutRubricVersionInput | Prisma.ScaleVersionUpsertWithWhereUniqueWithoutRubricVersionInput[];
    createMany?: Prisma.ScaleVersionCreateManyRubricVersionInputEnvelope;
    set?: Prisma.ScaleVersionWhereUniqueInput | Prisma.ScaleVersionWhereUniqueInput[];
    disconnect?: Prisma.ScaleVersionWhereUniqueInput | Prisma.ScaleVersionWhereUniqueInput[];
    delete?: Prisma.ScaleVersionWhereUniqueInput | Prisma.ScaleVersionWhereUniqueInput[];
    connect?: Prisma.ScaleVersionWhereUniqueInput | Prisma.ScaleVersionWhereUniqueInput[];
    update?: Prisma.ScaleVersionUpdateWithWhereUniqueWithoutRubricVersionInput | Prisma.ScaleVersionUpdateWithWhereUniqueWithoutRubricVersionInput[];
    updateMany?: Prisma.ScaleVersionUpdateManyWithWhereWithoutRubricVersionInput | Prisma.ScaleVersionUpdateManyWithWhereWithoutRubricVersionInput[];
    deleteMany?: Prisma.ScaleVersionScalarWhereInput | Prisma.ScaleVersionScalarWhereInput[];
};
export type ScaleVersionUncheckedUpdateManyWithoutRubricVersionNestedInput = {
    create?: Prisma.XOR<Prisma.ScaleVersionCreateWithoutRubricVersionInput, Prisma.ScaleVersionUncheckedCreateWithoutRubricVersionInput> | Prisma.ScaleVersionCreateWithoutRubricVersionInput[] | Prisma.ScaleVersionUncheckedCreateWithoutRubricVersionInput[];
    connectOrCreate?: Prisma.ScaleVersionCreateOrConnectWithoutRubricVersionInput | Prisma.ScaleVersionCreateOrConnectWithoutRubricVersionInput[];
    upsert?: Prisma.ScaleVersionUpsertWithWhereUniqueWithoutRubricVersionInput | Prisma.ScaleVersionUpsertWithWhereUniqueWithoutRubricVersionInput[];
    createMany?: Prisma.ScaleVersionCreateManyRubricVersionInputEnvelope;
    set?: Prisma.ScaleVersionWhereUniqueInput | Prisma.ScaleVersionWhereUniqueInput[];
    disconnect?: Prisma.ScaleVersionWhereUniqueInput | Prisma.ScaleVersionWhereUniqueInput[];
    delete?: Prisma.ScaleVersionWhereUniqueInput | Prisma.ScaleVersionWhereUniqueInput[];
    connect?: Prisma.ScaleVersionWhereUniqueInput | Prisma.ScaleVersionWhereUniqueInput[];
    update?: Prisma.ScaleVersionUpdateWithWhereUniqueWithoutRubricVersionInput | Prisma.ScaleVersionUpdateWithWhereUniqueWithoutRubricVersionInput[];
    updateMany?: Prisma.ScaleVersionUpdateManyWithWhereWithoutRubricVersionInput | Prisma.ScaleVersionUpdateManyWithWhereWithoutRubricVersionInput[];
    deleteMany?: Prisma.ScaleVersionScalarWhereInput | Prisma.ScaleVersionScalarWhereInput[];
};
export type ScaleVersionCreateNestedOneWithoutScaleVersionBinsInput = {
    create?: Prisma.XOR<Prisma.ScaleVersionCreateWithoutScaleVersionBinsInput, Prisma.ScaleVersionUncheckedCreateWithoutScaleVersionBinsInput>;
    connectOrCreate?: Prisma.ScaleVersionCreateOrConnectWithoutScaleVersionBinsInput;
    connect?: Prisma.ScaleVersionWhereUniqueInput;
};
export type ScaleVersionUpdateOneRequiredWithoutScaleVersionBinsNestedInput = {
    create?: Prisma.XOR<Prisma.ScaleVersionCreateWithoutScaleVersionBinsInput, Prisma.ScaleVersionUncheckedCreateWithoutScaleVersionBinsInput>;
    connectOrCreate?: Prisma.ScaleVersionCreateOrConnectWithoutScaleVersionBinsInput;
    upsert?: Prisma.ScaleVersionUpsertWithoutScaleVersionBinsInput;
    connect?: Prisma.ScaleVersionWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ScaleVersionUpdateToOneWithWhereWithoutScaleVersionBinsInput, Prisma.ScaleVersionUpdateWithoutScaleVersionBinsInput>, Prisma.ScaleVersionUncheckedUpdateWithoutScaleVersionBinsInput>;
};
export type ScaleVersionCreateNestedOneWithoutResponsesInput = {
    create?: Prisma.XOR<Prisma.ScaleVersionCreateWithoutResponsesInput, Prisma.ScaleVersionUncheckedCreateWithoutResponsesInput>;
    connectOrCreate?: Prisma.ScaleVersionCreateOrConnectWithoutResponsesInput;
    connect?: Prisma.ScaleVersionWhereUniqueInput;
};
export type ScaleVersionUpdateOneRequiredWithoutResponsesNestedInput = {
    create?: Prisma.XOR<Prisma.ScaleVersionCreateWithoutResponsesInput, Prisma.ScaleVersionUncheckedCreateWithoutResponsesInput>;
    connectOrCreate?: Prisma.ScaleVersionCreateOrConnectWithoutResponsesInput;
    upsert?: Prisma.ScaleVersionUpsertWithoutResponsesInput;
    connect?: Prisma.ScaleVersionWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ScaleVersionUpdateToOneWithWhereWithoutResponsesInput, Prisma.ScaleVersionUpdateWithoutResponsesInput>, Prisma.ScaleVersionUncheckedUpdateWithoutResponsesInput>;
};
export type ScaleVersionCreateWithoutRubricVersionInput = {
    id?: string;
    originalScaleId: string;
    prompt: string;
    orderIndex: number;
    isGlobal: boolean;
    editable: boolean;
    levelDescriptions?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    section?: string | null;
    scaleVersionBins?: Prisma.ScaleVersionBinCreateNestedManyWithoutScaleVersionInput;
    responses?: Prisma.ResponseCreateNestedManyWithoutScaleVersionInput;
};
export type ScaleVersionUncheckedCreateWithoutRubricVersionInput = {
    id?: string;
    originalScaleId: string;
    prompt: string;
    orderIndex: number;
    isGlobal: boolean;
    editable: boolean;
    levelDescriptions?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    section?: string | null;
    scaleVersionBins?: Prisma.ScaleVersionBinUncheckedCreateNestedManyWithoutScaleVersionInput;
    responses?: Prisma.ResponseUncheckedCreateNestedManyWithoutScaleVersionInput;
};
export type ScaleVersionCreateOrConnectWithoutRubricVersionInput = {
    where: Prisma.ScaleVersionWhereUniqueInput;
    create: Prisma.XOR<Prisma.ScaleVersionCreateWithoutRubricVersionInput, Prisma.ScaleVersionUncheckedCreateWithoutRubricVersionInput>;
};
export type ScaleVersionCreateManyRubricVersionInputEnvelope = {
    data: Prisma.ScaleVersionCreateManyRubricVersionInput | Prisma.ScaleVersionCreateManyRubricVersionInput[];
    skipDuplicates?: boolean;
};
export type ScaleVersionUpsertWithWhereUniqueWithoutRubricVersionInput = {
    where: Prisma.ScaleVersionWhereUniqueInput;
    update: Prisma.XOR<Prisma.ScaleVersionUpdateWithoutRubricVersionInput, Prisma.ScaleVersionUncheckedUpdateWithoutRubricVersionInput>;
    create: Prisma.XOR<Prisma.ScaleVersionCreateWithoutRubricVersionInput, Prisma.ScaleVersionUncheckedCreateWithoutRubricVersionInput>;
};
export type ScaleVersionUpdateWithWhereUniqueWithoutRubricVersionInput = {
    where: Prisma.ScaleVersionWhereUniqueInput;
    data: Prisma.XOR<Prisma.ScaleVersionUpdateWithoutRubricVersionInput, Prisma.ScaleVersionUncheckedUpdateWithoutRubricVersionInput>;
};
export type ScaleVersionUpdateManyWithWhereWithoutRubricVersionInput = {
    where: Prisma.ScaleVersionScalarWhereInput;
    data: Prisma.XOR<Prisma.ScaleVersionUpdateManyMutationInput, Prisma.ScaleVersionUncheckedUpdateManyWithoutRubricVersionInput>;
};
export type ScaleVersionScalarWhereInput = {
    AND?: Prisma.ScaleVersionScalarWhereInput | Prisma.ScaleVersionScalarWhereInput[];
    OR?: Prisma.ScaleVersionScalarWhereInput[];
    NOT?: Prisma.ScaleVersionScalarWhereInput | Prisma.ScaleVersionScalarWhereInput[];
    id?: Prisma.UuidFilter<"ScaleVersion"> | string;
    rubricVersionId?: Prisma.UuidFilter<"ScaleVersion"> | string;
    originalScaleId?: Prisma.UuidFilter<"ScaleVersion"> | string;
    prompt?: Prisma.StringFilter<"ScaleVersion"> | string;
    orderIndex?: Prisma.IntFilter<"ScaleVersion"> | number;
    isGlobal?: Prisma.BoolFilter<"ScaleVersion"> | boolean;
    editable?: Prisma.BoolFilter<"ScaleVersion"> | boolean;
    levelDescriptions?: Prisma.JsonNullableFilter<"ScaleVersion">;
    section?: Prisma.StringNullableFilter<"ScaleVersion"> | string | null;
};
export type ScaleVersionCreateWithoutScaleVersionBinsInput = {
    id?: string;
    originalScaleId: string;
    prompt: string;
    orderIndex: number;
    isGlobal: boolean;
    editable: boolean;
    levelDescriptions?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    section?: string | null;
    rubricVersion: Prisma.RubricVersionCreateNestedOneWithoutScaleVersionsInput;
    responses?: Prisma.ResponseCreateNestedManyWithoutScaleVersionInput;
};
export type ScaleVersionUncheckedCreateWithoutScaleVersionBinsInput = {
    id?: string;
    rubricVersionId: string;
    originalScaleId: string;
    prompt: string;
    orderIndex: number;
    isGlobal: boolean;
    editable: boolean;
    levelDescriptions?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    section?: string | null;
    responses?: Prisma.ResponseUncheckedCreateNestedManyWithoutScaleVersionInput;
};
export type ScaleVersionCreateOrConnectWithoutScaleVersionBinsInput = {
    where: Prisma.ScaleVersionWhereUniqueInput;
    create: Prisma.XOR<Prisma.ScaleVersionCreateWithoutScaleVersionBinsInput, Prisma.ScaleVersionUncheckedCreateWithoutScaleVersionBinsInput>;
};
export type ScaleVersionUpsertWithoutScaleVersionBinsInput = {
    update: Prisma.XOR<Prisma.ScaleVersionUpdateWithoutScaleVersionBinsInput, Prisma.ScaleVersionUncheckedUpdateWithoutScaleVersionBinsInput>;
    create: Prisma.XOR<Prisma.ScaleVersionCreateWithoutScaleVersionBinsInput, Prisma.ScaleVersionUncheckedCreateWithoutScaleVersionBinsInput>;
    where?: Prisma.ScaleVersionWhereInput;
};
export type ScaleVersionUpdateToOneWithWhereWithoutScaleVersionBinsInput = {
    where?: Prisma.ScaleVersionWhereInput;
    data: Prisma.XOR<Prisma.ScaleVersionUpdateWithoutScaleVersionBinsInput, Prisma.ScaleVersionUncheckedUpdateWithoutScaleVersionBinsInput>;
};
export type ScaleVersionUpdateWithoutScaleVersionBinsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    originalScaleId?: Prisma.StringFieldUpdateOperationsInput | string;
    prompt?: Prisma.StringFieldUpdateOperationsInput | string;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    isGlobal?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    editable?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    levelDescriptions?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    section?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    rubricVersion?: Prisma.RubricVersionUpdateOneRequiredWithoutScaleVersionsNestedInput;
    responses?: Prisma.ResponseUpdateManyWithoutScaleVersionNestedInput;
};
export type ScaleVersionUncheckedUpdateWithoutScaleVersionBinsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rubricVersionId?: Prisma.StringFieldUpdateOperationsInput | string;
    originalScaleId?: Prisma.StringFieldUpdateOperationsInput | string;
    prompt?: Prisma.StringFieldUpdateOperationsInput | string;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    isGlobal?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    editable?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    levelDescriptions?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    section?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    responses?: Prisma.ResponseUncheckedUpdateManyWithoutScaleVersionNestedInput;
};
export type ScaleVersionCreateWithoutResponsesInput = {
    id?: string;
    originalScaleId: string;
    prompt: string;
    orderIndex: number;
    isGlobal: boolean;
    editable: boolean;
    levelDescriptions?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    section?: string | null;
    rubricVersion: Prisma.RubricVersionCreateNestedOneWithoutScaleVersionsInput;
    scaleVersionBins?: Prisma.ScaleVersionBinCreateNestedManyWithoutScaleVersionInput;
};
export type ScaleVersionUncheckedCreateWithoutResponsesInput = {
    id?: string;
    rubricVersionId: string;
    originalScaleId: string;
    prompt: string;
    orderIndex: number;
    isGlobal: boolean;
    editable: boolean;
    levelDescriptions?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    section?: string | null;
    scaleVersionBins?: Prisma.ScaleVersionBinUncheckedCreateNestedManyWithoutScaleVersionInput;
};
export type ScaleVersionCreateOrConnectWithoutResponsesInput = {
    where: Prisma.ScaleVersionWhereUniqueInput;
    create: Prisma.XOR<Prisma.ScaleVersionCreateWithoutResponsesInput, Prisma.ScaleVersionUncheckedCreateWithoutResponsesInput>;
};
export type ScaleVersionUpsertWithoutResponsesInput = {
    update: Prisma.XOR<Prisma.ScaleVersionUpdateWithoutResponsesInput, Prisma.ScaleVersionUncheckedUpdateWithoutResponsesInput>;
    create: Prisma.XOR<Prisma.ScaleVersionCreateWithoutResponsesInput, Prisma.ScaleVersionUncheckedCreateWithoutResponsesInput>;
    where?: Prisma.ScaleVersionWhereInput;
};
export type ScaleVersionUpdateToOneWithWhereWithoutResponsesInput = {
    where?: Prisma.ScaleVersionWhereInput;
    data: Prisma.XOR<Prisma.ScaleVersionUpdateWithoutResponsesInput, Prisma.ScaleVersionUncheckedUpdateWithoutResponsesInput>;
};
export type ScaleVersionUpdateWithoutResponsesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    originalScaleId?: Prisma.StringFieldUpdateOperationsInput | string;
    prompt?: Prisma.StringFieldUpdateOperationsInput | string;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    isGlobal?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    editable?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    levelDescriptions?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    section?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    rubricVersion?: Prisma.RubricVersionUpdateOneRequiredWithoutScaleVersionsNestedInput;
    scaleVersionBins?: Prisma.ScaleVersionBinUpdateManyWithoutScaleVersionNestedInput;
};
export type ScaleVersionUncheckedUpdateWithoutResponsesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rubricVersionId?: Prisma.StringFieldUpdateOperationsInput | string;
    originalScaleId?: Prisma.StringFieldUpdateOperationsInput | string;
    prompt?: Prisma.StringFieldUpdateOperationsInput | string;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    isGlobal?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    editable?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    levelDescriptions?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    section?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    scaleVersionBins?: Prisma.ScaleVersionBinUncheckedUpdateManyWithoutScaleVersionNestedInput;
};
export type ScaleVersionCreateManyRubricVersionInput = {
    id?: string;
    originalScaleId: string;
    prompt: string;
    orderIndex: number;
    isGlobal: boolean;
    editable: boolean;
    levelDescriptions?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    section?: string | null;
};
export type ScaleVersionUpdateWithoutRubricVersionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    originalScaleId?: Prisma.StringFieldUpdateOperationsInput | string;
    prompt?: Prisma.StringFieldUpdateOperationsInput | string;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    isGlobal?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    editable?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    levelDescriptions?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    section?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    scaleVersionBins?: Prisma.ScaleVersionBinUpdateManyWithoutScaleVersionNestedInput;
    responses?: Prisma.ResponseUpdateManyWithoutScaleVersionNestedInput;
};
export type ScaleVersionUncheckedUpdateWithoutRubricVersionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    originalScaleId?: Prisma.StringFieldUpdateOperationsInput | string;
    prompt?: Prisma.StringFieldUpdateOperationsInput | string;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    isGlobal?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    editable?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    levelDescriptions?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    section?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    scaleVersionBins?: Prisma.ScaleVersionBinUncheckedUpdateManyWithoutScaleVersionNestedInput;
    responses?: Prisma.ResponseUncheckedUpdateManyWithoutScaleVersionNestedInput;
};
export type ScaleVersionUncheckedUpdateManyWithoutRubricVersionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    originalScaleId?: Prisma.StringFieldUpdateOperationsInput | string;
    prompt?: Prisma.StringFieldUpdateOperationsInput | string;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    isGlobal?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    editable?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    levelDescriptions?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    section?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
/**
 * Count Type ScaleVersionCountOutputType
 */
export type ScaleVersionCountOutputType = {
    scaleVersionBins: number;
    responses: number;
};
export type ScaleVersionCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    scaleVersionBins?: boolean | ScaleVersionCountOutputTypeCountScaleVersionBinsArgs;
    responses?: boolean | ScaleVersionCountOutputTypeCountResponsesArgs;
};
/**
 * ScaleVersionCountOutputType without action
 */
export type ScaleVersionCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScaleVersionCountOutputType
     */
    select?: Prisma.ScaleVersionCountOutputTypeSelect<ExtArgs> | null;
};
/**
 * ScaleVersionCountOutputType without action
 */
export type ScaleVersionCountOutputTypeCountScaleVersionBinsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ScaleVersionBinWhereInput;
};
/**
 * ScaleVersionCountOutputType without action
 */
export type ScaleVersionCountOutputTypeCountResponsesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ResponseWhereInput;
};
export type ScaleVersionSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    rubricVersionId?: boolean;
    originalScaleId?: boolean;
    prompt?: boolean;
    orderIndex?: boolean;
    isGlobal?: boolean;
    editable?: boolean;
    levelDescriptions?: boolean;
    section?: boolean;
    rubricVersion?: boolean | Prisma.RubricVersionDefaultArgs<ExtArgs>;
    scaleVersionBins?: boolean | Prisma.ScaleVersion$scaleVersionBinsArgs<ExtArgs>;
    responses?: boolean | Prisma.ScaleVersion$responsesArgs<ExtArgs>;
    _count?: boolean | Prisma.ScaleVersionCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["scaleVersion"]>;
export type ScaleVersionSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    rubricVersionId?: boolean;
    originalScaleId?: boolean;
    prompt?: boolean;
    orderIndex?: boolean;
    isGlobal?: boolean;
    editable?: boolean;
    levelDescriptions?: boolean;
    section?: boolean;
    rubricVersion?: boolean | Prisma.RubricVersionDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["scaleVersion"]>;
export type ScaleVersionSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    rubricVersionId?: boolean;
    originalScaleId?: boolean;
    prompt?: boolean;
    orderIndex?: boolean;
    isGlobal?: boolean;
    editable?: boolean;
    levelDescriptions?: boolean;
    section?: boolean;
    rubricVersion?: boolean | Prisma.RubricVersionDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["scaleVersion"]>;
export type ScaleVersionSelectScalar = {
    id?: boolean;
    rubricVersionId?: boolean;
    originalScaleId?: boolean;
    prompt?: boolean;
    orderIndex?: boolean;
    isGlobal?: boolean;
    editable?: boolean;
    levelDescriptions?: boolean;
    section?: boolean;
};
export type ScaleVersionOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "rubricVersionId" | "originalScaleId" | "prompt" | "orderIndex" | "isGlobal" | "editable" | "levelDescriptions" | "section", ExtArgs["result"]["scaleVersion"]>;
export type ScaleVersionInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    rubricVersion?: boolean | Prisma.RubricVersionDefaultArgs<ExtArgs>;
    scaleVersionBins?: boolean | Prisma.ScaleVersion$scaleVersionBinsArgs<ExtArgs>;
    responses?: boolean | Prisma.ScaleVersion$responsesArgs<ExtArgs>;
    _count?: boolean | Prisma.ScaleVersionCountOutputTypeDefaultArgs<ExtArgs>;
};
export type ScaleVersionIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    rubricVersion?: boolean | Prisma.RubricVersionDefaultArgs<ExtArgs>;
};
export type ScaleVersionIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    rubricVersion?: boolean | Prisma.RubricVersionDefaultArgs<ExtArgs>;
};
export type $ScaleVersionPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ScaleVersion";
    objects: {
        rubricVersion: Prisma.$RubricVersionPayload<ExtArgs>;
        scaleVersionBins: Prisma.$ScaleVersionBinPayload<ExtArgs>[];
        responses: Prisma.$ResponsePayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        rubricVersionId: string;
        originalScaleId: string;
        prompt: string;
        orderIndex: number;
        isGlobal: boolean;
        editable: boolean;
        levelDescriptions: runtime.JsonValue | null;
        section: string | null;
    }, ExtArgs["result"]["scaleVersion"]>;
    composites: {};
};
export type ScaleVersionGetPayload<S extends boolean | null | undefined | ScaleVersionDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ScaleVersionPayload, S>;
export type ScaleVersionCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ScaleVersionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ScaleVersionCountAggregateInputType | true;
};
export interface ScaleVersionDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ScaleVersion'];
        meta: {
            name: 'ScaleVersion';
        };
    };
    /**
     * Find zero or one ScaleVersion that matches the filter.
     * @param {ScaleVersionFindUniqueArgs} args - Arguments to find a ScaleVersion
     * @example
     * // Get one ScaleVersion
     * const scaleVersion = await prisma.scaleVersion.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ScaleVersionFindUniqueArgs>(args: Prisma.SelectSubset<T, ScaleVersionFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ScaleVersionClient<runtime.Types.Result.GetResult<Prisma.$ScaleVersionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one ScaleVersion that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ScaleVersionFindUniqueOrThrowArgs} args - Arguments to find a ScaleVersion
     * @example
     * // Get one ScaleVersion
     * const scaleVersion = await prisma.scaleVersion.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ScaleVersionFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ScaleVersionFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ScaleVersionClient<runtime.Types.Result.GetResult<Prisma.$ScaleVersionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first ScaleVersion that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScaleVersionFindFirstArgs} args - Arguments to find a ScaleVersion
     * @example
     * // Get one ScaleVersion
     * const scaleVersion = await prisma.scaleVersion.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ScaleVersionFindFirstArgs>(args?: Prisma.SelectSubset<T, ScaleVersionFindFirstArgs<ExtArgs>>): Prisma.Prisma__ScaleVersionClient<runtime.Types.Result.GetResult<Prisma.$ScaleVersionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first ScaleVersion that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScaleVersionFindFirstOrThrowArgs} args - Arguments to find a ScaleVersion
     * @example
     * // Get one ScaleVersion
     * const scaleVersion = await prisma.scaleVersion.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ScaleVersionFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ScaleVersionFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ScaleVersionClient<runtime.Types.Result.GetResult<Prisma.$ScaleVersionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more ScaleVersions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScaleVersionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ScaleVersions
     * const scaleVersions = await prisma.scaleVersion.findMany()
     *
     * // Get first 10 ScaleVersions
     * const scaleVersions = await prisma.scaleVersion.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const scaleVersionWithIdOnly = await prisma.scaleVersion.findMany({ select: { id: true } })
     *
     */
    findMany<T extends ScaleVersionFindManyArgs>(args?: Prisma.SelectSubset<T, ScaleVersionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ScaleVersionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a ScaleVersion.
     * @param {ScaleVersionCreateArgs} args - Arguments to create a ScaleVersion.
     * @example
     * // Create one ScaleVersion
     * const ScaleVersion = await prisma.scaleVersion.create({
     *   data: {
     *     // ... data to create a ScaleVersion
     *   }
     * })
     *
     */
    create<T extends ScaleVersionCreateArgs>(args: Prisma.SelectSubset<T, ScaleVersionCreateArgs<ExtArgs>>): Prisma.Prisma__ScaleVersionClient<runtime.Types.Result.GetResult<Prisma.$ScaleVersionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many ScaleVersions.
     * @param {ScaleVersionCreateManyArgs} args - Arguments to create many ScaleVersions.
     * @example
     * // Create many ScaleVersions
     * const scaleVersion = await prisma.scaleVersion.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends ScaleVersionCreateManyArgs>(args?: Prisma.SelectSubset<T, ScaleVersionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many ScaleVersions and returns the data saved in the database.
     * @param {ScaleVersionCreateManyAndReturnArgs} args - Arguments to create many ScaleVersions.
     * @example
     * // Create many ScaleVersions
     * const scaleVersion = await prisma.scaleVersion.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many ScaleVersions and only return the `id`
     * const scaleVersionWithIdOnly = await prisma.scaleVersion.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends ScaleVersionCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ScaleVersionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ScaleVersionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a ScaleVersion.
     * @param {ScaleVersionDeleteArgs} args - Arguments to delete one ScaleVersion.
     * @example
     * // Delete one ScaleVersion
     * const ScaleVersion = await prisma.scaleVersion.delete({
     *   where: {
     *     // ... filter to delete one ScaleVersion
     *   }
     * })
     *
     */
    delete<T extends ScaleVersionDeleteArgs>(args: Prisma.SelectSubset<T, ScaleVersionDeleteArgs<ExtArgs>>): Prisma.Prisma__ScaleVersionClient<runtime.Types.Result.GetResult<Prisma.$ScaleVersionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one ScaleVersion.
     * @param {ScaleVersionUpdateArgs} args - Arguments to update one ScaleVersion.
     * @example
     * // Update one ScaleVersion
     * const scaleVersion = await prisma.scaleVersion.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends ScaleVersionUpdateArgs>(args: Prisma.SelectSubset<T, ScaleVersionUpdateArgs<ExtArgs>>): Prisma.Prisma__ScaleVersionClient<runtime.Types.Result.GetResult<Prisma.$ScaleVersionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more ScaleVersions.
     * @param {ScaleVersionDeleteManyArgs} args - Arguments to filter ScaleVersions to delete.
     * @example
     * // Delete a few ScaleVersions
     * const { count } = await prisma.scaleVersion.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends ScaleVersionDeleteManyArgs>(args?: Prisma.SelectSubset<T, ScaleVersionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more ScaleVersions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScaleVersionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ScaleVersions
     * const scaleVersion = await prisma.scaleVersion.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends ScaleVersionUpdateManyArgs>(args: Prisma.SelectSubset<T, ScaleVersionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more ScaleVersions and returns the data updated in the database.
     * @param {ScaleVersionUpdateManyAndReturnArgs} args - Arguments to update many ScaleVersions.
     * @example
     * // Update many ScaleVersions
     * const scaleVersion = await prisma.scaleVersion.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more ScaleVersions and only return the `id`
     * const scaleVersionWithIdOnly = await prisma.scaleVersion.updateManyAndReturn({
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
    updateManyAndReturn<T extends ScaleVersionUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ScaleVersionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ScaleVersionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one ScaleVersion.
     * @param {ScaleVersionUpsertArgs} args - Arguments to update or create a ScaleVersion.
     * @example
     * // Update or create a ScaleVersion
     * const scaleVersion = await prisma.scaleVersion.upsert({
     *   create: {
     *     // ... data to create a ScaleVersion
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ScaleVersion we want to update
     *   }
     * })
     */
    upsert<T extends ScaleVersionUpsertArgs>(args: Prisma.SelectSubset<T, ScaleVersionUpsertArgs<ExtArgs>>): Prisma.Prisma__ScaleVersionClient<runtime.Types.Result.GetResult<Prisma.$ScaleVersionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of ScaleVersions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScaleVersionCountArgs} args - Arguments to filter ScaleVersions to count.
     * @example
     * // Count the number of ScaleVersions
     * const count = await prisma.scaleVersion.count({
     *   where: {
     *     // ... the filter for the ScaleVersions we want to count
     *   }
     * })
    **/
    count<T extends ScaleVersionCountArgs>(args?: Prisma.Subset<T, ScaleVersionCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ScaleVersionCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a ScaleVersion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScaleVersionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ScaleVersionAggregateArgs>(args: Prisma.Subset<T, ScaleVersionAggregateArgs>): Prisma.PrismaPromise<GetScaleVersionAggregateType<T>>;
    /**
     * Group by ScaleVersion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScaleVersionGroupByArgs} args - Group by arguments.
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
    groupBy<T extends ScaleVersionGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ScaleVersionGroupByArgs['orderBy'];
    } : {
        orderBy?: ScaleVersionGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ScaleVersionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetScaleVersionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the ScaleVersion model
     */
    readonly fields: ScaleVersionFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for ScaleVersion.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__ScaleVersionClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    rubricVersion<T extends Prisma.RubricVersionDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.RubricVersionDefaultArgs<ExtArgs>>): Prisma.Prisma__RubricVersionClient<runtime.Types.Result.GetResult<Prisma.$RubricVersionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    scaleVersionBins<T extends Prisma.ScaleVersion$scaleVersionBinsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ScaleVersion$scaleVersionBinsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ScaleVersionBinPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    responses<T extends Prisma.ScaleVersion$responsesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ScaleVersion$responsesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ResponsePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
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
 * Fields of the ScaleVersion model
 */
export interface ScaleVersionFieldRefs {
    readonly id: Prisma.FieldRef<"ScaleVersion", 'String'>;
    readonly rubricVersionId: Prisma.FieldRef<"ScaleVersion", 'String'>;
    readonly originalScaleId: Prisma.FieldRef<"ScaleVersion", 'String'>;
    readonly prompt: Prisma.FieldRef<"ScaleVersion", 'String'>;
    readonly orderIndex: Prisma.FieldRef<"ScaleVersion", 'Int'>;
    readonly isGlobal: Prisma.FieldRef<"ScaleVersion", 'Boolean'>;
    readonly editable: Prisma.FieldRef<"ScaleVersion", 'Boolean'>;
    readonly levelDescriptions: Prisma.FieldRef<"ScaleVersion", 'Json'>;
    readonly section: Prisma.FieldRef<"ScaleVersion", 'String'>;
}
/**
 * ScaleVersion findUnique
 */
export type ScaleVersionFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScaleVersion
     */
    select?: Prisma.ScaleVersionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ScaleVersion
     */
    omit?: Prisma.ScaleVersionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ScaleVersionInclude<ExtArgs> | null;
    /**
     * Filter, which ScaleVersion to fetch.
     */
    where: Prisma.ScaleVersionWhereUniqueInput;
};
/**
 * ScaleVersion findUniqueOrThrow
 */
export type ScaleVersionFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScaleVersion
     */
    select?: Prisma.ScaleVersionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ScaleVersion
     */
    omit?: Prisma.ScaleVersionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ScaleVersionInclude<ExtArgs> | null;
    /**
     * Filter, which ScaleVersion to fetch.
     */
    where: Prisma.ScaleVersionWhereUniqueInput;
};
/**
 * ScaleVersion findFirst
 */
export type ScaleVersionFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScaleVersion
     */
    select?: Prisma.ScaleVersionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ScaleVersion
     */
    omit?: Prisma.ScaleVersionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ScaleVersionInclude<ExtArgs> | null;
    /**
     * Filter, which ScaleVersion to fetch.
     */
    where?: Prisma.ScaleVersionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ScaleVersions to fetch.
     */
    orderBy?: Prisma.ScaleVersionOrderByWithRelationInput | Prisma.ScaleVersionOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ScaleVersions.
     */
    cursor?: Prisma.ScaleVersionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ScaleVersions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ScaleVersions.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ScaleVersions.
     */
    distinct?: Prisma.ScaleVersionScalarFieldEnum | Prisma.ScaleVersionScalarFieldEnum[];
};
/**
 * ScaleVersion findFirstOrThrow
 */
export type ScaleVersionFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScaleVersion
     */
    select?: Prisma.ScaleVersionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ScaleVersion
     */
    omit?: Prisma.ScaleVersionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ScaleVersionInclude<ExtArgs> | null;
    /**
     * Filter, which ScaleVersion to fetch.
     */
    where?: Prisma.ScaleVersionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ScaleVersions to fetch.
     */
    orderBy?: Prisma.ScaleVersionOrderByWithRelationInput | Prisma.ScaleVersionOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ScaleVersions.
     */
    cursor?: Prisma.ScaleVersionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ScaleVersions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ScaleVersions.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ScaleVersions.
     */
    distinct?: Prisma.ScaleVersionScalarFieldEnum | Prisma.ScaleVersionScalarFieldEnum[];
};
/**
 * ScaleVersion findMany
 */
export type ScaleVersionFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScaleVersion
     */
    select?: Prisma.ScaleVersionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ScaleVersion
     */
    omit?: Prisma.ScaleVersionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ScaleVersionInclude<ExtArgs> | null;
    /**
     * Filter, which ScaleVersions to fetch.
     */
    where?: Prisma.ScaleVersionWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ScaleVersions to fetch.
     */
    orderBy?: Prisma.ScaleVersionOrderByWithRelationInput | Prisma.ScaleVersionOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing ScaleVersions.
     */
    cursor?: Prisma.ScaleVersionWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ScaleVersions from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ScaleVersions.
     */
    skip?: number;
    distinct?: Prisma.ScaleVersionScalarFieldEnum | Prisma.ScaleVersionScalarFieldEnum[];
};
/**
 * ScaleVersion create
 */
export type ScaleVersionCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScaleVersion
     */
    select?: Prisma.ScaleVersionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ScaleVersion
     */
    omit?: Prisma.ScaleVersionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ScaleVersionInclude<ExtArgs> | null;
    /**
     * The data needed to create a ScaleVersion.
     */
    data: Prisma.XOR<Prisma.ScaleVersionCreateInput, Prisma.ScaleVersionUncheckedCreateInput>;
};
/**
 * ScaleVersion createMany
 */
export type ScaleVersionCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many ScaleVersions.
     */
    data: Prisma.ScaleVersionCreateManyInput | Prisma.ScaleVersionCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * ScaleVersion createManyAndReturn
 */
export type ScaleVersionCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScaleVersion
     */
    select?: Prisma.ScaleVersionSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the ScaleVersion
     */
    omit?: Prisma.ScaleVersionOmit<ExtArgs> | null;
    /**
     * The data used to create many ScaleVersions.
     */
    data: Prisma.ScaleVersionCreateManyInput | Prisma.ScaleVersionCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ScaleVersionIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * ScaleVersion update
 */
export type ScaleVersionUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScaleVersion
     */
    select?: Prisma.ScaleVersionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ScaleVersion
     */
    omit?: Prisma.ScaleVersionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ScaleVersionInclude<ExtArgs> | null;
    /**
     * The data needed to update a ScaleVersion.
     */
    data: Prisma.XOR<Prisma.ScaleVersionUpdateInput, Prisma.ScaleVersionUncheckedUpdateInput>;
    /**
     * Choose, which ScaleVersion to update.
     */
    where: Prisma.ScaleVersionWhereUniqueInput;
};
/**
 * ScaleVersion updateMany
 */
export type ScaleVersionUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update ScaleVersions.
     */
    data: Prisma.XOR<Prisma.ScaleVersionUpdateManyMutationInput, Prisma.ScaleVersionUncheckedUpdateManyInput>;
    /**
     * Filter which ScaleVersions to update
     */
    where?: Prisma.ScaleVersionWhereInput;
    /**
     * Limit how many ScaleVersions to update.
     */
    limit?: number;
};
/**
 * ScaleVersion updateManyAndReturn
 */
export type ScaleVersionUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScaleVersion
     */
    select?: Prisma.ScaleVersionSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the ScaleVersion
     */
    omit?: Prisma.ScaleVersionOmit<ExtArgs> | null;
    /**
     * The data used to update ScaleVersions.
     */
    data: Prisma.XOR<Prisma.ScaleVersionUpdateManyMutationInput, Prisma.ScaleVersionUncheckedUpdateManyInput>;
    /**
     * Filter which ScaleVersions to update
     */
    where?: Prisma.ScaleVersionWhereInput;
    /**
     * Limit how many ScaleVersions to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ScaleVersionIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * ScaleVersion upsert
 */
export type ScaleVersionUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScaleVersion
     */
    select?: Prisma.ScaleVersionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ScaleVersion
     */
    omit?: Prisma.ScaleVersionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ScaleVersionInclude<ExtArgs> | null;
    /**
     * The filter to search for the ScaleVersion to update in case it exists.
     */
    where: Prisma.ScaleVersionWhereUniqueInput;
    /**
     * In case the ScaleVersion found by the `where` argument doesn't exist, create a new ScaleVersion with this data.
     */
    create: Prisma.XOR<Prisma.ScaleVersionCreateInput, Prisma.ScaleVersionUncheckedCreateInput>;
    /**
     * In case the ScaleVersion was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.ScaleVersionUpdateInput, Prisma.ScaleVersionUncheckedUpdateInput>;
};
/**
 * ScaleVersion delete
 */
export type ScaleVersionDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScaleVersion
     */
    select?: Prisma.ScaleVersionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ScaleVersion
     */
    omit?: Prisma.ScaleVersionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ScaleVersionInclude<ExtArgs> | null;
    /**
     * Filter which ScaleVersion to delete.
     */
    where: Prisma.ScaleVersionWhereUniqueInput;
};
/**
 * ScaleVersion deleteMany
 */
export type ScaleVersionDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which ScaleVersions to delete
     */
    where?: Prisma.ScaleVersionWhereInput;
    /**
     * Limit how many ScaleVersions to delete.
     */
    limit?: number;
};
/**
 * ScaleVersion.scaleVersionBins
 */
export type ScaleVersion$scaleVersionBinsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScaleVersionBin
     */
    select?: Prisma.ScaleVersionBinSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ScaleVersionBin
     */
    omit?: Prisma.ScaleVersionBinOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ScaleVersionBinInclude<ExtArgs> | null;
    where?: Prisma.ScaleVersionBinWhereInput;
    orderBy?: Prisma.ScaleVersionBinOrderByWithRelationInput | Prisma.ScaleVersionBinOrderByWithRelationInput[];
    cursor?: Prisma.ScaleVersionBinWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ScaleVersionBinScalarFieldEnum | Prisma.ScaleVersionBinScalarFieldEnum[];
};
/**
 * ScaleVersion.responses
 */
export type ScaleVersion$responsesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Response
     */
    select?: Prisma.ResponseSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Response
     */
    omit?: Prisma.ResponseOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ResponseInclude<ExtArgs> | null;
    where?: Prisma.ResponseWhereInput;
    orderBy?: Prisma.ResponseOrderByWithRelationInput | Prisma.ResponseOrderByWithRelationInput[];
    cursor?: Prisma.ResponseWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ResponseScalarFieldEnum | Prisma.ResponseScalarFieldEnum[];
};
/**
 * ScaleVersion without action
 */
export type ScaleVersionDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScaleVersion
     */
    select?: Prisma.ScaleVersionSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ScaleVersion
     */
    omit?: Prisma.ScaleVersionOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ScaleVersionInclude<ExtArgs> | null;
};
export {};
//# sourceMappingURL=ScaleVersion.d.ts.map