import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

// GET /api/credentials — list all credentials for the logged-in user's business
export async function GET() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('owner_id', user.id)
    .single();

  if (!business) return NextResponse.json({ credentials: [] });

  const { data: credentials, error } = await supabase
    .from('credentials')
    .select('*, team_members(name)')
    .eq('business_id', business.id)
    .order('expiry_date', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ credentials });
}

// POST /api/credentials — add a new credential
export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  const body = await req.json();
  const { name, type, assigned_to, expiry_date } = body;

  if (!name || !expiry_date) {
    return NextResponse.json({ error: 'name and expiry_date are required' }, { status: 400 });
  }

  // Ensure this user has a business row (created automatically on first credential add)
  let { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('owner_id', user.id)
    .single();

  if (!business) {
    const { data: newBusiness, error: bizError } = await supabase
      .from('businesses')
      .insert({ owner_id: user.id, name: 'My Business', plan: 'trial' })
      .select('id')
      .single();
    if (bizError) return NextResponse.json({ error: bizError.message }, { status: 500 });
    business = newBusiness;
  }

  // Free trial limit: 3 credentials. Paid plans (solo/team/multi_location) are unlimited.
  const { data: bizDetails } = await supabase
    .from('businesses')
    .select('plan')
    .eq('id', business.id)
    .single();

  if (bizDetails?.plan === 'trial') {
    const { count } = await supabase
      .from('credentials')
      .select('*', { count: 'exact', head: true })
      .eq('business_id', business.id);

    if ((count ?? 0) >= 3) {
      return NextResponse.json(
        { error: 'TRIAL_LIMIT_REACHED', message: "You've hit the free trial limit of 3 credentials. Upgrade to add more." },
        { status: 403 }
      );
    }
  }

  const { data: credential, error } = await supabase
    .from('credentials')
    .insert({
      business_id: business.id,
      name,
      type: type || 'License',
      assigned_to: assigned_to || null,
      expiry_date,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ credential }, { status: 201 });
}
