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
    id:'future', slug:'future-rich-or-broke', title:'Future Rich or Broke?', emoji:'💸', price:49,
    hook:'Analyze what your current habits suggest.',
    seo:'Future rich or broke calculator based on savings, investing, skill growth, career clarity and spending control.',
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

const initialAnswers = {};
TOOLS.forEach(t => t.questions.forEach(q => initialAnswers[q.key] = ''));

function val(x){return Number(x||0)}
function clamp(x){return Math.max(1,Math.min(99,Math.round(x)))}

function calculate(tool, a){
  let s = 0, factors = [];
  if(tool.id==='ex'){
    s=40;
    s += add({under3:2,three12:6,over1:10,over3:12}[a.relationshipLength], factors, 'Relationship length');
    s += add({you:-4,them:6,mutual:10}[a.breakupInitiator], factors, 'Who ended it');
    s += add({misunderstanding:16,distance:9,family:5,fighting:-7,trust:-14,cheating:-20}[a.breakupReason], factors, 'Breakup reason');
    s += add({today:18,week:13,month:5,long:-9}[a.lastContact], factors, 'Last contact');
    s += add({none:12,muted:2,blocked:-18}[a.blockStatus], factors, 'Block status');
    s += add({often:13,sometimes:6,never:-7}[a.postBreakupContact], factors, 'Post-breakup contact');
    s += add({no:8,maybe:-3,yes:-18}[a.newPartner], factors, 'New partner signal');
    s += add(val(a.attachment)*3, factors, 'Your attachment');
    s += add(val(a.effortFromThem)*4, factors, 'Effort from their side');
  } else if(tool.id==='crush'){
    s=38;
    s += add({daily:16,weekly:9,rare:-4,none:-12}[a.talkFrequency], factors, 'Talk frequency');
    s += add({they:14,both:10,you:-4}[a.whoInitiates], factors, 'Who initiates');
    s += add({fast:12,warm:9,late:-5,dry:-8}[a.replyQuality], factors, 'Reply quality');
    s += add({often:11,sometimes:6,never:-7}[a.timeTogether], factors, 'Time together');
    s += add(val(a.flirting)*5, factors, 'Flirting signal');
    s += add(val(a.sharedInterests)*4, factors, 'Shared interests');
    s += add(val(a.emotionalComfort)*4, factors, 'Emotional comfort');
    s += add(val(a.respect)*3, factors, 'Respect');
    s += add({right:8,slow:2,bad:-10}[a.timing], factors, 'Timing');
  } else if(tool.id==='toxic'){
    s=18;
    s += add(val(a.jealousy)*7, factors, 'Jealousy');
    s += add(val(a.ghosting)*6, factors, 'Ghosting');
    s += add(val(a.manipulation)*8, factors, 'Mind games');
    s += add(val(a.anger)*6, factors, 'Anger');
    s += add(val(a.revenge)*7, factors, 'Revenge tendency');
    s += add(val(a.possessive)*6, factors, 'Possessiveness');
    s -= add(val(a.apologizes)*4, factors, 'Apology reduces score');
    s -= add(val(a.accountability)*5, factors, 'Accountability reduces score');
    s -= add(val(a.communication)*4, factors, 'Communication reduces score');
  } else if(tool.id==='rare'){
    s=35;
    s += add(val(a.independence)*5, factors, 'Independence');
    s += add(val(a.riskTaking)*3, factors, 'Risk-taking');
    s += add(val(a.unusualInterests)*6, factors, 'Unusual interests');
    s += add(val(a.socialEnergy)*2, factors, 'Social energy');
    s += add(val(a.travel)*3, factors, 'Travel/exposure');
    s += add(val(a.ambition)*4, factors, 'Ambition');
    s += add(val(a.discipline)*3, factors, 'Discipline');
    s += add(val(a.originality)*6, factors, 'Originality');
    s += add(val(a.confidence)*3, factors, 'Confidence');
  } else {
    s=25;
    s += add(val(a.incomeHabit)*4, factors, 'Income-building habit');
    s += add(val(a.savings)*6, factors, 'Savings');
    s -= add(val(a.debt)*5, factors, 'Debt pressure');
    s += add(val(a.investing)*6, factors, 'Investing');
    s += add(val(a.skillGrowth)*6, factors, 'Skill growth');
    s += add(val(a.careerClarity)*5, factors, 'Career clarity');
    s += add(val(a.spendingControl)*5, factors, 'Spending control');
    s += add(val(a.emergencyFund)*4, factors, 'Emergency fund');
    s += add(val(a.consistency)*5, factors, 'Consistency');
    s += add(val(a.discipline)*5, factors, 'Discipline');
  }
  const score = clamp(s);
  return {score, label: label(tool.id, score), factors: factors.slice(0,5), locked: premium(tool.id)};
}

function add(v,factors,name){const x=Number(v||0); if(x!==0) factors.push(`${name}: ${x>0?'+':''}${x}`); return x}
function label(id,s){const high=s>=75, mid=s>=55; const m={ex:['High comeback signal','Mixed signal, not fully over','Low comeback signal'],crush:['Strong attraction pattern','Potential, but timing matters','Interest looks uncertain'],toxic:['Intense pattern detected','Manageable but noticeable','Mostly stable energy'],rare:['Rare personality mix','Distinct but relatable','Common but charming'],future:['Strong future potential','Can win with discipline','Habits need correction']};return high?m[id][0]:mid?m[id][1]:m[id][2]}
function premium(id){return {ex:['Whether to text or stay silent','Best message style','What hurts comeback chances','7-day emotional strategy'],crush:['Confession timing','Best opener','Green and red flags','Attraction signal breakdown'],toxic:['Your strongest pattern','What people may feel around you','Brutal roast-style insight','What to fix first'],rare:['Rarity breakdown','Dating rarity','Friend-circle role','Shareable card text'],future:['Money personality','Rich/broke risk factors','Career habit prediction','3 changes to improve future score']}[id]}

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
    <section className="hero"><div><span className="pill">Your answers reveal more than you think ✨</span><h1>Love, personality and future score tests that feel personal.</h1><p className="muted">Choose a test, answer focused questions, get a calculated score, and unlock deeper insights with UPI.</p><div className="actions"><a href="#tests" className="btn">Explore Tests</a><a href="#quiz" className="btn secondary">Start Now</a></div></div><div className="card hero-card"><h2>Not one generic form.</h2><p className="muted">Every tool uses its own questions and scoring logic.</p><div className="metric-row"><div className="mini"><strong>5</strong><span>Tests</span></div><div className="mini"><strong>₹29+</strong><span>Unlocks</span></div><div className="mini"><strong>UPI</strong><span>Fast pay</span></div></div></div></section>
    <section className="section" id="tests"><span className="pill">Choose your test</span><h2>What do you want to discover?</h2><div className="tools">{TOOLS.map(t=><div key={t.id} className={'tool '+(tool.id===t.id?'active':'')} onClick={()=>chooseTool(t)}><div className="emoji">{t.emoji}</div><h3>{t.title}</h3><p className="small">{t.hook}</p><div className="price">₹{t.price}</div></div>)}</div></section>
    <section className="section quiz-shell" id="quiz">
      <div className="card"><span className="pill">{tool.emoji} {tool.title}</span><h2>{tool.hook}</h2><p className="muted">{tool.seo}</p><div className="progress"><div className="bar" style={{width:`${progress}%`}}/></div><p className="small">Question {step+1} of {tool.questions.length}</p><Question q={current} value={answers[current.key]} onChange={v=>update(current.key,v)}/><div className="actions"><button className="btn secondary" onClick={back}>Back</button><button className="btn" onClick={next}>{step===tool.questions.length-1?'Reveal My Score':'Next'}</button></div></div>
      <div className="card">{!result?<><h2>Your result will appear here.</h2><p className="muted">Answer the focused questions to calculate your score.</p></>:<><div className="result-score">{result.score}%</div><h2>{result.label}</h2><p className="muted">Calculated from your selected answers for {tool.title}.</p><h3>What shaped your result?</h3>{result.factors.map((f,i)=><div className="factor" key={i}>{f}</div>)}<div className="share-card">{tool.emoji} I scored {result.score}% on {tool.title}. Can you beat this?</div><h3>Your score is only the surface</h3><div className="locked"><ul>{result.locked.map((x,i)=><li key={i}>{x}</li>)}</ul></div><div className="paybox"><h3>Reveal what your score isn’t telling you — ₹{tool.price}</h3><p className="small">Mobile: UPI app may open. Desktop: copy UPI ID.</p><div className="upi">UPI: {UPI_ID}</div><div className="actions"><a href={upiLink} className="btn">Unlock with UPI</a><button className="btn secondary" onClick={copyUPI}>Copy UPI</button><button className="btn secondary" onClick={()=>setShowPay(!showPay)}>Verify Payment</button></div>{showPay&&<div className="actions"><input placeholder="Enter UTR / Transaction ID" value={utr} onChange={e=>setUtr(e.target.value)}/><button className="btn secondary" onClick={()=>alert('Payment reference received. Verify manually.')}>Submit</button></div>}<div className="qr">QR placeholder<br/>Copy UPI active</div></div></>}</div>
    </section>
    <section className="section grid3"><Info title="Separate Questionnaires" text="Each test asks different questions, so the experience feels more personal."/><Info title="Calculated Scoring" text="Scores come from weighted answer factors, not pure random numbers."/><Info title="Shareable Results" text="Free score cards create curiosity and help organic sharing."/></section>
    <section className="section" id="faq"><span className="pill">FAQ</span><h2>Questions people ask</h2><div className="faq"><details><summary>Is this real prediction?</summary><p className="muted">It is an entertainment and self-reflection tool. Scores are calculated from your answers but are not guaranteed predictions.</p></details><details><summary>How do payments work?</summary><p className="muted">India launch uses UPI manual payment. Later you can connect gateway payments.</p></details><details><summary>Why pay?</summary><p className="muted">Free result shows the score. Paid unlock reveals deeper factors, message ideas, and personalized next steps.</p></details></div></section>
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
