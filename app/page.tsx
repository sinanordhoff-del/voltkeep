const STYLE = `
  :root{
    --bg: #FAFAF8;
    --ink: #14201C;
    --ink-soft: #5C6B62;
    --card: #FFFFFF;
    --line: rgba(20,32,28,0.08);
    --line-strong: rgba(20,32,28,0.14);
    --gold: #D9A441;
    --gold-bright: #C6892A;
    --gold-soft: rgba(217,164,65,0.10);
    --green: #4C9A6A;
    --amber: #D9A441;
    --red: #C24A3F;
    --bubble-vk: #14201C;
    --bubble-user: #F0EDE5;
  }
  .vk *{ box-sizing:border-box; }
  .vk{ background: var(--bg); color: var(--ink); font-family:'IBM Plex Sans', system-ui, sans-serif; line-height:1.6; min-height:100vh; }
  .vk h1,.vk h2,.vk h3{ font-family:'Libre Franklin', sans-serif; letter-spacing:-0.01em; line-height:1.08; }
  .vk a{ color:inherit; text-decoration:none; }
  .wrap{ max-width: 1120px; margin:0 auto; padding: 0 28px; }

  header{ position: sticky; top:0; z-index:50; background: rgba(250,250,248,0.85); backdrop-filter: blur(8px); border-bottom:1px solid var(--line); }
  .nav{ display:flex; align-items:center; justify-content:space-between; padding:18px 0; }
  .logo{ display:flex; align-items:center; gap:10px; font-weight:800; font-size:19px; }
  .logo-face{ width:32px; height:32px; border-radius:50%; background: linear-gradient(135deg, var(--gold), var(--gold-bright)); display:flex; align-items:center; justify-content:center; font-size:15px; }
  .nav-cta{ background: var(--ink); color:#fff; border:none; font-weight:600; font-size:13.5px; padding:11px 20px; border-radius:24px; cursor:pointer; }

  .hero{ padding: 70px 0 40px; text-align:center; }
  .hero h1{ font-size: clamp(34px,5vw,58px); font-weight:800; margin-bottom:16px; }
  .hero p.lead{ font-size:17px; color: var(--ink-soft); max-width:560px; margin: 0 auto 30px; }
  .hero-actions{ display:flex; gap:14px; justify-content:center; flex-wrap:wrap; margin-bottom: 14px; }
  .btn-primary{ background: var(--gold); color:#fff; border:none; font-weight:700; font-size:15px; padding:15px 28px; border-radius:26px; cursor:pointer; box-shadow: 0 8px 24px rgba(217,164,65,0.35); }
  .btn-ghost{ background:#fff; border:1px solid var(--line-strong); color: var(--ink); font-weight:600; font-size:15px; padding:14px 26px; border-radius:26px; cursor:pointer; }
  .hero-sub{ font-size:12.5px; color: var(--ink-soft); }

  .phone-stage{ display:flex; justify-content:center; margin: 44px 0 10px; }
  .phone{ width: 320px; background:#fff; border-radius:32px; padding:16px 14px; box-shadow: 0 30px 70px rgba(20,32,28,0.16); border:1px solid var(--line); }
  .phone-head{ display:flex; align-items:center; gap:10px; padding: 6px 8px 14px; border-bottom:1px solid var(--line); margin-bottom:14px; }
  .phone-face{ width:34px; height:34px; border-radius:50%; background: linear-gradient(135deg, var(--gold), var(--gold-bright)); display:flex; align-items:center; justify-content:center; font-size:15px; }
  .phone-head .who{ font-weight:700; font-size:14px; }
  .phone-head .status{ font-size:11px; color: var(--green); }
  .thread{ display:flex; flex-direction:column; gap:9px; }
  .bubble{ max-width:82%; padding:10px 14px; border-radius:16px; font-size:12.5px; line-height:1.45; }
  .bubble.vk{ background: var(--bubble-vk); color:#fff; align-self:flex-start; border-bottom-left-radius:5px; }
  .bubble.user{ background: var(--bubble-user); color: var(--ink); align-self:flex-end; border-bottom-right-radius:5px; }
  .bubble.done{ background: var(--gold-soft); color: var(--gold-bright); align-self:flex-start; border-bottom-left-radius:5px; font-weight:600; }

  .ticker-wrap{ overflow:hidden; border-top:1px solid var(--line); border-bottom:1px solid var(--line); padding: 16px 0; margin: 30px 0; }
  .ticker{ display:flex; gap:32px; white-space:nowrap; animation: scroll-ticker 26s linear infinite; width:max-content; }
  .ticker span{ font-size:12.5px; color: var(--ink-soft); }
  @keyframes scroll-ticker{ from{ transform: translateX(0); } to{ transform: translateX(-50%); } }

  section{ padding: 64px 0; }
  .section-head{ max-width:600px; margin: 0 auto 44px; text-align:center; }
  .section-head h2{ font-size: clamp(26px,3vw,36px); font-weight:800; margin-bottom:12px; }
  .section-head p{ color: var(--ink-soft); font-size:15px; }

  .cards3{ display:grid; grid-template-columns: repeat(3,1fr); gap:20px; }
  .card{ background: var(--card); border:1px solid var(--line); border-radius:18px; padding:26px 22px; }
  .card .icon{ width:42px; height:42px; border-radius:12px; background: var(--gold-soft); display:flex; align-items:center; justify-content:center; font-size:19px; margin-bottom:16px; }
  .card h3{ font-size:16px; font-weight:700; margin-bottom:8px; }
  .card p{ font-size:13.5px; color: var(--ink-soft); }

  .compare{ display:grid; grid-template-columns: 1fr 1fr; gap:20px; max-width: 640px; margin: 0 auto; }
  .compare-card{ border-radius:20px; padding:28px 24px; }
  .compare-card.bad{ background:#fff; border:1px solid var(--line); }
  .compare-card.good{ background: var(--ink); color:#fff; }
  .compare-card .price{ font-family:'Libre Franklin',sans-serif; font-weight:800; font-size:28px; margin-bottom:14px; }
  .compare-card ul{ list-style:none; padding:0; margin:0; }
  .compare-card li{ font-size:13.5px; padding:7px 0; }
  .compare-card.bad li{ color: var(--ink-soft); }
  .compare-card.good li{ color: rgba(255,255,255,0.85); }

  .steps4{ display:grid; grid-template-columns: repeat(4,1fr); gap:18px; }
  .step{ text-align:center; }
  .step .n{ width:36px; height:36px; border-radius:50%; background: var(--ink); color:#fff; font-weight:700; font-size:13px; display:flex; align-items:center; justify-content:center; margin: 0 auto 14px; }
  .step h3{ font-size:14.5px; font-weight:700; margin-bottom:6px; }
  .step p{ font-size:12.5px; color: var(--ink-soft); }

  .plans{ display:grid; grid-template-columns: repeat(3,1fr); gap:20px; }
  .plan{ background:#fff; border:1px solid var(--line); border-radius:20px; padding:28px 24px; position:relative; }
  .plan.featured{ border:2px solid var(--gold); }
  .plan.featured::before{ content:'Most common'; position:absolute; top:-11px; left:24px; background: var(--gold); color:#fff; font-size:10.5px; font-weight:700; padding:4px 12px; border-radius:20px; }
  .plan .tier{ font-size:12px; text-transform:uppercase; letter-spacing:0.08em; color: var(--ink-soft); margin-bottom:10px; font-weight:700; }
  .plan .price{ font-family:'Libre Franklin',sans-serif; font-weight:800; font-size:32px; margin-bottom:4px; }
  .plan .price span{ font-size:13px; font-weight:500; color: var(--ink-soft); font-family:'IBM Plex Sans',sans-serif; }
  .plan .desc{ font-size:13px; color: var(--ink-soft); margin-bottom:18px; }
  .plan ul{ list-style:none; padding:0; margin-bottom:22px; }
  .plan li{ font-size:13px; padding:7px 0; border-top:1px dashed var(--line); }
  .plan li:first-child{ border-top:none; }
  .plan .btn-tag{ display:block; width:100%; text-align:center; background: var(--bg); border:1px solid var(--line-strong); color: var(--ink); font-weight:700; font-size:13px; padding:12px; border-radius:22px; cursor:pointer; box-sizing:border-box; }
  .plan.featured .btn-tag{ background: var(--gold); color:#fff; border-color: var(--gold); }

  .final{ text-align:center; padding: 80px 0 90px; }
  .final h2{ font-size: clamp(28px,3.6vw,42px); font-weight:800; margin-bottom:14px; }
  .final p{ color: var(--ink-soft); font-size:15px; margin-bottom:30px; }

  footer{ border-top:1px solid var(--line); padding:26px 0; text-align:center; font-size:12px; color: var(--ink-soft); }

  .help-btn{ position:fixed; bottom:24px; right:24px; z-index:60; background: var(--ink); color:#fff; border:none; font-weight:600; font-size:13.5px; padding:13px 20px; border-radius:30px; cursor:pointer; box-shadow: 0 10px 30px rgba(20,32,28,0.25); display:flex; align-items:center; gap:8px; }

  @media (max-width: 860px){
    .cards3{ grid-template-columns:1fr; }
    .compare{ grid-template-columns:1fr; }
    .steps4{ grid-template-columns:1fr 1fr; }
    .plans{ grid-template-columns:1fr; }
    .nav-cta{ display:none; }
  }
`;

export default function Home() {
  return (
    <div className="vk">
      <style dangerouslySetInnerHTML={{ __html: STYLE }} />

      <header>
        <div className="wrap nav">
          <div className="logo"><span className="logo-face">⚡</span> VoltKeep</div>
          <a href="/login" className="nav-cta">Start free trial</a>
        </div>
      </header>

      <div className="wrap">
        <section className="hero">
          <h1>hey, I'm VoltKeep 👋</h1>
          <p className="lead">You forget renewals. I don't. I track every license, NEC credit, insurance policy, and bond across your crew, and remind the right person before it's a problem.</p>
          <div className="hero-actions">
            <a href="/login" className="btn-primary">Try me free</a>
            <a href="#how" className="btn-ghost">See how it works</a>
          </div>
          <div className="hero-sub">No credit card required. Set up in under 10 minutes.</div>

          <div className="phone-stage">
            <div className="phone">
              <div className="phone-head">
                <span className="phone-face">⚡</span>
                <div><div className="who">VoltKeep</div><div className="status">● Active now</div></div>
              </div>
              <div className="thread">
                <div className="bubble vk">Heads up — J. Alvarez's journeyman license expires in 41 days.</div>
                <div className="bubble user">Got it, starting the renewal now</div>
                <div className="bubble done">✓ Marked as in progress. I'll remind again at 7 days if it's not done.</div>
                <div className="bubble vk">General liability insurance renewed and on file. You're all set for 128 days.</div>
              </div>
            </div>
          </div>
        </section>

        <div className="ticker-wrap">
          <div className="ticker">
            <span>✓ Reminder sent — 90 days</span>
            <span>✓ Document uploaded</span>
            <span>✓ Renewed on time</span>
            <span>⚠ Escalated to owner — 7 days</span>
            <span>✓ Reminder sent — 60 days</span>
            <span>✓ License renewed</span>
            <span>✓ Reminder sent — 30 days</span>
            <span>✓ NEC credits confirmed</span>
            <span>✓ Reminder sent — 90 days</span>
            <span>✓ Document uploaded</span>
            <span>✓ Renewed on time</span>
            <span>⚠ Escalated to owner — 7 days</span>
          </div>
        </div>

        <section>
          <div className="section-head">
            <h2>Why a calendar isn't enough</h2>
            <p>Past 5 technicians, manual tracking fails more than 30% of the time.</p>
          </div>
          <div className="cards3">
            <div className="card"><div className="icon">👤</div><h3>No single owner</h3><p>Reminders on your phone only help you. When five employees each hold their own certifications, nobody has the full picture.</p></div>
            <div className="card"><div className="icon">📄</div><h3>No proof when it matters</h3><p>An insurer or client asks for proof of a current license. If it's buried in an inbox, that's a scramble you don't need.</p></div>
            <div className="card"><div className="icon">🔔</div><h3>No escalation</h3><p>A snoozed reminder is a silently missed deadline. Nobody finds out until the license has already lapsed.</p></div>
          </div>
        </section>

        <section>
          <div className="section-head">
            <h2>A missed renewal costs more than $29/month</h2>
          </div>
          <div className="compare">
            <div className="compare-card bad">
              <div className="price">Free</div>
              <ul>
                <li>Sticky notes and memory</li>
                <li>Nobody's actually responsible</li>
                <li>You find out when it's already expired</li>
                <li>Documents live in someone's inbox</li>
              </ul>
            </div>
            <div className="compare-card good">
              <div className="price">$29/mo</div>
              <ul>
                <li>Every renewal tracked automatically</li>
                <li>Assigned to the right person</li>
                <li>Reminded 90, 60, 30, 7 days out</li>
                <li>Documents stored, ready when needed</li>
              </ul>
            </div>
          </div>
        </section>

        <section id="how">
          <div className="section-head">
            <h2>Set it up once. I run it from there.</h2>
          </div>
          <div className="steps4">
            <div className="step"><div className="n">1</div><h3>Add each credential</h3><p>License, cert, insurance, or bond — enter once.</p></div>
            <div className="step"><div className="n">2</div><h3>Assign an owner</h3><p>Tied to whoever's responsible for renewing it.</p></div>
            <div className="step"><div className="n">3</div><h3>I remind automatically</h3><p>Alerts at 90, 60, 30, and 7 days out.</p></div>
            <div className="step"><div className="n">4</div><h3>Escalate if needed</h3><p>If nothing happens, the owner gets notified.</p></div>
          </div>
        </section>

        <section id="pricing">
          <div className="section-head">
            <h2>Priced for a small team, not an enterprise compliance department</h2>
            <p>30-day money-back guarantee — if it's not useful, full refund, no questions asked.</p>
          </div>
          <div className="plans">
            <div className="plan">
              <div className="tier">Solo</div>
              <div className="price">$29 <span>/ month</span></div>
              <div className="desc">One business owner, up to 10 credentials.</div>
              <ul><li>Document storage</li><li>Automated reminders</li><li>1 team member</li></ul>
              <a href="/login" className="btn-tag">Start free trial</a>
            </div>
            <div className="plan featured">
              <div className="tier">Team</div>
              <div className="price">$59 <span>/ month</span></div>
              <div className="desc">Up to 8 team members, unlimited credentials.</div>
              <ul><li>Everything in Solo</li><li>Owner assignment + escalation</li><li>Audit-ready export</li></ul>
              <a href="/login" className="btn-tag">Start free trial</a>
            </div>
            <div className="plan">
              <div className="tier">Multi-location</div>
              <div className="price">$99 <span>/ month</span></div>
              <div className="desc">Multiple sites or crews under one account.</div>
              <ul><li>Everything in Team</li><li>Per-location dashboards</li><li>Priority support</li></ul>
              <a href="/login" className="btn-tag">Talk to us</a>
            </div>
          </div>
        </section>
      </div>

      <div className="wrap">
        <section className="final">
          <h2>Get your credentials organized this week</h2>
          <p>No credit card required — sign in with your email to get started.</p>
          <a href="/login" className="btn-primary">Try VoltKeep free</a>
        </section>
      </div>

      <footer>© 2026 VoltKeep. All rights reserved. Compliance tracking for small electrical contractors.</footer>

      <a href="mailto:voltkeep.support@gmail.com?subject=VoltKeep%20question" className="help-btn">
        💬 Contact us
      </a>
    </div>
  );
}
