import { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../../config/api";
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
            <div className="relative z-50 flex justify-between items-center bg-slate-800/20 backdrop-blur-md border-b border-white/5 px-6 py-4 w-full h-[8vh]">
                <button
                    onClick={() => setIsSearchOpen(true)}
                    className="flex items-center gap-3 text-slate-400 hover:text-white transition-all px-4 py-2 rounded-xl hover:bg-white/5 group"
                >
                    <FaSearch className="group-hover:text-primary transition-colors" />
                    <span className="hidden md:inline font-medium">Search User</span>
                </button>

                <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-indigo-500 bg-clip-text text-transparent tracking-tight">
                    Modern Chat
                </h1>

                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate("/feed")}
                        className="hidden md:flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-medium"
                    >
                        Social Feed
                    </button>

                    <div className="flex items-center gap-4">
                        <Menu as="div" className="relative inline-block text-left">
                            <div>
                                <Menu.Button className="relative p-2 text-slate-400 hover:text-white transition-colors">
                                    <FaBell className="text-xl" />
                                    {notification.length > 0 && (
                                        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-rose-500 rounded-full ring-2 ring-slate-900">
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
                                <Menu.Items className="absolute right-0 mt-4 w-72 origin-top-right divide-y divide-white/5 rounded-xl glass-modal shadow-2xl focus:outline-none z-50 overflow-hidden">
                                    <div className="px-1 py-1 max-h-96 overflow-y-auto">
                                        {!notification.length && <div className="p-4 text-center text-slate-500 text-sm">No New Messages</div>}
                                        {notification.map((notif) => (
                                            <Menu.Item key={notif._id}>
                                                {({ active }) => (
                                                    <button
                                                        onClick={() => {
                                                            setSelectedChat(notif.chat);
                                                            setNotification(notification.filter((n) => n !== notif));
                                                        }}
                                                        className={`${active ? 'bg-primary/20 text-white' : 'text-slate-300'
                                                            } group flex w-full items-center rounded-lg px-3 py-3 text-sm transition-colors mb-1`}
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
                                <Menu.Button className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors p-1 rounded-full hover:bg-white/5 pr-3">
                                    <div className="w-9 h-9 rounded-full p-[2px] bg-gradient-to-r from-primary to-secondary">
                                        <img src={user.pic} alt={user.name} className="w-full h-full rounded-full object-cover border-2 border-slate-900" />
                                    </div>
                                    <FaChevronDown className="text-xs" />
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
                                <Menu.Items className="absolute right-0 mt-4 w-48 origin-top-right divide-y divide-white/5 rounded-xl glass-modal shadow-xl focus:outline-none z-50">
                                    <div className="p-1">
                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    onClick={() => navigate("/feed")}
                                                    className={`${active ? 'bg-white/10 text-white' : 'text-slate-300'} group flex w-full items-center rounded-lg px-3 py-2.5 text-sm mb-1 transition-colors`}
                                                >
                                                    Social Feed
                                                </button>
                                            )}
                                        </Menu.Item>
                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    onClick={() => navigate("/profile")}
                                                    className={`${active ? 'bg-white/10 text-white' : 'text-slate-300'} group flex w-full items-center rounded-lg px-3 py-2.5 text-sm mb-1 transition-colors`}
                                                >
                                                    My Profile
                                                </button>
                                            )}
                                        </Menu.Item>
                                        <Menu.Item>
                                            {({ active }) => (
                                                <button onClick={logoutHandler} className={`${active ? 'bg-rose-500/20 text-rose-400' : 'text-rose-400'} group flex w-full items-center rounded-lg px-3 py-2.5 text-sm transition-colors`}>
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
            </div>

            {/* Search Drawer */}
            <Transition show={isSearchOpen} as={Fragment}>
                <div className="relative z-50">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSearchOpen(false)} />
                    </Transition.Child>

                    <div className="fixed inset-y-0 left-0 flex max-w-full">
                        <Transition.Child
                            as={Fragment}
                            enter="transform transition ease-in-out duration-500 sm:duration-700"
                            enterFrom="-translate-x-full"
                            enterTo="translate-x-0"
                            leave="transform transition ease-in-out duration-500 sm:duration-700"
                            leaveFrom="translate-x-0"
                            leaveTo="-translate-x-full"
                        >
                            <div className="w-screen max-w-md">
                                <div className="flex h-full flex-col bg-slate-900 shadow-2xl border-r border-white/5">
                                    <div className="px-6 py-6 border-b border-white/5 bg-slate-800/50">
                                        <h2 className="text-xl font-bold text-white mb-4">Search Users</h2>
                                        <div className="flex gap-2">
                                            <input
                                                className="flex-1 input-field bg-slate-900/50"
                                                placeholder="Name or email..."
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                                autoFocus
                                            />
                                            <button onClick={handleSearch} className="btn-primary px-6 py-2 rounded-xl">Go</button>
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                                        {loading ? (
                                            <div className="flex justify-center p-8">
                                                <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                                            </div>
                                        ) : (
                                            searchResult?.map(user => (
                                                <div
                                                    key={user._id}
                                                    onClick={() => accessChat(user._id)}
                                                    className="flex items-center gap-4 bg-slate-800/30 hover:bg-slate-800 p-4 rounded-xl cursor-pointer transition-all border border-transparent hover:border-white/5 group"
                                                >
                                                    <img src={user.pic} alt={user.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-transparent group-hover:ring-primary/50 transition-all" />
                                                    <div>
                                                        <p className="text-slate-200 font-semibold group-hover:text-white transition-colors">{user.name}</p>
                                                        <p className="text-slate-500 text-sm"><b>Email:</b> {user.email}</p>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                        {loadingChat && <div className="text-primary text-center mt-4 text-sm font-medium animate-pulse">Initializing chat...</div>}
                                    </div>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </div>
            </Transition>
        </>
    );
};

export default SideDrawer;
