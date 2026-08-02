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
  document_url: string | null;
  team_members?: { name: string } | null;
};

function statusFor(days: number) {
  if (days < 14) return 'red';
  if (days < 45) return 'amber';
  return 'green';
}

const COLORS: Record<string, string> = { red: '#C24A3F', amber: '#D9A441', green: '#4C9A6A' };

export default function DashboardPage() {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'License', expiry_date: '' });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  async function loadCredentials() {
    setLoading(true);
    const res = await fetch('/api/credentials');
    const data = await res.json();
    setCredentials(data.credentials || []);
    setLoading(false);
  }

  useEffect(() => {
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
    const data = await res.json();

    if (file && data.credential?.id) {
      setUploading(true);
      const supabase = createClient();
      const filePath = `${data.credential.id}/${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('credential-documents')
        .upload(filePath, file, { upsert: true });

      if (!uploadError) {
        await fetch(`/api/credentials/${data.credential.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ document_url: filePath }),
        });
      } else {
        alert('Credential saved, but the document upload failed: ' + uploadError.message);
      }
      setUploading(false);
    }

    setShowModal(false);
    setForm({ name: '', type: 'License', expiry_date: '' });
    setFile(null);
    loadCredentials();
  }

  async function handleDownload(documentUrl: string) {
    const supabase = createClient();
    const { data, error } = await supabase.storage
      .from('credential-documents')
      .createSignedUrl(documentUrl, 60);
    if (data?.signedUrl) {
      window.open(data.signedUrl, '_blank');
    } else {
      alert('Could not open document: ' + error?.message);
    }
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

  const counts = { red: 0, amber: 0, green: 0 } as Record<string, number>;
  withDays.forEach((c) => counts[statusFor(c.days)]++);
  const trialUsed = Math.min(withDays.length, 3);

  return (
    <div style={{ background: '#FAFAF8', minHeight: '100vh', fontFamily: "'IBM Plex Sans', system-ui, sans-serif" }}>
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 20px 60px', color: '#14201C' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800, fontSize: 20, fontFamily: "'Libre Franklin', sans-serif" }}>
            <span style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #D9A441, #C6892A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15 }}>⚡</span>
            VoltKeep
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={() => handleUpgrade('solo')} style={{ padding: '11px 18px', fontSize: 13.5, fontWeight: 600, border: '1px solid rgba(20,32,28,0.14)', borderRadius: 24, background: '#fff', color: '#14201C', cursor: 'pointer' }}>
              Upgrade to Solo — $29/mo
            </button>
            <button onClick={() => setShowModal(true)} style={{ padding: '11px 18px', fontSize: 13.5, fontWeight: 700, border: 'none', borderRadius: 24, background: '#D9A441', color: '#fff', cursor: 'pointer', boxShadow: '0 6px 18px rgba(217,164,65,0.3)' }}>
              + Add credential
            </button>
          </div>
        </div>

        {!loading && withDays.length < 3 && (
          <div style={{ background: 'rgba(217,164,65,0.08)', border: '1px solid rgba(217,164,65,0.3)', borderRadius: 14, padding: '14px 18px', marginBottom: 24, fontSize: 13.5, color: '#8A6620', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span>Free trial — {withDays.length} of 3 credentials used. Upgrade anytime for unlimited tracking.</span>
            <div style={{ flex: 1, minWidth: 140, height: 5, background: 'rgba(20,32,28,0.08)', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(trialUsed / 3) * 100}%`, background: '#D9A441', borderRadius: 10 }} />
            </div>
          </div>
        )}
        {!loading && withDays.length >= 3 && (
          <div style={{ background: 'rgba(194,74,63,0.07)', border: '1px solid rgba(194,74,63,0.25)', borderRadius: 14, padding: '14px 18px', marginBottom: 24, fontSize: 13.5, color: '#A73C31' }}>
            You've used all 3 free trial credentials.{' '}
            <a href="#" onClick={(e) => { e.preventDefault(); handleUpgrade('solo'); }} style={{ color: '#A73C31', fontWeight: 700 }}>
              Upgrade to Solo
            </a>{' '}
            to add more.
          </div>
        )}

        {!loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 26 }}>
            {[
              { label: 'Tracked', value: withDays.length, color: '#14201C' },
              { label: 'Urgent (<14d)', value: counts.red, color: '#C24A3F' },
              { label: 'Upcoming (<45d)', value: counts.amber, color: '#B9852E' },
              { label: 'On track', value: counts.green, color: '#3B7E52' },
            ].map((s) => (
              <div key={s.label} style={{ border: '1px solid rgba(20,32,28,0.1)', borderRadius: 16, padding: '16px 18px', background: '#fff' }}>
                <div style={{ fontFamily: "'Libre Franklin', sans-serif", fontWeight: 800, fontSize: 26, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 11.5, color: '#8B968F', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {loading ? (
          <p style={{ color: '#8B968F' }}>Loading…</p>
        ) : withDays.length === 0 ? (
          <p style={{ color: '#8B968F' }}>No credentials yet. Add your first license, cert, insurance policy, or bond.</p>
        ) : (
          <div style={{ border: '1px solid rgba(20,32,28,0.1)', borderRadius: 18, overflow: 'hidden', background: '#fff' }}>
            {withDays.map((c) => {
              const status = statusFor(c.days);
              return (
                <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid rgba(20,32,28,0.07)' }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{c.name}</div>
                    <div style={{ fontSize: 11.5, color: '#8B968F', marginTop: 2 }}>{c.type} · {c.team_members?.name || 'Unassigned'}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <span>
                      <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: COLORS[status], marginRight: 8 }} />
                      <span style={{ color: COLORS[status], fontWeight: 700, fontSize: 13 }}>
                        {c.days < 0 ? 'Expired' : `${c.days} days`}
                      </span>
                    </span>
                    {c.document_url && (
                      <button onClick={() => handleDownload(c.document_url!)} style={{ background: 'none', border: 'none', color: '#B9852E', cursor: 'pointer', fontSize: 12.5, textDecoration: 'underline' }}>
                        View document
                      </button>
                    )}
                    <button onClick={() => handleDelete(c.id)} style={{ background: 'none', border: 'none', color: '#8B968F', cursor: 'pointer', fontSize: 12.5 }}>
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {showModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(20,32,28,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
            <form onSubmit={handleAdd} style={{ background: '#fff', color: '#14201C', padding: 28, borderRadius: 20, width: 360, boxShadow: '0 30px 70px rgba(20,32,28,0.25)' }}>
              <h2 style={{ fontSize: 18, marginBottom: 18, fontWeight: 800, fontFamily: "'Libre Franklin', sans-serif" }}>Add credential</h2>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#8B968F', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.3 }}>Credential name</label>
                <input
                  required placeholder="e.g. State electrical license"
                  value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={{ width: '100%', padding: 11, border: '1px solid rgba(20,32,28,0.14)', borderRadius: 10, boxSizing: 'border-box', fontSize: 14 }}
                />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#8B968F', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.3 }}>Type</label>
                <select
                  value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                  style={{ width: '100%', padding: 11, border: '1px solid rgba(20,32,28,0.14)', borderRadius: 10, boxSizing: 'border-box', fontSize: 14, background: '#fff' }}
                >
                  <option>License</option><option>Certification</option><option>Insurance policy</option><option>Surety bond</option><option>Other</option>
                </select>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#8B968F', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.3 }}>Expiry date</label>
                <input
                  required type="date"
                  value={form.expiry_date} onChange={(e) => setForm({ ...form, expiry_date: e.target.value })}
                  style={{ width: '100%', padding: 11, border: '1px solid rgba(20,32,28,0.14)', borderRadius: 10, boxSizing: 'border-box', fontSize: 14 }}
                />
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 11.5, fontWeight: 700, color: '#8B968F', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.3 }}>Attach document (optional)</label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  style={{ width: '100%', fontSize: 12.5 }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button type="button" onClick={() => { setShowModal(false); setFile(null); }} style={{ padding: '10px 18px', border: '1px solid rgba(20,32,28,0.14)', borderRadius: 24, background: '#fff', color: '#14201C', cursor: 'pointer', fontSize: 13, fontWeight: 700 }}>Cancel</button>
                <button type="submit" disabled={uploading} style={{ padding: '10px 18px', border: 'none', borderRadius: 24, background: '#D9A441', color: '#fff', cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.6 : 1, fontSize: 13, fontWeight: 700 }}>
                  {uploading ? 'Saving…' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
