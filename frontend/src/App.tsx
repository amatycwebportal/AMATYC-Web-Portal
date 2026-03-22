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
import PredefinedCourseBins from './features/admin/pages/project_lead/predefined-course-bins/predefined-course-bins';
function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/sign-in" replace />} />
      <Route path="/sign-in" element={<SignIn />} />

      {/* All routes that use MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/profile" element={<Profile />} />

        <Route path="/rubrics">
          <Route path="completed" element={<CompletedRubrics />} />
          <Route path="assigned" element={<AssignedRubrics />} />
          <Route path="in-progress" element={<InProgressRubrics />} />
        </Route>

        <Route path="/admin">
          <Route path="project-lead" element={<ProjectLeadDashboard />} />
          <Route path="project-lead/rubrics">
            <Route index element={<ProjectLeadViewRubrics />} />
          </Route>
          <Route path="project-lead/course-bins">
            <Route index element={<PredefinedCourseBins />} />
          </Route>
          <Route path="local-leader" element={<LocalLeadDashboard />} />
          <Route path="local-leader/rubrics">
            <Route index element={<LocalLeadViewRubrics />} />
            <Route path="assignment" element={<RubricAssignment />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
