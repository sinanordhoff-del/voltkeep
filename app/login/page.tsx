'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase-browser';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  }

  return (
    <main style={{ maxWidth: 380, margin: '80px auto', padding: '0 20px', fontFamily: 'system-ui, sans-serif' }}>
      <h1 style={{ fontSize: 22, marginBottom: 8 }}>VoltKeep</h1>
      <p style={{ color: '#666', marginBottom: 24, fontSize: 14 }}>
        Sign in with your email — no password needed. We'll send you a link.
      </p>

      {sent ? (
        <p style={{ fontSize: 14 }}>
          Check your inbox — click the link we sent to <strong>{email}</strong> to finish signing in.
        </p>
      ) : (
        <form onSubmit={handleLogin}>
          <input
            type="email"
            required
            placeholder="you@yourbusiness.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: 10, marginBottom: 12, border: '1px solid #ccc', borderRadius: 6, fontSize: 14 }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: 10, background: '#14201C', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 14 }}
          >
            {loading ? 'Sending...' : 'Send login link'}
          </button>
          {error && <p style={{ color: 'crimson', fontSize: 13, marginTop: 10 }}>{error}</p>}
        </form>
      )}
    </main>
  );
}
