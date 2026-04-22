import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useMemo, useState } from 'react';
import { AdminAuthGuard } from '../../Middleware/auth';
import ResponseGraphFilters from '../local_leader/analytics/ResponseGraphFilters';
import { buildResponseFilterSummaryLines } from '../local_leader/analytics/responseGraphFilterSummary';
import {
  createInitialResponseGraphFilter,
  RESPONSE_CONTEXT_GENERAL_KEY,
  type ResponseGraphFilterValue,
} from '../local_leader/analytics/responseGraphFilterTypes';
import { useFetchAllRubrics } from '@utils/hooks/rubrics/useFetchAllRubrics';
import { useFetchRubricAnalyticsContext } from '@utils/hooks/rubrics/useFetchRubricAnalyticsContext';
import { executeDownloadResponseExport } from '@utils/hooks/responses/executeDownloadResponseExport';
import { useFetchUser } from '@utils/hooks/auth/useFetchUser';

export default function ResponseDataExportPage() {
  const { user } = useFetchUser();
  const { rubrics, isLoadingRubrics, hasRubricsError } = useFetchAllRubrics();
  const rubricList = rubrics ?? [];
  const [filter, setFilter] = useState<ResponseGraphFilterValue>(createInitialResponseGraphFilter);
  const [isDownloading, setIsDownloading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const rubricIdForContexts =
    user?.role === 'LOCAL_LEADER' && filter.rubricId ? filter.rubricId : '';
  const {
    localLeaderContexts,
    isLoading: isLoadingContexts,
    hasError: hasContextsError,
  } = useFetchRubricAnalyticsContext(rubricIdForContexts);

  const institutionResponseContextOptions = useMemo(() => {
    return localLeaderContexts.map((row) => ({
      key: row.isGeneralAssignment
        ? RESPONSE_CONTEXT_GENERAL_KEY
        : (row.courseBinId ?? RESPONSE_CONTEXT_GENERAL_KEY),
      label: row.isGeneralAssignment ? 'General' : (row.courseBinDisplayName ?? 'Course bin'),
    }));
  }, [localLeaderContexts]);

  const summaryLines = buildResponseFilterSummaryLines(
    rubricList,
    filter,
    user?.role === 'LOCAL_LEADER' && filter.rubricId ? institutionResponseContextOptions : undefined
  );

  const handleDownloadCsv = async () => {
    setErrorMessage(null);
    setIsDownloading(true);
    try {
      const result = await executeDownloadResponseExport({
        rubricId: filter.rubricId,
        sectionKey: filter.sectionKey,
        scaleId: filter.scaleId,
        rubricVersionIds: filter.rubricVersionIds,
        responseContextKeys: filter.responseContextKeys,
      });
      if (!result.ok) {
        setErrorMessage(result.errorMessage ?? 'Export failed.');
      }
    } finally {
      setIsDownloading(false);
    }
  };

  const scopeDescription =
    user?.role === 'LOCAL_LEADER'
      ? 'You will only download submitted responses from people at your institution. The file is UTF-8 CSV (opens in Excel).'
      : 'You will download submitted responses from all institutions. The file is UTF-8 CSV (opens in Excel).';

  return (
    <AdminAuthGuard>
      <Stack spacing={2.5} sx={{ maxWidth: 960 }}>
        <Stack spacing={0.5}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Export response data
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Choose a rubric, optional section and scale, then download a single CSV with merged IDs
            and labels (rubric, version, scale, respondent, institution, and course bin fields).
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {scopeDescription}
          </Typography>
        </Stack>

        {errorMessage ? (
          <Alert severity="error" onClose={() => setErrorMessage(null)}>
            {errorMessage}
          </Alert>
        ) : null}

        <Paper variant="outlined" sx={{ p: 2 }}>
          <ResponseGraphFilters
            rubrics={rubricList}
            isLoadingRubrics={isLoadingRubrics}
            hasRubricsError={hasRubricsError}
            value={filter}
            onChange={setFilter}
            institutionResponseContextOptions={
              user?.role === 'LOCAL_LEADER' && filter.rubricId
                ? institutionResponseContextOptions
                : undefined
            }
            isLoadingInstitutionContexts={
              Boolean(user?.role === 'LOCAL_LEADER' && filter.rubricId) && isLoadingContexts
            }
            hasInstitutionContextsError={
              Boolean(user?.role === 'LOCAL_LEADER' && filter.rubricId) && hasContextsError
            }
          />
        </Paper>

        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Current scope
          </Typography>
          <Stack component="ul" spacing={0.5} sx={{ m: 0, pl: 2 }}>
            {summaryLines.map((line) => (
              <Typography key={line} component="li" variant="body2" color="text.secondary">
                {line}
              </Typography>
            ))}
          </Stack>
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              startIcon={<FileDownloadOutlinedIcon />}
              disabled={!filter.rubricId || isDownloading}
              onClick={() => void handleDownloadCsv()}
            >
              {isDownloading ? 'Preparing…' : 'Download CSV'}
            </Button>
          </Box>
        </Paper>
      </Stack>
    </AdminAuthGuard>
  );
}
