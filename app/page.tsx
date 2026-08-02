const STYLE = `
  :root{
    --bg: #14201C;
    --bg-deep: #0D1613;
    --panel-line: rgba(180,204,192,0.14);
    --panel-line-strong: rgba(180,204,192,0.26);
    --card: #F4F5F1;
    --card-ink: #1B2420;
    --card-ink-soft: #5C6B62;
    --gold: #D9A441;
    --gold-bright: #EBC169;
    --green: #4C9A6A;
    --amber: #D9A441;
    --red: #C24A3F;
    --text: #ECF1EE;
    --text-dim: #9FB3AA;
  }
  .vk-landing *{ box-sizing:border-box; }
  .vk-landing{
    background: radial-gradient(circle at 15% 0%, rgba(217,164,65,0.06), transparent 45%), var(--bg);
    color: var(--text);
    font-family: 'IBM Plex Sans', system-ui, sans-serif;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
  }
  .vk-landing h1, .vk-landing h2, .vk-landing h3{ font-family:'Libre Franklin', sans-serif; letter-spacing:-0.01em; line-height:1.08; }
  .vk-landing a{ color:inherit; text-decoration:none; }
  .wrap{ max-width: 1140px; margin:0 auto; padding: 0 28px; }
  header{ position: sticky; top:0; z-index:50; background: rgba(13,22,19,0.86); backdrop-filter: blur(6px); border-bottom:1px solid var(--panel-line); }
  .nav{ display:flex; align-items:center; justify-content:space-between; padding:18px 0; }
  .logo{ display:flex; align-items:center; gap:10px; font-family:'Libre Franklin', sans-serif; font-weight:800; font-size:19px; }
  .logo-mark{ width:24px; height:17px; border-radius:3px; background: linear-gradient(135deg, var(--gold), var(--gold-bright)); position:relative; }
  .logo-mark::after{ content:''; position:absolute; top:5px; left:4px; width:9px; height:9px; border-radius:50%; background: var(--bg-deep); }
  .nav-cta{ background: var(--gold); color:var(--bg-deep); border:none; font-weight:600; font-size:13.5px; padding:11px 18px; border-radius:5px; cursor:pointer; }
  .hero{ padding: 96px 0 76px; display:grid; grid-template-columns: 1.05fr 0.95fr; gap:56px; align-items:center; }
  .eyebrow{ display:inline-flex; align-items:center; gap:8px; font-size:12px; letter-spacing:0.12em; text-transform:uppercase; color: var(--gold-bright); border:1px solid rgba(217,164,65,0.35); background: rgba(217,164,65,0.07); padding:6px 12px; border-radius:20px; margin-bottom:22px; }
  .hero h1{ font-size: clamp(36px,4.6vw,54px); color:#fff; margin-bottom:20px; font-weight:800; }
  .hero h1 span{ color: var(--gold-bright); }
  .hero p.lead{ font-size:16.5px; color: var(--text-dim); max-width: 480px; margin-bottom:32px; }
  .hero-actions{ display:flex; gap:14px; flex-wrap:wrap; align-items:center; }
  .btn-primary{ background: var(--gold); color: var(--bg-deep); border:none; font-weight:600; font-size:14.5px; padding:15px 24px; border-radius:6px; cursor:pointer; display:inline-block; }
  .btn-ghost{ background:transparent; border:1px solid var(--panel-line-strong); color: var(--text); font-size:14.5px; padding:14px 22px; border-radius:6px; cursor:pointer; display:inline-block; }
  .hero-sub{ margin-top:18px; font-size:12.5px; color: var(--text-dim); }
  .stack{ position:relative; height: 380px; display:flex; align-items:center; justify-content:center; }
  .cred{ position:absolute; width: 300px; background: var(--card); color: var(--card-ink); border-radius: 12px; padding: 20px 20px 18px; box-shadow: 0 24px 48px rgba(0,0,0,0.4); }
  .cred:nth-child(1){ transform: rotate(-9deg) translate(-38px,-46px); z-index:1; opacity:0.92; }
  .cred:nth-child(2){ transform: rotate(-2deg) translate(18px,-8px); z-index:2; }
  .cred:nth-child(3){ transform: rotate(6deg) translate(-14px,46px); z-index:3; }
  .cred-top{ display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:14px; }
  .cred-type{ font-size:10.5px; text-transform:uppercase; letter-spacing:0.08em; color: var(--card-ink-soft); margin-bottom:4px; }
  .cred-name{ font-family:'Libre Franklin', sans-serif; font-weight:700; font-size:15px; }
  .badge{ font-size:10.5px; font-weight:600; padding:4px 9px; border-radius: 20px; white-space:nowrap; text-transform:uppercase; }
  .badge.green{ background: rgba(76,154,106,0.15); color:#3B7E52; }
  .badge.amber{ background: rgba(217,164,65,0.18); color:#9C7326; }
  .badge.red{ background: rgba(194,74,63,0.15); color:#A73C31; }
  .cred-meta{ font-size:11.5px; color: var(--card-ink-soft); display:flex; justify-content:space-between; border-top:1px dashed rgba(27,36,32,0.15); padding-top:10px; margin-top:4px; }
  section{ padding: 78px 0; }
  .section-head{ max-width: 620px; margin-bottom: 48px; }
  .section-head h2{ font-size: clamp(28px,3.2vw,36px); color:#fff; margin-bottom:14px; font-weight:800; }
  .section-head p{ color: var(--text-dim); font-size:15px; }
  .problems{ display:grid; grid-template-columns: repeat(3,1fr); gap:24px; }
  .problem{ border:1px solid var(--panel-line-strong); border-radius:10px; padding:26px 22px; background: rgba(236,241,238,0.02); }
  .problem .icon{ width:36px; height:36px; border-radius:8px; background: rgba(217,164,65,0.12); border:1px solid rgba(217,164,65,0.3); display:flex; align-items:center; justify-content:center; margin-bottom:16px; font-size:16px; color: var(--gold-bright); }
  .problem h3{ font-size:16.5px; color:#fff; margin-bottom:9px; font-weight:700; }
  .problem p{ font-size:13.5px; color: var(--text-dim); }
  .steps{ display:grid; grid-template-columns: repeat(4,1fr); gap:20px; }
  .step .n{ font-family:'Libre Franklin',sans-serif; font-weight:800; font-size:13px; color: var(--bg-deep); background: var(--gold); width:26px; height:26px; border-radius:50%; display:flex; align-items:center; justify-content:center; margin-bottom:16px; }
  .step h3{ font-size:15.5px; color:#fff; margin-bottom:8px; font-weight:700; }
  .step p{ font-size:13px; color: var(--text-dim); }
  .dash{ border:1px solid var(--panel-line-strong); border-radius:12px; overflow:hidden; background: rgba(236,241,238,0.02); }
  .dash-head{ padding: 16px 22px; border-bottom:1px solid var(--panel-line); display:flex; justify-content:space-between; font-size:12.5px; color: var(--text-dim); }
  .drow{ display:grid; grid-template-columns: 1.5fr 1fr 1fr 0.8fr; gap:14px; align-items:center; padding: 14px 22px; font-size:13.5px; border-bottom:1px solid var(--panel-line); }
  .drow:last-child{ border-bottom:none; }
  .drow .name{ font-weight:600; color:#fff; }
  .drow .sub{ font-size:11.5px; color: var(--text-dim); }
  .drow .owner{ color: var(--text-dim); font-size:12.5px; }
  .dot{ width:8px; height:8px; border-radius:50%; display:inline-block; margin-right:7px; }
  .dot.green{ background: var(--green); } .dot.amber{ background: var(--amber); } .dot.red{ background: var(--red); }
  .plans{ display:grid; grid-template-columns: repeat(3,1fr); gap:22px; }
  .plan{ border:1px solid var(--panel-line-strong); border-radius:12px; padding: 28px 24px; background: rgba(236,241,238,0.02); position:relative; }
  .plan.featured{ border-color: var(--gold); background: rgba(217,164,65,0.05); }
  .plan.featured::before{ content:'Most common'; position:absolute; top:-11px; left:24px; background:var(--gold); color:var(--bg-deep); font-size:10.5px; font-weight:700; padding:4px 10px; border-radius:20px; text-transform:uppercase; }
  .plan .tier{ font-size:12px; text-transform:uppercase; letter-spacing:0.1em; color: var(--text-dim); margin-bottom:10px; }
  .plan .price{ font-family:'Libre Franklin',sans-serif; font-weight:800; font-size:34px; color:#fff; margin-bottom:4px; }
  .plan .price span{ font-size:13px; font-weight:500; color: var(--text-dim); }
  .plan .desc{ font-size:13px; color: var(--text-dim); margin-bottom:20px; }
  .plan ul{ list-style:none; margin-bottom:22px; padding:0; }
  .plan li{ font-size:13px; color: var(--text); padding:7px 0; border-top:1px dashed var(--panel-line); }
  .plan li:first-child{ border-top:none; }
  .btn-tag{ display:block; width:100%; text-align:center; background: rgba(236,241,238,0.06); border:1px solid var(--panel-line-strong); color:#fff; font-weight:600; font-size:13px; padding:12px; border-radius:6px; cursor:pointer; box-sizing:border-box; }
  .plan.featured .btn-tag{ background: var(--gold); color: var(--bg-deep); border-color: var(--gold); }
  .final{ text-align:center; padding: 90px 0 100px; }
  .final h2{ font-size: clamp(28px,3.6vw,42px); color:#fff; margin-bottom:16px; font-weight:800; }
  .final p{ color: var(--text-dim); font-size:15px; margin-bottom:34px; }
  footer{ border-top:1px solid var(--panel-line); padding:28px 0; text-align:center; font-size:12px; color: var(--text-dim); }
  .help-btn{ position:fixed; bottom:24px; right:24px; z-index:60; background: var(--gold); color: var(--bg-deep); border:none; font-weight:600; font-size:13.5px; padding:13px 20px; border-radius:30px; cursor:pointer; box-shadow: 0 10px 30px rgba(0,0,0,0.35); display:flex; align-items:center; gap:8px; }
  .help-btn:hover{ background: var(--gold-bright); }
  @media (max-width: 860px){
    .hero{ grid-template-columns:1fr; padding-top:60px; }
    .stack{ order:-1; height:300px; margin-bottom:10px; }
    .problems{ grid-template-columns:1fr; }
    .steps{ grid-template-columns: 1fr 1fr; }
    .plans{ grid-template-columns:1fr; }
    .drow{ grid-template-columns: 1.4fr 1fr 0.8fr; }
    .drow .owner{ display:none; }
    .nav-cta{ display:none; }
  }
`;

export default function Home() {
  return (
    <div className="vk-landing">
      <style dangerouslySetInnerHTML={{ __html: STYLE }} />

      <header>
        <div className="wrap nav">
          <div className="logo"><span className="logo-mark"></span> VoltKeep</div>
          <a href="/login" className="nav-cta">Start free trial</a>
        </div>
      </header>

      <div className="wrap">
        <section className="hero">
          <div>
            <div className="eyebrow">Built for electrical contractors</div>
            <h1>Never miss a license, NEC credit, or <span>insurance renewal</span> again.</h1>
            <p className="lead">Past 5 technicians, manual tracking fails more than 30% of the time. VoltKeep tracks every license, NEC code credit, insurance policy, and bond across your whole crew — who owns it, when it expires, where the document lives — built specifically for electrical contractors, not a generic compliance tool.</p>
            <div className="hero-actions">
              <a href="/login" className="btn-primary">Start free trial</a>
              <a href="#how" className="btn-ghost">See how it works</a>
            </div>
            <div className="hero-sub">No credit card required. Import your first 5 credentials in under 10 minutes.</div>
          </div>

          <div className="stack">
            <div className="cred">
              <div className="cred-top">
                <div><div className="cred-type">General liability</div><div className="cred-name">Insurance policy</div></div>
                <span className="badge green">128 days</span>
              </div>
              <div className="cred-meta"><span>Assigned to</span><span>M. Alvarez</span></div>
            </div>
            <div className="cred">
              <div className="cred-top">
                <div><div className="cred-type">Journeyman license</div><div className="cred-name">J. Alvarez, EC-4471</div></div>
                <span className="badge amber">41 days</span>
              </div>
              <div className="cred-meta"><span>Assigned to</span><span>J. Alvarez</span></div>
            </div>
            <div className="cred">
              <div className="cred-top">
                <div><div className="cred-type">NEC code update credits</div><div className="cred-name">2026 cycle</div></div>
                <span className="badge amber">33 days</span>
              </div>
              <div className="cred-meta"><span>Assigned to</span><span>M. Alvarez</span></div>
            </div>
          </div>
        </section>
      </div>

      <div className="wrap">
        <section>
          <div className="section-head">
            <div className="eyebrow">Why a calendar isn't enough</div>
            <h2>Past 5 technicians, manual tracking fails more than 30% of the time.</h2>
            <p>A phone reminder works fine for one person tracking one license. Once you've got a crew, NEC credits, insurance, and bonding all on the line at once, you need more than a notification.</p>
          </div>
          <div className="problems">
            <div className="problem">
              <div className="icon">◐</div>
              <h3>No single owner</h3>
              <p>Reminders on your phone only help you. When five employees each hold their own certifications, nobody has the full picture — including you.</p>
            </div>
            <div className="problem">
              <div className="icon">▤</div>
              <h3>No proof when it matters</h3>
              <p>An insurer, bonding company, or client asks for proof of a current license. If it's buried in an inbox, that's a scramble you don't need.</p>
            </div>
            <div className="problem">
              <div className="icon">▲</div>
              <h3>No escalation</h3>
              <p>A snoozed reminder is a silently missed deadline. Nobody finds out until the license has already lapsed.</p>
            </div>
          </div>
        </section>

        <section>
          <div className="section-head">
            <div className="eyebrow">Real cost of doing it manually</div>
            <h2>A missed renewal costs more than $29/month.</h2>
          </div>
          <div className="problems">
            <div className="problem">
              <div className="icon">📋</div>
              <h3>Manual tracking</h3>
              <p>Free — until someone forgets. A lapsed license can mean lost work, failed insurance claims, or a job put on hold.</p>
            </div>
            <div className="problem">
              <div className="icon">⚡</div>
              <h3>VoltKeep</h3>
              <p>$29/month. Every license, cert, and policy tracked automatically — nobody has to remember anything.</p>
            </div>
          </div>
        </section>

        <section id="how">
          <div className="section-head">
            <div className="eyebrow">How it works</div>
            <h2>Set it up once. It runs itself from there.</h2>
          </div>
          <div className="steps">
            <div className="step"><div className="n">1</div><h3>Add each credential</h3><p>License, cert, insurance policy, or bond — enter the details once.</p></div>
            <div className="step"><div className="n">2</div><h3>Assign an owner</h3><p>Every credential is tied to the person responsible for renewing it.</p></div>
            <div className="step"><div className="n">3</div><h3>Reminders go out automatically</h3><p>Email alerts at 90, 60, 30, and 7 days before expiry.</p></div>
            <div className="step"><div className="n">4</div><h3>Escalation if nothing happens</h3><p>If a reminder goes unanswered, the business owner gets notified.</p></div>
          </div>
        </section>

        <section id="pricing">
          <div className="section-head">
            <div className="eyebrow">Pricing</div>
            <h2>Priced for a small team, not an enterprise compliance department.</h2>
            <p style={{ marginTop: 10 }}>30-day money-back guarantee — if it's not useful, get a full refund, no questions asked.</p>
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
          <h2>Get your credentials organized this week.</h2>
          <p>No credit card required — sign in with your email to get started.</p>
          <a href="/login" className="btn-primary">Get early access</a>
        </section>
      </div>

      <footer>© 2026 VoltKeep. All rights reserved. Compliance tracking for small electrical contractors.</footer>

      <a href="mailto:voltkeep.support@gmail.com?subject=VoltKeep%20question" className="help-btn">
        💬 Contact us
      </a>
    </div>
  );
}
