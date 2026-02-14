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

export function extractSkills(jdText: string): SkillCategory[] {
  const results: SkillCategory[] = [];

  for (const [category, keywords] of Object.entries(SKILL_DB)) {
    const found: string[] = [];
    for (const kw of keywords) {
      const regex = new RegExp(kw, "i");
      if (regex.test(jdText)) {
        found.push(DISPLAY_NAMES[kw] || kw);
      }
    }
    if (found.length > 0) {
      results.push({ name: category, skills: found });
    }
  }

  if (results.length === 0) {
    results.push({ name: "General", skills: ["General fresher stack"] });
  }

  return results;
}

export function calculateReadinessScore(company: string, role: string, jdText: string, skills: SkillCategory[]): number {
  let score = 35;
  const categoryCount = skills.filter(s => s.name !== "General").length;
  score += Math.min(categoryCount * 5, 30);
  if (company.trim().length > 0) score += 10;
  if (role.trim().length > 0) score += 10;
  if (jdText.length > 800) score += 10;
  return Math.min(score, 100);
}

function hasCategory(skills: SkillCategory[], name: string): boolean {
  return skills.some(s => s.name === name);
}

function hasSkill(skills: SkillCategory[], skill: string): boolean {
  return skills.some(s => s.skills.some(sk => sk.toLowerCase() === skill.toLowerCase()));
}

export function generateChecklist(skills: SkillCategory[]): ChecklistRound[] {
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

  // Core CS additions
  if (hasCategory(skills, "Core CS")) {
    rounds[1].items.push(
      "OOP principles — encapsulation, polymorphism, abstraction, inheritance",
      "DBMS normalization, ACID properties, joins vs subqueries",
      "OS concepts — process scheduling, deadlocks, memory management"
    );
  }

  // Round 3: Tech interview
  const round3Items = [
    "Prepare 2-minute project walkthrough for each resume project",
    "Explain architecture decisions and trade-offs in your projects",
    "Be ready for live coding — practice on whiteboard or shared editor",
    "Review system design basics (load balancing, caching, database sharding)",
    "Prepare STAR-format answers for technical challenges you've solved",
  ];

  if (hasCategory(skills, "Web")) {
    round3Items.push(
      "Review component lifecycle and state management patterns",
      "Explain REST vs GraphQL trade-offs with examples"
    );
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

export function generatePlan(skills: SkillCategory[]): DayPlan[] {
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
        "Solve 5 array/string problems (focus on sliding window, two pointers)",
        "Practice 3 tree/graph problems",
        "Implement 2 dynamic programming problems",
        "Review time and space complexity of your solutions",
        "Mock timed coding test — 3 problems in 90 minutes",
      ],
    },
    {
      day: "Day 5",
      focus: "Project & Resume Alignment",
      tasks: [
        "Update resume to highlight relevant skills from the JD",
        "Prepare a 2-minute pitch for each project",
        "Identify metrics and impact for each project",
        "Align project tech stack descriptions with JD keywords",
      ],
    },
    {
      day: "Day 6",
      focus: "Mock Interview Questions",
      tasks: [
        "Practice behavioral questions (STAR format)",
        "Do a mock technical interview with a peer or online tool",
        "Record yourself answering and review clarity",
        "Prepare questions to ask the interviewer",
      ],
    },
    {
      day: "Day 7",
      focus: "Revision & Weak Areas",
      tasks: [
        "Revisit problems you got wrong during the week",
        "Quick review of all core CS concepts",
        "Final aptitude practice round",
        "Rest and mental preparation — confidence matters",
      ],
    },
  ];

  // Adapt based on detected skills
  if (hasCategory(skills, "Web")) {
    plan[2].tasks.push("Review React component patterns, hooks, and state management");
    plan[3].tasks.push("Practice explaining frontend architecture decisions");
  }
  if (hasCategory(skills, "Data")) {
    plan[0].tasks.push("Practice complex SQL joins, window functions, and indexing");
  }
  if (hasCategory(skills, "Cloud/DevOps")) {
    plan[2].tasks.push("Review Docker basics and CI/CD pipeline configuration");
  }
  if (hasSkill(skills, "Python")) {
    plan[1].tasks.push("Solve coding problems in Python — focus on Pythonic solutions");
  }
  if (hasSkill(skills, "Java")) {
    plan[1].tasks.push("Review Java collections framework and multithreading");
  }

  return plan;
}

const QUESTION_BANK: Record<string, string[]> = {
  "DSA": [
    "How would you optimize search in a sorted dataset?",
    "Explain the difference between BFS and DFS with use cases.",
    "What is the time complexity of quicksort and when does it degrade?",
    "How would you detect a cycle in a linked list?",
  ],
  "OOP": [
    "Explain polymorphism with a real-world example.",
    "What is the difference between abstract classes and interfaces?",
  ],
  "DBMS": [
    "What are ACID properties and why do they matter?",
    "Explain normalization up to 3NF with examples.",
  ],
  "SQL": [
    "Explain indexing in databases and when it helps performance.",
    "Write a query to find the second highest salary in a table.",
  ],
  "React": [
    "Explain state management options in React and when to use each.",
    "What are React hooks and how do they differ from class lifecycle methods?",
    "How does the virtual DOM work and why is it efficient?",
  ],
  "Node.js": [
    "Explain the event loop in Node.js.",
    "How do you handle errors in async/await code in Node?",
  ],
  "Python": [
    "What are Python decorators and where would you use them?",
    "Explain list comprehension vs generator expression.",
  ],
  "Java": [
    "Explain garbage collection in Java.",
    "What is the difference between HashMap and ConcurrentHashMap?",
  ],
  "JavaScript": [
    "Explain closures in JavaScript with an example.",
    "What is the difference between var, let, and const?",
  ],
  "TypeScript": [
    "How do generics work in TypeScript and when would you use them?",
    "Explain the difference between type and interface in TypeScript.",
  ],
  "MongoDB": [
    "When would you choose MongoDB over a relational database?",
    "Explain aggregation pipelines in MongoDB.",
  ],
  "Docker": [
    "Explain the difference between a Docker image and a container.",
    "How do you optimize Docker image size for production?",
  ],
  "Kubernetes": [
    "What is a Kubernetes pod and how does it relate to containers?",
  ],
  "AWS": [
    "Explain the difference between EC2, Lambda, and ECS.",
    "How would you design a highly available architecture on AWS?",
  ],
  "REST": [
    "What are REST principles and how do they differ from RPC?",
    "Explain HTTP status codes: 200, 201, 400, 401, 403, 404, 500.",
  ],
  "GraphQL": [
    "What are the advantages of GraphQL over REST?",
    "Explain resolvers and schemas in GraphQL.",
  ],
  "OS": [
    "Explain process vs thread and when you'd use each.",
    "What is a deadlock and how can it be prevented?",
  ],
  "Networks": [
    "Explain the TCP three-way handshake.",
    "What happens when you type a URL in the browser?",
  ],
  "General fresher stack": [
    "Tell me about a project you've built and the challenges you faced.",
    "How do you approach learning a new technology?",
    "Describe a time you debugged a difficult issue.",
  ],
};

export function generateQuestions(skills: SkillCategory[]): string[] {
  const questions: string[] = [];
  const allSkills = skills.flatMap(s => s.skills);

  for (const skill of allSkills) {
    const bank = QUESTION_BANK[skill];
    if (bank) {
      questions.push(...bank);
    }
  }

  // Always add some general ones if we have fewer than 10
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

export function generateCompanyIntel(company: string): { industry: string; size: "Startup" | "Mid-size" | "Enterprise"; hiringFocus: string } {
  const name = company.toLowerCase();

  // Heuristic lists
  const enterprises = ["google", "microsoft", "amazon", "meta", "apple", "netflix", "adobe", "salesforce", "oracle", "ibm", "cisco", "intel", "infosys", "tcs", "wipro", "accenture", "cognizant", "capgemini", "deloitte", "jpmorgan", "goldman sachs", "morgan stanley"];
  const midSize = ["uber", "airbnb", "stripe", "coinbase", "spotify", "shopify", "atlassian", "slack", "zoom", "dropbox", "box", "reddit", "twitter", "x", "snapchat", "pinterest"];

  let size: "Startup" | "Mid-size" | "Enterprise" = "Startup";
  let industry = "Technology Services";
  let hiringFocus = "Practical problem solving and specific tech stack depth.";

  if (enterprises.some(e => name.includes(e))) {
    size = "Enterprise";
    hiringFocus = "Strong DSA fundamentals, scalable system design, and core CS concepts.";
    if (["infosys", "tcs", "wipro", "accenture", "cognizant"].some(e => name.includes(e))) {
      industry = "IT Services & Consulting";
    } else if (["jpmorgan", "goldman", "morgan"].some(e => name.includes(e))) {
      industry = "FinTech / Banking";
    } else {
      industry = "Big Tech / Product";
    }
  } else if (midSize.some(e => name.includes(e))) {
    size = "Mid-size";
    hiringFocus = "Balance of DSA, system design, and product engineering skills.";
    industry = "High-Growth Product";
  } else {
    // Default heuristic for unknown
    size = "Startup";
    industry = "Internet / Startup";
  }

  return { industry, size, hiringFocus };
}

export function generateRoundMapping(
  intel: { size: string },
  skills: SkillCategory[]
): { roundNumber: number; name: string; desc: string }[] {
  const rounds: { roundNumber: number; name: string; desc: string }[] = [];

  const hasWeb = hasCategory(skills, "Web");
  const hasData = hasCategory(skills, "Data");
  const hasCore = hasCategory(skills, "Core CS");

  if (intel.size === "Enterprise") {
    rounds.push({
      roundNumber: 1,
      name: "Online Assessment",
      desc: "60-90 mins coding test focus on DSA (Arrays, Strings, DP) + Aptitude.",
    });
    rounds.push({
      roundNumber: 2,
      name: "Technical Round 1",
      desc: "Live coding on DSA (Trees/Graphs) + Core CS (OS/DBMS) concepts.",
    });
    rounds.push({
      roundNumber: 3,
      name: "Technical Round 2",
      desc: "System Design basics + Project deep dive. Expect 'Why this DB?' questions.",
    });
    rounds.push({
      roundNumber: 4,
      name: "HR / Managerial",
      desc: "Behavioral fit, 'Why this company?', and culture alignment.",
    });
  } else {
    // Startup / Mid-size
    rounds.push({
      roundNumber: 1,
      name: "Screening / Take-home",
      desc: hasWeb
        ? "Build a small React/Node app or fix bugs in an existing repo."
        : "Practical coding task or rapid fire tech questions.",
    });
    rounds.push({
      roundNumber: 2,
      name: "Technical Deep Dive",
      desc: hasWeb
        ? "Pair programming: Add a feature to your task. Discuss state management."
        : "Live problem solving (practical NOT just LeetCode).",
    });
    rounds.push({
      roundNumber: 3,
      name: "Culture & Engineering Manager",
      desc: "Discuss past projects, team conflict resolution, and product sense.",
    });
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
    company,
    role,
    jdText,
    extractedSkills: skills,
    plan,
    checklist,
    questions,
    readinessScore: score,
    companyIntel,
    roundMapping
  };
}
