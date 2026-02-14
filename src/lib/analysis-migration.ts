import type { AnalysisEntry, SkillCategory } from "./analysis-types";

// Helper to check if an entry is in the old format (extractedSkills is array)
function isLegacyEntry(entry: any): boolean {
    return Array.isArray(entry.extractedSkills);
}

export function normalizeEntry(entry: any): AnalysisEntry {
    if (!isLegacyEntry(entry)) {
        // Already in new format, but ensure all fields exist
        return {
            ...entry,
            skillConfidenceMap: entry.skillConfidenceMap || {},
            finalScore: entry.finalScore ?? entry.readinessScore ?? 0,
            baseScore: entry.baseScore ?? entry.readinessScore ?? 0,
            updatedAt: entry.updatedAt || new Date().toISOString(),
            extractedSkills: entry.extractedSkills || {
                coreCS: [], languages: [], web: [], data: [], cloud: [], testing: [], other: []
            }
        };
    }

    // Migrate Legacy Entry
    const legacySkills = entry.extractedSkills as SkillCategory[];
    const newSkills = {
        coreCS: [],
        languages: [],
        web: [],
        data: [],
        cloud: [],
        testing: [],
        other: []
    } as any;

    // Flatten skills into buckets based on name
    legacySkills.forEach(cat => {
        const key = mapCategoryToKey(cat.name);
        if (newSkills[key]) {
            newSkills[key] = [...newSkills[key], ...cat.skills];
        } else {
            newSkills.other = [...newSkills.other, ...cat.skills];
        }
    });

    return {
        id: entry.id,
        createdAt: entry.createdAt,
        updatedAt: new Date().toISOString(),
        company: entry.company || "",
        role: entry.role || "",
        jdText: entry.jdText || "",
        extractedSkills: newSkills,
        plan7Days: entry.plan || [], // Map old 'plan' to 'plan7Days'
        checklist: entry.checklist || [],
        questions: entry.questions || [],
        baseScore: entry.readinessScore || 0,
        finalScore: entry.readinessScore || 0,
        skillConfidenceMap: entry.skillConfidenceMap || {},
        companyIntel: entry.companyIntel,
        roundMapping: entry.roundMapping
    };
}

function mapCategoryToKey(name: string): string {
    const map: Record<string, string> = {
        "Core CS": "coreCS",
        "Languages": "languages",
        "Web": "web",
        "Data": "data",
        "Cloud/DevOps": "cloud",
        "Testing": "testing"
    };
    return map[name] || "other";
}
