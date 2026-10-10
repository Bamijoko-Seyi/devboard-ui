import { useEffect, useState } from "react";
import { listTasks, createTask, updateTask, deleteTask } from "../api/tasks";

const STATUSES = [
    { key: "TODO", label: "To Do" },
    { key: "IN_PROGRESS", label: "In Progress" },
    { key: "DONE", label: "Done" },
];

export default function TaskBoard({ projectId, members, canEdit }) {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [error, setError] = useState("");

    // Create form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("TODO");
    const [assigneeId, setAssigneeId] = useState("");
    const [dueDate, setDueDate] = useState("");

    useEffect(() => {
        load();
    }, [projectId]);

    async function load() {
        try {
            const data = await listTasks(projectId);
            setTasks(data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load tasks");
        } finally {
            setLoading(false);
        }
    }

    async function handleCreate(e) {
        e.preventDefault();
        setError("");
        try {
            const created = await createTask(projectId, {
                title,
                description,
                status,
                assigneeId: assigneeId ? Number(assigneeId) : null,
                dueDate: dueDate || null,
            });
            setTasks([created, ...tasks]);
            resetForm();
            setShowCreate(false);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create task");
        }
    }

    async function handleStatusChange(task, newStatus) {
        try {
            const updated = await updateTask(projectId, task.id, {
                title: task.title,
                description: task.description,
                status: newStatus,
                assigneeId: task.assigneeId,
                dueDate: task.dueDate,
            });
            setTasks(tasks.map((t) => (t.id === task.id ? updated : t)));
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update task");
        }
    }

    async function handleDelete(taskId) {
        if (!confirm("Delete this task?")) return;
        try {
            await deleteTask(projectId, taskId);
            setTasks(tasks.filter((t) => t.id !== taskId));
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete task");
        }
    }

    function resetForm() {
        setTitle("");
        setDescription("");
        setStatus("TODO");
        setAssigneeId("");
        setDueDate("");
    }

    const tasksByStatus = (s) => tasks.filter((t) => t.status === s);

    return (
        <div className="bg-white p-6 rounded shadow">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Tasks ({tasks.length})</h2>
                {canEdit && (
                    <button
                        onClick={() => setShowCreate(!showCreate)}
                        className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700"
                    >
                        + New Task
                    </button>
                )}
            </div>

            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

            {showCreate && canEdit && (
                <form onSubmit={handleCreate} className="bg-gray-50 p-4 rounded mb-4 space-y-3">
                    <input
                        type="text"
                        placeholder="Task title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        required
                        maxLength={200}
                    />
                    <textarea
                        placeholder="Description (optional)"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        rows={2}
                    />
                    <div className="grid grid-cols-3 gap-3">
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="border rounded px-3 py-2"
                        >
                            {STATUSES.map((s) => (
                                <option key={s.key} value={s.key}>{s.label}</option>
                            ))}
                        </select>
                        <select
                            value={assigneeId}
                            onChange={(e) => setAssigneeId(e.target.value)}
                            className="border rounded px-3 py-2"
                        >
                            <option value="">Unassigned</option>
                            {members.map((m) => (
                                <option key={m.userId} value={m.userId}>{m.displayName}</option>
                            ))}
                        </select>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="border rounded px-3 py-2"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">
                            Create
                        </button>
                        <button
                            type="button"
                            onClick={() => { setShowCreate(false); resetForm(); }}
                            className="px-4 py-2 rounded border text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {loading ? (
                <p className="text-gray-500">Loading tasks...</p>
            ) : tasks.length === 0 ? (
                <p className="text-gray-500 text-sm">No tasks yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {STATUSES.map((col) => (
                        <div key={col.key} className="bg-gray-50 rounded p-3">
                            <h3 className="text-sm font-semibold text-gray-600 mb-3">
                                {col.label} ({tasksByStatus(col.key).length})
                            </h3>
                            <div className="space-y-2">
                                {tasksByStatus(col.key).map((task) => (
                                    <div key={task.id} className="bg-white p-3 rounded shadow-sm">
                                        <p className="font-medium text-sm">{task.title}</p>
                                        {task.description && (
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>
                                        )}
                                        <div className="flex flex-wrap gap-1 mt-2 text-xs">
                                            {task.assigneeDisplayName && (
                                                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                          {task.assigneeDisplayName}
                        </span>
                                            )}
                                            {task.dueDate && (
                                                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                                            )}
                                        </div>
                                        {canEdit && (
                                            <div className="flex gap-2 mt-3 text-xs">
                                                {col.key !== "IN_PROGRESS" && (
                                                    <button
                                                        onClick={() => handleStatusChange(task, "IN_PROGRESS")}
                                                        className="text-blue-600 hover:underline"
                                                    >
                                                        Start
                                                    </button>
                                                )}
                                                {col.key !== "DONE" && (
                                                    <button
                                                        onClick={() => handleStatusChange(task, "DONE")}
                                                        className="text-green-600 hover:underline"
                                                    >
                                                        Done
                                                    </button>
                                                )}
                                                {col.key !== "TODO" && (
                                                    <button
                                                        onClick={() => handleStatusChange(task, "TODO")}
                                                        className="text-gray-600 hover:underline"
                                                    >
                                                        Reset
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(task.id)}
                                                    className="text-red-600 hover:underline ml-auto"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}