import { Alert, Box, Button, CircularProgress, Stack, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';
import ConsecutiveSnackbars, {
  ConsecutiveSnackbarsHandle,
  MessageStatus,
} from '@utils/components/ConsecutiveSnackBars';
import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { RubricRow } from '../../components/ViewAllRubricsTemplateView';
import { useFetchRubricVersion } from '@utils/hooks/rubrics/useFetchRubricVersion';
import { useFetchUser } from '@utils/hooks/auth/useFetchUser';
import { useFetchInstitutionCourseBins } from '@utils/hooks/courseBins/useFetchInstitutionCourseBins';
import type { Response, RubricScale } from '@shared/types';
import { useGetUserRubricResponses } from '@utils/hooks/responses/useGetUserRubricResponses';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
function buildNormalizedResponses({
  draftResponses,
  scales,
  userPredefinedBinIds,
}: {
  draftResponses: Response[];
  scales: Array<{ id: string; isGlobal: boolean; binIds?: string[]; prompt: string }>;
  userPredefinedBinIds: string[];
}): { normalizedResponses: Response[]; missingScalePrompts: string[] } {
  void scales;
  void userPredefinedBinIds;

  const normalizedResponses = draftResponses.map((responseRow) => ({
    ...responseRow,
    predefinedBinId: null,
  }));

  return { normalizedResponses, missingScalePrompts: [] };
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
      (leftRow.predefinedBinId ?? null) === (rightRow.predefinedBinId ?? null) &&
      (leftRow.justification ?? '') === (rightRow.justification ?? '')
    );
  });
}

export default function WorkingRubric() {
  const { rubricVersionId } = useParams<{ rubricVersionId: string }>();
  const [searchParams] = useSearchParams();
  const [responses, setResponses] = useState<Response[]>([]);
  const snackbarsRef = useRef<ConsecutiveSnackbarsHandle>(null);
  const navigate = useNavigate();
  const safeRubricVersionId = rubricVersionId ?? '';
  const assignmentContextLabel = searchParams.get('assignmentContext') ?? 'Global';
  const courseBinId = searchParams.get('courseBinId');
  const { rubricVersion, isLoadingRubricVersion, hasRubricVersionError } =
    useFetchRubricVersion(safeRubricVersionId);
  const { user } = useFetchUser();
  const { courseBins, isLoadingCourseBins } = useFetchInstitutionCourseBins(user?.institutionId);
  const {
    responses: draftResponses,
    isLoadingResponses: loadingDraftResponses,
    hasResponsesError: hasDraftResponsesError,
    refetch: refetchUserResponses,
  } = useGetUserRubricResponses(user?.id ?? '', safeRubricVersionId, courseBinId);

  const isEntirelySubmitted = useMemo(() => {
    if (!draftResponses || draftResponses.length === 0) return false;
    return draftResponses.every((row) => row.status === 'SUBMITTED');
  }, [draftResponses]);

  const [isReopenRequestPending, setIsReopenRequestPending] = useState(false);

  const executeReopenForEdit = useCallback(async () => {
    if (!user || !rubricVersionId) return;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    if (!backendUrl) throw new Error('Missing backend URL');

    const res = await fetch(`${backendUrl}/rubrics/responses/reopen-for-edit`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, rubricVersionId, courseBinId: courseBinId ?? null }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(typeof data.error === 'string' ? data.error : 'Failed to reopen for editing');
    }
    refetchUserResponses();
  }, [user, rubricVersionId, courseBinId, refetchUserResponses]);

  const handleReopenForEdit = async () => {
    try {
      setIsReopenRequestPending(true);
      await executeReopenForEdit();
      snackbarsRef.current?.enqueue({
        status: MessageStatus.SUCCESS,
        message: 'You can edit your responses again',
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Could not reopen for editing';
      snackbarsRef.current?.enqueue({
        status: MessageStatus.ERROR,
        message,
      });
    } finally {
      setIsReopenRequestPending(false);
    }
  };

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
        body: JSON.stringify({
          responses: normalizedResponses,
          userId: user.id,
          courseBinId: courseBinId ?? null,
        }),
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
          courseBinId: courseBinId ?? null,
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
    // All scales are global now.
    void scale;
    return true;
  };

  const availableScales = rubricVersion.scales.filter((scale) => shouldShowScaleForUser(scale));
  const isComplete = availableScales.every((scale) =>
    responses.some((r) => r.scaleVersionId === scale.id)
  );

  return (
    <Box>
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="h4">Working Rubric</Typography>
          <Typography variant="body2" color="text.secondary">
            {rubricVersion.title}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h3" color="text.secondary">
              This assessment is assigned for {assignmentContextLabel}
            </Typography>
          </Box>
        </Box>
        {isEntirelySubmitted ? (
          <Button
            variant="contained"
            color="secondary"
            disabled={isReopenRequestPending}
            onClick={handleReopenForEdit}
          >
            Edit response
          </Button>
        ) : null}
      </Stack>

      {isEntirelySubmitted ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          You have submitted this rubric. Your answers are shown below. To change anything, click
          Edit response — your assignment will move back to in progress until you submit again.
        </Alert>
      ) : null}

      <RubricRow
        rubric={rubricVersion}
        isExpanded={true}
        isEditable={false}
        updateRubricUpdate={() => {}}
        isResponding={true}
        setResponses={setResponses}
        responses={responses}
        isResponseInteractionsLocked={isEntirelySubmitted}
        respondingContext={{
          rubricVersionId,
          userPredefinedBinIds: userPredefinedBinIdsFromCourseBins,
        }}
      />
      {!isEntirelySubmitted ? (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
          <Button
            variant="contained"
            color="primary"
            disabled={!isComplete || isLoadingCourseBins}
            onClick={handleSubmitResponses}
          >
            Submit
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={responses.length === 0 || isLoadingCourseBins}
            onClick={handleSaveDraft}
          >
            Save Draft
          </Button>
        </Box>
      ) : null}
      <ConsecutiveSnackbars ref={snackbarsRef} />
    </Box>
  );
}
