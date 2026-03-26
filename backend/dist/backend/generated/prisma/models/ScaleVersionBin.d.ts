import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model ScaleVersionBin
 *
 */
export type ScaleVersionBinModel = runtime.Types.Result.DefaultSelection<Prisma.$ScaleVersionBinPayload>;
export type AggregateScaleVersionBin = {
    _count: ScaleVersionBinCountAggregateOutputType | null;
    _min: ScaleVersionBinMinAggregateOutputType | null;
    _max: ScaleVersionBinMaxAggregateOutputType | null;
};
export type ScaleVersionBinMinAggregateOutputType = {
    scaleVersionId: string | null;
    predefinedBinId: string | null;
};
export type ScaleVersionBinMaxAggregateOutputType = {
    scaleVersionId: string | null;
    predefinedBinId: string | null;
};
export type ScaleVersionBinCountAggregateOutputType = {
    scaleVersionId: number;
    predefinedBinId: number;
    _all: number;
};
export type ScaleVersionBinMinAggregateInputType = {
    scaleVersionId?: true;
    predefinedBinId?: true;
};
export type ScaleVersionBinMaxAggregateInputType = {
    scaleVersionId?: true;
    predefinedBinId?: true;
};
export type ScaleVersionBinCountAggregateInputType = {
    scaleVersionId?: true;
    predefinedBinId?: true;
    _all?: true;
};
export type ScaleVersionBinAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which ScaleVersionBin to aggregate.
     */
    where?: Prisma.ScaleVersionBinWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ScaleVersionBins to fetch.
     */
    orderBy?: Prisma.ScaleVersionBinOrderByWithRelationInput | Prisma.ScaleVersionBinOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.ScaleVersionBinWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ScaleVersionBins from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ScaleVersionBins.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned ScaleVersionBins
    **/
    _count?: true | ScaleVersionBinCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: ScaleVersionBinMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: ScaleVersionBinMaxAggregateInputType;
};
export type GetScaleVersionBinAggregateType<T extends ScaleVersionBinAggregateArgs> = {
    [P in keyof T & keyof AggregateScaleVersionBin]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateScaleVersionBin[P]> : Prisma.GetScalarType<T[P], AggregateScaleVersionBin[P]>;
};
export type ScaleVersionBinGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ScaleVersionBinWhereInput;
    orderBy?: Prisma.ScaleVersionBinOrderByWithAggregationInput | Prisma.ScaleVersionBinOrderByWithAggregationInput[];
    by: Prisma.ScaleVersionBinScalarFieldEnum[] | Prisma.ScaleVersionBinScalarFieldEnum;
    having?: Prisma.ScaleVersionBinScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ScaleVersionBinCountAggregateInputType | true;
    _min?: ScaleVersionBinMinAggregateInputType;
    _max?: ScaleVersionBinMaxAggregateInputType;
};
export type ScaleVersionBinGroupByOutputType = {
    scaleVersionId: string;
    predefinedBinId: string;
    _count: ScaleVersionBinCountAggregateOutputType | null;
    _min: ScaleVersionBinMinAggregateOutputType | null;
    _max: ScaleVersionBinMaxAggregateOutputType | null;
};
type GetScaleVersionBinGroupByPayload<T extends ScaleVersionBinGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ScaleVersionBinGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ScaleVersionBinGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ScaleVersionBinGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ScaleVersionBinGroupByOutputType[P]>;
}>>;
export type ScaleVersionBinWhereInput = {
    AND?: Prisma.ScaleVersionBinWhereInput | Prisma.ScaleVersionBinWhereInput[];
    OR?: Prisma.ScaleVersionBinWhereInput[];
    NOT?: Prisma.ScaleVersionBinWhereInput | Prisma.ScaleVersionBinWhereInput[];
    scaleVersionId?: Prisma.UuidFilter<"ScaleVersionBin"> | string;
    predefinedBinId?: Prisma.UuidFilter<"ScaleVersionBin"> | string;
    scaleVersion?: Prisma.XOR<Prisma.ScaleVersionScalarRelationFilter, Prisma.ScaleVersionWhereInput>;
    predefinedCourseBin?: Prisma.XOR<Prisma.PredefinedCourseBinScalarRelationFilter, Prisma.PredefinedCourseBinWhereInput>;
};
export type ScaleVersionBinOrderByWithRelationInput = {
    scaleVersionId?: Prisma.SortOrder;
    predefinedBinId?: Prisma.SortOrder;
    scaleVersion?: Prisma.ScaleVersionOrderByWithRelationInput;
    predefinedCourseBin?: Prisma.PredefinedCourseBinOrderByWithRelationInput;
};
export type ScaleVersionBinWhereUniqueInput = Prisma.AtLeast<{
    scaleVersionId_predefinedBinId?: Prisma.ScaleVersionBinScaleVersionIdPredefinedBinIdCompoundUniqueInput;
    AND?: Prisma.ScaleVersionBinWhereInput | Prisma.ScaleVersionBinWhereInput[];
    OR?: Prisma.ScaleVersionBinWhereInput[];
    NOT?: Prisma.ScaleVersionBinWhereInput | Prisma.ScaleVersionBinWhereInput[];
    scaleVersionId?: Prisma.UuidFilter<"ScaleVersionBin"> | string;
    predefinedBinId?: Prisma.UuidFilter<"ScaleVersionBin"> | string;
    scaleVersion?: Prisma.XOR<Prisma.ScaleVersionScalarRelationFilter, Prisma.ScaleVersionWhereInput>;
    predefinedCourseBin?: Prisma.XOR<Prisma.PredefinedCourseBinScalarRelationFilter, Prisma.PredefinedCourseBinWhereInput>;
}, "scaleVersionId_predefinedBinId">;
export type ScaleVersionBinOrderByWithAggregationInput = {
    scaleVersionId?: Prisma.SortOrder;
    predefinedBinId?: Prisma.SortOrder;
    _count?: Prisma.ScaleVersionBinCountOrderByAggregateInput;
    _max?: Prisma.ScaleVersionBinMaxOrderByAggregateInput;
    _min?: Prisma.ScaleVersionBinMinOrderByAggregateInput;
};
export type ScaleVersionBinScalarWhereWithAggregatesInput = {
    AND?: Prisma.ScaleVersionBinScalarWhereWithAggregatesInput | Prisma.ScaleVersionBinScalarWhereWithAggregatesInput[];
    OR?: Prisma.ScaleVersionBinScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ScaleVersionBinScalarWhereWithAggregatesInput | Prisma.ScaleVersionBinScalarWhereWithAggregatesInput[];
    scaleVersionId?: Prisma.UuidWithAggregatesFilter<"ScaleVersionBin"> | string;
    predefinedBinId?: Prisma.UuidWithAggregatesFilter<"ScaleVersionBin"> | string;
};
export type ScaleVersionBinCreateInput = {
    scaleVersion: Prisma.ScaleVersionCreateNestedOneWithoutScaleVersionBinsInput;
    predefinedCourseBin: Prisma.PredefinedCourseBinCreateNestedOneWithoutScaleVersionBinsInput;
};
export type ScaleVersionBinUncheckedCreateInput = {
    scaleVersionId: string;
    predefinedBinId: string;
};
export type ScaleVersionBinUpdateInput = {
    scaleVersion?: Prisma.ScaleVersionUpdateOneRequiredWithoutScaleVersionBinsNestedInput;
    predefinedCourseBin?: Prisma.PredefinedCourseBinUpdateOneRequiredWithoutScaleVersionBinsNestedInput;
};
export type ScaleVersionBinUncheckedUpdateInput = {
    scaleVersionId?: Prisma.StringFieldUpdateOperationsInput | string;
    predefinedBinId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ScaleVersionBinCreateManyInput = {
    scaleVersionId: string;
    predefinedBinId: string;
};
export type ScaleVersionBinUpdateManyMutationInput = {};
export type ScaleVersionBinUncheckedUpdateManyInput = {
    scaleVersionId?: Prisma.StringFieldUpdateOperationsInput | string;
    predefinedBinId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ScaleVersionBinListRelationFilter = {
    every?: Prisma.ScaleVersionBinWhereInput;
    some?: Prisma.ScaleVersionBinWhereInput;
    none?: Prisma.ScaleVersionBinWhereInput;
};
export type ScaleVersionBinOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ScaleVersionBinScaleVersionIdPredefinedBinIdCompoundUniqueInput = {
    scaleVersionId: string;
    predefinedBinId: string;
};
export type ScaleVersionBinCountOrderByAggregateInput = {
    scaleVersionId?: Prisma.SortOrder;
    predefinedBinId?: Prisma.SortOrder;
};
export type ScaleVersionBinMaxOrderByAggregateInput = {
    scaleVersionId?: Prisma.SortOrder;
    predefinedBinId?: Prisma.SortOrder;
};
export type ScaleVersionBinMinOrderByAggregateInput = {
    scaleVersionId?: Prisma.SortOrder;
    predefinedBinId?: Prisma.SortOrder;
};
export type ScaleVersionBinCreateNestedManyWithoutScaleVersionInput = {
    create?: Prisma.XOR<Prisma.ScaleVersionBinCreateWithoutScaleVersionInput, Prisma.ScaleVersionBinUncheckedCreateWithoutScaleVersionInput> | Prisma.ScaleVersionBinCreateWithoutScaleVersionInput[] | Prisma.ScaleVersionBinUncheckedCreateWithoutScaleVersionInput[];
    connectOrCreate?: Prisma.ScaleVersionBinCreateOrConnectWithoutScaleVersionInput | Prisma.ScaleVersionBinCreateOrConnectWithoutScaleVersionInput[];
    createMany?: Prisma.ScaleVersionBinCreateManyScaleVersionInputEnvelope;
    connect?: Prisma.ScaleVersionBinWhereUniqueInput | Prisma.ScaleVersionBinWhereUniqueInput[];
};
export type ScaleVersionBinUncheckedCreateNestedManyWithoutScaleVersionInput = {
    create?: Prisma.XOR<Prisma.ScaleVersionBinCreateWithoutScaleVersionInput, Prisma.ScaleVersionBinUncheckedCreateWithoutScaleVersionInput> | Prisma.ScaleVersionBinCreateWithoutScaleVersionInput[] | Prisma.ScaleVersionBinUncheckedCreateWithoutScaleVersionInput[];
    connectOrCreate?: Prisma.ScaleVersionBinCreateOrConnectWithoutScaleVersionInput | Prisma.ScaleVersionBinCreateOrConnectWithoutScaleVersionInput[];
    createMany?: Prisma.ScaleVersionBinCreateManyScaleVersionInputEnvelope;
    connect?: Prisma.ScaleVersionBinWhereUniqueInput | Prisma.ScaleVersionBinWhereUniqueInput[];
};
export type ScaleVersionBinUpdateManyWithoutScaleVersionNestedInput = {
    create?: Prisma.XOR<Prisma.ScaleVersionBinCreateWithoutScaleVersionInput, Prisma.ScaleVersionBinUncheckedCreateWithoutScaleVersionInput> | Prisma.ScaleVersionBinCreateWithoutScaleVersionInput[] | Prisma.ScaleVersionBinUncheckedCreateWithoutScaleVersionInput[];
    connectOrCreate?: Prisma.ScaleVersionBinCreateOrConnectWithoutScaleVersionInput | Prisma.ScaleVersionBinCreateOrConnectWithoutScaleVersionInput[];
    upsert?: Prisma.ScaleVersionBinUpsertWithWhereUniqueWithoutScaleVersionInput | Prisma.ScaleVersionBinUpsertWithWhereUniqueWithoutScaleVersionInput[];
    createMany?: Prisma.ScaleVersionBinCreateManyScaleVersionInputEnvelope;
    set?: Prisma.ScaleVersionBinWhereUniqueInput | Prisma.ScaleVersionBinWhereUniqueInput[];
    disconnect?: Prisma.ScaleVersionBinWhereUniqueInput | Prisma.ScaleVersionBinWhereUniqueInput[];
    delete?: Prisma.ScaleVersionBinWhereUniqueInput | Prisma.ScaleVersionBinWhereUniqueInput[];
    connect?: Prisma.ScaleVersionBinWhereUniqueInput | Prisma.ScaleVersionBinWhereUniqueInput[];
    update?: Prisma.ScaleVersionBinUpdateWithWhereUniqueWithoutScaleVersionInput | Prisma.ScaleVersionBinUpdateWithWhereUniqueWithoutScaleVersionInput[];
    updateMany?: Prisma.ScaleVersionBinUpdateManyWithWhereWithoutScaleVersionInput | Prisma.ScaleVersionBinUpdateManyWithWhereWithoutScaleVersionInput[];
    deleteMany?: Prisma.ScaleVersionBinScalarWhereInput | Prisma.ScaleVersionBinScalarWhereInput[];
};
export type ScaleVersionBinUncheckedUpdateManyWithoutScaleVersionNestedInput = {
    create?: Prisma.XOR<Prisma.ScaleVersionBinCreateWithoutScaleVersionInput, Prisma.ScaleVersionBinUncheckedCreateWithoutScaleVersionInput> | Prisma.ScaleVersionBinCreateWithoutScaleVersionInput[] | Prisma.ScaleVersionBinUncheckedCreateWithoutScaleVersionInput[];
    connectOrCreate?: Prisma.ScaleVersionBinCreateOrConnectWithoutScaleVersionInput | Prisma.ScaleVersionBinCreateOrConnectWithoutScaleVersionInput[];
    upsert?: Prisma.ScaleVersionBinUpsertWithWhereUniqueWithoutScaleVersionInput | Prisma.ScaleVersionBinUpsertWithWhereUniqueWithoutScaleVersionInput[];
    createMany?: Prisma.ScaleVersionBinCreateManyScaleVersionInputEnvelope;
    set?: Prisma.ScaleVersionBinWhereUniqueInput | Prisma.ScaleVersionBinWhereUniqueInput[];
    disconnect?: Prisma.ScaleVersionBinWhereUniqueInput | Prisma.ScaleVersionBinWhereUniqueInput[];
    delete?: Prisma.ScaleVersionBinWhereUniqueInput | Prisma.ScaleVersionBinWhereUniqueInput[];
    connect?: Prisma.ScaleVersionBinWhereUniqueInput | Prisma.ScaleVersionBinWhereUniqueInput[];
    update?: Prisma.ScaleVersionBinUpdateWithWhereUniqueWithoutScaleVersionInput | Prisma.ScaleVersionBinUpdateWithWhereUniqueWithoutScaleVersionInput[];
    updateMany?: Prisma.ScaleVersionBinUpdateManyWithWhereWithoutScaleVersionInput | Prisma.ScaleVersionBinUpdateManyWithWhereWithoutScaleVersionInput[];
    deleteMany?: Prisma.ScaleVersionBinScalarWhereInput | Prisma.ScaleVersionBinScalarWhereInput[];
};
export type ScaleVersionBinCreateNestedManyWithoutPredefinedCourseBinInput = {
    create?: Prisma.XOR<Prisma.ScaleVersionBinCreateWithoutPredefinedCourseBinInput, Prisma.ScaleVersionBinUncheckedCreateWithoutPredefinedCourseBinInput> | Prisma.ScaleVersionBinCreateWithoutPredefinedCourseBinInput[] | Prisma.ScaleVersionBinUncheckedCreateWithoutPredefinedCourseBinInput[];
    connectOrCreate?: Prisma.ScaleVersionBinCreateOrConnectWithoutPredefinedCourseBinInput | Prisma.ScaleVersionBinCreateOrConnectWithoutPredefinedCourseBinInput[];
    createMany?: Prisma.ScaleVersionBinCreateManyPredefinedCourseBinInputEnvelope;
    connect?: Prisma.ScaleVersionBinWhereUniqueInput | Prisma.ScaleVersionBinWhereUniqueInput[];
};
export type ScaleVersionBinUncheckedCreateNestedManyWithoutPredefinedCourseBinInput = {
    create?: Prisma.XOR<Prisma.ScaleVersionBinCreateWithoutPredefinedCourseBinInput, Prisma.ScaleVersionBinUncheckedCreateWithoutPredefinedCourseBinInput> | Prisma.ScaleVersionBinCreateWithoutPredefinedCourseBinInput[] | Prisma.ScaleVersionBinUncheckedCreateWithoutPredefinedCourseBinInput[];
    connectOrCreate?: Prisma.ScaleVersionBinCreateOrConnectWithoutPredefinedCourseBinInput | Prisma.ScaleVersionBinCreateOrConnectWithoutPredefinedCourseBinInput[];
    createMany?: Prisma.ScaleVersionBinCreateManyPredefinedCourseBinInputEnvelope;
    connect?: Prisma.ScaleVersionBinWhereUniqueInput | Prisma.ScaleVersionBinWhereUniqueInput[];
};
export type ScaleVersionBinUpdateManyWithoutPredefinedCourseBinNestedInput = {
    create?: Prisma.XOR<Prisma.ScaleVersionBinCreateWithoutPredefinedCourseBinInput, Prisma.ScaleVersionBinUncheckedCreateWithoutPredefinedCourseBinInput> | Prisma.ScaleVersionBinCreateWithoutPredefinedCourseBinInput[] | Prisma.ScaleVersionBinUncheckedCreateWithoutPredefinedCourseBinInput[];
    connectOrCreate?: Prisma.ScaleVersionBinCreateOrConnectWithoutPredefinedCourseBinInput | Prisma.ScaleVersionBinCreateOrConnectWithoutPredefinedCourseBinInput[];
    upsert?: Prisma.ScaleVersionBinUpsertWithWhereUniqueWithoutPredefinedCourseBinInput | Prisma.ScaleVersionBinUpsertWithWhereUniqueWithoutPredefinedCourseBinInput[];
    createMany?: Prisma.ScaleVersionBinCreateManyPredefinedCourseBinInputEnvelope;
    set?: Prisma.ScaleVersionBinWhereUniqueInput | Prisma.ScaleVersionBinWhereUniqueInput[];
    disconnect?: Prisma.ScaleVersionBinWhereUniqueInput | Prisma.ScaleVersionBinWhereUniqueInput[];
    delete?: Prisma.ScaleVersionBinWhereUniqueInput | Prisma.ScaleVersionBinWhereUniqueInput[];
    connect?: Prisma.ScaleVersionBinWhereUniqueInput | Prisma.ScaleVersionBinWhereUniqueInput[];
    update?: Prisma.ScaleVersionBinUpdateWithWhereUniqueWithoutPredefinedCourseBinInput | Prisma.ScaleVersionBinUpdateWithWhereUniqueWithoutPredefinedCourseBinInput[];
    updateMany?: Prisma.ScaleVersionBinUpdateManyWithWhereWithoutPredefinedCourseBinInput | Prisma.ScaleVersionBinUpdateManyWithWhereWithoutPredefinedCourseBinInput[];
    deleteMany?: Prisma.ScaleVersionBinScalarWhereInput | Prisma.ScaleVersionBinScalarWhereInput[];
};
export type ScaleVersionBinUncheckedUpdateManyWithoutPredefinedCourseBinNestedInput = {
    create?: Prisma.XOR<Prisma.ScaleVersionBinCreateWithoutPredefinedCourseBinInput, Prisma.ScaleVersionBinUncheckedCreateWithoutPredefinedCourseBinInput> | Prisma.ScaleVersionBinCreateWithoutPredefinedCourseBinInput[] | Prisma.ScaleVersionBinUncheckedCreateWithoutPredefinedCourseBinInput[];
    connectOrCreate?: Prisma.ScaleVersionBinCreateOrConnectWithoutPredefinedCourseBinInput | Prisma.ScaleVersionBinCreateOrConnectWithoutPredefinedCourseBinInput[];
    upsert?: Prisma.ScaleVersionBinUpsertWithWhereUniqueWithoutPredefinedCourseBinInput | Prisma.ScaleVersionBinUpsertWithWhereUniqueWithoutPredefinedCourseBinInput[];
    createMany?: Prisma.ScaleVersionBinCreateManyPredefinedCourseBinInputEnvelope;
    set?: Prisma.ScaleVersionBinWhereUniqueInput | Prisma.ScaleVersionBinWhereUniqueInput[];
    disconnect?: Prisma.ScaleVersionBinWhereUniqueInput | Prisma.ScaleVersionBinWhereUniqueInput[];
    delete?: Prisma.ScaleVersionBinWhereUniqueInput | Prisma.ScaleVersionBinWhereUniqueInput[];
    connect?: Prisma.ScaleVersionBinWhereUniqueInput | Prisma.ScaleVersionBinWhereUniqueInput[];
    update?: Prisma.ScaleVersionBinUpdateWithWhereUniqueWithoutPredefinedCourseBinInput | Prisma.ScaleVersionBinUpdateWithWhereUniqueWithoutPredefinedCourseBinInput[];
    updateMany?: Prisma.ScaleVersionBinUpdateManyWithWhereWithoutPredefinedCourseBinInput | Prisma.ScaleVersionBinUpdateManyWithWhereWithoutPredefinedCourseBinInput[];
    deleteMany?: Prisma.ScaleVersionBinScalarWhereInput | Prisma.ScaleVersionBinScalarWhereInput[];
};
export type ScaleVersionBinCreateWithoutScaleVersionInput = {
    predefinedCourseBin: Prisma.PredefinedCourseBinCreateNestedOneWithoutScaleVersionBinsInput;
};
export type ScaleVersionBinUncheckedCreateWithoutScaleVersionInput = {
    predefinedBinId: string;
};
export type ScaleVersionBinCreateOrConnectWithoutScaleVersionInput = {
    where: Prisma.ScaleVersionBinWhereUniqueInput;
    create: Prisma.XOR<Prisma.ScaleVersionBinCreateWithoutScaleVersionInput, Prisma.ScaleVersionBinUncheckedCreateWithoutScaleVersionInput>;
};
export type ScaleVersionBinCreateManyScaleVersionInputEnvelope = {
    data: Prisma.ScaleVersionBinCreateManyScaleVersionInput | Prisma.ScaleVersionBinCreateManyScaleVersionInput[];
    skipDuplicates?: boolean;
};
export type ScaleVersionBinUpsertWithWhereUniqueWithoutScaleVersionInput = {
    where: Prisma.ScaleVersionBinWhereUniqueInput;
    update: Prisma.XOR<Prisma.ScaleVersionBinUpdateWithoutScaleVersionInput, Prisma.ScaleVersionBinUncheckedUpdateWithoutScaleVersionInput>;
    create: Prisma.XOR<Prisma.ScaleVersionBinCreateWithoutScaleVersionInput, Prisma.ScaleVersionBinUncheckedCreateWithoutScaleVersionInput>;
};
export type ScaleVersionBinUpdateWithWhereUniqueWithoutScaleVersionInput = {
    where: Prisma.ScaleVersionBinWhereUniqueInput;
    data: Prisma.XOR<Prisma.ScaleVersionBinUpdateWithoutScaleVersionInput, Prisma.ScaleVersionBinUncheckedUpdateWithoutScaleVersionInput>;
};
export type ScaleVersionBinUpdateManyWithWhereWithoutScaleVersionInput = {
    where: Prisma.ScaleVersionBinScalarWhereInput;
    data: Prisma.XOR<Prisma.ScaleVersionBinUpdateManyMutationInput, Prisma.ScaleVersionBinUncheckedUpdateManyWithoutScaleVersionInput>;
};
export type ScaleVersionBinScalarWhereInput = {
    AND?: Prisma.ScaleVersionBinScalarWhereInput | Prisma.ScaleVersionBinScalarWhereInput[];
    OR?: Prisma.ScaleVersionBinScalarWhereInput[];
    NOT?: Prisma.ScaleVersionBinScalarWhereInput | Prisma.ScaleVersionBinScalarWhereInput[];
    scaleVersionId?: Prisma.UuidFilter<"ScaleVersionBin"> | string;
    predefinedBinId?: Prisma.UuidFilter<"ScaleVersionBin"> | string;
};
export type ScaleVersionBinCreateWithoutPredefinedCourseBinInput = {
    scaleVersion: Prisma.ScaleVersionCreateNestedOneWithoutScaleVersionBinsInput;
};
export type ScaleVersionBinUncheckedCreateWithoutPredefinedCourseBinInput = {
    scaleVersionId: string;
};
export type ScaleVersionBinCreateOrConnectWithoutPredefinedCourseBinInput = {
    where: Prisma.ScaleVersionBinWhereUniqueInput;
    create: Prisma.XOR<Prisma.ScaleVersionBinCreateWithoutPredefinedCourseBinInput, Prisma.ScaleVersionBinUncheckedCreateWithoutPredefinedCourseBinInput>;
};
export type ScaleVersionBinCreateManyPredefinedCourseBinInputEnvelope = {
    data: Prisma.ScaleVersionBinCreateManyPredefinedCourseBinInput | Prisma.ScaleVersionBinCreateManyPredefinedCourseBinInput[];
    skipDuplicates?: boolean;
};
export type ScaleVersionBinUpsertWithWhereUniqueWithoutPredefinedCourseBinInput = {
    where: Prisma.ScaleVersionBinWhereUniqueInput;
    update: Prisma.XOR<Prisma.ScaleVersionBinUpdateWithoutPredefinedCourseBinInput, Prisma.ScaleVersionBinUncheckedUpdateWithoutPredefinedCourseBinInput>;
    create: Prisma.XOR<Prisma.ScaleVersionBinCreateWithoutPredefinedCourseBinInput, Prisma.ScaleVersionBinUncheckedCreateWithoutPredefinedCourseBinInput>;
};
export type ScaleVersionBinUpdateWithWhereUniqueWithoutPredefinedCourseBinInput = {
    where: Prisma.ScaleVersionBinWhereUniqueInput;
    data: Prisma.XOR<Prisma.ScaleVersionBinUpdateWithoutPredefinedCourseBinInput, Prisma.ScaleVersionBinUncheckedUpdateWithoutPredefinedCourseBinInput>;
};
export type ScaleVersionBinUpdateManyWithWhereWithoutPredefinedCourseBinInput = {
    where: Prisma.ScaleVersionBinScalarWhereInput;
    data: Prisma.XOR<Prisma.ScaleVersionBinUpdateManyMutationInput, Prisma.ScaleVersionBinUncheckedUpdateManyWithoutPredefinedCourseBinInput>;
};
export type ScaleVersionBinCreateManyScaleVersionInput = {
    predefinedBinId: string;
};
export type ScaleVersionBinUpdateWithoutScaleVersionInput = {
    predefinedCourseBin?: Prisma.PredefinedCourseBinUpdateOneRequiredWithoutScaleVersionBinsNestedInput;
};
export type ScaleVersionBinUncheckedUpdateWithoutScaleVersionInput = {
    predefinedBinId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ScaleVersionBinUncheckedUpdateManyWithoutScaleVersionInput = {
    predefinedBinId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ScaleVersionBinCreateManyPredefinedCourseBinInput = {
    scaleVersionId: string;
};
export type ScaleVersionBinUpdateWithoutPredefinedCourseBinInput = {
    scaleVersion?: Prisma.ScaleVersionUpdateOneRequiredWithoutScaleVersionBinsNestedInput;
};
export type ScaleVersionBinUncheckedUpdateWithoutPredefinedCourseBinInput = {
    scaleVersionId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ScaleVersionBinUncheckedUpdateManyWithoutPredefinedCourseBinInput = {
    scaleVersionId?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type ScaleVersionBinSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    scaleVersionId?: boolean;
    predefinedBinId?: boolean;
    scaleVersion?: boolean | Prisma.ScaleVersionDefaultArgs<ExtArgs>;
    predefinedCourseBin?: boolean | Prisma.PredefinedCourseBinDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["scaleVersionBin"]>;
export type ScaleVersionBinSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    scaleVersionId?: boolean;
    predefinedBinId?: boolean;
    scaleVersion?: boolean | Prisma.ScaleVersionDefaultArgs<ExtArgs>;
    predefinedCourseBin?: boolean | Prisma.PredefinedCourseBinDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["scaleVersionBin"]>;
export type ScaleVersionBinSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    scaleVersionId?: boolean;
    predefinedBinId?: boolean;
    scaleVersion?: boolean | Prisma.ScaleVersionDefaultArgs<ExtArgs>;
    predefinedCourseBin?: boolean | Prisma.PredefinedCourseBinDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["scaleVersionBin"]>;
export type ScaleVersionBinSelectScalar = {
    scaleVersionId?: boolean;
    predefinedBinId?: boolean;
};
export type ScaleVersionBinOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"scaleVersionId" | "predefinedBinId", ExtArgs["result"]["scaleVersionBin"]>;
export type ScaleVersionBinInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    scaleVersion?: boolean | Prisma.ScaleVersionDefaultArgs<ExtArgs>;
    predefinedCourseBin?: boolean | Prisma.PredefinedCourseBinDefaultArgs<ExtArgs>;
};
export type ScaleVersionBinIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    scaleVersion?: boolean | Prisma.ScaleVersionDefaultArgs<ExtArgs>;
    predefinedCourseBin?: boolean | Prisma.PredefinedCourseBinDefaultArgs<ExtArgs>;
};
export type ScaleVersionBinIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    scaleVersion?: boolean | Prisma.ScaleVersionDefaultArgs<ExtArgs>;
    predefinedCourseBin?: boolean | Prisma.PredefinedCourseBinDefaultArgs<ExtArgs>;
};
export type $ScaleVersionBinPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ScaleVersionBin";
    objects: {
        scaleVersion: Prisma.$ScaleVersionPayload<ExtArgs>;
        predefinedCourseBin: Prisma.$PredefinedCourseBinPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        scaleVersionId: string;
        predefinedBinId: string;
    }, ExtArgs["result"]["scaleVersionBin"]>;
    composites: {};
};
export type ScaleVersionBinGetPayload<S extends boolean | null | undefined | ScaleVersionBinDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ScaleVersionBinPayload, S>;
export type ScaleVersionBinCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ScaleVersionBinFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ScaleVersionBinCountAggregateInputType | true;
};
export interface ScaleVersionBinDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ScaleVersionBin'];
        meta: {
            name: 'ScaleVersionBin';
        };
    };
    /**
     * Find zero or one ScaleVersionBin that matches the filter.
     * @param {ScaleVersionBinFindUniqueArgs} args - Arguments to find a ScaleVersionBin
     * @example
     * // Get one ScaleVersionBin
     * const scaleVersionBin = await prisma.scaleVersionBin.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ScaleVersionBinFindUniqueArgs>(args: Prisma.SelectSubset<T, ScaleVersionBinFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ScaleVersionBinClient<runtime.Types.Result.GetResult<Prisma.$ScaleVersionBinPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one ScaleVersionBin that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ScaleVersionBinFindUniqueOrThrowArgs} args - Arguments to find a ScaleVersionBin
     * @example
     * // Get one ScaleVersionBin
     * const scaleVersionBin = await prisma.scaleVersionBin.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ScaleVersionBinFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ScaleVersionBinFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ScaleVersionBinClient<runtime.Types.Result.GetResult<Prisma.$ScaleVersionBinPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first ScaleVersionBin that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScaleVersionBinFindFirstArgs} args - Arguments to find a ScaleVersionBin
     * @example
     * // Get one ScaleVersionBin
     * const scaleVersionBin = await prisma.scaleVersionBin.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ScaleVersionBinFindFirstArgs>(args?: Prisma.SelectSubset<T, ScaleVersionBinFindFirstArgs<ExtArgs>>): Prisma.Prisma__ScaleVersionBinClient<runtime.Types.Result.GetResult<Prisma.$ScaleVersionBinPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first ScaleVersionBin that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScaleVersionBinFindFirstOrThrowArgs} args - Arguments to find a ScaleVersionBin
     * @example
     * // Get one ScaleVersionBin
     * const scaleVersionBin = await prisma.scaleVersionBin.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ScaleVersionBinFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ScaleVersionBinFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ScaleVersionBinClient<runtime.Types.Result.GetResult<Prisma.$ScaleVersionBinPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more ScaleVersionBins that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScaleVersionBinFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ScaleVersionBins
     * const scaleVersionBins = await prisma.scaleVersionBin.findMany()
     *
     * // Get first 10 ScaleVersionBins
     * const scaleVersionBins = await prisma.scaleVersionBin.findMany({ take: 10 })
     *
     * // Only select the `scaleVersionId`
     * const scaleVersionBinWithScaleVersionIdOnly = await prisma.scaleVersionBin.findMany({ select: { scaleVersionId: true } })
     *
     */
    findMany<T extends ScaleVersionBinFindManyArgs>(args?: Prisma.SelectSubset<T, ScaleVersionBinFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ScaleVersionBinPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a ScaleVersionBin.
     * @param {ScaleVersionBinCreateArgs} args - Arguments to create a ScaleVersionBin.
     * @example
     * // Create one ScaleVersionBin
     * const ScaleVersionBin = await prisma.scaleVersionBin.create({
     *   data: {
     *     // ... data to create a ScaleVersionBin
     *   }
     * })
     *
     */
    create<T extends ScaleVersionBinCreateArgs>(args: Prisma.SelectSubset<T, ScaleVersionBinCreateArgs<ExtArgs>>): Prisma.Prisma__ScaleVersionBinClient<runtime.Types.Result.GetResult<Prisma.$ScaleVersionBinPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many ScaleVersionBins.
     * @param {ScaleVersionBinCreateManyArgs} args - Arguments to create many ScaleVersionBins.
     * @example
     * // Create many ScaleVersionBins
     * const scaleVersionBin = await prisma.scaleVersionBin.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends ScaleVersionBinCreateManyArgs>(args?: Prisma.SelectSubset<T, ScaleVersionBinCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many ScaleVersionBins and returns the data saved in the database.
     * @param {ScaleVersionBinCreateManyAndReturnArgs} args - Arguments to create many ScaleVersionBins.
     * @example
     * // Create many ScaleVersionBins
     * const scaleVersionBin = await prisma.scaleVersionBin.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many ScaleVersionBins and only return the `scaleVersionId`
     * const scaleVersionBinWithScaleVersionIdOnly = await prisma.scaleVersionBin.createManyAndReturn({
     *   select: { scaleVersionId: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends ScaleVersionBinCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ScaleVersionBinCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ScaleVersionBinPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a ScaleVersionBin.
     * @param {ScaleVersionBinDeleteArgs} args - Arguments to delete one ScaleVersionBin.
     * @example
     * // Delete one ScaleVersionBin
     * const ScaleVersionBin = await prisma.scaleVersionBin.delete({
     *   where: {
     *     // ... filter to delete one ScaleVersionBin
     *   }
     * })
     *
     */
    delete<T extends ScaleVersionBinDeleteArgs>(args: Prisma.SelectSubset<T, ScaleVersionBinDeleteArgs<ExtArgs>>): Prisma.Prisma__ScaleVersionBinClient<runtime.Types.Result.GetResult<Prisma.$ScaleVersionBinPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one ScaleVersionBin.
     * @param {ScaleVersionBinUpdateArgs} args - Arguments to update one ScaleVersionBin.
     * @example
     * // Update one ScaleVersionBin
     * const scaleVersionBin = await prisma.scaleVersionBin.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends ScaleVersionBinUpdateArgs>(args: Prisma.SelectSubset<T, ScaleVersionBinUpdateArgs<ExtArgs>>): Prisma.Prisma__ScaleVersionBinClient<runtime.Types.Result.GetResult<Prisma.$ScaleVersionBinPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more ScaleVersionBins.
     * @param {ScaleVersionBinDeleteManyArgs} args - Arguments to filter ScaleVersionBins to delete.
     * @example
     * // Delete a few ScaleVersionBins
     * const { count } = await prisma.scaleVersionBin.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends ScaleVersionBinDeleteManyArgs>(args?: Prisma.SelectSubset<T, ScaleVersionBinDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more ScaleVersionBins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScaleVersionBinUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ScaleVersionBins
     * const scaleVersionBin = await prisma.scaleVersionBin.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends ScaleVersionBinUpdateManyArgs>(args: Prisma.SelectSubset<T, ScaleVersionBinUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more ScaleVersionBins and returns the data updated in the database.
     * @param {ScaleVersionBinUpdateManyAndReturnArgs} args - Arguments to update many ScaleVersionBins.
     * @example
     * // Update many ScaleVersionBins
     * const scaleVersionBin = await prisma.scaleVersionBin.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more ScaleVersionBins and only return the `scaleVersionId`
     * const scaleVersionBinWithScaleVersionIdOnly = await prisma.scaleVersionBin.updateManyAndReturn({
     *   select: { scaleVersionId: true },
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
    updateManyAndReturn<T extends ScaleVersionBinUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ScaleVersionBinUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ScaleVersionBinPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one ScaleVersionBin.
     * @param {ScaleVersionBinUpsertArgs} args - Arguments to update or create a ScaleVersionBin.
     * @example
     * // Update or create a ScaleVersionBin
     * const scaleVersionBin = await prisma.scaleVersionBin.upsert({
     *   create: {
     *     // ... data to create a ScaleVersionBin
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ScaleVersionBin we want to update
     *   }
     * })
     */
    upsert<T extends ScaleVersionBinUpsertArgs>(args: Prisma.SelectSubset<T, ScaleVersionBinUpsertArgs<ExtArgs>>): Prisma.Prisma__ScaleVersionBinClient<runtime.Types.Result.GetResult<Prisma.$ScaleVersionBinPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of ScaleVersionBins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScaleVersionBinCountArgs} args - Arguments to filter ScaleVersionBins to count.
     * @example
     * // Count the number of ScaleVersionBins
     * const count = await prisma.scaleVersionBin.count({
     *   where: {
     *     // ... the filter for the ScaleVersionBins we want to count
     *   }
     * })
    **/
    count<T extends ScaleVersionBinCountArgs>(args?: Prisma.Subset<T, ScaleVersionBinCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ScaleVersionBinCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a ScaleVersionBin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScaleVersionBinAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends ScaleVersionBinAggregateArgs>(args: Prisma.Subset<T, ScaleVersionBinAggregateArgs>): Prisma.PrismaPromise<GetScaleVersionBinAggregateType<T>>;
    /**
     * Group by ScaleVersionBin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ScaleVersionBinGroupByArgs} args - Group by arguments.
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
    groupBy<T extends ScaleVersionBinGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ScaleVersionBinGroupByArgs['orderBy'];
    } : {
        orderBy?: ScaleVersionBinGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ScaleVersionBinGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetScaleVersionBinGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the ScaleVersionBin model
     */
    readonly fields: ScaleVersionBinFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for ScaleVersionBin.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__ScaleVersionBinClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    scaleVersion<T extends Prisma.ScaleVersionDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.ScaleVersionDefaultArgs<ExtArgs>>): Prisma.Prisma__ScaleVersionClient<runtime.Types.Result.GetResult<Prisma.$ScaleVersionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
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
 * Fields of the ScaleVersionBin model
 */
export interface ScaleVersionBinFieldRefs {
    readonly scaleVersionId: Prisma.FieldRef<"ScaleVersionBin", 'String'>;
    readonly predefinedBinId: Prisma.FieldRef<"ScaleVersionBin", 'String'>;
}
/**
 * ScaleVersionBin findUnique
 */
export type ScaleVersionBinFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which ScaleVersionBin to fetch.
     */
    where: Prisma.ScaleVersionBinWhereUniqueInput;
};
/**
 * ScaleVersionBin findUniqueOrThrow
 */
export type ScaleVersionBinFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which ScaleVersionBin to fetch.
     */
    where: Prisma.ScaleVersionBinWhereUniqueInput;
};
/**
 * ScaleVersionBin findFirst
 */
export type ScaleVersionBinFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which ScaleVersionBin to fetch.
     */
    where?: Prisma.ScaleVersionBinWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ScaleVersionBins to fetch.
     */
    orderBy?: Prisma.ScaleVersionBinOrderByWithRelationInput | Prisma.ScaleVersionBinOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ScaleVersionBins.
     */
    cursor?: Prisma.ScaleVersionBinWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ScaleVersionBins from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ScaleVersionBins.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ScaleVersionBins.
     */
    distinct?: Prisma.ScaleVersionBinScalarFieldEnum | Prisma.ScaleVersionBinScalarFieldEnum[];
};
/**
 * ScaleVersionBin findFirstOrThrow
 */
export type ScaleVersionBinFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which ScaleVersionBin to fetch.
     */
    where?: Prisma.ScaleVersionBinWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ScaleVersionBins to fetch.
     */
    orderBy?: Prisma.ScaleVersionBinOrderByWithRelationInput | Prisma.ScaleVersionBinOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for ScaleVersionBins.
     */
    cursor?: Prisma.ScaleVersionBinWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ScaleVersionBins from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ScaleVersionBins.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of ScaleVersionBins.
     */
    distinct?: Prisma.ScaleVersionBinScalarFieldEnum | Prisma.ScaleVersionBinScalarFieldEnum[];
};
/**
 * ScaleVersionBin findMany
 */
export type ScaleVersionBinFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which ScaleVersionBins to fetch.
     */
    where?: Prisma.ScaleVersionBinWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of ScaleVersionBins to fetch.
     */
    orderBy?: Prisma.ScaleVersionBinOrderByWithRelationInput | Prisma.ScaleVersionBinOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing ScaleVersionBins.
     */
    cursor?: Prisma.ScaleVersionBinWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` ScaleVersionBins from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` ScaleVersionBins.
     */
    skip?: number;
    distinct?: Prisma.ScaleVersionBinScalarFieldEnum | Prisma.ScaleVersionBinScalarFieldEnum[];
};
/**
 * ScaleVersionBin create
 */
export type ScaleVersionBinCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to create a ScaleVersionBin.
     */
    data: Prisma.XOR<Prisma.ScaleVersionBinCreateInput, Prisma.ScaleVersionBinUncheckedCreateInput>;
};
/**
 * ScaleVersionBin createMany
 */
export type ScaleVersionBinCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many ScaleVersionBins.
     */
    data: Prisma.ScaleVersionBinCreateManyInput | Prisma.ScaleVersionBinCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * ScaleVersionBin createManyAndReturn
 */
export type ScaleVersionBinCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScaleVersionBin
     */
    select?: Prisma.ScaleVersionBinSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the ScaleVersionBin
     */
    omit?: Prisma.ScaleVersionBinOmit<ExtArgs> | null;
    /**
     * The data used to create many ScaleVersionBins.
     */
    data: Prisma.ScaleVersionBinCreateManyInput | Prisma.ScaleVersionBinCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ScaleVersionBinIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * ScaleVersionBin update
 */
export type ScaleVersionBinUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to update a ScaleVersionBin.
     */
    data: Prisma.XOR<Prisma.ScaleVersionBinUpdateInput, Prisma.ScaleVersionBinUncheckedUpdateInput>;
    /**
     * Choose, which ScaleVersionBin to update.
     */
    where: Prisma.ScaleVersionBinWhereUniqueInput;
};
/**
 * ScaleVersionBin updateMany
 */
export type ScaleVersionBinUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update ScaleVersionBins.
     */
    data: Prisma.XOR<Prisma.ScaleVersionBinUpdateManyMutationInput, Prisma.ScaleVersionBinUncheckedUpdateManyInput>;
    /**
     * Filter which ScaleVersionBins to update
     */
    where?: Prisma.ScaleVersionBinWhereInput;
    /**
     * Limit how many ScaleVersionBins to update.
     */
    limit?: number;
};
/**
 * ScaleVersionBin updateManyAndReturn
 */
export type ScaleVersionBinUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ScaleVersionBin
     */
    select?: Prisma.ScaleVersionBinSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the ScaleVersionBin
     */
    omit?: Prisma.ScaleVersionBinOmit<ExtArgs> | null;
    /**
     * The data used to update ScaleVersionBins.
     */
    data: Prisma.XOR<Prisma.ScaleVersionBinUpdateManyMutationInput, Prisma.ScaleVersionBinUncheckedUpdateManyInput>;
    /**
     * Filter which ScaleVersionBins to update
     */
    where?: Prisma.ScaleVersionBinWhereInput;
    /**
     * Limit how many ScaleVersionBins to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.ScaleVersionBinIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * ScaleVersionBin upsert
 */
export type ScaleVersionBinUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The filter to search for the ScaleVersionBin to update in case it exists.
     */
    where: Prisma.ScaleVersionBinWhereUniqueInput;
    /**
     * In case the ScaleVersionBin found by the `where` argument doesn't exist, create a new ScaleVersionBin with this data.
     */
    create: Prisma.XOR<Prisma.ScaleVersionBinCreateInput, Prisma.ScaleVersionBinUncheckedCreateInput>;
    /**
     * In case the ScaleVersionBin was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.ScaleVersionBinUpdateInput, Prisma.ScaleVersionBinUncheckedUpdateInput>;
};
/**
 * ScaleVersionBin delete
 */
export type ScaleVersionBinDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter which ScaleVersionBin to delete.
     */
    where: Prisma.ScaleVersionBinWhereUniqueInput;
};
/**
 * ScaleVersionBin deleteMany
 */
export type ScaleVersionBinDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which ScaleVersionBins to delete
     */
    where?: Prisma.ScaleVersionBinWhereInput;
    /**
     * Limit how many ScaleVersionBins to delete.
     */
    limit?: number;
};
/**
 * ScaleVersionBin without action
 */
export type ScaleVersionBinDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
export {};
//# sourceMappingURL=ScaleVersionBin.d.ts.map