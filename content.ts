export const learningArticles = [
  {
    slug: "how-personality-tests-work",
    title: "How personality tests work—and what they cannot tell you",
    description: "A practical guide to useful interpretation, scoring limits and avoiding overconfidence.",
    category: "Personality",
    sections: [
      ["A score is a model, not an identity", "A personality assessment compresses answers into patterns. It can create useful language, but it cannot capture every context, relationship or life stage."],
      ["Look for repeatable behaviour", "The most useful interpretation connects a score to specific choices, habits and reactions. Vague praise feels good but rarely changes a decision."],
      ["Retesting should compare context", "A different result may reflect stress, confidence, environment or a genuine behavioural change. Compare what changed before deciding that one score was wrong."]
    ]
  },
  {
    slug: "healthy-relationship-communication",
    title: "Healthy relationship communication: needs, boundaries and repair",
    description: "Learn how direct language, boundaries and post-conflict repair support stronger relationships.",
    category: "Relationships",
    sections: [
      ["Clarity is kinder than guessing", "Healthy communication makes needs understandable without requiring another person to decode hints, tests or withdrawal."],
      ["Boundaries protect connection", "A boundary is not a threat. It explains what you will do to protect wellbeing, time or dignity when a limit is crossed."],
      ["Repair matters more than perfection", "Strong relationships still contain conflict. The difference is whether both people can acknowledge impact, change behaviour and rebuild safety."]
    ]
  },
  {
    slug: "choose-a-career-that-fits",
    title: "How to choose a career that fits your working style",
    description: "Use autonomy, mastery, impact and structure to evaluate career environments realistically.",
    category: "Career",
    sections: [
      ["Job titles hide environment", "Two people with the same title can have completely different levels of autonomy, pace, management and customer contact."],
      ["Motivation needs a system", "Interest may start effort, but sustainable performance depends on feedback, role clarity, energy and a realistic learning path."],
      ["Test assumptions cheaply", "Before making a major change, use small projects, interviews, shadowing or freelance work to collect evidence about fit."]
    ]
  },
  {
    slug: "build-habits-that-survive-bad-days",
    title: "How to build habits that survive bad days",
    description: "Design consistency around minimum actions, recovery and environment rather than perfect motivation.",
    category: "Growth",
    sections: [
      ["Make the minimum action obvious", "A useful habit needs a version small enough to complete when time and energy are limited."],
      ["Recovery is part of consistency", "Consistency is not an unbroken streak. It is the ability to return before one miss becomes a new pattern."],
      ["Change the environment", "Reduce friction for desired behaviour and increase friction for automatic distractions. Willpower should not carry the entire system."]
    ]
  }
] as const;

export function getLearningArticle(slug: string) {
  return learningArticles.find((article) => article.slug === slug);
}
