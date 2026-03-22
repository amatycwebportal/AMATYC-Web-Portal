import { Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './features/auth/pages/SignIn';
import Profile from './features/auth/pages/Profile';
import MainLayout from './layout/MainLayout';
import CompletedRubrics from './features/rubrics/pages/CompletedRubrics';
import AssignedRubrics from './features/rubrics/pages/AssignedRubrics';
import InProgressRubrics from './features/rubrics/pages/InProgressRubrics';
import AdminDashboard from './features/admin/pages/AdminDashboard';
import ViewAllRubrics from './features/admin/pages/rubrics/ViewAllRubrics';
import ViewAllRubricsTemplateView from './features/admin/pages/rubrics/ViewAllRubricsTemplateView';
import RubricAssignment from './features/admin/pages/rubrics/RubricAssignment';
import CreateInstitution from './features/admin/pages/institutions/CreateInstitution';
import AcceptInvite from './features/auth/pages/AcceptInvite';
import InviteUsers from './features/admin/pages/users/InviteUsers';
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
        </Route>

        <Route path="/admin">
          <Route index element={<AdminDashboard />} />
          <Route path="rubrics">
            <Route index element={<ViewAllRubrics />} />
            <Route path="template" element={<ViewAllRubricsTemplateView />} />
            <Route path="assignment" element={<RubricAssignment />} />
          </Route>
          <Route path="institutions">
            <Route index element={<CreateInstitution />} />
          </Route>
          <Route path="users">
            <Route index element={<InviteUsers />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
