import React, { useEffect, useRef, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import {
  MessageCircle,
  X,
  ChevronUp,
  ChevronDown,
  MessageSquare,
} from "lucide-react";

interface Message {
  id: string;
  from: string;
  content: string;
  bountyId: string;
  reportId: string;
  timestamp: number;
}

interface ChatProps {
  bountyId?: string;
  reportId?: string;
  onSelectChat: (reportId: string) => void;
  availableChats: Array<{
    reportId: string;
    bountyName: string;
    reportTitle: string;
  }>;
}

export default function Chat({
  bountyId,
  reportId,
  onSelectChat,
  availableChats,
}: ChatProps) {
  const { user } = usePrivy();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [ws, setWs] = useState<WebSocket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userAddress = user?.wallet?.address;

  useEffect(() => {
    if (!isOpen || !bountyId || !reportId || !userAddress) return;

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:4000";
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      socket.send(
        JSON.stringify({
          type: "join",
          user: {
            walletAddress: userAddress,
            bountyId,
            reportId,
          },
        })
      );
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "message") {
        if (Array.isArray(data.messages)) {
          setMessages(data.messages);
        } else if (data.message) {
          setMessages((prev) => [...prev, data.message]);
        }
      }
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    setWs(socket);

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [isOpen, bountyId, reportId, userAddress]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ws || !newMessage.trim() || !bountyId || !reportId) return;

    ws.send(
      JSON.stringify({
        type: "message",
        message: {
          content: newMessage.trim(),
          bountyId,
          reportId,
        },
      })
    );

    setNewMessage("");
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 rounded-full p-3 bg-[#FAFCA3] text-white"
      >
        <MessageSquare className="h-6 w-6 text-[#99168E]" />
      </button>
    );
  }

  return (
    <div
      className={`fixed right-4 bg-[#000625] border border-gray-500 shadow-lg transition-all duration-200 rounded-lg ${
        isMinimized ? "h-12 bottom-4" : "h-[500px] bottom-4"
      } w-[350px]`}
    >
      <div className="flex items-center justify-between p-3 border-b border-gray-500">
        <h3 className="font-semibold text-[#FAFCA3]">
          {bountyId && reportId ? "Chat" : "Select a Chat"}
        </h3>
        <div className="flex items-center gap-2">
          <button
            className="p-1 hover:bg-[#99168E] rounded-lg transition-colors"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? (
              <ChevronUp className="h-4 w-4 text-[#FAFCA3]" />
            ) : (
              <ChevronDown className="h-4 w-4 text-[#FAFCA3]" />
            )}
          </button>
          <button
            className="p-1 hover:bg-[#99168E] rounded-lg transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4 text-[#FAFCA3]" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {!bountyId || !reportId ? (
            <div className="h-[452px] p-4 overflow-y-auto">
              <div className="space-y-2">
                {availableChats.map((chat) => {
                  const chatKey = `${chat.reportId}`;
                  return (
                    <button
                      key={chatKey}
                      className="w-full p-3 text-left border border-[#99168E] rounded-lg hover:bg-black/60 transition-colors"
                      onClick={() => onSelectChat(chat.reportId)}
                    >
                      <div className="truncate">
                        <div className="font-medium text-[#FAFCA3]">
                          {chat.bountyName}
                        </div>
                        <div className="text-sm text-[#FAFCA3] truncate">
                          Submission: {chat.reportTitle}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <>
              <div
                ref={scrollRef}
                className="flex-1 p-4 h-[400px] overflow-y-auto"
              >
                <div className="space-y-4">
                  {messages.map((message) => {
                    const messageKey =
                      message.id || `${message.from}-${message.timestamp}`;
                    return (
                      <div
                        key={messageKey}
                        className={`flex ${
                          message.from === userAddress
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg px-4 py-2 ${
                            message.from === userAddress
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                          }`}
                        >
                          <p className="text-sm break-words">
                            {message.content}
                          </p>
                          <span className="text-xs opacity-70">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              <form
                onSubmit={sendMessage}
                className="p-4 border-t border-gray-200 dark:border-gray-700"
              >
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Send
                  </button>
                </div>
              </form>
            </>
          )}
        </>
      )}
    </div>
  );
}
