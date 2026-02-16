import { useState, useEffect } from 'react';
import { ChatState } from '../../context/ChatProvider';
import { toast } from 'react-toastify';
import axios from "../../config/api";
import { getSender, getSenderFull } from '../../config/ChatLogics';
import ProfileModal from '../miscellaneous/ProfileModal';
import UpdateGroupChatModal from '../miscellaneous/UpdateGroupChatModal';
import ScrollableChat from './ScrollableChat';
import { FaArrowLeft } from 'react-icons/fa';
import io from 'socket.io-client';

const ENDPOINT = import.meta.env.VITE_BACKEND_URL;
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState();

    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            setLoading(true);

            const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);

            setMessages(data);
            setLoading(false);

            socket.emit("join chat", selectedChat._id);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                localStorage.removeItem("userInfo");
                window.location.href = "/";
            }
            toast.error("Failed to Load the Messages");
            setLoading(false);
        }
    };

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            socket.emit("stop typing", selectedChat._id);
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };

                setNewMessage("");
                const { data } = await axios.post("/api/message", {
                    content: newMessage,
                    chatId: selectedChat._id,
                }, config);

                socket.emit("new message", data);
                setMessages([...messages, data]);
            } catch (error) {
                toast.error("Failed to send the Message");
            }
        }
    };

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
    }, []);

    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat]);

    useEffect(() => {
        socket.on("message received", (newMessageRecieved) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
                if (!notification.includes(newMessageRecieved)) {
                    setNotification([newMessageRecieved, ...notification]);
                    setFetchAgain(!fetchAgain); // Refresh chat list order
                }
            } else {
                setMessages([...messages, newMessageRecieved]);
            }
        });
    });

    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }

        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    }

    return (
        <div className="flex flex-col h-full w-full">
            {selectedChat ? (
                <>
                    {/* Chat Header */}
                    <div className="h-20 px-6 w-full flex justify-between items-center border-b border-white/5 bg-slate-800/20 backdrop-blur-sm">
                        <div className="flex items-center gap-4">
                            <button
                                className="md:hidden p-2 hover:bg-white/10 rounded-full transition-colors text-slate-300"
                                onClick={() => setSelectedChat("")}
                            >
                                <FaArrowLeft />
                            </button>

                            <div className="flex flex-col">
                                <h2 className="text-xl font-bold text-slate-100 uppercase tracking-wide">
                                    {!selectedChat.isGroupChat ? getSender(user, selectedChat.users) : selectedChat.chatName}
                                </h2>
                                <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Online
                                </span>
                            </div>
                        </div>

                        {!selectedChat.isGroupChat ? (
                            <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                        ) : (
                            <UpdateGroupChatModal
                                fetchAgain={fetchAgain}
                                setFetchAgain={setFetchAgain}
                                fetchMessages={fetchMessages}
                            />
                        )}
                    </div>

                    {/* Chat Messages Area */}
                    <div className="flex-1 w-full overflow-hidden relative bg-slate-900/40">
                        {/* Optional watermark/pattern */}
                        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                        {loading ? (
                            <div className="w-full h-full flex items-center justify-center">
                                <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                            </div>
                        ) : (
                            <div className="w-full h-full p-6 overflow-y-scroll custom-scrollbar flex flex-col gap-4">
                                <ScrollableChat messages={messages} />
                            </div>
                        )}
                    </div>

                    {/* Chat Input Area */}
                    <div className="p-4 bg-slate-800/30 border-t border-white/5 backdrop-blur-md">
                        {isTyping && (
                            <div className="mb-2 ml-4 flex items-center gap-2">
                                <div className="flex gap-1">
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                                </div>
                                <span className="text-xs text-slate-400 font-medium">Typing...</span>
                            </div>
                        )}
                        <input
                            className="input-field bg-slate-900/80 border-slate-700/50 focus:bg-slate-900 focus:shadow-lg focus:shadow-primary/10"
                            placeholder="Type a message..."
                            onChange={typingHandler}
                            value={newMessage}
                            onKeyDown={sendMessage}
                        />
                    </div>
                </>
            ) : (
                <div className="flex items-center justify-center h-full flex-col gap-6 text-center p-8 opacity-50">
                    <div className="w-32 h-32 bg-slate-800/50 rounded-full flex items-center justify-center">
                        <span className="text-6xl grayscale">👋</span>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-slate-200 mb-2">Welcome Back!</h2>
                        <p className="text-slate-400 text-lg">Select a chat to start messaging</p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SingleChat;
