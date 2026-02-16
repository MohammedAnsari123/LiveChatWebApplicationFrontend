import { useState } from "react";
import { ChatState } from "../context/ChatProvider";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChats from "../components/Chat/MyChats";
import ChatBox from "../components/Chat/ChatBox";

const ChatPage = () => {
    const { user } = ChatState();
    const [fetchAgain, setFetchAgain] = useState(false);

    return (
        <div className="w-full h-screen bg-slate-900 overflow-hidden flex flex-col">
            {user && <SideDrawer />}
            <div className="flex-1 flex justify-between w-full h-[92vh] p-6 gap-6">
                {user && <MyChats fetchAgain={fetchAgain} />}
                {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
            </div>
        </div>
    );
};

export default ChatPage;
