import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

// PATCH /api/credentials/:id — edit a credential, or mark it renewed
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  const body = await req.json();
  const updates: Record<string, any> = { updated_at: new Date().toISOString() };

  if (body.name) updates.name = body.name;
  if (body.type) updates.type = body.type;
  if (body.assigned_to !== undefined) updates.assigned_to = body.assigned_to;
  if (body.expiry_date) updates.expiry_date = body.expiry_date;

  // "Mark as renewed" — sets a new expiry date and logs when it happened
  if (body.markRenewed && body.newExpiryDate) {
    updates.expiry_date = body.newExpiryDate;
    updates.last_renewed_at = new Date().toISOString();
    updates.status = 'active';
  }

  // RLS policy ensures this only succeeds if the credential belongs to this user's business
  const { data: credential, error } = await supabase
    .from('credentials')
    .update(updates)
    .eq('id', params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ credential });
}

// DELETE /api/credentials/:id
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  const { error } = await supabase.from('credentials').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
