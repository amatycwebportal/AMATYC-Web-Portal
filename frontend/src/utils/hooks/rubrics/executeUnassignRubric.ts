type UnassignRubricParams = {
  rubricId: string;
  userId: string;
  courseBinId: string | null;
};

type UnassignRubricResult =
  | { isSuccess: true; message: string }
  | { isSuccess: false; error: string };

export async function executeUnassignRubric(
  params: UnassignRubricParams
): Promise<UnassignRubricResult> {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (!backendUrl) {
    return { isSuccess: false, error: 'Backend URL is not configured.' };
  }

  try {
    const response = await fetch(`${backendUrl}/rubrics/unassign`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rubricId: params.rubricId,
        userId: params.userId,
        courseBinId: params.courseBinId,
      }),
    });

    const data = (await response.json()) as { message?: string; error?: string };
    if (!response.ok) {
      return { isSuccess: false, error: data.error ?? 'Failed to unassign rubric' };
    }

    return { isSuccess: true, message: data.message ?? 'Rubric unassigned successfully' };
  } catch {
    return { isSuccess: false, error: 'Failed to unassign rubric' };
  }
}
