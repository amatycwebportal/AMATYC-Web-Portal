import LocalLeaderStubTool from './LocalLeaderStubTool';

export function ParticipationAnalyticsPage() {
  return (
    <LocalLeaderStubTool
      title="Participation analytics"
      description="Review enrollment, activity, and rubric completion trends for your institution. Charts and exports will appear here once reporting is connected."
    />
  );
}

export function RubricAnalyticsPage() {
  return (
    <LocalLeaderStubTool
      title="Rubric analytics"
      description="Explore scoring patterns, agreement, and how rubrics are used across courses. Deeper breakdowns will be added as the analytics pipeline is built out."
    />
  );
}

export function ConsensusMeetingPage() {
  return (
    <LocalLeaderStubTool
      title="Consensus meeting"
      description="Prepare calibration sessions, capture meeting notes, and align raters on standards. Scheduling and shared agendas will be available here."
    />
  );
}
