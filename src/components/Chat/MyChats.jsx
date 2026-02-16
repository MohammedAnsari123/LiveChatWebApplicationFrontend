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
             md:flex flex-col p-4
             glass w-full md:w-1/3 rounded-2xl border border-white/5 h-full
        `}>
            <div className="pb-4 px-2 w-full flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl text-slate-100 font-bold tracking-tight">Chats</h2>
                    {activeTab === 'group' && (
                        <GroupChatModal>
                            <button className="flex items-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-4 py-2 rounded-xl transition-all text-sm font-medium">
                                <FaPlus /> New Group
                            </button>
                        </GroupChatModal>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex w-full bg-slate-900/50 rounded-xl p-1.5 border border-white/5">
                    <button
                        onClick={() => setActiveTab('single')}
                        className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-300
                            ${activeTab === 'single' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}
                        `}
                    >
                        Direct Messages
                    </button>
                    <button
                        onClick={() => setActiveTab('group')}
                        className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-300
                            ${activeTab === 'group' ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}
                        `}
                    >
                        Groups
                    </button>
                </div>
            </div>

            <div className="flex flex-col w-full h-full overflow-hidden">
                {chats ? (
                    <div className="overflow-y-auto space-y-2 h-full pr-2 custom-scrollbar">
                        {filteredChats.map((chat) => (
                            <div
                                key={chat._id}
                                onClick={() => setSelectedChat(chat)}
                                className={`cursor-pointer px-5 py-4 rounded-xl transition-all duration-300 border border-transparent
                                    ${selectedChat === chat
                                        ? 'bg-primary/10 border-primary/20 shadow-lg shadow-primary/5'
                                        : 'hover:bg-slate-800/50 hover:border-white/5 text-slate-300'
                                    }
                                `}
                            >
                                <h3 className={`font-semibold ${selectedChat === chat ? 'text-primary' : 'text-slate-200'}`}>
                                    {!chat.isGroupChat
                                        ? getSender(loggedUser, chat.users)
                                        : chat.chatName}
                                </h3>
                                {chat.latestMessage && (
                                    <p className={`text-xs mt-1 truncate ${selectedChat === chat ? 'text-primary/70' : 'text-slate-500'}`}>
                                        <b className="font-medium">{chat.latestMessage.sender.name}: </b>
                                        {chat.latestMessage.content.length > 50
                                            ? chat.latestMessage.content.substring(0, 51) + "..."
                                            : chat.latestMessage.content}
                                    </p>
                                )}
                            </div>
                        ))}
                        {filteredChats.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-4">
                                <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center">
                                    <span className="text-2xl">💬</span>
                                </div>
                                <p className="text-sm font-medium">No {activeTab} chats yet</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 p-4 animate-pulse">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-20 bg-slate-800/30 rounded-xl w-full"></div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default MyChats;
