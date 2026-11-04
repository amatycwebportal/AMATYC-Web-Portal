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
import type { Response, RubricScale } from '@shared/types';
import { GENERAL_PATHWAY_ID } from '@shared/pathways';
import { useGetUserRubricResponses } from '@utils/hooks/responses/useGetUserRubricResponses';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
function buildNormalizedResponses({
  draftResponses,
}: {
  draftResponses: Response[];
}): { normalizedResponses: Response[]; missingScalePrompts: string[] } {
  const normalizedResponses = draftResponses.map((responseRow) => ({
    ...responseRow,
    pathwayId: responseRow.pathwayId,
  }));

  return { normalizedResponses, missingScalePrompts: [] };
}

function hasRequiredJustification(justification: string | null | undefined): boolean {
  return (justification ?? '').trim().length > 0;
}

function areRubricResponsesComplete(
  scales: Array<{ id: string }>,
  draftResponses: Response[]
): boolean {
  return scales.every((scale) =>
    draftResponses.some(
      (responseRow) =>
        responseRow.scaleVersionId === scale.id &&
        hasRequiredJustification(responseRow.justification)
    )
  );
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
      (leftRow.pathwayId ?? null) === (rightRow.pathwayId ?? null) &&
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
  const assignmentContextLabel = searchParams.get('assignmentContext') ?? 'General';
  const pathwayId = searchParams.get('pathwayId') || GENERAL_PATHWAY_ID;
  const { rubricVersion, isLoadingRubricVersion, hasRubricVersionError } =
    useFetchRubricVersion(safeRubricVersionId);
  const { user } = useFetchUser();
  const {
    responses: draftResponses,
    isLoadingResponses: loadingDraftResponses,
    hasResponsesError: hasDraftResponsesError,
    refetch: refetchUserResponses,
  } = useGetUserRubricResponses(user?.id ?? '', safeRubricVersionId, pathwayId);

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
      body: JSON.stringify({ userId: user.id, rubricVersionId, pathwayId }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(typeof data.error === 'string' ? data.error : 'Failed to reopen for editing');
    }
    refetchUserResponses();
  }, [user, rubricVersionId, pathwayId, refetchUserResponses]);

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

  useEffect(() => {
    if (!draftResponses) return;
    if (!rubricVersion) {
      setResponses((prev) => (areResponsesEqual(prev, draftResponses) ? prev : draftResponses));
      return;
    }
    const { normalizedResponses } = buildNormalizedResponses({
      draftResponses,
    });
    setResponses((prev) =>
      areResponsesEqual(prev, normalizedResponses) ? prev : normalizedResponses
    );
  }, [draftResponses, rubricVersion]);

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

      const { normalizedResponses } = buildNormalizedResponses({
        draftResponses: responses,
      });

      const res = await fetch(`${backendUrl}/rubrics/responses/save-draft`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          responses: normalizedResponses,
          userId: user.id,
          pathwayId,
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
      if (!areRubricResponsesComplete(rubricVersion.scales, responses)) {
        throw new Error('Justification is required for each criterion');
      }

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
          pathwayId,
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
  const isComplete = areRubricResponsesComplete(availableScales, responses);

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
          rubricVersionId: safeRubricVersionId,
          pathwayId,
        }}
      />
      {!isEntirelySubmitted ? (
        <Box
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', mt: 2, gap: 1 }}
        >
          {!isComplete ? (
            <Typography variant="body2" color="text.secondary">
              Select a rating and enter a justification for every criterion before submitting.
            </Typography>
          ) : null}
          <Box sx={{ display: 'flex', gap: 1 }}>
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
        </Box>
      ) : null}
      <ConsecutiveSnackbars ref={snackbarsRef} />
    </Box>
  );
}
