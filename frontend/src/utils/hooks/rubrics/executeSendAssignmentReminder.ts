type SendAssignmentReminderArgs = {
  userId: string;
  rubricId: string;
  pathwayId: string;
};

type SendAssignmentReminderResult =
  | { isSuccess: true; message: string }
  | { isSuccess: false; error: string };

export async function executeSendAssignmentReminder(
  args: SendAssignmentReminderArgs
): Promise<SendAssignmentReminderResult> {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  if (!backendUrl) {
    return { isSuccess: false, error: 'Backend URL is not configured.' };
  }

  try {
    const response = await fetch(`${backendUrl}/rubrics/assignments/remind`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: args.userId,
        rubricId: args.rubricId,
        pathwayId: args.pathwayId,
      }),
    });
    const data = (await response.json()) as { sent?: boolean; error?: string };
    if (!response.ok) {
      return { isSuccess: false, error: data.error ?? 'Failed to send reminder.' };
    }
    return { isSuccess: true, message: 'Reminder sent.' };
  } catch {
    return { isSuccess: false, error: 'Failed to send reminder.' };
  }
}
