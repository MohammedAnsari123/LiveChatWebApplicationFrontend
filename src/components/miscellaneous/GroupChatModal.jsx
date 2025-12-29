import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { toast } from 'react-toastify'
import { ChatState } from '../../context/ChatProvider'
import axios from "../../config/api";
import { RxCross2 } from "react-icons/rx";

const GroupChatModal = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [groupChatName, setGroupChatName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const { user, chats, setChats } = ChatState();

    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
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

    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
            toast.warning("Please fill all the fields");
            return;
        }

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.post("/api/chat/group", {
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map((u) => u._id)),
            }, config);

            setChats([data, ...chats]);
            setIsOpen(false);
            toast.success("New Group Chat Created!");
        } catch (error) {
            toast.error("Failed to Create Group Chat");
        }
    }

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            toast.warning("User already added");
            return;
        }
        setSelectedUsers([...selectedUsers, userToAdd]);
    }

    const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter(sel => sel._id !== delUser._id));
    }

    return (
        <>
            <span onClick={openModal}>{children}</span>

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
                                        Create Group Chat
                                    </Dialog.Title>

                                    <div className="space-y-4">
                                        <input
                                            placeholder="Group Name"
                                            className="w-full bg-black/20 border border-gray-600 rounded px-3 py-2 text-white outline-none focus:border-purple-500"
                                            onChange={(e) => setGroupChatName(e.target.value)}
                                        />
                                        <input
                                            placeholder="Add Users e.g: John, Jane"
                                            className="w-full bg-black/20 border border-gray-600 rounded px-3 py-2 text-white outline-none focus:border-purple-500"
                                            onChange={(e) => handleSearch(e.target.value)}
                                        />

                                        {/* Selected Users */}
                                        <div className="flex flex-wrap gap-2">
                                            {selectedUsers.map(u => (
                                                <div key={u._id} className="flex items-center gap-1 bg-purple-600 px-2 py-1 rounded-full text-sm text-white">
                                                    {u.name}
                                                    <RxCross2 className="cursor-pointer" onClick={() => handleDelete(u)} />
                                                </div>
                                            ))}
                                        </div>

                                        {/* Search Results */}
                                        <div className="max-h-60 overflow-y-auto space-y-2">
                                            {loading ? <div className="text-white">Loading...</div> : (
                                                searchResult?.slice(0, 4).map(user => (
                                                    <div
                                                        key={user._id}
                                                        onClick={() => handleGroup(user)}
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
                                            className="inline-flex justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
                                            onClick={handleSubmit}
                                        >
                                            Create Chat
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

export default GroupChatModal
