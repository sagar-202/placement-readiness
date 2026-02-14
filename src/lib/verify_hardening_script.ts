
import { runAnalysis, extractSkills } from './skill-extractor';
import { normalizeEntry } from './analysis-migration';

console.log("Starting Verification Script...");

try {
    // Test 1: Schema Completeness
    console.log("Test 1: Schema Completeness");
    const entry = runAnalysis("Test Corp", "Dev", "We need React and Node.js skills.");

    const requiredFields = [
        'extractedSkills', 'roundMapping', 'plan7Days', 'questions',
        'skillConfidenceMap', 'baseScore', 'finalScore', 'updatedAt'
    ];

    const missing = requiredFields.filter(f => !(f in entry));
    if (missing.length > 0) {
        console.error("FAIL: Missing fields:", missing);
    } else {
        console.log("PASS: All schema fields present.");
    }

    if (Array.isArray(entry.extractedSkills)) {
        console.error("FAIL: extractedSkills is an array (should be object)");
    } else {
        console.log("PASS: extractedSkills is an object.");
    }

    // Test 2: Fallback Skills
    console.log("\nTest 2: Fallback Skills");
    const noSkillEntry = runAnalysis("Corp", "Role", "I am a nice person.");
    const hasFallback = noSkillEntry.extractedSkills.other.includes("Communication");
    if (hasFallback) {
        console.log("PASS: Fallback skills detected.");
    } else {
        console.error("FAIL: No fallback skills found.");
    }

    // Test 3: Score Logic
    console.log("\nTest 3: Score Logic");
    if (entry.baseScore === entry.finalScore) {
        console.log("PASS: baseScore equals finalScore initially.");
    } else {
        console.error(`FAIL: Score mismatch. Base: ${entry.baseScore}, Final: ${entry.finalScore}`);
    }

    // Test 4: Legacy Migration
    console.log("\nTest 4: Legacy Migration");
    const legacy = {
        id: "old-123",
        extractedSkills: [{ name: "Web", skills: ["Vue.js"] }], // Old array format
        readinessScore: 80
    };
    const normalized = normalizeEntry(legacy);
    if (!Array.isArray(normalized.extractedSkills) && normalized.baseScore === 80) {
        console.log("PASS: Legacy entry normalized correctly.");
    } else {
        console.error("FAIL: Legacy normalization failed.");
    }

} catch (e) {
    console.error("CRITICAL ERROR during verification:", e);
}

console.log("Verification Script Finished.");
