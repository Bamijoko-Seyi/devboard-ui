import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listMyPendingInvitations, acceptInvitation, declineInvitation } from "../api/invitations";
import toast from "react-hot-toast";

export default function Invitations() {
    const [invitations, setInvitations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        load();
    }, []);

    async function load() {
        try {
            const data = await listMyPendingInvitations();
            setInvitations(data);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load invitations");
        } finally {
            setLoading(false);
        }
    }

    async function handleAccept(id) {
        await acceptInvitation(id);
        setInvitations(invitations.filter((i) => i.id !== id));
        toast.success("Invitation Successfully Accepted!");
    }

    async function handleDecline(id) {
        await declineInvitation(id);
        setInvitations(invitations.filter((i) => i.id !== id));
        toast.success("Invitation Successfully Declined!");
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white border-b px-6 py-4">
                <Link to="/dashboard" className="text-blue-600 hover:underline text-sm">
                    ← Back to projects
                </Link>
            </header>

            <main className="max-w-3xl mx-auto p-8">
                <h1 className="text-2xl font-bold mb-6">Pending Invitations</h1>

                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

                {loading ? (
                    <p className="text-gray-500">Loading...</p>
                ) : invitations.length === 0 ? (
                    <div className="bg-white p-8 rounded shadow text-center text-gray-500">
                        No pending invitations.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {invitations.map((inv) => (
                            <div key={inv.id} className="bg-white p-5 rounded shadow flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{inv.projectName}</p>
                                    <p className="text-sm text-gray-600">
                                        Invited by {inv.inviterDisplayName}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {new Date(inv.createdAt).toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleAccept(inv.id)}
                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => handleDecline(inv.id)}
                                        className="px-4 py-2 rounded border text-sm"
                                    >
                                        Decline
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}