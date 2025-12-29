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
        <div className="min-h-screen bg-gray-900 flex flex-col items-center pt-10 px-4">
            <div className="w-full max-w-2xl bg-gray-800 rounded-lg border border-gray-700 p-8 shadow-xl">
                <div className="flex items-center mb-8">
                    <button onClick={() => navigate("/chats")} className="text-gray-400 hover:text-white mr-4">
                        <FaArrowLeft size={24} />
                    </button>
                    <h1 className="text-3xl font-bold text-white">Edit Profile</h1>
                </div>

                <div className="flex flex-col items-center mb-8">
                    <div className="relative group cursor-pointer">
                        <img
                            src={pic}
                            alt={name}
                            className="w-32 h-32 rounded-full object-cover border-4 border-purple-600"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            <label htmlFor="pic-upload" className="cursor-pointer">
                                <FaCamera className="text-white text-2xl" />
                            </label>
                            <input
                                id="pic-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => uploadImage(e.target.files[0])}
                            />
                        </div>
                    </div>
                    <p className="text-gray-400 mt-2 text-sm">Click to change avatar</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-white mb-2 block">Name</label>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-black/20 border border-gray-600 rounded px-4 py-2 text-white outline-none focus:border-purple-500"
                        />
                    </div>

                    <div>
                        <label className="text-white mb-2 block">Email</label>
                        <input
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-black/20 border border-gray-600 rounded px-4 py-2 text-white outline-none focus:border-purple-500"
                        />
                    </div>

                    <div>
                        <label className="text-white mb-2 block">New Password (Optional)</label>
                        <input
                            type="password"
                            placeholder="Leave blank to keep current"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black/20 border border-gray-600 rounded px-4 py-2 text-white outline-none focus:border-purple-500"
                        />
                    </div>

                    {password && (
                        <div>
                            <label className="text-white mb-2 block">Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-black/20 border border-gray-600 rounded px-4 py-2 text-white outline-none focus:border-purple-500"
                            />
                        </div>
                    )}

                    <button
                        onClick={submitHandler}
                        disabled={loading}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded mt-6 transition-colors disabled:opacity-50"
                    >
                        {loading ? "Updating..." : "Update Profile"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
