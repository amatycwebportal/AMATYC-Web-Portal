import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { hasAcceptedPrivacyConsent } from '@shared/privacyPolicy';

export default function AcceptInvite() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const hasStartedAcceptRef = useRef(false);

  useEffect(() => {
    if (!token || !backendUrl) return;
    if (hasStartedAcceptRef.current) return;
    hasStartedAcceptRef.current = true;

    const run = async () => {
      const signInReturnTo = `/sign-in?token=${encodeURIComponent(token)}`;
      const acceptInviteReturnTo = `/accept-invite?token=${encodeURIComponent(token)}`;

      const authRes = await fetch(`${backendUrl}/auth/user`, {
        credentials: 'include',
      });

      if (!authRes.ok) {
        navigate(`/privacy-consent?returnTo=${encodeURIComponent(signInReturnTo)}`, {
          replace: true,
        });
        return;
      }

      const authData = (await authRes.json()) as {
        user?: {
          privacyConsentAcceptedAt?: string | null;
          privacyPolicyVersion?: string | null;
        };
      };

      if (!authData.user || !hasAcceptedPrivacyConsent(authData.user)) {
        navigate(`/privacy-consent?returnTo=${encodeURIComponent(acceptInviteReturnTo)}`, {
          replace: true,
        });
        return;
      }

      const acceptRes = await fetch(`${backendUrl}/invitations/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ token }),
      });

      if (acceptRes.ok) {
        navigate('/profile', { replace: true });
      } else if (acceptRes.status === 403) {
        navigate(`/privacy-consent?returnTo=${encodeURIComponent(acceptInviteReturnTo)}`, {
          replace: true,
        });
      } else {
        const errorData = await acceptRes.json();
        console.error('Failed to accept invite', errorData);
      }
    };

    run();
  }, [backendUrl, navigate, token]);

  return <div>Accepting invite...</div>;
}
