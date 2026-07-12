"use client";

import { useMemo, useState } from "react";
import {
  buildExpansionReport,
  type ExpansionAnswer,
  type ExpansionAnswers,
  type ExpansionAssessment,
  type ExpansionReport
} from "@/lib/assessment/expansion";
import { AffiliateRecommendations } from "@/components/site/affiliate-recommendations";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, ClockIcon, SparklesIcon } from "@/components/ui/icons";

function track(eventName: "assessment_started" | "assessment_completed", assessmentId: string) {
  void fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    keepalive: true,
    body: JSON.stringify({
      eventName,
      path: window.location.pathname,
      metadata: { assessmentId }
    })
  });
}

export function ExpansionExperience({ assessment }: { assessment: ExpansionAssessment }) {
  const storageKey = `vibelytix-${assessment.id}-v1`;
  const initial = useMemo(() => {
    if (typeof window === "undefined") return null;
    try {
      return JSON.parse(window.localStorage.getItem(storageKey) ?? "null") as ExpansionReport | null;
    } catch {
      return null;
    }
  }, [storageKey]);

  const [stage, setStage] = useState<"intro" | "questions" | "report">(initial ? "report" : "intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<ExpansionAnswers>({});
  const [report, setReport] = useState<ExpansionReport | null>(initial);
  const question = assessment.questions[index];
  const answered = Object.keys(answers).length;
  const progress = Math.round((answered / assessment.questions.length) * 100);

  function answer(value: ExpansionAnswer) {
    const next = { ...answers, [question.id]: value };
    setAnswers(next);
    if (index < assessment.questions.length - 1) {
      window.setTimeout(() => setIndex((current) => current + 1), 100);
      return;
    }
    const generated = buildExpansionReport(assessment, next);
    track("assessment_completed", assessment.id);
    window.localStorage.setItem(storageKey, JSON.stringify(generated));
    setReport(generated);
    setStage("report");
  }

  function reset() {
    window.localStorage.removeItem(storageKey);
    setAnswers({});
    setIndex(0);
    setReport(null);
    setStage("intro");
  }

  if (stage === "intro") {
    return (
      <section className="expansion-intro">
        <div>
          <p className="eyebrow"><SparklesIcon /> {assessment.eyebrow}</p>
          <h1>{assessment.title}</h1>
          <p>{assessment.description}</p>
          <div className="assessment-facts">
            <span><ClockIcon /> About {assessment.estimatedMinutes} minutes</span>
            <span><CheckIcon /> {assessment.questions.length} questions</span>
            <span><CheckIcon /> {assessment.priceLabel}</span>
          </div>
          <button type="button" className="button button-primary" onClick={() => { track("assessment_started", assessment.id); setStage("questions"); }}>
            Start assessment <ArrowRightIcon />
          </button>
        </div>
        <div className="expansion-dimension-list">
          {assessment.dimensions.map((dimension) => (
            <article key={dimension.id}>
              <strong>{dimension.label}</strong>
              <span>{dimension.description}</span>
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (stage === "questions") {
    return (
      <section className="question-card">
        <div className="question-topbar">
          <button
            type="button"
            className="assessment-back"
            onClick={() => index === 0 ? setStage("intro") : setIndex((value) => value - 1)}
          >
            <ArrowLeftIcon /> Back
          </button>
          <span>{index + 1} of {assessment.questions.length}</span>
        </div>
        <div className="assessment-progress" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <span style={{ width: `${progress}%` }} />
        </div>
        <div className="question-number">Question {index + 1}</div>
        <h1>{question.prompt}</h1>
        <div className="answer-grid">
          {[
            ["Strongly disagree", 1],
            ["Disagree", 2],
            ["Neutral", 3],
            ["Agree", 4],
            ["Strongly agree", 5]
          ].map(([label, value]) => (
            <button
              type="button"
              className="answer-option"
              key={value}
              onClick={() => answer(value as ExpansionAnswer)}
            >
              <span>{label}</span><b>{value}</b>
            </button>
          ))}
        </div>
      </section>
    );
  }

  return report ? (
    <article className="full-report-card expansion-report">
      <header className="full-report-hero">
        <p className="eyebrow"><SparklesIcon /> Your {assessment.title} result</p>
        <h1>{report.title}</h1>
        <p className="result-subtitle">{report.subtitle}</p>
        <p>{report.summary}</p>
      </header>

      <section className="report-block">
        <div className="report-block-heading"><span>01</span><div><p className="eyebrow">Score map</p><h2>Your four dimensions</h2></div></div>
        <div className="dimension-report-grid">
          {report.dimensions.map((dimension) => (
            <div key={dimension.id}>
              <div><span>{dimension.label}</span><b>{dimension.score}%</b></div>
              <i><b style={{ width: `${dimension.score}%` }} /></i>
              <small>{dimension.description}</small>
            </div>
          ))}
        </div>
      </section>

      <section className="report-block">
        <div className="report-two-column">
          <div><h3>Strengths</h3><ul>{report.strengths.map((item) => <li key={item}><CheckIcon /> {item}</li>)}</ul></div>
          <div><h3>Watchouts</h3><ul>{report.watchouts.map((item) => <li key={item}><span>!</span>{item}</li>)}</ul></div>
        </div>
      </section>

      <section className="report-block">
        <div className="report-block-heading"><span>02</span><div><p className="eyebrow">Action plan</p><h2>Three practical next steps</h2></div></div>
        <div className="report-actions-list">
          {report.actionPlan.map((item, position) => <div key={item}><span>{position + 1}</span><p>{item}</p></div>)}
        </div>
      </section>

      <AffiliateRecommendations category={report.affiliateCategory} />

      <div className="full-report-footer">
        <p>Recommendations may include affiliate links. A purchase may earn VibeLytix a commission at no additional cost to you.</p>
        <button type="button" className="button button-secondary" onClick={reset}>Retake assessment</button>
      </div>
    </article>
  ) : null;
}
