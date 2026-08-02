'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase-browser';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [showEmail, setShowEmail] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    });

    setLoading(false);
    if (error) setError(error.message);
    else setSent(true);
  }

  async function handleOAuth(provider: 'google' | 'azure') {
    setOauthLoading(provider);
    setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) {
      setError(error.message);
      setOauthLoading(null);
    }
  }

  const btnStyle: React.CSSProperties = {
    width: '100%', padding: '13px 16px', marginBottom: 12,
    background: '#fff', border: '1px solid rgba(20,32,28,0.14)', borderRadius: 12,
    cursor: 'pointer', fontSize: 14.5, fontWeight: 600, color: '#14201C',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
  };

  return (
    <div style={{ background: '#FAFAF8', minHeight: '100vh', fontFamily: "'IBM Plex Sans', system-ui, sans-serif" }}>
      <main style={{ maxWidth: 380, margin: '0 auto', padding: '80px 20px 40px', textAlign: 'center' }}>
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          background: 'linear-gradient(135deg, #D9A441, #C6892A)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px', fontSize: 26,
        }}>⚡</div>

        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 28, color: '#14201C' }}>
          Get started with VoltKeep
        </h1>

        {sent ? (
          <p style={{ fontSize: 14, color: '#14201C' }}>
            Check your inbox — click the link we sent to <strong>{email}</strong> to finish signing in.
          </p>
        ) : (
          <>
            <button onClick={() => handleOAuth('google')} disabled={!!oauthLoading} style={btnStyle}>
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 01-1.8 2.71v2.26h2.9c1.7-1.57 2.7-3.87 2.7-6.61z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 009 18z"/>
                <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 013.68 9c0-.59.1-1.17.27-1.7V4.97H.96A9 9 0 000 9c0 1.45.35 2.83.96 4.03l2.99-2.33z"/>
                <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.46 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 00.96 4.97l2.99 2.33C4.66 5.17 6.65 3.58 9 3.58z"/>
              </svg>
              {oauthLoading === 'google' ? 'Redirecting…' : 'Continue with Google'}
            </button>

            <button onClick={() => handleOAuth('azure')} disabled={!!oauthLoading} style={btnStyle}>
              <svg width="16" height="16" viewBox="0 0 16 16">
                <rect x="0" y="0" width="7" height="7" fill="#F25022"/>
                <rect x="9" y="0" width="7" height="7" fill="#7FBA00"/>
                <rect x="0" y="9" width="7" height="7" fill="#00A4EF"/>
                <rect x="9" y="9" width="7" height="7" fill="#FFB900"/>
              </svg>
              {oauthLoading === 'azure' ? 'Redirecting…' : 'Continue with Microsoft'}
            </button>

            {!showEmail ? (
              <button onClick={() => setShowEmail(true)} style={btnStyle}>
                ✉️ Continue with email
              </button>
            ) : (
              <form onSubmit={handleLogin} style={{ textAlign: 'left', marginTop: 4 }}>
                <input
                  type="email"
                  required
                  autoFocus
                  placeholder="you@yourbusiness.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: 12, marginBottom: 10, border: '1px solid rgba(20,32,28,0.14)', borderRadius: 12, fontSize: 14, boxSizing: 'border-box' }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  style={{ width: '100%', padding: 12, background: '#D9A441', color: '#fff', border: 'none', borderRadius: 12, cursor: loading ? 'not-allowed' : 'pointer', fontSize: 14, fontWeight: 700 }}
                >
                  {loading ? 'Sending…' : 'Send login link'}
                </button>
              </form>
            )}

            {error && <p style={{ color: '#C24A3F', fontSize: 13, marginTop: 14 }}>{error}</p>}
          </>
        )}
      </main>
    </div>
  );
}
