import { useState } from 'react';
import { ChatState } from '../../context/ChatProvider';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaHeart, FaRegHeart, FaComment, FaPaperPlane } from 'react-icons/fa';

const PostItem = ({ post }) => {
    const { user } = ChatState();
    const [likes, setLikes] = useState(post.likes);
    const [comments, setComments] = useState(post.comments);
    const [commentText, setCommentText] = useState("");
    const [showComments, setShowComments] = useState(false);

    const isLiked = likes.includes(user._id);

    const handleLike = async () => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const { data } = await axios.put(`/api/posts/${post._id}/like`, {}, config);
            setLikes(data.likes);
        } catch (error) {
            toast.error("Error updating like");
        }
    };

    const handleComment = async () => {
        if (!commentText.trim()) return;
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const { data } = await axios.post(`/api/posts/${post._id}/comment`, { text: commentText }, config);
            setComments(data.comments);
            setCommentText("");
        } catch (error) {
            toast.error("Error adding comment");
        }
    };

    return (
        <div className="bg-gray-800 rounded-lg border border-gray-700 mb-4 overflow-hidden shadow-lg">
            <div className="p-4 flex items-center gap-3">
                <img
                    src={post.user.pic}
                    alt={post.user.name}
                    className="w-10 h-10 rounded-full object-cover border border-purple-500"
                />
                <div>
                    <h3 className="text-white font-bold text-sm">{post.user.name}</h3>
                    <p className="text-gray-400 text-xs">
                        {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                </div>
            </div>

            <div className="px-4 pb-2">
                {post.content && <p className="text-gray-200 mb-3">{post.content}</p>}
                {post.image && (
                    <img
                        src={post.image}
                        alt="Post Content"
                        className="w-full rounded-lg max-h-[500px] object-cover border border-gray-700"
                    />
                )}
            </div>

            <div className="p-4 border-t border-gray-700 flex items-center justify-between">
                <div className="flex gap-6">
                    <button
                        onClick={handleLike}
                        className={`flex items-center gap-2 ${isLiked ? 'text-red-500' : 'text-gray-400 hover:text-red-400'} transition-colors`}
                    >
                        {isLiked ? <FaHeart /> : <FaRegHeart />}
                        <span>{likes.length}</span>
                    </button>

                    <button
                        onClick={() => setShowComments(!showComments)}
                        className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors"
                    >
                        <FaComment />
                        <span>{comments.length}</span>
                    </button>
                </div>
            </div>

            {showComments && (
                <div className="bg-gray-900/50 p-4 border-t border-gray-700">
                    <div className="space-y-4 mb-4 max-h-60 overflow-y-auto custom-scrollbar">
                        {comments.map((comment, index) => (
                            <div key={index} className="flex gap-3">
                                <img
                                    src={comment.user.pic}
                                    alt={comment.user.name}
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                                <div className="bg-gray-800 p-2 rounded-lg rounded-tl-none flex-1">
                                    <p className="text-white text-xs font-bold mb-1">{comment.user.name}</p>
                                    <p className="text-gray-300 text-sm">{comment.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Write a comment..."
                            className="flex-1 bg-gray-800 text-white rounded-full px-4 py-2 text-sm border border-gray-600 focus:border-purple-500 focus:outline-none"
                            onKeyDown={(e) => e.key === 'Enter' && handleComment()}
                        />
                        <button
                            onClick={handleComment}
                            className="text-purple-500 hover:text-purple-400 p-2"
                        >
                            <FaPaperPlane />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostItem;
