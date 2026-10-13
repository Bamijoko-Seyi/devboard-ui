import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        try {
            await login(email, password);
            toast.success("Successfully Logged In!");
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-full max-w-sm">
                <h1 className="text-2xl font-bold mb-6">Sign in to DevBoard</h1>

                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-sm">{error}</div>}

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
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border rounded px-3 py-2 mb-4"
                    required
                />

                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                    Sign In
                </button>

                <p className="text-sm text-center mt-4">
                    No account? <Link to="/register" className="text-blue-600">Register</Link>
                </p>
            </form>
        </div>
    );
}