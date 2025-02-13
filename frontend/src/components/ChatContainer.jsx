import React, { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { io } from "socket.io-client";

const socket = io("http://localhost:5001");

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);
  const [reactions, setReactions] = useState({});
  const [hoveredMessage, setHoveredMessage] = useState(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // ✅ Handle receiving reactions - Ensure only one reaction per user
  useEffect(() => {
    socket.on("messageReaction", ({ messageId, userId, emoji }) => {
      setReactions((prev) => {
        const existingReactions = prev[messageId] || [];

        // Remove previous reaction from this user
        const filteredReactions = existingReactions.filter(
          (reaction) => reaction.userId !== userId
        );

        // If emoji is null, it means the user removed their reaction
        return {
          ...prev,
          [messageId]: emoji ? [...filteredReactions, { userId, emoji }] : filteredReactions,
        };
      });
    });

    return () => {
      socket.off("messageReaction");
    };
  }, []);

  // ✅ Handle sending reactions - Allow only one reaction per user
  const sendReaction = (messageId, emoji) => {
    const existingReaction = reactions[messageId]?.find(
      (reaction) => reaction.userId === authUser._id
    );

    if (existingReaction?.emoji === emoji) {
      // Remove reaction if the same emoji is clicked again
      socket.emit("sendReaction", { messageId, userId: authUser._id, emoji: null });
    } else {
      // Replace previous reaction with new one
      socket.emit("sendReaction", { messageId, userId: authUser._id, emoji });
    }
  };

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isSentByMe = message.senderId === authUser._id;

          return (
            <div
              key={message._id}
              className={`chat relative ${isSentByMe ? "chat-end" : "chat-start"} group`}
              ref={messageEndRef}
              onMouseEnter={() => setHoveredMessage(message._id)}
              onMouseLeave={() => setHoveredMessage(null)}
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={
                      isSentByMe
                        ? authUser.profilePic || "/boy.png"
                        : selectedUser.profilePic || "/boy.png"
                    }
                    alt="profile pic"
                  />
                </div>
              </div>

              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>

              <div className="chat-bubble relative flex flex-col">
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}
                {message.video && (
                  <video
                    src={message.video}
                    controls
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}
                {message.text && <span className="ml-2">{message.text}</span>}

                {/* ✅ Display the single reaction per user */}
                {reactions[message._id]?.length > 0 && (
                  <div
                    className={`absolute -bottom-3 px-2 py-1 rounded-md bg-black/50 text-white text-xs flex space-x-1
                      ${isSentByMe ? "right-2" : "left-2"}`}
                  >
                    {/* Only show unique reactions */}
                    {Array.from(new Set(reactions[message._id].map((r) => r.emoji))).map(
                      (emoji, index) => (
                        <span key={index} className="text-sm">
                          {emoji}
                        </span>
                      )
                    )}
                  </div>
                )}
              </div>

              {/* ✅ Reaction buttons - Positioned correctly */}
              {hoveredMessage === message._id && (
                <div
                  className={`absolute -top-6 px-2 py-1 rounded-md bg-gray-800 text-white flex space-x-2 opacity-0 group-hover:opacity-100 transition
                      ${isSentByMe ? "right-2" : "left-2"}`}
                >
                  <button
                    onClick={() => sendReaction(message._id, "❤️")}
                    className="text-sm"
                  >
                    ❤️
                  </button>
                  <button
                    onClick={() => sendReaction(message._id, "😂")}
                    className="text-sm"
                  >
                    😂
                  </button>
                  <button
                    onClick={() => sendReaction(message._id, "👍")}
                    className="text-sm"
                  >
                    👍
                  </button>
                  <button
                    onClick={() => sendReaction(message._id, "🔥")}
                    className="text-sm"
                  >
                    🔥
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
