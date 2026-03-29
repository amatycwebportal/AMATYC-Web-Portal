import { Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './features/auth/pages/SignIn';
import Profile from './features/auth/pages/Profile';
import MainLayout from './layout/MainLayout';
import CompletedRubrics from './features/rubrics/pages/CompletedRubrics';
import AssignedRubrics from './features/rubrics/pages/AssignedRubrics';
import InProgressRubrics from './features/rubrics/pages/InProgressRubrics';
import ProjectLeadViewRubrics from './features/admin/pages/project_lead/rubrics/ViewAllRubrics';
import LocalLeadViewRubrics from './features/admin/pages/local_leader/rubrics/ViewAllRubrics';
import RubricAssignment from './features/admin/pages/local_leader/rubrics/RubricAssignment';
import ProjectLeadDashboard from './features/admin/pages/project_lead/ProjectLeadDashboard';
import LocalLeadDashboard from './features/admin/pages/local_leader/LocalLeadDashboard';
import {
  ParticipationAnalyticsPage,
  RubricAnalyticsPage,
  ConsensusMeetingPage,
} from './features/admin/pages/local_leader/LocalLeaderAnalyticsPages';
import PredefinedCourseBins from './features/admin/pages/project_lead/predefined-course-bins/predefined-course-bins';
import CourseBins from './features/admin/pages/local_leader/course-bins/CourseBins';
import AcceptInvite from './features/auth/pages/AcceptInvite';
import CreateInstitution from './features/admin/pages/institutions/CreateInstitution';
import InviteUsers from './features/admin/pages/users/InviteUsers';
import ManageUsers from './features/admin/pages/users/ManageUsers';
import EditRubric from './features/admin/pages/project_lead/rubrics/:id/EditRubric';
import WorkingRubric from './features/rubrics/pages/:id/WorkingRubric';
function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/sign-in" replace />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/accept-invite/" element={<AcceptInvite />} />
      {/* All routes that use MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/profile" element={<Profile />} />

        <Route path="/rubrics">
          <Route path="completed" element={<CompletedRubrics />} />
          <Route path="assigned" element={<AssignedRubrics />} />
          <Route path="in-progress" element={<InProgressRubrics />} />
          <Route path=":rubricVersionId/working" element={<WorkingRubric />} />
        </Route>

        <Route path="/admin">
          <Route path="project-lead" element={<ProjectLeadDashboard />} />
          <Route path="project-lead/rubrics">
            <Route index element={<ProjectLeadViewRubrics />} />
            <Route path=":rubricId/EditRubric" element={<EditRubric />} />
          </Route>
          <Route path="project-lead/course-bins">
            <Route index element={<PredefinedCourseBins />} />
          </Route>
          <Route path="local-leader" element={<LocalLeadDashboard />} />
          <Route path="local-leader/rubrics">
            <Route index element={<LocalLeadViewRubrics />} />
            <Route path="assignment" element={<RubricAssignment />} />
          </Route>
          <Route path="institutions">
            <Route index element={<CreateInstitution />} />
          </Route>
          <Route path="users">
            <Route index element={<InviteUsers />} />
            <Route path="manage" element={<ManageUsers />} />
          </Route>
          <Route path="local-leader/course-bins">
            <Route index element={<CourseBins />} />
          </Route>
          <Route
            path="local-leader/analytics/participation"
            element={<ParticipationAnalyticsPage />}
          />
          <Route path="local-leader/analytics/rubrics" element={<RubricAnalyticsPage />} />
          <Route path="local-leader/consensus-meeting" element={<ConsensusMeetingPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
