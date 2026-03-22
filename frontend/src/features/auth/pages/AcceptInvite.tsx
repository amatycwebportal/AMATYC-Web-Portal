import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export default function AcceptInvite() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !backendUrl) return;

    const run = async () => {
      // First check if user is authenticated
      const authRes = await fetch(`${backendUrl}/auth/user`, {
        credentials: 'include',
      });

      if (!authRes.ok) {
        // Not logged in — go sign in first, preserving the token
        navigate(`/sign-in?token=${token}`);
        return;
      }

      // Authenticated — accept the invite
      const acceptRes = await fetch(`${backendUrl}/invitations/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ token }),
      });

      if (acceptRes.ok) {
        navigate('/profile');
      } else {
        const errorData = await acceptRes.json();
        console.error('Failed to accept invite', errorData);
      }
    };

    run();
  }, [token]);

  return <div>Accepting invite...</div>;
}
