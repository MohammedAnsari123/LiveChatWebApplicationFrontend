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
                                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-gray-900 border border-white/10 p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title as="h3" className="text-2xl font-medium leading-6 text-white text-center mb-6">
                                        {selectedChat.chatName}
                                    </Dialog.Title>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {selectedChat.users.map(u => (
                                            <div key={u._id} className="flex items-center gap-1 bg-purple-600 px-2 py-1 rounded-full text-sm text-white">
                                                {u.name}
                                                <RxCross2 className="cursor-pointer" onClick={() => handleRemove(u)} />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex gap-2">
                                            <input
                                                placeholder="Rename Chat"
                                                value={groupChatName}
                                                onChange={(e) => setGroupChatName(e.target.value)}
                                                className="flex-1 bg-black/20 border border-gray-600 rounded px-3 py-2 text-white outline-none focus:border-purple-500"
                                            />
                                            <button
                                                onClick={handleRename}
                                                disabled={renameLoading}
                                                className="bg-green-600 hover:bg-green-700 text-white px-4 rounded"
                                            >
                                                {renameLoading ? "Updating..." : "Update"}
                                            </button>
                                        </div>

                                        <input
                                            placeholder="Add User to group"
                                            onChange={(e) => handleSearch(e.target.value)}
                                            className="w-full bg-black/20 border border-gray-600 rounded px-3 py-2 text-white outline-none focus:border-purple-500"
                                        />

                                        <div className="max-h-60 overflow-y-auto space-y-2">
                                            {loading ? <div className="text-white">Loading...</div> : (
                                                searchResult?.slice(0, 4).map(user => (
                                                    <div
                                                        key={user._id}
                                                        onClick={() => handleAddUser(user)}
                                                        className="flex items-center gap-3 bg-white/5 hover:bg-white/10 p-2 rounded cursor-pointer"
                                                    >
                                                        <img src={user.pic} className="w-8 h-8 rounded-full" />
                                                        <div>
                                                            <p className="text-white text-sm">{user.name}</p>
                                                            <p className="text-gray-400 text-xs">{user.email}</p>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-8 flex justify-end">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none"
                                            onClick={() => handleRemove(user)}
                                        >
                                            Leave Group
                                        </button>
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
