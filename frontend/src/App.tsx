import { Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './features/auth/pages/SignIn';
import Profile from './features/auth/pages/Profile';
// import other pages as added them

function App() {
  return (
    <Routes>
      {/* default route */}
      <Route path="/" element={<Navigate to="/sign-in" replace />} />

      {/* auth feature routes */}
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/profile" element={<Profile />} />
      {/* example: <Route path="/forgot-password" element={<ForgotPasswordPage />} /> */}
    </Routes>
  );
}

export default App;