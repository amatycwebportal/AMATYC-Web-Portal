export type DownloadResponseExportParams = {
  rubricId: string;
  sectionKey: string;
  scaleId: string;
  /** Omitted or empty = all rubric versions. */
  rubricVersionIds?: string[];
};

export type DownloadResponseExportResult = {
  ok: boolean;
  errorMessage?: string;
};

export async function executeDownloadResponseExport(
  params: DownloadResponseExportParams
): Promise<DownloadResponseExportResult> {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (!backendUrl) {
    return { ok: false, errorMessage: 'Backend URL is not configured.' };
  }
  if (!params.rubricId) {
    return { ok: false, errorMessage: 'Select a rubric first.' };
  }

  const query = new URLSearchParams({
    rubricId: params.rubricId,
    sectionKey: params.sectionKey,
    scaleId: params.scaleId,
  });
  if (params.rubricVersionIds && params.rubricVersionIds.length > 0) {
    query.set('rubricVersionIds', params.rubricVersionIds.join(','));
  }
  const response = await fetch(`${backendUrl}/rubrics/response-export?${query.toString()}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    let errorMessage = 'Export failed.';
    try {
      const body = (await response.json()) as { error?: string; details?: string };
      if (body.error) {
        errorMessage = body.details ? `${body.error}: ${body.details}` : body.error;
      }
    } catch {
      /* response may not be JSON */
    }
    return { ok: false, errorMessage };
  }

  const blob = await response.blob();
  const disposition = response.headers.get('Content-Disposition');
  let filename = 'rubric-responses.csv';
  if (disposition) {
    const quoted = disposition.match(/filename="([^"]+)"/);
    const unquoted = disposition.match(/filename=([^;]+)/);
    const raw = quoted?.[1] ?? unquoted?.[1];
    if (raw) {
      filename = raw.trim();
    }
  }

  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(objectUrl);
  return { ok: true };
}
