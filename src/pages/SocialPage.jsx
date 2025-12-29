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
        <div style={{ width: "100%" }}>
            {user && <SideDrawer />}
            <div className="flex justify-center p-4 bg-gray-900 min-h-[92vh]">
                <div className="w-full max-w-2xl">
                    <CreatePost fetchPosts={fetchPosts} />

                    {loading ? (
                        <div className="flex justify-center mt-10">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {posts.map((post) => (
                                <PostItem key={post._id} post={post} />
                            ))}
                            {posts.length === 0 && (
                                <div className="text-center text-gray-500 mt-10">
                                    No posts yet. Be the first to share something!
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
