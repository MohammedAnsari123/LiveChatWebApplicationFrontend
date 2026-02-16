import { useState } from 'react';
import { ChatState } from '../../context/ChatProvider';
import axios from "../../config/api";
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
        <div className="glass rounded-2xl border border-white/5 mb-6 overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
            {/* Header */}
            <div className="p-5 flex items-center gap-4 border-b border-white/5 bg-slate-800/20 backdrop-blur-sm">
                <img
                    src={post.user.pic}
                    alt={post.user.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-slate-700 ring-2 ring-transparent group-hover:ring-primary/30 transition-all"
                />
                <div>
                    <h3 className="text-slate-100 font-bold text-base hover:text-primary transition-colors cursor-pointer">{post.user.name}</h3>
                    <p className="text-slate-500 text-xs mt-0.5 flex items-center gap-1">
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>{new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="px-0 py-2">
                {post.content && (
                    <div className="px-5 py-2 mb-2">
                        <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">{post.content}</p>
                    </div>
                )}
                {post.image && (
                    <div className="w-full bg-black/20">
                        <img
                            src={post.image}
                            alt="Post Content"
                            className="w-full max-h-[600px] object-contain"
                        />
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="px-5 py-3 border-t border-white/5 flex items-center justify-between bg-slate-800/10">
                <div className="flex gap-6">
                    <button
                        onClick={handleLike}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 group
                            ${isLiked ? 'text-rose-500 bg-rose-500/10' : 'text-slate-400 hover:text-rose-400 hover:bg-rose-500/10'}
                        `}
                    >
                        {isLiked ? <FaHeart className="text-lg drop-shadow-sm" /> : <FaRegHeart className="text-lg group-hover:scale-110 transition-transform" />}
                        <span className="font-semibold text-sm">{likes.length}</span>
                    </button>

                    <button
                        onClick={() => setShowComments(!showComments)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 group
                             ${showComments ? 'text-primary bg-primary/10' : 'text-slate-400 hover:text-primary hover:bg-primary/10'}
                        `}
                    >
                        <FaComment className="text-lg group-hover:scale-110 transition-transform" />
                        <span className="font-semibold text-sm">{comments.length}</span>
                    </button>
                </div>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="bg-slate-900/50 p-5 border-t border-white/5 animate-in slide-in-from-top-2 duration-200">
                    <div className="space-y-4 mb-5 max-h-80 overflow-y-auto custom-scrollbar pr-2">
                        {comments.length === 0 ? (
                            <p className="text-center text-slate-500 text-sm py-4">No comments yet. Be the first!</p>
                        ) : comments.map((comment, index) => (
                            <div key={index} className="flex gap-3 group">
                                <img
                                    src={comment.user.pic}
                                    alt={comment.user.name}
                                    className="w-8 h-8 rounded-full object-cover mt-1 border border-slate-700"
                                />
                                <div className="bg-slate-800/80 p-3 rounded-2xl rounded-tl-none flex-1 border border-white/5 group-hover:border-white/10 transition-colors">
                                    <div className="flex justify-between items-start">
                                        <p className="text-slate-200 text-xs font-bold mb-1">{comment.user.name}</p>
                                        <span className="text-[10px] text-slate-600">Just now</span>
                                    </div>
                                    <p className="text-slate-300 text-sm leading-snug">{comment.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-3 items-center">
                        <img src={user.pic} alt="Me" className="w-8 h-8 rounded-full object-cover border border-slate-700" />
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Write a comment..."
                                className="w-full bg-slate-800 text-slate-200 rounded-full pl-5 pr-12 py-2.5 text-sm border border-slate-700 focus:border-primary focus:bg-slate-800/80 focus:shadow-lg focus:shadow-primary/5 outline-none transition-all"
                                onKeyDown={(e) => e.key === 'Enter' && handleComment()}
                            />
                            <button
                                onClick={handleComment}
                                disabled={!commentText.trim()}
                                className="absolute right-1.5 top-1.5 bg-primary hover:bg-primary/90 text-white p-1.5 rounded-full transition-all disabled:opacity-0 disabled:scale-75"
                            >
                                <FaPaperPlane className="text-xs" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostItem;
