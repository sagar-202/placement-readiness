
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import TestChecklistPage from './TestChecklistPage';
import ShipPage from './ShipPage';

// Mock clipboard and alert/confirm
Object.assign(navigator, {
    clipboard: {
        writeText: vi.fn(),
    },
});
global.confirm = vi.fn(() => true);
global.alert = vi.fn();

describe('Checklist & Ship Lock Verification', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it('renders exactly 10 checklist items', () => {
        render(
            <MemoryRouter>
                <TestChecklistPage />
            </MemoryRouter>
        );
        const checkboxes = screen.getAllByRole('checkbox');
        expect(checkboxes.length).toBe(10);
    });

    it('updates counter and warning when items are checked', async () => {
        render(
            <MemoryRouter>
                <TestChecklistPage />
            </MemoryRouter>
        );

        // Initial state: 0/10
        expect(screen.getByText(/0 \/ 10 Passed/i)).toBeInTheDocument();
        expect(screen.getByText(/Shipping Locked/i)).toBeInTheDocument();

        // Check one item
        const checkboxes = screen.getAllByRole('checkbox');
        fireEvent.click(checkboxes[0]);

        // Update state: 1/10
        await waitFor(() => {
            expect(screen.getByText(/1 \/ 10 Passed/i)).toBeInTheDocument();
        });
    });

    it('persists checked state to localStorage', async () => {
        const { unmount } = render(
            <MemoryRouter>
                <TestChecklistPage />
            </MemoryRouter>
        );

        const checkboxes = screen.getAllByRole('checkbox');
        fireEvent.click(checkboxes[0]); // Check first item

        // Verify localStorage logic implicitly by unmounting and remounting
        unmount();

        render(
            <MemoryRouter>
                <TestChecklistPage />
            </MemoryRouter>
        );

        // First checkbox should still be checked
        const newCheckboxes = screen.getAllByRole('checkbox');
        expect(newCheckboxes[0]).toBeChecked();
        expect(newCheckboxes[1]).not.toBeChecked();
    });

    it('ShipPage is locked when checklist is incomplete', () => {
        render(
            <MemoryRouter>
                <ShipPage />
            </MemoryRouter>
        );

        expect(screen.getByText(/Ship Locked/i)).toBeInTheDocument();
        expect(screen.queryByText(/Ready for Takeoff/i)).not.toBeInTheDocument();
    });

    it('ShipPage unlocks when all 10 items are checked', () => {
        // Manually satisfy the condition in localStorage
        const allChecked: Record<string, boolean> = {
            "validate-jd": true,
            "short-jd-warn": true,
            "skill-grouping": true,
            "round-mapping": true,
            "score-deterministic": true,
            "score-toggle": true,
            "persist-refresh": true,
            "history-save": true,
            "export-copy": true,
            "no-console-errors": true
        };
        localStorage.setItem("prp-test-checklist", JSON.stringify(allChecked));

        render(
            <MemoryRouter>
                <ShipPage />
            </MemoryRouter>
        );

        expect(screen.queryByText(/Ship Locked/i)).not.toBeInTheDocument();
        expect(screen.getByText(/Ready for Takeoff/i)).toBeInTheDocument();
    });
});
