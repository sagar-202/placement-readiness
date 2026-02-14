
import { describe, it, expect } from 'vitest';
import { runAnalysis, extractSkills } from './skill-extractor';
import { normalizeEntry } from './analysis-migration';

// Mock types to ensure we check against the real interface without importing if cyclic
// But we can import AnalysisEntry from analysis-types
import { AnalysisEntry } from './analysis-types';

describe('Platform Hardening Verification', () => {

    // Requirement: Every saved history entry contain ALL schema fields
    it('runAnalysis produces a complete AnalysisEntry schema', () => {
        const entry = runAnalysis("Test Corp", "Dev", "We need React and Node.js skills.");

        // Check all top-level fields
        expect(entry).toHaveProperty('id');
        expect(entry).toHaveProperty('createdAt');
        expect(entry).toHaveProperty('updatedAt');
        expect(entry).toHaveProperty('company', "Test Corp");
        expect(entry).toHaveProperty('role', "Dev");
        expect(entry).toHaveProperty('jdText');

        // Check rich fields
        expect(entry).toHaveProperty('extractedSkills');
        expect(entry.extractedSkills).toHaveProperty('coreCS');
        expect(entry.extractedSkills).toHaveProperty('web'); // etc
        expect(Array.isArray(entry.extractedSkills)).toBe(false); // Must be object

        expect(entry).toHaveProperty('roundMapping');
        expect(Array.isArray(entry.roundMapping)).toBe(true);

        expect(entry).toHaveProperty('plan7Days');
        expect(entry.plan7Days.length).toBeGreaterThan(0);

        expect(entry).toHaveProperty('questions');
        expect(entry.questions.length).toBeGreaterThan(0);

        expect(entry).toHaveProperty('skillConfidenceMap');
        expect(entry).toHaveProperty('baseScore');
        expect(entry).toHaveProperty('finalScore');

        // Verify baseScore == finalScore initially
        expect(entry.baseScore).toBe(entry.finalScore);
    });

    // Requirement: If no technical skills are detected, populate 'other' with fallback
    it('populates fallback skills for non-technical JD', () => {
        // "I am looking for a nice person" -> No tech skills
        const entry = runAnalysis("Generic Corp", "Nice Person", "I am looking for a nice person who is kind.");

        const allSkills = [
            ...entry.extractedSkills.coreCS,
            ...entry.extractedSkills.languages,
            ...entry.extractedSkills.web,
            ...entry.extractedSkills.data,
            ...entry.extractedSkills.cloud,
            ...entry.extractedSkills.testing
        ];

        expect(allSkills.length).toBe(0); // No tech skills

        // Check fallback
        expect(entry.extractedSkills.other.length).toBeGreaterThan(0);
        expect(entry.extractedSkills.other).toContain("Communication");
        expect(entry.extractedSkills.other).toContain("Problem solving");
    });

    // Requirement: Legacy data migration fills missing fields
    it('normalizeEntry adds missing fields to legacy data', () => {
        const legacy = {
            id: "old-123",
            // Missing updatedAt
            // extractedSkills is Array (Old schema)
            extractedSkills: [{ name: "Web", skills: ["Vue.js"] }],
            readinessScore: 80
            // Missing baseScore, finalScore, skillConfidenceMap
        };

        const normalized = normalizeEntry(legacy);

        expect(normalized.updatedAt).toBeDefined();
        expect(normalized.skillConfidenceMap).toEqual({});
        expect(normalized.baseScore).toBe(80);
        expect(normalized.finalScore).toBe(80);
        expect(normalized.extractedSkills).not.toBeInstanceOf(Array);
        expect(normalized.extractedSkills.web).toContain("Vue.js");
    });

});
