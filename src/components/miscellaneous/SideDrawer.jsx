import { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import ProfileModal from "./ProfileModal";
import { FaSearch, FaBell, FaChevronDown } from "react-icons/fa";
import { Menu, Transition } from '@headlessui/react'
import { Fragment } from 'react'

const SideDrawer = () => {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const {
        setSelectedChat,
        user,
        notification,
        setNotification,
        chats,
        setChats,
    } = ChatState();

    const navigate = useNavigate();

    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        navigate("/");
    };

    const handleSearch = async () => {
        if (!search) {
            toast.warning("Please Enter something in search");
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get(`/api/auth?search=${search}`, config);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                localStorage.removeItem("userInfo");
                window.location.href = "/";
            }
            toast.error("Error Occured!");
            setLoading(false);
        }
    };

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post(`/api/chat`, { userId }, config);

            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
            setSelectedChat(data);
            setLoadingChat(false);
            setIsSearchOpen(false);
        } catch (error) {
            toast.error("Error fetching the chat");
            setLoadingChat(false);
        }
    };

    return (
        <>
            <div className="flex justify-between items-center bg-gray-900 border-b border-gray-700 px-5 py-3 w-full">
                <button
                    onClick={() => setIsSearchOpen(true)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors px-3 py-2 rounded-md hover:bg-white/5"
                >
                    <FaSearch />
                    <span className="hidden md:inline">Search User</span>
                </button>

                <button
                    onClick={() => navigate("/feed")}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors px-3 py-2 rounded-md hover:bg-white/5"
                >
                    <span className="hidden md:inline font-bold">Social Feed</span>
                </button>

                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                    Modern Chat
                </h1>

                <div className="flex items-center gap-4">
                    {/* Notification Menu could go here */}
                    <Menu as="div" className="relative inline-block text-left">
                        <div>
                            <Menu.Button className="relative p-2 text-gray-400 hover:text-white transition-colors">
                                <FaBell className="text-xl" />
                                {notification.length > 0 && (
                                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                                        {notification.length}
                                    </span>
                                )}
                            </Menu.Button>
                        </div>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                                <div className="px-1 py-1">
                                    {!notification.length && <div className="p-2 text-gray-700">No New Messages</div>}
                                    {notification.map((notif) => (
                                        <Menu.Item key={notif._id}>
                                            {({ active }) => (
                                                <button
                                                    onClick={() => {
                                                        setSelectedChat(notif.chat);
                                                        setNotification(notification.filter((n) => n !== notif));
                                                    }}
                                                    className={`${active ? 'bg-purple-500 text-white' : 'text-gray-900'
                                                        } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                                >
                                                    {notif.chat.isGroupChat
                                                        ? `New Message in ${notif.chat.chatName}`
                                                        : `New Message from ${notif.sender.name}`}
                                                </button>
                                            )}
                                        </Menu.Item>
                                    ))}
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>

                    <Menu as="div" className="relative inline-block text-left">
                        <div>
                            <Menu.Button className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors p-1 rounded-md hover:bg-white/5">
                                <img src={user.pic} alt={user.name} className="w-8 h-8 rounded-full border border-purple-500 object-cover" />
                                <FaChevronDown />
                            </Menu.Button>
                        </div>
                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                        >
                            <Menu.Items className="absolute right-0 mt-2 w-40 origin-top-right divide-y divide-gray-700 rounded-md bg-gray-800 border border-white/10 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                                <div className="px-1 py-1">
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={() => navigate("/feed")}
                                                className={`${active ? 'bg-purple-600' : ''} text-white group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                            >
                                                Social Feed
                                            </button>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button
                                                onClick={() => navigate("/profile")}
                                                className={`${active ? 'bg-purple-600' : ''} text-white group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                                            >
                                                My Profile
                                            </button>
                                        )}
                                    </Menu.Item>
                                    <Menu.Item>
                                        {({ active }) => (
                                            <button onClick={logoutHandler} className={`${active ? 'bg-red-600' : ''} text-white group flex w-full items-center rounded-md px-2 py-2 text-sm`}>
                                                Logout
                                            </button>
                                        )}
                                    </Menu.Item>
                                </div>
                            </Menu.Items>
                        </Transition>
                    </Menu>
                </div>
            </div>

            {/* Search Drawer (Basic implementation as overlay) */}
            {isSearchOpen && (
                <div className="fixed inset-0 z-50 flex">
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsSearchOpen(false)}></div>
                    <div className="relative w-80 bg-gray-900 h-full shadow-xl border-r border-white/10 flex flex-col p-4 animate-in slide-in-from-left duration-300">
                        <h2 className="text-xl text-white font-bold mb-4">Search Users</h2>
                        <div className="flex gap-2 mb-4">
                            <input
                                className="w-full bg-black/20 border border-gray-600 rounded px-3 py-2 text-white outline-none focus:border-purple-500"
                                placeholder="Search by name or email"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <button onClick={handleSearch} className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded">Go</button>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-2">
                            {loading ? (
                                <div className="text-white text-center">Loading...</div>
                            ) : (
                                searchResult?.map(user => (
                                    <div
                                        key={user._id}
                                        onClick={() => accessChat(user._id)}
                                        className="flex items-center gap-3 bg-white/5 hover:bg-white/10 p-3 rounded-lg cursor-pointer transition-colors"
                                    >
                                        <img src={user.pic} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                                        <div>
                                            <p className="text-white font-medium">{user.name}</p>
                                            <p className="text-gray-400 text-xs"><b>Email:</b> {user.email}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                            {loadingChat && <div className="text-purple-400 text-center mt-2">Opening Chat...</div>}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SideDrawer;
