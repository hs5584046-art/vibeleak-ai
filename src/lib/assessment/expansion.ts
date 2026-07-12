export type ExpansionAnswer = 1 | 2 | 3 | 4 | 5;
export type ExpansionAnswers = Record<string, ExpansionAnswer>;

export type ExpansionAssessment = {
  id: "relationship-intelligence" | "career-alignment" | "growth-systems";
  title: string;
  eyebrow: string;
  description: string;
  estimatedMinutes: number;
  priceLabel: string;
  dimensions: { id: string; label: string; description: string }[];
  questions: {
    id: string;
    prompt: string;
    dimension: string;
    reverse?: boolean;
  }[];
  profiles: {
    dimension: string;
    title: string;
    subtitle: string;
    summary: string;
  }[];
  affiliateCategory: "relationships" | "career" | "growth";
};

export type ExpansionReport = {
  assessmentId: ExpansionAssessment["id"];
  completedAt: string;
  title: string;
  subtitle: string;
  summary: string;
  dimensions: { id: string; label: string; score: number; description: string }[];
  strengths: string[];
  watchouts: string[];
  actionPlan: string[];
  affiliateCategory: ExpansionAssessment["affiliateCategory"];
};

const questions = (
  rows: [string, string, string, boolean?][]
): ExpansionAssessment["questions"] =>
  rows.map(([id, prompt, dimension, reverse]) => ({ id, prompt, dimension, reverse }));

export const expansionAssessments: ExpansionAssessment[] = [
  {
    id: "relationship-intelligence",
    title: "Relationship Intelligence",
    eyebrow: "Relationships",
    description:
      "Understand your communication, boundaries, emotional availability and conflict-repair habits.",
    estimatedMinutes: 6,
    priceLabel: "Free full result",
    affiliateCategory: "relationships",
    dimensions: [
      { id: "communication", label: "Clear communication", description: "How directly and calmly you express needs." },
      { id: "boundaries", label: "Healthy boundaries", description: "How well you protect limits without shutting people out." },
      { id: "security", label: "Emotional security", description: "How steadily you respond to closeness, uncertainty and distance." },
      { id: "repair", label: "Conflict repair", description: "How effectively you recover after tension or disagreement." }
    ],
    questions: questions([
      ["r1", "I can explain what I need without expecting the other person to guess.", "communication"],
      ["r2", "I can say no without feeling that I must justify myself for a long time.", "boundaries"],
      ["r3", "A delayed reply rarely makes me assume the relationship is in danger.", "security"],
      ["r4", "After conflict, I can return to the issue without trying to win.", "repair"],
      ["r5", "I ask clarifying questions before reacting to an ambiguous message.", "communication"],
      ["r6", "I stay in uncomfortable situations because I fear disappointing people.", "boundaries", true],
      ["r7", "I can enjoy closeness without losing my own routines and priorities.", "security"],
      ["r8", "I can apologise specifically instead of giving a vague apology.", "repair"],
      ["r9", "I can discuss difficult topics without using silence as punishment.", "communication"],
      ["r10", "I recognise when empathy has turned into over-responsibility.", "boundaries"],
      ["r11", "I can ask for reassurance directly instead of testing someone.", "security"],
      ["r12", "I focus on changing the pattern, not only ending the argument.", "repair"]
    ]),
    profiles: [
      {
        dimension: "communication",
        title: "The Clear Connector",
        subtitle: "Direct, thoughtful and emotionally specific",
        summary: "Your strongest relationship advantage is your ability to make inner experience understandable without creating unnecessary drama."
      },
      {
        dimension: "boundaries",
        title: "The Grounded Partner",
        subtitle: "Care without self-abandonment",
        summary: "You are at your best when connection includes respect, personal space and clear limits."
      },
      {
        dimension: "security",
        title: "The Steady Heart",
        subtitle: "Closeness without constant alarm",
        summary: "You tend to create trust through consistency and a balanced response to emotional uncertainty."
      },
      {
        dimension: "repair",
        title: "The Relationship Repairer",
        subtitle: "Conflict becomes information",
        summary: "You are most effective when tension is treated as a problem to understand and repair rather than a contest to win."
      }
    ]
  },
  {
    id: "career-alignment",
    title: "Career Alignment",
    eyebrow: "Career",
    description:
      "Identify the work environment, motivation pattern and decision style most likely to support sustainable performance.",
    estimatedMinutes: 6,
    priceLabel: "Free full result",
    affiliateCategory: "career",
    dimensions: [
      { id: "autonomy", label: "Autonomy", description: "How much ownership and freedom you need." },
      { id: "mastery", label: "Mastery drive", description: "How strongly learning and competence motivate you." },
      { id: "impact", label: "Meaningful impact", description: "How important visible usefulness is to your motivation." },
      { id: "structure", label: "Structure fit", description: "How much predictability and process support your best work." }
    ],
    questions: questions([
      ["c1", "I perform best when I can choose how to reach the outcome.", "autonomy"],
      ["c2", "Learning a difficult skill is rewarding even before it produces money.", "mastery"],
      ["c3", "I lose motivation when I cannot see who benefits from my work.", "impact"],
      ["c4", "Clear routines help me protect energy and focus.", "structure"],
      ["c5", "Micromanagement reduces the quality of my work.", "autonomy"],
      ["c6", "I regularly seek feedback that helps me improve a specific skill.", "mastery"],
      ["c7", "I want my work to solve a problem that feels real.", "impact"],
      ["c8", "Too many fixed procedures make me feel trapped.", "structure", true],
      ["c9", "I am comfortable being accountable for an outcome I control.", "autonomy"],
      ["c10", "I enjoy becoming known for a clear area of expertise.", "mastery"],
      ["c11", "Recognition matters less to me than knowing the work was useful.", "impact"],
      ["c12", "I can stay consistent when expectations and priorities are explicit.", "structure"]
    ]),
    profiles: [
      {
        dimension: "autonomy",
        title: "The Independent Operator",
        subtitle: "Ownership creates energy",
        summary: "You are likely to perform best when outcomes are clear but your route to achieving them remains flexible."
      },
      {
        dimension: "mastery",
        title: "The Craft Builder",
        subtitle: "Depth before applause",
        summary: "You are motivated by competence, improvement and the satisfaction of becoming genuinely good at something."
      },
      {
        dimension: "impact",
        title: "The Purpose Driver",
        subtitle: "Useful work sustains effort",
        summary: "You are most engaged when your work has a visible effect on people, customers or a problem you care about."
      },
      {
        dimension: "structure",
        title: "The Reliable Systems Thinker",
        subtitle: "Clarity protects performance",
        summary: "You tend to do strong work when priorities, expectations and repeatable processes reduce unnecessary noise."
      }
    ]
  },
  {
    id: "growth-systems",
    title: "Growth Systems",
    eyebrow: "Self growth",
    description:
      "Measure consistency, self-awareness, recovery and environment design—the systems behind lasting change.",
    estimatedMinutes: 6,
    priceLabel: "Free full result",
    affiliateCategory: "growth",
    dimensions: [
      { id: "consistency", label: "Consistency", description: "How reliably you repeat useful actions." },
      { id: "awareness", label: "Self-awareness", description: "How accurately you notice patterns and triggers." },
      { id: "recovery", label: "Recovery skill", description: "How effectively you restart after setbacks." },
      { id: "environment", label: "Environment design", description: "How well your surroundings support desired behaviour." }
    ],
    questions: questions([
      ["g1", "I make important habits small enough to repeat on difficult days.", "consistency"],
      ["g2", "I can identify the situation that usually triggers an unhelpful pattern.", "awareness"],
      ["g3", "A missed day does not normally become a missed week.", "recovery"],
      ["g4", "I remove friction from behaviours I want to repeat.", "environment"],
      ["g5", "I track progress through behaviour rather than mood.", "consistency"],
      ["g6", "I know which emotions most often change my decisions.", "awareness"],
      ["g7", "After a setback, I focus on the next useful action.", "recovery"],
      ["g8", "My phone and workspace are arranged to protect focus.", "environment"],
      ["g9", "I rely on motivation more than a repeatable routine.", "consistency", true],
      ["g10", "I review what worked instead of only judging the outcome.", "awareness"],
      ["g11", "I can restart without using shame as fuel.", "recovery"],
      ["g12", "People around me generally support the habits I am building.", "environment"]
    ]),
    profiles: [
      {
        dimension: "consistency",
        title: "The Steady Builder",
        subtitle: "Progress through repetition",
        summary: "Your strongest growth advantage is the ability to turn intention into repeatable action."
      },
      {
        dimension: "awareness",
        title: "The Pattern Observer",
        subtitle: "Insight before intervention",
        summary: "You improve by noticing the conditions behind behaviour rather than relying on vague self-judgement."
      },
      {
        dimension: "recovery",
        title: "The Resilient Restarter",
        subtitle: "Setbacks do not become identity",
        summary: "Your strength is returning to useful action without demanding a perfect record."
      },
      {
        dimension: "environment",
        title: "The Environment Architect",
        subtitle: "Design beats willpower",
        summary: "You grow fastest when your surroundings make desired actions easier and distractions less automatic."
      }
    ]
  }
];

export function getExpansionAssessment(id: string) {
  return expansionAssessments.find((assessment) => assessment.id === id);
}

export function buildExpansionReport(
  assessment: ExpansionAssessment,
  answers: ExpansionAnswers,
  completedAt = new Date().toISOString()
): ExpansionReport {
  const expected = assessment.questions.map((question) => question.id);
  if (
    Object.keys(answers).length !== expected.length ||
    expected.some((id) => ![1, 2, 3, 4, 5].includes(answers[id]))
  ) {
    throw new Error("A complete valid answer set is required.");
  }

  const totals = Object.fromEntries(
    assessment.dimensions.map((dimension) => [dimension.id, { earned: 0, count: 0 }])
  ) as Record<string, { earned: number; count: number }>;

  for (const question of assessment.questions) {
    const raw = answers[question.id];
    const value = question.reverse ? 6 - raw : raw;
    totals[question.dimension].earned += value - 1;
    totals[question.dimension].count += 1;
  }

  const dimensions = assessment.dimensions.map((dimension) => {
    const total = totals[dimension.id];
    return {
      ...dimension,
      score: Math.round((total.earned / (total.count * 4)) * 100)
    };
  });

  const ordered = [...dimensions].sort((a, b) => b.score - a.score);
  const strongest = ordered[0];
  const weakest = ordered[ordered.length - 1];
  const profile = assessment.profiles.find((item) => item.dimension === strongest.id)!;

  return {
    assessmentId: assessment.id,
    completedAt,
    title: profile.title,
    subtitle: profile.subtitle,
    summary: profile.summary,
    dimensions,
    strengths: [
      `${strongest.label} is currently your clearest advantage.`,
      `Your ${ordered[1].label.toLowerCase()} score gives your strongest trait useful balance.`,
      `You are more likely to improve when you work with your natural pattern instead of copying someone else’s system.`
    ],
    watchouts: [
      `${weakest.label} may become the limiting factor when pressure is high.`,
      "A score describes your current answers, not a permanent identity or guaranteed outcome."
    ],
    actionPlan: [
      `Use one existing ${strongest.label.toLowerCase()} strength in a real decision this week.`,
      `Choose one small behaviour that strengthens ${weakest.label.toLowerCase()}.`,
      "Repeat the assessment after four to six weeks and compare behaviour, not only scores."
    ],
    affiliateCategory: assessment.affiliateCategory
  };
}
