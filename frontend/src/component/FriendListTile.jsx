const FriendListTile = ({ friend, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 p-3 cursor-pointer 
                 hover:bg-base-200 rounded-lg transition"
    >
      {/* Avatar */}
      <div className="avatar">
        <div className="w-12 rounded-full">
          <img src={friend.profilePic} alt={friend.fullName} />
        </div>
      </div>

      {/* Name & last message */}
      <div className="flex-1 border-b border-base-300 pb-2">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">{friend.fullName}</h3>
        </div>

        <p className="text-sm opacity-70 truncate">
          {friend.lastMessage || "Start a conversation"}
        </p>
      </div>
    </div>
  );
};

export default FriendListTile;
