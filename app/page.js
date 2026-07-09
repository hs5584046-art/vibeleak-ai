'use client';
import { useMemo, useState } from 'react';

const UPI_ID = 'hrj107-3@okhdfcbank';

const TOOLS = [
  { id:'ex', title:'Ex Comeback Predictor', emoji:'💔', price:49, hook:'Will they come back?' },
  { id:'crush', title:'Crush Compatibility', emoji:'💘', price:79, hook:'Are they actually into you?' },
  { id:'toxic', title:'Toxicity Score', emoji:'☠️', price:29, hook:'How intense are your patterns?' },
  { id:'rare', title:'How Rare Are You?', emoji:'🦄', price:39, hook:'How uncommon is your personality mix?' },
  { id:'future', title:'Future Rich or Broke?', emoji:'💸', price:49, hook:'What do your habits predict?' }
];

const INIT = {
  name:'', other:'', age:'', city:'', details:'',
  vibe:'',
  relationshipLength:'', breakupInitiator:'', breakupReason:'', lastContact:'', blockStatus:'', postBreakupContact:'', newPartner:'', attachment:'', effortFromThem:'',
  talkFrequency:'', whoInitiates:'', replyQuality:'', timeTogether:'', flirting:'', sharedInterests:'', emotionalComfort:'', respect:'', timing:'',
  jealousy:'', ghosting:'', manipulation:'', anger:'', revenge:'', possessive:'', apologizes:'', accountability:'', communication:'',
  independence:'', riskTaking:'', unusualInterests:'', socialEnergy:'', travel:'', ambition:'', discipline:'', originality:'', confidence:'',
  incomeHabit:'', savings:'', debt:'', investing:'', skillGrowth:'', careerClarity:'', spendingControl:'', emergencyFund:'', consistency:''
};

function n(v){return Number(v||0)}
function clamp(x){return Math.max(1,Math.min(99,Math.round(x)))}

function calculate(id,f){
  if(id==='ex') return calcEx(f);
  if(id==='crush') return calcCrush(f);
  if(id==='toxic') return calcToxic(f);
  if(id==='rare') return calcRare(f);
  return calcFuture(f);
}

function calcEx(f){
  let s=40;
  s += {under3:2, three12:6, over1:10, over3:12}[f.relationshipLength]||0;
  s += {you:-4, them:6, mutual:10}[f.breakupInitiator]||0;
  s += {misunderstanding:16, distance:9, family:5, fighting:-7, trust:-14, cheating:-20}[f.breakupReason]||0;
  s += {today:18, week:13, month:5, long:-9}[f.lastContact]||0;
  s += {none:12, muted:2, blocked:-18}[f.blockStatus]||0;
  s += {often:13, sometimes:6, never:-7}[f.postBreakupContact]||0;
  s += {no:8, maybe:-3, yes:-18}[f.newPartner]||0;
  s += n(f.attachment)*3 + n(f.effortFromThem)*4;
  return pack('ex',clamp(s),[
    `Last contact signal: ${label(f.lastContact)}`,
    `Block status impact: ${label(f.blockStatus)}`,
    `Breakup reason impact: ${label(f.breakupReason)}`,
    `Attachment and effort from their side affected the final comeback score.`
  ]);
}

function calcCrush(f){
  let s=38;
  s += {daily:16, weekly:9, rare:-4, none:-12}[f.talkFrequency]||0;
  s += {they:14, both:10, you:-4}[f.whoInitiates]||0;
  s += {fast:12, warm:9, dry:-8, late:-5}[f.replyQuality]||0;
  s += {often:11, sometimes:6, never:-7}[f.timeTogether]||0;
  s += n(f.flirting)*5+n(f.sharedInterests)*4+n(f.emotionalComfort)*4+n(f.respect)*3;
  s += {right:8, slow:2, bad:-10}[f.timing]||0;
  return pack('crush',clamp(s),[
    `Communication frequency: ${label(f.talkFrequency)}`,
    `Initiation pattern: ${label(f.whoInitiates)}`,
    `Reply quality: ${label(f.replyQuality)}`,
    `Flirting, comfort, shared interests and respect shaped the compatibility score.`
  ]);
}

function calcToxic(f){
  let s=18;
  s += n(f.jealousy)*7+n(f.ghosting)*6+n(f.manipulation)*8+n(f.anger)*6+n(f.revenge)*7+n(f.possessive)*6;
  s -= n(f.apologizes)*4+n(f.accountability)*5+n(f.communication)*4;
  return pack('toxic',clamp(s),[
    `Jealousy, ghosting, manipulation, anger and possessiveness increased the score.`,
    `Apology, accountability and communication reduced the score.`,
    `Higher score means stronger intense patterns, not a medical label.`,
    `Your answers suggest which habits people may notice first.`
  ]);
}

function calcRare(f){
  let s=35;
  s += n(f.independence)*5+n(f.riskTaking)*3+n(f.unusualInterests)*6+n(f.socialEnergy)*2+n(f.travel)*3+n(f.ambition)*4+n(f.discipline)*3+n(f.originality)*6+n(f.confidence)*3;
  return pack('rare',clamp(s),[
    `Originality and unusual interests strongly increased rarity.`,
    `Independence, ambition and confidence shaped the uniqueness score.`,
    `Social energy and travel added lifestyle rarity.`,
    `This score reflects your answer pattern, not population census data.`
  ]);
}

function calcFuture(f){
  let s=25;
  s += n(f.incomeHabit)*4+n(f.savings)*6+n(f.investing)*6+n(f.skillGrowth)*6+n(f.careerClarity)*5+n(f.spendingControl)*5+n(f.emergencyFund)*4+n(f.consistency)*5+n(f.discipline)*5;
  s -= n(f.debt)*5;
  return pack('future',clamp(s),[
    `Savings, investing and skill growth are the strongest positive factors.`,
    `Debt pressure and weak spending control reduce the score.`,
    `Career clarity and consistency improved future stability.`,
    `This is a habits-based potential score, not financial advice.`
  ]);
}

function pack(id,score,factors){
  return {score,label:getLabel(id,score),factors,paid:paidBullets(id,score)}
}

function getLabel(id,score){
  const tiers = score>=75?'high':score>=55?'mid':'low';
  const map={
    ex:{high:'High comeback signal',mid:'Mixed signal, not fully over',low:'Low comeback signal'},
    crush:{high:'Strong attraction pattern',mid:'Potential, but timing matters',low:'Interest looks uncertain'},
    toxic:{high:'Intense pattern detected',mid:'Manageable but noticeable',low:'Mostly stable energy'},
    rare:{high:'Rare personality mix',mid:'Distinct but relatable',low:'Common but charming'},
    future:{high:'Strong future potential',mid:'Can win with discipline',low:'Habits need correction'}
  };
  return map[id][tiers];
}

function paidBullets(id,score){
  const data={
    ex:['Whether to text or stay silent','Best message style for your situation','What is hurting comeback chances','7-day emotional strategy'],
    crush:['Confession timing','How to avoid looking desperate','Green flags and red flags','Best conversation opener'],
    toxic:['Your strongest pattern','How people may experience you','What to fix first','Personal roast-style insight'],
    rare:['Rarity breakdown','Dating rarity','Friend-circle role','Shareable card text'],
    future:['Money personality','Rich/broke risk factors','Career habit prediction','3 changes to improve future score']
  };
  return data[id];
}

function label(v){return v ? v.replaceAll('_',' ') : 'not selected'}

const OPTIONS = {
  scale:[1,2,3,4,5],
  vibe:[['emotional','❤️ Emotional'],['overthinking','🧠 Overthinking'],['chill','😎 Chill'],['main','✨ Main character'],['confused','😵 Confused']]
};

export default function Home(){
  const [selected,setSelected]=useState(TOOLS[0]);
  const [form,setForm]=useState(INIT);
  const [result,setResult]=useState(null);
  const [showPay,setShowPay]=useState(false);
  const [utr,setUtr]=useState('');
  const [paid,setPaid]=useState(false);
  const upiLink=useMemo(()=>`upi://pay?pa=${encodeURIComponent(UPI_ID)}&pn=${encodeURIComponent('VibeLeak AI')}&am=${selected.price}&cu=INR&tn=${encodeURIComponent(selected.title+' report')}`,[selected]);

  function update(k,v){setForm({...form,[k]:v})}
  function changeTool(t){setSelected(t);setResult(null);setShowPay(false);setPaid(false)}
  function generate(){ if(!form.name)return alert('Naam daalo pehle'); setResult(calculate(selected.id,form)); setShowPay(false); setPaid(false) }
  async function copyUPI(){await navigator.clipboard.writeText(UPI_ID); alert('UPI copied: '+UPI_ID)}
  function submitUTR(){ if(!utr.trim()) return alert('UTR / transaction ID daalo'); setPaid(true) }

  return <main className="wrap">
    <nav className="nav"><div className="brand">VibeLeak <span>AI</span></div><a className="btn btn2" href="#tools">Start Test</a></nav>

    <section className="hero">
      <div><span className="pill">Your answers reveal more than you think ✨</span><h1>Choose what you want to discover.</h1><p className="muted">Every test has its own questions, scoring logic and premium insight path.</p><div className="note">Scores are calculated from your answer patterns. This is an entertainment and self-reflection experience.</div></div>
      <div className="card"><h2>Separate tests. Separate logic.</h2><p className="muted">Ex comeback, crush compatibility, toxicity, rarity and future potential all use different inputs and factor weights.</p></div>
    </section>

    <section id="tools"><h2>What Do You Want to Discover?</h2><div className="tools">{TOOLS.map(t=><div key={t.id} className={'tool '+(selected.id===t.id?'active':'')} onClick={()=>changeTool(t)}><div style={{fontSize:34}}>{t.emoji}</div><h3>{t.title}</h3><p className="small">{t.hook}</p><div className="price">₹{t.price}</div></div>)}</div></section>

    <section className="hero" style={{minHeight:'auto'}}>
      <div className="card">
        <span className="pill">{selected.emoji} {selected.title}</span><h2>The More Honest You Are, The More Personal Your Result</h2>
        <BaseFields form={form} update={update}/>
        <ToolQuestions id={selected.id} form={form} update={update}/>
        <textarea placeholder="Add situation details..." value={form.details} onChange={e=>update('details',e.target.value)} />
        <div className="actions"><button className="btn" onClick={generate}>Reveal My Free Score</button></div>
      </div>

      <div className="result card">
        {!result?<p className="muted">Your personalized result is waiting.</p>:<>
          <div className="score">{result.score}%</div><h2>{result.label}</h2><p className="muted">Calculated from the relevant factors for this specific test.</p>
          <h3>What Shaped Your Result?</h3>{result.factors.map((x,i)=><div className="factor" key={i}>{x}</div>)}
          <div className="share">{selected.emoji} {form.name} got {result.score}% on {selected.title}. Think someone can beat this?</div>
          <h3>Your Score Is Only the Surface</h3><div className="blur"><ul className="list">{result.paid.map((x,i)=><li key={i}>{x}</li>)}</ul></div>
          <div className="paybox"><h3>Reveal What Your Score Isn’t Telling You — ₹{selected.price}</h3><p className="small">Mobile par UPI app open ho sakta hai. Desktop par UPI ID copy karo.</p><div className="upi">UPI: {UPI_ID}</div><div className="actions"><a className="btn" href={upiLink}>Unlock with UPI</a><button className="btn btn2" onClick={copyUPI}>Copy Payment ID</button><button className="btn btn2" onClick={()=>setShowPay(!showPay)}>Verify My Payment</button></div><div className="qr-placeholder">QR placeholder<br/>Copy UPI active</div>{showPay&&<div className="pay-form"><input placeholder="Enter UTR / Transaction ID" value={utr} onChange={e=>setUtr(e.target.value)} /><button className="btn btn2" onClick={submitUTR}>Submit & Reveal My Analysis</button></div>}{paid&&<div className="note">Payment reference received. Full analysis can be delivered after verification.</div>}</div>
        </>}
      </div>
    </section>

    <footer className="footer">VibeLeak provides entertainment and self-reflection experiences based on user-provided answers. <a href="/terms">Terms</a></footer>
  </main>
}

function BaseFields({form,update}){
  return <><div className="formgrid"><input placeholder="Your name / nickname" value={form.name} onChange={e=>update('name',e.target.value)}/><input placeholder="Age" value={form.age} onChange={e=>update('age',e.target.value)}/><input placeholder="City" value={form.city} onChange={e=>update('city',e.target.value)}/><input placeholder="Other person name, optional" value={form.other} onChange={e=>update('other',e.target.value)}/></div><p className="small">Choose your vibe</p><div className="vibe-grid">{OPTIONS.vibe.map(([v,l])=><button type="button" key={v} className={'vibe-btn '+(form.vibe===v?'active':'')} onClick={()=>update('vibe',v)}>{l}</button>)}</div></>
}

function Select({label,value,onChange,children}){return <select value={value} onChange={e=>onChange(e.target.value)}><option value="">{label}</option>{children}</select>}
function Scale({label,value,onChange}){return <Select label={label} value={value} onChange={onChange}>{OPTIONS.scale.map(x=><option key={x} value={x}>{x}/5</option>)}</Select>}

function ToolQuestions({id,form,update}){
  if(id==='ex') return <div className="formgrid"><Select label="Relationship length" value={form.relationshipLength} onChange={v=>update('relationshipLength',v)}><option value="under3">Under 3 months</option><option value="three12">3–12 months</option><option value="over1">1+ year</option><option value="over3">3+ years</option></Select><Select label="Who ended it?" value={form.breakupInitiator} onChange={v=>update('breakupInitiator',v)}><option value="you">I ended it</option><option value="them">They ended it</option><option value="mutual">Mutual</option></Select><Select label="Breakup reason" value={form.breakupReason} onChange={v=>update('breakupReason',v)}><option value="misunderstanding">Misunderstanding</option><option value="distance">Distance/timing</option><option value="family">Family pressure</option><option value="fighting">Too much fighting</option><option value="trust">Trust issue</option><option value="cheating">Cheating</option></Select><Select label="Last contact" value={form.lastContact} onChange={v=>update('lastContact',v)}><option value="today">Recently</option><option value="week">This week</option><option value="month">This month</option><option value="long">Long time ago</option></Select><Select label="Block status" value={form.blockStatus} onChange={v=>update('blockStatus',v)}><option value="none">No block</option><option value="muted">Ignored/muted</option><option value="blocked">Blocked</option></Select><Select label="Post-breakup contact" value={form.postBreakupContact} onChange={v=>update('postBreakupContact',v)}><option value="often">Often</option><option value="sometimes">Sometimes</option><option value="never">Never</option></Select><Select label="New partner?" value={form.newPartner} onChange={v=>update('newPartner',v)}><option value="no">No</option><option value="maybe">Maybe</option><option value="yes">Yes</option></Select><Scale label="Your attachment" value={form.attachment} onChange={v=>update('attachment',v)}/><Scale label="Effort from them" value={form.effortFromThem} onChange={v=>update('effortFromThem',v)}/></div>;
  if(id==='crush') return <div className="formgrid"><Select label="Talk frequency" value={form.talkFrequency} onChange={v=>update('talkFrequency',v)}><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="rare">Rarely</option><option value="none">Almost never</option></Select><Select label="Who initiates?" value={form.whoInitiates} onChange={v=>update('whoInitiates',v)}><option value="they">They do</option><option value="both">Both</option><option value="you">Mostly me</option></Select><Select label="Reply quality" value={form.replyQuality} onChange={v=>update('replyQuality',v)}><option value="fast">Fast and excited</option><option value="warm">Warm</option><option value="late">Late but okay</option><option value="dry">Dry</option></Select><Select label="Time spent together" value={form.timeTogether} onChange={v=>update('timeTogether',v)}><option value="often">Often</option><option value="sometimes">Sometimes</option><option value="never">Never</option></Select><Scale label="Flirting signal" value={form.flirting} onChange={v=>update('flirting',v)}/><Scale label="Shared interests" value={form.sharedInterests} onChange={v=>update('sharedInterests',v)}/><Scale label="Emotional comfort" value={form.emotionalComfort} onChange={v=>update('emotionalComfort',v)}/><Scale label="Respect" value={form.respect} onChange={v=>update('respect',v)}/><Select label="Timing" value={form.timing} onChange={v=>update('timing',v)}><option value="right">Feels right</option><option value="slow">Need slow approach</option><option value="bad">Bad timing</option></Select></div>;
  if(id==='toxic') return <div className="formgrid"><Scale label="Jealousy" value={form.jealousy} onChange={v=>update('jealousy',v)}/><Scale label="Ghosting" value={form.ghosting} onChange={v=>update('ghosting',v)}/><Scale label="Manipulation" value={form.manipulation} onChange={v=>update('manipulation',v)}/><Scale label="Anger" value={form.anger} onChange={v=>update('anger',v)}/><Scale label="Revenge tendency" value={form.revenge} onChange={v=>update('revenge',v)}/><Scale label="Possessiveness" value={form.possessive} onChange={v=>update('possessive',v)}/><Scale label="Apologizing" value={form.apologizes} onChange={v=>update('apologizes',v)}/><Scale label="Accountability" value={form.accountability} onChange={v=>update('accountability',v)}/><Scale label="Communication" value={form.communication} onChange={v=>update('communication',v)}/></div>;
  if(id==='rare') return <div className="formgrid"><Scale label="Independence" value={form.independence} onChange={v=>update('independence',v)}/><Scale label="Risk-taking" value={form.riskTaking} onChange={v=>update('riskTaking',v)}/><Scale label="Unusual interests" value={form.unusualInterests} onChange={v=>update('unusualInterests',v)}/><Scale label="Social energy" value={form.socialEnergy} onChange={v=>update('socialEnergy',v)}/><Scale label="Travel/exposure" value={form.travel} onChange={v=>update('travel',v)}/><Scale label="Ambition" value={form.ambition} onChange={v=>update('ambition',v)}/><Scale label="Discipline" value={form.discipline} onChange={v=>update('discipline',v)}/><Scale label="Originality" value={form.originality} onChange={v=>update('originality',v)}/><Scale label="Confidence" value={form.confidence} onChange={v=>update('confidence',v)}/></div>;
  return <div className="formgrid"><Scale label="Income habit" value={form.incomeHabit} onChange={v=>update('incomeHabit',v)}/><Scale label="Savings habit" value={form.savings} onChange={v=>update('savings',v)}/><Scale label="Debt pressure" value={form.debt} onChange={v=>update('debt',v)}/><Scale label="Investing habit" value={form.investing} onChange={v=>update('investing',v)}/><Scale label="Skill growth" value={form.skillGrowth} onChange={v=>update('skillGrowth',v)}/><Scale label="Career clarity" value={form.careerClarity} onChange={v=>update('careerClarity',v)}/><Scale label="Spending control" value={form.spendingControl} onChange={v=>update('spendingControl',v)}/><Scale label="Emergency fund" value={form.emergencyFund} onChange={v=>update('emergencyFund',v)}/><Scale label="Consistency" value={form.consistency} onChange={v=>update('consistency',v)}/><Scale label="Discipline" value={form.discipline} onChange={v=>update('discipline',v)}/></div>;
}
