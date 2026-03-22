import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model PredefinedCourseBin
 *
 */
export type PredefinedCourseBinModel = runtime.Types.Result.DefaultSelection<Prisma.$PredefinedCourseBinPayload>;
export type AggregatePredefinedCourseBin = {
    _count: PredefinedCourseBinCountAggregateOutputType | null;
    _min: PredefinedCourseBinMinAggregateOutputType | null;
    _max: PredefinedCourseBinMaxAggregateOutputType | null;
};
export type PredefinedCourseBinMinAggregateOutputType = {
    id: string | null;
    binName: string | null;
};
export type PredefinedCourseBinMaxAggregateOutputType = {
    id: string | null;
    binName: string | null;
};
export type PredefinedCourseBinCountAggregateOutputType = {
    id: number;
    binName: number;
    _all: number;
};
export type PredefinedCourseBinMinAggregateInputType = {
    id?: true;
    binName?: true;
};
export type PredefinedCourseBinMaxAggregateInputType = {
    id?: true;
    binName?: true;
};
export type PredefinedCourseBinCountAggregateInputType = {
    id?: true;
    binName?: true;
    _all?: true;
};
export type PredefinedCourseBinAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which PredefinedCourseBin to aggregate.
     */
    where?: Prisma.PredefinedCourseBinWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PredefinedCourseBins to fetch.
     */
    orderBy?: Prisma.PredefinedCourseBinOrderByWithRelationInput | Prisma.PredefinedCourseBinOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.PredefinedCourseBinWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PredefinedCourseBins from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PredefinedCourseBins.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned PredefinedCourseBins
    **/
    _count?: true | PredefinedCourseBinCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: PredefinedCourseBinMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: PredefinedCourseBinMaxAggregateInputType;
};
export type GetPredefinedCourseBinAggregateType<T extends PredefinedCourseBinAggregateArgs> = {
    [P in keyof T & keyof AggregatePredefinedCourseBin]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePredefinedCourseBin[P]> : Prisma.GetScalarType<T[P], AggregatePredefinedCourseBin[P]>;
};
export type PredefinedCourseBinGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PredefinedCourseBinWhereInput;
    orderBy?: Prisma.PredefinedCourseBinOrderByWithAggregationInput | Prisma.PredefinedCourseBinOrderByWithAggregationInput[];
    by: Prisma.PredefinedCourseBinScalarFieldEnum[] | Prisma.PredefinedCourseBinScalarFieldEnum;
    having?: Prisma.PredefinedCourseBinScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PredefinedCourseBinCountAggregateInputType | true;
    _min?: PredefinedCourseBinMinAggregateInputType;
    _max?: PredefinedCourseBinMaxAggregateInputType;
};
export type PredefinedCourseBinGroupByOutputType = {
    id: string;
    binName: string;
    _count: PredefinedCourseBinCountAggregateOutputType | null;
    _min: PredefinedCourseBinMinAggregateOutputType | null;
    _max: PredefinedCourseBinMaxAggregateOutputType | null;
};
type GetPredefinedCourseBinGroupByPayload<T extends PredefinedCourseBinGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<PredefinedCourseBinGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof PredefinedCourseBinGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], PredefinedCourseBinGroupByOutputType[P]> : Prisma.GetScalarType<T[P], PredefinedCourseBinGroupByOutputType[P]>;
}>>;
export type PredefinedCourseBinWhereInput = {
    AND?: Prisma.PredefinedCourseBinWhereInput | Prisma.PredefinedCourseBinWhereInput[];
    OR?: Prisma.PredefinedCourseBinWhereInput[];
    NOT?: Prisma.PredefinedCourseBinWhereInput | Prisma.PredefinedCourseBinWhereInput[];
    id?: Prisma.UuidFilter<"PredefinedCourseBin"> | string;
    binName?: Prisma.StringFilter<"PredefinedCourseBin"> | string;
    courseBins?: Prisma.CourseBinListRelationFilter;
    scaleBins?: Prisma.ScaleBinListRelationFilter;
};
export type PredefinedCourseBinOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    binName?: Prisma.SortOrder;
    courseBins?: Prisma.CourseBinOrderByRelationAggregateInput;
    scaleBins?: Prisma.ScaleBinOrderByRelationAggregateInput;
};
export type PredefinedCourseBinWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.PredefinedCourseBinWhereInput | Prisma.PredefinedCourseBinWhereInput[];
    OR?: Prisma.PredefinedCourseBinWhereInput[];
    NOT?: Prisma.PredefinedCourseBinWhereInput | Prisma.PredefinedCourseBinWhereInput[];
    binName?: Prisma.StringFilter<"PredefinedCourseBin"> | string;
    courseBins?: Prisma.CourseBinListRelationFilter;
    scaleBins?: Prisma.ScaleBinListRelationFilter;
}, "id">;
export type PredefinedCourseBinOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    binName?: Prisma.SortOrder;
    _count?: Prisma.PredefinedCourseBinCountOrderByAggregateInput;
    _max?: Prisma.PredefinedCourseBinMaxOrderByAggregateInput;
    _min?: Prisma.PredefinedCourseBinMinOrderByAggregateInput;
};
export type PredefinedCourseBinScalarWhereWithAggregatesInput = {
    AND?: Prisma.PredefinedCourseBinScalarWhereWithAggregatesInput | Prisma.PredefinedCourseBinScalarWhereWithAggregatesInput[];
    OR?: Prisma.PredefinedCourseBinScalarWhereWithAggregatesInput[];
    NOT?: Prisma.PredefinedCourseBinScalarWhereWithAggregatesInput | Prisma.PredefinedCourseBinScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"PredefinedCourseBin"> | string;
    binName?: Prisma.StringWithAggregatesFilter<"PredefinedCourseBin"> | string;
};
export type PredefinedCourseBinCreateInput = {
    id?: string;
    binName: string;
    courseBins?: Prisma.CourseBinCreateNestedManyWithoutPredefinedCourseBinInput;
    scaleBins?: Prisma.ScaleBinCreateNestedManyWithoutPredefinedCourseBinInput;
};
export type PredefinedCourseBinUncheckedCreateInput = {
    id?: string;
    binName: string;
    courseBins?: Prisma.CourseBinUncheckedCreateNestedManyWithoutPredefinedCourseBinInput;
    scaleBins?: Prisma.ScaleBinUncheckedCreateNestedManyWithoutPredefinedCourseBinInput;
};
export type PredefinedCourseBinUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    binName?: Prisma.StringFieldUpdateOperationsInput | string;
    courseBins?: Prisma.CourseBinUpdateManyWithoutPredefinedCourseBinNestedInput;
    scaleBins?: Prisma.ScaleBinUpdateManyWithoutPredefinedCourseBinNestedInput;
};
export type PredefinedCourseBinUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    binName?: Prisma.StringFieldUpdateOperationsInput | string;
    courseBins?: Prisma.CourseBinUncheckedUpdateManyWithoutPredefinedCourseBinNestedInput;
    scaleBins?: Prisma.ScaleBinUncheckedUpdateManyWithoutPredefinedCourseBinNestedInput;
};
export type PredefinedCourseBinCreateManyInput = {
    id?: string;
    binName: string;
};
export type PredefinedCourseBinUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    binName?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type PredefinedCourseBinUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    binName?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type PredefinedCourseBinCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    binName?: Prisma.SortOrder;
};
export type PredefinedCourseBinMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    binName?: Prisma.SortOrder;
};
export type PredefinedCourseBinMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    binName?: Prisma.SortOrder;
};
export type PredefinedCourseBinScalarRelationFilter = {
    is?: Prisma.PredefinedCourseBinWhereInput;
    isNot?: Prisma.PredefinedCourseBinWhereInput;
};
export type PredefinedCourseBinCreateNestedOneWithoutCourseBinsInput = {
    create?: Prisma.XOR<Prisma.PredefinedCourseBinCreateWithoutCourseBinsInput, Prisma.PredefinedCourseBinUncheckedCreateWithoutCourseBinsInput>;
    connectOrCreate?: Prisma.PredefinedCourseBinCreateOrConnectWithoutCourseBinsInput;
    connect?: Prisma.PredefinedCourseBinWhereUniqueInput;
};
export type PredefinedCourseBinUpdateOneRequiredWithoutCourseBinsNestedInput = {
    create?: Prisma.XOR<Prisma.PredefinedCourseBinCreateWithoutCourseBinsInput, Prisma.PredefinedCourseBinUncheckedCreateWithoutCourseBinsInput>;
    connectOrCreate?: Prisma.PredefinedCourseBinCreateOrConnectWithoutCourseBinsInput;
    upsert?: Prisma.PredefinedCourseBinUpsertWithoutCourseBinsInput;
    connect?: Prisma.PredefinedCourseBinWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.PredefinedCourseBinUpdateToOneWithWhereWithoutCourseBinsInput, Prisma.PredefinedCourseBinUpdateWithoutCourseBinsInput>, Prisma.PredefinedCourseBinUncheckedUpdateWithoutCourseBinsInput>;
};
export type PredefinedCourseBinCreateNestedOneWithoutScaleBinsInput = {
    create?: Prisma.XOR<Prisma.PredefinedCourseBinCreateWithoutScaleBinsInput, Prisma.PredefinedCourseBinUncheckedCreateWithoutScaleBinsInput>;
    connectOrCreate?: Prisma.PredefinedCourseBinCreateOrConnectWithoutScaleBinsInput;
    connect?: Prisma.PredefinedCourseBinWhereUniqueInput;
};
export type PredefinedCourseBinUpdateOneRequiredWithoutScaleBinsNestedInput = {
    create?: Prisma.XOR<Prisma.PredefinedCourseBinCreateWithoutScaleBinsInput, Prisma.PredefinedCourseBinUncheckedCreateWithoutScaleBinsInput>;
    connectOrCreate?: Prisma.PredefinedCourseBinCreateOrConnectWithoutScaleBinsInput;
    upsert?: Prisma.PredefinedCourseBinUpsertWithoutScaleBinsInput;
    connect?: Prisma.PredefinedCourseBinWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.PredefinedCourseBinUpdateToOneWithWhereWithoutScaleBinsInput, Prisma.PredefinedCourseBinUpdateWithoutScaleBinsInput>, Prisma.PredefinedCourseBinUncheckedUpdateWithoutScaleBinsInput>;
};
export type PredefinedCourseBinCreateWithoutCourseBinsInput = {
    id?: string;
    binName: string;
    scaleBins?: Prisma.ScaleBinCreateNestedManyWithoutPredefinedCourseBinInput;
};
export type PredefinedCourseBinUncheckedCreateWithoutCourseBinsInput = {
    id?: string;
    binName: string;
    scaleBins?: Prisma.ScaleBinUncheckedCreateNestedManyWithoutPredefinedCourseBinInput;
};
export type PredefinedCourseBinCreateOrConnectWithoutCourseBinsInput = {
    where: Prisma.PredefinedCourseBinWhereUniqueInput;
    create: Prisma.XOR<Prisma.PredefinedCourseBinCreateWithoutCourseBinsInput, Prisma.PredefinedCourseBinUncheckedCreateWithoutCourseBinsInput>;
};
export type PredefinedCourseBinUpsertWithoutCourseBinsInput = {
    update: Prisma.XOR<Prisma.PredefinedCourseBinUpdateWithoutCourseBinsInput, Prisma.PredefinedCourseBinUncheckedUpdateWithoutCourseBinsInput>;
    create: Prisma.XOR<Prisma.PredefinedCourseBinCreateWithoutCourseBinsInput, Prisma.PredefinedCourseBinUncheckedCreateWithoutCourseBinsInput>;
    where?: Prisma.PredefinedCourseBinWhereInput;
};
export type PredefinedCourseBinUpdateToOneWithWhereWithoutCourseBinsInput = {
    where?: Prisma.PredefinedCourseBinWhereInput;
    data: Prisma.XOR<Prisma.PredefinedCourseBinUpdateWithoutCourseBinsInput, Prisma.PredefinedCourseBinUncheckedUpdateWithoutCourseBinsInput>;
};
export type PredefinedCourseBinUpdateWithoutCourseBinsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    binName?: Prisma.StringFieldUpdateOperationsInput | string;
    scaleBins?: Prisma.ScaleBinUpdateManyWithoutPredefinedCourseBinNestedInput;
};
export type PredefinedCourseBinUncheckedUpdateWithoutCourseBinsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    binName?: Prisma.StringFieldUpdateOperationsInput | string;
    scaleBins?: Prisma.ScaleBinUncheckedUpdateManyWithoutPredefinedCourseBinNestedInput;
};
export type PredefinedCourseBinCreateWithoutScaleBinsInput = {
    id?: string;
    binName: string;
    courseBins?: Prisma.CourseBinCreateNestedManyWithoutPredefinedCourseBinInput;
};
export type PredefinedCourseBinUncheckedCreateWithoutScaleBinsInput = {
    id?: string;
    binName: string;
    courseBins?: Prisma.CourseBinUncheckedCreateNestedManyWithoutPredefinedCourseBinInput;
};
export type PredefinedCourseBinCreateOrConnectWithoutScaleBinsInput = {
    where: Prisma.PredefinedCourseBinWhereUniqueInput;
    create: Prisma.XOR<Prisma.PredefinedCourseBinCreateWithoutScaleBinsInput, Prisma.PredefinedCourseBinUncheckedCreateWithoutScaleBinsInput>;
};
export type PredefinedCourseBinUpsertWithoutScaleBinsInput = {
    update: Prisma.XOR<Prisma.PredefinedCourseBinUpdateWithoutScaleBinsInput, Prisma.PredefinedCourseBinUncheckedUpdateWithoutScaleBinsInput>;
    create: Prisma.XOR<Prisma.PredefinedCourseBinCreateWithoutScaleBinsInput, Prisma.PredefinedCourseBinUncheckedCreateWithoutScaleBinsInput>;
    where?: Prisma.PredefinedCourseBinWhereInput;
};
export type PredefinedCourseBinUpdateToOneWithWhereWithoutScaleBinsInput = {
    where?: Prisma.PredefinedCourseBinWhereInput;
    data: Prisma.XOR<Prisma.PredefinedCourseBinUpdateWithoutScaleBinsInput, Prisma.PredefinedCourseBinUncheckedUpdateWithoutScaleBinsInput>;
};
export type PredefinedCourseBinUpdateWithoutScaleBinsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    binName?: Prisma.StringFieldUpdateOperationsInput | string;
    courseBins?: Prisma.CourseBinUpdateManyWithoutPredefinedCourseBinNestedInput;
};
export type PredefinedCourseBinUncheckedUpdateWithoutScaleBinsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    binName?: Prisma.StringFieldUpdateOperationsInput | string;
    courseBins?: Prisma.CourseBinUncheckedUpdateManyWithoutPredefinedCourseBinNestedInput;
};
/**
 * Count Type PredefinedCourseBinCountOutputType
 */
export type PredefinedCourseBinCountOutputType = {
    courseBins: number;
    scaleBins: number;
};
export type PredefinedCourseBinCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    courseBins?: boolean | PredefinedCourseBinCountOutputTypeCountCourseBinsArgs;
    scaleBins?: boolean | PredefinedCourseBinCountOutputTypeCountScaleBinsArgs;
};
/**
 * PredefinedCourseBinCountOutputType without action
 */
export type PredefinedCourseBinCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PredefinedCourseBinCountOutputType
     */
    select?: Prisma.PredefinedCourseBinCountOutputTypeSelect<ExtArgs> | null;
};
/**
 * PredefinedCourseBinCountOutputType without action
 */
export type PredefinedCourseBinCountOutputTypeCountCourseBinsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CourseBinWhereInput;
};
/**
 * PredefinedCourseBinCountOutputType without action
 */
export type PredefinedCourseBinCountOutputTypeCountScaleBinsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ScaleBinWhereInput;
};
export type PredefinedCourseBinSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    binName?: boolean;
    courseBins?: boolean | Prisma.PredefinedCourseBin$courseBinsArgs<ExtArgs>;
    scaleBins?: boolean | Prisma.PredefinedCourseBin$scaleBinsArgs<ExtArgs>;
    _count?: boolean | Prisma.PredefinedCourseBinCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["predefinedCourseBin"]>;
export type PredefinedCourseBinSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    binName?: boolean;
}, ExtArgs["result"]["predefinedCourseBin"]>;
export type PredefinedCourseBinSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    binName?: boolean;
}, ExtArgs["result"]["predefinedCourseBin"]>;
export type PredefinedCourseBinSelectScalar = {
    id?: boolean;
    binName?: boolean;
};
export type PredefinedCourseBinOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "binName", ExtArgs["result"]["predefinedCourseBin"]>;
export type PredefinedCourseBinInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    courseBins?: boolean | Prisma.PredefinedCourseBin$courseBinsArgs<ExtArgs>;
    scaleBins?: boolean | Prisma.PredefinedCourseBin$scaleBinsArgs<ExtArgs>;
    _count?: boolean | Prisma.PredefinedCourseBinCountOutputTypeDefaultArgs<ExtArgs>;
};
export type PredefinedCourseBinIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type PredefinedCourseBinIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $PredefinedCourseBinPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "PredefinedCourseBin";
    objects: {
        courseBins: Prisma.$CourseBinPayload<ExtArgs>[];
        scaleBins: Prisma.$ScaleBinPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        binName: string;
    }, ExtArgs["result"]["predefinedCourseBin"]>;
    composites: {};
};
export type PredefinedCourseBinGetPayload<S extends boolean | null | undefined | PredefinedCourseBinDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$PredefinedCourseBinPayload, S>;
export type PredefinedCourseBinCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<PredefinedCourseBinFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PredefinedCourseBinCountAggregateInputType | true;
};
export interface PredefinedCourseBinDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['PredefinedCourseBin'];
        meta: {
            name: 'PredefinedCourseBin';
        };
    };
    /**
     * Find zero or one PredefinedCourseBin that matches the filter.
     * @param {PredefinedCourseBinFindUniqueArgs} args - Arguments to find a PredefinedCourseBin
     * @example
     * // Get one PredefinedCourseBin
     * const predefinedCourseBin = await prisma.predefinedCourseBin.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PredefinedCourseBinFindUniqueArgs>(args: Prisma.SelectSubset<T, PredefinedCourseBinFindUniqueArgs<ExtArgs>>): Prisma.Prisma__PredefinedCourseBinClient<runtime.Types.Result.GetResult<Prisma.$PredefinedCourseBinPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one PredefinedCourseBin that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PredefinedCourseBinFindUniqueOrThrowArgs} args - Arguments to find a PredefinedCourseBin
     * @example
     * // Get one PredefinedCourseBin
     * const predefinedCourseBin = await prisma.predefinedCourseBin.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PredefinedCourseBinFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, PredefinedCourseBinFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__PredefinedCourseBinClient<runtime.Types.Result.GetResult<Prisma.$PredefinedCourseBinPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first PredefinedCourseBin that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PredefinedCourseBinFindFirstArgs} args - Arguments to find a PredefinedCourseBin
     * @example
     * // Get one PredefinedCourseBin
     * const predefinedCourseBin = await prisma.predefinedCourseBin.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PredefinedCourseBinFindFirstArgs>(args?: Prisma.SelectSubset<T, PredefinedCourseBinFindFirstArgs<ExtArgs>>): Prisma.Prisma__PredefinedCourseBinClient<runtime.Types.Result.GetResult<Prisma.$PredefinedCourseBinPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first PredefinedCourseBin that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PredefinedCourseBinFindFirstOrThrowArgs} args - Arguments to find a PredefinedCourseBin
     * @example
     * // Get one PredefinedCourseBin
     * const predefinedCourseBin = await prisma.predefinedCourseBin.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PredefinedCourseBinFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, PredefinedCourseBinFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__PredefinedCourseBinClient<runtime.Types.Result.GetResult<Prisma.$PredefinedCourseBinPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more PredefinedCourseBins that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PredefinedCourseBinFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PredefinedCourseBins
     * const predefinedCourseBins = await prisma.predefinedCourseBin.findMany()
     *
     * // Get first 10 PredefinedCourseBins
     * const predefinedCourseBins = await prisma.predefinedCourseBin.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const predefinedCourseBinWithIdOnly = await prisma.predefinedCourseBin.findMany({ select: { id: true } })
     *
     */
    findMany<T extends PredefinedCourseBinFindManyArgs>(args?: Prisma.SelectSubset<T, PredefinedCourseBinFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PredefinedCourseBinPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a PredefinedCourseBin.
     * @param {PredefinedCourseBinCreateArgs} args - Arguments to create a PredefinedCourseBin.
     * @example
     * // Create one PredefinedCourseBin
     * const PredefinedCourseBin = await prisma.predefinedCourseBin.create({
     *   data: {
     *     // ... data to create a PredefinedCourseBin
     *   }
     * })
     *
     */
    create<T extends PredefinedCourseBinCreateArgs>(args: Prisma.SelectSubset<T, PredefinedCourseBinCreateArgs<ExtArgs>>): Prisma.Prisma__PredefinedCourseBinClient<runtime.Types.Result.GetResult<Prisma.$PredefinedCourseBinPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many PredefinedCourseBins.
     * @param {PredefinedCourseBinCreateManyArgs} args - Arguments to create many PredefinedCourseBins.
     * @example
     * // Create many PredefinedCourseBins
     * const predefinedCourseBin = await prisma.predefinedCourseBin.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends PredefinedCourseBinCreateManyArgs>(args?: Prisma.SelectSubset<T, PredefinedCourseBinCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many PredefinedCourseBins and returns the data saved in the database.
     * @param {PredefinedCourseBinCreateManyAndReturnArgs} args - Arguments to create many PredefinedCourseBins.
     * @example
     * // Create many PredefinedCourseBins
     * const predefinedCourseBin = await prisma.predefinedCourseBin.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many PredefinedCourseBins and only return the `id`
     * const predefinedCourseBinWithIdOnly = await prisma.predefinedCourseBin.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends PredefinedCourseBinCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, PredefinedCourseBinCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PredefinedCourseBinPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a PredefinedCourseBin.
     * @param {PredefinedCourseBinDeleteArgs} args - Arguments to delete one PredefinedCourseBin.
     * @example
     * // Delete one PredefinedCourseBin
     * const PredefinedCourseBin = await prisma.predefinedCourseBin.delete({
     *   where: {
     *     // ... filter to delete one PredefinedCourseBin
     *   }
     * })
     *
     */
    delete<T extends PredefinedCourseBinDeleteArgs>(args: Prisma.SelectSubset<T, PredefinedCourseBinDeleteArgs<ExtArgs>>): Prisma.Prisma__PredefinedCourseBinClient<runtime.Types.Result.GetResult<Prisma.$PredefinedCourseBinPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one PredefinedCourseBin.
     * @param {PredefinedCourseBinUpdateArgs} args - Arguments to update one PredefinedCourseBin.
     * @example
     * // Update one PredefinedCourseBin
     * const predefinedCourseBin = await prisma.predefinedCourseBin.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends PredefinedCourseBinUpdateArgs>(args: Prisma.SelectSubset<T, PredefinedCourseBinUpdateArgs<ExtArgs>>): Prisma.Prisma__PredefinedCourseBinClient<runtime.Types.Result.GetResult<Prisma.$PredefinedCourseBinPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more PredefinedCourseBins.
     * @param {PredefinedCourseBinDeleteManyArgs} args - Arguments to filter PredefinedCourseBins to delete.
     * @example
     * // Delete a few PredefinedCourseBins
     * const { count } = await prisma.predefinedCourseBin.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends PredefinedCourseBinDeleteManyArgs>(args?: Prisma.SelectSubset<T, PredefinedCourseBinDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more PredefinedCourseBins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PredefinedCourseBinUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PredefinedCourseBins
     * const predefinedCourseBin = await prisma.predefinedCourseBin.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends PredefinedCourseBinUpdateManyArgs>(args: Prisma.SelectSubset<T, PredefinedCourseBinUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more PredefinedCourseBins and returns the data updated in the database.
     * @param {PredefinedCourseBinUpdateManyAndReturnArgs} args - Arguments to update many PredefinedCourseBins.
     * @example
     * // Update many PredefinedCourseBins
     * const predefinedCourseBin = await prisma.predefinedCourseBin.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more PredefinedCourseBins and only return the `id`
     * const predefinedCourseBinWithIdOnly = await prisma.predefinedCourseBin.updateManyAndReturn({
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
    updateManyAndReturn<T extends PredefinedCourseBinUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, PredefinedCourseBinUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PredefinedCourseBinPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one PredefinedCourseBin.
     * @param {PredefinedCourseBinUpsertArgs} args - Arguments to update or create a PredefinedCourseBin.
     * @example
     * // Update or create a PredefinedCourseBin
     * const predefinedCourseBin = await prisma.predefinedCourseBin.upsert({
     *   create: {
     *     // ... data to create a PredefinedCourseBin
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PredefinedCourseBin we want to update
     *   }
     * })
     */
    upsert<T extends PredefinedCourseBinUpsertArgs>(args: Prisma.SelectSubset<T, PredefinedCourseBinUpsertArgs<ExtArgs>>): Prisma.Prisma__PredefinedCourseBinClient<runtime.Types.Result.GetResult<Prisma.$PredefinedCourseBinPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of PredefinedCourseBins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PredefinedCourseBinCountArgs} args - Arguments to filter PredefinedCourseBins to count.
     * @example
     * // Count the number of PredefinedCourseBins
     * const count = await prisma.predefinedCourseBin.count({
     *   where: {
     *     // ... the filter for the PredefinedCourseBins we want to count
     *   }
     * })
    **/
    count<T extends PredefinedCourseBinCountArgs>(args?: Prisma.Subset<T, PredefinedCourseBinCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], PredefinedCourseBinCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a PredefinedCourseBin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PredefinedCourseBinAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends PredefinedCourseBinAggregateArgs>(args: Prisma.Subset<T, PredefinedCourseBinAggregateArgs>): Prisma.PrismaPromise<GetPredefinedCourseBinAggregateType<T>>;
    /**
     * Group by PredefinedCourseBin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PredefinedCourseBinGroupByArgs} args - Group by arguments.
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
    groupBy<T extends PredefinedCourseBinGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: PredefinedCourseBinGroupByArgs['orderBy'];
    } : {
        orderBy?: PredefinedCourseBinGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, PredefinedCourseBinGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPredefinedCourseBinGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the PredefinedCourseBin model
     */
    readonly fields: PredefinedCourseBinFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for PredefinedCourseBin.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__PredefinedCourseBinClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    courseBins<T extends Prisma.PredefinedCourseBin$courseBinsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.PredefinedCourseBin$courseBinsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CourseBinPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    scaleBins<T extends Prisma.PredefinedCourseBin$scaleBinsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.PredefinedCourseBin$scaleBinsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ScaleBinPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
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
 * Fields of the PredefinedCourseBin model
 */
export interface PredefinedCourseBinFieldRefs {
    readonly id: Prisma.FieldRef<"PredefinedCourseBin", 'String'>;
    readonly binName: Prisma.FieldRef<"PredefinedCourseBin", 'String'>;
}
/**
 * PredefinedCourseBin findUnique
 */
export type PredefinedCourseBinFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PredefinedCourseBin
     */
    select?: Prisma.PredefinedCourseBinSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PredefinedCourseBin
     */
    omit?: Prisma.PredefinedCourseBinOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PredefinedCourseBinInclude<ExtArgs> | null;
    /**
     * Filter, which PredefinedCourseBin to fetch.
     */
    where: Prisma.PredefinedCourseBinWhereUniqueInput;
};
/**
 * PredefinedCourseBin findUniqueOrThrow
 */
export type PredefinedCourseBinFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PredefinedCourseBin
     */
    select?: Prisma.PredefinedCourseBinSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PredefinedCourseBin
     */
    omit?: Prisma.PredefinedCourseBinOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PredefinedCourseBinInclude<ExtArgs> | null;
    /**
     * Filter, which PredefinedCourseBin to fetch.
     */
    where: Prisma.PredefinedCourseBinWhereUniqueInput;
};
/**
 * PredefinedCourseBin findFirst
 */
export type PredefinedCourseBinFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PredefinedCourseBin
     */
    select?: Prisma.PredefinedCourseBinSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PredefinedCourseBin
     */
    omit?: Prisma.PredefinedCourseBinOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PredefinedCourseBinInclude<ExtArgs> | null;
    /**
     * Filter, which PredefinedCourseBin to fetch.
     */
    where?: Prisma.PredefinedCourseBinWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PredefinedCourseBins to fetch.
     */
    orderBy?: Prisma.PredefinedCourseBinOrderByWithRelationInput | Prisma.PredefinedCourseBinOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for PredefinedCourseBins.
     */
    cursor?: Prisma.PredefinedCourseBinWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PredefinedCourseBins from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PredefinedCourseBins.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of PredefinedCourseBins.
     */
    distinct?: Prisma.PredefinedCourseBinScalarFieldEnum | Prisma.PredefinedCourseBinScalarFieldEnum[];
};
/**
 * PredefinedCourseBin findFirstOrThrow
 */
export type PredefinedCourseBinFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PredefinedCourseBin
     */
    select?: Prisma.PredefinedCourseBinSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PredefinedCourseBin
     */
    omit?: Prisma.PredefinedCourseBinOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PredefinedCourseBinInclude<ExtArgs> | null;
    /**
     * Filter, which PredefinedCourseBin to fetch.
     */
    where?: Prisma.PredefinedCourseBinWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PredefinedCourseBins to fetch.
     */
    orderBy?: Prisma.PredefinedCourseBinOrderByWithRelationInput | Prisma.PredefinedCourseBinOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for PredefinedCourseBins.
     */
    cursor?: Prisma.PredefinedCourseBinWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PredefinedCourseBins from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PredefinedCourseBins.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of PredefinedCourseBins.
     */
    distinct?: Prisma.PredefinedCourseBinScalarFieldEnum | Prisma.PredefinedCourseBinScalarFieldEnum[];
};
/**
 * PredefinedCourseBin findMany
 */
export type PredefinedCourseBinFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PredefinedCourseBin
     */
    select?: Prisma.PredefinedCourseBinSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PredefinedCourseBin
     */
    omit?: Prisma.PredefinedCourseBinOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PredefinedCourseBinInclude<ExtArgs> | null;
    /**
     * Filter, which PredefinedCourseBins to fetch.
     */
    where?: Prisma.PredefinedCourseBinWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of PredefinedCourseBins to fetch.
     */
    orderBy?: Prisma.PredefinedCourseBinOrderByWithRelationInput | Prisma.PredefinedCourseBinOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing PredefinedCourseBins.
     */
    cursor?: Prisma.PredefinedCourseBinWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` PredefinedCourseBins from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` PredefinedCourseBins.
     */
    skip?: number;
    distinct?: Prisma.PredefinedCourseBinScalarFieldEnum | Prisma.PredefinedCourseBinScalarFieldEnum[];
};
/**
 * PredefinedCourseBin create
 */
export type PredefinedCourseBinCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PredefinedCourseBin
     */
    select?: Prisma.PredefinedCourseBinSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PredefinedCourseBin
     */
    omit?: Prisma.PredefinedCourseBinOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PredefinedCourseBinInclude<ExtArgs> | null;
    /**
     * The data needed to create a PredefinedCourseBin.
     */
    data: Prisma.XOR<Prisma.PredefinedCourseBinCreateInput, Prisma.PredefinedCourseBinUncheckedCreateInput>;
};
/**
 * PredefinedCourseBin createMany
 */
export type PredefinedCourseBinCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many PredefinedCourseBins.
     */
    data: Prisma.PredefinedCourseBinCreateManyInput | Prisma.PredefinedCourseBinCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * PredefinedCourseBin createManyAndReturn
 */
export type PredefinedCourseBinCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PredefinedCourseBin
     */
    select?: Prisma.PredefinedCourseBinSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the PredefinedCourseBin
     */
    omit?: Prisma.PredefinedCourseBinOmit<ExtArgs> | null;
    /**
     * The data used to create many PredefinedCourseBins.
     */
    data: Prisma.PredefinedCourseBinCreateManyInput | Prisma.PredefinedCourseBinCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * PredefinedCourseBin update
 */
export type PredefinedCourseBinUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PredefinedCourseBin
     */
    select?: Prisma.PredefinedCourseBinSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PredefinedCourseBin
     */
    omit?: Prisma.PredefinedCourseBinOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PredefinedCourseBinInclude<ExtArgs> | null;
    /**
     * The data needed to update a PredefinedCourseBin.
     */
    data: Prisma.XOR<Prisma.PredefinedCourseBinUpdateInput, Prisma.PredefinedCourseBinUncheckedUpdateInput>;
    /**
     * Choose, which PredefinedCourseBin to update.
     */
    where: Prisma.PredefinedCourseBinWhereUniqueInput;
};
/**
 * PredefinedCourseBin updateMany
 */
export type PredefinedCourseBinUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update PredefinedCourseBins.
     */
    data: Prisma.XOR<Prisma.PredefinedCourseBinUpdateManyMutationInput, Prisma.PredefinedCourseBinUncheckedUpdateManyInput>;
    /**
     * Filter which PredefinedCourseBins to update
     */
    where?: Prisma.PredefinedCourseBinWhereInput;
    /**
     * Limit how many PredefinedCourseBins to update.
     */
    limit?: number;
};
/**
 * PredefinedCourseBin updateManyAndReturn
 */
export type PredefinedCourseBinUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PredefinedCourseBin
     */
    select?: Prisma.PredefinedCourseBinSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the PredefinedCourseBin
     */
    omit?: Prisma.PredefinedCourseBinOmit<ExtArgs> | null;
    /**
     * The data used to update PredefinedCourseBins.
     */
    data: Prisma.XOR<Prisma.PredefinedCourseBinUpdateManyMutationInput, Prisma.PredefinedCourseBinUncheckedUpdateManyInput>;
    /**
     * Filter which PredefinedCourseBins to update
     */
    where?: Prisma.PredefinedCourseBinWhereInput;
    /**
     * Limit how many PredefinedCourseBins to update.
     */
    limit?: number;
};
/**
 * PredefinedCourseBin upsert
 */
export type PredefinedCourseBinUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PredefinedCourseBin
     */
    select?: Prisma.PredefinedCourseBinSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PredefinedCourseBin
     */
    omit?: Prisma.PredefinedCourseBinOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PredefinedCourseBinInclude<ExtArgs> | null;
    /**
     * The filter to search for the PredefinedCourseBin to update in case it exists.
     */
    where: Prisma.PredefinedCourseBinWhereUniqueInput;
    /**
     * In case the PredefinedCourseBin found by the `where` argument doesn't exist, create a new PredefinedCourseBin with this data.
     */
    create: Prisma.XOR<Prisma.PredefinedCourseBinCreateInput, Prisma.PredefinedCourseBinUncheckedCreateInput>;
    /**
     * In case the PredefinedCourseBin was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.PredefinedCourseBinUpdateInput, Prisma.PredefinedCourseBinUncheckedUpdateInput>;
};
/**
 * PredefinedCourseBin delete
 */
export type PredefinedCourseBinDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PredefinedCourseBin
     */
    select?: Prisma.PredefinedCourseBinSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PredefinedCourseBin
     */
    omit?: Prisma.PredefinedCourseBinOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PredefinedCourseBinInclude<ExtArgs> | null;
    /**
     * Filter which PredefinedCourseBin to delete.
     */
    where: Prisma.PredefinedCourseBinWhereUniqueInput;
};
/**
 * PredefinedCourseBin deleteMany
 */
export type PredefinedCourseBinDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which PredefinedCourseBins to delete
     */
    where?: Prisma.PredefinedCourseBinWhereInput;
    /**
     * Limit how many PredefinedCourseBins to delete.
     */
    limit?: number;
};
/**
 * PredefinedCourseBin.courseBins
 */
export type PredefinedCourseBin$courseBinsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseBin
     */
    select?: Prisma.CourseBinSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the CourseBin
     */
    omit?: Prisma.CourseBinOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.CourseBinInclude<ExtArgs> | null;
    where?: Prisma.CourseBinWhereInput;
    orderBy?: Prisma.CourseBinOrderByWithRelationInput | Prisma.CourseBinOrderByWithRelationInput[];
    cursor?: Prisma.CourseBinWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CourseBinScalarFieldEnum | Prisma.CourseBinScalarFieldEnum[];
};
/**
 * PredefinedCourseBin.scaleBins
 */
export type PredefinedCourseBin$scaleBinsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
 * PredefinedCourseBin without action
 */
export type PredefinedCourseBinDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PredefinedCourseBin
     */
    select?: Prisma.PredefinedCourseBinSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the PredefinedCourseBin
     */
    omit?: Prisma.PredefinedCourseBinOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.PredefinedCourseBinInclude<ExtArgs> | null;
};
export {};
//# sourceMappingURL=PredefinedCourseBin.d.ts.map