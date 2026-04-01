import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import ConsecutiveSnackbars, {
  ConsecutiveSnackbarsHandle,
  MessageStatus,
} from '@utils/components/ConsecutiveSnackBars';
import { useRef, useState, useEffect, useMemo } from 'react';
import { RubricRow } from '../../components/ViewAllRubricsTemplateView';
import { useFetchRubricVersion } from '@utils/hooks/rubrics/useFetchRubricVersion';
import { useFetchUser } from '@utils/hooks/auth/useFetchUser';
import type { Response, RubricScale } from '@shared/types';
import { useFetchInstitutionCourseBins } from '@utils/hooks/courseBins/useFetchInstitutionCourseBins';
import { useGetUserRubricResponses } from '@utils/hooks/responses/useGetUserRubricResponses';
import { useNavigate } from 'react-router-dom';
function buildNormalizedResponses({
  draftResponses,
  scales,
  userPredefinedBinIds,
}: {
  draftResponses: Response[];
  scales: Array<{ id: string; isGlobal: boolean; binIds?: string[]; prompt: string }>;
  userPredefinedBinIds: string[];
}): { normalizedResponses: Response[]; missingScalePrompts: string[] } {
  const scaleById = new Map(scales.map((scale) => [scale.id, scale]));
  const userBinIds = new Set(userPredefinedBinIds);
  const missingScalePrompts: string[] = [];

  const normalizedResponses = draftResponses.map((responseRow) => {
    const scale = scaleById.get(responseRow.scaleVersionId);
    if (!scale) return responseRow;
    if (scale.isGlobal) {
      return {
        ...responseRow,
        predefinedBinId: null,
      };
    }

    const scaleBinIds = scale.binIds ?? [];
    const matchingUserBinId = scaleBinIds.find((binId) => userBinIds.has(binId));
    const effectivePredefinedBinId = responseRow.predefinedBinId ?? matchingUserBinId ?? null;
    if (!effectivePredefinedBinId) {
      missingScalePrompts.push(scale.prompt);
    }
    return {
      ...responseRow,
      predefinedBinId: effectivePredefinedBinId,
    };
  });

  return { normalizedResponses, missingScalePrompts };
}

function areResponsesEqual(left: Response[], right: Response[]): boolean {
  if (left.length !== right.length) return false;
  return left.every((leftRow, index) => {
    const rightRow = right[index];
    if (!rightRow) return false;
    return (
      leftRow.scaleVersionId === rightRow.scaleVersionId &&
      leftRow.rubricVersionId === rightRow.rubricVersionId &&
      leftRow.score === rightRow.score &&
      (leftRow.predefinedBinId ?? null) === (rightRow.predefinedBinId ?? null)
    );
  });
}

export default function WorkingRubric() {
  const { rubricVersionId } = useParams<{ rubricVersionId: string }>();
  const [responses, setResponses] = useState<Response[]>([]);
  const snackbarsRef = useRef<ConsecutiveSnackbarsHandle>(null);
  const navigate = useNavigate();
  const safeRubricVersionId = rubricVersionId ?? '';
  const { rubricVersion, isLoadingRubricVersion, hasRubricVersionError } =
    useFetchRubricVersion(safeRubricVersionId);
  const { user } = useFetchUser();
  const { courseBins } = useFetchInstitutionCourseBins(user?.institutionId);
  const {
    responses: draftResponses,
    isLoadingResponses: loadingDraftResponses,
    hasResponsesError: hasDraftResponsesError,
  } = useGetUserRubricResponses(user?.id ?? '', safeRubricVersionId);

  const userPredefinedBinIdsFromCourseBins = useMemo(
    () =>
      (user?.userCourseBins ?? [])
        .map(
          (userCourseBin) =>
            (courseBins ?? []).find((courseBin) => courseBin.id === userCourseBin.courseBinId)
              ?.predefinedBinId
        )
        .filter((predefinedBinId): predefinedBinId is string => Boolean(predefinedBinId)),
    [user?.userCourseBins, courseBins]
  );

  useEffect(() => {
    if (!draftResponses) return;
    if (!rubricVersion) {
      setResponses((prev) => (areResponsesEqual(prev, draftResponses) ? prev : draftResponses));
      return;
    }
    const { normalizedResponses } = buildNormalizedResponses({
      draftResponses,
      scales: rubricVersion.scales,
      userPredefinedBinIds: userPredefinedBinIdsFromCourseBins,
    });
    setResponses((prev) =>
      areResponsesEqual(prev, normalizedResponses) ? prev : normalizedResponses
    );
  }, [draftResponses, rubricVersion, userPredefinedBinIdsFromCourseBins]);

  if (!rubricVersionId)
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        Rubric version ID not found
      </Box>
    );
  if (isLoadingRubricVersion)
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <CircularProgress />
      </Box>
    );
  if (hasRubricVersionError)
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        Error loading rubric
      </Box>
    );
  if (!rubricVersion)
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        Rubric not found
      </Box>
    );
  if (loadingDraftResponses)
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        Loading draft responses...
      </Box>
    );
  if (hasDraftResponsesError)
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        Error loading draft responses
      </Box>
    );
  if (!user)
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        User not found
      </Box>
    );

  const handleSaveDraft = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      if (!backendUrl) throw new Error('Missing backend URL');

      const { normalizedResponses, missingScalePrompts } = buildNormalizedResponses({
        draftResponses: responses,
        scales: rubricVersion.scales,
        userPredefinedBinIds: userPredefinedBinIdsFromCourseBins,
      });
      if (missingScalePrompts.length > 0) {
        throw new Error(
          `Missing predefined bin for non-global scales: ${missingScalePrompts.join(', ')}`
        );
      }

      const res = await fetch(`${backendUrl}/rubrics/responses/save-draft`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ responses: normalizedResponses, userId: user.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        snackbarsRef.current?.enqueue({
          status: MessageStatus.ERROR,
          message: data.error || 'Failed to save draft',
        });
        throw new Error(data.error || 'Failed to save draft');
      }

      snackbarsRef.current?.enqueue({
        status: MessageStatus.SUCCESS,
        message: 'Draft saved',
      });

      navigate(`/rubrics/in-progress`);
    } catch (error: any) {
      console.log(error);
      snackbarsRef.current?.enqueue({
        status: MessageStatus.ERROR,
        message: error.message || 'Failed to save draft',
      });
    }
  };

  const handleSubmitResponses = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      if (!backendUrl) throw new Error('Missing backend URL');

      const res = await fetch(`${backendUrl}/rubrics/responses/submit`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          rubricVersionId,
          responses: responses,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit responses');
      }

      snackbarsRef.current?.enqueue({
        status: MessageStatus.SUCCESS,
        message: 'Responses submitted',
      });
      navigate('/rubrics/completed');
    } catch (error: any) {
      console.error(error);
      snackbarsRef.current?.enqueue({
        status: MessageStatus.ERROR,
        message: error.message || 'Submission failed',
      });
    }
  };

  const shouldShowScaleForUser = (scale: RubricScale): boolean => {
    if (scale.isGlobal) return true;
    const scaleBinIds = scale.binIds ?? [];
    return scaleBinIds.some((binId) => userPredefinedBinIdsFromCourseBins.includes(binId));
  };

  const availableScales = rubricVersion.scales.filter((scale) => shouldShowScaleForUser(scale));
  const isComplete = availableScales.every((scale) =>
    responses.some((r) => r.scaleVersionId === scale.id)
  );

  console.log(rubricVersion);
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Working Rubric
      </Typography>
      <RubricRow
        rubric={rubricVersion}
        isExpanded={true}
        isEditable={false}
        updateRubricUpdate={() => {}}
        isResponding={true}
        setResponses={setResponses}
        responses={responses}
        respondingContext={{
          rubricVersionId,
          userPredefinedBinIds: userPredefinedBinIdsFromCourseBins,
        }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          disabled={!isComplete}
          onClick={handleSubmitResponses}
        >
          Submit
        </Button>
        <Button
          variant="contained"
          color="primary"
          disabled={responses.length === 0}
          onClick={handleSaveDraft}
        >
          Save Draft
        </Button>
      </Box>
      <ConsecutiveSnackbars ref={snackbarsRef} />
    </Box>
  );
}
