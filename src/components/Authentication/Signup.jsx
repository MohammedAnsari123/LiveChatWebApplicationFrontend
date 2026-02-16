import { useState } from "react";
import axios from "../../config/api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmpassword, setConfirmpassword] = useState("");
    const [pic, setPic] = useState();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const submitHandler = async () => {
        setLoading(true);
        if (!name || !email || !password || !confirmpassword) {
            toast.warning("Please Fill all the Fields");
            setLoading(false);
            return;
        }
        if (password !== confirmpassword) {
            toast.warning("Passwords Do Not Match");
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
                "/api/auth",
                { name, email, password, pic },
                config
            );

            toast.success("Registration Successful");
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
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider ml-1">Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field"
                    placeholder="Enter your name"
                />
            </div>
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
                    placeholder="Create a password"
                />
            </div>
            <div className="space-y-2">
                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider ml-1">Confirm Password</label>
                <input
                    type="password"
                    value={confirmpassword}
                    onChange={(e) => setConfirmpassword(e.target.value)}
                    className="input-field"
                    placeholder="Confirm your password"
                />
            </div>

            <button
                onClick={submitHandler}
                disabled={loading}
                className="btn-primary w-full mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Loading...
                    </span>
                ) : "Create Account"}
            </button>
        </div>
    );
};

export default Signup;
