'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase-browser';
import { differenceInCalendarDays } from 'date-fns';

type Credential = {
  id: string;
  name: string;
  type: string;
  expiry_date: string;
  assigned_to: string | null;
  team_members?: { name: string } | null;
};

function statusFor(days: number) {
  if (days < 14) return 'red';
  if (days < 45) return 'amber';
  return 'green';
}

export default function DashboardPage() {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'License', expiry_date: '' });

  async function loadCredentials() {
    setLoading(true);
    const res = await fetch('/api/credentials');
    const data = await res.json();
    setCredentials(data.credentials || []);
    setLoading(false);
  }

  useEffect(() => {
    // Confirm the user is actually signed in; send them to /login if not
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        window.location.href = '/login';
      } else {
        loadCredentials();
      }
    });
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('/api/credentials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.status === 403) {
      const data = await res.json();
      setShowModal(false);
      alert(data.message || "You've hit the free trial limit. Upgrade to add more credentials.");
      return;
    }
    setShowModal(false);
    setForm({ name: '', type: 'License', expiry_date: '' });
    loadCredentials();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/credentials/${id}`, { method: 'DELETE' });
    loadCredentials();
  }

  async function handleUpgrade(plan: 'solo' | 'team') {
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  }

  const withDays = credentials
    .map((c) => ({ ...c, days: differenceInCalendarDays(new Date(c.expiry_date), new Date()) }))
    .sort((a, b) => a.days - b.days);

  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22 }}>VoltKeep</h1>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => handleUpgrade('solo')} style={{ padding: '8px 14px', fontSize: 13, border: '1px solid #ccc', borderRadius: 6, background: '#fff', cursor: 'pointer' }}>
            Upgrade to Solo — $29/mo
          </button>
          <button onClick={() => setShowModal(true)} style={{ padding: '8px 14px', fontSize: 13, border: 'none', borderRadius: 6, background: '#14201C', color: '#fff', cursor: 'pointer' }}>
            + Add credential
          </button>
        </div>
      </div>

      {!loading && withDays.length < 3 && (
        <div style={{ background: '#FFF8E8', border: '1px solid #F0DFA8', borderRadius: 8, padding: '10px 16px', marginBottom: 20, fontSize: 13, color: '#7A5B15' }}>
          Free trial — {withDays.length} of 3 credentials used. Upgrade anytime for unlimited tracking.
        </div>
      )}
      {!loading && withDays.length >= 3 && (
        <div style={{ background: '#FDEEEC', border: '1px solid #F0C4BE', borderRadius: 8, padding: '10px 16px', marginBottom: 20, fontSize: 13, color: '#A73C31' }}>
          You've used all 3 free trial credentials. <a href="#" onClick={(e) => { e.preventDefault(); handleUpgrade('solo'); }} style={{ color: '#A73C31', fontWeight: 600 }}>Upgrade to Solo</a> to add more.
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : withDays.length === 0 ? (
        <p style={{ color: '#666' }}>No credentials yet. Add your first license, cert, insurance policy, or bond.</p>
      ) : (
        <div style={{ border: '1px solid #e2e2e2', borderRadius: 10 }}>
          {withDays.map((c) => {
            const status = statusFor(c.days);
            const color = status === 'red' ? '#C24A3F' : status === 'amber' ? '#D9A441' : '#4C9A6A';
            return (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', borderBottom: '1px solid #eee' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{c.name}</div>
                  <div style={{ fontSize: 12, color: '#888' }}>{c.type} · {c.team_members?.name || 'Unassigned'}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <span style={{ color, fontWeight: 600, fontSize: 13 }}>
                    {c.days < 0 ? 'Expired' : `${c.days} days`}
                  </span>
                  <button onClick={() => handleDelete(c.id)} style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', fontSize: 13 }}>
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <form onSubmit={handleAdd} style={{ background: '#fff', padding: 24, borderRadius: 10, width: 340 }}>
            <h2 style={{ fontSize: 16, marginBottom: 16 }}>Add credential</h2>
            <input
              required placeholder="Credential name"
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={{ width: '100%', padding: 8, marginBottom: 10, border: '1px solid #ccc', borderRadius: 6 }}
            />
            <select
              value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
              style={{ width: '100%', padding: 8, marginBottom: 10, border: '1px solid #ccc', borderRadius: 6 }}
            >
              <option>License</option><option>Certification</option><option>Insurance policy</option><option>Surety bond</option><option>Other</option>
            </select>
            <input
              required type="date"
              value={form.expiry_date} onChange={(e) => setForm({ ...form, expiry_date: e.target.value })}
              style={{ width: '100%', padding: 8, marginBottom: 16, border: '1px solid #ccc', borderRadius: 6 }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button type="button" onClick={() => setShowModal(false)} style={{ padding: '8px 14px', border: '1px solid #ccc', borderRadius: 6, background: '#fff', cursor: 'pointer' }}>Cancel</button>
              <button type="submit" style={{ padding: '8px 14px', border: 'none', borderRadius: 6, background: '#14201C', color: '#fff', cursor: 'pointer' }}>Save</button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
