import { useChat } from '../context/ChatContext';

const UserList = () => {
  const { users, selectedUser, setSelectedUser, onlineUsers } = useChat();

  const handleSelectUser = (user) => {
    setSelectedUser(user);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-lg font-bold text-gray-800">Messages</h2>
        <p className="text-sm text-gray-600 mt-1">
          {users.filter(u => onlineUsers.has(u._id)).length} online
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {users.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p>No users found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {users.map((user) => {
              const isOnline = onlineUsers.has(user._id);
              const isSelected = selectedUser?._id === user._id;

              return (
                <div
                  key={user._id}
                  onClick={() => handleSelectUser(user)}
                  className={`p-4 cursor-pointer transition duration-150 ${
                    isSelected
                      ? 'bg-blue-50 border-l-4 border-blue-600'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-12 h-12 rounded-full"
                      />
                      <div
                        className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                          isOnline ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {isOnline ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
