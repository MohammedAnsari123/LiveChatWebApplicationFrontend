import { ChatState } from '../../context/ChatProvider';
import SingleChat from './SingleChat';

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
    const { selectedChat } = ChatState();

    return (
        <div
            className={`
              ${selectedChat ? "flex" : "hidden"} 
              md:flex items-center flex-col p-3 
              bg-gray-800 w-full md:w-2/3 rounded-lg border border-gray-700 h-[85vh]
           `}
        >
            <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </div>
    )
}

export default ChatBox
