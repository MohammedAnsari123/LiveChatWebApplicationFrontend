import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { FaEye } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { ChatState } from '../../context/ChatProvider';
import { toast } from 'react-toastify';
import axios from "../../config/api";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
    const { selectedChat, setSelectedChat, user } = ChatState();

    let [isOpen, setIsOpen] = useState(false)
    const [groupChatName, setGroupChatName] = useState("");
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);

    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
    }

    const handleRemove = async (user1) => {
        if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
            toast.error("Only Admin Can Remove Someone!");
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            };

            const { data } = await axios.put("/api/chat/groupremove", {
                chatId: selectedChat._id,
                userId: user1._id,
            }, config);

            user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false);
        } catch (error) {
            toast.error("Error Occured");
            setLoading(false);
        }
    }

    const handleAddUser = async (user1) => {
        if (selectedChat.users.find((u) => u._id === user1._id)) {
            toast.error("User Already in group!");
            return;
        }

        if (selectedChat.groupAdmin._id !== user._id) {
            toast.error("Only Admin Can Add Someone!");
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            };

            const { data } = await axios.put("/api/chat/groupadd", {
                chatId: selectedChat._id,
                userId: user1._id,
            }, config);

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            toast.error("Error Occured");
            setLoading(false);
        }
    }

    const handleRename = async () => {
        if (!groupChatName) return;

        try {
            setRenameLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                }
            };

            const { data } = await axios.put("/api/chat/rename", {
                chatId: selectedChat._id,
                chatName: groupChatName,
            }, config);

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
        } catch (error) {
            toast.error("Error Occured");
            setRenameLoading(false);
        }
        setGroupChatName("");
    }

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
            return;
        }

        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(`/api/auth?search=${query}`, config);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast.error("Failed to Load Search Results");
            setLoading(false);
        }
    }


    return (
        <>
            <button onClick={openModal} className="p-2 hover:bg-white/10 rounded-full">
                <FaEye className="text-white" />
            </button>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl glass-modal p-8 text-left align-middle shadow-2xl transition-all border border-white/10 relative">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                                    <Dialog.Title as="h3" className="text-2xl font-bold leading-6 text-white text-center mb-8 relative z-10">
                                        {selectedChat.chatName}
                                    </Dialog.Title>

                                    <div className="relative z-10">
                                        <div className="flex flex-wrap gap-2 mb-6 min-h-[30px]">
                                            {selectedChat.users.map(u => (
                                                <div key={u._id} className="flex items-center gap-1 bg-gradient-to-r from-primary to-secondary pl-3 pr-2 py-1 rounded-full text-xs font-bold text-white shadow-lg shadow-primary/20">
                                                    {u.name}
                                                    <RxCross2
                                                        className="cursor-pointer hover:bg-white/20 rounded-full p-0.5"
                                                        size={16}
                                                        onClick={() => handleRemove(u)}
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        <div className="space-y-6">
                                            <div className="flex gap-3 items-end">
                                                <div className="flex-1">
                                                    <label className="text-slate-300 text-sm font-medium ml-1 mb-1 block">Rename Group</label>
                                                    <input
                                                        placeholder="New Group Name"
                                                        value={groupChatName}
                                                        onChange={(e) => setGroupChatName(e.target.value)}
                                                        className="input-field bg-slate-900/50 focus:bg-slate-900 w-full"
                                                    />
                                                </div>
                                                <button
                                                    onClick={handleRename}
                                                    disabled={renameLoading}
                                                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-emerald-500/20 mb-[1px]"
                                                >
                                                    {renameLoading ? "..." : "Update"}
                                                </button>
                                            </div>

                                            <div>
                                                <label className="text-slate-300 text-sm font-medium ml-1 mb-1 block">Add Member</label>
                                                <input
                                                    placeholder="Search user to add..."
                                                    onChange={(e) => handleSearch(e.target.value)}
                                                    className="input-field bg-slate-900/50 focus:bg-slate-900 w-full"
                                                />
                                            </div>

                                            {loading ? (
                                                <div className="flex justify-center py-2">
                                                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                                </div>
                                            ) : (
                                                searchResult?.length > 0 && (
                                                    <div className="max-h-48 overflow-y-auto space-y-2 pr-2 custom-scrollbar bg-slate-900/30 p-2 rounded-xl border border-white/5">
                                                        {searchResult?.slice(0, 4).map(user => (
                                                            <div
                                                                key={user._id}
                                                                onClick={() => handleAddUser(user)}
                                                                className="flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-white/5 transition-colors group"
                                                            >
                                                                <img src={user.pic} className="w-8 h-8 rounded-full object-cover border border-slate-600 group-hover:border-primary transition-colors" />
                                                                <div>
                                                                    <p className="text-slate-200 text-sm font-medium group-hover:text-primary transition-colors">{user.name}</p>
                                                                    <p className="text-slate-500 text-xs">{user.email}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )
                                            )}
                                        </div>

                                        <div className="mt-8 flex justify-end pt-4 border-t border-white/5">
                                            <button
                                                type="button"
                                                className="inline-flex justify-center rounded-xl border border-transparent bg-rose-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-rose-700 focus:outline-none shadow-lg shadow-rose-600/20 transition-all hover:scale-105"
                                                onClick={() => handleRemove(user)}
                                            >
                                                Leave Group
                                            </button>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}

export default UpdateGroupChatModal;
