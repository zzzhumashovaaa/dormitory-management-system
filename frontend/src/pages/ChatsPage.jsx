import { useEffect, useRef, useState } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/axios";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

export default function ChatsPage() {
  const [roomChat, setRoomChat] = useState(null);
  const [managerChats, setManagerChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);

  const stompClientRef = useRef(null);
  const unreadClientRef = useRef(null);
  const activeChatRef = useRef(null);

  const currentUserId = String(localStorage.getItem("userId"));
  const role = localStorage.getItem("role");
  const normalizedRole = role?.replace("ROLE_", "").toUpperCase();

  const isStudent = normalizedRole === "STUDENT";
  const isStaff = normalizedRole === "ADMIN" || normalizedRole === "MANAGER";

  const notifyChatsUpdated = () => {
    window.dispatchEvent(new Event("chats-updated"));
  };

  const markChatAsRead = async (chatId) => {
    if (!chatId) return;

    try {
      await api.put(`/chats/${chatId}/read`);
      setRoomChat((prev) =>
        prev?.id === chatId ? { ...prev, unreadCount: 0 } : prev
      );
      setManagerChats((prev) =>
        prev.map((chat) =>
          chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
        )
      );
      notifyChatsUpdated();
    } catch (error) {
      console.log("MARK CHAT READ ERROR:", error);
    }
  };

  const fetchInitialChats = async () => {
    try {
      let firstChat = null;

      if (isStudent) {
        try {
          const roomResponse = await api.get("/chats/my-room");
          setRoomChat(roomResponse.data);
          firstChat = roomResponse.data;
        } catch (roomError) {
          console.log("NO ROOM CHAT YET:", roomError);
        }

        try {
          const managerResponse = await api.get("/chats/manager");
          setManagerChats([managerResponse.data]);

          if (!firstChat) {
            firstChat = managerResponse.data;
          }
        } catch (managerError) {
          console.log("MANAGER CHAT ERROR:", managerError);
        }
      }

      if (isStaff) {
        const response = await api.get("/chats/manager/all");
        const chats = response.data || [];
        setManagerChats(chats);

        if (chats.length > 0) {
          firstChat = chats[0];
        }
      }

      if (firstChat) {
        await openRealChat(firstChat);
      }
    } catch (error) {
      console.log("CHATS INIT ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshChatList = async () => {
    try {
      if (isStudent) {
        try {
          const roomResponse = await api.get("/chats/my-room");
          setRoomChat(roomResponse.data);
        } catch (error) {
          console.log("REFRESH ROOM CHAT ERROR:", error);
        }

        try {
          const managerResponse = await api.get("/chats/manager");
          setManagerChats([managerResponse.data]);
        } catch (error) {
          console.log("REFRESH MANAGER CHAT ERROR:", error);
        }
      }

      if (isStaff) {
        const response = await api.get("/chats/manager/all");
        setManagerChats(response.data || []);
      }

      notifyChatsUpdated();
    } catch (error) {
      console.log("REFRESH CHATS ERROR:", error);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const response = await api.get(`/chats/${chatId}/messages`);
      setMessages(response.data || []);
    } catch (error) {
      console.log("CHAT MESSAGES ERROR:", error);
      setMessages([]);
    }
  };

  const connectWebSocket = (chatId) => {
    if (!chatId) return;

    setConnected(false);

    if (stompClientRef.current) {
      stompClientRef.current.deactivate();
    }

    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      reconnectDelay: 5000,

      onConnect: () => {
        setConnected(true);

        client.subscribe(`/topic/chats/${chatId}`, async (socketMessage) => {
          const newMessage = JSON.parse(socketMessage.body);

          setMessages((prev) => {
            const exists = prev.some((item) => item.id === newMessage.id);
            if (exists) return prev;
            return [...prev, newMessage];
          });

          if (String(newMessage.senderId) !== currentUserId) {
            await markChatAsRead(chatId);
          }
        });
      },

      onDisconnect: () => {
        setConnected(false);
      },

      onStompError: (frame) => {
        console.log("STOMP ERROR:", frame);
        setConnected(false);
      },
    });

    stompClientRef.current = client;
    client.activate();
  };

  const connectUnreadSocket = () => {
    if (unreadClientRef.current) return;

    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      reconnectDelay: 5000,

      onConnect: () => {
        client.subscribe("/topic/chats/unread", async () => {
          await refreshChatList();
        });
      },

      onStompError: (frame) => {
        console.log("UNREAD STOMP ERROR:", frame);
      },
    });

    unreadClientRef.current = client;
    client.activate();
  };

  const openRealChat = async (chat) => {
    if (!chat) return;

    setActiveChat(chat);
    activeChatRef.current = chat;
    setMessage("");

    await fetchMessages(chat.id);
    await markChatAsRead(chat.id);
    connectWebSocket(chat.id);
  };

  const sendMessage = async () => {
    if (!message.trim() || !activeChat?.id) return;

    try {
      const response = await api.post(`/chats/${activeChat.id}/messages`, {
        message: message.trim(),
      });

      setMessages((prev) => {
        const exists = prev.some((item) => item.id === response.data.id);
        if (exists) return prev;
        return [...prev, response.data];
      });

      setMessage("");
      await markChatAsRead(activeChat.id);
    } catch (error) {
      console.log("SEND MESSAGE ERROR:", error);
      alert(error.response?.data?.message || "Failed to send message");
    }
  };

  useEffect(() => {
    fetchInitialChats();
    connectUnreadSocket();

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }

      if (unreadClientRef.current) {
        unreadClientRef.current.deactivate();
      }
    };
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="bg-white p-8 rounded-3xl shadow">
          <p className="text-gray-500">Loading chats...</p>
        </div>
      </DashboardLayout>
    );
  }

  const chats = [
    isStudent &&
      roomChat && {
        id: roomChat.id,
        title: roomChat.title,
        type: "Room chat",
        unreadCount: roomChat.unreadCount || 0,
        lastMessage:
          activeChat?.id === roomChat.id && messages.length > 0
            ? messages[messages.length - 1].message
            : "Room messages",
        real: true,
        data: roomChat,
      },

    ...managerChats.map((chat) => ({
      id: chat.id,
      title: isStaff
        ? chat.studentName || "Student Manager Chat"
        : "Manager Chat",
      type: isStaff ? "Student dormitory question" : "Dormitory questions",
      unreadCount: chat.unreadCount || 0,
      lastMessage:
        activeChat?.id === chat.id && messages.length > 0
          ? messages[messages.length - 1].message
          : isStaff
          ? "Open student manager chat."
          : "Ask manager about dormitory issues.",
      real: true,
      data: chat,
    })),

    {
      id: "ai",
      title: "AI Assistant",
      type: "Platform help",
      unreadCount: 0,
      lastMessage: "Ask how to use applications, QR, profile and room features.",
      real: false,
      data: null,
    },
  ].filter(Boolean);

  const selectedChat =
    chats.find((chat) => chat.id === activeChat?.id) || chats[0];

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Chats</h1>
        <p className="text-gray-500">
          Communicate with room members, dormitory manager and platform assistant.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-8 h-[650px]">
        <div className="bg-white rounded-3xl shadow overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Conversations</h2>
          </div>

          <div className="divide-y">
            {chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => {
                  if (!chat.real) return;
                  openRealChat(chat.data);
                }}
                className={`w-full text-left p-5 hover:bg-blue-50 transition ${
                  selectedChat?.id === chat.id ? "bg-blue-50" : ""
                } ${!chat.real ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold">{chat.title}</h3>

                  {chat.unreadCount > 0 && (
                    <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                      {chat.unreadCount}
                    </span>
                  )}
                </div>

                <p className="text-sm text-blue-600 font-medium mb-1">
                  {chat.type}
                </p>

                <p className="text-sm text-gray-500 line-clamp-1">
                  {chat.lastMessage}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="col-span-2 bg-white rounded-3xl shadow flex flex-col overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">
                {selectedChat?.title || "Chat"}
              </h2>

              <p className="text-sm text-gray-500">
                {selectedChat?.type || "-"}
              </p>
            </div>

            {selectedChat?.real ? (
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  connected
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {connected ? "Live" : "REST mode"}
              </span>
            ) : (
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                Coming soon
              </span>
            )}
          </div>

          <div className="flex-1 p-6 bg-gray-50 overflow-y-auto space-y-4">
            {!selectedChat?.real ? (
              <div className="text-center text-gray-500 mt-20">
                AI Assistant will be connected later.
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center text-gray-500 mt-20">
                No messages yet. Start the conversation.
              </div>
            ) : (
              messages.map((msg) => {
                const senderId = String(msg.senderId);
                const isOwn = senderId === currentUserId;

                return (
                  <div
                    key={msg.id}
                    className={`flex ${
                      isOwn ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[70%] p-4 rounded-2xl ${
                        isOwn
                          ? "bg-blue-600 text-white"
                          : "bg-white text-gray-900 border"
                      }`}
                    >
                      {!isOwn && (
                        <p className="text-xs font-bold text-gray-500 mb-1">
                          {msg.senderName}
                        </p>
                      )}

                      <p>{msg.message}</p>

                      <p
                        className={`text-xs mt-2 ${
                          isOwn ? "text-blue-100" : "text-gray-400"
                        }`}
                      >
                        {msg.createdAt}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="p-5 border-t flex gap-3">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={!selectedChat?.real}
              placeholder={
                selectedChat?.real
                  ? "Type your message..."
                  : "AI Assistant will be available later"
              }
              className="flex-1 border rounded-xl px-4 py-3 disabled:bg-gray-100"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />

            <button
              onClick={sendMessage}
              disabled={!selectedChat?.real}
              className="bg-blue-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-xl font-semibold"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
