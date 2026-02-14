
import { describe, it, expect } from 'vitest';
import { extractSkills, calculateReadinessScore } from './skill-extractor';
import { normalizeEntry } from './analysis-migration';

describe('Platform Hardening Logic', () => {
    it('extractSkills returns default soft skills if no technical skills found', () => {
        const skills = extractSkills("I am a good communicator.");
        expect(skills.other).toContain("Communication");
        expect(skills.coreCS).toHaveLength(0);
    });

    it('calculateReadinessScore handles short/empty JD', () => {
        const skills = extractSkills("");
        const score = calculateReadinessScore("", "", "", skills);
        expect(score).toBeGreaterThan(0); // Should have base score
        expect(score).toBeLessThan(100);
    });

    it('normalizeEntry migrates legacy schema to strict schema', () => {
        const legacyEntry = {
            id: "123",
            createdAt: "2023-01-01",
            company: "Test Corp",
            role: "Dev",
            jdText: "React Node",
            extractedSkills: [
                { name: "Web", skills: ["React", "Node.js"] }
            ],
            readinessScore: 75,
            plan: [],
            checklist: [],
            questions: []
        };

        const normalized = normalizeEntry(legacyEntry);

        expect(normalized.extractedSkills).toBeDefined();
        expect(Array.isArray(normalized.extractedSkills)).toBe(false);
        expect(normalized.extractedSkills.web).toContain("React");
        expect(normalized.baseScore).toBe(75);
        expect(normalized.finalScore).toBe(75);
        expect(normalized.plan7Days).toBeDefined();
        expect(normalized.updatedAt).toBeDefined();
    });
});
