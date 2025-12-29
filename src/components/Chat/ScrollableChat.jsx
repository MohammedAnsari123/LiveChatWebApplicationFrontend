import ScrollableFeed from 'react-scrollable-feed';
import { isSameSender, isLastMessage, isSameSenderMargin, isSameUser } from '../../config/ChatLogics';
import { ChatState } from '../../context/ChatProvider';

const ScrollableChat = ({ messages }) => {
    const { user } = ChatState();

    return (
        <ScrollableFeed>
            {messages && messages.map((m, i) => (
                <div style={{ display: "flex" }} key={m._id}>
                    {(isSameSender(messages, m, i, user._id) || isLastMessage(messages, i, user._id)) && (
                        <div className="tooltip" data-tip={m.sender.name}>
                            <img
                                src={m.sender.pic}
                                alt={m.sender.name}
                                className="w-8 h-8 rounded-full mr-2 mb-1 object-cover cursor-pointer"
                            />
                        </div>
                    )}

                    <span
                        style={{
                            backgroundColor: `${m.sender._id === user._id ? "#805AD5" : "#B9F5D0"
                                }`,
                            color: `${m.sender._id === user._id ? "white" : "black"
                                }`,
                            marginLeft: isSameSenderMargin(messages, m, i, user._id),
                            marginTop: isSameUser(messages, m, i) ? 3 : 10,
                            borderRadius: "20px",
                            padding: "5px 15px",
                            maxWidth: "75%"
                        }}
                        className="text-sm shadow-md"
                    >
                        {m.content}
                    </span>
                </div>
            ))}
        </ScrollableFeed>
    )
}

export default ScrollableChat
