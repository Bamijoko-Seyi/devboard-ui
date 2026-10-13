import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/auth";
import toast from "react-hot-toast";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        try {
            await register(email, password, displayName);
            navigate("/login");
            toast.success("Account Successfully Registered!")
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-full max-w-sm">
                <h1 className="text-2xl font-bold mb-6">Create account</h1>

                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

                <input
                    type="text"
                    placeholder="Display name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full border rounded px-3 py-2 mb-3"
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border rounded px-3 py-2 mb-3"
                    required
                />
                <input
                    type="password"
                    placeholder="Password (min 8 chars)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border rounded px-3 py-2 mb-4"
                    required
                    minLength={8}
                />

                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                    Register
                </button>

                <p className="text-sm text-center mt-4">
                    Have an account? <Link to="/login" className="text-blue-600">Sign in</Link>
                </p>
            </form>
        </div>
    );
}