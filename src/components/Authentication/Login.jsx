import { useState } from "react";
import axios from "../../config/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const submitHandler = async () => {
        setLoading(true);
        if (!email || !password) {
            toast.warning("Please Fill all the Fields");
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };

            const { data } = await axios.post(
                "/api/auth/login",
                { email, password },
                config
            );

            toast.success("Login Successful");
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            navigate("/chats");
        } catch (error) {
            toast.error(error.response?.data?.message || "Error Occurred");
            setLoading(false);
        }
    };

    const handleGuestLogin = async () => {
        setLoading(true);
        const guestEmail = "guest@example.com";
        const guestPass = "123456";

        setEmail(guestEmail);
        setPassword(guestPass);

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };

            const { data } = await axios.post(
                "/api/auth/login",
                { email: guestEmail, password: guestPass },
                config
            );

            toast.success("Login Successful");
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            navigate("/chats");
        } catch (error) {
            toast.error(error.response?.data?.message || "Error Occurred");
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-5">
            <div className="space-y-2">
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider ml-1">Email Address</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                    placeholder="Enter your email"
                />
            </div>
            <div className="space-y-2">
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider ml-1">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field"
                    placeholder="Enter your password"
                />
            </div>

            <div className="flex flex-col gap-3 mt-4">
                <button
                    onClick={submitHandler}
                    disabled={loading}
                    className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Loading...
                        </span>
                    ) : "Sign In"}
                </button>
                <button
                    className="w-full bg-slate-800/50 hover:bg-slate-800 text-slate-300 font-medium py-3 rounded-xl transition-all duration-300 border border-slate-700/50 hover:border-slate-600"
                    onClick={handleGuestLogin}
                >
                    Get Guest Credentials
                </button>
            </div>
        </div>
    );
};

export default Login;
