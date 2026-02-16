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
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="bg-slate-800/30 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
                {/* Left Side - Visual */}
                <div className="relative w-full md:w-1/2 bg-gradient-to-br from-primary/20 via-slate-900 to-secondary/20 p-12 flex flex-col justify-center items-center text-center overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="z-10 animate-fade-in">
                        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-lg">
                            Modern Chat
                        </h1>
                        <p className="text-slate-300 text-lg leading-relaxed max-w-sm">
                            Connect continuously with your friends and family in a secure, real-time environment.
                        </p>
                    </div>
                    {/* decorative circles */}
                    <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/30 rounded-full blur-3xl animate-float delay-1000"></div>
                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-secondary/30 rounded-full blur-3xl animate-float delay-2000"></div>
                </div>

                {/* Right Side - Auth Form */}
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-slate-900/50">
                    <div className="mb-8 flex justify-center bg-slate-900/50 p-1 rounded-xl w-fit mx-auto border border-slate-700/50">
                        <button
                            className={`px-8 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${isLogin
                                    ? 'bg-slate-700 text-white shadow-lg shadow-black/20'
                                    : 'text-slate-400 hover:text-white'
                                }`}
                            onClick={() => setIsLogin(true)}
                        >
                            Login
                        </button>
                        <button
                            className={`px-8 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${!isLogin
                                    ? 'bg-slate-700 text-white shadow-lg shadow-black/20'
                                    : 'text-slate-400 hover:text-white'
                                }`}
                            onClick={() => setIsLogin(false)}
                        >
                            Sign Up
                        </button>
                    </div>

                    <div className="animate-slide-up">
                        {isLogin ? <Login /> : <Signup />}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
