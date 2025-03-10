import { XSquare, Music } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useMusicStore } from "../store/musicStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser} = useChatStore();
  const {toggleMusicPlayer} = useMusicStore();
  const { onlineUsers } = useAuthStore();

  return (
    <div className="p-2.5 border-b border-base-300 flex items-center justify-between">
      {/* Left: User Info */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="avatar">
          <div className="size-10 rounded-full relative">
            <img src={selectedUser.profilePic || "/boy.png"} alt={selectedUser.fullName} />
          </div>
        </div>

        {/* Name & Status */}
        <div>
          <h3 className="font-medium">{selectedUser.fullName}</h3>
          <p className="text-sm text-base-content/70">
            {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      {/* Right: Music Player Button & Close Button */}
      <div className="flex gap-3">
        {/* 🎵 Music Player Button */}
        <button onClick={toggleMusicPlayer} className="hover:text-gray-500">
          <Music size={22} />
        </button>

        {/* ❌ Close Chat Button */}
        <button onClick={() => setSelectedUser(null)}>
          <XSquare />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
