import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import { useState } from "react";

const HomePage = () => {
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"));
        if (user) navigate("/chats");
    }, [navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900">
            <div className="w-full max-w-md p-8 rounded-2xl shadow-xl bg-gray-800 border border-gray-700">
                <h1 className="text-4xl font-bold text-center text-white mb-8">
                    Modern Chat
                </h1>

                <div className="flex mb-6 bg-gray-700 rounded-lg p-1">
                    <button
                        className={`flex-1 py-2 rounded-md transition-all ${isLogin ? 'bg-purple-600 shadow-lg' : 'hover:bg-white/5'}`}
                        onClick={() => setIsLogin(true)}
                    >
                        Login
                    </button>
                    <button
                        className={`flex-1 py-2 rounded-md transition-all ${!isLogin ? 'bg-purple-600 shadow-lg' : 'hover:bg-white/5'}`}
                        onClick={() => setIsLogin(false)}
                    >
                        Sign Up
                    </button>
                </div>

                {isLogin ? <Login /> : <Signup />}
            </div>
        </div>
    );
};

export default HomePage;
