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
                    <div className="text-xl md:text-2xl pb-3 px-2 w-full font-sans flex justify-between items-center text-white border-b border-white/10">
                        <button
                            className="md:hidden mr-2 p-2 hover:bg-white/10 rounded-full"
                            onClick={() => setSelectedChat("")}
                        >
                            <FaArrowLeft />
                        </button>

                        {!selectedChat.isGroupChat ? (
                            <>
                                {getSender(user, selectedChat.users)}
                                <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                            </>
                        ) : (
                            <>
                                {selectedChat.chatName.toUpperCase()}
                                <UpdateGroupChatModal
                                    fetchAgain={fetchAgain}
                                    setFetchAgain={setFetchAgain}
                                    fetchMessages={fetchMessages}
                                />
                            </>
                        )}
                    </div>

                    <div className="flex flex-col justify-end p-3 bg-gray-800 w-full h-full rounded-lg overflow-hidden mt-2 relative border border-gray-700">
                        {loading ? (
                            <div className="self-center m-auto w-20 h-20 rounded-full border-4 border-purple-500 border-t-transparent animate-spin"></div>
                        ) : (
                            <div className="messages flex flex-col overflow-y-scroll scrollbar-none">
                                <ScrollableChat messages={messages} />
                            </div>
                        )}

                        <div className="mt-3">
                            {isTyping ? <div className="text-xs text-gray-400 mb-1 ml-2">Typing...</div> : (<></>)}
                            <input
                                className="w-full bg-white/5 border border-white/10 text-white rounded-lg p-3 outline-none focus:border-purple-500 transition-colors"
                                placeholder="Enter a message.."
                                onChange={typingHandler}
                                value={newMessage}
                                onKeyDown={sendMessage}
                            />
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex items-center justify-center h-full">
                    <p className="text-3xl pb-3 font-sans text-gray-400">
                        Click on a user to start chatting
                    </p>
                </div>
            )}
        </div>
    )
}

export default SingleChat;
