import { useEffect, useState } from 'react';
import { ChatState } from '../context/ChatProvider';
import { useNavigate } from 'react-router-dom';
import axios from "../config/api";
import { toast } from 'react-toastify';
import SideDrawer from '../components/miscellaneous/SideDrawer';
import CreatePost from '../components/Social/CreatePost';
import PostItem from '../components/Social/PostItem';

const SocialPage = () => {
    const { user } = ChatState();
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get("/api/posts", config);
            setPosts(data);
            setLoading(false);
        } catch (error) {
            toast.error("Failed to Load Posts");
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user) {
            navigate("/");
            return;
        }
        fetchPosts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, navigate]);

    return (
        <div style={{ width: "100%" }} className="bg-slate-900 min-h-screen">
            {user && <SideDrawer />}
            <div className="flex justify-center p-4 min-h-[92vh]">
                <div className="w-full max-w-2xl flex flex-col gap-6">
                    <CreatePost fetchPosts={fetchPosts} />

                    {loading ? (
                        <div className="flex justify-center mt-10">
                            <div className="relative w-16 h-16">
                                <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-slate-700"></div>
                                <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6 pb-10">
                            {posts.map((post) => (
                                <PostItem key={post._id} post={post} />
                            ))}
                            {posts.length === 0 && (
                                <div className="text-center text-slate-500 mt-10 flex flex-col items-center gap-4">
                                    <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center text-4xl grayscale">
                                        📰
                                    </div>
                                    <p className="text-lg font-medium">No posts yet. Be the first to share something!</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SocialPage;
