import { Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './features/auth/pages/SignIn';
import Profile from './features/auth/pages/Profile';
import MainLayout from './layout/MainLayout';
import CompletedRubrics from './features/rubrics/pages/CompletedRubrics';
import AssignedRubrics from './features/rubrics/pages/AssignedRubrics';
import InProgressRubrics from './features/rubrics/pages/InProgressRubrics';
import AdminDashboard from './features/admin/pages/AdminDashboard';
import ViewAllRubrics from './features/admin/pages/ViewAllRubrics';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/sign-in" replace />} />

      <Route path="/sign-in" element={<SignIn />} />

      <Route
        path="/profile"
        element={
          <MainLayout>
            <Profile />
          </MainLayout>
        }
      />
      <Route
        path="/rubrics/completed"
        element={
          <MainLayout>
            <CompletedRubrics />
          </MainLayout>
        }
      />
      <Route
        path="/rubrics/assigned"
        element={
          <MainLayout>
            <AssignedRubrics />
          </MainLayout>
        }
      />
      <Route
        path="/rubrics/in-progress"
        element={
          <MainLayout>
            <InProgressRubrics />
          </MainLayout>
        }
      />
      <Route
        path="/admin"
        element={
          <MainLayout>
            <AdminDashboard />
          </MainLayout>
        }
      />
      <Route
        path="/admin/rubrics"
        element={
          <MainLayout>
            <ViewAllRubrics />
          </MainLayout>
        }
      />
    </Routes>
  );
}

export default App;
