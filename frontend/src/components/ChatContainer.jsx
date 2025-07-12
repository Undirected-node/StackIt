import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";

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
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    getMessages(selectedUser._id);

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto bg-base-100">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto bg-base-100 relative">
      {/* Subtle background pattern using DaisyUI colors */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,hsl(var(--bc)/0.05)_1px,transparent_0)] [background-size:20px_20px] pointer-events-none"></div>
      
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10">
        {messages.map((message, index) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"} group`}
            ref={index === messages.length - 1 ? messageEndRef : null}
          >
            <div className="chat-image avatar">
              <div className="size-12 rounded-full border-2 border-base-300 shadow-lg ring-2 ring-primary/20 transition-all duration-300 group-hover:ring-primary/40 group-hover:scale-105">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                  alt="profile pic"
                  className="rounded-full object-cover w-full h-full"
                />
              </div>
            </div>
            
            <div className="chat-header mb-2">
              <time className="text-xs text-base-content/60 ml-1 font-medium group-hover:text-base-content/80 transition-colors duration-200">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            
            <div className={`chat-bubble flex flex-col relative transition-all duration-300 group-hover:scale-[1.02] shadow-lg ${
              message.senderId === authUser._id
                ? "bg-primary text-primary-content border-primary/20"
                : "bg-base-200 text-base-content border-base-300"
            }`}>
              {/* Subtle glow effect for sent messages using DaisyUI primary color */}
              {message.senderId === authUser._id && (
                <div className="absolute inset-0 bg-primary rounded-lg blur-sm opacity-10 -z-10 group-hover:opacity-20 transition-opacity duration-300"></div>
              )}
              
              {message.image && (
                <div className="relative mb-3 group/image">
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[220px] rounded-lg shadow-md transition-transform duration-300 group-hover/image:scale-105 border border-base-300/50 cursor-pointer hover:brightness-110"
                    onClick={() => setSelectedImage(message.image)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-base-300/20 to-transparent rounded-lg opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  {/* Click indicator */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="bg-base-100/80 backdrop-blur-sm rounded-full p-2 shadow-lg">
                      <svg className="w-5 h-5 text-base-content" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}
              
              {message.text && (
                <p className="leading-relaxed text-sm sm:text-base font-medium break-words">
                  {message.text}
                </p>
              )}
              
              {/* Message status indicator for sent messages */}
              {message.senderId === authUser._id && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-success rounded-full border-2 border-base-100 opacity-80 group-hover:opacity-100 transition-opacity duration-200"></div>
              )}
            </div>
          </div>
        ))}
        
        {/* Scroll to bottom spacer */}
        <div className="h-4"></div>
      </div>

      <MessageInput />

      {/* Image Modal */}
      {selectedImage && (
        <div className="modal modal-open">
          <div className="modal-box max-w-4xl w-full h-full max-h-[90vh] p-0 bg-base-100/95 backdrop-blur-sm">
            <div className="relative w-full h-full flex items-center justify-center p-4">
              {/* Close button */}
              <button
                className="btn btn-circle btn-ghost absolute top-4 right-4 z-10 bg-base-100/80 hover:bg-base-200/80 border border-base-300/50"
                onClick={() => setSelectedImage(null)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              {/* Image */}
              <img
                src={selectedImage}
                alt="Full size image"
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
            </div>
          </div>
          
          {/* Modal backdrop */}
          <div className="modal-backdrop bg-base-300/50" onClick={() => setSelectedImage(null)}>
            <button>close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatContainer;