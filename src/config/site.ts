export const siteConfig = {
  name: "Solution0ne",
  tagline: "AI-Powered Solutions for Tomorrow's Challenges",
  description:
    "We build, integrate, and deploy cutting-edge AI systems " +
    "that transform how businesses operate.",
  contactEmail: "hello@solution0ne.com",
} as const;

export interface Service {
  title: string;
  description: string;
  icon: string;
}

export const services: Service[] = [
  {
    title: "AI Strategy",
    description:
      "We map your business processes to identify where AI " +
      "delivers the highest ROI, then build a phased roadmap " +
      "to get you there.",
    icon: "strategy",
  },
  {
    title: "Custom AI Development",
    description:
      "Purpose-built models and pipelines tailored to your " +
      "data and domain — from fine-tuning LLMs to training " +
      "computer vision systems.",
    icon: "development",
  },
  {
    title: "AI Integration",
    description:
      "Seamless integration of AI capabilities into your " +
      "existing tech stack — APIs, workflows, and data " +
      "pipelines that just work.",
    icon: "integration",
  },
  {
    title: "AI Training & Enablement",
    description:
      "Hands-on workshops and ongoing support to upskill " +
      "your team, so AI becomes a core competency — not a " +
      "black box.",
    icon: "training",
  },
];

export interface Stat {
  label: string;
  value: number;
  suffix: string;
}

export const stats: Stat[] = [
  { label: "Projects Delivered", value: 50, suffix: "+" },
  { label: "Client Satisfaction", value: 98, suffix: "%" },
  { label: "Models Deployed", value: 120, suffix: "+" },
  { label: "Team Members", value: 15, suffix: "+" },
];
