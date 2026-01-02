import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { getFriendsWithChats } from "../lib/api";
import FriendListTile from "../component/FriendListTile";

const FriendsPage = () => {
  const navigate = useNavigate();

  /* -------- RECENT CHAT FRIENDS ONLY -------- */
  const {
    data: chatFriends = [],
    isLoading,
  } = useQuery({
    queryKey: ["friendsWithChats"],
    queryFn: getFriendsWithChats,
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto max-w-2xl">

        {/* -------- HEADER -------- */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight">
            Chats
          </h2>
        </div>

        {/* -------- LIST -------- */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <span className="loading loading-spinner loading-lg" />
          </div>
        ) : chatFriends.length === 0 ? (
          <div className="text-center opacity-70 py-12">
            No recent chats
          </div>
        ) : (
          <div className="space-y-1">
            {chatFriends.map((friend) => (
              <FriendListTile
                key={friend._id}
                friend={friend}
                onClick={() =>
                  navigate(`/chat/${friend._id}`)
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsPage;
