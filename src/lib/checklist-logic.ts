
export const CHECKLIST_ITEMS = [
    { id: "validate-jd", label: "JD required validation works", hint: "Try submitting empty JD on Practice page." },
    { id: "short-jd-warn", label: "Short JD warning shows for <200 chars", hint: "Enter a short text and check for warning." },
    { id: "skill-grouping", label: "Skills extraction groups correctly", hint: "Verify skills appear in correct categories (Web, Core CS, etc)." },
    { id: "round-mapping", label: "Round mapping changes based on company + skills", hint: "Check 'Amazon' vs unknown company rounds." },
    { id: "score-deterministic", label: "Score calculation is deterministic", hint: "Same JD should produce same base score." },
    { id: "score-toggle", label: "Skill toggles update score live", hint: "Toggle 'Know'/'Practice' and watch score change." },
    { id: "persist-refresh", label: "Changes persist after refresh", hint: "Reload page and check if score/toggles remain." },
    { id: "history-save", label: "History saves and loads correctly", hint: "Check Assessments page for saved entries." },
    { id: "export-copy", label: "Export buttons copy the correct content", hint: "Test 'Copy Plan' and paste to notepad." },
    { id: "no-console-errors", label: "No console errors on core pages", hint: "Open DevTools and check console." },
];

export const STORAGE_KEY = "prp-test-checklist";

export function isChecklistComplete(checkedItems: Record<string, boolean>): boolean {
    const checkedCount = CHECKLIST_ITEMS.filter(i => checkedItems[i.id]).length;
    return checkedCount === CHECKLIST_ITEMS.length;
}

export function getPassedCount(checkedItems: Record<string, boolean>): number {
    return CHECKLIST_ITEMS.filter(i => checkedItems[i.id]).length;
}
