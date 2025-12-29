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
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 mb-6 shadow-lg">
            <div className="flex gap-4">
                <img
                    src={user?.pic}
                    alt={user?.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-purple-500"
                />
                <div className="flex-1">
                    <textarea
                        className="w-full bg-gray-900 text-white rounded-lg p-3 border border-gray-700 focus:border-purple-500 focus:outline-none resize-none"
                        placeholder="What's on your mind?"
                        rows="3"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />

                    {image && (
                        <div className="mt-2 relative w-fit">
                            <img src={image} alt="Preview" className="h-32 rounded-lg object-cover" />
                            <button
                                onClick={() => setImage("")}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                            >
                                X
                            </button>
                        </div>
                    )}

                    <div className="flex justify-between items-center mt-3">
                        <label className="flex items-center gap-2 text-gray-400 hover:text-purple-400 cursor-pointer transition-colors">
                            <FaImage size={20} />
                            <span className="text-sm">Add Photo</span>
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
                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-all disabled:opacity-50"
                        >
                            {loading || uploading ? "Posting..." : (
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
