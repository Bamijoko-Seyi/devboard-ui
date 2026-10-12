import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TaskBoard from '../TaskBoard';
import * as tasksApi from '../../api/tasks';

vi.mock('../../api/tasks');

describe('TaskBoard', () => {
    const members = [
        { userId: 1, displayName: 'Alice', role: 'OWNER' },
        { userId: 2, displayName: 'Bob', role: 'EDITOR' },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('shows loading state initially', () => {
        tasksApi.listTasks.mockResolvedValue([]);
        render(<TaskBoard projectId={1} members={members} canEdit={true} />);
        expect(screen.getByText(/loading tasks/i)).toBeInTheDocument();
    });

    it('shows "No tasks yet" when empty', async () => {
        tasksApi.listTasks.mockResolvedValue([]);
        render(<TaskBoard projectId={1} members={members} canEdit={true} />);
        await waitFor(() =>
            expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument()
        );
    });

    it('renders task in the correct column', async () => {
        tasksApi.listTasks.mockResolvedValue([
            {
                id: 1, title: 'Write tests', description: '',
                status: 'TODO', assigneeId: null, assigneeDisplayName: null,
                dueDate: null,
            },
        ]);
        render(<TaskBoard projectId={1} members={members} canEdit={true} />);
        await waitFor(() => expect(screen.getByText('Write tests')).toBeInTheDocument());
        expect(screen.getByText(/to do \(1\)/i)).toBeInTheDocument();
    });

    it('hides new task button when canEdit is false', async () => {
        tasksApi.listTasks.mockResolvedValue([]);
        render(<TaskBoard projectId={1} members={members} canEdit={false} />);
        await waitFor(() => expect(tasksApi.listTasks).toHaveBeenCalled());
        expect(screen.queryByText(/new task/i)).not.toBeInTheDocument();
    });
});