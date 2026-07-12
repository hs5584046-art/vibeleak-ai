export const siteConfig = {
  name: "VibeLytix",
  tagline: "Understand yourself. Improve your relationships. Make better decisions.",
  description:
    "VibeLytix is a premium self-discovery platform for personality, relationships, career and personal growth.",
  navigation: [
    { label: "Discover", href: "/#discover" },
    { label: "How it works", href: "/#how-it-works" },
    { label: "Science & safety", href: "/#trust" },
    { label: "FAQ", href: "/#faq" }
  ],
  footer: {
    product: [
      { label: "Personality DNA", href: "/assessments/personality-dna" },
      { label: "Relationship Intelligence", href: "/assessments/relationship-intelligence" },
      { label: "Career Alignment", href: "/assessments/career-alignment" },
      { label: "Growth Systems", href: "/assessments/growth-systems" }
    ],
    company: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" }
    ],
    legal: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Refunds", href: "/refunds" }
    ]
  }
} as const;

export const assessmentCategories = [
  {
    id: "personality-dna",
    eyebrow: "Flagship assessment",
    title: "Personality DNA",
    description:
      "Map your core traits, emotional needs, decision style and social energy into a practical personal profile.",
    meta: "About 8 minutes",
    price: "Free preview · ₹149 full",
    status: "Available now",
    featured: true,
    accent: "violet"
  },
  {
    id: "relationship-intelligence",
    eyebrow: "Relationships",
    title: "Relationship Intelligence",
    description:
      "Understand attachment, communication, conflict patterns and the kind of connection in which you thrive.",
    meta: "About 6 minutes",
    price: "Free full result",
    status: "Available now",
    featured: false,
    accent: "rose"
  },
  {
    id: "career-alignment",
    eyebrow: "Career",
    title: "Career Alignment",
    description:
      "Connect your strengths, working rhythm and motivation style to environments where you can perform sustainably.",
    meta: "About 6 minutes",
    price: "Free full result",
    status: "Available now",
    featured: false,
    accent: "cyan"
  },
  {
    id: "growth-systems",
    eyebrow: "Self growth",
    title: "Growth Systems",
    description:
      "Turn insight into habits, boundaries and realistic actions that fit the way you actually operate.",
    meta: "About 6 minutes",
    price: "Free full result",
    status: "Available now",
    featured: false,
    accent: "amber"
  }
] as const;

export const faqItems = [
  {
    question: "Is VibeLytix a clinical or diagnostic tool?",
    answer:
      "No. VibeLytix is designed for education, entertainment and structured self-reflection. It does not diagnose mental-health conditions and does not replace qualified professional advice."
  },
  {
    question: "How are reports generated?",
    answer:
      "Your selected answers are scored through a transparent weighted assessment model, then converted into readable themes, strengths, cautions and suggested next actions."
  },
  {
    question: "Will my answers remain private?",
    answer:
      "Unfinished answers stay in your browser. Completed reports are generated server-side, and cloud saving is optional after sign-in. Payment and report tables are protected through server-only access and database policies."
  },
  {
    question: "Can a result predict my future or another person’s behaviour?",
    answer:
      "No result can guarantee a future outcome or accurately read another person’s mind. Reports should be treated as reflection prompts based on the information you provide."
  },
  {
    question: "Is Personality DNA free?",
    answer:
      "The assessment and personal preview are free. The complete Personality DNA report is a one-time ₹149 unlock, with no subscription. Any valid coupon is shown before payment."
  }
] as const;
