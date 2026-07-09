'use client';
import { useMemo, useState } from 'react';

const UPI_ID = 'hrj107-3@okhdfcbank';

const TOOLS = [
  { id:'ex', title:'Ex Comeback Predictor', emoji:'💔', price:49, hook:'Will they come back?' },
  { id:'crush', title:'Kundli + Crush Compatibility', emoji:'💘', price:79, hook:'Crush tumhare liye right hai?' },
  { id:'toxic', title:'AI Roast / Toxicity Score', emoji:'☠️', price:29, hook:'Kitne toxic ho tum?' },
  { id:'rare', title:'How Rare Are You?', emoji:'🦄', price:39, hook:'1 in how many people are like you?' },
  { id:'future', title:'Future Rich or Broke?', emoji:'💸', price:49, hook:'40 tak rich ya broke?' }
];

const DEFAULT = {
  name:'', other:'', age:'', city:'',
  vibe:'', attachment:'', effort:'', contact:'', block:'', breakup:'', honesty:'',
  ambition:'', moneyHabit:'', discipline:'', social:'', drama:'', career:''
};

function clamp(n,min=1,max=99){ return Math.max(min, Math.min(max, Math.round(n))); }

function scoreEx(f){
  let s = 45;
  if (f.contact === 'today') s += 18;
  if (f.contact === 'week') s += 12;
  if (f.contact === 'month') s += 4;
  if (f.contact === 'long') s -= 10;
  if (f.block === 'none') s += 12;
  if (f.block === 'soft') s += 3;
  if (f.block === 'hard') s -= 18;
  if (f.breakup === 'misunderstanding') s += 15;
  if (f.breakup === 'distance') s += 6;
  if (f.breakup === 'cheating') s -= 18;
  if (f.breakup === 'toxic') s -= 10;
  s += Number(f.attachment || 0) * 3;
  s += Number(f.effort || 0) * 2;
  s -= Number(f.drama || 0) * 2;
  return clamp(s);
}

function scoreCrush(f){
  let s = 42;
  s += Number(f.effort || 0) * 3;
  s += Number(f.honesty || 0) * 2;
  s += Number(f.social || 0) * 2;
  s -= Number(f.drama || 0) * 2;
  if (f.contact === 'today') s += 14;
  if (f.contact === 'week') s += 9;
  if (f.contact === 'long') s -= 7;
  if (f.vibe === 'main') s += 5;
  if (f.vibe === 'confused') s -= 4;
  return clamp(s);
}

function scoreToxic(f){
  let s = 25;
  s += Number(f.drama || 0) * 6;
  s += Number(f.attachment || 0) * 3;
  s -= Number(f.honesty || 0) * 2;
  s -= Number(f.discipline || 0);
  if (f.vibe === 'overthinking') s += 10;
  if (f.vibe === 'emotional') s += 8;
  if (f.vibe === 'chill') s -= 7;
  return clamp(s);
}

function scoreRare(f){
  let s = 45;
  s += Number(f.ambition || 0) * 2;
  s += Number(f.social || 0) * 2;
  s += Number(f.discipline || 0) * 2;
  s += Number(f.honesty || 0);
  if (f.vibe === 'main') s += 14;
  if (f.vibe === 'chill') s += 6;
  if (f.vibe === 'confused') s -= 3;
  if ((f.city||'').length > 6) s += 4;
  return clamp(s);
}

function scoreFuture(f){
  let s = 35;
  s += Number(f.ambition || 0) * 5;
  s += Number(f.discipline || 0) * 5;
  s += Number(f.moneyHabit || 0) * 4;
  s += Number(f.career || 0) * 3;
  s -= Number(f.drama || 0) * 2;
  if (f.vibe === 'main') s += 5;
  if (f.vibe === 'confused') s -= 8;
  return clamp(s);
}

function calculate(tool, f){
  const score = tool === 'ex' ? scoreEx(f) :
    tool === 'crush' ? scoreCrush(f) :
    tool === 'toxic' ? scoreToxic(f) :
    tool === 'rare' ? scoreRare(f) :
    scoreFuture(f);

  const factors = explainFactors(tool, f, score);
  return { score, label:getLabel(tool,score), factors, paid:paidBullets(tool, f, score) };
}

function getLabel(tool, score){
  if(tool==='ex') return score>=75?'High comeback signal':score>=55?'Mixed signal, not fully over':'Low comeback signal';
  if(tool==='crush') return score>=75?'Strong compatibility vibe':score>=55?'Potential hai, patience chahiye':'Risky crush zone';
  if(tool==='toxic') return score>=75?'Certified chaotic red flag':score>=55?'Cute toxic energy':'Mostly harmless';
  if(tool==='rare') return score>=75?'Rare main-character profile':score>=55?'Different but relatable':'Common but charming';
  return score>=75?'Future rich potential':score>=55?'Can win with discipline':'Broke-risk habits detected';
}

function explainFactors(tool,f,score){
  if(tool==='ex') return [
    `Last contact: ${f.contact || 'not given'}`,
    `Block status: ${f.block || 'not given'}`,
    `Breakup reason: ${f.breakup || 'not given'}`,
    `Attachment and effort increased the score; drama reduced it.`
  ];
  if(tool==='crush') return [
    `Communication frequency and effort are key factors.`,
    `Honesty/social comfort increased compatibility.`,
    `Drama/uncertainty reduced the score.`
  ];
  if(tool==='toxic') return [
    `Drama, overthinking and attachment increased toxicity.`,
    `Honesty and discipline reduced toxicity.`,
    `This is a fun self-awareness score, not a diagnosis.`
  ];
  if(tool==='rare') return [
    `Ambition, social style, discipline and vibe created your rarity score.`,
    `Main-character/chill traits increase uniqueness.`,
    `This is based on your answers, not random percentage.`
  ];
  return [
    `Ambition, discipline and money habits are the biggest factors.`,
    `Career clarity increases rich potential.`,
    `Drama and confusion reduce future stability score.`
  ];
}

function paidBullets(tool,f,score){
  if(tool==='ex') return ['Whether to text or stay silent', 'Best message style for your situation', 'What is hurting comeback chances', '7-day emotional strategy'];
  if(tool==='crush') return ['Confession timing', 'How to avoid looking desperate', 'Green flags and red flags', 'Best conversation opener'];
  if(tool==='toxic') return ['Brutal roast', 'Top toxic pattern', 'Why people still like you', 'How to reduce chaos'];
  if(tool==='rare') return ['Rarity breakdown', 'Dating rarity', 'Friend-circle role', 'Shareable card text'];
  return ['Money personality', 'Rich/broke risk factors', 'Career habit prediction', '3 changes to improve future score'];
}

export default function Home(){
  const [selected,setSelected]=useState(TOOLS[0]);
  const [form,setForm]=useState(DEFAULT);
  const [result,setResult]=useState(null);
  const [showPay,setShowPay]=useState(false);
  const [utr,setUtr]=useState('');
  const [paid,setPaid]=useState(false);
  const upiLink=useMemo(()=>`upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent('VibeLeak AI')}&am=${selected.price}&cu=INR&tn=${encodeURIComponent(selected.title+' report')}`,[selected]);

  function update(k,v){setForm({...form,[k]:v});}
  function changeTool(t){setSelected(t);setResult(null);setShowPay(false);setPaid(false);}
  function generate(){
    if(!form.name) return alert('Naam daalo bhai 😄');
    setResult(calculate(selected.id, form));
    setShowPay(false); setPaid(false);
  }
  async function copyUPI(){
    await navigator.clipboard.writeText(UPI_ID);
    alert('UPI ID copied: '+UPI_ID);
  }
  function submitUTR(){
    if(!utr.trim()) return alert('UTR / transaction ID daalo');
    setPaid(true);
  }

  return <main className="wrap">
    <nav className="nav"><div className="brand">VibeLeak <span>AI</span></div><a className="btn btn2" href="#tools">Start Test</a></nav>
    <section className="hero">
      <div>
        <span className="pill">Your answers reveal more than you think ✨</span>
        <h1>Discover the patterns hiding beneath your choices.</h1>
        <p className="muted">Explore personalized insights about love, attraction, personality, uniqueness and future potential — calculated from your answers.</p>
        <div className="note">Entertainment only. Real prediction guarantee nahi hai, but score random nahi hai.</div>
      </div>
      <div className="card"><h2>More Than Just a Score</h2><p className="muted">Your answers are evaluated across relevant factors to reveal patterns, strengths and signals you may be overlooking.</p></div>
    </section>

    <section id="tools">
      <h2>What Do You Want to Discover?</h2>
      <div className="tools">{TOOLS.map(t=><div key={t.id} className={'tool '+(selected.id===t.id?'active':'')} onClick={()=>changeTool(t)}><div style={{fontSize:34}}>{t.emoji}</div><h3>{t.title}</h3><p className="small">{t.hook}</p><div className="price">₹{t.price}</div></div>)}</div>
    </section>

    <section className="hero" style={{minHeight:'auto'}}>
      <div className="card">
        <span className="pill">{selected.emoji} {selected.title}</span>
        <h2>The More Honest You Are, The More Personal Your Result</h2>
        <div className="formgrid">
          <input placeholder="Your name / nickname" value={form.name} onChange={e=>update('name',e.target.value)} />
          <input placeholder={selected.id==='ex'?'Ex name':'Crush / optional name'} value={form.other} onChange={e=>update('other',e.target.value)} />
          <input placeholder="Age" value={form.age} onChange={e=>update('age',e.target.value)} />
          <input placeholder="City" value={form.city} onChange={e=>update('city',e.target.value)} />
          <div style={{gridColumn:'1 / -1'}}>
            <p className="small">Choose your vibe</p>
            <div className="vibe-grid">
              {[
                ['emotional','❤️ Emotional'],
                ['overthinking','🧠 Overthinking'],
                ['chill','😎 Chill'],
                ['main','✨ Main character'],
                ['confused','😵 Confused']
              ].map(([value,label]) => (
                <button
                  type="button"
                  key={value}
                  className={'vibe-btn '+(form.vibe===value?'active':'')}
                  onClick={() => update('vibe', value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <select value={form.contact} onChange={e=>update('contact',e.target.value)}>
            <option value="">Last contact</option><option value="today">Today/recently</option><option value="week">This week</option><option value="month">This month</option><option value="long">Long time ago</option>
          </select>
          <select value={form.block} onChange={e=>update('block',e.target.value)}>
            <option value="">Block status</option><option value="none">No block</option><option value="soft">Muted/ignored</option><option value="hard">Blocked</option>
          </select>
          <select value={form.breakup} onChange={e=>update('breakup',e.target.value)}>
            <option value="">Breakup/reason type</option><option value="misunderstanding">Misunderstanding</option><option value="distance">Distance/timing</option><option value="toxic">Too much fighting</option><option value="cheating">Cheating/trust issue</option>
          </select>
        </div>

        <div className="formgrid">
          <select value={form.attachment} onChange={e=>update('attachment',e.target.value)}><option value="">Attachment level</option>{[1,2,3,4,5].map(n=><option key={n} value={n}>{n}/5</option>)}</select>
          <select value={form.effort} onChange={e=>update('effort',e.target.value)}><option value="">Effort from other side</option>{[1,2,3,4,5].map(n=><option key={n} value={n}>{n}/5</option>)}</select>
          <select value={form.honesty} onChange={e=>update('honesty',e.target.value)}><option value="">Honesty</option>{[1,2,3,4,5].map(n=><option key={n} value={n}>{n}/5</option>)}</select>
          <select value={form.drama} onChange={e=>update('drama',e.target.value)}><option value="">Drama level</option>{[1,2,3,4,5].map(n=><option key={n} value={n}>{n}/5</option>)}</select>
          <select value={form.ambition} onChange={e=>update('ambition',e.target.value)}><option value="">Ambition</option>{[1,2,3,4,5].map(n=><option key={n} value={n}>{n}/5</option>)}</select>
          <select value={form.discipline} onChange={e=>update('discipline',e.target.value)}><option value="">Discipline</option>{[1,2,3,4,5].map(n=><option key={n} value={n}>{n}/5</option>)}</select>
          <select value={form.moneyHabit} onChange={e=>update('moneyHabit',e.target.value)}><option value="">Money habits</option>{[1,2,3,4,5].map(n=><option key={n} value={n}>{n}/5</option>)}</select>
          <select value={form.career} onChange={e=>update('career',e.target.value)}><option value="">Career clarity</option>{[1,2,3,4,5].map(n=><option key={n} value={n}>{n}/5</option>)}</select>
        </div>
        <textarea placeholder="Situation details..." value={form.situation} onChange={e=>update('situation',e.target.value)} />
        <div className="actions"><button className="btn" onClick={generate}>Reveal My Free Score</button></div>
      </div>

      <div className="result card">
        {!result?<p className="muted">Your personalized result is waiting.</p>:<>
          <div className="score">{result.score}%</div><h2>{result.label}</h2>
          <p className="muted">Calculated from the patterns in your answers.</p>
          <h3>What Shaped Your Result?</h3><ul className="list">{result.factors.map((x,i)=><li key={i}>{x}</li>)}</ul>
          <div className="share">{selected.emoji} {form.name} got {result.score}% on {selected.title}. Think someone can beat your score? Share it.</div>
          <h3>Your Score Is Only the Surface</h3><div className="blur"><ul className="list">{result.paid.map((x,i)=><li key={i}>{x}</li>)}</ul></div>
          <div className="paybox">
            <h3>Reveal What Your Score Isn’t Telling You — ₹{selected.price}</h3>
            <p className="small">Unlock your deeper analysis to discover the strongest factor shaping your result, what may be working against you, and personalized next-step insights.</p>
            <div className="upi">UPI: {UPI_ID}</div>
            <div className="actions"><a className="btn" href={upiLink}>Unlock with UPI</a><button className="btn btn2" onClick={copyUPI}>Copy Payment ID</button><button className="btn btn2" onClick={()=>setShowPay(!showPay)}>Verify My Payment</button></div>
            <div className="qr-placeholder">QR placeholder<br/>UPI ID copy option active</div>
            {showPay&&<div className="pay-form"><input placeholder="Enter UTR / Transaction ID" value={utr} onChange={e=>setUtr(e.target.value)} /><button className="btn btn2" onClick={submitUTR}>Submit & Reveal My Analysis</button></div>}
            {paid&&<div className="note">Payment reference received. Your full analysis will be available after verification.</div>}
          </div>
        </>}
      </div>
    </section>

    <footer className="footer">VibeLeak provides entertainment and self-reflection experiences based on user-provided answers. <a href="/terms">Terms</a></footer>
  </main>
}
