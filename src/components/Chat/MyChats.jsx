import { useState, useEffect } from 'react';
import { ChatState } from '../../context/ChatProvider';
import { toast } from 'react-toastify';
import axios from "../../config/api";
import { FaPlus } from 'react-icons/fa';
import GroupChatModal from '../miscellaneous/GroupChatModal';
import { getSender } from '../../config/ChatLogics';

const MyChats = ({ fetchAgain }) => {
    const [loggedUser, setLoggedUser] = useState();
    const [activeTab, setActiveTab] = useState('single'); // 'single' or 'group'
    const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

    const fetchChats = async () => {
        if (!user) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get("/api/chat", config);
            setChats(data);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                localStorage.removeItem("userInfo");
                window.location.href = "/";
            }
            toast.error("Failed to Load the chats");
        }
    };

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
        fetchChats();
    }, [fetchAgain, user]);

    // Filter chats based on active tab
    const filteredChats = chats ? chats.filter(chat => {
        if (activeTab === 'single') return !chat.isGroupChat;
        if (activeTab === 'group') return chat.isGroupChat;
        return true;
    }) : [];

    return (
        <div className={`
             ${selectedChat ? "hidden" : "flex"}
             md:flex flex-col items-center p-3
             bg-gray-800 w-full md:w-1/3 rounded-lg border border-gray-700 h-[85vh]
        `}>
            <div className="pb-3 px-3 w-full flex flex-col gap-3">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl text-white font-semibold">My Chats</h2>
                    {activeTab === 'group' && (
                        <GroupChatModal>
                            <button className="flex items-center gap-2 bg-purple-600/20 hover:bg-purple-600/40 text-purple-200 px-3 py-2 rounded-md transition-all text-sm border border-purple-500/30">
                                New Group <FaPlus />
                            </button>
                        </GroupChatModal>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex w-full bg-gray-900 rounded-lg p-1">
                    <button
                        onClick={() => setActiveTab('single')}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all
                            ${activeTab === 'single' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'}
                        `}
                    >
                        Single Chat
                    </button>
                    <button
                        onClick={() => setActiveTab('group')}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all
                            ${activeTab === 'group' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-700'}
                        `}
                    >
                        Group Chat
                    </button>
                </div>
            </div>

            <div className="flex flex-col w-full h-full overflow-y-hidden bg-gray-900/50 rounded-lg p-2">
                {chats ? (
                    <div className="overflow-y-auto space-y-2 h-full scrollbar-none">
                        {filteredChats.map((chat) => (
                            <div
                                key={chat._id}
                                onClick={() => setSelectedChat(chat)}
                                className={`cursor-pointer px-4 py-3 rounded-lg transition-all ${selectedChat === chat ? 'bg-purple-600 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                            >
                                <h3 className="font-medium">
                                    {!chat.isGroupChat
                                        ? getSender(loggedUser, chat.users)
                                        : chat.chatName}
                                </h3>
                                {chat.latestMessage && (
                                    <p className="text-xs opacity-70 mt-1 truncate">
                                        <b>{chat.latestMessage.sender.name}: </b>
                                        {chat.latestMessage.content.length > 50
                                            ? chat.latestMessage.content.substring(0, 51) + "..."
                                            : chat.latestMessage.content}
                                    </p>
                                )}
                            </div>
                        ))}
                        {filteredChats.length === 0 && (
                            <div className="text-center text-gray-500 mt-4 text-sm">
                                No {activeTab} chats found.
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex justify-center items-center h-full text-gray-400">Loading Chats...</div>
                )}
            </div>
        </div>
    )
}

export default MyChats;
