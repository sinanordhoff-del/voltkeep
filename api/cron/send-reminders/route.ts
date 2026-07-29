import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase-server';
import { Resend } from 'resend';
import { differenceInCalendarDays } from 'date-fns';

const resend = new Resend(process.env.RESEND_API_KEY);
const REMINDER_THRESHOLDS = [90, 60, 30, 7];

// This endpoint is meant to be called once a day by a scheduled job (see vercel.json).
// It is protected by a secret so random internet requests can't trigger it.
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();
  const today = new Date();

  // Pull every active credential across every business, with who it's assigned to
  // and the business owner's email, so we know who to notify and for escalation.
  const { data: credentials, error } = await supabase
    .from('credentials')
    .select(`
      id, name, expiry_date, status,
      team_members ( name, email ),
      businesses ( owner_id )
    `)
    .eq('status', 'active');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let sentCount = 0;

  for (const cred of credentials || []) {
    const daysLeft = differenceInCalendarDays(new Date(cred.expiry_date), today);
    const threshold = REMINDER_THRESHOLDS.find((t) => t === daysLeft);
    if (threshold === undefined) continue;

    // Skip if we've already sent this exact reminder (90/60/30/7) for this credential
    const { data: existing } = await supabase
      .from('reminder_log')
      .select('id')
      .eq('credential_id', cred.id)
      .eq('days_before', threshold)
      .maybeSingle();
    if (existing) continue;

    const assignee = (cred as any).team_members;
    const recipientEmail = assignee?.email;

    if (recipientEmail) {
      await resend.emails.send({
        from: process.env.REMINDER_FROM_EMAIL!,
        to: recipientEmail,
        subject: `${cred.name} expires in ${threshold} days`,
        text: `Hi ${assignee.name},\n\nThis is a reminder that "${cred.name}" is set to expire on ${cred.expiry_date} — that's ${threshold} days from now.\n\nPlease start the renewal process if you haven't already, and mark it as renewed in VoltKeep once it's done.\n\n— VoltKeep`,
      });
      sentCount++;
    }

    // Escalation: at the 7-day mark, also notify the business owner directly,
    // in case the assigned person hasn't acted on earlier reminders.
    if (threshold === 7) {
      const ownerId = (cred as any).businesses?.owner_id;
      if (ownerId) {
        const { data: ownerUser } = await supabase.auth.admin.getUserById(ownerId);
        const ownerEmail = ownerUser?.user?.email;
        if (ownerEmail) {
          await resend.emails.send({
            from: process.env.REMINDER_FROM_EMAIL!,
            to: ownerEmail,
            subject: `Heads up: "${cred.name}" expires in 7 days`,
            text: `Hi,\n\n"${cred.name}"${assignee ? ` (assigned to ${assignee.name})` : ''} expires in 7 days, on ${cred.expiry_date}.\n\nThis is your escalation notice in case it hasn't been handled yet.\n\n— VoltKeep`,
          });
        }
      }
    }

    // Log that this specific reminder was sent, so we never send it twice
    await supabase.from('reminder_log').insert({
      credential_id: cred.id,
      days_before: threshold,
    });
  }

  return NextResponse.json({ success: true, remindersSent: sentCount });
}
