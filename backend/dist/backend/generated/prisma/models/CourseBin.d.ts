import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
/**
 * Model CourseBin
 *
 */
export type CourseBinModel = runtime.Types.Result.DefaultSelection<Prisma.$CourseBinPayload>;
export type AggregateCourseBin = {
    _count: CourseBinCountAggregateOutputType | null;
    _min: CourseBinMinAggregateOutputType | null;
    _max: CourseBinMaxAggregateOutputType | null;
};
export type CourseBinMinAggregateOutputType = {
    id: string | null;
    institutionId: string | null;
    predefinedBinId: string | null;
    displayName: string | null;
};
export type CourseBinMaxAggregateOutputType = {
    id: string | null;
    institutionId: string | null;
    predefinedBinId: string | null;
    displayName: string | null;
};
export type CourseBinCountAggregateOutputType = {
    id: number;
    institutionId: number;
    predefinedBinId: number;
    displayName: number;
    _all: number;
};
export type CourseBinMinAggregateInputType = {
    id?: true;
    institutionId?: true;
    predefinedBinId?: true;
    displayName?: true;
};
export type CourseBinMaxAggregateInputType = {
    id?: true;
    institutionId?: true;
    predefinedBinId?: true;
    displayName?: true;
};
export type CourseBinCountAggregateInputType = {
    id?: true;
    institutionId?: true;
    predefinedBinId?: true;
    displayName?: true;
    _all?: true;
};
export type CourseBinAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which CourseBin to aggregate.
     */
    where?: Prisma.CourseBinWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of CourseBins to fetch.
     */
    orderBy?: Prisma.CourseBinOrderByWithRelationInput | Prisma.CourseBinOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the start position
     */
    cursor?: Prisma.CourseBinWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` CourseBins from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` CourseBins.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Count returned CourseBins
    **/
    _count?: true | CourseBinCountAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the minimum value
    **/
    _min?: CourseBinMinAggregateInputType;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     *
     * Select which fields to find the maximum value
    **/
    _max?: CourseBinMaxAggregateInputType;
};
export type GetCourseBinAggregateType<T extends CourseBinAggregateArgs> = {
    [P in keyof T & keyof AggregateCourseBin]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateCourseBin[P]> : Prisma.GetScalarType<T[P], AggregateCourseBin[P]>;
};
export type CourseBinGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CourseBinWhereInput;
    orderBy?: Prisma.CourseBinOrderByWithAggregationInput | Prisma.CourseBinOrderByWithAggregationInput[];
    by: Prisma.CourseBinScalarFieldEnum[] | Prisma.CourseBinScalarFieldEnum;
    having?: Prisma.CourseBinScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CourseBinCountAggregateInputType | true;
    _min?: CourseBinMinAggregateInputType;
    _max?: CourseBinMaxAggregateInputType;
};
export type CourseBinGroupByOutputType = {
    id: string;
    institutionId: string;
    predefinedBinId: string;
    displayName: string;
    _count: CourseBinCountAggregateOutputType | null;
    _min: CourseBinMinAggregateOutputType | null;
    _max: CourseBinMaxAggregateOutputType | null;
};
type GetCourseBinGroupByPayload<T extends CourseBinGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<CourseBinGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof CourseBinGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], CourseBinGroupByOutputType[P]> : Prisma.GetScalarType<T[P], CourseBinGroupByOutputType[P]>;
}>>;
export type CourseBinWhereInput = {
    AND?: Prisma.CourseBinWhereInput | Prisma.CourseBinWhereInput[];
    OR?: Prisma.CourseBinWhereInput[];
    NOT?: Prisma.CourseBinWhereInput | Prisma.CourseBinWhereInput[];
    id?: Prisma.UuidFilter<"CourseBin"> | string;
    institutionId?: Prisma.UuidFilter<"CourseBin"> | string;
    predefinedBinId?: Prisma.UuidFilter<"CourseBin"> | string;
    displayName?: Prisma.StringFilter<"CourseBin"> | string;
    courses?: Prisma.CourseListRelationFilter;
    institution?: Prisma.XOR<Prisma.InstitutionScalarRelationFilter, Prisma.InstitutionWhereInput>;
    predefinedCourseBin?: Prisma.XOR<Prisma.PredefinedCourseBinScalarRelationFilter, Prisma.PredefinedCourseBinWhereInput>;
    userCourseBins?: Prisma.UserCourseBinListRelationFilter;
    invitations?: Prisma.InvitationListRelationFilter;
};
export type CourseBinOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    institutionId?: Prisma.SortOrder;
    predefinedBinId?: Prisma.SortOrder;
    displayName?: Prisma.SortOrder;
    courses?: Prisma.CourseOrderByRelationAggregateInput;
    institution?: Prisma.InstitutionOrderByWithRelationInput;
    predefinedCourseBin?: Prisma.PredefinedCourseBinOrderByWithRelationInput;
    userCourseBins?: Prisma.UserCourseBinOrderByRelationAggregateInput;
    invitations?: Prisma.InvitationOrderByRelationAggregateInput;
};
export type CourseBinWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.CourseBinWhereInput | Prisma.CourseBinWhereInput[];
    OR?: Prisma.CourseBinWhereInput[];
    NOT?: Prisma.CourseBinWhereInput | Prisma.CourseBinWhereInput[];
    institutionId?: Prisma.UuidFilter<"CourseBin"> | string;
    predefinedBinId?: Prisma.UuidFilter<"CourseBin"> | string;
    displayName?: Prisma.StringFilter<"CourseBin"> | string;
    courses?: Prisma.CourseListRelationFilter;
    institution?: Prisma.XOR<Prisma.InstitutionScalarRelationFilter, Prisma.InstitutionWhereInput>;
    predefinedCourseBin?: Prisma.XOR<Prisma.PredefinedCourseBinScalarRelationFilter, Prisma.PredefinedCourseBinWhereInput>;
    userCourseBins?: Prisma.UserCourseBinListRelationFilter;
    invitations?: Prisma.InvitationListRelationFilter;
}, "id">;
export type CourseBinOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    institutionId?: Prisma.SortOrder;
    predefinedBinId?: Prisma.SortOrder;
    displayName?: Prisma.SortOrder;
    _count?: Prisma.CourseBinCountOrderByAggregateInput;
    _max?: Prisma.CourseBinMaxOrderByAggregateInput;
    _min?: Prisma.CourseBinMinOrderByAggregateInput;
};
export type CourseBinScalarWhereWithAggregatesInput = {
    AND?: Prisma.CourseBinScalarWhereWithAggregatesInput | Prisma.CourseBinScalarWhereWithAggregatesInput[];
    OR?: Prisma.CourseBinScalarWhereWithAggregatesInput[];
    NOT?: Prisma.CourseBinScalarWhereWithAggregatesInput | Prisma.CourseBinScalarWhereWithAggregatesInput[];
    id?: Prisma.UuidWithAggregatesFilter<"CourseBin"> | string;
    institutionId?: Prisma.UuidWithAggregatesFilter<"CourseBin"> | string;
    predefinedBinId?: Prisma.UuidWithAggregatesFilter<"CourseBin"> | string;
    displayName?: Prisma.StringWithAggregatesFilter<"CourseBin"> | string;
};
export type CourseBinCreateInput = {
    id?: string;
    displayName: string;
    courses?: Prisma.CourseCreateNestedManyWithoutCourseBinInput;
    institution: Prisma.InstitutionCreateNestedOneWithoutCourseBinsInput;
    predefinedCourseBin: Prisma.PredefinedCourseBinCreateNestedOneWithoutCourseBinsInput;
    userCourseBins?: Prisma.UserCourseBinCreateNestedManyWithoutCourseBinInput;
    invitations?: Prisma.InvitationCreateNestedManyWithoutCourseBinsInput;
};
export type CourseBinUncheckedCreateInput = {
    id?: string;
    institutionId: string;
    predefinedBinId: string;
    displayName: string;
    courses?: Prisma.CourseUncheckedCreateNestedManyWithoutCourseBinInput;
    userCourseBins?: Prisma.UserCourseBinUncheckedCreateNestedManyWithoutCourseBinInput;
    invitations?: Prisma.InvitationUncheckedCreateNestedManyWithoutCourseBinsInput;
};
export type CourseBinUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    displayName?: Prisma.StringFieldUpdateOperationsInput | string;
    courses?: Prisma.CourseUpdateManyWithoutCourseBinNestedInput;
    institution?: Prisma.InstitutionUpdateOneRequiredWithoutCourseBinsNestedInput;
    predefinedCourseBin?: Prisma.PredefinedCourseBinUpdateOneRequiredWithoutCourseBinsNestedInput;
    userCourseBins?: Prisma.UserCourseBinUpdateManyWithoutCourseBinNestedInput;
    invitations?: Prisma.InvitationUpdateManyWithoutCourseBinsNestedInput;
};
export type CourseBinUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    institutionId?: Prisma.StringFieldUpdateOperationsInput | string;
    predefinedBinId?: Prisma.StringFieldUpdateOperationsInput | string;
    displayName?: Prisma.StringFieldUpdateOperationsInput | string;
    courses?: Prisma.CourseUncheckedUpdateManyWithoutCourseBinNestedInput;
    userCourseBins?: Prisma.UserCourseBinUncheckedUpdateManyWithoutCourseBinNestedInput;
    invitations?: Prisma.InvitationUncheckedUpdateManyWithoutCourseBinsNestedInput;
};
export type CourseBinCreateManyInput = {
    id?: string;
    institutionId: string;
    predefinedBinId: string;
    displayName: string;
};
export type CourseBinUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    displayName?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type CourseBinUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    institutionId?: Prisma.StringFieldUpdateOperationsInput | string;
    predefinedBinId?: Prisma.StringFieldUpdateOperationsInput | string;
    displayName?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type CourseBinListRelationFilter = {
    every?: Prisma.CourseBinWhereInput;
    some?: Prisma.CourseBinWhereInput;
    none?: Prisma.CourseBinWhereInput;
};
export type CourseBinOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type CourseBinCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    institutionId?: Prisma.SortOrder;
    predefinedBinId?: Prisma.SortOrder;
    displayName?: Prisma.SortOrder;
};
export type CourseBinMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    institutionId?: Prisma.SortOrder;
    predefinedBinId?: Prisma.SortOrder;
    displayName?: Prisma.SortOrder;
};
export type CourseBinMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    institutionId?: Prisma.SortOrder;
    predefinedBinId?: Prisma.SortOrder;
    displayName?: Prisma.SortOrder;
};
export type CourseBinScalarRelationFilter = {
    is?: Prisma.CourseBinWhereInput;
    isNot?: Prisma.CourseBinWhereInput;
};
export type CourseBinCreateNestedManyWithoutInstitutionInput = {
    create?: Prisma.XOR<Prisma.CourseBinCreateWithoutInstitutionInput, Prisma.CourseBinUncheckedCreateWithoutInstitutionInput> | Prisma.CourseBinCreateWithoutInstitutionInput[] | Prisma.CourseBinUncheckedCreateWithoutInstitutionInput[];
    connectOrCreate?: Prisma.CourseBinCreateOrConnectWithoutInstitutionInput | Prisma.CourseBinCreateOrConnectWithoutInstitutionInput[];
    createMany?: Prisma.CourseBinCreateManyInstitutionInputEnvelope;
    connect?: Prisma.CourseBinWhereUniqueInput | Prisma.CourseBinWhereUniqueInput[];
};
export type CourseBinUncheckedCreateNestedManyWithoutInstitutionInput = {
    create?: Prisma.XOR<Prisma.CourseBinCreateWithoutInstitutionInput, Prisma.CourseBinUncheckedCreateWithoutInstitutionInput> | Prisma.CourseBinCreateWithoutInstitutionInput[] | Prisma.CourseBinUncheckedCreateWithoutInstitutionInput[];
    connectOrCreate?: Prisma.CourseBinCreateOrConnectWithoutInstitutionInput | Prisma.CourseBinCreateOrConnectWithoutInstitutionInput[];
    createMany?: Prisma.CourseBinCreateManyInstitutionInputEnvelope;
    connect?: Prisma.CourseBinWhereUniqueInput | Prisma.CourseBinWhereUniqueInput[];
};
export type CourseBinUpdateManyWithoutInstitutionNestedInput = {
    create?: Prisma.XOR<Prisma.CourseBinCreateWithoutInstitutionInput, Prisma.CourseBinUncheckedCreateWithoutInstitutionInput> | Prisma.CourseBinCreateWithoutInstitutionInput[] | Prisma.CourseBinUncheckedCreateWithoutInstitutionInput[];
    connectOrCreate?: Prisma.CourseBinCreateOrConnectWithoutInstitutionInput | Prisma.CourseBinCreateOrConnectWithoutInstitutionInput[];
    upsert?: Prisma.CourseBinUpsertWithWhereUniqueWithoutInstitutionInput | Prisma.CourseBinUpsertWithWhereUniqueWithoutInstitutionInput[];
    createMany?: Prisma.CourseBinCreateManyInstitutionInputEnvelope;
    set?: Prisma.CourseBinWhereUniqueInput | Prisma.CourseBinWhereUniqueInput[];
    disconnect?: Prisma.CourseBinWhereUniqueInput | Prisma.CourseBinWhereUniqueInput[];
    delete?: Prisma.CourseBinWhereUniqueInput | Prisma.CourseBinWhereUniqueInput[];
    connect?: Prisma.CourseBinWhereUniqueInput | Prisma.CourseBinWhereUniqueInput[];
    update?: Prisma.CourseBinUpdateWithWhereUniqueWithoutInstitutionInput | Prisma.CourseBinUpdateWithWhereUniqueWithoutInstitutionInput[];
    updateMany?: Prisma.CourseBinUpdateManyWithWhereWithoutInstitutionInput | Prisma.CourseBinUpdateManyWithWhereWithoutInstitutionInput[];
    deleteMany?: Prisma.CourseBinScalarWhereInput | Prisma.CourseBinScalarWhereInput[];
};
export type CourseBinUncheckedUpdateManyWithoutInstitutionNestedInput = {
    create?: Prisma.XOR<Prisma.CourseBinCreateWithoutInstitutionInput, Prisma.CourseBinUncheckedCreateWithoutInstitutionInput> | Prisma.CourseBinCreateWithoutInstitutionInput[] | Prisma.CourseBinUncheckedCreateWithoutInstitutionInput[];
    connectOrCreate?: Prisma.CourseBinCreateOrConnectWithoutInstitutionInput | Prisma.CourseBinCreateOrConnectWithoutInstitutionInput[];
    upsert?: Prisma.CourseBinUpsertWithWhereUniqueWithoutInstitutionInput | Prisma.CourseBinUpsertWithWhereUniqueWithoutInstitutionInput[];
    createMany?: Prisma.CourseBinCreateManyInstitutionInputEnvelope;
    set?: Prisma.CourseBinWhereUniqueInput | Prisma.CourseBinWhereUniqueInput[];
    disconnect?: Prisma.CourseBinWhereUniqueInput | Prisma.CourseBinWhereUniqueInput[];
    delete?: Prisma.CourseBinWhereUniqueInput | Prisma.CourseBinWhereUniqueInput[];
    connect?: Prisma.CourseBinWhereUniqueInput | Prisma.CourseBinWhereUniqueInput[];
    update?: Prisma.CourseBinUpdateWithWhereUniqueWithoutInstitutionInput | Prisma.CourseBinUpdateWithWhereUniqueWithoutInstitutionInput[];
    updateMany?: Prisma.CourseBinUpdateManyWithWhereWithoutInstitutionInput | Prisma.CourseBinUpdateManyWithWhereWithoutInstitutionInput[];
    deleteMany?: Prisma.CourseBinScalarWhereInput | Prisma.CourseBinScalarWhereInput[];
};
export type CourseBinCreateNestedManyWithoutPredefinedCourseBinInput = {
    create?: Prisma.XOR<Prisma.CourseBinCreateWithoutPredefinedCourseBinInput, Prisma.CourseBinUncheckedCreateWithoutPredefinedCourseBinInput> | Prisma.CourseBinCreateWithoutPredefinedCourseBinInput[] | Prisma.CourseBinUncheckedCreateWithoutPredefinedCourseBinInput[];
    connectOrCreate?: Prisma.CourseBinCreateOrConnectWithoutPredefinedCourseBinInput | Prisma.CourseBinCreateOrConnectWithoutPredefinedCourseBinInput[];
    createMany?: Prisma.CourseBinCreateManyPredefinedCourseBinInputEnvelope;
    connect?: Prisma.CourseBinWhereUniqueInput | Prisma.CourseBinWhereUniqueInput[];
};
export type CourseBinUncheckedCreateNestedManyWithoutPredefinedCourseBinInput = {
    create?: Prisma.XOR<Prisma.CourseBinCreateWithoutPredefinedCourseBinInput, Prisma.CourseBinUncheckedCreateWithoutPredefinedCourseBinInput> | Prisma.CourseBinCreateWithoutPredefinedCourseBinInput[] | Prisma.CourseBinUncheckedCreateWithoutPredefinedCourseBinInput[];
    connectOrCreate?: Prisma.CourseBinCreateOrConnectWithoutPredefinedCourseBinInput | Prisma.CourseBinCreateOrConnectWithoutPredefinedCourseBinInput[];
    createMany?: Prisma.CourseBinCreateManyPredefinedCourseBinInputEnvelope;
    connect?: Prisma.CourseBinWhereUniqueInput | Prisma.CourseBinWhereUniqueInput[];
};
export type CourseBinUpdateManyWithoutPredefinedCourseBinNestedInput = {
    create?: Prisma.XOR<Prisma.CourseBinCreateWithoutPredefinedCourseBinInput, Prisma.CourseBinUncheckedCreateWithoutPredefinedCourseBinInput> | Prisma.CourseBinCreateWithoutPredefinedCourseBinInput[] | Prisma.CourseBinUncheckedCreateWithoutPredefinedCourseBinInput[];
    connectOrCreate?: Prisma.CourseBinCreateOrConnectWithoutPredefinedCourseBinInput | Prisma.CourseBinCreateOrConnectWithoutPredefinedCourseBinInput[];
    upsert?: Prisma.CourseBinUpsertWithWhereUniqueWithoutPredefinedCourseBinInput | Prisma.CourseBinUpsertWithWhereUniqueWithoutPredefinedCourseBinInput[];
    createMany?: Prisma.CourseBinCreateManyPredefinedCourseBinInputEnvelope;
    set?: Prisma.CourseBinWhereUniqueInput | Prisma.CourseBinWhereUniqueInput[];
    disconnect?: Prisma.CourseBinWhereUniqueInput | Prisma.CourseBinWhereUniqueInput[];
    delete?: Prisma.CourseBinWhereUniqueInput | Prisma.CourseBinWhereUniqueInput[];
    connect?: Prisma.CourseBinWhereUniqueInput | Prisma.CourseBinWhereUniqueInput[];
    update?: Prisma.CourseBinUpdateWithWhereUniqueWithoutPredefinedCourseBinInput | Prisma.CourseBinUpdateWithWhereUniqueWithoutPredefinedCourseBinInput[];
    updateMany?: Prisma.CourseBinUpdateManyWithWhereWithoutPredefinedCourseBinInput | Prisma.CourseBinUpdateManyWithWhereWithoutPredefinedCourseBinInput[];
    deleteMany?: Prisma.CourseBinScalarWhereInput | Prisma.CourseBinScalarWhereInput[];
};
export type CourseBinUncheckedUpdateManyWithoutPredefinedCourseBinNestedInput = {
    create?: Prisma.XOR<Prisma.CourseBinCreateWithoutPredefinedCourseBinInput, Prisma.CourseBinUncheckedCreateWithoutPredefinedCourseBinInput> | Prisma.CourseBinCreateWithoutPredefinedCourseBinInput[] | Prisma.CourseBinUncheckedCreateWithoutPredefinedCourseBinInput[];
    connectOrCreate?: Prisma.CourseBinCreateOrConnectWithoutPredefinedCourseBinInput | Prisma.CourseBinCreateOrConnectWithoutPredefinedCourseBinInput[];
    upsert?: Prisma.CourseBinUpsertWithWhereUniqueWithoutPredefinedCourseBinInput | Prisma.CourseBinUpsertWithWhereUniqueWithoutPredefinedCourseBinInput[];
    createMany?: Prisma.CourseBinCreateManyPredefinedCourseBinInputEnvelope;
    set?: Prisma.CourseBinWhereUniqueInput | Prisma.CourseBinWhereUniqueInput[];
    disconnect?: Prisma.CourseBinWhereUniqueInput | Prisma.CourseBinWhereUniqueInput[];
    delete?: Prisma.CourseBinWhereUniqueInput | Prisma.CourseBinWhereUniqueInput[];
    connect?: Prisma.CourseBinWhereUniqueInput | Prisma.CourseBinWhereUniqueInput[];
    update?: Prisma.CourseBinUpdateWithWhereUniqueWithoutPredefinedCourseBinInput | Prisma.CourseBinUpdateWithWhereUniqueWithoutPredefinedCourseBinInput[];
    updateMany?: Prisma.CourseBinUpdateManyWithWhereWithoutPredefinedCourseBinInput | Prisma.CourseBinUpdateManyWithWhereWithoutPredefinedCourseBinInput[];
    deleteMany?: Prisma.CourseBinScalarWhereInput | Prisma.CourseBinScalarWhereInput[];
};
export type CourseBinCreateNestedOneWithoutCoursesInput = {
    create?: Prisma.XOR<Prisma.CourseBinCreateWithoutCoursesInput, Prisma.CourseBinUncheckedCreateWithoutCoursesInput>;
    connectOrCreate?: Prisma.CourseBinCreateOrConnectWithoutCoursesInput;
    connect?: Prisma.CourseBinWhereUniqueInput;
};
export type CourseBinUpdateOneRequiredWithoutCoursesNestedInput = {
    create?: Prisma.XOR<Prisma.CourseBinCreateWithoutCoursesInput, Prisma.CourseBinUncheckedCreateWithoutCoursesInput>;
    connectOrCreate?: Prisma.CourseBinCreateOrConnectWithoutCoursesInput;
    upsert?: Prisma.CourseBinUpsertWithoutCoursesInput;
    connect?: Prisma.CourseBinWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.CourseBinUpdateToOneWithWhereWithoutCoursesInput, Prisma.CourseBinUpdateWithoutCoursesInput>, Prisma.CourseBinUncheckedUpdateWithoutCoursesInput>;
};
export type CourseBinCreateNestedOneWithoutUserCourseBinsInput = {
    create?: Prisma.XOR<Prisma.CourseBinCreateWithoutUserCourseBinsInput, Prisma.CourseBinUncheckedCreateWithoutUserCourseBinsInput>;
    connectOrCreate?: Prisma.CourseBinCreateOrConnectWithoutUserCourseBinsInput;
    connect?: Prisma.CourseBinWhereUniqueInput;
};
export type CourseBinUpdateOneRequiredWithoutUserCourseBinsNestedInput = {
    create?: Prisma.XOR<Prisma.CourseBinCreateWithoutUserCourseBinsInput, Prisma.CourseBinUncheckedCreateWithoutUserCourseBinsInput>;
    connectOrCreate?: Prisma.CourseBinCreateOrConnectWithoutUserCourseBinsInput;
    upsert?: Prisma.CourseBinUpsertWithoutUserCourseBinsInput;
    connect?: Prisma.CourseBinWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.CourseBinUpdateToOneWithWhereWithoutUserCourseBinsInput, Prisma.CourseBinUpdateWithoutUserCourseBinsInput>, Prisma.CourseBinUncheckedUpdateWithoutUserCourseBinsInput>;
};
export type CourseBinCreateNestedManyWithoutInvitationsInput = {
    create?: Prisma.XOR<Prisma.CourseBinCreateWithoutInvitationsInput, Prisma.CourseBinUncheckedCreateWithoutInvitationsInput> | Prisma.CourseBinCreateWithoutInvitationsInput[] | Prisma.CourseBinUncheckedCreateWithoutInvitationsInput[];
    connectOrCreate?: Prisma.CourseBinCreateOrConnectWithoutInvitationsInput | Prisma.CourseBinCreateOrConnectWithoutInvitationsInput[];
    connect?: Prisma.CourseBinWhereUniqueInput | Prisma.CourseBinWhereUniqueInput[];
};
export type CourseBinUncheckedCreateNestedManyWithoutInvitationsInput = {
    create?: Prisma.XOR<Prisma.CourseBinCreateWithoutInvitationsInput, Prisma.CourseBinUncheckedCreateWithoutInvitationsInput> | Prisma.CourseBinCreateWithoutInvitationsInput[] | Prisma.CourseBinUncheckedCreateWithoutInvitationsInput[];
    connectOrCreate?: Prisma.CourseBinCreateOrConnectWithoutInvitationsInput | Prisma.CourseBinCreateOrConnectWithoutInvitationsInput[];
    connect?: Prisma.CourseBinWhereUniqueInput | Prisma.CourseBinWhereUniqueInput[];
};
export type CourseBinUpdateManyWithoutInvitationsNestedInput = {
    create?: Prisma.XOR<Prisma.CourseBinCreateWithoutInvitationsInput, Prisma.CourseBinUncheckedCreateWithoutInvitationsInput> | Prisma.CourseBinCreateWithoutInvitationsInput[] | Prisma.CourseBinUncheckedCreateWithoutInvitationsInput[];
    connectOrCreate?: Prisma.CourseBinCreateOrConnectWithoutInvitationsInput | Prisma.CourseBinCreateOrConnectWithoutInvitationsInput[];
    upsert?: Prisma.CourseBinUpsertWithWhereUniqueWithoutInvitationsInput | Prisma.CourseBinUpsertWithWhereUniqueWithoutInvitationsInput[];
    set?: Prisma.CourseBinWhereUniqueInput | Prisma.CourseBinWhereUniqueInput[];
    disconnect?: Prisma.CourseBinWhereUniqueInput | Prisma.CourseBinWhereUniqueInput[];
    delete?: Prisma.CourseBinWhereUniqueInput | Prisma.CourseBinWhereUniqueInput[];
    connect?: Prisma.CourseBinWhereUniqueInput | Prisma.CourseBinWhereUniqueInput[];
    update?: Prisma.CourseBinUpdateWithWhereUniqueWithoutInvitationsInput | Prisma.CourseBinUpdateWithWhereUniqueWithoutInvitationsInput[];
    updateMany?: Prisma.CourseBinUpdateManyWithWhereWithoutInvitationsInput | Prisma.CourseBinUpdateManyWithWhereWithoutInvitationsInput[];
    deleteMany?: Prisma.CourseBinScalarWhereInput | Prisma.CourseBinScalarWhereInput[];
};
export type CourseBinUncheckedUpdateManyWithoutInvitationsNestedInput = {
    create?: Prisma.XOR<Prisma.CourseBinCreateWithoutInvitationsInput, Prisma.CourseBinUncheckedCreateWithoutInvitationsInput> | Prisma.CourseBinCreateWithoutInvitationsInput[] | Prisma.CourseBinUncheckedCreateWithoutInvitationsInput[];
    connectOrCreate?: Prisma.CourseBinCreateOrConnectWithoutInvitationsInput | Prisma.CourseBinCreateOrConnectWithoutInvitationsInput[];
    upsert?: Prisma.CourseBinUpsertWithWhereUniqueWithoutInvitationsInput | Prisma.CourseBinUpsertWithWhereUniqueWithoutInvitationsInput[];
    set?: Prisma.CourseBinWhereUniqueInput | Prisma.CourseBinWhereUniqueInput[];
    disconnect?: Prisma.CourseBinWhereUniqueInput | Prisma.CourseBinWhereUniqueInput[];
    delete?: Prisma.CourseBinWhereUniqueInput | Prisma.CourseBinWhereUniqueInput[];
    connect?: Prisma.CourseBinWhereUniqueInput | Prisma.CourseBinWhereUniqueInput[];
    update?: Prisma.CourseBinUpdateWithWhereUniqueWithoutInvitationsInput | Prisma.CourseBinUpdateWithWhereUniqueWithoutInvitationsInput[];
    updateMany?: Prisma.CourseBinUpdateManyWithWhereWithoutInvitationsInput | Prisma.CourseBinUpdateManyWithWhereWithoutInvitationsInput[];
    deleteMany?: Prisma.CourseBinScalarWhereInput | Prisma.CourseBinScalarWhereInput[];
};
export type CourseBinCreateWithoutInstitutionInput = {
    id?: string;
    displayName: string;
    courses?: Prisma.CourseCreateNestedManyWithoutCourseBinInput;
    predefinedCourseBin: Prisma.PredefinedCourseBinCreateNestedOneWithoutCourseBinsInput;
    userCourseBins?: Prisma.UserCourseBinCreateNestedManyWithoutCourseBinInput;
    invitations?: Prisma.InvitationCreateNestedManyWithoutCourseBinsInput;
};
export type CourseBinUncheckedCreateWithoutInstitutionInput = {
    id?: string;
    predefinedBinId: string;
    displayName: string;
    courses?: Prisma.CourseUncheckedCreateNestedManyWithoutCourseBinInput;
    userCourseBins?: Prisma.UserCourseBinUncheckedCreateNestedManyWithoutCourseBinInput;
    invitations?: Prisma.InvitationUncheckedCreateNestedManyWithoutCourseBinsInput;
};
export type CourseBinCreateOrConnectWithoutInstitutionInput = {
    where: Prisma.CourseBinWhereUniqueInput;
    create: Prisma.XOR<Prisma.CourseBinCreateWithoutInstitutionInput, Prisma.CourseBinUncheckedCreateWithoutInstitutionInput>;
};
export type CourseBinCreateManyInstitutionInputEnvelope = {
    data: Prisma.CourseBinCreateManyInstitutionInput | Prisma.CourseBinCreateManyInstitutionInput[];
    skipDuplicates?: boolean;
};
export type CourseBinUpsertWithWhereUniqueWithoutInstitutionInput = {
    where: Prisma.CourseBinWhereUniqueInput;
    update: Prisma.XOR<Prisma.CourseBinUpdateWithoutInstitutionInput, Prisma.CourseBinUncheckedUpdateWithoutInstitutionInput>;
    create: Prisma.XOR<Prisma.CourseBinCreateWithoutInstitutionInput, Prisma.CourseBinUncheckedCreateWithoutInstitutionInput>;
};
export type CourseBinUpdateWithWhereUniqueWithoutInstitutionInput = {
    where: Prisma.CourseBinWhereUniqueInput;
    data: Prisma.XOR<Prisma.CourseBinUpdateWithoutInstitutionInput, Prisma.CourseBinUncheckedUpdateWithoutInstitutionInput>;
};
export type CourseBinUpdateManyWithWhereWithoutInstitutionInput = {
    where: Prisma.CourseBinScalarWhereInput;
    data: Prisma.XOR<Prisma.CourseBinUpdateManyMutationInput, Prisma.CourseBinUncheckedUpdateManyWithoutInstitutionInput>;
};
export type CourseBinScalarWhereInput = {
    AND?: Prisma.CourseBinScalarWhereInput | Prisma.CourseBinScalarWhereInput[];
    OR?: Prisma.CourseBinScalarWhereInput[];
    NOT?: Prisma.CourseBinScalarWhereInput | Prisma.CourseBinScalarWhereInput[];
    id?: Prisma.UuidFilter<"CourseBin"> | string;
    institutionId?: Prisma.UuidFilter<"CourseBin"> | string;
    predefinedBinId?: Prisma.UuidFilter<"CourseBin"> | string;
    displayName?: Prisma.StringFilter<"CourseBin"> | string;
};
export type CourseBinCreateWithoutPredefinedCourseBinInput = {
    id?: string;
    displayName: string;
    courses?: Prisma.CourseCreateNestedManyWithoutCourseBinInput;
    institution: Prisma.InstitutionCreateNestedOneWithoutCourseBinsInput;
    userCourseBins?: Prisma.UserCourseBinCreateNestedManyWithoutCourseBinInput;
    invitations?: Prisma.InvitationCreateNestedManyWithoutCourseBinsInput;
};
export type CourseBinUncheckedCreateWithoutPredefinedCourseBinInput = {
    id?: string;
    institutionId: string;
    displayName: string;
    courses?: Prisma.CourseUncheckedCreateNestedManyWithoutCourseBinInput;
    userCourseBins?: Prisma.UserCourseBinUncheckedCreateNestedManyWithoutCourseBinInput;
    invitations?: Prisma.InvitationUncheckedCreateNestedManyWithoutCourseBinsInput;
};
export type CourseBinCreateOrConnectWithoutPredefinedCourseBinInput = {
    where: Prisma.CourseBinWhereUniqueInput;
    create: Prisma.XOR<Prisma.CourseBinCreateWithoutPredefinedCourseBinInput, Prisma.CourseBinUncheckedCreateWithoutPredefinedCourseBinInput>;
};
export type CourseBinCreateManyPredefinedCourseBinInputEnvelope = {
    data: Prisma.CourseBinCreateManyPredefinedCourseBinInput | Prisma.CourseBinCreateManyPredefinedCourseBinInput[];
    skipDuplicates?: boolean;
};
export type CourseBinUpsertWithWhereUniqueWithoutPredefinedCourseBinInput = {
    where: Prisma.CourseBinWhereUniqueInput;
    update: Prisma.XOR<Prisma.CourseBinUpdateWithoutPredefinedCourseBinInput, Prisma.CourseBinUncheckedUpdateWithoutPredefinedCourseBinInput>;
    create: Prisma.XOR<Prisma.CourseBinCreateWithoutPredefinedCourseBinInput, Prisma.CourseBinUncheckedCreateWithoutPredefinedCourseBinInput>;
};
export type CourseBinUpdateWithWhereUniqueWithoutPredefinedCourseBinInput = {
    where: Prisma.CourseBinWhereUniqueInput;
    data: Prisma.XOR<Prisma.CourseBinUpdateWithoutPredefinedCourseBinInput, Prisma.CourseBinUncheckedUpdateWithoutPredefinedCourseBinInput>;
};
export type CourseBinUpdateManyWithWhereWithoutPredefinedCourseBinInput = {
    where: Prisma.CourseBinScalarWhereInput;
    data: Prisma.XOR<Prisma.CourseBinUpdateManyMutationInput, Prisma.CourseBinUncheckedUpdateManyWithoutPredefinedCourseBinInput>;
};
export type CourseBinCreateWithoutCoursesInput = {
    id?: string;
    displayName: string;
    institution: Prisma.InstitutionCreateNestedOneWithoutCourseBinsInput;
    predefinedCourseBin: Prisma.PredefinedCourseBinCreateNestedOneWithoutCourseBinsInput;
    userCourseBins?: Prisma.UserCourseBinCreateNestedManyWithoutCourseBinInput;
    invitations?: Prisma.InvitationCreateNestedManyWithoutCourseBinsInput;
};
export type CourseBinUncheckedCreateWithoutCoursesInput = {
    id?: string;
    institutionId: string;
    predefinedBinId: string;
    displayName: string;
    userCourseBins?: Prisma.UserCourseBinUncheckedCreateNestedManyWithoutCourseBinInput;
    invitations?: Prisma.InvitationUncheckedCreateNestedManyWithoutCourseBinsInput;
};
export type CourseBinCreateOrConnectWithoutCoursesInput = {
    where: Prisma.CourseBinWhereUniqueInput;
    create: Prisma.XOR<Prisma.CourseBinCreateWithoutCoursesInput, Prisma.CourseBinUncheckedCreateWithoutCoursesInput>;
};
export type CourseBinUpsertWithoutCoursesInput = {
    update: Prisma.XOR<Prisma.CourseBinUpdateWithoutCoursesInput, Prisma.CourseBinUncheckedUpdateWithoutCoursesInput>;
    create: Prisma.XOR<Prisma.CourseBinCreateWithoutCoursesInput, Prisma.CourseBinUncheckedCreateWithoutCoursesInput>;
    where?: Prisma.CourseBinWhereInput;
};
export type CourseBinUpdateToOneWithWhereWithoutCoursesInput = {
    where?: Prisma.CourseBinWhereInput;
    data: Prisma.XOR<Prisma.CourseBinUpdateWithoutCoursesInput, Prisma.CourseBinUncheckedUpdateWithoutCoursesInput>;
};
export type CourseBinUpdateWithoutCoursesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    displayName?: Prisma.StringFieldUpdateOperationsInput | string;
    institution?: Prisma.InstitutionUpdateOneRequiredWithoutCourseBinsNestedInput;
    predefinedCourseBin?: Prisma.PredefinedCourseBinUpdateOneRequiredWithoutCourseBinsNestedInput;
    userCourseBins?: Prisma.UserCourseBinUpdateManyWithoutCourseBinNestedInput;
    invitations?: Prisma.InvitationUpdateManyWithoutCourseBinsNestedInput;
};
export type CourseBinUncheckedUpdateWithoutCoursesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    institutionId?: Prisma.StringFieldUpdateOperationsInput | string;
    predefinedBinId?: Prisma.StringFieldUpdateOperationsInput | string;
    displayName?: Prisma.StringFieldUpdateOperationsInput | string;
    userCourseBins?: Prisma.UserCourseBinUncheckedUpdateManyWithoutCourseBinNestedInput;
    invitations?: Prisma.InvitationUncheckedUpdateManyWithoutCourseBinsNestedInput;
};
export type CourseBinCreateWithoutUserCourseBinsInput = {
    id?: string;
    displayName: string;
    courses?: Prisma.CourseCreateNestedManyWithoutCourseBinInput;
    institution: Prisma.InstitutionCreateNestedOneWithoutCourseBinsInput;
    predefinedCourseBin: Prisma.PredefinedCourseBinCreateNestedOneWithoutCourseBinsInput;
    invitations?: Prisma.InvitationCreateNestedManyWithoutCourseBinsInput;
};
export type CourseBinUncheckedCreateWithoutUserCourseBinsInput = {
    id?: string;
    institutionId: string;
    predefinedBinId: string;
    displayName: string;
    courses?: Prisma.CourseUncheckedCreateNestedManyWithoutCourseBinInput;
    invitations?: Prisma.InvitationUncheckedCreateNestedManyWithoutCourseBinsInput;
};
export type CourseBinCreateOrConnectWithoutUserCourseBinsInput = {
    where: Prisma.CourseBinWhereUniqueInput;
    create: Prisma.XOR<Prisma.CourseBinCreateWithoutUserCourseBinsInput, Prisma.CourseBinUncheckedCreateWithoutUserCourseBinsInput>;
};
export type CourseBinUpsertWithoutUserCourseBinsInput = {
    update: Prisma.XOR<Prisma.CourseBinUpdateWithoutUserCourseBinsInput, Prisma.CourseBinUncheckedUpdateWithoutUserCourseBinsInput>;
    create: Prisma.XOR<Prisma.CourseBinCreateWithoutUserCourseBinsInput, Prisma.CourseBinUncheckedCreateWithoutUserCourseBinsInput>;
    where?: Prisma.CourseBinWhereInput;
};
export type CourseBinUpdateToOneWithWhereWithoutUserCourseBinsInput = {
    where?: Prisma.CourseBinWhereInput;
    data: Prisma.XOR<Prisma.CourseBinUpdateWithoutUserCourseBinsInput, Prisma.CourseBinUncheckedUpdateWithoutUserCourseBinsInput>;
};
export type CourseBinUpdateWithoutUserCourseBinsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    displayName?: Prisma.StringFieldUpdateOperationsInput | string;
    courses?: Prisma.CourseUpdateManyWithoutCourseBinNestedInput;
    institution?: Prisma.InstitutionUpdateOneRequiredWithoutCourseBinsNestedInput;
    predefinedCourseBin?: Prisma.PredefinedCourseBinUpdateOneRequiredWithoutCourseBinsNestedInput;
    invitations?: Prisma.InvitationUpdateManyWithoutCourseBinsNestedInput;
};
export type CourseBinUncheckedUpdateWithoutUserCourseBinsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    institutionId?: Prisma.StringFieldUpdateOperationsInput | string;
    predefinedBinId?: Prisma.StringFieldUpdateOperationsInput | string;
    displayName?: Prisma.StringFieldUpdateOperationsInput | string;
    courses?: Prisma.CourseUncheckedUpdateManyWithoutCourseBinNestedInput;
    invitations?: Prisma.InvitationUncheckedUpdateManyWithoutCourseBinsNestedInput;
};
export type CourseBinCreateWithoutInvitationsInput = {
    id?: string;
    displayName: string;
    courses?: Prisma.CourseCreateNestedManyWithoutCourseBinInput;
    institution: Prisma.InstitutionCreateNestedOneWithoutCourseBinsInput;
    predefinedCourseBin: Prisma.PredefinedCourseBinCreateNestedOneWithoutCourseBinsInput;
    userCourseBins?: Prisma.UserCourseBinCreateNestedManyWithoutCourseBinInput;
};
export type CourseBinUncheckedCreateWithoutInvitationsInput = {
    id?: string;
    institutionId: string;
    predefinedBinId: string;
    displayName: string;
    courses?: Prisma.CourseUncheckedCreateNestedManyWithoutCourseBinInput;
    userCourseBins?: Prisma.UserCourseBinUncheckedCreateNestedManyWithoutCourseBinInput;
};
export type CourseBinCreateOrConnectWithoutInvitationsInput = {
    where: Prisma.CourseBinWhereUniqueInput;
    create: Prisma.XOR<Prisma.CourseBinCreateWithoutInvitationsInput, Prisma.CourseBinUncheckedCreateWithoutInvitationsInput>;
};
export type CourseBinUpsertWithWhereUniqueWithoutInvitationsInput = {
    where: Prisma.CourseBinWhereUniqueInput;
    update: Prisma.XOR<Prisma.CourseBinUpdateWithoutInvitationsInput, Prisma.CourseBinUncheckedUpdateWithoutInvitationsInput>;
    create: Prisma.XOR<Prisma.CourseBinCreateWithoutInvitationsInput, Prisma.CourseBinUncheckedCreateWithoutInvitationsInput>;
};
export type CourseBinUpdateWithWhereUniqueWithoutInvitationsInput = {
    where: Prisma.CourseBinWhereUniqueInput;
    data: Prisma.XOR<Prisma.CourseBinUpdateWithoutInvitationsInput, Prisma.CourseBinUncheckedUpdateWithoutInvitationsInput>;
};
export type CourseBinUpdateManyWithWhereWithoutInvitationsInput = {
    where: Prisma.CourseBinScalarWhereInput;
    data: Prisma.XOR<Prisma.CourseBinUpdateManyMutationInput, Prisma.CourseBinUncheckedUpdateManyWithoutInvitationsInput>;
};
export type CourseBinCreateManyInstitutionInput = {
    id?: string;
    predefinedBinId: string;
    displayName: string;
};
export type CourseBinUpdateWithoutInstitutionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    displayName?: Prisma.StringFieldUpdateOperationsInput | string;
    courses?: Prisma.CourseUpdateManyWithoutCourseBinNestedInput;
    predefinedCourseBin?: Prisma.PredefinedCourseBinUpdateOneRequiredWithoutCourseBinsNestedInput;
    userCourseBins?: Prisma.UserCourseBinUpdateManyWithoutCourseBinNestedInput;
    invitations?: Prisma.InvitationUpdateManyWithoutCourseBinsNestedInput;
};
export type CourseBinUncheckedUpdateWithoutInstitutionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    predefinedBinId?: Prisma.StringFieldUpdateOperationsInput | string;
    displayName?: Prisma.StringFieldUpdateOperationsInput | string;
    courses?: Prisma.CourseUncheckedUpdateManyWithoutCourseBinNestedInput;
    userCourseBins?: Prisma.UserCourseBinUncheckedUpdateManyWithoutCourseBinNestedInput;
    invitations?: Prisma.InvitationUncheckedUpdateManyWithoutCourseBinsNestedInput;
};
export type CourseBinUncheckedUpdateManyWithoutInstitutionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    predefinedBinId?: Prisma.StringFieldUpdateOperationsInput | string;
    displayName?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type CourseBinCreateManyPredefinedCourseBinInput = {
    id?: string;
    institutionId: string;
    displayName: string;
};
export type CourseBinUpdateWithoutPredefinedCourseBinInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    displayName?: Prisma.StringFieldUpdateOperationsInput | string;
    courses?: Prisma.CourseUpdateManyWithoutCourseBinNestedInput;
    institution?: Prisma.InstitutionUpdateOneRequiredWithoutCourseBinsNestedInput;
    userCourseBins?: Prisma.UserCourseBinUpdateManyWithoutCourseBinNestedInput;
    invitations?: Prisma.InvitationUpdateManyWithoutCourseBinsNestedInput;
};
export type CourseBinUncheckedUpdateWithoutPredefinedCourseBinInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    institutionId?: Prisma.StringFieldUpdateOperationsInput | string;
    displayName?: Prisma.StringFieldUpdateOperationsInput | string;
    courses?: Prisma.CourseUncheckedUpdateManyWithoutCourseBinNestedInput;
    userCourseBins?: Prisma.UserCourseBinUncheckedUpdateManyWithoutCourseBinNestedInput;
    invitations?: Prisma.InvitationUncheckedUpdateManyWithoutCourseBinsNestedInput;
};
export type CourseBinUncheckedUpdateManyWithoutPredefinedCourseBinInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    institutionId?: Prisma.StringFieldUpdateOperationsInput | string;
    displayName?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type CourseBinUpdateWithoutInvitationsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    displayName?: Prisma.StringFieldUpdateOperationsInput | string;
    courses?: Prisma.CourseUpdateManyWithoutCourseBinNestedInput;
    institution?: Prisma.InstitutionUpdateOneRequiredWithoutCourseBinsNestedInput;
    predefinedCourseBin?: Prisma.PredefinedCourseBinUpdateOneRequiredWithoutCourseBinsNestedInput;
    userCourseBins?: Prisma.UserCourseBinUpdateManyWithoutCourseBinNestedInput;
};
export type CourseBinUncheckedUpdateWithoutInvitationsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    institutionId?: Prisma.StringFieldUpdateOperationsInput | string;
    predefinedBinId?: Prisma.StringFieldUpdateOperationsInput | string;
    displayName?: Prisma.StringFieldUpdateOperationsInput | string;
    courses?: Prisma.CourseUncheckedUpdateManyWithoutCourseBinNestedInput;
    userCourseBins?: Prisma.UserCourseBinUncheckedUpdateManyWithoutCourseBinNestedInput;
};
export type CourseBinUncheckedUpdateManyWithoutInvitationsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    institutionId?: Prisma.StringFieldUpdateOperationsInput | string;
    predefinedBinId?: Prisma.StringFieldUpdateOperationsInput | string;
    displayName?: Prisma.StringFieldUpdateOperationsInput | string;
};
/**
 * Count Type CourseBinCountOutputType
 */
export type CourseBinCountOutputType = {
    courses: number;
    userCourseBins: number;
    invitations: number;
};
export type CourseBinCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    courses?: boolean | CourseBinCountOutputTypeCountCoursesArgs;
    userCourseBins?: boolean | CourseBinCountOutputTypeCountUserCourseBinsArgs;
    invitations?: boolean | CourseBinCountOutputTypeCountInvitationsArgs;
};
/**
 * CourseBinCountOutputType without action
 */
export type CourseBinCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseBinCountOutputType
     */
    select?: Prisma.CourseBinCountOutputTypeSelect<ExtArgs> | null;
};
/**
 * CourseBinCountOutputType without action
 */
export type CourseBinCountOutputTypeCountCoursesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CourseWhereInput;
};
/**
 * CourseBinCountOutputType without action
 */
export type CourseBinCountOutputTypeCountUserCourseBinsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserCourseBinWhereInput;
};
/**
 * CourseBinCountOutputType without action
 */
export type CourseBinCountOutputTypeCountInvitationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.InvitationWhereInput;
};
export type CourseBinSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    institutionId?: boolean;
    predefinedBinId?: boolean;
    displayName?: boolean;
    courses?: boolean | Prisma.CourseBin$coursesArgs<ExtArgs>;
    institution?: boolean | Prisma.InstitutionDefaultArgs<ExtArgs>;
    predefinedCourseBin?: boolean | Prisma.PredefinedCourseBinDefaultArgs<ExtArgs>;
    userCourseBins?: boolean | Prisma.CourseBin$userCourseBinsArgs<ExtArgs>;
    invitations?: boolean | Prisma.CourseBin$invitationsArgs<ExtArgs>;
    _count?: boolean | Prisma.CourseBinCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["courseBin"]>;
export type CourseBinSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    institutionId?: boolean;
    predefinedBinId?: boolean;
    displayName?: boolean;
    institution?: boolean | Prisma.InstitutionDefaultArgs<ExtArgs>;
    predefinedCourseBin?: boolean | Prisma.PredefinedCourseBinDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["courseBin"]>;
export type CourseBinSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    institutionId?: boolean;
    predefinedBinId?: boolean;
    displayName?: boolean;
    institution?: boolean | Prisma.InstitutionDefaultArgs<ExtArgs>;
    predefinedCourseBin?: boolean | Prisma.PredefinedCourseBinDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["courseBin"]>;
export type CourseBinSelectScalar = {
    id?: boolean;
    institutionId?: boolean;
    predefinedBinId?: boolean;
    displayName?: boolean;
};
export type CourseBinOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "institutionId" | "predefinedBinId" | "displayName", ExtArgs["result"]["courseBin"]>;
export type CourseBinInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    courses?: boolean | Prisma.CourseBin$coursesArgs<ExtArgs>;
    institution?: boolean | Prisma.InstitutionDefaultArgs<ExtArgs>;
    predefinedCourseBin?: boolean | Prisma.PredefinedCourseBinDefaultArgs<ExtArgs>;
    userCourseBins?: boolean | Prisma.CourseBin$userCourseBinsArgs<ExtArgs>;
    invitations?: boolean | Prisma.CourseBin$invitationsArgs<ExtArgs>;
    _count?: boolean | Prisma.CourseBinCountOutputTypeDefaultArgs<ExtArgs>;
};
export type CourseBinIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    institution?: boolean | Prisma.InstitutionDefaultArgs<ExtArgs>;
    predefinedCourseBin?: boolean | Prisma.PredefinedCourseBinDefaultArgs<ExtArgs>;
};
export type CourseBinIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    institution?: boolean | Prisma.InstitutionDefaultArgs<ExtArgs>;
    predefinedCourseBin?: boolean | Prisma.PredefinedCourseBinDefaultArgs<ExtArgs>;
};
export type $CourseBinPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "CourseBin";
    objects: {
        courses: Prisma.$CoursePayload<ExtArgs>[];
        institution: Prisma.$InstitutionPayload<ExtArgs>;
        predefinedCourseBin: Prisma.$PredefinedCourseBinPayload<ExtArgs>;
        userCourseBins: Prisma.$UserCourseBinPayload<ExtArgs>[];
        invitations: Prisma.$InvitationPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        institutionId: string;
        predefinedBinId: string;
        displayName: string;
    }, ExtArgs["result"]["courseBin"]>;
    composites: {};
};
export type CourseBinGetPayload<S extends boolean | null | undefined | CourseBinDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$CourseBinPayload, S>;
export type CourseBinCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<CourseBinFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: CourseBinCountAggregateInputType | true;
};
export interface CourseBinDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['CourseBin'];
        meta: {
            name: 'CourseBin';
        };
    };
    /**
     * Find zero or one CourseBin that matches the filter.
     * @param {CourseBinFindUniqueArgs} args - Arguments to find a CourseBin
     * @example
     * // Get one CourseBin
     * const courseBin = await prisma.courseBin.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CourseBinFindUniqueArgs>(args: Prisma.SelectSubset<T, CourseBinFindUniqueArgs<ExtArgs>>): Prisma.Prisma__CourseBinClient<runtime.Types.Result.GetResult<Prisma.$CourseBinPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find one CourseBin that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CourseBinFindUniqueOrThrowArgs} args - Arguments to find a CourseBin
     * @example
     * // Get one CourseBin
     * const courseBin = await prisma.courseBin.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CourseBinFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, CourseBinFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__CourseBinClient<runtime.Types.Result.GetResult<Prisma.$CourseBinPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first CourseBin that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseBinFindFirstArgs} args - Arguments to find a CourseBin
     * @example
     * // Get one CourseBin
     * const courseBin = await prisma.courseBin.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CourseBinFindFirstArgs>(args?: Prisma.SelectSubset<T, CourseBinFindFirstArgs<ExtArgs>>): Prisma.Prisma__CourseBinClient<runtime.Types.Result.GetResult<Prisma.$CourseBinPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    /**
     * Find the first CourseBin that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseBinFindFirstOrThrowArgs} args - Arguments to find a CourseBin
     * @example
     * // Get one CourseBin
     * const courseBin = await prisma.courseBin.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CourseBinFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, CourseBinFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__CourseBinClient<runtime.Types.Result.GetResult<Prisma.$CourseBinPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Find zero or more CourseBins that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseBinFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all CourseBins
     * const courseBins = await prisma.courseBin.findMany()
     *
     * // Get first 10 CourseBins
     * const courseBins = await prisma.courseBin.findMany({ take: 10 })
     *
     * // Only select the `id`
     * const courseBinWithIdOnly = await prisma.courseBin.findMany({ select: { id: true } })
     *
     */
    findMany<T extends CourseBinFindManyArgs>(args?: Prisma.SelectSubset<T, CourseBinFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CourseBinPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    /**
     * Create a CourseBin.
     * @param {CourseBinCreateArgs} args - Arguments to create a CourseBin.
     * @example
     * // Create one CourseBin
     * const CourseBin = await prisma.courseBin.create({
     *   data: {
     *     // ... data to create a CourseBin
     *   }
     * })
     *
     */
    create<T extends CourseBinCreateArgs>(args: Prisma.SelectSubset<T, CourseBinCreateArgs<ExtArgs>>): Prisma.Prisma__CourseBinClient<runtime.Types.Result.GetResult<Prisma.$CourseBinPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Create many CourseBins.
     * @param {CourseBinCreateManyArgs} args - Arguments to create many CourseBins.
     * @example
     * // Create many CourseBins
     * const courseBin = await prisma.courseBin.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     */
    createMany<T extends CourseBinCreateManyArgs>(args?: Prisma.SelectSubset<T, CourseBinCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Create many CourseBins and returns the data saved in the database.
     * @param {CourseBinCreateManyAndReturnArgs} args - Arguments to create many CourseBins.
     * @example
     * // Create many CourseBins
     * const courseBin = await prisma.courseBin.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Create many CourseBins and only return the `id`
     * const courseBinWithIdOnly = await prisma.courseBin.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     *
     */
    createManyAndReturn<T extends CourseBinCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, CourseBinCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CourseBinPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    /**
     * Delete a CourseBin.
     * @param {CourseBinDeleteArgs} args - Arguments to delete one CourseBin.
     * @example
     * // Delete one CourseBin
     * const CourseBin = await prisma.courseBin.delete({
     *   where: {
     *     // ... filter to delete one CourseBin
     *   }
     * })
     *
     */
    delete<T extends CourseBinDeleteArgs>(args: Prisma.SelectSubset<T, CourseBinDeleteArgs<ExtArgs>>): Prisma.Prisma__CourseBinClient<runtime.Types.Result.GetResult<Prisma.$CourseBinPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Update one CourseBin.
     * @param {CourseBinUpdateArgs} args - Arguments to update one CourseBin.
     * @example
     * // Update one CourseBin
     * const courseBin = await prisma.courseBin.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    update<T extends CourseBinUpdateArgs>(args: Prisma.SelectSubset<T, CourseBinUpdateArgs<ExtArgs>>): Prisma.Prisma__CourseBinClient<runtime.Types.Result.GetResult<Prisma.$CourseBinPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Delete zero or more CourseBins.
     * @param {CourseBinDeleteManyArgs} args - Arguments to filter CourseBins to delete.
     * @example
     * // Delete a few CourseBins
     * const { count } = await prisma.courseBin.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     *
     */
    deleteMany<T extends CourseBinDeleteManyArgs>(args?: Prisma.SelectSubset<T, CourseBinDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more CourseBins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseBinUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many CourseBins
     * const courseBin = await prisma.courseBin.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     *
     */
    updateMany<T extends CourseBinUpdateManyArgs>(args: Prisma.SelectSubset<T, CourseBinUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    /**
     * Update zero or more CourseBins and returns the data updated in the database.
     * @param {CourseBinUpdateManyAndReturnArgs} args - Arguments to update many CourseBins.
     * @example
     * // Update many CourseBins
     * const courseBin = await prisma.courseBin.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *
     * // Update zero or more CourseBins and only return the `id`
     * const courseBinWithIdOnly = await prisma.courseBin.updateManyAndReturn({
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
    updateManyAndReturn<T extends CourseBinUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, CourseBinUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CourseBinPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    /**
     * Create or update one CourseBin.
     * @param {CourseBinUpsertArgs} args - Arguments to update or create a CourseBin.
     * @example
     * // Update or create a CourseBin
     * const courseBin = await prisma.courseBin.upsert({
     *   create: {
     *     // ... data to create a CourseBin
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the CourseBin we want to update
     *   }
     * })
     */
    upsert<T extends CourseBinUpsertArgs>(args: Prisma.SelectSubset<T, CourseBinUpsertArgs<ExtArgs>>): Prisma.Prisma__CourseBinClient<runtime.Types.Result.GetResult<Prisma.$CourseBinPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    /**
     * Count the number of CourseBins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseBinCountArgs} args - Arguments to filter CourseBins to count.
     * @example
     * // Count the number of CourseBins
     * const count = await prisma.courseBin.count({
     *   where: {
     *     // ... the filter for the CourseBins we want to count
     *   }
     * })
    **/
    count<T extends CourseBinCountArgs>(args?: Prisma.Subset<T, CourseBinCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], CourseBinCountAggregateOutputType> : number>;
    /**
     * Allows you to perform aggregations operations on a CourseBin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseBinAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends CourseBinAggregateArgs>(args: Prisma.Subset<T, CourseBinAggregateArgs>): Prisma.PrismaPromise<GetCourseBinAggregateType<T>>;
    /**
     * Group by CourseBin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CourseBinGroupByArgs} args - Group by arguments.
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
    groupBy<T extends CourseBinGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: CourseBinGroupByArgs['orderBy'];
    } : {
        orderBy?: CourseBinGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, CourseBinGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCourseBinGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    /**
     * Fields of the CourseBin model
     */
    readonly fields: CourseBinFieldRefs;
}
/**
 * The delegate class that acts as a "Promise-like" for CourseBin.
 * Why is this prefixed with `Prisma__`?
 * Because we want to prevent naming conflicts as mentioned in
 * https://github.com/prisma/prisma-client-js/issues/707
 */
export interface Prisma__CourseBinClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    courses<T extends Prisma.CourseBin$coursesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CourseBin$coursesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CoursePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    institution<T extends Prisma.InstitutionDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.InstitutionDefaultArgs<ExtArgs>>): Prisma.Prisma__InstitutionClient<runtime.Types.Result.GetResult<Prisma.$InstitutionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    predefinedCourseBin<T extends Prisma.PredefinedCourseBinDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.PredefinedCourseBinDefaultArgs<ExtArgs>>): Prisma.Prisma__PredefinedCourseBinClient<runtime.Types.Result.GetResult<Prisma.$PredefinedCourseBinPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    userCourseBins<T extends Prisma.CourseBin$userCourseBinsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CourseBin$userCourseBinsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserCourseBinPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    invitations<T extends Prisma.CourseBin$invitationsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CourseBin$invitationsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$InvitationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
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
 * Fields of the CourseBin model
 */
export interface CourseBinFieldRefs {
    readonly id: Prisma.FieldRef<"CourseBin", 'String'>;
    readonly institutionId: Prisma.FieldRef<"CourseBin", 'String'>;
    readonly predefinedBinId: Prisma.FieldRef<"CourseBin", 'String'>;
    readonly displayName: Prisma.FieldRef<"CourseBin", 'String'>;
}
/**
 * CourseBin findUnique
 */
export type CourseBinFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which CourseBin to fetch.
     */
    where: Prisma.CourseBinWhereUniqueInput;
};
/**
 * CourseBin findUniqueOrThrow
 */
export type CourseBinFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which CourseBin to fetch.
     */
    where: Prisma.CourseBinWhereUniqueInput;
};
/**
 * CourseBin findFirst
 */
export type CourseBinFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which CourseBin to fetch.
     */
    where?: Prisma.CourseBinWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of CourseBins to fetch.
     */
    orderBy?: Prisma.CourseBinOrderByWithRelationInput | Prisma.CourseBinOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for CourseBins.
     */
    cursor?: Prisma.CourseBinWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` CourseBins from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` CourseBins.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of CourseBins.
     */
    distinct?: Prisma.CourseBinScalarFieldEnum | Prisma.CourseBinScalarFieldEnum[];
};
/**
 * CourseBin findFirstOrThrow
 */
export type CourseBinFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which CourseBin to fetch.
     */
    where?: Prisma.CourseBinWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of CourseBins to fetch.
     */
    orderBy?: Prisma.CourseBinOrderByWithRelationInput | Prisma.CourseBinOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for searching for CourseBins.
     */
    cursor?: Prisma.CourseBinWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` CourseBins from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` CourseBins.
     */
    skip?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     *
     * Filter by unique combinations of CourseBins.
     */
    distinct?: Prisma.CourseBinScalarFieldEnum | Prisma.CourseBinScalarFieldEnum[];
};
/**
 * CourseBin findMany
 */
export type CourseBinFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter, which CourseBins to fetch.
     */
    where?: Prisma.CourseBinWhereInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     *
     * Determine the order of CourseBins to fetch.
     */
    orderBy?: Prisma.CourseBinOrderByWithRelationInput | Prisma.CourseBinOrderByWithRelationInput[];
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     *
     * Sets the position for listing CourseBins.
     */
    cursor?: Prisma.CourseBinWhereUniqueInput;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Take `±n` CourseBins from the position of the cursor.
     */
    take?: number;
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     *
     * Skip the first `n` CourseBins.
     */
    skip?: number;
    distinct?: Prisma.CourseBinScalarFieldEnum | Prisma.CourseBinScalarFieldEnum[];
};
/**
 * CourseBin create
 */
export type CourseBinCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to create a CourseBin.
     */
    data: Prisma.XOR<Prisma.CourseBinCreateInput, Prisma.CourseBinUncheckedCreateInput>;
};
/**
 * CourseBin createMany
 */
export type CourseBinCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to create many CourseBins.
     */
    data: Prisma.CourseBinCreateManyInput | Prisma.CourseBinCreateManyInput[];
    skipDuplicates?: boolean;
};
/**
 * CourseBin createManyAndReturn
 */
export type CourseBinCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseBin
     */
    select?: Prisma.CourseBinSelectCreateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the CourseBin
     */
    omit?: Prisma.CourseBinOmit<ExtArgs> | null;
    /**
     * The data used to create many CourseBins.
     */
    data: Prisma.CourseBinCreateManyInput | Prisma.CourseBinCreateManyInput[];
    skipDuplicates?: boolean;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.CourseBinIncludeCreateManyAndReturn<ExtArgs> | null;
};
/**
 * CourseBin update
 */
export type CourseBinUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The data needed to update a CourseBin.
     */
    data: Prisma.XOR<Prisma.CourseBinUpdateInput, Prisma.CourseBinUncheckedUpdateInput>;
    /**
     * Choose, which CourseBin to update.
     */
    where: Prisma.CourseBinWhereUniqueInput;
};
/**
 * CourseBin updateMany
 */
export type CourseBinUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * The data used to update CourseBins.
     */
    data: Prisma.XOR<Prisma.CourseBinUpdateManyMutationInput, Prisma.CourseBinUncheckedUpdateManyInput>;
    /**
     * Filter which CourseBins to update
     */
    where?: Prisma.CourseBinWhereInput;
    /**
     * Limit how many CourseBins to update.
     */
    limit?: number;
};
/**
 * CourseBin updateManyAndReturn
 */
export type CourseBinUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the CourseBin
     */
    select?: Prisma.CourseBinSelectUpdateManyAndReturn<ExtArgs> | null;
    /**
     * Omit specific fields from the CourseBin
     */
    omit?: Prisma.CourseBinOmit<ExtArgs> | null;
    /**
     * The data used to update CourseBins.
     */
    data: Prisma.XOR<Prisma.CourseBinUpdateManyMutationInput, Prisma.CourseBinUncheckedUpdateManyInput>;
    /**
     * Filter which CourseBins to update
     */
    where?: Prisma.CourseBinWhereInput;
    /**
     * Limit how many CourseBins to update.
     */
    limit?: number;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.CourseBinIncludeUpdateManyAndReturn<ExtArgs> | null;
};
/**
 * CourseBin upsert
 */
export type CourseBinUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * The filter to search for the CourseBin to update in case it exists.
     */
    where: Prisma.CourseBinWhereUniqueInput;
    /**
     * In case the CourseBin found by the `where` argument doesn't exist, create a new CourseBin with this data.
     */
    create: Prisma.XOR<Prisma.CourseBinCreateInput, Prisma.CourseBinUncheckedCreateInput>;
    /**
     * In case the CourseBin was found with the provided `where` argument, update it with this data.
     */
    update: Prisma.XOR<Prisma.CourseBinUpdateInput, Prisma.CourseBinUncheckedUpdateInput>;
};
/**
 * CourseBin delete
 */
export type CourseBinDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    /**
     * Filter which CourseBin to delete.
     */
    where: Prisma.CourseBinWhereUniqueInput;
};
/**
 * CourseBin deleteMany
 */
export type CourseBinDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Filter which CourseBins to delete
     */
    where?: Prisma.CourseBinWhereInput;
    /**
     * Limit how many CourseBins to delete.
     */
    limit?: number;
};
/**
 * CourseBin.courses
 */
export type CourseBin$coursesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Course
     */
    select?: Prisma.CourseSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Course
     */
    omit?: Prisma.CourseOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.CourseInclude<ExtArgs> | null;
    where?: Prisma.CourseWhereInput;
    orderBy?: Prisma.CourseOrderByWithRelationInput | Prisma.CourseOrderByWithRelationInput[];
    cursor?: Prisma.CourseWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CourseScalarFieldEnum | Prisma.CourseScalarFieldEnum[];
};
/**
 * CourseBin.userCourseBins
 */
export type CourseBin$userCourseBinsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
    where?: Prisma.UserCourseBinWhereInput;
    orderBy?: Prisma.UserCourseBinOrderByWithRelationInput | Prisma.UserCourseBinOrderByWithRelationInput[];
    cursor?: Prisma.UserCourseBinWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserCourseBinScalarFieldEnum | Prisma.UserCourseBinScalarFieldEnum[];
};
/**
 * CourseBin.invitations
 */
export type CourseBin$invitationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invitation
     */
    select?: Prisma.InvitationSelect<ExtArgs> | null;
    /**
     * Omit specific fields from the Invitation
     */
    omit?: Prisma.InvitationOmit<ExtArgs> | null;
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: Prisma.InvitationInclude<ExtArgs> | null;
    where?: Prisma.InvitationWhereInput;
    orderBy?: Prisma.InvitationOrderByWithRelationInput | Prisma.InvitationOrderByWithRelationInput[];
    cursor?: Prisma.InvitationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.InvitationScalarFieldEnum | Prisma.InvitationScalarFieldEnum[];
};
/**
 * CourseBin without action
 */
export type CourseBinDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
};
export {};
//# sourceMappingURL=CourseBin.d.ts.map