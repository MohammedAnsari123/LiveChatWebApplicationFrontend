import { ChatState } from '../../context/ChatProvider';
import SingleChat from './SingleChat';

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
    const { selectedChat } = ChatState();

    return (
        <div
            className={`
              ${selectedChat ? "flex" : "hidden"} 
              md:flex items-center flex-col 
              glass w-full md:w-2/3 rounded-2xl border border-white/5 h-full overflow-hidden
           `}
        >
            <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </div>
    )
}

export default ChatBox
