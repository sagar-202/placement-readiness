import type { SkillCategory, ChecklistRound, DayPlan, AnalysisEntry } from "./analysis-types";

const SKILL_DB: Record<string, string[]> = {
  "Core CS": ["DSA", "OOP", "DBMS", "OS", "Networks"],
  "Languages": ["Java", "Python", "JavaScript", "TypeScript", "C\\+\\+", "C#", "\\bGo\\b", "\\bC\\b"],
  "Web": ["React", "Next\\.js", "Node\\.js", "Express", "REST", "GraphQL"],
  "Data": ["SQL", "MongoDB", "PostgreSQL", "MySQL", "Redis"],
  "Cloud/DevOps": ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "CI/CD", "Linux"],
  "Testing": ["Selenium", "Cypress", "Playwright", "JUnit", "PyTest"],
};

// Display-friendly names for skills with regex chars
const DISPLAY_NAMES: Record<string, string> = {
  "C\\+\\+": "C++",
  "\\bGo\\b": "Go",
  "\\bC\\b": "C",
  "Next\\.js": "Next.js",
  "Node\\.js": "Node.js",
  "CI/CD": "CI/CD",
};

export function extractSkills(jdText: string): {
  coreCS: string[];
  languages: string[];
  web: string[];
  data: string[];
  cloud: string[];
  testing: string[];
  other: string[];
} {
  const results = {
    coreCS: [] as string[],
    languages: [] as string[],
    web: [] as string[],
    data: [] as string[],
    cloud: [] as string[],
    testing: [] as string[],
    other: [] as string[]
  };

  const categoryMap: Record<string, keyof typeof results> = {
    "Core CS": "coreCS",
    "Languages": "languages",
    "Web": "web",
    "Data": "data",
    "Cloud/DevOps": "cloud",
    "Testing": "testing"
  };

  for (const [category, keywords] of Object.entries(SKILL_DB)) {
    const found: string[] = [];
    for (const kw of keywords) {
      const regex = new RegExp(kw, "i");
      if (regex.test(jdText)) {
        found.push(DISPLAY_NAMES[kw] || kw);
      }
    }

    const key = categoryMap[category];
    if (key && found.length > 0) {
      results[key] = found;
    }
  }

  // Check if completely empty
  const hasSkills = Object.values(results).some(arr => arr.length > 0);
  if (!hasSkills) {
    results.other = ["Communication", "Problem solving", "Basic coding", "Projects"];
  }

  return results;
}

export function calculateReadinessScore(
  company: string,
  role: string,
  jdText: string,
  skills: { [key: string]: string[] }
): number {
  let score = 35; // Base

  // Count total skills
  const totalSkills = Object.values(skills).reduce((acc, curr) => acc + curr.length, 0);
  score += Math.min(totalSkills * 3, 30); // Cap skill contribution

  if (company.trim().length > 0) score += 10;
  if (role.trim().length > 0) score += 10;
  if (jdText.length > 200) score += 15; // Increased weight for detailed JD

  return Math.min(score, 100);
}

function hasCategory(skills: { [key: string]: string[] }, catName: string): boolean {
  // Map old category names to new keys
  const map: Record<string, string> = {
    "Core CS": "coreCS",
    "Languages": "languages",
    "Web": "web",
    "Data": "data",
    "Cloud/DevOps": "cloud",
    "Testing": "testing"
  };
  const key = map[catName];
  return key ? skills[key]?.length > 0 : false;
}

function hasSkill(skills: { [key: string]: string[] }, skill: string): boolean {
  return Object.values(skills).some(arr =>
    arr.some(s => s.toLowerCase() === skill.toLowerCase())
  );
}

// ... generateChecklist and generatePlan need update to accept object ...

export function generateChecklist(skills: { [key: string]: string[] }): ChecklistRound[] {
  // ... (Keep existing logic but use updated hasCategory/hasSkill) ...
  const rounds: ChecklistRound[] = [
    {
      title: "Round 1: Aptitude & Basics",
      items: [
        "Practice quantitative aptitude (percentages, ratios, profit/loss)",
        "Logical reasoning puzzles (seating, blood relations, coding-decoding)",
        "Verbal ability (reading comprehension, grammar, para jumbles)",
        "Basic math (number systems, algebra, probability)",
        "Time management drills — 60 questions in 60 minutes",
      ],
    },
    {
      title: "Round 2: DSA & Core CS",
      items: [
        "Arrays, strings, and hashing problems (easy → medium)",
        "Linked lists, stacks, queues implementations",
        "Trees and graph traversal (BFS, DFS)",
        "Dynamic programming (top-down and bottom-up)",
        "Sorting and searching algorithm complexity analysis",
      ],
    },
  ];

  if (hasCategory(skills, "Core CS")) {
    rounds[1].items.push(
      "OOP principles — encapsulation, polymorphism, abstraction, inheritance",
      "DBMS normalization, ACID properties, joins vs subqueries",
      "OS concepts — process scheduling, deadlocks, memory management"
    );
  }

  const round3Items = [
    "Prepare 2-minute project walkthrough for each resume project",
    "Explain architecture decisions and trade-offs in your projects",
    "Be ready for live coding — practice on whiteboard or shared editor",
    "Review system design basics (load balancing, caching, database sharding)",
    "Prepare STAR-format answers for technical challenges you've solved",
  ];

  if (hasCategory(skills, "Web")) {
    round3Items.push("Review component lifecycle and state management patterns", "Explain REST vs GraphQL trade-offs");
  }
  if (hasCategory(skills, "Data")) {
    round3Items.push("Practice writing complex SQL queries and explain query optimization");
  }
  if (hasCategory(skills, "Cloud/DevOps")) {
    round3Items.push("Explain CI/CD pipeline setup and containerization basics");
  }

  rounds.push({ title: "Round 3: Technical Interview (Projects + Stack)", items: round3Items });

  rounds.push({
    title: "Round 4: Managerial / HR",
    items: [
      "Prepare 'Tell me about yourself' — 90 seconds, structured",
      "Why this company? Research company values, recent news, products",
      "Strengths and weaknesses — be genuine, show self-awareness",
      "Where do you see yourself in 5 years? Align with company growth",
      "Salary expectations — research market rates for your role and location",
      "Questions to ask the interviewer (team culture, growth, tech stack)",
    ],
  });

  return rounds;
}

export function generatePlan(skills: { [key: string]: string[] }): DayPlan[] {
  const plan: DayPlan[] = [
    {
      day: "Day 1–2",
      focus: "Basics & Core CS",
      tasks: [
        "Revise OOP concepts with code examples",
        "Study DBMS — normalization, SQL queries, transactions",
        "Review OS — scheduling algorithms, memory, threads",
        "Networking basics — TCP/IP, HTTP, DNS",
        "Practice 10 aptitude questions daily",
      ],
    },
    {
      day: "Day 3–4",
      focus: "DSA & Coding Practice",
      tasks: [
        "Solve 5 array/string problems",
        "Practice 3 tree/graph problems",
        "Implement 2 dynamic programming problems",
        "Review time and space complexity",
        "Mock timed coding test",
      ],
    },
    {
      day: "Day 5",
      focus: "Project & Resume Alignment",
      tasks: [
        "Update resume to highlight relevant skills",
        "Prepare a 2-minute pitch for each project",
        "Identify metrics and impact",
        "Align project tech stack descriptions",
      ],
    },
    {
      day: "Day 6",
      focus: "Mock Interview Questions",
      tasks: [
        "Practice behavioral questions (STAR format)",
        "Do a mock technical interview",
        "Record yourself answering",
        "Prepare questions to ask the interviewer",
      ],
    },
    {
      day: "Day 7",
      focus: "Revision & Weak Areas",
      tasks: [
        "Revisit problems you got wrong",
        "Quick review of all core CS concepts",
        "Final aptitude practice round",
        "Rest and mental preparation",
      ],
    },
  ];

  if (hasCategory(skills, "Web")) {
    plan[2].tasks.push("Review React component patterns, hooks, and state management");
  }
  if (hasCategory(skills, "Data")) {
    plan[0].tasks.push("Practice complex SQL joins, window functions, and indexing");
  }
  if (hasCategory(skills, "Cloud/DevOps")) {
    plan[2].tasks.push("Review Docker basics and CI/CD pipeline configuration");
  }
  if (hasSkill(skills, "Python")) plan[1].tasks.push("Solve coding problems in Python");
  if (hasSkill(skills, "Java")) plan[1].tasks.push("Review Java collections framework");

  return plan;
}


const QUESTION_BANK: Record<string, string[]> = {
  "Java": [
    "Explain the difference between JDK, JRE, and JVM.",
    "What are the main features of Java 8?",
    "Explain the internal working of HashMap in Java.",
    "What is the difference top-level class can be private or protected?",
    "Explain the concept of Garbage Collection in Java."
  ],
  "Python": [
    "What are Python decorators and how do they work?",
    "Explain the difference between list and tuple.",
    "How is memory managed in Python?",
    "What is the difference between deep and shallow copy?",
    "Explain the Global Interpreter Lock (GIL)."
  ],
  "JavaScript": [
    "Explain the event loop in JavaScript.",
    "What is the difference between let, const, and var?",
    "Explain closures and give an example.",
    "What are promises and async/await?",
    "Explain the concept of hoisting."
  ],
  "React": [
    "What is the Virtual DOM and how does it work?",
    "Explain the useEffect hook lifecycle.",
    "What is the difference between state and props?",
    "What are Higher-Order Components (HOCs)?",
    "How does context API differ from Redux?"
  ],
  "Node.js": [
    "Explain the architecture of Node.js (Single-threaded event loop).",
    "What is the difference between process.nextTick() and setImmediate()?",
    "How do streams work in Node.js?",
    "Explain error handling in Express.js middleware.",
    "What is the purpose of package-lock.json?"
  ],
  "SQL": [
    "Explain the difference between INNER JOIN and LEFT JOIN.",
    "What is normalization? Explain 1NF, 2NF, 3NF.",
    "What is an index and how does it improve performance?",
    "Explain ACID properties in databases.",
    "What is the difference between DELETE and TRUNCATE?"
  ],
  "DSA": [
    "Explain the difference between BFS and DFS.",
    "How do you detect a cycle in a linked list?",
    "Explain the QuickSort algorithm and its time complexity.",
    "What is a hash table and how does it handle collisions?",
    "Explain dynamic programming with an example (e.g., Fibonacci)."
  ]
};

export function generateQuestions(skills: { [key: string]: string[] }): string[] {
  const questions: string[] = [];
  const allSkills = Object.values(skills).flat();

  for (const skill of allSkills) {
    const bank = QUESTION_BANK[skill];
    if (bank) {
      questions.push(...bank);
    }
  }

  // Add general questions if needed
  if (questions.length < 10) {
    const general = [
      "Tell me about a challenging project and how you solved problems in it.",
      "How do you stay updated with new technologies?",
      "Describe your approach to writing clean, maintainable code.",
      "How do you handle tight deadlines on a project?",
      "What is your debugging process when something breaks?",
    ];
    for (const q of general) {
      if (questions.length >= 10) break;
      if (!questions.includes(q)) questions.push(q);
    }
  }

  return questions.slice(0, 10);
}


export function generateCompanyIntel(company: string): {
  industry: string;
  size: "Startup" | "Mid-size" | "Enterprise";
  hiringFocus: string;
} {
  const name = company.toLowerCase();
  let size: "Startup" | "Mid-size" | "Enterprise" = "Startup";
  let industry = "Technology";
  let hiringFocus = "Full Stack Development & Problem Solving";

  if (
    name.includes("google") || name.includes("amazon") || name.includes("microsoft") ||
    name.includes("meta") || name.includes("netflix") || name.includes("uber") ||
    name.includes("adobe") || name.includes("salesforce") || name.includes("atlassian")
  ) {
    size = "Enterprise";
    industry = "Big Tech / SaaS";
    hiringFocus = "DSA, System Design & Core CS Fundamentals";
  } else if (
    name.includes("infosys") || name.includes("tcs") || name.includes("wipro") ||
    name.includes("accenture") || name.includes("cognizant")
  ) {
    size = "Enterprise";
    industry = "IT Services";
    hiringFocus = "Aptitude, Core Java/Python & Basic Coding";
  } else if (
    name.includes("swiggy") || name.includes("zomato") || name.includes("flipkart") ||
    name.includes("paytm") || name.includes("razorpay") || name.includes("cred")
  ) {
    size = "Mid-size";
    industry = "Product / Fintech / E-commerce";
    hiringFocus = "Machine Coding, LLD & Practical Dev Skills";
  }

  return { industry, size, hiringFocus };
}


export function generateRoundMapping(
  intel: { size: string },
  skills: { [key: string]: string[] }
): { roundNumber: number; name: string; desc: string }[] {
  const rounds: { roundNumber: number; name: string; desc: string }[] = [];

  const hasWeb = hasCategory(skills, "Web");
  // const hasData = hasCategory(skills, "Data"); // Unused in logic but good to have
  // const hasCore = hasCategory(skills, "Core CS");

  if (intel.size === "Enterprise") {
    rounds.push(
      { roundNumber: 1, name: "Online Assessment", desc: "60-90 mins coding test focus on DSA (Arrays, Strings, DP) + Aptitude." },
      { roundNumber: 2, name: "Technical Round 1", desc: "Live coding on DSA (Trees/Graphs) + Core CS (OS/DBMS) concepts." },
      { roundNumber: 3, name: "Technical Round 2", desc: "System Design basics + Project deep dive. Expect 'Why this DB?' questions." },
      { roundNumber: 4, name: "HR / Managerial", desc: "Behavioral fit, 'Why this company?', and culture alignment." }
    );
  } else {
    rounds.push(
      { roundNumber: 1, name: "Screening / Take-home", desc: hasWeb ? "Build a small React/Node app or fix bugs." : "Practical coding task or rapid fire tech questions." },
      { roundNumber: 2, name: "Technical Deep Dive", desc: hasWeb ? "Pair programming: Add a feature to your task." : "Live problem solving (practical NOT just LeetCode)." },
      { roundNumber: 3, name: "Culture & Engineering Manager", desc: "Discuss past projects, team conflict resolution, and product sense." }
    );
  }

  return rounds;
}

export function runAnalysis(company: string, role: string, jdText: string): AnalysisEntry {
  const skills = extractSkills(jdText);
  const score = calculateReadinessScore(company, role, jdText, skills);
  const checklist = generateChecklist(skills);
  const plan = generatePlan(skills);
  const questions = generateQuestions(skills);

  const companyIntel = generateCompanyIntel(company);
  const roundMapping = generateRoundMapping(companyIntel, skills);

  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    company,
    role,
    jdText,
    extractedSkills: skills,
    plan7Days: plan,
    checklist,
    questions,
    baseScore: score,
    finalScore: score,
    skillConfidenceMap: {},
    companyIntel,
    roundMapping
  };
}
