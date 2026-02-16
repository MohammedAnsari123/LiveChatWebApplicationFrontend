import ScrollableFeed from 'react-scrollable-feed';
import { isSameSender, isLastMessage, isSameSenderMargin, isSameUser } from '../../config/ChatLogics';
import { ChatState } from '../../context/ChatProvider';

const ScrollableChat = ({ messages }) => {
    const { user } = ChatState();

    return (
        <ScrollableFeed>
            {messages && messages.map((m, i) => {
                const isSelf = m.sender._id === user._id;
                return (
                    <div className={`flex w-full ${isSelf ? 'justify-end' : 'justify-start'}`} key={m._id}>
                        {(isSameSender(messages, m, i, user._id) || isLastMessage(messages, i, user._id)) && (
                            <div className="tooltip mr-2 select-none" data-tip={m.sender.name}>
                                <img
                                    src={m.sender.pic}
                                    alt={m.sender.name}
                                    className="w-8 h-8 rounded-full object-cover cursor-pointer hover:scale-110 transition-transform"
                                />
                            </div>
                        )}

                        <span
                            style={{
                                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                                marginTop: isSameUser(messages, m, i) ? 3 : 10,
                                maxWidth: "75%"
                            }}
                            className={`px-5 py-3 rounded-2xl text-sm shadow-md transition-all duration-300 ${isSelf
                                    ? 'bg-gradient-to-r from-primary to-secondary text-white rounded-br-none'
                                    : 'bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700/50'
                                }`}
                        >
                            {m.content}
                        </span>
                    </div>
                )
            })}
        </ScrollableFeed>
    )
}

export default ScrollableChat
