import { useState } from 'react';
import { FaEye } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

const ProfileModal = ({ user, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    return (
        <>
            {children ? (
                <span onClick={openModal}>{children}</span>
            ) : (
                <button onClick={openModal} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                    <FaEye className="text-white" />
                </button>
            )}

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
                        onClick={closeModal}
                    ></div>

                    <div className="relative bg-gray-900 rounded-2xl border border-gray-700 p-6 w-full max-w-md shadow-2xl flex flex-col items-center">
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                        >
                            <RxCross2 size={24} />
                        </button>

                        <h3 className="text-3xl font-bold text-white mb-6">
                            {user.name}
                        </h3>

                        <div className="relative mb-6">
                            <img
                                src={user.pic}
                                alt={user.name}
                                className="w-40 h-40 rounded-full border-4 border-purple-600 object-cover"
                            />
                        </div>

                        <p className="text-xl text-gray-300 tracking-wide">
                            {user.email}
                        </p>

                        <div className="mt-8">
                            <button
                                onClick={closeModal}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-md transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ProfileModal;
