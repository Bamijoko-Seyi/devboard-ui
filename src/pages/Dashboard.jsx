import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { listProjects, createProject, deleteProject } from "../api/projects";

export default function Dashboard() {
    const { user, logout } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        load();
    }, []);

    async function load() {
        try {
            const data = await listProjects();
            setProjects(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function handleCreate(e) {
        e.preventDefault();
        setError("");
        try {
            const created = await createProject(name, description);
            setProjects([created, ...projects]);
            setName("");
            setDescription("");
            setShowCreate(false);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create project");
        }
    }

    async function handleDelete(id) {
        if (!confirm("Delete this project?")) return;
        await deleteProject(id);
        setProjects(projects.filter((p) => p.id !== id));
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">DevBoard</h1>
                <div className="flex items-center gap-4">
                    <Link to="/invitations" className="text-sm text-blue-600 hover:underline">
                        Invitations
                    </Link>
                    <span className="text-sm text-gray-600">{user?.displayName}</span>
                    <button onClick={logout} className="text-sm text-blue-600 hover:underline">
                        Logout
                    </button>
                </div>
            </header>

            <main className="max-w-4xl mx-auto p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Your Projects</h2>
                    <button
                        onClick={() => setShowCreate(!showCreate)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        + New Project
                    </button>
                </div>

                {showCreate && (
                    <form onSubmit={handleCreate} className="bg-white p-6 rounded shadow mb-6">
                        {error && (
                            <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>
                        )}
                        <input
                            type="text"
                            placeholder="Project name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border rounded px-3 py-2 mb-3"
                            required
                            maxLength={100}
                        />
                        <textarea
                            placeholder="Description (optional)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border rounded px-3 py-2 mb-4"
                            rows={3}
                            maxLength={1000}
                        />
                        <div className="flex gap-2">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Create
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowCreate(false)}
                                className="px-4 py-2 rounded border"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}

                {loading ? (
                    <p className="text-gray-500">Loading projects...</p>
                ) : projects.length === 0 ? (
                    <div className="bg-white p-8 rounded shadow text-center text-gray-500">
                        No projects yet. Create your first one.
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {projects.map((project) => (
                            <div
                                key={project.id}
                                className="bg-white p-5 rounded shadow flex justify-between items-start"
                            >
                                <div>
                                    <Link
                                        to={`/projects/${project.id}`}
                                        className="text-lg font-semibold text-blue-600 hover:underline"
                                    >
                                        {project.name}
                                    </Link>
                                    {project.description && (
                                        <p className="text-gray-600 text-sm mt-1">{project.description}</p>
                                    )}
                                    <p className="text-xs text-gray-400 mt-2">
                                        Created {new Date(project.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDelete(project.id)}
                                    className="text-sm text-red-600 hover:underline"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}