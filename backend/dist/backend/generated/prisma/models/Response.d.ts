import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model Response
 *
 */
export type ResponseModel = runtime.Types.Result.DefaultSelection<Prisma.$ResponsePayload>;
export type AggregateResponse = {
    _count: ResponseCountAggregateOutputType | null;
    _avg: ResponseAvgAggregateOutputType | null;
    _sum: ResponseSumAggregateOutputType | null;
    _min: ResponseMinAggregateOutputType | null;
    _max: ResponseMaxAggregateOutputType | null;
};
export type ResponseAvgAggregateOutputType = {
    score: number | null;
};
export type ResponseSumAggregateOutputType = {
    score: number | null;
};
export type ResponseMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    scaleVersionId: string | null;
    rubricVersionId: string | null;
    courseId: string | null;
    score: number | null;
    submittedAt: Date | null;
    scaleId: string | null;
};
export type ResponseMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    scaleVersionId: string | null;
    rubricVersionId: string | null;
    courseId: string | null;
    score: number | null;
    submittedAt: Date | null;
    scaleId: string | null;
};
export type ResponseCountAggregateOutputType = {
    id: number;
    userId: number;
    scaleVersionId: number;
    rubricVersionId: number;
    courseId: number;
    score: number;
    submittedAt: number;
    scaleId: number;
    _all: number;
};
export type ResponseAvgAggregateInputType = {
    score?: true;
};
export type ResponseSumAggregateInputType = {
    score?: true;
};
export type ResponseMinAggregateInputType = {
    id?: true;
    userId?: true;
    scaleVersionId?: true;
    rubricVersionId?: true;
    courseId?: true;
    score?: true;
    submittedAt?: true;
    scaleId?: true;
};
export type ResponseMaxAggregateInputType = {
    id?: true;
    userId?: true;
    scaleVersionId?: true;
    rubricVersionId?: true;
    courseId?: true;
    score?: true;
    submittedAt?: true;
    scaleId?: true;
};
export type ResponseCountAggregateInputType = {
    id?: true;
    userId?: true;
    scaleVersionId?: true;
    rubricVersionId?: true;
    courseId?: true;
    score?: true;
    submittedAt?: true;
    scaleId?: true;
    _all?: true;
};
export type ResponseAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Response to aggregate.
     */
    where?: Prisma.ResponseWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Responses to fetch.
     */
    orderBy?: Prisma.ResponseOrderByWithRelationInput | Prisma.ResponseOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.ResponseWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Responses from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Responses.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned Responses
    **/
    _count?: true | ResponseCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to average
    **/
    _avg?: ResponseAvgAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to sum
    **/
    _sum?: ResponseSumAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: ResponseMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: ResponseMaxAggregateInputType;
};
export type GetResponseAggregateType<T extends ResponseAggregateArgs> = {
    [P in keyof T & keyof AggregateResponse]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateResponse[P]> : Prisma.GetScalarType<T[P], AggregateResponse[P]>;
};
export type ResponseGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ResponseWhereInput;
    orderBy?: Prisma.ResponseOrderByWithAggregationInput | Prisma.ResponseOrderByWithAggregationInput[];
    by: Prisma.ResponseScalarFieldEnum[] | Prisma.ResponseScalarFieldEnum;
    having?: Prisma.ResponseScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ResponseCountAggregateInputType | true;
    _avg?: ResponseAvgAggregateInputType;
    _sum?: ResponseSumAggregateInputType;
    _min?: ResponseMinAggregateInputType;
    _max?: ResponseMaxAggregateInputType;
};
export type ResponseGroupByOutputType = {
    id: string;
    userId: string;
    scaleVersionId: string;
    rubricVersionId: string;
    courseId: string;
    score: number;
    submittedAt: Date;
    scaleId: string | null;
    _count: ResponseCountAggregateOutputType | null;
    _avg: ResponseAvgAggregateOutputType | null;
    _sum: ResponseSumAggregateOutputType | null;
    _min: ResponseMinAggregateOutputType | null;
    _max: ResponseMaxAggregateOutputType | null;
};
type GetResponseGroupByPayload<T extends ResponseGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ResponseGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ResponseGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ResponseGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ResponseGroupByOutputType[P]>;
}>>;
export type ResponseWhereInput = {
    AND?: Prisma.ResponseWhereInput | Prisma.ResponseWhereInput[];
    OR?: Prisma.ResponseWhereInput[];
    NOT?: Prisma.ResponseWhereInput | Prisma.ResponseWhereInput[];
    id?: Prisma.UuidFilter<"Response"> | string;
    userId?: Prisma.UuidFilter<"Response"> | string;
    scaleVersionId?: Prisma.UuidFilter<"Response"> | string;
    rubricVersionId?: Prisma.UuidFilter<"Response"> | string;
    courseId?: Prisma.UuidFilter<"Response"> | string;
    score?: Prisma.IntFilter<"Response"> | number;
    submittedAt?: Prisma.DateTimeFilter<"Response"> | Date | string;
    scaleId?: Prisma.UuidNullableFilter<"Response"> | string | null;
    course?: Prisma.XOR<Prisma.CourseScalarRelationFilter, Prisma.CourseWhereInput>;
    scaleVersion?: Prisma.XOR<Prisma.ScaleVersionScalarRelationFilter, Prisma.ScaleVersionWhereInput>;
    rubricVersion?: Prisma.XOR<Prisma.RubricVersionScalarRelationFilter, Prisma.RubricVersionWhereInput>;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    scale?: Prisma.XOR<Prisma.ScaleNullableScalarRelationFilter, Prisma.ScaleWhereInput> | null;
};
export type ResponseOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    scaleVersionId?: Prisma.SortOrder;
    rubricVersionId?: Prisma.SortOrder;
    courseId?: Prisma.SortOrder;
    score?: Prisma.SortOrder;
    submittedAt?: Prisma.SortOrder;
    scaleId?: Prisma.SortOrderInput | Prisma.SortOrder;
    course?: Prisma.CourseOrderByWithRelationInput;
    scaleVersion?: Prisma.ScaleVersionOrderByWithRelationInput;
    rubricVersion?: Prisma.RubricVersionOrderByWithRelationInput;
    user?: Prisma.UserOrderByWithRelationInput;
    scale?: Prisma.ScaleOrderByWithRelationInput;
};
export type ResponseWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.ResponseWhereInput | Prisma.ResponseWhereInput[];
    OR?: Prisma.ResponseWhereInput[];
    NOT?: Prisma.ResponseWhereInput | Prisma.ResponseWhereInput[];
    userId?: Prisma.UuidFilter<"Response"> | string;
    scaleVersionId?: Prisma.UuidFilter<"Response"> | string;
    rubricVersionId?: Prisma.UuidFilter<"Response"> | string;
    courseId?: Prisma.UuidFilter<"Response"> | string;
    score?: Prisma.IntFilter<"Response"> | number;
    submittedAt?: Prisma.DateTimeFilter<"Response"> | Date | string;
    scaleId?: Prisma.UuidNullableFilter<"Response"> | string | null;
    course?: Prisma.XOR<Prisma.CourseScalarRelationFilter, Prisma.CourseWhereInput>;
    scaleVersion?: Prisma.XOR<Prisma.ScaleVersionScalarRelationFilter, Prisma.ScaleVersionWhereInput>;
    rubricVersion?: Prisma.XOR<Prisma.RubricVersionScalarRelationFilter, Prisma.RubricVersionWhereInput>;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    scale?: Prisma.XOR<Prisma.ScaleNullableScalarRelationFilter, Prisma.ScaleWhereInput> | null;
}, "id">;
export type ResponseOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    scaleVersionId?: Prisma.SortOrder;
    rubricVersionId?: Prisma.SortOrder;
    courseId?: Prisma.SortOrder;
    score?: Prisma.SortOrder;
    submittedAt?: Prisma.SortOrder;
    scaleId?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.ResponseCountOrderByAggregateInput;
    _avg?: Prisma.ResponseAvgOrderByAggregateInput;
    _max?: Prisma.ResponseMaxOrderByAggregateInput;
    _min?: Prisma.ResponseMinOrderByAggregateInput;
    _sum?: Prisma.ResponseSumOrderByAggregateInput;
};
export type ResponseScalarWhereWithAggregatesInput = {
    AND?: Prisma.ResponseScalarWhereWithAggregatesInput | Prisma.ResponseScalarWhereWithAggregatesInput[];
    OR?: Prisma.ResponseScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ResponseScalarWhereWithAggregatesInput | Prisma.ResponseScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"Response"> | string;
    userId?: Prisma.UuidWithAggregatesFilter<"Response"> | string;
    scaleVersionId?: Prisma.UuidWithAggregatesFilter<"Response"> | string;
    rubricVersionId?: Prisma.UuidWithAggregatesFilter<"Response"> | string;
    courseId?: Prisma.UuidWithAggregatesFilter<"Response"> | string;
    score?: Prisma.IntWithAggregatesFilter<"Response"> | number;
    submittedAt?: Prisma.DateTimeWithAggregatesFilter<"Response"> | Date | string;
    scaleId?: Prisma.UuidNullableWithAggregatesFilter<"Response"> | string | null;
};
export type ResponseCreateInput = {
    id?: string;
    score: number;
    submittedAt?: Date | string;
    course: Prisma.CourseCreateNestedOneWithoutResponsesInput;
    scaleVersion: Prisma.ScaleVersionCreateNestedOneWithoutResponsesInput;
    rubricVersion: Prisma.RubricVersionCreateNestedOneWithoutResponsesInput;
    user: Prisma.UserCreateNestedOneWithoutResponsesInput;
    scale?: Prisma.ScaleCreateNestedOneWithoutResponsesInput;
};
export type ResponseUncheckedCreateInput = {
    id?: string;
    userId: string;
    scaleVersionId: string;
    rubricVersionId: string;
    courseId: string;
    score: number;
    submittedAt?: Date | string;
    scaleId?: string | null;
};
export type ResponseUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    score?: Prisma.IntFieldUpdateOperationsInput | number;
    submittedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    course?: Prisma.CourseUpdateOneRequiredWithoutResponsesNestedInput;
    scaleVersion?: Prisma.ScaleVersionUpdateOneRequiredWithoutResponsesNestedInput;
    rubricVersion?: Prisma.RubricVersionUpdateOneRequiredWithoutResponsesNestedInput;
    user?: Prisma.UserUpdateOneRequiredWithoutResponsesNestedInput;
    scale?: Prisma.ScaleUpdateOneWithoutResponsesNestedInput;
};
export type ResponseUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    scaleVersionId?: Prisma.StringFieldUpdateOperationsInput | string;
    rubricVersionId?: Prisma.StringFieldUpdateOperationsInput | string;
    courseId?: Prisma.StringFieldUpdateOperationsInput | string;
    score?: Prisma.IntFieldUpdateOperationsInput | number;
    submittedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    scaleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type ResponseCreateManyInput = {
    id?: string;
    userId: string;
    scaleVersionId: string;
    rubricVersionId: string;
    courseId: string;
    score: number;
    submittedAt?: Date | string;
    scaleId?: string | null;
};
export type ResponseUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    score?: Prisma.IntFieldUpdateOperationsInput | number;
    submittedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ResponseUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    scaleVersionId?: Prisma.StringFieldUpdateOperationsInput | string;
    rubricVersionId?: Prisma.StringFieldUpdateOperationsInput | string;
    courseId?: Prisma.StringFieldUpdateOperationsInput | string;
    score?: Prisma.IntFieldUpdateOperationsInput | number;
    submittedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    scaleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type ResponseListRelationFilter = {
    every?: Prisma.ResponseWhereInput;
    some?: Prisma.ResponseWhereInput;
    none?: Prisma.ResponseWhereInput;
};
export type ResponseOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ResponseCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    scaleVersionId?: Prisma.SortOrder;
    rubricVersionId?: Prisma.SortOrder;
    courseId?: Prisma.SortOrder;
    score?: Prisma.SortOrder;
    submittedAt?: Prisma.SortOrder;
    scaleId?: Prisma.SortOrder;
};
export type ResponseAvgOrderByAggregateInput = {
    score?: Prisma.SortOrder;
};
export type ResponseMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    scaleVersionId?: Prisma.SortOrder;
    rubricVersionId?: Prisma.SortOrder;
    courseId?: Prisma.SortOrder;
    score?: Prisma.SortOrder;
    submittedAt?: Prisma.SortOrder;
    scaleId?: Prisma.SortOrder;
};
export type ResponseMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    scaleVersionId?: Prisma.SortOrder;
    rubricVersionId?: Prisma.SortOrder;
    courseId?: Prisma.SortOrder;
    score?: Prisma.SortOrder;
    submittedAt?: Prisma.SortOrder;
    scaleId?: Prisma.SortOrder;
};
export type ResponseSumOrderByAggregateInput = {
    score?: Prisma.SortOrder;
};
export type ResponseCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.ResponseCreateWithoutUserInput, Prisma.ResponseUncheckedCreateWithoutUserInput> | Prisma.ResponseCreateWithoutUserInput[] | Prisma.ResponseUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ResponseCreateOrConnectWithoutUserInput | Prisma.ResponseCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.ResponseCreateManyUserInputEnvelope;
    connect?: Prisma.ResponseWhereUniqueInput | Prisma.ResponseWhereUniqueInput[];
};
export type ResponseUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.ResponseCreateWithoutUserInput, Prisma.ResponseUncheckedCreateWithoutUserInput> | Prisma.ResponseCreateWithoutUserInput[] | Prisma.ResponseUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ResponseCreateOrConnectWithoutUserInput | Prisma.ResponseCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.ResponseCreateManyUserInputEnvelope;
    connect?: Prisma.ResponseWhereUniqueInput | Prisma.ResponseWhereUniqueInput[];
};
export type ResponseUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.ResponseCreateWithoutUserInput, Prisma.ResponseUncheckedCreateWithoutUserInput> | Prisma.ResponseCreateWithoutUserInput[] | Prisma.ResponseUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ResponseCreateOrConnectWithoutUserInput | Prisma.ResponseCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.ResponseUpsertWithWhereUniqueWithoutUserInput | Prisma.ResponseUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.ResponseCreateManyUserInputEnvelope;
    set?: Prisma.ResponseWhereUniqueInput | Prisma.ResponseWhereUniqueInput[];
    disconnect?: Prisma.ResponseWhereUniqueInput | Prisma.ResponseWhereUniqueInput[];
    delete?: Prisma.ResponseWhereUniqueInput | Prisma.ResponseWhereUniqueInput[];
    connect?: Prisma.ResponseWhereUniqueInput | Prisma.ResponseWhereUniqueInput[];
    update?: Prisma.ResponseUpdateWithWhereUniqueWithoutUserInput | Prisma.ResponseUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.ResponseUpdateManyWithWhereWithoutUserInput | Prisma.ResponseUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.ResponseScalarWhereInput | Prisma.ResponseScalarWhereInput[];
};
export type ResponseUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.ResponseCreateWithoutUserInput, Prisma.ResponseUncheckedCreateWithoutUserInput> | Prisma.ResponseCreateWithoutUserInput[] | Prisma.ResponseUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.ResponseCreateOrConnectWithoutUserInput | Prisma.ResponseCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.ResponseUpsertWithWhereUniqueWithoutUserInput | Prisma.ResponseUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.ResponseCreateManyUserInputEnvelope;
    set?: Prisma.ResponseWhereUniqueInput | Prisma.ResponseWhereUniqueInput[];
    disconnect?: Prisma.ResponseWhereUniqueInput | Prisma.ResponseWhereUniqueInput[];
    delete?: Prisma.ResponseWhereUniqueInput | Prisma.ResponseWhereUniqueInput[];
    connect?: Prisma.ResponseWhereUniqueInput | Prisma.ResponseWhereUniqueInput[];
    update?: Prisma.ResponseUpdateWithWhereUniqueWithoutUserInput | Prisma.ResponseUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.ResponseUpdateManyWithWhereWithoutUserInput | Prisma.ResponseUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.ResponseScalarWhereInput | Prisma.ResponseScalarWhereInput[];
};
export type ResponseCreateNestedManyWithoutRubricVersionInput = {
    create?: Prisma.XOR<Prisma.ResponseCreateWithoutRubricVersionInput, Prisma.ResponseUncheckedCreateWithoutRubricVersionInput> | Prisma.ResponseCreateWithoutRubricVersionInput[] | Prisma.ResponseUncheckedCreateWithoutRubricVersionInput[];
    connectOrCreate?: Prisma.ResponseCreateOrConnectWithoutRubricVersionInput | Prisma.ResponseCreateOrConnectWithoutRubricVersionInput[];
    createMany?: Prisma.ResponseCreateManyRubricVersionInputEnvelope;
    connect?: Prisma.ResponseWhereUniqueInput | Prisma.ResponseWhereUniqueInput[];
};
export type ResponseUncheckedCreateNestedManyWithoutRubricVersionInput = {
    create?: Prisma.XOR<Prisma.ResponseCreateWithoutRubricVersionInput, Prisma.ResponseUncheckedCreateWithoutRubricVersionInput> | Prisma.ResponseCreateWithoutRubricVersionInput[] | Prisma.ResponseUncheckedCreateWithoutRubricVersionInput[];
    connectOrCreate?: Prisma.ResponseCreateOrConnectWithoutRubricVersionInput | Prisma.ResponseCreateOrConnectWithoutRubricVersionInput[];
    createMany?: Prisma.ResponseCreateManyRubricVersionInputEnvelope;
    connect?: Prisma.ResponseWhereUniqueInput | Prisma.ResponseWhereUniqueInput[];
};
export type ResponseUpdateManyWithoutRubricVersionNestedInput = {
    create?: Prisma.XOR<Prisma.ResponseCreateWithoutRubricVersionInput, Prisma.ResponseUncheckedCreateWithoutRubricVersionInput> | Prisma.ResponseCreateWithoutRubricVersionInput[] | Prisma.ResponseUncheckedCreateWithoutRubricVersionInput[];
    connectOrCreate?: Prisma.ResponseCreateOrConnectWithoutRubricVersionInput | Prisma.ResponseCreateOrConnectWithoutRubricVersionInput[];
    upsert?: Prisma.ResponseUpsertWithWhereUniqueWithoutRubricVersionInput | Prisma.ResponseUpsertWithWhereUniqueWithoutRubricVersionInput[];
    createMany?: Prisma.ResponseCreateManyRubricVersionInputEnvelope;
    set?: Prisma.ResponseWhereUniqueInput | Prisma.ResponseWhereUniqueInput[];
    disconnect?: Prisma.ResponseWhereUniqueInput | Prisma.ResponseWhereUniqueInput[];
    delete?: Prisma.ResponseWhereUniqueInput | Prisma.ResponseWhereUniqueInput[];
    connect?: Prisma.ResponseWhereUniqueInput | Prisma.ResponseWhereUniqueInput[];
    update?: Prisma.ResponseUpdateWithWhereUniqueWithoutRubricVersionInput | Prisma.ResponseUpdateWithWhereUniqueWithoutRubricVersionInput[];
    updateMany?: Prisma.ResponseUpdateManyWithWhereWithoutRubricVersionInput | Prisma.ResponseUpdateManyWithWhereWithoutRubricVersionInput[];
    deleteMany?: Prisma.ResponseScalarWhereInput | Prisma.ResponseScalarWhereInput[];
};
export type ResponseUncheckedUpdateManyWithoutRubricVersionNestedInput = {
    create?: Prisma.XOR<Prisma.ResponseCreateWithoutRubricVersionInput, Prisma.ResponseUncheckedCreateWithoutRubricVersionInput> | Prisma.ResponseCreateWithoutRubricVersionInput[] | Prisma.ResponseUncheckedCreateWithoutRubricVersionInput[];
    connectOrCreate?: Prisma.ResponseCreateOrConnectWithoutRubricVersionInput | Prisma.ResponseCreateOrConnectWithoutRubricVersionInput[];
    upsert?: Prisma.ResponseUpsertWithWhereUniqueWithoutRubricVersionInput | Prisma.ResponseUpsertWithWhereUniqueWithoutRubricVersionInput[];
    createMany?: Prisma.ResponseCreateManyRubricVersionInputEnvelope;
    set?: Prisma.ResponseWhereUniqueInput | Prisma.ResponseWhereUniqueInput[];
    disconnect?: Prisma.ResponseWhereUniqueInput | Prisma.ResponseWhereUniqueInput[];
    delete?: Prisma.ResponseWhereUniqueInput | Prisma.ResponseWhereUniqueInput[];
    connect?: Prisma.ResponseWhereUniqueInput | Prisma.ResponseWhereUniqueInput[];
    update?: Prisma.ResponseUpdateWithWhereUniqueWithoutRubricVersionInput | Prisma.ResponseUpdateWithWhereUniqueWithoutRubricVersionInput[];
    updateMany?: Prisma.ResponseUpdateManyWithWhereWithoutRubricVersionInput | Prisma.ResponseUpdateManyWithWhereWithoutRubricVersionInput[];
    deleteMany?: Prisma.ResponseScalarWhereInput | Prisma.ResponseScalarWhereInput[];
};
export type ResponseCreateNestedManyWithoutScaleInput = {
    create?: Prisma.XOR<Prisma.ResponseCreateWithoutScaleInput, Prisma.ResponseUncheckedCreateWithoutScaleInput> | Prisma.ResponseCreateWithoutScaleInput[] | Prisma.ResponseUncheckedCreateWithoutScaleInput[];
    connectOrCreate?: Prisma.ResponseCreateOrConnectWithoutScaleInput | Prisma.ResponseCreateOrConnectWithoutScaleInput[];
    createMany?: Prisma.ResponseCreateManyScaleInputEnvelope;
    connect?: Prisma.ResponseWhereUniqueInput | Prisma.ResponseWhereUniqueInput[];
};
export type ResponseUncheckedCreateNestedManyWithoutScaleInput = {
    create?: Prisma.XOR<Prisma.ResponseCreateWithoutScaleInput, Prisma.ResponseUncheckedCreateWithoutScaleInput> | Prisma.ResponseCreateWithoutScaleInput[] | Prisma.ResponseUncheckedCreateWithoutScaleInput[];
    connectOrCreate?: Prisma.ResponseCreateOrConnectWithoutScaleInput | Prisma.ResponseCreateOrConnectWithoutScaleInput[];
    createMany?: Prisma.ResponseCreateManyScaleInputEnvelope;
    connect?: Prisma.ResponseWhereUniqueInput | Prisma.ResponseWhereUniqueInput[];
};
export type ResponseUpdateManyWithoutScaleNestedInput = {
    create?: Prisma.XOR<Prisma.ResponseCreateWithoutScaleInput, Prisma.ResponseUncheckedCreateWithoutScaleInput> | Prisma.ResponseCreateWithoutScaleInput[] | Prisma.ResponseUncheckedCreateWithoutScaleInput[];
    connectOrCreate?: Prisma.ResponseCreateOrConnectWithoutScaleInput | Prisma.ResponseCreateOrConnectWithoutScaleInput[];
    upsert?: Prisma.ResponseUpsertWithWhereUniqueWithoutScaleInput | Prisma.ResponseUpsertWithWhereUniqueWithoutScaleInput[];
    createMany?: Prisma.ResponseCreateManyScaleInputEnvelope;
    set?: Prisma.ResponseWhereUniqueInput | Prisma.ResponseWhereUniqueInput[];
    disconnect?: Prisma.ResponseWhereUniqueInput | Prisma.ResponseWhereUniqueInput[];
    delete?: Prisma.ResponseWhereUniqueInput | Prisma.ResponseWhereUniqueInput[];
    connect?: Prisma.ResponseWhereUniqueInput | Prisma.ResponseWhereUniqueInput[];
    update?: Prisma.ResponseUpdateWithWhereUniqueWithoutScaleInput | Prisma.ResponseUpdateWithWhereUniqueWithoutScaleInput[];
    updateMany?: Prisma.ResponseUpdateManyWithWhereWithoutScaleInput | Prisma.ResponseUpdateManyWithWhereWithoutScaleInput[];
    deleteMany?: Prisma.ResponseScalarWhereInput | Prisma.ResponseScalarWhereInput[];
};
export type ResponseUncheckedUpdateManyWithoutScaleNestedInput = {
    create?: Prisma.XOR<Prisma.ResponseCreateWithoutScaleInput, Prisma.ResponseUncheckedCreateWithoutScaleInput> | Prisma.ResponseCreateWithoutScaleInput[] | Prisma.ResponseUncheckedCreateWithoutScaleInput[];
    connectOrCreate?: Prisma.ResponseCreateOrConnectWithoutScaleInput | Prisma.ResponseCreateOrConnectWithoutScaleInput[];
    upsert?: Prisma.ResponseUpsertWithWhereUniqueWithoutScaleInput | Prisma.ResponseUpsertWithWhereUniqueWithoutScaleInput[];
    createMany?: Prisma.ResponseCreateManyScaleInputEnvelope;
    set?: Prisma.ResponseWhereUniqueInput | Prisma.ResponseWhereUniqueInput[];
    disconnect?: Prisma.ResponseWhereUniqueInput | Prisma.ResponseWhereUniqueInput[];
    delete?: Prisma.ResponseWhereUniqueInput | Prisma.ResponseWhereUniqueInput[];
    connect?: Prisma.ResponseWhereUniqueInput | Prisma.ResponseWhereUniqueInput[];
    update?: Prisma.ResponseUpdateWithWhereUniqueWithoutScaleInput | Prisma.ResponseUpdateWithWhereUniqueWithoutScaleInput[];
    updateMany?: Prisma.ResponseUpdateManyWithWhereWithoutScaleInput | Prisma.ResponseUpdateManyWithWhereWithoutScaleInput[];
    deleteMany?: Prisma.ResponseScalarWhereInput | Prisma.ResponseScalarWhereInput[];
};
export type ResponseCreateNestedManyWithoutScaleVersionInput = {
    create?: Prisma.XOR<Prisma.ResponseCreateWithoutScaleVersionInput, Prisma.ResponseUncheckedCreateWithoutScaleVersionInput> | Prisma.ResponseCreateWithoutScaleVersionInput[] | Prisma.ResponseUncheckedCreateWithoutScaleVersionInput[];
    connectOrCreate?: Prisma.ResponseCreateOrConnectWithoutScaleVersionInput | Prisma.ResponseCreateOrConnectWithoutScaleVersionInput[];
    createMany?: Prisma.ResponseCreateManyScaleVersionInputEnvelope;
    connect?: Prisma.ResponseWhereUniqueInput | Prisma.ResponseWhereUniqueInput[];
};
export type ResponseUncheckedCreateNestedManyWithoutScaleVersionInput = {
    create?: Prisma.XOR<Prisma.ResponseCreateWithoutScaleVersionInput, Prisma.ResponseUncheckedCreateWithoutScaleVersionInput> | Prisma.ResponseCreateWithoutScaleVersionInput[] | Prisma.ResponseUncheckedCreateWithoutScaleVersionInput[];
    connectOrCreate?: Prisma.ResponseCreateOrConnectWithoutScaleVersionInput | Prisma.ResponseCreateOrConnectWithoutScaleVersionInput[];
    createMany?: Prisma.ResponseCreateManyScaleVersionInputEnvelope;
    connect?: Prisma.ResponseWhereUniqueInput | Prisma.ResponseWhereUniqueInput[];
};
export type ResponseUpdateManyWithoutScaleVersionNestedInput = {
    create?: Prisma.XOR<Prisma.ResponseCreateWithoutScaleVersionInput, Prisma.ResponseUncheckedCreateWithoutScaleVersionInput> | Prisma.ResponseCreateWithoutScaleVersionInput[] | Prisma.ResponseUncheckedCreateWithoutScaleVersionInput[];
    connectOrCreate?: Prisma.ResponseCreateOrConnectWithoutScaleVersionInput | Prisma.ResponseCreateOrConnectWithoutScaleVersionInput[];
    upsert?: Prisma.ResponseUpsertWithWhereUniqueWithoutScaleVersionInput | Prisma.ResponseUpsertWithWhereUniqueWithoutScaleVersionInput[];
    createMany?: Prisma.ResponseCreateManyScaleVersionInputEnvelope;
    set?: Prisma.ResponseWhereUniqueInput | Prisma.ResponseWhereUniqueInput[];
    disconnect?: Prisma.ResponseWhereUniqueInput | Prisma.ResponseWhereUniqueInput[];
    delete?: Prisma.ResponseWhereUniqueInput | Prisma.ResponseWhereUniqueInput[];
    connect?: Prisma.ResponseWhereUniqueInput | Prisma.ResponseWhereUniqueInput[];
    update?: Prisma.ResponseUpdateWithWhereUniqueWithoutScaleVersionInput | Prisma.ResponseUpdateWithWhereUniqueWithoutScaleVersionInput[];
    updateMany?: Prisma.ResponseUpdateManyWithWhereWithoutScaleVersionInput | Prisma.ResponseUpdateManyWithWhereWithoutScaleVersionInput[];
    deleteMany?: Prisma.ResponseScalarWhereInput | Prisma.ResponseScalarWhereInput[];
};
export type ResponseUncheckedUpdateManyWithoutScaleVersionNestedInput = {
    create?: Prisma.XOR<Prisma.ResponseCreateWithoutScaleVersionInput, Prisma.ResponseUncheckedCreateWithoutScaleVersionInput> | Prisma.ResponseCreateWithoutScaleVersionInput[] | Prisma.ResponseUncheckedCreateWithoutScaleVersionInput[];
    connectOrCreate?: Prisma.ResponseCreateOrConnectWithoutScaleVersionInput | Prisma.ResponseCreateOrConnectWithoutScaleVersionInput[];
    upsert?: Prisma.ResponseUpsertWithWhereUniqueWithoutScaleVersionInput | Prisma.ResponseUpsertWithWhereUniqueWithoutScaleVersionInput[];
    createMany?: Prisma.ResponseCreateManyScaleVersionInputEnvelope;
    set?: Prisma.ResponseWhereUniqueInput | Prisma.ResponseWhereUniqueInput[];
    disconnect?: Prisma.ResponseWhereUniqueInput | Prisma.ResponseWhereUniqueInput[];
    delete?: Prisma.ResponseWhereUniqueInput | Prisma.ResponseWhereUniqueInput[];
    connect?: Prisma.ResponseWhereUniqueInput | Prisma.ResponseWhereUniqueInput[];
    update?: Prisma.ResponseUpdateWithWhereUniqueWithoutScaleVersionInput | Prisma.ResponseUpdateWithWhereUniqueWithoutScaleVersionInput[];
    updateMany?: Prisma.ResponseUpdateManyWithWhereWithoutScaleVersionInput | Prisma.ResponseUpdateManyWithWhereWithoutScaleVersionInput[];
    deleteMany?: Prisma.ResponseScalarWhereInput | Prisma.ResponseScalarWhereInput[];
};
export type ResponseCreateNestedManyWithoutCourseInput = {
    create?: Prisma.XOR<Prisma.ResponseCreateWithoutCourseInput, Prisma.ResponseUncheckedCreateWithoutCourseInput> | Prisma.ResponseCreateWithoutCourseInput[] | Prisma.ResponseUncheckedCreateWithoutCourseInput[];
    connectOrCreate?: Prisma.ResponseCreateOrConnectWithoutCourseInput | Prisma.ResponseCreateOrConnectWithoutCourseInput[];
    createMany?: Prisma.ResponseCreateManyCourseInputEnvelope;
    connect?: Prisma.ResponseWhereUniqueInput | Prisma.ResponseWhereUniqueInput[];
};
export type ResponseUncheckedCreateNestedManyWithoutCourseInput = {
    create?: Prisma.XOR<Prisma.ResponseCreateWithoutCourseInput, Prisma.ResponseUncheckedCreateWithoutCourseInput> | Prisma.ResponseCreateWithoutCourseInput[] | Prisma.ResponseUncheckedCreateWithoutCourseInput[];
    connectOrCreate?: Prisma.ResponseCreateOrConnectWithoutCourseInput | Prisma.ResponseCreateOrConnectWithoutCourseInput[];
    createMany?: Prisma.ResponseCreateManyCourseInputEnvelope;
    connect?: Prisma.ResponseWhereUniqueInput | Prisma.ResponseWhereUniqueInput[];
};
export type ResponseUpdateManyWithoutCourseNestedInput = {
    create?: Prisma.XOR<Prisma.ResponseCreateWithoutCourseInput, Prisma.ResponseUncheckedCreateWithoutCourseInput> | Prisma.ResponseCreateWithoutCourseInput[] | Prisma.ResponseUncheckedCreateWithoutCourseInput[];
    connectOrCreate?: Prisma.ResponseCreateOrConnectWithoutCourseInput | Prisma.ResponseCreateOrConnectWithoutCourseInput[];
    upsert?: Prisma.ResponseUpsertWithWhereUniqueWithoutCourseInput | Prisma.ResponseUpsertWithWhereUniqueWithoutCourseInput[];
    createMany?: Prisma.ResponseCreateManyCourseInputEnvelope;
    set?: Prisma.ResponseWhereUniqueInput | Prisma.ResponseWhereUniqueInput[];
    disconnect?: Prisma.ResponseWhereUniqueInput | Prisma.ResponseWhereUniqueInput[];
    delete?: Prisma.ResponseWhereUniqueInput | Prisma.ResponseWhereUniqueInput[];
    connect?: Prisma.ResponseWhereUniqueInput | Prisma.ResponseWhereUniqueInput[];
    update?: Prisma.ResponseUpdateWithWhereUniqueWithoutCourseInput | Prisma.ResponseUpdateWithWhereUniqueWithoutCourseInput[];
    updateMany?: Prisma.ResponseUpdateManyWithWhereWithoutCourseInput | Prisma.ResponseUpdateManyWithWhereWithoutCourseInput[];
    deleteMany?: Prisma.ResponseScalarWhereInput | Prisma.ResponseScalarWhereInput[];
};
export type ResponseUncheckedUpdateManyWithoutCourseNestedInput = {
    create?: Prisma.XOR<Prisma.ResponseCreateWithoutCourseInput, Prisma.ResponseUncheckedCreateWithoutCourseInput> | Prisma.ResponseCreateWithoutCourseInput[] | Prisma.ResponseUncheckedCreateWithoutCourseInput[];
    connectOrCreate?: Prisma.ResponseCreateOrConnectWithoutCourseInput | Prisma.ResponseCreateOrConnectWithoutCourseInput[];
    upsert?: Prisma.ResponseUpsertWithWhereUniqueWithoutCourseInput | Prisma.ResponseUpsertWithWhereUniqueWithoutCourseInput[];
    createMany?: Prisma.ResponseCreateManyCourseInputEnvelope;
    set?: Prisma.ResponseWhereUniqueInput | Prisma.ResponseWhereUniqueInput[];
    disconnect?: Prisma.ResponseWhereUniqueInput | Prisma.ResponseWhereUniqueInput[];
    delete?: Prisma.ResponseWhereUniqueInput | Prisma.ResponseWhereUniqueInput[];
    connect?: Prisma.ResponseWhereUniqueInput | Prisma.ResponseWhereUniqueInput[];
    update?: Prisma.ResponseUpdateWithWhereUniqueWithoutCourseInput | Prisma.ResponseUpdateWithWhereUniqueWithoutCourseInput[];
    updateMany?: Prisma.ResponseUpdateManyWithWhereWithoutCourseInput | Prisma.ResponseUpdateManyWithWhereWithoutCourseInput[];
    deleteMany?: Prisma.ResponseScalarWhereInput | Prisma.ResponseScalarWhereInput[];
};
export type ResponseCreateWithoutUserInput = {
    id?: string;
    score: number;
    submittedAt?: Date | string;
    course: Prisma.CourseCreateNestedOneWithoutResponsesInput;
    scaleVersion: Prisma.ScaleVersionCreateNestedOneWithoutResponsesInput;
    rubricVersion: Prisma.RubricVersionCreateNestedOneWithoutResponsesInput;
    scale?: Prisma.ScaleCreateNestedOneWithoutResponsesInput;
};
export type ResponseUncheckedCreateWithoutUserInput = {
    id?: string;
    scaleVersionId: string;
    rubricVersionId: string;
    courseId: string;
    score: number;
    submittedAt?: Date | string;
    scaleId?: string | null;
};
export type ResponseCreateOrConnectWithoutUserInput = {
    where: Prisma.ResponseWhereUniqueInput;
    create: Prisma.XOR<Prisma.ResponseCreateWithoutUserInput, Prisma.ResponseUncheckedCreateWithoutUserInput>;
};
export type ResponseCreateManyUserInputEnvelope = {
    data: Prisma.ResponseCreateManyUserInput | Prisma.ResponseCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type ResponseUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.ResponseWhereUniqueInput;
    update: Prisma.XOR<Prisma.ResponseUpdateWithoutUserInput, Prisma.ResponseUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.ResponseCreateWithoutUserInput, Prisma.ResponseUncheckedCreateWithoutUserInput>;
};
export type ResponseUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.ResponseWhereUniqueInput;
    data: Prisma.XOR<Prisma.ResponseUpdateWithoutUserInput, Prisma.ResponseUncheckedUpdateWithoutUserInput>;
};
export type ResponseUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.ResponseScalarWhereInput;
    data: Prisma.XOR<Prisma.ResponseUpdateManyMutationInput, Prisma.ResponseUncheckedUpdateManyWithoutUserInput>;
};
export type ResponseScalarWhereInput = {
    AND?: Prisma.ResponseScalarWhereInput | Prisma.ResponseScalarWhereInput[];
    OR?: Prisma.ResponseScalarWhereInput[];
    NOT?: Prisma.ResponseScalarWhereInput | Prisma.ResponseScalarWhereInput[];
    id?: Prisma.UuidFilter<"Response"> | string;
    userId?: Prisma.UuidFilter<"Response"> | string;
    scaleVersionId?: Prisma.UuidFilter<"Response"> | string;
    rubricVersionId?: Prisma.UuidFilter<"Response"> | string;
    courseId?: Prisma.UuidFilter<"Response"> | string;
    score?: Prisma.IntFilter<"Response"> | number;
    submittedAt?: Prisma.DateTimeFilter<"Response"> | Date | string;
    scaleId?: Prisma.UuidNullableFilter<"Response"> | string | null;
};
export type ResponseCreateWithoutRubricVersionInput = {
    id?: string;
    score: number;
    submittedAt?: Date | string;
    course: Prisma.CourseCreateNestedOneWithoutResponsesInput;
    scaleVersion: Prisma.ScaleVersionCreateNestedOneWithoutResponsesInput;
    user: Prisma.UserCreateNestedOneWithoutResponsesInput;
    scale?: Prisma.ScaleCreateNestedOneWithoutResponsesInput;
};
export type ResponseUncheckedCreateWithoutRubricVersionInput = {
    id?: string;
    userId: string;
    scaleVersionId: string;
    courseId: string;
    score: number;
    submittedAt?: Date | string;
    scaleId?: string | null;
};
export type ResponseCreateOrConnectWithoutRubricVersionInput = {
    where: Prisma.ResponseWhereUniqueInput;
    create: Prisma.XOR<Prisma.ResponseCreateWithoutRubricVersionInput, Prisma.ResponseUncheckedCreateWithoutRubricVersionInput>;
};
export type ResponseCreateManyRubricVersionInputEnvelope = {
    data: Prisma.ResponseCreateManyRubricVersionInput | Prisma.ResponseCreateManyRubricVersionInput[];
    skipDuplicates?: boolean;
};
export type ResponseUpsertWithWhereUniqueWithoutRubricVersionInput = {
    where: Prisma.ResponseWhereUniqueInput;
    update: Prisma.XOR<Prisma.ResponseUpdateWithoutRubricVersionInput, Prisma.ResponseUncheckedUpdateWithoutRubricVersionInput>;
    create: Prisma.XOR<Prisma.ResponseCreateWithoutRubricVersionInput, Prisma.ResponseUncheckedCreateWithoutRubricVersionInput>;
};
export type ResponseUpdateWithWhereUniqueWithoutRubricVersionInput = {
    where: Prisma.ResponseWhereUniqueInput;
    data: Prisma.XOR<Prisma.ResponseUpdateWithoutRubricVersionInput, Prisma.ResponseUncheckedUpdateWithoutRubricVersionInput>;
};
export type ResponseUpdateManyWithWhereWithoutRubricVersionInput = {
    where: Prisma.ResponseScalarWhereInput;
    data: Prisma.XOR<Prisma.ResponseUpdateManyMutationInput, Prisma.ResponseUncheckedUpdateManyWithoutRubricVersionInput>;
};
export type ResponseCreateWithoutScaleInput = {
    id?: string;
    score: number;
    submittedAt?: Date | string;
    course: Prisma.CourseCreateNestedOneWithoutResponsesInput;
    scaleVersion: Prisma.ScaleVersionCreateNestedOneWithoutResponsesInput;
    rubricVersion: Prisma.RubricVersionCreateNestedOneWithoutResponsesInput;
    user: Prisma.UserCreateNestedOneWithoutResponsesInput;
};
export type ResponseUncheckedCreateWithoutScaleInput = {
    id?: string;
    userId: string;
    scaleVersionId: string;
    rubricVersionId: string;
    courseId: string;
    score: number;
    submittedAt?: Date | string;
};
export type ResponseCreateOrConnectWithoutScaleInput = {
    where: Prisma.ResponseWhereUniqueInput;
    create: Prisma.XOR<Prisma.ResponseCreateWithoutScaleInput, Prisma.ResponseUncheckedCreateWithoutScaleInput>;
};
export type ResponseCreateManyScaleInputEnvelope = {
    data: Prisma.ResponseCreateManyScaleInput | Prisma.ResponseCreateManyScaleInput[];
    skipDuplicates?: boolean;
};
export type ResponseUpsertWithWhereUniqueWithoutScaleInput = {
    where: Prisma.ResponseWhereUniqueInput;
    update: Prisma.XOR<Prisma.ResponseUpdateWithoutScaleInput, Prisma.ResponseUncheckedUpdateWithoutScaleInput>;
    create: Prisma.XOR<Prisma.ResponseCreateWithoutScaleInput, Prisma.ResponseUncheckedCreateWithoutScaleInput>;
};
export type ResponseUpdateWithWhereUniqueWithoutScaleInput = {
    where: Prisma.ResponseWhereUniqueInput;
    data: Prisma.XOR<Prisma.ResponseUpdateWithoutScaleInput, Prisma.ResponseUncheckedUpdateWithoutScaleInput>;
};
export type ResponseUpdateManyWithWhereWithoutScaleInput = {
    where: Prisma.ResponseScalarWhereInput;
    data: Prisma.XOR<Prisma.ResponseUpdateManyMutationInput, Prisma.ResponseUncheckedUpdateManyWithoutScaleInput>;
};
export type ResponseCreateWithoutScaleVersionInput = {
    id?: string;
    score: number;
    submittedAt?: Date | string;
    course: Prisma.CourseCreateNestedOneWithoutResponsesInput;
    rubricVersion: Prisma.RubricVersionCreateNestedOneWithoutResponsesInput;
    user: Prisma.UserCreateNestedOneWithoutResponsesInput;
    scale?: Prisma.ScaleCreateNestedOneWithoutResponsesInput;
};
export type ResponseUncheckedCreateWithoutScaleVersionInput = {
    id?: string;
    userId: string;
    rubricVersionId: string;
    courseId: string;
    score: number;
    submittedAt?: Date | string;
    scaleId?: string | null;
};
export type ResponseCreateOrConnectWithoutScaleVersionInput = {
    where: Prisma.ResponseWhereUniqueInput;
    create: Prisma.XOR<Prisma.ResponseCreateWithoutScaleVersionInput, Prisma.ResponseUncheckedCreateWithoutScaleVersionInput>;
};
export type ResponseCreateManyScaleVersionInputEnvelope = {
    data: Prisma.ResponseCreateManyScaleVersionInput | Prisma.ResponseCreateManyScaleVersionInput[];
    skipDuplicates?: boolean;
};
export type ResponseUpsertWithWhereUniqueWithoutScaleVersionInput = {
    where: Prisma.ResponseWhereUniqueInput;
    update: Prisma.XOR<Prisma.ResponseUpdateWithoutScaleVersionInput, Prisma.ResponseUncheckedUpdateWithoutScaleVersionInput>;
    create: Prisma.XOR<Prisma.ResponseCreateWithoutScaleVersionInput, Prisma.ResponseUncheckedCreateWithoutScaleVersionInput>;
};
export type ResponseUpdateWithWhereUniqueWithoutScaleVersionInput = {
    where: Prisma.ResponseWhereUniqueInput;
    data: Prisma.XOR<Prisma.ResponseUpdateWithoutScaleVersionInput, Prisma.ResponseUncheckedUpdateWithoutScaleVersionInput>;
};
export type ResponseUpdateManyWithWhereWithoutScaleVersionInput = {
    where: Prisma.ResponseScalarWhereInput;
    data: Prisma.XOR<Prisma.ResponseUpdateManyMutationInput, Prisma.ResponseUncheckedUpdateManyWithoutScaleVersionInput>;
};
export type ResponseCreateWithoutCourseInput = {
    id?: string;
    score: number;
    submittedAt?: Date | string;
    scaleVersion: Prisma.ScaleVersionCreateNestedOneWithoutResponsesInput;
    rubricVersion: Prisma.RubricVersionCreateNestedOneWithoutResponsesInput;
    user: Prisma.UserCreateNestedOneWithoutResponsesInput;
    scale?: Prisma.ScaleCreateNestedOneWithoutResponsesInput;
};
export type ResponseUncheckedCreateWithoutCourseInput = {
    id?: string;
    userId: string;
    scaleVersionId: string;
    rubricVersionId: string;
    score: number;
    submittedAt?: Date | string;
    scaleId?: string | null;
};
export type ResponseCreateOrConnectWithoutCourseInput = {
    where: Prisma.ResponseWhereUniqueInput;
    create: Prisma.XOR<Prisma.ResponseCreateWithoutCourseInput, Prisma.ResponseUncheckedCreateWithoutCourseInput>;
};
export type ResponseCreateManyCourseInputEnvelope = {
    data: Prisma.ResponseCreateManyCourseInput | Prisma.ResponseCreateManyCourseInput[];
    skipDuplicates?: boolean;
};
export type ResponseUpsertWithWhereUniqueWithoutCourseInput = {
    where: Prisma.ResponseWhereUniqueInput;
    update: Prisma.XOR<Prisma.ResponseUpdateWithoutCourseInput, Prisma.ResponseUncheckedUpdateWithoutCourseInput>;
    create: Prisma.XOR<Prisma.ResponseCreateWithoutCourseInput, Prisma.ResponseUncheckedCreateWithoutCourseInput>;
};
export type ResponseUpdateWithWhereUniqueWithoutCourseInput = {
    where: Prisma.ResponseWhereUniqueInput;
    data: Prisma.XOR<Prisma.ResponseUpdateWithoutCourseInput, Prisma.ResponseUncheckedUpdateWithoutCourseInput>;
};
export type ResponseUpdateManyWithWhereWithoutCourseInput = {
    where: Prisma.ResponseScalarWhereInput;
    data: Prisma.XOR<Prisma.ResponseUpdateManyMutationInput, Prisma.ResponseUncheckedUpdateManyWithoutCourseInput>;
};
export type ResponseCreateManyUserInput = {
    id?: string;
    scaleVersionId: string;
    rubricVersionId: string;
    courseId: string;
    score: number;
    submittedAt?: Date | string;
    scaleId?: string | null;
};
export type ResponseUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    score?: Prisma.IntFieldUpdateOperationsInput | number;
    submittedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    course?: Prisma.CourseUpdateOneRequiredWithoutResponsesNestedInput;
    scaleVersion?: Prisma.ScaleVersionUpdateOneRequiredWithoutResponsesNestedInput;
    rubricVersion?: Prisma.RubricVersionUpdateOneRequiredWithoutResponsesNestedInput;
    scale?: Prisma.ScaleUpdateOneWithoutResponsesNestedInput;
};
export type ResponseUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    scaleVersionId?: Prisma.StringFieldUpdateOperationsInput | string;
    rubricVersionId?: Prisma.StringFieldUpdateOperationsInput | string;
    courseId?: Prisma.StringFieldUpdateOperationsInput | string;
    score?: Prisma.IntFieldUpdateOperationsInput | number;
    submittedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    scaleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type ResponseUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    scaleVersionId?: Prisma.StringFieldUpdateOperationsInput | string;
    rubricVersionId?: Prisma.StringFieldUpdateOperationsInput | string;
    courseId?: Prisma.StringFieldUpdateOperationsInput | string;
    score?: Prisma.IntFieldUpdateOperationsInput | number;
    submittedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    scaleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type ResponseCreateManyRubricVersionInput = {
    id?: string;
    userId: string;
    scaleVersionId: string;
    courseId: string;
    score: number;
    submittedAt?: Date | string;
    scaleId?: string | null;
};
export type ResponseUpdateWithoutRubricVersionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    score?: Prisma.IntFieldUpdateOperationsInput | number;
    submittedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    course?: Prisma.CourseUpdateOneRequiredWithoutResponsesNestedInput;
    scaleVersion?: Prisma.ScaleVersionUpdateOneRequiredWithoutResponsesNestedInput;
    user?: Prisma.UserUpdateOneRequiredWithoutResponsesNestedInput;
    scale?: Prisma.ScaleUpdateOneWithoutResponsesNestedInput;
};
export type ResponseUncheckedUpdateWithoutRubricVersionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    scaleVersionId?: Prisma.StringFieldUpdateOperationsInput | string;
    courseId?: Prisma.StringFieldUpdateOperationsInput | string;
    score?: Prisma.IntFieldUpdateOperationsInput | number;
    submittedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    scaleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type ResponseUncheckedUpdateManyWithoutRubricVersionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    scaleVersionId?: Prisma.StringFieldUpdateOperationsInput | string;
    courseId?: Prisma.StringFieldUpdateOperationsInput | string;
    score?: Prisma.IntFieldUpdateOperationsInput | number;
    submittedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    scaleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type ResponseCreateManyScaleInput = {
    id?: string;
    userId: string;
    scaleVersionId: string;
    rubricVersionId: string;
    courseId: string;
    score: number;
    submittedAt?: Date | string;
};
export type ResponseUpdateWithoutScaleInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    score?: Prisma.IntFieldUpdateOperationsInput | number;
    submittedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    course?: Prisma.CourseUpdateOneRequiredWithoutResponsesNestedInput;
    scaleVersion?: Prisma.ScaleVersionUpdateOneRequiredWithoutResponsesNestedInput;
    rubricVersion?: Prisma.RubricVersionUpdateOneRequiredWithoutResponsesNestedInput;
    user?: Prisma.UserUpdateOneRequiredWithoutResponsesNestedInput;
};
export type ResponseUncheckedUpdateWithoutScaleInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    scaleVersionId?: Prisma.StringFieldUpdateOperationsInput | string;
    rubricVersionId?: Prisma.StringFieldUpdateOperationsInput | string;
    courseId?: Prisma.StringFieldUpdateOperationsInput | string;
    score?: Prisma.IntFieldUpdateOperationsInput | number;
    submittedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ResponseUncheckedUpdateManyWithoutScaleInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    scaleVersionId?: Prisma.StringFieldUpdateOperationsInput | string;
    rubricVersionId?: Prisma.StringFieldUpdateOperationsInput | string;
    courseId?: Prisma.StringFieldUpdateOperationsInput | string;
    score?: Prisma.IntFieldUpdateOperationsInput | number;
    submittedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ResponseCreateManyScaleVersionInput = {
    id?: string;
    userId: string;
    rubricVersionId: string;
    courseId: string;
    score: number;
    submittedAt?: Date | string;
    scaleId?: string | null;
};
export type ResponseUpdateWithoutScaleVersionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    score?: Prisma.IntFieldUpdateOperationsInput | number;
    submittedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    course?: Prisma.CourseUpdateOneRequiredWithoutResponsesNestedInput;
    rubricVersion?: Prisma.RubricVersionUpdateOneRequiredWithoutResponsesNestedInput;
    user?: Prisma.UserUpdateOneRequiredWithoutResponsesNestedInput;
    scale?: Prisma.ScaleUpdateOneWithoutResponsesNestedInput;
};
export type ResponseUncheckedUpdateWithoutScaleVersionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    rubricVersionId?: Prisma.StringFieldUpdateOperationsInput | string;
    courseId?: Prisma.StringFieldUpdateOperationsInput | string;
    score?: Prisma.IntFieldUpdateOperationsInput | number;
    submittedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    scaleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type ResponseUncheckedUpdateManyWithoutScaleVersionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    rubricVersionId?: Prisma.StringFieldUpdateOperationsInput | string;
    courseId?: Prisma.StringFieldUpdateOperationsInput | string;
    score?: Prisma.IntFieldUpdateOperationsInput | number;
    submittedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    scaleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type ResponseCreateManyCourseInput = {
    id?: string;
    userId: string;
    scaleVersionId: string;
    rubricVersionId: string;
    score: number;
    submittedAt?: Date | string;
    scaleId?: string | null;
};
export type ResponseUpdateWithoutCourseInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    score?: Prisma.IntFieldUpdateOperationsInput | number;
    submittedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    scaleVersion?: Prisma.ScaleVersionUpdateOneRequiredWithoutResponsesNestedInput;
    rubricVersion?: Prisma.RubricVersionUpdateOneRequiredWithoutResponsesNestedInput;
    user?: Prisma.UserUpdateOneRequiredWithoutResponsesNestedInput;
    scale?: Prisma.ScaleUpdateOneWithoutResponsesNestedInput;
};
export type ResponseUncheckedUpdateWithoutCourseInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    scaleVersionId?: Prisma.StringFieldUpdateOperationsInput | string;
    rubricVersionId?: Prisma.StringFieldUpdateOperationsInput | string;
    score?: Prisma.IntFieldUpdateOperationsInput | number;
    submittedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    scaleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type ResponseUncheckedUpdateManyWithoutCourseInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    scaleVersionId?: Prisma.StringFieldUpdateOperationsInput | string;
    rubricVersionId?: Prisma.StringFieldUpdateOperationsInput | string;
    score?: Prisma.IntFieldUpdateOperationsInput | number;
    submittedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    scaleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type ResponseSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    scaleVersionId?: boolean;
    rubricVersionId?: boolean;
    courseId?: boolean;
    score?: boolean;
    submittedAt?: boolean;
    scaleId?: boolean;
    course?: boolean | Prisma.CourseDefaultArgs<ExtArgs>;
    scaleVersion?: boolean | Prisma.ScaleVersionDefaultArgs<ExtArgs>;
    rubricVersion?: boolean | Prisma.RubricVersionDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    scale?: boolean | Prisma.Response$scaleArgs<ExtArgs>;
}, ExtArgs["result"]["response"]>;
export type ResponseSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    scaleVersionId?: boolean;
    rubricVersionId?: boolean;
    courseId?: boolean;
    score?: boolean;
    submittedAt?: boolean;
    scaleId?: boolean;
    course?: boolean | Prisma.CourseDefaultArgs<ExtArgs>;
    scaleVersion?: boolean | Prisma.ScaleVersionDefaultArgs<ExtArgs>;
    rubricVersion?: boolean | Prisma.RubricVersionDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    scale?: boolean | Prisma.Response$scaleArgs<ExtArgs>;
}, ExtArgs["result"]["response"]>;
export type ResponseSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    scaleVersionId?: boolean;
    rubricVersionId?: boolean;
    courseId?: boolean;
    score?: boolean;
    submittedAt?: boolean;
    scaleId?: boolean;
    course?: boolean | Prisma.CourseDefaultArgs<ExtArgs>;
    scaleVersion?: boolean | Prisma.ScaleVersionDefaultArgs<ExtArgs>;
    rubricVersion?: boolean | Prisma.RubricVersionDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    scale?: boolean | Prisma.Response$scaleArgs<ExtArgs>;
}, ExtArgs["result"]["response"]>;
export type ResponseSelectScalar = {
    id?: boolean;
    userId?: boolean;
    scaleVersionId?: boolean;
    rubricVersionId?: boolean;
    courseId?: boolean;
    score?: boolean;
    submittedAt?: boolean;
    scaleId?: boolean;
};
export type ResponseOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "scaleVersionId" | "rubricVersionId" | "courseId" | "score" | "submittedAt" | "scaleId", ExtArgs["result"]["response"]>;
export type ResponseInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    course?: boolean | Prisma.CourseDefaultArgs<ExtArgs>;
    scaleVersion?: boolean | Prisma.ScaleVersionDefaultArgs<ExtArgs>;
    rubricVersion?: boolean | Prisma.RubricVersionDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    scale?: boolean | Prisma.Response$scaleArgs<ExtArgs>;
};
export type ResponseIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    course?: boolean | Prisma.CourseDefaultArgs<ExtArgs>;
    scaleVersion?: boolean | Prisma.ScaleVersionDefaultArgs<ExtArgs>;
    rubricVersion?: boolean | Prisma.RubricVersionDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    scale?: boolean | Prisma.Response$scaleArgs<ExtArgs>;
};
export type ResponseIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    course?: boolean | Prisma.CourseDefaultArgs<ExtArgs>;
    scaleVersion?: boolean | Prisma.ScaleVersionDefaultArgs<ExtArgs>;
    rubricVersion?: boolean | Prisma.RubricVersionDefaultArgs<ExtArgs>;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    scale?: boolean | Prisma.Response$scaleArgs<ExtArgs>;
};
export type $ResponsePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Response";
    objects: {
        course: Prisma.$CoursePayload<ExtArgs>;
        scaleVersion: Prisma.$ScaleVersionPayload<ExtArgs>;
        rubricVersion: Prisma.$RubricVersionPayload<ExtArgs>;
        user: Prisma.$UserPayload<ExtArgs>;
        scale: Prisma.$ScalePayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        userId: string;
        scaleVersionId: string;
        rubricVersionId: string;
        courseId: string;
        score: number;
        submittedAt: Date;
        scaleId: string | null;
    }, ExtArgs["result"]["response"]>;
    composites: {};
};
export type ResponseGetPayload<S extends boolean | null | undefined | ResponseDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ResponsePayload, S>;
export type ResponseCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ResponseFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ResponseCountAggregateInputType | true;
};
export interface ResponseDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Response'];
        meta: {
            name: 'Response';
        };
    };
    /**
     * Find zero or one Response that matches the filter.
     * @param {ResponseFindUniqueArgs} args - Arguments to find a Response
     * @example
     * // Get one Response
     * const response = await prisma.response.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ResponseFindUniqueArgs>(args: Prisma.SelectSubset<T, ResponseFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ResponseClient<runtime.Types.Result.GetResult<Prisma.$ResponsePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one Response that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ResponseFindUniqueOrThrowArgs} args - Arguments to find a Response
     * @example
     * // Get one Response
     * const response = await prisma.response.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ResponseFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ResponseFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ResponseClient<runtime.Types.Result.GetResult<Prisma.$ResponsePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Response that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResponseFindFirstArgs} args - Arguments to find a Response
     * @example
     * // Get one Response
     * const response = await prisma.response.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ResponseFindFirstArgs>(args?: Prisma.SelectSubset<T, ResponseFindFirstArgs<ExtArgs>>): Prisma.Prisma__ResponseClient<runtime.Types.Result.GetResult<Prisma.$ResponsePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first Response that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResponseFindFirstOrThrowArgs} args - Arguments to find a Response
     * @example
     * // Get one Response
     * const response = await prisma.response.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ResponseFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ResponseFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ResponseClient<runtime.Types.Result.GetResult<Prisma.$ResponsePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more Responses that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResponseFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Responses
     * const responses = await prisma.response.findMany()
     *
     * // Get first 10 Responses
     * const responses = await prisma.response.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const responseWithIdOnly = await prisma.response.findMany({ select: { id: true } })
     *
     */
    findMany<T extends ResponseFindManyArgs>(args?: Prisma.SelectSubset<T, ResponseFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ResponsePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a Response.
     * @param {ResponseCreateArgs} args - Arguments to create a Response.
     * @example
     * // Create one Response
     * const Response = await prisma.response.create({
     *   data: {
     *     // ... data to create a Response
     *   }
     * })
     *
     */
    create<T extends ResponseCreateArgs>(args: Prisma.SelectSubset<T, ResponseCreateArgs<ExtArgs>>): Prisma.Prisma__ResponseClient<runtime.Types.Result.GetResult<Prisma.$ResponsePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many Responses.
     * @param {ResponseCreateManyArgs} args - Arguments to create many Responses.
     * @example
     * // Create many Responses
     * const response = await prisma.response.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends ResponseCreateManyArgs>(args?: Prisma.SelectSubset<T, ResponseCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many Responses and returns the data saved in the database.
     * @param {ResponseCreateManyAndReturnArgs} args - Arguments to create many Responses.
     * @example
     * // Create many Responses
     * const response = await prisma.response.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many Responses and only return the `id`
     * const responseWithIdOnly = await prisma.response.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends ResponseCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ResponseCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ResponsePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a Response.
     * @param {ResponseDeleteArgs} args - Arguments to delete one Response.
     * @example
     * // Delete one Response
     * const Response = await prisma.response.delete({
     *   where: {
     *     // ... filter to delete one Response
     *   }
     * })
     *
     */
    delete<T extends ResponseDeleteArgs>(args: Prisma.SelectSubset<T, ResponseDeleteArgs<ExtArgs>>): Prisma.Prisma__ResponseClient<runtime.Types.Result.GetResult<Prisma.$ResponsePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one Response.
     * @param {ResponseUpdateArgs} args - Arguments to update one Response.
     * @example
     * // Update one Response
     * const response = await prisma.response.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends ResponseUpdateArgs>(args: Prisma.SelectSubset<T, ResponseUpdateArgs<ExtArgs>>): Prisma.Prisma__ResponseClient<runtime.Types.Result.GetResult<Prisma.$ResponsePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more Responses.
     * @param {ResponseDeleteManyArgs} args - Arguments to filter Responses to delete.
     * @example
     * // Delete a few Responses
     * const { count } = await prisma.response.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends ResponseDeleteManyArgs>(args?: Prisma.SelectSubset<T, ResponseDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Responses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResponseUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Responses
     * const response = await prisma.response.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends ResponseUpdateManyArgs>(args: Prisma.SelectSubset<T, ResponseUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more Responses and returns the data updated in the database.
     * @param {ResponseUpdateManyAndReturnArgs} args - Arguments to update many Responses.
     * @example
     * // Update many Responses
     * const response = await prisma.response.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more Responses and only return the `id`
     * const responseWithIdOnly = await prisma.response.updateManyAndReturn({
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
    updateManyAndReturn<T extends ResponseUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ResponseUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ResponsePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one Response.
     * @param {ResponseUpsertArgs} args - Arguments to update or create a Response.
     * @example
     * // Update or create a Response
     * const response = await prisma.response.upsert({
     *   create: {
     *     // ... data to create a Response
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Response we want to update
     *   }
     * })
     */
    upsert<T extends ResponseUpsertArgs>(args: Prisma.SelectSubset<T, ResponseUpsertArgs<ExtArgs>>): Prisma.Prisma__ResponseClient<runtime.Types.Result.GetResult<Prisma.$ResponsePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of Responses.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResponseCountArgs} args - Arguments to filter Responses to count.
     * @example
     * // Count the number of Responses
     * const count = await prisma.response.count({
     *   where: {
     *     // ... the filter for the Responses we want to count
     *   }
     * })
    **/
    count<T extends ResponseCountArgs>(args?: Prisma.Subset<T, ResponseCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ResponseCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a Response.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResponseAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ResponseAggregateArgs>(args: Prisma.Subset<T, ResponseAggregateArgs>): Prisma.PrismaPromise<GetResponseAggregateType<T>>;
    /**
     * Group by Response.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ResponseGroupByArgs} args - Group by arguments.
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
    groupBy<T extends ResponseGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ResponseGroupByArgs['orderBy'];
    } : {
        orderBy?: ResponseGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ResponseGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetResponseGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the Response model
     */
    readonly fields: ResponseFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for Response.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__ResponseClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    course<T extends Prisma.CourseDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CourseDefaultArgs<ExtArgs>>): Prisma.Prisma__CourseClient<runtime.Types.Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    scaleVersion<T extends Prisma.ScaleVersionDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ScaleVersionDefaultArgs<ExtArgs>>): Prisma.Prisma__ScaleVersionClient<runtime.Types.Result.GetResult<Prisma.$ScaleVersionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    rubricVersion<T extends Prisma.RubricVersionDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.RubricVersionDefaultArgs<ExtArgs>>): Prisma.Prisma__RubricVersionClient<runtime.Types.Result.GetResult<Prisma.$RubricVersionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    scale<T extends Prisma.Response$scaleArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Response$scaleArgs<ExtArgs>>): Prisma.Prisma__ScaleClient<runtime.Types.Result.GetResult<Prisma.$ScalePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the Response model
 */
export interface ResponseFieldRefs {
    readonly id: Prisma.FieldRef<"Response", 'String'>;
    readonly userId: Prisma.FieldRef<"Response", 'String'>;
    readonly scaleVersionId: Prisma.FieldRef<"Response", 'String'>;
    readonly rubricVersionId: Prisma.FieldRef<"Response", 'String'>;
    readonly courseId: Prisma.FieldRef<"Response", 'String'>;
    readonly score: Prisma.FieldRef<"Response", 'Int'>;
    readonly submittedAt: Prisma.FieldRef<"Response", 'DateTime'>;
    readonly scaleId: Prisma.FieldRef<"Response", 'String'>;
}
/**
 * Response findUnique
 */
export type ResponseFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which Response to fetch.
     */
    where: Prisma.ResponseWhereUniqueInput;
};
/**
 * Response findUniqueOrThrow
 */
export type ResponseFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which Response to fetch.
     */
    where: Prisma.ResponseWhereUniqueInput;
};
/**
 * Response findFirst
 */
export type ResponseFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which Response to fetch.
     */
    where?: Prisma.ResponseWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Responses to fetch.
     */
    orderBy?: Prisma.ResponseOrderByWithRelationInput | Prisma.ResponseOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Responses.
     */
    cursor?: Prisma.ResponseWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Responses from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Responses.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Responses.
     */
    distinct?: Prisma.ResponseScalarFieldEnum | Prisma.ResponseScalarFieldEnum[];
};
/**
 * Response findFirstOrThrow
 */
export type ResponseFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which Response to fetch.
     */
    where?: Prisma.ResponseWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Responses to fetch.
     */
    orderBy?: Prisma.ResponseOrderByWithRelationInput | Prisma.ResponseOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for Responses.
     */
    cursor?: Prisma.ResponseWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Responses from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Responses.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of Responses.
     */
    distinct?: Prisma.ResponseScalarFieldEnum | Prisma.ResponseScalarFieldEnum[];
};
/**
 * Response findMany
 */
export type ResponseFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which Responses to fetch.
     */
    where?: Prisma.ResponseWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of Responses to fetch.
     */
    orderBy?: Prisma.ResponseOrderByWithRelationInput | Prisma.ResponseOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing Responses.
     */
    cursor?: Prisma.ResponseWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` Responses from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` Responses.
     */
    skip?: number;
    distinct?: Prisma.ResponseScalarFieldEnum | Prisma.ResponseScalarFieldEnum[];
};
/**
 * Response create
 */
export type ResponseCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to create a Response.
     */
    data: Prisma.XOR<Prisma.ResponseCreateInput, Prisma.ResponseUncheckedCreateInput>;
};
/**
 * Response createMany
 */
export type ResponseCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many Responses.
     */
    data: Prisma.ResponseCreateManyInput | Prisma.ResponseCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * Response createManyAndReturn
 */
export type ResponseCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Response
     */
    select?: Prisma.ResponseSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Response
     */
    omit?: Prisma.ResponseOmit<ExtArgs> | null;
    /**
     * The data used to create many Responses.
     */
    data: Prisma.ResponseCreateManyInput | Prisma.ResponseCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ResponseIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * Response update
 */
export type ResponseUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to update a Response.
     */
    data: Prisma.XOR<Prisma.ResponseUpdateInput, Prisma.ResponseUncheckedUpdateInput>;
    /**
     * Choose, which Response to update.
     */
    where: Prisma.ResponseWhereUniqueInput;
};
/**
 * Response updateMany
 */
export type ResponseUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update Responses.
     */
    data: Prisma.XOR<Prisma.ResponseUpdateManyMutationInput, Prisma.ResponseUncheckedUpdateManyInput>;
    /**
     * Filter which Responses to update
     */
    where?: Prisma.ResponseWhereInput;
    /**
     * Limit how many Responses to update.
     */
    limit?: number;
};
/**
 * Response updateManyAndReturn
 */
export type ResponseUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Response
     */
    select?: Prisma.ResponseSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the Response
     */
    omit?: Prisma.ResponseOmit<ExtArgs> | null;
    /**
     * The data used to update Responses.
     */
    data: Prisma.XOR<Prisma.ResponseUpdateManyMutationInput, Prisma.ResponseUncheckedUpdateManyInput>;
    /**
     * Filter which Responses to update
     */
    where?: Prisma.ResponseWhereInput;
    /**
     * Limit how many Responses to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ResponseIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * Response upsert
 */
export type ResponseUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The filter to search for the Response to update in case it exists.
     */
    where: Prisma.ResponseWhereUniqueInput;
    /**
     * In case the Response found by the `where` argument doesn't exist, create a new Response with this data.
     */
    create: Prisma.XOR<Prisma.ResponseCreateInput, Prisma.ResponseUncheckedCreateInput>;
    /**
     * In case the Response was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.ResponseUpdateInput, Prisma.ResponseUncheckedUpdateInput>;
};
/**
 * Response delete
 */
export type ResponseDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter which Response to delete.
     */
    where: Prisma.ResponseWhereUniqueInput;
};
/**
 * Response deleteMany
 */
export type ResponseDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which Responses to delete
     */
    where?: Prisma.ResponseWhereInput;
    /**
     * Limit how many Responses to delete.
     */
    limit?: number;
};
/**
 * Response.scale
 */
export type Response$scaleArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
/**
 * Response without action
 */
export type ResponseDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
export {};
//# sourceMappingURL=Response.d.ts.map