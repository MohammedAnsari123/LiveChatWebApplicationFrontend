import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "../config/api";
import { toast } from 'react-toastify';
import { ChatState } from '../context/ChatProvider';
import { FaArrowLeft, FaCamera } from 'react-icons/fa';

const ProfilePage = () => {
    const { user, setUser } = ChatState();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [pic, setPic] = useState();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setPic(user.pic);
        } else {
            navigate("/");
        }
    }, [user, navigate]);

    const uploadImage = (pics) => {
        setLoading(true);
        if (pics === undefined) {
            toast.warning("Please Select an Image!");
            setLoading(false);
            return;
        }

        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData();
            data.append("file", pics);
            // We'll rely on server upload route which has cloudinary configured internally now
            // Or if previous implementation was direct, we changed it to server. 
            // In the previous steps we corrected this to use axios.post('/api/upload')
            // So I will implement that pattern here.

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            };

            axios.post("/api/upload", data, config)
                .then(({ data }) => {
                    setPic(data.url.toString());
                    setLoading(false);
                    toast.success("Image Uploaded Successfully");
                })
                .catch((err) => {
                    console.error(err);
                    toast.error("Image upload failed");
                    setLoading(false);
                });
        } else {
            toast.warning("Please Select an Image (jpeg/png)");
            setLoading(false);
        }
    };

    const submitHandler = async () => {
        if (password && password !== confirmPassword) {
            toast.error("Passwords Do Not Match");
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.put("/api/auth/profile", {
                name,
                email,
                pic,
                password
            }, config);

            toast.success("Profile Updated Successfully");
            setUser(data);
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
        } catch (error) {
            toast.error("Error Occured!");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center pt-8 px-4 pb-10">
            <div className="w-full max-w-2xl">
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => navigate("/chats")}
                        className="text-slate-400 hover:text-white mr-4 p-2 hover:bg-slate-800 rounded-full transition-all"
                    >
                        <FaArrowLeft size={20} />
                    </button>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent">Edit Profile</h1>
                </div>

                <div className="glass rounded-2xl border border-white/5 p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                    <div className="flex flex-col items-center mb-10 relative z-10">
                        <div className="relative group cursor-pointer">
                            <div className="w-36 h-36 rounded-full p-1 bg-gradient-to-tr from-primary to-secondary shadow-lg shadow-primary/20">
                                <img
                                    src={pic}
                                    alt={name}
                                    className="w-full h-full rounded-full object-cover border-4 border-slate-900"
                                />
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm m-1">
                                <label htmlFor="pic-upload" className="cursor-pointer flex flex-col items-center text-white gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                    <FaCamera className="text-3xl" />
                                    <span className="text-xs font-medium">Change Photo</span>
                                </label>
                                <input
                                    id="pic-upload"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => uploadImage(e.target.files[0])}
                                />
                            </div>
                            {loading && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-full m-1">
                                    <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>
                        <p className="text-slate-400 mt-4 text-sm font-medium">{name}</p>
                        <p className="text-slate-500 text-xs">{email}</p>
                    </div>

                    <div className="space-y-6 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-slate-300 mb-2 block text-sm font-medium ml-1">Full Name</label>
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="input-field bg-slate-900/50 focus:bg-slate-900"
                                    placeholder="Enter your name"
                                />
                            </div>

                            <div>
                                <label className="text-slate-300 mb-2 block text-sm font-medium ml-1">Email Address</label>
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-field bg-slate-900/50 focus:bg-slate-900"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/5">
                            <h3 className="text-slate-200 font-semibold mb-4">Change Password</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-slate-300 mb-2 block text-sm font-medium ml-1">New Password</label>
                                    <input
                                        type="password"
                                        placeholder="Leave blank to keep current"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="input-field bg-slate-900/50 focus:bg-slate-900"
                                    />
                                </div>

                                {password && (
                                    <div className="animate-in slide-in-from-left-2 fade-in duration-300">
                                        <label className="text-slate-300 mb-2 block text-sm font-medium ml-1">Confirm New Password</label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="input-field bg-slate-900/50 focus:bg-slate-900"
                                            placeholder="Retype new password"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            onClick={submitHandler}
                            disabled={loading}
                            className="btn-primary w-full py-3.5 mt-4 text-base tracking-wide flex justify-center items-center shadow-lg shadow-primary/20"
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Updating Profile...</span>
                                </div>
                            ) : "Save Changes"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
