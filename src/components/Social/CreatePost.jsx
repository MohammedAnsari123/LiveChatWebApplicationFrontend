import { useState } from 'react';
import { ChatState } from '../../context/ChatProvider';
import { toast } from 'react-toastify';
import axios from "../../config/api";
import { FaImage, FaPaperPlane } from 'react-icons/fa';

const CreatePost = ({ fetchPosts }) => {
    const { user } = ChatState();
    const [content, setContent] = useState("");
    const [image, setImage] = useState("");
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const uploadImage = (pics) => {
        setUploading(true);
        if (pics === undefined) {
            setUploading(false);
            return;
        }

        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData();
            data.append("file", pics);

            axios.post("/api/upload", data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
                .then(({ data }) => {
                    setImage(data.url.toString());
                    setUploading(false);
                    toast.success("Image Uploaded");
                })
                .catch((err) => {
                    console.error(err);
                    setUploading(false);
                    toast.error("Image Upload Failed");
                });
        } else {
            toast.warning("Please Select an Image (jpeg/png)");
            setUploading(false);
        }
    };

    const submitHandler = async () => {
        if (!content && !image) {
            toast.warning("Please add content or an image");
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            await axios.post("/api/posts", {
                content,
                image
            }, config);

            setContent("");
            setImage("");
            setLoading(false);
            fetchPosts();
            toast.success("Post Created!");
        } catch (error) {
            toast.error("Failed to create post");
            setLoading(false);
        }
    };

    return (
        <div className="glass p-6 rounded-2xl border border-white/5 mb-2 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary opactiy-50"></div>
            <div className="flex gap-4">
                <div className="flex-shrink-0">
                    <img
                        src={user?.pic}
                        alt={user?.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-slate-700 ring-2 ring-transparent group-hover:ring-primary/30 transition-all"
                    />
                </div>
                <div className="flex-1 flex flex-col gap-3">
                    <textarea
                        className="w-full bg-slate-900/50 text-slate-100 rounded-xl p-4 border border-slate-700/50 focus:border-primary/50 focus:bg-slate-900 focus:shadow-lg focus:shadow-primary/5 outline-none resize-none transition-all placeholder:text-slate-500 min-h-[100px]"
                        placeholder="What's on your mind?"
                        rows="3"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />

                    {image && (
                        <div className="mt-2 relative w-full rounded-xl overflow-hidden group/image border border-white/10">
                            <img src={image} alt="Preview" className="w-full h-64 object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    onClick={() => setImage("")}
                                    className="bg-red-500/80 hover:bg-red-600 text-white rounded-full p-2 backdrop-blur-sm transition-transform hover:scale-110"
                                >
                                    <span className="sr-only">Remove</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between items-center mt-2 pt-3 border-t border-white/5">
                        <label className="flex items-center gap-2 text-slate-400 hover:text-primary cursor-pointer transition-all px-3 py-2 rounded-lg hover:bg-primary/5 group/btn">
                            <div className="p-2 bg-slate-800 rounded-full text-primary group-hover/btn:bg-primary group-hover/btn:text-white transition-colors">
                                <FaImage size={16} />
                            </div>
                            <span className="text-sm font-medium">Add Photo</span>
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => uploadImage(e.target.files[0])}
                                disabled={uploading}
                            />
                        </label>

                        <button
                            onClick={submitHandler}
                            disabled={loading || uploading}
                            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5"
                        >
                            {loading || uploading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span className="text-sm">Posting...</span>
                                </span>
                            ) : (
                                <>
                                    <span className="hidden sm:inline">Post</span>
                                    <FaPaperPlane className="text-sm" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreatePost;
