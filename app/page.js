'use client';
import { useMemo, useState } from 'react';

const UPI_ID = 'hrj107-3@okhdfcbank';

const TOOLS = [
  {
    id:'ex', slug:'ex-comeback-predictor', title:'Ex Comeback Predictor', emoji:'💔', price:49,
    hook:'Find whether the door is still emotionally open.',
    seo:'Calculated ex comeback score based on contact, breakup reason, block status and effort signals.',
    questions:[
      q('name','text','Your name / nickname'),
      q('other','text','Ex name / nickname'),
      q('relationshipLength','choice','How long was the relationship?',[['under3','Under 3 months'],['three12','3–12 months'],['over1','1+ year'],['over3','3+ years']]),
      q('breakupInitiator','choice','Who ended it?',[['you','I ended it'],['them','They ended it'],['mutual','Mutual']]),
      q('breakupReason','choice','Main breakup reason?',[['misunderstanding','Misunderstanding'],['distance','Distance/timing'],['family','Family pressure'],['fighting','Too much fighting'],['trust','Trust issue'],['cheating','Cheating']]),
      q('lastContact','choice','When was the last contact?',[['today','Recently'],['week','This week'],['month','This month'],['long','Long time ago']]),
      q('blockStatus','choice','Current block/status?',[['none','No block'],['muted','Ignored/muted'],['blocked','Blocked']]),
      q('postBreakupContact','choice','Post-breakup contact?',[['often','Often'],['sometimes','Sometimes'],['never','Never']]),
      q('newPartner','choice','Do they have someone new?',[['no','No'],['maybe','Maybe'],['yes','Yes']]),
      q('attachment','scale','Your attachment level'),
      q('effortFromThem','scale','Effort from their side'),
      q('details','textarea','Add situation details')
    ]
  },
  {
    id:'crush', slug:'crush-compatibility-test', title:'Crush Compatibility', emoji:'💘', price:79,
    hook:'Check attraction signals, timing and comfort.',
    seo:'Crush compatibility test using communication quality, initiation, comfort, respect and flirting signals.',
    questions:[
      q('name','text','Your name'),
      q('other','text','Crush name / nickname'),
      q('talkFrequency','choice','How often do you talk?',[['daily','Daily'],['weekly','Weekly'],['rare','Rarely'],['none','Almost never']]),
      q('whoInitiates','choice','Who usually starts conversation?',[['they','They do'],['both','Both'],['you','Mostly me']]),
      q('replyQuality','choice','Reply quality?',[['fast','Fast and excited'],['warm','Warm'],['late','Late but okay'],['dry','Dry']]),
      q('timeTogether','choice','Do you spend time together?',[['often','Often'],['sometimes','Sometimes'],['never','Never']]),
      q('flirting','scale','Flirting signal'),
      q('sharedInterests','scale','Shared interests'),
      q('emotionalComfort','scale','Emotional comfort'),
      q('respect','scale','Respect level'),
      q('timing','choice','Timing feels...', [['right','Right'],['slow','Need slow approach'],['bad','Bad timing']]),
      q('details','textarea','Add situation details')
    ]
  },
  {
    id:'toxic', slug:'toxicity-score-test', title:'Toxicity Score', emoji:'☠️', price:29,
    hook:'Understand the intense patterns people may notice.',
    seo:'Toxicity score test based on jealousy, ghosting, anger, accountability and communication patterns.',
    questions:[
      q('name','text','Your name / nickname'),
      q('jealousy','scale','Jealousy level'),
      q('ghosting','scale','Ghosting tendency'),
      q('manipulation','scale','Mind-game tendency'),
      q('anger','scale','Anger intensity'),
      q('revenge','scale','Revenge tendency'),
      q('possessive','scale','Possessiveness'),
      q('apologizes','scale','How often do you apologize?'),
      q('accountability','scale','Accountability'),
      q('communication','scale','Clear communication'),
      q('details','textarea','Add situation details')
    ]
  },
  {
    id:'rare', slug:'how-rare-are-you', title:'How Rare Are You?', emoji:'🦄', price:39,
    hook:'Discover how unusual your personality mix is.',
    seo:'Rarity score test based on independence, originality, ambition, confidence and lifestyle signals.',
    questions:[
      q('name','text','Your name / nickname'),
      q('city','text','City'),
      q('independence','scale','Independence'),
      q('riskTaking','scale','Risk-taking'),
      q('unusualInterests','scale','Unusual interests'),
      q('socialEnergy','scale','Social energy'),
      q('travel','scale','Travel/exposure'),
      q('ambition','scale','Ambition'),
      q('discipline','scale','Discipline'),
      q('originality','scale','Originality'),
      q('confidence','scale','Confidence'),
      q('details','textarea','What makes you different?')
    ]
  },
  {
    id:'future', slug:'future-rich-or-broke', title:'Future Trajectory Score', emoji:'💸', price:49,
    hook:'Analyze what your current habits suggest.',
    seo:'Future trajectory calculator based on savings, investing, skill growth, career clarity and spending control.',
    questions:[
      q('name','text','Your name / nickname'),
      q('incomeHabit','scale','Income-building habit'),
      q('savings','scale','Savings habit'),
      q('debt','scale','Debt pressure'),
      q('investing','scale','Investing habit'),
      q('skillGrowth','scale','Skill growth'),
      q('careerClarity','scale','Career clarity'),
      q('spendingControl','scale','Spending control'),
      q('emergencyFund','scale','Emergency fund'),
      q('consistency','scale','Consistency'),
      q('discipline','scale','Discipline'),
      q('details','textarea','Your career/money situation')
    ]
  }
];

function q(key,type,label,options=[]){return {key,type,label,options}}

function num(x){ return Number(x || 0); }
function clamp(x,min=1,max=99){ return Math.max(min, Math.min(max, Math.round(x))); }
function normalize(raw, min, max){ return clamp(((raw - min) / (max - min)) * 100, 1, 99); }

function detailSignals(text=''){
  const t = String(text).toLowerCase();
  const positive = ['sorry','apolog','miss','love','care','respect','talk','meet','effort','changed','improve','trust','calm','support','consistent','future','career','save','invest','learn'];
  const negative = ['block','cheat','abuse','toxic','fight','lie','ignore','ghost','revenge','angry','debt','lazy','confused','addict','controlling','manipulate'];
  let pos = positive.filter(w => t.includes(w)).length;
  let neg = negative.filter(w => t.includes(w)).length;
  return { pos, neg, wordCount: t.trim() ? t.trim().split(/\s+/).length : 0 };
}

function calculate(tool, a){
  let raw=0, min=0, max=100, positives=[], risks=[], dimensions={}, narrative='';
  const d = detailSignals(a.details);

  if(tool.id==='ex'){
    min=-75; max=115; raw=5;
    const add=(value,label)=>{ raw+=value; if(value>0) positives.push(`${label} adds a positive signal.`); if(value<0) risks.push(`${label} weakens the comeback signal.`); };
    add({under3:2,three12:7,over1:13,over3:16}[a.relationshipLength]||0,'Relationship length');
    add({you:-5,them:7,mutual:12}[a.breakupInitiator]||0,'Breakup initiator');
    add({misunderstanding:20,distance:10,family:6,fighting:-9,trust:-18,cheating:-26}[a.breakupReason]||0,'Breakup reason');
    add({today:22,week:15,month:5,long:-14}[a.lastContact]||0,'Last contact');
    add({none:14,muted:2,blocked:-24}[a.blockStatus]||0,'Block status');
    add({often:16,sometimes:7,never:-10}[a.postBreakupContact]||0,'Post-breakup contact');
    add({no:10,maybe:-4,yes:-24}[a.newPartner]||0,'New partner signal');
    add(num(a.attachment)*3,'Your attachment');
    add(num(a.effortFromThem)*5,'Effort from their side');
    raw += d.pos*3 - d.neg*4;
    dimensions = {
      'Emotional residue': clamp(num(a.attachment)*18 + (a.lastContact==='today'?10:0),0,100),
      'Access/contact': clamp(({none:75,muted:45,blocked:15}[a.blockStatus]||35) + ({often:18,sometimes:8,never:-8}[a.postBreakupContact]||0),0,100),
      'Risk level': clamp(100 - (({cheating:85,trust:75,fighting:58,distance:35,misunderstanding:25,family:40}[a.breakupReason]||50) + (a.newPartner==='yes'?25:0)),0,100)
    };
    narrative = 'This score weighs emotional residue, real access, breakup damage, recent contact and effort signals. It is strongest when contact is recent, access is open, and breakup damage is repairable.';
  }

  if(tool.id==='crush'){
    min=-45; max=130; raw=0;
    const add=(value,label)=>{ raw+=value; if(value>0) positives.push(`${label} supports attraction.`); if(value<0) risks.push(`${label} weakens attraction.`); };
    add({daily:20,weekly:10,rare:-6,none:-18}[a.talkFrequency]||0,'Talk frequency');
    add({they:18,both:12,you:-7}[a.whoInitiates]||0,'Initiation pattern');
    add({fast:16,warm:11,late:-5,dry:-12}[a.replyQuality]||0,'Reply quality');
    add({often:14,sometimes:7,never:-10}[a.timeTogether]||0,'Time together');
    add(num(a.flirting)*6,'Flirting');
    add(num(a.sharedInterests)*5,'Shared interests');
    add(num(a.emotionalComfort)*5,'Emotional comfort');
    add(num(a.respect)*4,'Respect');
    add({right:10,slow:2,bad:-12}[a.timing]||0,'Timing');
    raw += d.pos*2 - d.neg*3;
    dimensions = {
      'Attraction signal': clamp(num(a.flirting)*18 + ({fast:10,warm:6,dry:-10}[a.replyQuality]||0),0,100),
      'Mutual effort': clamp(({they:85,both:72,you:35}[a.whoInitiates]||45),0,100),
      'Comfort base': clamp(num(a.emotionalComfort)*18 + num(a.respect)*10,0,100)
    };
    narrative = 'This score weighs mutual effort, communication warmth, comfort, respect and timing. High compatibility requires more than liking someone; it needs response quality and emotional ease.';
  }

  if(tool.id==='toxic'){
    min=0; max=210; raw=0;
    const add=(value,label,type='risk')=>{ raw+=value; if(type==='risk' && value>0) risks.push(`${label} increases intensity.`); if(type==='protect' && value>0) positives.push(`${label} reduces intensity.`); };
    add(num(a.jealousy)*9,'Jealousy');
    add(num(a.ghosting)*8,'Ghosting');
    add(num(a.manipulation)*10,'Mind games');
    add(num(a.anger)*8,'Anger');
    add(num(a.revenge)*9,'Revenge tendency');
    add(num(a.possessive)*8,'Possessiveness');
    add(-num(a.apologizes)*6,'Apology','protect');
    add(-num(a.accountability)*7,'Accountability','protect');
    add(-num(a.communication)*6,'Communication','protect');
    raw += d.neg*5 - d.pos*3;
    dimensions = {
      'Conflict intensity': clamp(num(a.anger)*17 + num(a.revenge)*14,0,100),
      'Control pattern': clamp(num(a.jealousy)*15 + num(a.possessive)*15 + num(a.manipulation)*12,0,100),
      'Repair ability': clamp(num(a.apologizes)*18 + num(a.accountability)*18 + num(a.communication)*14,0,100)
    };
    narrative = 'This score is not a label. It identifies intensity patterns: jealousy, control, anger and repair ability. High repair ability reduces the practical risk.';
  }

  if(tool.id==='rare'){
    min=0; max=210; raw=0;
    const add=(value,label)=>{ raw+=value; if(value>0) positives.push(`${label} adds distinctiveness.`); };
    add(num(a.independence)*8,'Independence');
    add(num(a.riskTaking)*5,'Risk-taking');
    add(num(a.unusualInterests)*10,'Unusual interests');
    add(num(a.socialEnergy)*4,'Social energy');
    add(num(a.travel)*5,'Travel/exposure');
    add(num(a.ambition)*7,'Ambition');
    add(num(a.discipline)*5,'Discipline');
    add(num(a.originality)*10,'Originality');
    add(num(a.confidence)*6,'Confidence');
    raw += d.pos*2;
    dimensions = {
      'Originality': clamp(num(a.originality)*18 + num(a.unusualInterests)*16,0,100),
      'Independent identity': clamp(num(a.independence)*18 + num(a.confidence)*10,0,100),
      'Life exposure': clamp(num(a.travel)*15 + num(a.riskTaking)*10,0,100)
    };
    narrative = 'This is a distinctiveness score, not a census claim. It measures how uncommon your combination of independence, originality, ambition and lifestyle signals appears from your answers.';
  }

  if(tool.id==='future'){
    min=-30; max=245; raw=0;
    const add=(value,label,type='positive')=>{ raw+=value; if(type==='positive' && value>0) positives.push(`${label} strengthens trajectory.`); if(type==='risk' && value>0) risks.push(`${label} creates pressure.`); };
    add(num(a.incomeHabit)*7,'Income-building habit');
    add(num(a.savings)*10,'Savings habit');
    add(num(a.debt)*-9,'Debt pressure','risk');
    add(num(a.investing)*10,'Investing habit');
    add(num(a.skillGrowth)*10,'Skill growth');
    add(num(a.careerClarity)*8,'Career clarity');
    add(num(a.spendingControl)*8,'Spending control');
    add(num(a.emergencyFund)*7,'Emergency fund');
    add(num(a.consistency)*9,'Consistency');
    add(num(a.discipline)*9,'Discipline');
    raw += d.pos*2 - d.neg*3;
    dimensions = {
      'Wealth-building habits': clamp(num(a.savings)*16 + num(a.investing)*16 + num(a.incomeHabit)*10,0,100),
      'Execution strength': clamp(num(a.discipline)*17 + num(a.consistency)*17 + num(a.skillGrowth)*10,0,100),
      'Financial pressure': clamp(100 - num(a.debt)*18 + num(a.emergencyFund)*8,0,100)
    };
    narrative = 'This is a trajectory score based on habits, not destiny. Strong results come from savings, investing, skill growth, discipline and spending control.';
  }

  const contradictions = contradictionCheck(tool.id, a);
  let score = normalize(raw,min,max);

  // confidence reduces extreme claims when data is weak or contradictory
  const conf = confidence(tool, a);
  if(conf < 70){ score = Math.round(score*0.85 + 50*0.15); }
  if(contradictions.length){ score = Math.round(score*0.9 + 50*0.1); }

  const strongestPositive = positives[0] || 'Your answers show at least one constructive signal.';
  const biggestRisk = risks[0] || 'No strong risk signal dominated the result.';

  return {
    score: clamp(score),
    confidence: conf,
    label: label(tool.id, score),
    dimensions,
    factors: [
      `Strongest positive: ${strongestPositive}`,
      `Biggest risk: ${biggestRisk}`,
      `Confidence level: ${conf}% based on answer completeness and detail quality.`,
      ...contradictions
    ],
    contradictions,
    narrative,
    locked: premium(tool.id, score, a)
  };
}

function confidence(tool, a){
  const relevant = tool.questions.filter(x => x.type !== 'textarea');
  const answered = relevant.filter(x => String(a[x.key] || '').trim()).length;
  const completion = Math.round((answered / relevant.length) * 70);
  const details = detailSignals(a.details).wordCount;
  const detailScore = details >= 18 ? 18 : details >= 10 ? 12 : details >= 5 ? 6 : 0;
  return clamp(completion + detailScore + 10, 35, 96);
}

function contradictionCheck(id, a){
  const flags = [];
  if(id === 'ex'){
    if(a.blockStatus === 'blocked' && a.postBreakupContact === 'often') flags.push('Mixed signal: blocked status conflicts with frequent contact.');
    if(a.newPartner === 'yes' && num(a.effortFromThem) >= 4) flags.push('Mixed signal: new partner exists, but effort from their side is still high.');
    if(a.breakupReason === 'cheating' && a.lastContact === 'today') flags.push('Mixed signal: recent contact exists, but trust damage remains a major risk.');
  }
  if(id === 'crush'){
    if(a.replyQuality === 'dry' && num(a.flirting) >= 4) flags.push('Mixed signal: dry replies conflict with strong flirting signals.');
    if(a.whoInitiates === 'you' && a.timeTogether === 'often') flags.push('Mixed signal: you initiate more, but time spent together keeps the possibility alive.');
  }
  if(id === 'toxic'){
    if(num(a.manipulation) >= 4 && num(a.accountability) >= 4) flags.push('Mixed pattern: high mind-games but also high accountability.');
    if(num(a.anger) >= 4 && num(a.communication) >= 4) flags.push('Mixed pattern: anger is high, but communication may reduce damage.');
  }
  if(id === 'future'){
    if(num(a.savings) >= 4 && num(a.debt) >= 4) flags.push('Mixed signal: savings habit is good, but debt pressure is also high.');
    if(num(a.incomeHabit) >= 4 && num(a.discipline) <= 2) flags.push('Mixed signal: income ambition is present, but discipline may block progress.');
  }
  return flags;
}

function label(id,s){
  const high=s>=75, mid=s>=55;
  const m={
    ex:['High comeback signal','Mixed signal, not fully over','Low comeback signal'],
    crush:['Strong attraction pattern','Potential, but timing matters','Interest looks uncertain'],
    toxic:['High intensity pattern','Manageable but noticeable','Mostly stable energy'],
    rare:['Rare personality mix','Distinct but relatable','Common but charming'],
    future:['Strong future trajectory','Can win with discipline','Habits need correction']
  };
  return high?m[id][0]:mid?m[id][1]:m[id][2];
}

function premium(id, score, a){
  const data = {
    ex:['A personalized contact/no-contact recommendation','Best message style based on breakup reason','What may make them pull away again','7-day emotional strategy'],
    crush:['Whether to confess now or wait','Best opener based on reply pattern','Green flags and red flags breakdown','How to increase attraction without looking desperate'],
    toxic:['Your strongest intensity pattern','What people may feel around you','Your repairability score','One habit to fix first'],
    rare:['Your distinctiveness breakdown','Dating rarity interpretation','Friend-circle role','Shareable result card text'],
    future:['Money personality profile','Biggest wealth blocker','Best next 30-day habit','Trajectory improvement plan']
  };
  return data[id];
}

const initialAnswers = {};
TOOLS.forEach(t => t.questions.forEach(q => initialAnswers[q.key] = ''));

export default function Home(){
  const [tool,setTool]=useState(TOOLS[0]); const [answers,setAnswers]=useState(initialAnswers); const [step,setStep]=useState(0); const [result,setResult]=useState(null); const [showPay,setShowPay]=useState(false); const [utr,setUtr]=useState('');
  const current=tool.questions[step]; const progress=Math.round(((step+1)/tool.questions.length)*100);
  const upiLink=useMemo(()=>`upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent('VibeLeak AI')}&am=${tool.price}&cu=INR&tn=${encodeURIComponent(tool.title+' report')}`,[tool]);
  function chooseTool(t){setTool(t);setStep(0);setResult(null);setShowPay(false)}
  function update(k,v){setAnswers({...answers,[k]:v})}
  function next(){ if(current.type!=='textarea' && !answers[current.key]) return alert('Answer this first'); if(step<tool.questions.length-1) setStep(step+1); else setResult(calculate(tool,answers))}
  function back(){ if(step>0) setStep(step-1)}
  async function copyUPI(){await navigator.clipboard.writeText(UPI_ID); alert('UPI copied')}
  return <main className="wrap">
    <nav className="nav"><div className="brand">VibeLeak <span>AI</span></div><div className="navlinks"><a href="#tests">Tests</a><a href="#faq">FAQ</a><a className="btn secondary" href="#quiz">Start</a></div></nav>
    <section className="hero"><div><span className="pill">Your answers reveal more than you think ✨</span><h1>Love, personality and future score tests that feel personal.</h1><p className="muted">Choose a test, answer focused questions, get a calculated score, and unlock deeper insights with UPI.</p><div className="actions"><a href="#tests" className="btn">Explore Tests</a><a href="#quiz" className="btn secondary">Start Now</a></div></div><div className="card hero-card"><h2>Built to feel specific.</h2><p className="muted">The new engine uses normalized scoring, confidence level, contradiction detection and factor-based explanations.</p><div className="metric-row"><div className="mini"><strong>5</strong><span>Tests</span></div><div className="mini"><strong>₹29+</strong><span>Unlocks</span></div><div className="mini"><strong>UPI</strong><span>Fast pay</span></div></div></div></section>
    <section className="section" id="tests"><span className="pill">Choose your test</span><h2>What do you want to discover?</h2><div className="tools">{TOOLS.map(t=><div key={t.id} className={'tool '+(tool.id===t.id?'active':'')} onClick={()=>chooseTool(t)}><div className="emoji">{t.emoji}</div><h3>{t.title}</h3><p className="small">{t.hook}</p><div className="price">₹{t.price}</div></div>)}</div></section>
    <section className="section quiz-shell" id="quiz">
      <div className="card"><span className="pill">{tool.emoji} {tool.title}</span><h2>{tool.hook}</h2><p className="muted">{tool.seo}</p><div className="progress"><div className="bar" style={{width:`${progress}%`}}/></div><p className="small">Question {step+1} of {tool.questions.length}</p><Question q={current} value={answers[current.key]} onChange={v=>update(current.key,v)}/><div className="actions"><button className="btn secondary" onClick={back}>Back</button><button className="btn" onClick={next}>{step===tool.questions.length-1?'Reveal My Score':'Next'}</button></div></div>
      <div className="card">{!result?<><h2>Your result will appear here.</h2><p className="muted">Answer the focused questions to calculate your score.</p></>:<><div className="result-score">{result.score}%</div><h2>{result.label}</h2><p className="muted">{result.narrative}</p><div className="metric-row"><div className="mini"><strong>{result.confidence}%</strong><span>Confidence</span></div>{Object.entries(result.dimensions).slice(0,2).map(([k,v])=><div className="mini" key={k}><strong>{v}%</strong><span>{k}</span></div>)}</div><h3>What shaped your result?</h3>{result.factors.map((f,i)=><div className="factor" key={i}>{f}</div>)}<div className="share-card">{tool.emoji} I scored {result.score}% on {tool.title}. Can you beat this?</div><h3>Your score is only the surface</h3><div className="locked"><ul>{result.locked.map((x,i)=><li key={i}>{x}</li>)}</ul></div><div className="paybox"><h3>Reveal what your score isn’t telling you — ₹{tool.price}</h3><p className="small">Mobile: UPI app may open. Desktop: copy UPI ID.</p><div className="upi">UPI: {UPI_ID}</div><div className="actions"><a href={upiLink} className="btn">Unlock with UPI</a><button className="btn secondary" onClick={copyUPI}>Copy UPI</button><button className="btn secondary" onClick={()=>setShowPay(!showPay)}>Verify Payment</button></div>{showPay&&<div className="actions"><input placeholder="Enter UTR / Transaction ID" value={utr} onChange={e=>setUtr(e.target.value)}/><button className="btn secondary" onClick={()=>alert('Payment reference received. Verify manually.')}>Submit</button></div>}<div className="qr">QR placeholder<br/>Copy UPI active</div></div></>}</div>
    </section>
    <section className="section grid3"><Info title="Normalized Scoring" text="Raw answer points are converted into a calibrated 1–99 score to avoid fake inflated results."/><Info title="Contradiction Detection" text="Mixed signals are detected and shown in the result explanation."/><Info title="Confidence Level" text="The engine rates how reliable the result is based on answer completeness and detail quality."/></section>
    <section className="section" id="faq"><span className="pill">FAQ</span><h2>Questions people ask</h2><div className="faq"><details><summary>Is this real prediction?</summary><p className="muted">It is an entertainment and self-reflection tool. Scores are calculated from your answers with rule-based logic, confidence and contradiction checks, but are not guaranteed predictions.</p></details><details><summary>Why does it feel personal?</summary><p className="muted">Because each test uses different questions, weighted factors, dimensions, mixed-signal checks and answer-detail signals.</p></details><details><summary>Why pay?</summary><p className="muted">Free result shows the score and main factors. Paid unlock reveals deeper analysis, message ideas, and personalized next steps.</p></details></div></section>
    <footer className="footer"><span>© VibeLeak AI</span><a href="/terms">Terms</a><a href="/privacy">Privacy</a><a href="/refunds">Refunds</a></footer>
  </main>
}

function Question({q,value,onChange}){
  if(q.type==='text') return <><div className="q-title">{q.label}</div><input autoFocus value={value||''} onChange={e=>onChange(e.target.value)} placeholder={q.label}/></>
  if(q.type==='textarea') return <><div className="q-title">{q.label}</div><textarea value={value||''} onChange={e=>onChange(e.target.value)} placeholder={q.label}/></>
  if(q.type==='scale') return <><div className="q-title">{q.label}</div><div className="answer-grid">{[1,2,3,4,5].map(n=><button className={'answer '+(String(value)===String(n)?'active':'')} key={n} onClick={()=>onChange(String(n))}>{n}/5</button>)}</div></>
  return <><div className="q-title">{q.label}</div><div className="answer-grid">{q.options.map(([v,l])=><button className={'answer '+(value===v?'active':'')} key={v} onClick={()=>onChange(v)}>{l}</button>)}</div></>
}

function Info({title,text}){return <div className="card"><h3>{title}</h3><p className="muted">{text}</p></div>}
