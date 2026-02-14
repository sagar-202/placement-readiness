export interface SkillCategory {
  name: string;
  skills: string[];
}

export interface ChecklistRound {
  title: string;
  items: string[];
}

export interface DayPlan {
  day: string;
  focus: string;
  tasks: string[];
}

export interface AnalysisEntry {
  id: string;
  createdAt: string;
  company: string;
  role: string;
  jdText: string;
  extractedSkills: SkillCategory[];
  plan: DayPlan[];
  checklist: ChecklistRound[];
  questions: string[];
  readinessScore: number;
  skillConfidenceMap?: Record<string, "know" | "practice">;
  companyIntel?: {
    industry: string;
    size: "Startup" | "Mid-size" | "Enterprise";
    hiringFocus: string;
  };
  roundMapping?: {
    roundNumber: number;
    name: string;
    desc: string;
  }[];
}
