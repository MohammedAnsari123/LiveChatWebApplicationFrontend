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
                                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl glass-modal p-8 text-left align-middle shadow-2xl transition-all border border-white/10 relative">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                                    <Dialog.Title as="h3" className="text-2xl font-bold leading-6 text-white text-center mb-8 tracking-tight">
                                        Create Group Chat
                                    </Dialog.Title>

                                    <div className="space-y-6 relative z-10">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-slate-300 text-sm font-medium ml-1">Group Name</label>
                                            <input
                                                placeholder="e.g. Project Team"
                                                className="input-field bg-slate-900/50 focus:bg-slate-900"
                                                onChange={(e) => setGroupChatName(e.target.value)}
                                            />
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <label className="text-slate-300 text-sm font-medium ml-1">Add Members</label>
                                            <input
                                                placeholder="Type to search users..."
                                                className="input-field bg-slate-900/50 focus:bg-slate-900"
                                                onChange={(e) => handleSearch(e.target.value)}
                                            />
                                        </div>

                                        {/* Selected Users */}
                                        <div className="flex flex-wrap gap-2 min-h-[30px]">
                                            {selectedUsers.map(u => (
                                                <div key={u._id} className="flex items-center gap-1 bg-gradient-to-r from-primary to-secondary pl-3 pr-2 py-1 rounded-full text-xs font-bold text-white shadow-lg shadow-primary/20 animate-in zoom-in duration-200">
                                                    {u.name}
                                                    <RxCross2 className="cursor-pointer hover:bg-white/20 rounded-full p-0.5" size={16} onClick={() => handleDelete(u)} />
                                                </div>
                                            ))}
                                        </div>

                                        {/* Search Results */}
                                        {loading ? (
                                            <div className="flex justify-center py-4">
                                                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                                            </div>
                                        ) : (
                                            searchResult?.length > 0 && (
                                                <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar bg-slate-900/30 p-2 rounded-xl border border-white/5">
                                                    {searchResult?.slice(0, 4).map(user => (
                                                        <div
                                                            key={user._id}
                                                            onClick={() => handleGroup(user)}
                                                            className="flex items-center gap-3 p-2.5 rounded-lg cursor-pointer hover:bg-white/5 transition-colors group"
                                                        >
                                                            <img src={user.pic} className="w-10 h-10 rounded-full object-cover border border-slate-600 group-hover:border-primary transition-colors" />
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

                                    <div className="mt-8 flex justify-end">
                                        <button
                                            type="button"
                                            className="btn-primary px-8 py-2.5 shadow-lg shadow-primary/25"
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
