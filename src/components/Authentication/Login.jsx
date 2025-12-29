import { useState } from "react";
import axios from "axios";
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
            toast.warning("Please Fill all the Feilds");
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
            toast.error(error.response?.data?.message || "Error Occured");
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col">
                <label className="text-gray-300 text-sm mb-1">Email</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-black/20 border border-gray-600 rounded p-2 text-white focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="Enter your email"
                />
            </div>
            <div className="flex flex-col">
                <label className="text-gray-300 text-sm mb-1">Password</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-black/20 border border-gray-600 rounded p-2 text-white focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="Enter your password"
                />
            </div>
            <button
                onClick={submitHandler}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded transition-all mt-4 disabled:opacity-50"
            >
                {loading ? "Loading..." : "Login"}
            </button>
            <button
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 rounded transition-all"
                onClick={() => {
                    setEmail("guest@example.com");
                    setPassword("123456");
                }}
            >
                Get Guest Credentials
            </button>
        </div>
    );
};

export default Login;
