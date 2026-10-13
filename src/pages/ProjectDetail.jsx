import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getProject, updateProject, deleteProject, listProjectMembers } from "../api/projects";
import { inviteUser } from "../api/invitations";
import TaskBoard from "../components/TaskBoard";
import toast from "react-hot-toast";

export default function ProjectDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteMessage, setInviteMessage] = useState("");

    useEffect(() => {
        load();
    }, [id]);

    async function load() {
        try {
            const [proj, mems] = await Promise.all([
                getProject(id),
                listProjectMembers(id),
            ]);
            setProject(proj);
            setMembers(mems);
            setName(proj.name);
            setDescription(proj.description || "");

        } catch (err) {
            setError(err.response?.data?.message || "Failed to load project");
        } finally {
            setLoading(false);
        }
    }

    async function handleUpdate(e) {
        e.preventDefault();
        setError("");
        try {
            const updated = await updateProject(id, name, description);
            setProject(updated);
            setEditing(false);
            toast.success("Project Successfully Updated")
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update");
        }
    }

    async function handleDelete() {
        if (!confirm("Delete this project?")) return;
        await deleteProject(id);
        navigate("/dashboard");
        toast.success("Project Successfully Deleted")
    }

    async function handleInvite(e) {
        e.preventDefault();
        setInviteMessage("");
        setError("");
        try {
            const created = await inviteUser(id, inviteEmail);
            setInviteMessage(`Invitation sent to ${created.inviteeEmail}`);
            setInviteEmail("");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to send invitation");
        }
    }

    if (loading) return <div className="p-8">Loading...</div>;
    if (error && !project) return <div className="p-8 text-red-600">{error}</div>;

    const isOwner = project.currentUserRole === "OWNER";
    const canEdit = isOwner || project.currentUserRole === "EDITOR";

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white border-b px-6 py-4">
                <Link to="/dashboard" className="text-blue-600 hover:underline text-sm">
                    ← Back to projects
                </Link>
            </header>

            <main className="max-w-3xl mx-auto p-8 space-y-6">
                {error && (
                    <div className="bg-red-100 text-red-700 p-3 rounded text-sm">{error}</div>
                )}

                {/* Project info card */}
                {editing ? (
                    <form onSubmit={handleUpdate} className="bg-white p-6 rounded shadow">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full border rounded px-3 py-2 mb-3 text-lg font-semibold"
                            required
                        />
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full border rounded px-3 py-2 mb-4"
                            rows={4}
                        />
                        <div className="flex gap-2">
                            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                Save
                            </button>
                            <button type="button" onClick={() => setEditing(false)} className="px-4 py-2 rounded border">
                                Cancel
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="bg-white p-6 rounded shadow">
                        <div className="flex justify-between items-start mb-4">
                            <h1 className="text-2xl font-bold">{project.name}</h1>
                            {canEdit && (
                                <div className="flex gap-3">
                                    <button onClick={() => setEditing(true)} className="text-sm text-blue-600 hover:underline">
                                        Edit
                                    </button>
                                    {isOwner && (
                                        <button onClick={handleDelete} className="text-sm text-red-600 hover:underline">
                                            Delete
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                        {project.description && (
                            <p className="text-gray-700 whitespace-pre-wrap">{project.description}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-6">
                            Created {new Date(project.createdAt).toLocaleString()} · Your role: {project.currentUserRole}
                        </p>
                    </div>
                )}

                {/* Members card */}
                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-lg font-semibold mb-4">Members ({members.length})</h2>
                    <ul className="divide-y">
                        {members.map((m) => (
                            <li key={m.userId} className="py-3 flex justify-between items-center">
                                <div>
                                    <p className="font-medium">{m.displayName}</p>
                                    <p className="text-sm text-gray-500">{m.email}</p>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded ${
                                    m.role === "OWNER" ? "bg-blue-100 text-blue-700" :
                                        m.role === "EDITOR" ? "bg-green-100 text-green-700" :
                                            "bg-gray-100 text-gray-600"
                                }`}>
                  {m.role}
                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Invite form — owners only */}
                {isOwner && (
                    <div className="bg-white p-6 rounded shadow">
                        <h2 className="text-lg font-semibold mb-4">Invite a teammate</h2>
                        <form onSubmit={handleInvite} className="flex gap-2">
                            <input
                                type="email"
                                placeholder="teammate@example.com"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                className="flex-1 border rounded px-3 py-2"
                                required
                            />
                            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                                Send Invite
                            </button>
                        </form>
                        {inviteMessage && (
                            <p className="text-sm text-green-700 mt-3">{inviteMessage}</p>
                        )}
                    </div>
                )}
                <TaskBoard projectId={Number(id)} members={members} canEdit={canEdit} />
            </main>
        </div>
    );
}