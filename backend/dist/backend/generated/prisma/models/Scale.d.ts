import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model Scale
 *
 */
export type ScaleModel = runtime.Types.Result.DefaultSelection<Prisma.$ScalePayload>;
export type AggregateScale = {
    _count: ScaleCountAggregateOutputType | null;
    _avg: ScaleAvgAggregateOutputType | null;
    _sum: ScaleSumAggregateOutputType | null;
    _min: ScaleMinAggregateOutputType | null;
    _max: ScaleMaxAggregateOutputType | null;
};
export type ScaleAvgAggregateOutputType = {
    orderIndex: number | null;
};
export type ScaleSumAggregateOutputType = {
    orderIndex: number | null;
};
export type ScaleMinAggregateOutputType = {
    id: string | null;
    rubricId: string | null;
    prompt: string | null;
    section: string | null;
    orderIndex: number | null;
    editable: boolean | null;
    isGlobal: boolean | null;
};
export type ScaleMaxAggregateOutputType = {
    id: string | null;
    rubricId: string | null;
    prompt: string | null;
    section: string | null;
    orderIndex: number | null;
    editable: boolean | null;
    isGlobal: boolean | null;
};
export type ScaleCountAggregateOutputType = {
    id: number;
    rubricId: number;
    prompt: number;
    levelDescriptions: number;
    section: number;
    orderIndex: number;
    editable: number;
    isGlobal: number;
    _all: number;
};
export type ScaleAvgAggregateInputType = {
    orderIndex?: true;
};
export type ScaleSumAggregateInputType = {
    orderIndex?: true;
};
export type ScaleMinAggregateInputType = {
    id?: true;
    rubricId?: true;
    prompt?: true;
    section?: true;
    orderIndex?: true;
    editable?: true;
    isGlobal?: true;
};
export type ScaleMaxAggregateInputType = {
    id?: true;
    rubricId?: true;
    prompt?: true;
    section?: true;
    orderIndex?: true;
    editable?: true;
    isGlobal?: true;
};
export type ScaleCountAggregateInputType = {
    id?: true;
    rubricId?: true;
    prompt?: true;
    levelDescriptions?: true;
    section?: true;
    orderIndex?: true;
    editable?: true;
    isGlobal?: true;
    _all?: true;
};
export type ScaleAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Scale to aggregate.
     */
    where?: Prisma.ScaleWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Scales to fetch.
     */
    orderBy?: Prisma.ScaleOrderByWithRelationInput | Prisma.ScaleOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.ScaleWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Scales from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Scales.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Scales
    **/
    _count?: true | ScaleCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: ScaleAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: ScaleSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: ScaleMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: ScaleMaxAggregateInputType;
};
export type GetScaleAggregateType<T extends ScaleAggregateArgs> = {
    [P in keyof T & keyof AggregateScale]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateScale[P]> : Prisma.GetScalarType<T[P], AggregateScale[P]>;
};
export type ScaleGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ScaleWhereInput;
    orderBy?: Prisma.ScaleOrderByWithAggregationInput | Prisma.ScaleOrderByWithAggregationInput[];
    by: Prisma.ScaleScalarFieldEnum[] | Prisma.ScaleScalarFieldEnum;
    having?: Prisma.ScaleScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ScaleCountAggregateInputType | true;
    _avg?: ScaleAvgAggregateInputType;
    _sum?: ScaleSumAggregateInputType;
    _min?: ScaleMinAggregateInputType;
    _max?: ScaleMaxAggregateInputType;
};
export type ScaleGroupByOutputType = {
    id: string;
    rubricId: string;
    prompt: string;
    levelDescriptions: runtime.JsonValue | null;
    section: string | null;
    orderIndex: number;
    editable: boolean;
    isGlobal: boolean;
    _count: ScaleCountAggregateOutputType | null;
    _avg: ScaleAvgAggregateOutputType | null;
    _sum: ScaleSumAggregateOutputType | null;
    _min: ScaleMinAggregateOutputType | null;
    _max: ScaleMaxAggregateOutputType | null;
};
type GetScaleGroupByPayload<T extends ScaleGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ScaleGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ScaleGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ScaleGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ScaleGroupByOutputType[P]>;
}>>;
export type ScaleWhereInput = {
    AND?: Prisma.ScaleWhereInput | Prisma.ScaleWhereInput[];
    OR?: Prisma.ScaleWhereInput[];
    NOT?: Prisma.ScaleWhereInput | Prisma.ScaleWhereInput[];
    id?: Prisma.UuidFilter<"Scale"> | string;
    rubricId?: Prisma.UuidFilter<"Scale"> | string;
    prompt?: Prisma.StringFilter<"Scale"> | string;
    levelDescriptions?: Prisma.JsonNullableFilter<"Scale">;
    section?: Prisma.StringNullableFilter<"Scale"> | string | null;
    orderIndex?: Prisma.IntFilter<"Scale"> | number;
    editable?: Prisma.BoolFilter<"Scale"> | boolean;
    isGlobal?: Prisma.BoolFilter<"Scale"> | boolean;
    rubric?: Prisma.XOR<Prisma.RubricScalarRelationFilter, Prisma.RubricWhereInput>;
    responses?: Prisma.ResponseListRelationFilter;
    scaleBins?: Prisma.ScaleBinListRelationFilter;
};
export type ScaleOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    rubricId?: Prisma.SortOrder;
    prompt?: Prisma.SortOrder;
    levelDescriptions?: Prisma.SortOrderInput | Prisma.SortOrder;
    section?: Prisma.SortOrderInput | Prisma.SortOrder;
    orderIndex?: Prisma.SortOrder;
    editable?: Prisma.SortOrder;
    isGlobal?: Prisma.SortOrder;
    rubric?: Prisma.RubricOrderByWithRelationInput;
    responses?: Prisma.ResponseOrderByRelationAggregateInput;
    scaleBins?: Prisma.ScaleBinOrderByRelationAggregateInput;
};
export type ScaleWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.ScaleWhereInput | Prisma.ScaleWhereInput[];
    OR?: Prisma.ScaleWhereInput[];
    NOT?: Prisma.ScaleWhereInput | Prisma.ScaleWhereInput[];
    rubricId?: Prisma.UuidFilter<"Scale"> | string;
    prompt?: Prisma.StringFilter<"Scale"> | string;
    levelDescriptions?: Prisma.JsonNullableFilter<"Scale">;
    section?: Prisma.StringNullableFilter<"Scale"> | string | null;
    orderIndex?: Prisma.IntFilter<"Scale"> | number;
    editable?: Prisma.BoolFilter<"Scale"> | boolean;
    isGlobal?: Prisma.BoolFilter<"Scale"> | boolean;
    rubric?: Prisma.XOR<Prisma.RubricScalarRelationFilter, Prisma.RubricWhereInput>;
    responses?: Prisma.ResponseListRelationFilter;
    scaleBins?: Prisma.ScaleBinListRelationFilter;
}, "id">;
export type ScaleOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    rubricId?: Prisma.SortOrder;
    prompt?: Prisma.SortOrder;
    levelDescriptions?: Prisma.SortOrderInput | Prisma.SortOrder;
    section?: Prisma.SortOrderInput | Prisma.SortOrder;
    orderIndex?: Prisma.SortOrder;
    editable?: Prisma.SortOrder;
    isGlobal?: Prisma.SortOrder;
    _count?: Prisma.ScaleCountOrderByAggregateInput;
    _avg?: Prisma.ScaleAvgOrderByAggregateInput;
    _max?: Prisma.ScaleMaxOrderByAggregateInput;
    _min?: Prisma.ScaleMinOrderByAggregateInput;
    _sum?: Prisma.ScaleSumOrderByAggregateInput;
};
export type ScaleScalarWhereWithAggregatesInput = {
    AND?: Prisma.ScaleScalarWhereWithAggregatesInput | Prisma.ScaleScalarWhereWithAggregatesInput[];
    OR?: Prisma.ScaleScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ScaleScalarWhereWithAggregatesInput | Prisma.ScaleScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"Scale"> | string;
    rubricId?: Prisma.UuidWithAggregatesFilter<"Scale"> | string;
    prompt?: Prisma.StringWithAggregatesFilter<"Scale"> | string;
    levelDescriptions?: Prisma.JsonNullableWithAggregatesFilter<"Scale">;
    section?: Prisma.StringNullableWithAggregatesFilter<"Scale"> | string | null;
    orderIndex?: Prisma.IntWithAggregatesFilter<"Scale"> | number;
    editable?: Prisma.BoolWithAggregatesFilter<"Scale"> | boolean;
    isGlobal?: Prisma.BoolWithAggregatesFilter<"Scale"> | boolean;
};
export type ScaleCreateInput = {
    id?: string;
    prompt: string;
    levelDescriptions?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    section?: string | null;
    orderIndex: number;
    editable?: boolean;
    isGlobal?: boolean;
    rubric: Prisma.RubricCreateNestedOneWithoutScalesInput;
    responses?: Prisma.ResponseCreateNestedManyWithoutScaleInput;
    scaleBins?: Prisma.ScaleBinCreateNestedManyWithoutScaleInput;
};
export type ScaleUncheckedCreateInput = {
    id?: string;
    rubricId: string;
    prompt: string;
    levelDescriptions?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    section?: string | null;
    orderIndex: number;
    editable?: boolean;
    isGlobal?: boolean;
    responses?: Prisma.ResponseUncheckedCreateNestedManyWithoutScaleInput;
    scaleBins?: Prisma.ScaleBinUncheckedCreateNestedManyWithoutScaleInput;
};
export type ScaleUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    prompt?: Prisma.StringFieldUpdateOperationsInput | string;
    levelDescriptions?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    section?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    editable?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isGlobal?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    rubric?: Prisma.RubricUpdateOneRequiredWithoutScalesNestedInput;
    responses?: Prisma.ResponseUpdateManyWithoutScaleNestedInput;
    scaleBins?: Prisma.ScaleBinUpdateManyWithoutScaleNestedInput;
};
export type ScaleUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rubricId?: Prisma.StringFieldUpdateOperationsInput | string;
    prompt?: Prisma.StringFieldUpdateOperationsInput | string;
    levelDescriptions?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    section?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    editable?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isGlobal?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    responses?: Prisma.ResponseUncheckedUpdateManyWithoutScaleNestedInput;
    scaleBins?: Prisma.ScaleBinUncheckedUpdateManyWithoutScaleNestedInput;
};
export type ScaleCreateManyInput = {
    id?: string;
    rubricId: string;
    prompt: string;
    levelDescriptions?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    section?: string | null;
    orderIndex: number;
    editable?: boolean;
    isGlobal?: boolean;
};
export type ScaleUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    prompt?: Prisma.StringFieldUpdateOperationsInput | string;
    levelDescriptions?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    section?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    editable?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isGlobal?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type ScaleUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rubricId?: Prisma.StringFieldUpdateOperationsInput | string;
    prompt?: Prisma.StringFieldUpdateOperationsInput | string;
    levelDescriptions?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    section?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    editable?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isGlobal?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type ScaleListRelationFilter = {
    every?: Prisma.ScaleWhereInput;
    some?: Prisma.ScaleWhereInput;
    none?: Prisma.ScaleWhereInput;
};
export type ScaleOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ScaleCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    rubricId?: Prisma.SortOrder;
    prompt?: Prisma.SortOrder;
    levelDescriptions?: Prisma.SortOrder;
    section?: Prisma.SortOrder;
    orderIndex?: Prisma.SortOrder;
    editable?: Prisma.SortOrder;
    isGlobal?: Prisma.SortOrder;
};
export type ScaleAvgOrderByAggregateInput = {
    orderIndex?: Prisma.SortOrder;
};
export type ScaleMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    rubricId?: Prisma.SortOrder;
    prompt?: Prisma.SortOrder;
    section?: Prisma.SortOrder;
    orderIndex?: Prisma.SortOrder;
    editable?: Prisma.SortOrder;
    isGlobal?: Prisma.SortOrder;
};
export type ScaleMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    rubricId?: Prisma.SortOrder;
    prompt?: Prisma.SortOrder;
    section?: Prisma.SortOrder;
    orderIndex?: Prisma.SortOrder;
    editable?: Prisma.SortOrder;
    isGlobal?: Prisma.SortOrder;
};
export type ScaleSumOrderByAggregateInput = {
    orderIndex?: Prisma.SortOrder;
};
export type ScaleScalarRelationFilter = {
    is?: Prisma.ScaleWhereInput;
    isNot?: Prisma.ScaleWhereInput;
};
export type ScaleCreateNestedManyWithoutRubricInput = {
    create?: Prisma.XOR<Prisma.ScaleCreateWithoutRubricInput, Prisma.ScaleUncheckedCreateWithoutRubricInput> | Prisma.ScaleCreateWithoutRubricInput[] | Prisma.ScaleUncheckedCreateWithoutRubricInput[];
    connectOrCreate?: Prisma.ScaleCreateOrConnectWithoutRubricInput | Prisma.ScaleCreateOrConnectWithoutRubricInput[];
    createMany?: Prisma.ScaleCreateManyRubricInputEnvelope;
    connect?: Prisma.ScaleWhereUniqueInput | Prisma.ScaleWhereUniqueInput[];
};
export type ScaleUncheckedCreateNestedManyWithoutRubricInput = {
    create?: Prisma.XOR<Prisma.ScaleCreateWithoutRubricInput, Prisma.ScaleUncheckedCreateWithoutRubricInput> | Prisma.ScaleCreateWithoutRubricInput[] | Prisma.ScaleUncheckedCreateWithoutRubricInput[];
    connectOrCreate?: Prisma.ScaleCreateOrConnectWithoutRubricInput | Prisma.ScaleCreateOrConnectWithoutRubricInput[];
    createMany?: Prisma.ScaleCreateManyRubricInputEnvelope;
    connect?: Prisma.ScaleWhereUniqueInput | Prisma.ScaleWhereUniqueInput[];
};
export type ScaleUpdateManyWithoutRubricNestedInput = {
    create?: Prisma.XOR<Prisma.ScaleCreateWithoutRubricInput, Prisma.ScaleUncheckedCreateWithoutRubricInput> | Prisma.ScaleCreateWithoutRubricInput[] | Prisma.ScaleUncheckedCreateWithoutRubricInput[];
    connectOrCreate?: Prisma.ScaleCreateOrConnectWithoutRubricInput | Prisma.ScaleCreateOrConnectWithoutRubricInput[];
    upsert?: Prisma.ScaleUpsertWithWhereUniqueWithoutRubricInput | Prisma.ScaleUpsertWithWhereUniqueWithoutRubricInput[];
    createMany?: Prisma.ScaleCreateManyRubricInputEnvelope;
    set?: Prisma.ScaleWhereUniqueInput | Prisma.ScaleWhereUniqueInput[];
    disconnect?: Prisma.ScaleWhereUniqueInput | Prisma.ScaleWhereUniqueInput[];
    delete?: Prisma.ScaleWhereUniqueInput | Prisma.ScaleWhereUniqueInput[];
    connect?: Prisma.ScaleWhereUniqueInput | Prisma.ScaleWhereUniqueInput[];
    update?: Prisma.ScaleUpdateWithWhereUniqueWithoutRubricInput | Prisma.ScaleUpdateWithWhereUniqueWithoutRubricInput[];
    updateMany?: Prisma.ScaleUpdateManyWithWhereWithoutRubricInput | Prisma.ScaleUpdateManyWithWhereWithoutRubricInput[];
    deleteMany?: Prisma.ScaleScalarWhereInput | Prisma.ScaleScalarWhereInput[];
};
export type ScaleUncheckedUpdateManyWithoutRubricNestedInput = {
    create?: Prisma.XOR<Prisma.ScaleCreateWithoutRubricInput, Prisma.ScaleUncheckedCreateWithoutRubricInput> | Prisma.ScaleCreateWithoutRubricInput[] | Prisma.ScaleUncheckedCreateWithoutRubricInput[];
    connectOrCreate?: Prisma.ScaleCreateOrConnectWithoutRubricInput | Prisma.ScaleCreateOrConnectWithoutRubricInput[];
    upsert?: Prisma.ScaleUpsertWithWhereUniqueWithoutRubricInput | Prisma.ScaleUpsertWithWhereUniqueWithoutRubricInput[];
    createMany?: Prisma.ScaleCreateManyRubricInputEnvelope;
    set?: Prisma.ScaleWhereUniqueInput | Prisma.ScaleWhereUniqueInput[];
    disconnect?: Prisma.ScaleWhereUniqueInput | Prisma.ScaleWhereUniqueInput[];
    delete?: Prisma.ScaleWhereUniqueInput | Prisma.ScaleWhereUniqueInput[];
    connect?: Prisma.ScaleWhereUniqueInput | Prisma.ScaleWhereUniqueInput[];
    update?: Prisma.ScaleUpdateWithWhereUniqueWithoutRubricInput | Prisma.ScaleUpdateWithWhereUniqueWithoutRubricInput[];
    updateMany?: Prisma.ScaleUpdateManyWithWhereWithoutRubricInput | Prisma.ScaleUpdateManyWithWhereWithoutRubricInput[];
    deleteMany?: Prisma.ScaleScalarWhereInput | Prisma.ScaleScalarWhereInput[];
};
export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type ScaleCreateNestedOneWithoutScaleBinsInput = {
    create?: Prisma.XOR<Prisma.ScaleCreateWithoutScaleBinsInput, Prisma.ScaleUncheckedCreateWithoutScaleBinsInput>;
    connectOrCreate?: Prisma.ScaleCreateOrConnectWithoutScaleBinsInput;
    connect?: Prisma.ScaleWhereUniqueInput;
};
export type ScaleUpdateOneRequiredWithoutScaleBinsNestedInput = {
    create?: Prisma.XOR<Prisma.ScaleCreateWithoutScaleBinsInput, Prisma.ScaleUncheckedCreateWithoutScaleBinsInput>;
    connectOrCreate?: Prisma.ScaleCreateOrConnectWithoutScaleBinsInput;
    upsert?: Prisma.ScaleUpsertWithoutScaleBinsInput;
    connect?: Prisma.ScaleWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ScaleUpdateToOneWithWhereWithoutScaleBinsInput, Prisma.ScaleUpdateWithoutScaleBinsInput>, Prisma.ScaleUncheckedUpdateWithoutScaleBinsInput>;
};
export type ScaleCreateNestedOneWithoutResponsesInput = {
    create?: Prisma.XOR<Prisma.ScaleCreateWithoutResponsesInput, Prisma.ScaleUncheckedCreateWithoutResponsesInput>;
    connectOrCreate?: Prisma.ScaleCreateOrConnectWithoutResponsesInput;
    connect?: Prisma.ScaleWhereUniqueInput;
};
export type ScaleUpdateOneRequiredWithoutResponsesNestedInput = {
    create?: Prisma.XOR<Prisma.ScaleCreateWithoutResponsesInput, Prisma.ScaleUncheckedCreateWithoutResponsesInput>;
    connectOrCreate?: Prisma.ScaleCreateOrConnectWithoutResponsesInput;
    upsert?: Prisma.ScaleUpsertWithoutResponsesInput;
    connect?: Prisma.ScaleWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.ScaleUpdateToOneWithWhereWithoutResponsesInput, Prisma.ScaleUpdateWithoutResponsesInput>, Prisma.ScaleUncheckedUpdateWithoutResponsesInput>;
};
export type ScaleCreateWithoutRubricInput = {
    id?: string;
    prompt: string;
    levelDescriptions?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    section?: string | null;
    orderIndex: number;
    editable?: boolean;
    isGlobal?: boolean;
    responses?: Prisma.ResponseCreateNestedManyWithoutScaleInput;
    scaleBins?: Prisma.ScaleBinCreateNestedManyWithoutScaleInput;
};
export type ScaleUncheckedCreateWithoutRubricInput = {
    id?: string;
    prompt: string;
    levelDescriptions?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    section?: string | null;
    orderIndex: number;
    editable?: boolean;
    isGlobal?: boolean;
    responses?: Prisma.ResponseUncheckedCreateNestedManyWithoutScaleInput;
    scaleBins?: Prisma.ScaleBinUncheckedCreateNestedManyWithoutScaleInput;
};
export type ScaleCreateOrConnectWithoutRubricInput = {
    where: Prisma.ScaleWhereUniqueInput;
    create: Prisma.XOR<Prisma.ScaleCreateWithoutRubricInput, Prisma.ScaleUncheckedCreateWithoutRubricInput>;
};
export type ScaleCreateManyRubricInputEnvelope = {
    data: Prisma.ScaleCreateManyRubricInput | Prisma.ScaleCreateManyRubricInput[];
    skipDuplicates?: boolean;
};
export type ScaleUpsertWithWhereUniqueWithoutRubricInput = {
    where: Prisma.ScaleWhereUniqueInput;
    update: Prisma.XOR<Prisma.ScaleUpdateWithoutRubricInput, Prisma.ScaleUncheckedUpdateWithoutRubricInput>;
    create: Prisma.XOR<Prisma.ScaleCreateWithoutRubricInput, Prisma.ScaleUncheckedCreateWithoutRubricInput>;
};
export type ScaleUpdateWithWhereUniqueWithoutRubricInput = {
    where: Prisma.ScaleWhereUniqueInput;
    data: Prisma.XOR<Prisma.ScaleUpdateWithoutRubricInput, Prisma.ScaleUncheckedUpdateWithoutRubricInput>;
};
export type ScaleUpdateManyWithWhereWithoutRubricInput = {
    where: Prisma.ScaleScalarWhereInput;
    data: Prisma.XOR<Prisma.ScaleUpdateManyMutationInput, Prisma.ScaleUncheckedUpdateManyWithoutRubricInput>;
};
export type ScaleScalarWhereInput = {
    AND?: Prisma.ScaleScalarWhereInput | Prisma.ScaleScalarWhereInput[];
    OR?: Prisma.ScaleScalarWhereInput[];
    NOT?: Prisma.ScaleScalarWhereInput | Prisma.ScaleScalarWhereInput[];
    id?: Prisma.UuidFilter<"Scale"> | string;
    rubricId?: Prisma.UuidFilter<"Scale"> | string;
    prompt?: Prisma.StringFilter<"Scale"> | string;
    levelDescriptions?: Prisma.JsonNullableFilter<"Scale">;
    section?: Prisma.StringNullableFilter<"Scale"> | string | null;
    orderIndex?: Prisma.IntFilter<"Scale"> | number;
    editable?: Prisma.BoolFilter<"Scale"> | boolean;
    isGlobal?: Prisma.BoolFilter<"Scale"> | boolean;
};
export type ScaleCreateWithoutScaleBinsInput = {
    id?: string;
    prompt: string;
    levelDescriptions?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    section?: string | null;
    orderIndex: number;
    editable?: boolean;
    isGlobal?: boolean;
    rubric: Prisma.RubricCreateNestedOneWithoutScalesInput;
    responses?: Prisma.ResponseCreateNestedManyWithoutScaleInput;
};
export type ScaleUncheckedCreateWithoutScaleBinsInput = {
    id?: string;
    rubricId: string;
    prompt: string;
    levelDescriptions?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    section?: string | null;
    orderIndex: number;
    editable?: boolean;
    isGlobal?: boolean;
    responses?: Prisma.ResponseUncheckedCreateNestedManyWithoutScaleInput;
};
export type ScaleCreateOrConnectWithoutScaleBinsInput = {
    where: Prisma.ScaleWhereUniqueInput;
    create: Prisma.XOR<Prisma.ScaleCreateWithoutScaleBinsInput, Prisma.ScaleUncheckedCreateWithoutScaleBinsInput>;
};
export type ScaleUpsertWithoutScaleBinsInput = {
    update: Prisma.XOR<Prisma.ScaleUpdateWithoutScaleBinsInput, Prisma.ScaleUncheckedUpdateWithoutScaleBinsInput>;
    create: Prisma.XOR<Prisma.ScaleCreateWithoutScaleBinsInput, Prisma.ScaleUncheckedCreateWithoutScaleBinsInput>;
    where?: Prisma.ScaleWhereInput;
};
export type ScaleUpdateToOneWithWhereWithoutScaleBinsInput = {
    where?: Prisma.ScaleWhereInput;
    data: Prisma.XOR<Prisma.ScaleUpdateWithoutScaleBinsInput, Prisma.ScaleUncheckedUpdateWithoutScaleBinsInput>;
};
export type ScaleUpdateWithoutScaleBinsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    prompt?: Prisma.StringFieldUpdateOperationsInput | string;
    levelDescriptions?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    section?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    editable?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isGlobal?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    rubric?: Prisma.RubricUpdateOneRequiredWithoutScalesNestedInput;
    responses?: Prisma.ResponseUpdateManyWithoutScaleNestedInput;
};
export type ScaleUncheckedUpdateWithoutScaleBinsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rubricId?: Prisma.StringFieldUpdateOperationsInput | string;
    prompt?: Prisma.StringFieldUpdateOperationsInput | string;
    levelDescriptions?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    section?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    editable?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isGlobal?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    responses?: Prisma.ResponseUncheckedUpdateManyWithoutScaleNestedInput;
};
export type ScaleCreateWithoutResponsesInput = {
    id?: string;
    prompt: string;
    levelDescriptions?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    section?: string | null;
    orderIndex: number;
    editable?: boolean;
    isGlobal?: boolean;
    rubric: Prisma.RubricCreateNestedOneWithoutScalesInput;
    scaleBins?: Prisma.ScaleBinCreateNestedManyWithoutScaleInput;
};
export type ScaleUncheckedCreateWithoutResponsesInput = {
    id?: string;
    rubricId: string;
    prompt: string;
    levelDescriptions?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    section?: string | null;
    orderIndex: number;
    editable?: boolean;
    isGlobal?: boolean;
    scaleBins?: Prisma.ScaleBinUncheckedCreateNestedManyWithoutScaleInput;
};
export type ScaleCreateOrConnectWithoutResponsesInput = {
    where: Prisma.ScaleWhereUniqueInput;
    create: Prisma.XOR<Prisma.ScaleCreateWithoutResponsesInput, Prisma.ScaleUncheckedCreateWithoutResponsesInput>;
};
export type ScaleUpsertWithoutResponsesInput = {
    update: Prisma.XOR<Prisma.ScaleUpdateWithoutResponsesInput, Prisma.ScaleUncheckedUpdateWithoutResponsesInput>;
    create: Prisma.XOR<Prisma.ScaleCreateWithoutResponsesInput, Prisma.ScaleUncheckedCreateWithoutResponsesInput>;
    where?: Prisma.ScaleWhereInput;
};
export type ScaleUpdateToOneWithWhereWithoutResponsesInput = {
    where?: Prisma.ScaleWhereInput;
    data: Prisma.XOR<Prisma.ScaleUpdateWithoutResponsesInput, Prisma.ScaleUncheckedUpdateWithoutResponsesInput>;
};
export type ScaleUpdateWithoutResponsesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    prompt?: Prisma.StringFieldUpdateOperationsInput | string;
    levelDescriptions?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    section?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    editable?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isGlobal?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    rubric?: Prisma.RubricUpdateOneRequiredWithoutScalesNestedInput;
    scaleBins?: Prisma.ScaleBinUpdateManyWithoutScaleNestedInput;
};
export type ScaleUncheckedUpdateWithoutResponsesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    rubricId?: Prisma.StringFieldUpdateOperationsInput | string;
    prompt?: Prisma.StringFieldUpdateOperationsInput | string;
    levelDescriptions?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    section?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    editable?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isGlobal?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    scaleBins?: Prisma.ScaleBinUncheckedUpdateManyWithoutScaleNestedInput;
};
export type ScaleCreateManyRubricInput = {
    id?: string;
    prompt: string;
    levelDescriptions?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    section?: string | null;
    orderIndex: number;
    editable?: boolean;
    isGlobal?: boolean;
};
export type ScaleUpdateWithoutRubricInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    prompt?: Prisma.StringFieldUpdateOperationsInput | string;
    levelDescriptions?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    section?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    editable?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isGlobal?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    responses?: Prisma.ResponseUpdateManyWithoutScaleNestedInput;
    scaleBins?: Prisma.ScaleBinUpdateManyWithoutScaleNestedInput;
};
export type ScaleUncheckedUpdateWithoutRubricInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    prompt?: Prisma.StringFieldUpdateOperationsInput | string;
    levelDescriptions?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    section?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    editable?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isGlobal?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    responses?: Prisma.ResponseUncheckedUpdateManyWithoutScaleNestedInput;
    scaleBins?: Prisma.ScaleBinUncheckedUpdateManyWithoutScaleNestedInput;
};
export type ScaleUncheckedUpdateManyWithoutRubricInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    prompt?: Prisma.StringFieldUpdateOperationsInput | string;
    levelDescriptions?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    section?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    orderIndex?: Prisma.IntFieldUpdateOperationsInput | number;
    editable?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    isGlobal?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
/**
 * Count Type ScaleCountOutputType
 */
export type ScaleCountOutputType = {
    responses: number;
    scaleBins: number;
};
export type ScaleCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    responses?: boolean | ScaleCountOutputTypeCountResponsesArgs;
    scaleBins?: boolean | ScaleCountOutputTypeCountScaleBinsArgs;
};
/**
 * ScaleCountOutputType without action
 */
export type ScaleCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScaleCountOutputType
     */
    select?: Prisma.ScaleCountOutputTypeSelect<ExtArgs> | null;
};
/**
 * ScaleCountOutputType without action
 */
export type ScaleCountOutputTypeCountResponsesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ResponseWhereInput;
};
/**
 * ScaleCountOutputType without action
 */
export type ScaleCountOutputTypeCountScaleBinsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ScaleBinWhereInput;
};
export type ScaleSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    rubricId?: boolean;
    prompt?: boolean;
    levelDescriptions?: boolean;
    section?: boolean;
    orderIndex?: boolean;
    editable?: boolean;
    isGlobal?: boolean;
    rubric?: boolean | Prisma.RubricDefaultArgs<ExtArgs>;
    responses?: boolean | Prisma.Scale$responsesArgs<ExtArgs>;
    scaleBins?: boolean | Prisma.Scale$scaleBinsArgs<ExtArgs>;
    _count?: boolean | Prisma.ScaleCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["scale"]>;
export type ScaleSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    rubricId?: boolean;
    prompt?: boolean;
    levelDescriptions?: boolean;
    section?: boolean;
    orderIndex?: boolean;
    editable?: boolean;
    isGlobal?: boolean;
    rubric?: boolean | Prisma.RubricDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["scale"]>;
export type ScaleSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    rubricId?: boolean;
    prompt?: boolean;
    levelDescriptions?: boolean;
    section?: boolean;
    orderIndex?: boolean;
    editable?: boolean;
    isGlobal?: boolean;
    rubric?: boolean | Prisma.RubricDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["scale"]>;
export type ScaleSelectScalar = {
    id?: boolean;
    rubricId?: boolean;
    prompt?: boolean;
    levelDescriptions?: boolean;
    section?: boolean;
    orderIndex?: boolean;
    editable?: boolean;
    isGlobal?: boolean;
};
export type ScaleOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "rubricId" | "prompt" | "levelDescriptions" | "section" | "orderIndex" | "editable" | "isGlobal", ExtArgs["result"]["scale"]>;
export type ScaleInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    rubric?: boolean | Prisma.RubricDefaultArgs<ExtArgs>;
    responses?: boolean | Prisma.Scale$responsesArgs<ExtArgs>;
    scaleBins?: boolean | Prisma.Scale$scaleBinsArgs<ExtArgs>;
    _count?: boolean | Prisma.ScaleCountOutputTypeDefaultArgs<ExtArgs>;
};
export type ScaleIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    rubric?: boolean | Prisma.RubricDefaultArgs<ExtArgs>;
};
export type ScaleIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    rubric?: boolean | Prisma.RubricDefaultArgs<ExtArgs>;
};
export type $ScalePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Scale";
    objects: {
        rubric: Prisma.$RubricPayload<ExtArgs>;
        responses: Prisma.$ResponsePayload<ExtArgs>[];
        scaleBins: Prisma.$ScaleBinPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        rubricId: string;
        prompt: string;
        levelDescriptions: runtime.JsonValue | null;
        section: string | null;
        orderIndex: number;
        editable: boolean;
        isGlobal: boolean;
    }, ExtArgs["result"]["scale"]>;
    composites: {};
};
export type ScaleGetPayload<S extends boolean | null | undefined | ScaleDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ScalePayload, S>;
export type ScaleCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ScaleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ScaleCountAggregateInputType | true;
};
export interface ScaleDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Scale'];
        meta: {
            name: 'Scale';
        };
    };
    /**
     * Find zero or one Scale that matches the filter.
     * @param {ScaleFindUniqueArgs} args - Arguments to find a Scale
     * @example
     * // Get one Scale
     * const scale = await prisma.scale.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ScaleFindUniqueArgs>(args: Prisma.SelectSubset<T, ScaleFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ScaleClient<runtime.Types.Result.GetResult<Prisma.$ScalePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Scale that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ScaleFindUniqueOrThrowArgs} args - Arguments to find a Scale
     * @example
     * // Get one Scale
     * const scale = await prisma.scale.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ScaleFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ScaleFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ScaleClient<runtime.Types.Result.GetResult<Prisma.$ScalePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Scale that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScaleFindFirstArgs} args - Arguments to find a Scale
     * @example
     * // Get one Scale
     * const scale = await prisma.scale.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ScaleFindFirstArgs>(args?: Prisma.SelectSubset<T, ScaleFindFirstArgs<ExtArgs>>): Prisma.Prisma__ScaleClient<runtime.Types.Result.GetResult<Prisma.$ScalePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Scale that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScaleFindFirstOrThrowArgs} args - Arguments to find a Scale
     * @example
     * // Get one Scale
     * const scale = await prisma.scale.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ScaleFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ScaleFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ScaleClient<runtime.Types.Result.GetResult<Prisma.$ScalePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Scales that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScaleFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Scales
     * const scales = await prisma.scale.findMany()
     *
     * // Get first 10 Scales
     * const scales = await prisma.scale.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const scaleWithIdOnly = await prisma.scale.findMany({ select: { id: true } })
     *
     */
    findMany<T extends ScaleFindManyArgs>(args?: Prisma.SelectSubset<T, ScaleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ScalePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Scale.
     * @param {ScaleCreateArgs} args - Arguments to create a Scale.
     * @example
     * // Create one Scale
     * const Scale = await prisma.scale.create({
     *   data: {
     *     // ... data to create a Scale
     *   }
     * })
     *
     */
    create<T extends ScaleCreateArgs>(args: Prisma.SelectSubset<T, ScaleCreateArgs<ExtArgs>>): Prisma.Prisma__ScaleClient<runtime.Types.Result.GetResult<Prisma.$ScalePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Scales.
     * @param {ScaleCreateManyArgs} args - Arguments to create many Scales.
     * @example
     * // Create many Scales
     * const scale = await prisma.scale.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends ScaleCreateManyArgs>(args?: Prisma.SelectSubset<T, ScaleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many Scales and returns the data saved in the database.
     * @param {ScaleCreateManyAndReturnArgs} args - Arguments to create many Scales.
     * @example
     * // Create many Scales
     * const scale = await prisma.scale.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Scales and only return the `id`
     * const scaleWithIdOnly = await prisma.scale.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends ScaleCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ScaleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ScalePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a Scale.
     * @param {ScaleDeleteArgs} args - Arguments to delete one Scale.
     * @example
     * // Delete one Scale
     * const Scale = await prisma.scale.delete({
     *   where: {
     *     // ... filter to delete one Scale
     *   }
     * })
     *
     */
    delete<T extends ScaleDeleteArgs>(args: Prisma.SelectSubset<T, ScaleDeleteArgs<ExtArgs>>): Prisma.Prisma__ScaleClient<runtime.Types.Result.GetResult<Prisma.$ScalePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Scale.
     * @param {ScaleUpdateArgs} args - Arguments to update one Scale.
     * @example
     * // Update one Scale
     * const scale = await prisma.scale.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends ScaleUpdateArgs>(args: Prisma.SelectSubset<T, ScaleUpdateArgs<ExtArgs>>): Prisma.Prisma__ScaleClient<runtime.Types.Result.GetResult<Prisma.$ScalePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Scales.
     * @param {ScaleDeleteManyArgs} args - Arguments to filter Scales to delete.
     * @example
     * // Delete a few Scales
     * const { count } = await prisma.scale.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends ScaleDeleteManyArgs>(args?: Prisma.SelectSubset<T, ScaleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Scales.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScaleUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Scales
     * const scale = await prisma.scale.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends ScaleUpdateManyArgs>(args: Prisma.SelectSubset<T, ScaleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Scales and returns the data updated in the database.
     * @param {ScaleUpdateManyAndReturnArgs} args - Arguments to update many Scales.
     * @example
     * // Update many Scales
     * const scale = await prisma.scale.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Scales and only return the `id`
     * const scaleWithIdOnly = await prisma.scale.updateManyAndReturn({
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
    updateManyAndReturn<T extends ScaleUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ScaleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ScalePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one Scale.
     * @param {ScaleUpsertArgs} args - Arguments to update or create a Scale.
     * @example
     * // Update or create a Scale
     * const scale = await prisma.scale.upsert({
     *   create: {
     *     // ... data to create a Scale
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Scale we want to update
     *   }
     * })
     */
    upsert<T extends ScaleUpsertArgs>(args: Prisma.SelectSubset<T, ScaleUpsertArgs<ExtArgs>>): Prisma.Prisma__ScaleClient<runtime.Types.Result.GetResult<Prisma.$ScalePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of Scales.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScaleCountArgs} args - Arguments to filter Scales to count.
     * @example
     * // Count the number of Scales
     * const count = await prisma.scale.count({
     *   where: {
     *     // ... the filter for the Scales we want to count
     *   }
     * })
    **/
    count<T extends ScaleCountArgs>(args?: Prisma.Subset<T, ScaleCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ScaleCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Scale.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScaleAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ScaleAggregateArgs>(args: Prisma.Subset<T, ScaleAggregateArgs>): Prisma.PrismaPromise<GetScaleAggregateType<T>>;
    /**
     * Group by Scale.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScaleGroupByArgs} args - Group by arguments.
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
    groupBy<T extends ScaleGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ScaleGroupByArgs['orderBy'];
    } : {
        orderBy?: ScaleGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ScaleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetScaleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Scale model
     */
    readonly fields: ScaleFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for Scale.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__ScaleClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    rubric<T extends Prisma.RubricDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.RubricDefaultArgs<ExtArgs>>): Prisma.Prisma__RubricClient<runtime.Types.Result.GetResult<Prisma.$RubricPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    responses<T extends Prisma.Scale$responsesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Scale$responsesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ResponsePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    scaleBins<T extends Prisma.Scale$scaleBinsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Scale$scaleBinsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ScaleBinPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
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
 * Fields of the Scale model
 */
export interface ScaleFieldRefs {
    readonly id: Prisma.FieldRef<"Scale", 'String'>;
    readonly rubricId: Prisma.FieldRef<"Scale", 'String'>;
    readonly prompt: Prisma.FieldRef<"Scale", 'String'>;
    readonly levelDescriptions: Prisma.FieldRef<"Scale", 'Json'>;
    readonly section: Prisma.FieldRef<"Scale", 'String'>;
    readonly orderIndex: Prisma.FieldRef<"Scale", 'Int'>;
    readonly editable: Prisma.FieldRef<"Scale", 'Boolean'>;
    readonly isGlobal: Prisma.FieldRef<"Scale", 'Boolean'>;
}
/**
 * Scale findUnique
 */
export type ScaleFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which Scale to fetch.
     */
    where: Prisma.ScaleWhereUniqueInput;
};
/**
 * Scale findUniqueOrThrow
 */
export type ScaleFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which Scale to fetch.
     */
    where: Prisma.ScaleWhereUniqueInput;
};
/**
 * Scale findFirst
 */
export type ScaleFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which Scale to fetch.
     */
    where?: Prisma.ScaleWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Scales to fetch.
     */
    orderBy?: Prisma.ScaleOrderByWithRelationInput | Prisma.ScaleOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Scales.
     */
    cursor?: Prisma.ScaleWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Scales from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Scales.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Scales.
     */
    distinct?: Prisma.ScaleScalarFieldEnum | Prisma.ScaleScalarFieldEnum[];
};
/**
 * Scale findFirstOrThrow
 */
export type ScaleFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which Scale to fetch.
     */
    where?: Prisma.ScaleWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Scales to fetch.
     */
    orderBy?: Prisma.ScaleOrderByWithRelationInput | Prisma.ScaleOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Scales.
     */
    cursor?: Prisma.ScaleWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Scales from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Scales.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Scales.
     */
    distinct?: Prisma.ScaleScalarFieldEnum | Prisma.ScaleScalarFieldEnum[];
};
/**
 * Scale findMany
 */
export type ScaleFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which Scales to fetch.
     */
    where?: Prisma.ScaleWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Scales to fetch.
     */
    orderBy?: Prisma.ScaleOrderByWithRelationInput | Prisma.ScaleOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Scales.
     */
    cursor?: Prisma.ScaleWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Scales from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Scales.
     */
    skip?: number;
    distinct?: Prisma.ScaleScalarFieldEnum | Prisma.ScaleScalarFieldEnum[];
};
/**
 * Scale create
 */
export type ScaleCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to create a Scale.
     */
    data: Prisma.XOR<Prisma.ScaleCreateInput, Prisma.ScaleUncheckedCreateInput>;
};
/**
 * Scale createMany
 */
export type ScaleCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many Scales.
     */
    data: Prisma.ScaleCreateManyInput | Prisma.ScaleCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * Scale createManyAndReturn
 */
export type ScaleCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Scale
     */
    select?: Prisma.ScaleSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Scale
     */
    omit?: Prisma.ScaleOmit<ExtArgs> | null;
    /**
     * The data used to create many Scales.
     */
    data: Prisma.ScaleCreateManyInput | Prisma.ScaleCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ScaleIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * Scale update
 */
export type ScaleUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to update a Scale.
     */
    data: Prisma.XOR<Prisma.ScaleUpdateInput, Prisma.ScaleUncheckedUpdateInput>;
    /**
     * Choose, which Scale to update.
     */
    where: Prisma.ScaleWhereUniqueInput;
};
/**
 * Scale updateMany
 */
export type ScaleUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update Scales.
     */
    data: Prisma.XOR<Prisma.ScaleUpdateManyMutationInput, Prisma.ScaleUncheckedUpdateManyInput>;
    /**
     * Filter which Scales to update
     */
    where?: Prisma.ScaleWhereInput;
    /**
     * Limit how many Scales to update.
     */
    limit?: number;
};
/**
 * Scale updateManyAndReturn
 */
export type ScaleUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Scale
     */
    select?: Prisma.ScaleSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Scale
     */
    omit?: Prisma.ScaleOmit<ExtArgs> | null;
    /**
     * The data used to update Scales.
     */
    data: Prisma.XOR<Prisma.ScaleUpdateManyMutationInput, Prisma.ScaleUncheckedUpdateManyInput>;
    /**
     * Filter which Scales to update
     */
    where?: Prisma.ScaleWhereInput;
    /**
     * Limit how many Scales to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ScaleIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * Scale upsert
 */
export type ScaleUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The filter to search for the Scale to update in case it exists.
     */
    where: Prisma.ScaleWhereUniqueInput;
    /**
     * In case the Scale found by the `where` argument doesn't exist, create a new Scale with this data.
     */
    create: Prisma.XOR<Prisma.ScaleCreateInput, Prisma.ScaleUncheckedCreateInput>;
    /**
     * In case the Scale was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.ScaleUpdateInput, Prisma.ScaleUncheckedUpdateInput>;
};
/**
 * Scale delete
 */
export type ScaleDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter which Scale to delete.
     */
    where: Prisma.ScaleWhereUniqueInput;
};
/**
 * Scale deleteMany
 */
export type ScaleDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Scales to delete
     */
    where?: Prisma.ScaleWhereInput;
    /**
     * Limit how many Scales to delete.
     */
    limit?: number;
};
/**
 * Scale.responses
 */
export type Scale$responsesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * Scale.scaleBins
 */
export type Scale$scaleBinsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScaleBin
     */
    select?: Prisma.ScaleBinSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the ScaleBin
     */
    omit?: Prisma.ScaleBinOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ScaleBinInclude<ExtArgs> | null;
    where?: Prisma.ScaleBinWhereInput;
    orderBy?: Prisma.ScaleBinOrderByWithRelationInput | Prisma.ScaleBinOrderByWithRelationInput[];
    cursor?: Prisma.ScaleBinWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ScaleBinScalarFieldEnum | Prisma.ScaleBinScalarFieldEnum[];
};
/**
 * Scale without action
 */
export type ScaleDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
export {};
//# sourceMappingURL=Scale.d.ts.map