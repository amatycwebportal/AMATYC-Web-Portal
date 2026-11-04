import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import { Alert, Button, Tooltip } from '@mui/material';
import { useCallback, useState, type RefObject } from 'react';
import { executeDownloadElementAsHtml } from '@utils/export/executeDownloadElementAsHtml';
import { CONSENSUS_OVERVIEW_EXPORT_EXCLUDE_ATTR } from '@utils/export/consensusOverviewExportAttributes';
import { buildConsensusOverviewHtmlFilename } from './buildConsensusOverviewHtmlFilename';

export type UseConsensusGeneralOverviewHtmlDownloadParams = {
  exportRootRef: RefObject<HTMLDivElement | null>;
  documentTitle: string;
  filenameScopeSlug: string;
  isDownloadEnabled: boolean;
};

export function useConsensusGeneralOverviewHtmlDownload({
  exportRootRef,
  documentTitle,
  filenameScopeSlug,
  isDownloadEnabled,
}: UseConsensusGeneralOverviewHtmlDownloadParams) {
  const [isDownloadingHtml, setIsDownloadingHtml] = useState(false);
  const [htmlDownloadError, setHtmlDownloadError] = useState<string | null>(null);

  const handleDownloadHtml = useCallback(async () => {
    const exportRoot = exportRootRef.current;
    if (!exportRoot) {
      return;
    }

    setHtmlDownloadError(null);
    setIsDownloadingHtml(true);

    const filename = buildConsensusOverviewHtmlFilename(filenameScopeSlug);
    const result = await executeDownloadElementAsHtml({
      element: exportRoot,
      filename,
      documentTitle,
    });

    setIsDownloadingHtml(false);
    if (!result.ok) {
      setHtmlDownloadError(result.errorMessage ?? 'Could not download HTML.');
    }
  }, [documentTitle, exportRootRef, filenameScopeSlug]);

  const downloadHtmlButton = (
    <Tooltip title="Download this overview as a standalone HTML file (tables, legend, and scope text).">
      <span>
        <Button
          variant="outlined"
          size="small"
          startIcon={<FileDownloadOutlinedIcon />}
          onClick={() => void handleDownloadHtml()}
          disabled={!isDownloadEnabled || isDownloadingHtml}
          {...{ [CONSENSUS_OVERVIEW_EXPORT_EXCLUDE_ATTR]: true }}
        >
          {isDownloadingHtml ? 'Preparing…' : 'Download HTML'}
        </Button>
      </span>
    </Tooltip>
  );

  const htmlDownloadErrorAlert = htmlDownloadError ? (
    <Alert severity="warning" onClose={() => setHtmlDownloadError(null)} sx={{ mt: 1 }}>
      {htmlDownloadError}
    </Alert>
  ) : null;

  return {
    downloadHtmlButton,
    htmlDownloadErrorAlert,
    handleDownloadHtml,
    isDownloadingHtml,
    htmlDownloadError,
  };
}
