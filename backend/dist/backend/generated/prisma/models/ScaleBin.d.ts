import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model ScaleBin
 *
 */
export type ScaleBinModel = runtime.Types.Result.DefaultSelection<Prisma.$ScaleBinPayload>;
export type AggregateScaleBin = {
    _count: ScaleBinCountAggregateOutputType | null;
    _min: ScaleBinMinAggregateOutputType | null;
    _max: ScaleBinMaxAggregateOutputType | null;
};
export type ScaleBinMinAggregateOutputType = {
    scaleId: string | null;
    predefinedBinId: string | null;
};
export type ScaleBinMaxAggregateOutputType = {
    scaleId: string | null;
    predefinedBinId: string | null;
};
export type ScaleBinCountAggregateOutputType = {
    scaleId: number;
    predefinedBinId: number;
    _all: number;
};
export type ScaleBinMinAggregateInputType = {
    scaleId?: true;
    predefinedBinId?: true;
};
export type ScaleBinMaxAggregateInputType = {
    scaleId?: true;
    predefinedBinId?: true;
};
export type ScaleBinCountAggregateInputType = {
    scaleId?: true;
    predefinedBinId?: true;
    _all?: true;
};
export type ScaleBinAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which ScaleBin to aggregate.
     */
    where?: Prisma.ScaleBinWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ScaleBins to fetch.
     */
    orderBy?: Prisma.ScaleBinOrderByWithRelationInput | Prisma.ScaleBinOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.ScaleBinWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ScaleBins from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ScaleBins.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned ScaleBins
    **/
    _count?: true | ScaleBinCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: ScaleBinMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: ScaleBinMaxAggregateInputType;
};
export type GetScaleBinAggregateType<T extends ScaleBinAggregateArgs> = {
    [P in keyof T & keyof AggregateScaleBin]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateScaleBin[P]> : Prisma.GetScalarType<T[P], AggregateScaleBin[P]>;
};
export type ScaleBinGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ScaleBinWhereInput;
    orderBy?: Prisma.ScaleBinOrderByWithAggregationInput | Prisma.ScaleBinOrderByWithAggregationInput[];
    by: Prisma.ScaleBinScalarFieldEnum[] | Prisma.ScaleBinScalarFieldEnum;
    having?: Prisma.ScaleBinScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ScaleBinCountAggregateInputType | true;
    _min?: ScaleBinMinAggregateInputType;
    _max?: ScaleBinMaxAggregateInputType;
};
export type ScaleBinGroupByOutputType = {
    scaleId: string;
    predefinedBinId: string;
    _count: ScaleBinCountAggregateOutputType | null;
    _min: ScaleBinMinAggregateOutputType | null;
    _max: ScaleBinMaxAggregateOutputType | null;
};
type GetScaleBinGroupByPayload<T extends ScaleBinGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ScaleBinGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ScaleBinGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ScaleBinGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ScaleBinGroupByOutputType[P]>;
}>>;
export type ScaleBinWhereInput = {
    AND?: Prisma.ScaleBinWhereInput | Prisma.ScaleBinWhereInput[];
    OR?: Prisma.ScaleBinWhereInput[];
    NOT?: Prisma.ScaleBinWhereInput | Prisma.ScaleBinWhereInput[];
    scaleId?: Prisma.UuidFilter<"ScaleBin"> | string;
    predefinedBinId?: Prisma.UuidFilter<"ScaleBin"> | string;
    scale?: Prisma.XOR<Prisma.ScaleScalarRelationFilter, Prisma.ScaleWhereInput>;
    predefinedCourseBin?: Prisma.XOR<Prisma.PredefinedCourseBinScalarRelationFilter, Prisma.PredefinedCourseBinWhereInput>;
};
export type ScaleBinOrderByWithRelationInput = {
    scaleId?: Prisma.SortOrder;
    predefinedBinId?: Prisma.SortOrder;
    scale?: Prisma.ScaleOrderByWithRelationInput;
    predefinedCourseBin?: Prisma.PredefinedCourseBinOrderByWithRelationInput;
};
export type ScaleBinWhereUniqueInput = Prisma.AtLeast<{
    scaleId_predefinedBinId?: Prisma.ScaleBinScaleIdPredefinedBinIdCompoundUniqueInput;
    AND?: Prisma.ScaleBinWhereInput | Prisma.ScaleBinWhereInput[];
    OR?: Prisma.ScaleBinWhereInput[];
    NOT?: Prisma.ScaleBinWhereInput | Prisma.ScaleBinWhereInput[];
    scaleId?: Prisma.UuidFilter<"ScaleBin"> | string;
    predefinedBinId?: Prisma.UuidFilter<"ScaleBin"> | string;
    scale?: Prisma.XOR<Prisma.ScaleScalarRelationFilter, Prisma.ScaleWhereInput>;
    predefinedCourseBin?: Prisma.XOR<Prisma.PredefinedCourseBinScalarRelationFilter, Prisma.PredefinedCourseBinWhereInput>;
}, "scaleId_predefinedBinId">;
export type ScaleBinOrderByWithAggregationInput = {
    scaleId?: Prisma.SortOrder;
    predefinedBinId?: Prisma.SortOrder;
    _count?: Prisma.ScaleBinCountOrderByAggregateInput;
    _max?: Prisma.ScaleBinMaxOrderByAggregateInput;
    _min?: Prisma.ScaleBinMinOrderByAggregateInput;
};
export type ScaleBinScalarWhereWithAggregatesInput = {
    AND?: Prisma.ScaleBinScalarWhereWithAggregatesInput | Prisma.ScaleBinScalarWhereWithAggregatesInput[];
    OR?: Prisma.ScaleBinScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ScaleBinScalarWhereWithAggregatesInput | Prisma.ScaleBinScalarWhereWithAggregatesInput[];
    scaleId?: Prisma.UuidWithAggregatesFilter<"ScaleBin"> | string;
    predefinedBinId?: Prisma.UuidWithAggregatesFilter<"ScaleBin"> | string;
};
export type ScaleBinCreateInput = {
    scale: Prisma.ScaleCreateNestedOneWithoutScaleBinsInput;
    predefinedCourseBin: Prisma.PredefinedCourseBinCreateNestedOneWithoutScaleBinsInput;
};
export type ScaleBinUncheckedCreateInput = {
    scaleId: string;
    predefinedBinId: string;
};
export type ScaleBinUpdateInput = {
    scale?: Prisma.ScaleUpdateOneRequiredWithoutScaleBinsNestedInput;
    predefinedCourseBin?: Prisma.PredefinedCourseBinUpdateOneRequiredWithoutScaleBinsNestedInput;
};
export type ScaleBinUncheckedUpdateInput = {
    scaleId?: Prisma.StringFieldUpdateOperationsInput | string;
    predefinedBinId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ScaleBinCreateManyInput = {
    scaleId: string;
    predefinedBinId: string;
};
export type ScaleBinUpdateManyMutationInput = {};
export type ScaleBinUncheckedUpdateManyInput = {
    scaleId?: Prisma.StringFieldUpdateOperationsInput | string;
    predefinedBinId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ScaleBinListRelationFilter = {
    every?: Prisma.ScaleBinWhereInput;
    some?: Prisma.ScaleBinWhereInput;
    none?: Prisma.ScaleBinWhereInput;
};
export type ScaleBinOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ScaleBinScaleIdPredefinedBinIdCompoundUniqueInput = {
    scaleId: string;
    predefinedBinId: string;
};
export type ScaleBinCountOrderByAggregateInput = {
    scaleId?: Prisma.SortOrder;
    predefinedBinId?: Prisma.SortOrder;
};
export type ScaleBinMaxOrderByAggregateInput = {
    scaleId?: Prisma.SortOrder;
    predefinedBinId?: Prisma.SortOrder;
};
export type ScaleBinMinOrderByAggregateInput = {
    scaleId?: Prisma.SortOrder;
    predefinedBinId?: Prisma.SortOrder;
};
export type ScaleBinCreateNestedManyWithoutScaleInput = {
    create?: Prisma.XOR<Prisma.ScaleBinCreateWithoutScaleInput, Prisma.ScaleBinUncheckedCreateWithoutScaleInput> | Prisma.ScaleBinCreateWithoutScaleInput[] | Prisma.ScaleBinUncheckedCreateWithoutScaleInput[];
    connectOrCreate?: Prisma.ScaleBinCreateOrConnectWithoutScaleInput | Prisma.ScaleBinCreateOrConnectWithoutScaleInput[];
    createMany?: Prisma.ScaleBinCreateManyScaleInputEnvelope;
    connect?: Prisma.ScaleBinWhereUniqueInput | Prisma.ScaleBinWhereUniqueInput[];
};
export type ScaleBinUncheckedCreateNestedManyWithoutScaleInput = {
    create?: Prisma.XOR<Prisma.ScaleBinCreateWithoutScaleInput, Prisma.ScaleBinUncheckedCreateWithoutScaleInput> | Prisma.ScaleBinCreateWithoutScaleInput[] | Prisma.ScaleBinUncheckedCreateWithoutScaleInput[];
    connectOrCreate?: Prisma.ScaleBinCreateOrConnectWithoutScaleInput | Prisma.ScaleBinCreateOrConnectWithoutScaleInput[];
    createMany?: Prisma.ScaleBinCreateManyScaleInputEnvelope;
    connect?: Prisma.ScaleBinWhereUniqueInput | Prisma.ScaleBinWhereUniqueInput[];
};
export type ScaleBinUpdateManyWithoutScaleNestedInput = {
    create?: Prisma.XOR<Prisma.ScaleBinCreateWithoutScaleInput, Prisma.ScaleBinUncheckedCreateWithoutScaleInput> | Prisma.ScaleBinCreateWithoutScaleInput[] | Prisma.ScaleBinUncheckedCreateWithoutScaleInput[];
    connectOrCreate?: Prisma.ScaleBinCreateOrConnectWithoutScaleInput | Prisma.ScaleBinCreateOrConnectWithoutScaleInput[];
    upsert?: Prisma.ScaleBinUpsertWithWhereUniqueWithoutScaleInput | Prisma.ScaleBinUpsertWithWhereUniqueWithoutScaleInput[];
    createMany?: Prisma.ScaleBinCreateManyScaleInputEnvelope;
    set?: Prisma.ScaleBinWhereUniqueInput | Prisma.ScaleBinWhereUniqueInput[];
    disconnect?: Prisma.ScaleBinWhereUniqueInput | Prisma.ScaleBinWhereUniqueInput[];
    delete?: Prisma.ScaleBinWhereUniqueInput | Prisma.ScaleBinWhereUniqueInput[];
    connect?: Prisma.ScaleBinWhereUniqueInput | Prisma.ScaleBinWhereUniqueInput[];
    update?: Prisma.ScaleBinUpdateWithWhereUniqueWithoutScaleInput | Prisma.ScaleBinUpdateWithWhereUniqueWithoutScaleInput[];
    updateMany?: Prisma.ScaleBinUpdateManyWithWhereWithoutScaleInput | Prisma.ScaleBinUpdateManyWithWhereWithoutScaleInput[];
    deleteMany?: Prisma.ScaleBinScalarWhereInput | Prisma.ScaleBinScalarWhereInput[];
};
export type ScaleBinUncheckedUpdateManyWithoutScaleNestedInput = {
    create?: Prisma.XOR<Prisma.ScaleBinCreateWithoutScaleInput, Prisma.ScaleBinUncheckedCreateWithoutScaleInput> | Prisma.ScaleBinCreateWithoutScaleInput[] | Prisma.ScaleBinUncheckedCreateWithoutScaleInput[];
    connectOrCreate?: Prisma.ScaleBinCreateOrConnectWithoutScaleInput | Prisma.ScaleBinCreateOrConnectWithoutScaleInput[];
    upsert?: Prisma.ScaleBinUpsertWithWhereUniqueWithoutScaleInput | Prisma.ScaleBinUpsertWithWhereUniqueWithoutScaleInput[];
    createMany?: Prisma.ScaleBinCreateManyScaleInputEnvelope;
    set?: Prisma.ScaleBinWhereUniqueInput | Prisma.ScaleBinWhereUniqueInput[];
    disconnect?: Prisma.ScaleBinWhereUniqueInput | Prisma.ScaleBinWhereUniqueInput[];
    delete?: Prisma.ScaleBinWhereUniqueInput | Prisma.ScaleBinWhereUniqueInput[];
    connect?: Prisma.ScaleBinWhereUniqueInput | Prisma.ScaleBinWhereUniqueInput[];
    update?: Prisma.ScaleBinUpdateWithWhereUniqueWithoutScaleInput | Prisma.ScaleBinUpdateWithWhereUniqueWithoutScaleInput[];
    updateMany?: Prisma.ScaleBinUpdateManyWithWhereWithoutScaleInput | Prisma.ScaleBinUpdateManyWithWhereWithoutScaleInput[];
    deleteMany?: Prisma.ScaleBinScalarWhereInput | Prisma.ScaleBinScalarWhereInput[];
};
export type ScaleBinCreateNestedManyWithoutPredefinedCourseBinInput = {
    create?: Prisma.XOR<Prisma.ScaleBinCreateWithoutPredefinedCourseBinInput, Prisma.ScaleBinUncheckedCreateWithoutPredefinedCourseBinInput> | Prisma.ScaleBinCreateWithoutPredefinedCourseBinInput[] | Prisma.ScaleBinUncheckedCreateWithoutPredefinedCourseBinInput[];
    connectOrCreate?: Prisma.ScaleBinCreateOrConnectWithoutPredefinedCourseBinInput | Prisma.ScaleBinCreateOrConnectWithoutPredefinedCourseBinInput[];
    createMany?: Prisma.ScaleBinCreateManyPredefinedCourseBinInputEnvelope;
    connect?: Prisma.ScaleBinWhereUniqueInput | Prisma.ScaleBinWhereUniqueInput[];
};
export type ScaleBinUncheckedCreateNestedManyWithoutPredefinedCourseBinInput = {
    create?: Prisma.XOR<Prisma.ScaleBinCreateWithoutPredefinedCourseBinInput, Prisma.ScaleBinUncheckedCreateWithoutPredefinedCourseBinInput> | Prisma.ScaleBinCreateWithoutPredefinedCourseBinInput[] | Prisma.ScaleBinUncheckedCreateWithoutPredefinedCourseBinInput[];
    connectOrCreate?: Prisma.ScaleBinCreateOrConnectWithoutPredefinedCourseBinInput | Prisma.ScaleBinCreateOrConnectWithoutPredefinedCourseBinInput[];
    createMany?: Prisma.ScaleBinCreateManyPredefinedCourseBinInputEnvelope;
    connect?: Prisma.ScaleBinWhereUniqueInput | Prisma.ScaleBinWhereUniqueInput[];
};
export type ScaleBinUpdateManyWithoutPredefinedCourseBinNestedInput = {
    create?: Prisma.XOR<Prisma.ScaleBinCreateWithoutPredefinedCourseBinInput, Prisma.ScaleBinUncheckedCreateWithoutPredefinedCourseBinInput> | Prisma.ScaleBinCreateWithoutPredefinedCourseBinInput[] | Prisma.ScaleBinUncheckedCreateWithoutPredefinedCourseBinInput[];
    connectOrCreate?: Prisma.ScaleBinCreateOrConnectWithoutPredefinedCourseBinInput | Prisma.ScaleBinCreateOrConnectWithoutPredefinedCourseBinInput[];
    upsert?: Prisma.ScaleBinUpsertWithWhereUniqueWithoutPredefinedCourseBinInput | Prisma.ScaleBinUpsertWithWhereUniqueWithoutPredefinedCourseBinInput[];
    createMany?: Prisma.ScaleBinCreateManyPredefinedCourseBinInputEnvelope;
    set?: Prisma.ScaleBinWhereUniqueInput | Prisma.ScaleBinWhereUniqueInput[];
    disconnect?: Prisma.ScaleBinWhereUniqueInput | Prisma.ScaleBinWhereUniqueInput[];
    delete?: Prisma.ScaleBinWhereUniqueInput | Prisma.ScaleBinWhereUniqueInput[];
    connect?: Prisma.ScaleBinWhereUniqueInput | Prisma.ScaleBinWhereUniqueInput[];
    update?: Prisma.ScaleBinUpdateWithWhereUniqueWithoutPredefinedCourseBinInput | Prisma.ScaleBinUpdateWithWhereUniqueWithoutPredefinedCourseBinInput[];
    updateMany?: Prisma.ScaleBinUpdateManyWithWhereWithoutPredefinedCourseBinInput | Prisma.ScaleBinUpdateManyWithWhereWithoutPredefinedCourseBinInput[];
    deleteMany?: Prisma.ScaleBinScalarWhereInput | Prisma.ScaleBinScalarWhereInput[];
};
export type ScaleBinUncheckedUpdateManyWithoutPredefinedCourseBinNestedInput = {
    create?: Prisma.XOR<Prisma.ScaleBinCreateWithoutPredefinedCourseBinInput, Prisma.ScaleBinUncheckedCreateWithoutPredefinedCourseBinInput> | Prisma.ScaleBinCreateWithoutPredefinedCourseBinInput[] | Prisma.ScaleBinUncheckedCreateWithoutPredefinedCourseBinInput[];
    connectOrCreate?: Prisma.ScaleBinCreateOrConnectWithoutPredefinedCourseBinInput | Prisma.ScaleBinCreateOrConnectWithoutPredefinedCourseBinInput[];
    upsert?: Prisma.ScaleBinUpsertWithWhereUniqueWithoutPredefinedCourseBinInput | Prisma.ScaleBinUpsertWithWhereUniqueWithoutPredefinedCourseBinInput[];
    createMany?: Prisma.ScaleBinCreateManyPredefinedCourseBinInputEnvelope;
    set?: Prisma.ScaleBinWhereUniqueInput | Prisma.ScaleBinWhereUniqueInput[];
    disconnect?: Prisma.ScaleBinWhereUniqueInput | Prisma.ScaleBinWhereUniqueInput[];
    delete?: Prisma.ScaleBinWhereUniqueInput | Prisma.ScaleBinWhereUniqueInput[];
    connect?: Prisma.ScaleBinWhereUniqueInput | Prisma.ScaleBinWhereUniqueInput[];
    update?: Prisma.ScaleBinUpdateWithWhereUniqueWithoutPredefinedCourseBinInput | Prisma.ScaleBinUpdateWithWhereUniqueWithoutPredefinedCourseBinInput[];
    updateMany?: Prisma.ScaleBinUpdateManyWithWhereWithoutPredefinedCourseBinInput | Prisma.ScaleBinUpdateManyWithWhereWithoutPredefinedCourseBinInput[];
    deleteMany?: Prisma.ScaleBinScalarWhereInput | Prisma.ScaleBinScalarWhereInput[];
};
export type ScaleBinCreateWithoutScaleInput = {
    predefinedCourseBin: Prisma.PredefinedCourseBinCreateNestedOneWithoutScaleBinsInput;
};
export type ScaleBinUncheckedCreateWithoutScaleInput = {
    predefinedBinId: string;
};
export type ScaleBinCreateOrConnectWithoutScaleInput = {
    where: Prisma.ScaleBinWhereUniqueInput;
    create: Prisma.XOR<Prisma.ScaleBinCreateWithoutScaleInput, Prisma.ScaleBinUncheckedCreateWithoutScaleInput>;
};
export type ScaleBinCreateManyScaleInputEnvelope = {
    data: Prisma.ScaleBinCreateManyScaleInput | Prisma.ScaleBinCreateManyScaleInput[];
    skipDuplicates?: boolean;
};
export type ScaleBinUpsertWithWhereUniqueWithoutScaleInput = {
    where: Prisma.ScaleBinWhereUniqueInput;
    update: Prisma.XOR<Prisma.ScaleBinUpdateWithoutScaleInput, Prisma.ScaleBinUncheckedUpdateWithoutScaleInput>;
    create: Prisma.XOR<Prisma.ScaleBinCreateWithoutScaleInput, Prisma.ScaleBinUncheckedCreateWithoutScaleInput>;
};
export type ScaleBinUpdateWithWhereUniqueWithoutScaleInput = {
    where: Prisma.ScaleBinWhereUniqueInput;
    data: Prisma.XOR<Prisma.ScaleBinUpdateWithoutScaleInput, Prisma.ScaleBinUncheckedUpdateWithoutScaleInput>;
};
export type ScaleBinUpdateManyWithWhereWithoutScaleInput = {
    where: Prisma.ScaleBinScalarWhereInput;
    data: Prisma.XOR<Prisma.ScaleBinUpdateManyMutationInput, Prisma.ScaleBinUncheckedUpdateManyWithoutScaleInput>;
};
export type ScaleBinScalarWhereInput = {
    AND?: Prisma.ScaleBinScalarWhereInput | Prisma.ScaleBinScalarWhereInput[];
    OR?: Prisma.ScaleBinScalarWhereInput[];
    NOT?: Prisma.ScaleBinScalarWhereInput | Prisma.ScaleBinScalarWhereInput[];
    scaleId?: Prisma.UuidFilter<"ScaleBin"> | string;
    predefinedBinId?: Prisma.UuidFilter<"ScaleBin"> | string;
};
export type ScaleBinCreateWithoutPredefinedCourseBinInput = {
    scale: Prisma.ScaleCreateNestedOneWithoutScaleBinsInput;
};
export type ScaleBinUncheckedCreateWithoutPredefinedCourseBinInput = {
    scaleId: string;
};
export type ScaleBinCreateOrConnectWithoutPredefinedCourseBinInput = {
    where: Prisma.ScaleBinWhereUniqueInput;
    create: Prisma.XOR<Prisma.ScaleBinCreateWithoutPredefinedCourseBinInput, Prisma.ScaleBinUncheckedCreateWithoutPredefinedCourseBinInput>;
};
export type ScaleBinCreateManyPredefinedCourseBinInputEnvelope = {
    data: Prisma.ScaleBinCreateManyPredefinedCourseBinInput | Prisma.ScaleBinCreateManyPredefinedCourseBinInput[];
    skipDuplicates?: boolean;
};
export type ScaleBinUpsertWithWhereUniqueWithoutPredefinedCourseBinInput = {
    where: Prisma.ScaleBinWhereUniqueInput;
    update: Prisma.XOR<Prisma.ScaleBinUpdateWithoutPredefinedCourseBinInput, Prisma.ScaleBinUncheckedUpdateWithoutPredefinedCourseBinInput>;
    create: Prisma.XOR<Prisma.ScaleBinCreateWithoutPredefinedCourseBinInput, Prisma.ScaleBinUncheckedCreateWithoutPredefinedCourseBinInput>;
};
export type ScaleBinUpdateWithWhereUniqueWithoutPredefinedCourseBinInput = {
    where: Prisma.ScaleBinWhereUniqueInput;
    data: Prisma.XOR<Prisma.ScaleBinUpdateWithoutPredefinedCourseBinInput, Prisma.ScaleBinUncheckedUpdateWithoutPredefinedCourseBinInput>;
};
export type ScaleBinUpdateManyWithWhereWithoutPredefinedCourseBinInput = {
    where: Prisma.ScaleBinScalarWhereInput;
    data: Prisma.XOR<Prisma.ScaleBinUpdateManyMutationInput, Prisma.ScaleBinUncheckedUpdateManyWithoutPredefinedCourseBinInput>;
};
export type ScaleBinCreateManyScaleInput = {
    predefinedBinId: string;
};
export type ScaleBinUpdateWithoutScaleInput = {
    predefinedCourseBin?: Prisma.PredefinedCourseBinUpdateOneRequiredWithoutScaleBinsNestedInput;
};
export type ScaleBinUncheckedUpdateWithoutScaleInput = {
    predefinedBinId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ScaleBinUncheckedUpdateManyWithoutScaleInput = {
    predefinedBinId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ScaleBinCreateManyPredefinedCourseBinInput = {
    scaleId: string;
};
export type ScaleBinUpdateWithoutPredefinedCourseBinInput = {
    scale?: Prisma.ScaleUpdateOneRequiredWithoutScaleBinsNestedInput;
};
export type ScaleBinUncheckedUpdateWithoutPredefinedCourseBinInput = {
    scaleId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ScaleBinUncheckedUpdateManyWithoutPredefinedCourseBinInput = {
    scaleId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ScaleBinSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    scaleId?: boolean;
    predefinedBinId?: boolean;
    scale?: boolean | Prisma.ScaleDefaultArgs<ExtArgs>;
    predefinedCourseBin?: boolean | Prisma.PredefinedCourseBinDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["scaleBin"]>;
export type ScaleBinSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    scaleId?: boolean;
    predefinedBinId?: boolean;
    scale?: boolean | Prisma.ScaleDefaultArgs<ExtArgs>;
    predefinedCourseBin?: boolean | Prisma.PredefinedCourseBinDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["scaleBin"]>;
export type ScaleBinSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    scaleId?: boolean;
    predefinedBinId?: boolean;
    scale?: boolean | Prisma.ScaleDefaultArgs<ExtArgs>;
    predefinedCourseBin?: boolean | Prisma.PredefinedCourseBinDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["scaleBin"]>;
export type ScaleBinSelectScalar = {
    scaleId?: boolean;
    predefinedBinId?: boolean;
};
export type ScaleBinOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"scaleId" | "predefinedBinId", ExtArgs["result"]["scaleBin"]>;
export type ScaleBinInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    scale?: boolean | Prisma.ScaleDefaultArgs<ExtArgs>;
    predefinedCourseBin?: boolean | Prisma.PredefinedCourseBinDefaultArgs<ExtArgs>;
};
export type ScaleBinIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    scale?: boolean | Prisma.ScaleDefaultArgs<ExtArgs>;
    predefinedCourseBin?: boolean | Prisma.PredefinedCourseBinDefaultArgs<ExtArgs>;
};
export type ScaleBinIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    scale?: boolean | Prisma.ScaleDefaultArgs<ExtArgs>;
    predefinedCourseBin?: boolean | Prisma.PredefinedCourseBinDefaultArgs<ExtArgs>;
};
export type $ScaleBinPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ScaleBin";
    objects: {
        scale: Prisma.$ScalePayload<ExtArgs>;
        predefinedCourseBin: Prisma.$PredefinedCourseBinPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        scaleId: string;
        predefinedBinId: string;
    }, ExtArgs["result"]["scaleBin"]>;
    composites: {};
};
export type ScaleBinGetPayload<S extends boolean | null | undefined | ScaleBinDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ScaleBinPayload, S>;
export type ScaleBinCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ScaleBinFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ScaleBinCountAggregateInputType | true;
};
export interface ScaleBinDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ScaleBin'];
        meta: {
            name: 'ScaleBin';
        };
    };
    /**
     * Find zero or one ScaleBin that matches the filter.
     * @param {ScaleBinFindUniqueArgs} args - Arguments to find a ScaleBin
     * @example
     * // Get one ScaleBin
     * const scaleBin = await prisma.scaleBin.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ScaleBinFindUniqueArgs>(args: Prisma.SelectSubset<T, ScaleBinFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ScaleBinClient<runtime.Types.Result.GetResult<Prisma.$ScaleBinPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one ScaleBin that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ScaleBinFindUniqueOrThrowArgs} args - Arguments to find a ScaleBin
     * @example
     * // Get one ScaleBin
     * const scaleBin = await prisma.scaleBin.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ScaleBinFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ScaleBinFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ScaleBinClient<runtime.Types.Result.GetResult<Prisma.$ScaleBinPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first ScaleBin that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScaleBinFindFirstArgs} args - Arguments to find a ScaleBin
     * @example
     * // Get one ScaleBin
     * const scaleBin = await prisma.scaleBin.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ScaleBinFindFirstArgs>(args?: Prisma.SelectSubset<T, ScaleBinFindFirstArgs<ExtArgs>>): Prisma.Prisma__ScaleBinClient<runtime.Types.Result.GetResult<Prisma.$ScaleBinPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first ScaleBin that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScaleBinFindFirstOrThrowArgs} args - Arguments to find a ScaleBin
     * @example
     * // Get one ScaleBin
     * const scaleBin = await prisma.scaleBin.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ScaleBinFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ScaleBinFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ScaleBinClient<runtime.Types.Result.GetResult<Prisma.$ScaleBinPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more ScaleBins that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScaleBinFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ScaleBins
     * const scaleBins = await prisma.scaleBin.findMany()
     *
     * // Get first 10 ScaleBins
     * const scaleBins = await prisma.scaleBin.findMany({ take: 10 })
     *
     * // Only select the `scaleId`
     * const scaleBinWithScaleIdOnly = await prisma.scaleBin.findMany({ select: { scaleId: true } })
     *
     */
    findMany<T extends ScaleBinFindManyArgs>(args?: Prisma.SelectSubset<T, ScaleBinFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ScaleBinPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a ScaleBin.
     * @param {ScaleBinCreateArgs} args - Arguments to create a ScaleBin.
     * @example
     * // Create one ScaleBin
     * const ScaleBin = await prisma.scaleBin.create({
     *   data: {
     *     // ... data to create a ScaleBin
     *   }
     * })
     *
     */
    create<T extends ScaleBinCreateArgs>(args: Prisma.SelectSubset<T, ScaleBinCreateArgs<ExtArgs>>): Prisma.Prisma__ScaleBinClient<runtime.Types.Result.GetResult<Prisma.$ScaleBinPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many ScaleBins.
     * @param {ScaleBinCreateManyArgs} args - Arguments to create many ScaleBins.
     * @example
     * // Create many ScaleBins
     * const scaleBin = await prisma.scaleBin.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends ScaleBinCreateManyArgs>(args?: Prisma.SelectSubset<T, ScaleBinCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many ScaleBins and returns the data saved in the database.
     * @param {ScaleBinCreateManyAndReturnArgs} args - Arguments to create many ScaleBins.
     * @example
     * // Create many ScaleBins
     * const scaleBin = await prisma.scaleBin.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many ScaleBins and only return the `scaleId`
     * const scaleBinWithScaleIdOnly = await prisma.scaleBin.createManyAndReturn({
     *   select: { scaleId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends ScaleBinCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ScaleBinCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ScaleBinPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a ScaleBin.
     * @param {ScaleBinDeleteArgs} args - Arguments to delete one ScaleBin.
     * @example
     * // Delete one ScaleBin
     * const ScaleBin = await prisma.scaleBin.delete({
     *   where: {
     *     // ... filter to delete one ScaleBin
     *   }
     * })
     *
     */
    delete<T extends ScaleBinDeleteArgs>(args: Prisma.SelectSubset<T, ScaleBinDeleteArgs<ExtArgs>>): Prisma.Prisma__ScaleBinClient<runtime.Types.Result.GetResult<Prisma.$ScaleBinPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one ScaleBin.
     * @param {ScaleBinUpdateArgs} args - Arguments to update one ScaleBin.
     * @example
     * // Update one ScaleBin
     * const scaleBin = await prisma.scaleBin.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends ScaleBinUpdateArgs>(args: Prisma.SelectSubset<T, ScaleBinUpdateArgs<ExtArgs>>): Prisma.Prisma__ScaleBinClient<runtime.Types.Result.GetResult<Prisma.$ScaleBinPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more ScaleBins.
     * @param {ScaleBinDeleteManyArgs} args - Arguments to filter ScaleBins to delete.
     * @example
     * // Delete a few ScaleBins
     * const { count } = await prisma.scaleBin.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends ScaleBinDeleteManyArgs>(args?: Prisma.SelectSubset<T, ScaleBinDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more ScaleBins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScaleBinUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ScaleBins
     * const scaleBin = await prisma.scaleBin.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends ScaleBinUpdateManyArgs>(args: Prisma.SelectSubset<T, ScaleBinUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more ScaleBins and returns the data updated in the database.
     * @param {ScaleBinUpdateManyAndReturnArgs} args - Arguments to update many ScaleBins.
     * @example
     * // Update many ScaleBins
     * const scaleBin = await prisma.scaleBin.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more ScaleBins and only return the `scaleId`
     * const scaleBinWithScaleIdOnly = await prisma.scaleBin.updateManyAndReturn({
     *   select: { scaleId: true },
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
    updateManyAndReturn<T extends ScaleBinUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ScaleBinUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ScaleBinPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one ScaleBin.
     * @param {ScaleBinUpsertArgs} args - Arguments to update or create a ScaleBin.
     * @example
     * // Update or create a ScaleBin
     * const scaleBin = await prisma.scaleBin.upsert({
     *   create: {
     *     // ... data to create a ScaleBin
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ScaleBin we want to update
     *   }
     * })
     */
    upsert<T extends ScaleBinUpsertArgs>(args: Prisma.SelectSubset<T, ScaleBinUpsertArgs<ExtArgs>>): Prisma.Prisma__ScaleBinClient<runtime.Types.Result.GetResult<Prisma.$ScaleBinPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of ScaleBins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScaleBinCountArgs} args - Arguments to filter ScaleBins to count.
     * @example
     * // Count the number of ScaleBins
     * const count = await prisma.scaleBin.count({
     *   where: {
     *     // ... the filter for the ScaleBins we want to count
     *   }
     * })
    **/
    count<T extends ScaleBinCountArgs>(args?: Prisma.Subset<T, ScaleBinCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ScaleBinCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a ScaleBin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScaleBinAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ScaleBinAggregateArgs>(args: Prisma.Subset<T, ScaleBinAggregateArgs>): Prisma.PrismaPromise<GetScaleBinAggregateType<T>>;
    /**
     * Group by ScaleBin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScaleBinGroupByArgs} args - Group by arguments.
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
    groupBy<T extends ScaleBinGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ScaleBinGroupByArgs['orderBy'];
    } : {
        orderBy?: ScaleBinGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ScaleBinGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetScaleBinGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the ScaleBin model
     */
    readonly fields: ScaleBinFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for ScaleBin.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__ScaleBinClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    scale<T extends Prisma.ScaleDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ScaleDefaultArgs<ExtArgs>>): Prisma.Prisma__ScaleClient<runtime.Types.Result.GetResult<Prisma.$ScalePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    predefinedCourseBin<T extends Prisma.PredefinedCourseBinDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.PredefinedCourseBinDefaultArgs<ExtArgs>>): Prisma.Prisma__PredefinedCourseBinClient<runtime.Types.Result.GetResult<Prisma.$PredefinedCourseBinPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the ScaleBin model
 */
export interface ScaleBinFieldRefs {
    readonly scaleId: Prisma.FieldRef<"ScaleBin", 'String'>;
    readonly predefinedBinId: Prisma.FieldRef<"ScaleBin", 'String'>;
}
/**
 * ScaleBin findUnique
 */
export type ScaleBinFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which ScaleBin to fetch.
     */
    where: Prisma.ScaleBinWhereUniqueInput;
};
/**
 * ScaleBin findUniqueOrThrow
 */
export type ScaleBinFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which ScaleBin to fetch.
     */
    where: Prisma.ScaleBinWhereUniqueInput;
};
/**
 * ScaleBin findFirst
 */
export type ScaleBinFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which ScaleBin to fetch.
     */
    where?: Prisma.ScaleBinWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ScaleBins to fetch.
     */
    orderBy?: Prisma.ScaleBinOrderByWithRelationInput | Prisma.ScaleBinOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ScaleBins.
     */
    cursor?: Prisma.ScaleBinWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ScaleBins from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ScaleBins.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ScaleBins.
     */
    distinct?: Prisma.ScaleBinScalarFieldEnum | Prisma.ScaleBinScalarFieldEnum[];
};
/**
 * ScaleBin findFirstOrThrow
 */
export type ScaleBinFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which ScaleBin to fetch.
     */
    where?: Prisma.ScaleBinWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ScaleBins to fetch.
     */
    orderBy?: Prisma.ScaleBinOrderByWithRelationInput | Prisma.ScaleBinOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ScaleBins.
     */
    cursor?: Prisma.ScaleBinWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ScaleBins from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ScaleBins.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ScaleBins.
     */
    distinct?: Prisma.ScaleBinScalarFieldEnum | Prisma.ScaleBinScalarFieldEnum[];
};
/**
 * ScaleBin findMany
 */
export type ScaleBinFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which ScaleBins to fetch.
     */
    where?: Prisma.ScaleBinWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ScaleBins to fetch.
     */
    orderBy?: Prisma.ScaleBinOrderByWithRelationInput | Prisma.ScaleBinOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing ScaleBins.
     */
    cursor?: Prisma.ScaleBinWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ScaleBins from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ScaleBins.
     */
    skip?: number;
    distinct?: Prisma.ScaleBinScalarFieldEnum | Prisma.ScaleBinScalarFieldEnum[];
};
/**
 * ScaleBin create
 */
export type ScaleBinCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to create a ScaleBin.
     */
    data: Prisma.XOR<Prisma.ScaleBinCreateInput, Prisma.ScaleBinUncheckedCreateInput>;
};
/**
 * ScaleBin createMany
 */
export type ScaleBinCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many ScaleBins.
     */
    data: Prisma.ScaleBinCreateManyInput | Prisma.ScaleBinCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * ScaleBin createManyAndReturn
 */
export type ScaleBinCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScaleBin
     */
    select?: Prisma.ScaleBinSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the ScaleBin
     */
    omit?: Prisma.ScaleBinOmit<ExtArgs> | null;
    /**
     * The data used to create many ScaleBins.
     */
    data: Prisma.ScaleBinCreateManyInput | Prisma.ScaleBinCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ScaleBinIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * ScaleBin update
 */
export type ScaleBinUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to update a ScaleBin.
     */
    data: Prisma.XOR<Prisma.ScaleBinUpdateInput, Prisma.ScaleBinUncheckedUpdateInput>;
    /**
     * Choose, which ScaleBin to update.
     */
    where: Prisma.ScaleBinWhereUniqueInput;
};
/**
 * ScaleBin updateMany
 */
export type ScaleBinUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update ScaleBins.
     */
    data: Prisma.XOR<Prisma.ScaleBinUpdateManyMutationInput, Prisma.ScaleBinUncheckedUpdateManyInput>;
    /**
     * Filter which ScaleBins to update
     */
    where?: Prisma.ScaleBinWhereInput;
    /**
     * Limit how many ScaleBins to update.
     */
    limit?: number;
};
/**
 * ScaleBin updateManyAndReturn
 */
export type ScaleBinUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScaleBin
     */
    select?: Prisma.ScaleBinSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the ScaleBin
     */
    omit?: Prisma.ScaleBinOmit<ExtArgs> | null;
    /**
     * The data used to update ScaleBins.
     */
    data: Prisma.XOR<Prisma.ScaleBinUpdateManyMutationInput, Prisma.ScaleBinUncheckedUpdateManyInput>;
    /**
     * Filter which ScaleBins to update
     */
    where?: Prisma.ScaleBinWhereInput;
    /**
     * Limit how many ScaleBins to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ScaleBinIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * ScaleBin upsert
 */
export type ScaleBinUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The filter to search for the ScaleBin to update in case it exists.
     */
    where: Prisma.ScaleBinWhereUniqueInput;
    /**
     * In case the ScaleBin found by the `where` argument doesn't exist, create a new ScaleBin with this data.
     */
    create: Prisma.XOR<Prisma.ScaleBinCreateInput, Prisma.ScaleBinUncheckedCreateInput>;
    /**
     * In case the ScaleBin was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.ScaleBinUpdateInput, Prisma.ScaleBinUncheckedUpdateInput>;
};
/**
 * ScaleBin delete
 */
export type ScaleBinDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter which ScaleBin to delete.
     */
    where: Prisma.ScaleBinWhereUniqueInput;
};
/**
 * ScaleBin deleteMany
 */
export type ScaleBinDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which ScaleBins to delete
     */
    where?: Prisma.ScaleBinWhereInput;
    /**
     * Limit how many ScaleBins to delete.
     */
    limit?: number;
};
/**
 * ScaleBin without action
 */
export type ScaleBinDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
export {};
//# sourceMappingURL=ScaleBin.d.ts.map