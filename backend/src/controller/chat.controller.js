import { generateStreamToken } from "../lib/stream.js";
import User from "../models/User.js";
import { streamClient } from "../lib/stream.js";

export async function getStreamToken(req,res) {
    try {
        const token = generateStreamToken(req.user.id);
        res.status(200).json({token});
    } catch (error) {
        console.log('error in getStreamToken: ',error);
        res.status(500).json({message:"internal server error"});
        
    }
    
}



export async function getFriendsWithChats(req, res) {
  try {
    const userId = req.user.id.toString();

    // 1️⃣ Get friends from MongoDB
    const user = await User.findById(userId)
      .select("friends")
      .populate("friends", "fullName proflePic");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const friends = user.friends;

    // 2️⃣ Get all chat channels of current user
    const channels = await streamClient.queryChannels(
      {
        type: "messaging",
        members: { $in: [userId] },
      },
      { last_message_at: -1 },
      { watch: false, state: true }
    );

    // 3️⃣ Map friendId → channel
    const channelMap = new Map();

    channels.forEach((channel) => {
      const memberIds = Object.keys(channel.state.members);
      const friendId = memberIds.find((id) => id !== userId);

      if (friendId) {
        channelMap.set(friendId, channel);
      }
    });

    // 4️⃣ Build response: ONLY friends with chats
    const friendsWithChats = friends
      .filter((friend) => channelMap.has(friend._id.toString()))
      .map((friend) => {
        const channel = channelMap.get(friend._id.toString());
        const messages = channel.state.messages;
        const lastMessage = messages[messages.length - 1];

        return {
          _id: friend._id,
          fullName: friend.fullName,
          profilePic: friend.proflePic,
          lastMessage: lastMessage?.text || "",
          updatedAt: channel.last_message_at,
        };
      });

    res.status(200).json(friendsWithChats);
  } catch (error) {
    console.error("Error in getFriendsWithChats", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
