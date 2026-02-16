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

                    <div className="relative glass-modal rounded-2xl border border-white/10 p-8 w-full max-w-md shadow-2xl flex flex-col items-center overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary"></div>
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary/10 rounded-full blur-3xl pointer-events-none"></div>

                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white hover:bg-white/10 p-1 rounded-full transition-all"
                        >
                            <RxCross2 size={24} />
                        </button>

                        <h3 className="text-3xl font-bold text-white mb-8 tracking-tight">
                            {user.name}
                        </h3>

                        <div className="relative mb-8 group">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary rounded-full blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
                            <img
                                src={user.pic}
                                alt={user.name}
                                className="relative w-40 h-40 rounded-full border-4 border-slate-900 object-cover shadow-xl"
                            />
                        </div>

                        <p className="text-xl text-slate-300 tracking-wide font-light mb-8">
                            {user.email}
                        </p>

                        <div className="mt-2 w-full">
                            <button
                                onClick={closeModal}
                                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium px-6 py-3 rounded-xl transition-all border border-white/5 hover:border-white/10"
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
