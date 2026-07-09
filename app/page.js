'use client';
import { useMemo, useState } from 'react';

const UPI_ID = 'hrj107-3@okhdfcbank';

const TOOLS = [
  {
    id: 'ex',
    title: 'Ex Comeback Predictor',
    emoji: '💔',
    price: 49,
    hook: 'Will they come back?',
    locked: ['Unke mind mein kya chal raha hai', 'Best message to send', '7-day comeback strategy']
  },
  {
    id: 'crush',
    title: 'Kundli + Crush Compatibility',
    emoji: '💘',
    price: 79,
    hook: 'Crush tumhare liye right hai?',
    locked: ['Love match breakdown', 'Red flags / green flags', 'Best timing to confess']
  },
  {
    id: 'toxic',
    title: 'AI Roast / Toxicity Score',
    emoji: '☠️',
    price: 29,
    hook: 'Kitne toxic ho tum?',
    locked: ['Brutal AI roast', 'Toxic habits list', 'How people secretly see you']
  },
  {
    id: 'rare',
    title: 'How Rare Are You?',
    emoji: '🦄',
    price: 39,
    hook: '1 in how many people are like you?',
    locked: ['Rarity report', 'Dating rarity', 'Main-character card']
  },
  {
    id: 'future',
    title: 'Future Rich or Broke?',
    emoji: '💸',
    price: 49,
    hook: '40 tak rich ya broke?',
    locked: ['Money personality', 'Future net-worth vibe', '3 habits to fix now']
  }
];

function hashScore(text, min=52, max=97) {
  let h = 0;
  for (let i=0;i<text.length;i++) h = (h * 31 + text.charCodeAt(i)) % 100000;
  return min + (h % (max-min+1));
}

function getLabel(tool, score) {
  if (tool === 'ex') return score > 80 ? 'They still stalk your energy' : score > 65 ? 'Confused but not fully gone' : 'Move on energy strong';
  if (tool === 'crush') return score > 82 ? 'Bollywood-level match' : score > 68 ? 'Potential hai, drama bhi hai' : 'Crush risky zone';
  if (tool === 'toxic') return score > 82 ? 'Certified red flag' : score > 65 ? 'Cute toxic' : 'Mostly harmless';
  if (tool === 'rare') return score > 85 ? 'Extremely rare specimen' : score > 70 ? 'Rare but manageable' : 'Common but charming';
  return score > 80 ? 'Future rich energy' : score > 64 ? 'Can become rich if disciplined' : 'Broke risk detected';
}

export default function Home() {
  const [selected, setSelected] = useState(TOOLS[0]);
  const [form, setForm] = useState({name:'', other:'', age:'', city:'', situation:'', vibe:''});
  const [result, setResult] = useState(null);
  const [showPay, setShowPay] = useState(false);
  const [utr, setUtr] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const upiLink = useMemo(() => {
    const note = `${selected.title} report`;
    return `upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent('VibeLeak AI')}&am=${selected.price}&cu=INR&tn=${encodeURIComponent(note)}`;
  }, [selected]);

  function update(k,v){ setForm({...form,[k]:v}); }

  function generate() {
    if (!form.name) return alert('Naam daalo pehle 😄');
    const seed = JSON.stringify({selected:selected.id, form});
    const score = hashScore(seed);
    const rareNumber = 100 + hashScore(seed, 300, 9800);
    setResult({
      score,
      label: getLabel(selected.id, score),
      rareNumber,
      freeLine: buildFreeLine(selected.id, score, form),
      paidBullets: buildPaidBullets(selected.id, score, form)
    });
    setShowPay(false);
    setSubmitted(false);
  }

  function submitUTR() {
    if (!utr.trim()) return alert('UTR / transaction ID daalo');
    setSubmitted(true);
  }

  return (
    <main className="wrap">
      <nav className="nav">
        <div className="brand">VibeLeak <span>AI</span></div>
        <a className="btn btn2" href="#tools">Start Test</a>
      </nav>

      <section className="hero">
        <div>
          <span className="pill">India ka most unnecessary but addictive AI test 😭</span>
          <h1>Find your love, cringe, toxicity, rarity & future score.</h1>
          <p className="muted">Free score lo. Full masala report ₹29–₹79 mein unlock karo. Pure entertainment, full shareability.</p>
          <div className="actions"><a className="btn" href="#tools">Try Now</a><a className="btn btn2" href="#pricing">See Prices</a></div>
          <div className="note">Disclaimer: Ye entertainment product hai. Astrology, love prediction, roast aur future score ko fun ke liye use karo.</div>
        </div>
        <div className="card">
          <h2>Most viral categories</h2>
          <p className="muted">💔 Ex comeback • 💘 Crush compatibility • ☠️ Toxic score • 🦄 Rare score • 💸 Rich or broke</p>
          <div className="share"><strong>Shareable result card:</strong><br/>“I am 87% rare and 62% toxic. Beat my score?”</div>
        </div>
      </section>

      <section id="tools">
        <h2>Choose your cringe test</h2>
        <div className="tools">
          {TOOLS.map(t => (
            <div key={t.id} className={'tool '+(selected.id===t.id?'active':'')} onClick={() => {setSelected(t); setResult(null);}}>
              <div style={{fontSize:34}}>{t.emoji}</div>
              <h3>{t.title}</h3>
              <p className="small">{t.hook}</p>
              <div className="price">₹{t.price}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="hero" style={{minHeight:'auto'}}>
        <div className="card">
          <span className="pill">{selected.emoji} {selected.title}</span>
          <h2>Answer quickly</h2>
          <div className="formgrid">
            <input placeholder="Your name / nickname" value={form.name} onChange={e=>update('name',e.target.value)} />
            <input placeholder={selected.id==='ex'?'Ex name':'Crush / friend / optional name'} value={form.other} onChange={e=>update('other',e.target.value)} />
            <input placeholder="Age" value={form.age} onChange={e=>update('age',e.target.value)} />
            <input placeholder="City" value={form.city} onChange={e=>update('city',e.target.value)} />
          </div>
          <textarea placeholder="Situation batao: breakup, crush, habits, lifestyle, goals..." value={form.situation} onChange={e=>update('situation',e.target.value)} />
          <select value={form.vibe} onChange={e=>update('vibe',e.target.value)}>
            <option value="">Choose your vibe</option>
            <option>Emotional</option>
            <option>Overthinking</option>
            <option>Chill but secretly dramatic</option>
            <option>Main character</option>
            <option>Confused</option>
          </select>
          <div className="actions"><button className="btn" onClick={generate}>Generate Free Score</button></div>
        </div>

        <div className="result card">
          {!result ? <p className="muted">Result yahan aayega. Score free hai, full report paid.</p> : <>
            <div className="score">{result.score}%</div>
            <h2>{result.label}</h2>
            <p className="muted">{result.freeLine}</p>
            <div className="share">{selected.emoji} {form.name || 'Someone'} got {result.score}% on {selected.title}. Share this and start drama.</div>

            <h3>Locked full report</h3>
            <div className="blur">
              <ul className="list">
                {result.paidBullets.map((b,i)=><li key={i}>{b}</li>)}
              </ul>
            </div>

            <div className="paybox">
              <h3>Unlock full report: ₹{selected.price}</h3>
              <p className="small">Pay via UPI, submit UTR, and manually unlock/report delivery can be handled.</p>
              <div className="upi">UPI: {UPI_ID}</div>
              <div className="actions">
                <a className="btn" href={upiLink}>Open UPI App</a>
                <button className="btn btn2" onClick={()=>setShowPay(!showPay)}>Submit UTR</button>
              </div>
              {showPay && <div className="pay-form">
                <input placeholder="Enter UTR / Transaction ID" value={utr} onChange={e=>setUtr(e.target.value)} />
                <button className="btn btn2" onClick={submitUTR}>I Have Paid</button>
              </div>}
              {submitted && <div className="note">UTR submitted. Verify payment and send report manually.</div>}
            </div>
          </>}
        </div>
      </section>

      <section id="pricing" className="card">
        <h2>Pricing</h2>
        <p className="muted">Low impulse pricing for India launch.</p>
        <ul className="list">
          {TOOLS.map(t => <li key={t.id}>{t.emoji} {t.title}: ₹{t.price}</li>)}
        </ul>
      </section>

      <footer className="footer">
        Entertainment only. Not professional advice. Not real astrology or guaranteed prediction.
      </footer>
    </main>
  );
}

function buildFreeLine(id, score, f) {
  const other = f.other || 'that person';
  if (id === 'ex') return score > 75 ? `${other} ka chapter closed nahi lag raha. Curiosity abhi baaki hai.` : `${other} ke case mein emotional distance zyada dikh raha hai.`;
  if (id === 'crush') return score > 75 ? `Compatibility strong hai, but timing ka scene important hai.` : `Crush energy mixed hai. Slow approach better.`;
  if (id === 'toxic') return score > 75 ? `Tum funny ho, but thoda dangerous bhi ho 😭` : `Tumhara toxicity manageable hai. Bas overthinking kam karo.`;
  if (id === 'rare') return `Only 1 in ${100 + score * 37} people have your exact chaotic vibe.`;
  return score > 75 ? `Rich energy hai, bas discipline lagana padega.` : `Broke risk tabhi hai jab habits same rahi.`;
}

function buildPaidBullets(id, score, f) {
  if (id === 'ex') return ['Will they text first?', 'Best message to send without looking desperate', 'No-contact ya soft contact?', '7-day comeback plan'];
  if (id === 'crush') return ['Crush compatibility breakdown', 'Confession timing', 'Green flags and red flags', 'What they may secretly notice about you'];
  if (id === 'toxic') return ['Brutal AI roast', 'Your top 5 toxic patterns', 'Why people still like you', 'How to become less chaotic'];
  if (id === 'rare') return ['Personality rarity report', 'Dating rarity', 'Friend-circle role', 'Instagram share card text'];
  return ['Money personality', 'Rich/broke risk factors', 'Career habit prediction', '3 changes to improve future score'];
}
