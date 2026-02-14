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
  extractedSkills: {
    coreCS: string[];
    languages: string[];
    web: string[];
    data: string[];
    cloud: string[];
    testing: string[];
    other: string[];
  };
  plan7Days: DayPlan[];
  checklist: ChecklistRound[];
  questions: string[];

  // Score Tracking
  baseScore: number;
  finalScore: number; // The live score shown to user
  skillConfidenceMap: Record<string, "know" | "practice">;

  updatedAt: string;

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
