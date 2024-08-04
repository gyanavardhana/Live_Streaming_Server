import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
import { useNavigate } from "react-router-dom";

export default function Viewer() {
  const [viewerCount, setViewerCount] = useState(0);
  const [messages, setMessages] = useState([]);
  const [soundMuted, setSoundMuted] = useState(true);
  const videoRef = useRef(null);
  const messageInputRef = useRef(null);
  const messageListRef = useRef(null);
  const socketRef = useRef(null);
  const peerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_APP_SERVER, {
      transports: ["websocket"],
    });

    peerRef.current = new Peer(undefined, {
      host: import.meta.env.VITE_APP_PEER,
    });

    const peerClient = peerRef.current;
    const socket = socketRef.current;

    socket.on("connect", () => {
      console.log("Connected as viewer");
    });

    socket.on("viewer-count", (count) => {
      setViewerCount(count);
    });

    socket.on("new-message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on("backfill-messages", (existingMessages) => {
      setMessages(existingMessages);
    });

    socket.on("streamer-disconnected", () => {
      setTimeout(() => window.location.reload(), 2000);
    });

    socket.on("streamer-joined", () => {
      setTimeout(() => window.location.reload(), 2000);
    });

    peerClient.on("open", (viewerId) => {
      socket.emit("join-as-viewer", viewerId);
    });

    peerClient.on("call", (call) => {
      call.answer();
      call.on("stream", (stream) => {
        if (videoRef.current) {
          addVideoStream(videoRef.current, stream);
        }
      });
    });

    peerClient.on("connection", (conn) => {
      conn.on("close", () => {
        setTimeout(() => window.location.reload(), 1000);
      });
    });

    return () => {
      peerClient.destroy();
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
      video.play();
    });
  }

  function handleSendMessage() {
    if (messageInputRef.current.value.trim() !== "") {
      const messageText = messageInputRef.current.value;
      socketRef.current.emit("add-message-to-live-chat", messageText);
      messageInputRef.current.value = "";
    }
  }

  function handleKeyPress(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSendMessage();
    }
  }

  function handleToggleSound() {
    if (videoRef.current) {
      videoRef.current.muted = !soundMuted;
      setSoundMuted(!soundMuted);
    }
  }

  return (
    <div className="h-screen bg-gradient-to-br from-purple-100 to-indigo-200 flex flex-col overflow-auto">
      <nav className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg shadow-md p-4 flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-indigo-600">StreamHub</h1>
        <div className="flex items-center space-x-4">
          <span className="text-indigo-800 font-semibold">
            Viewers: {viewerCount}
          </span>
          <button
            onClick={() => navigate("/")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
          >
            Home
          </button>
          <button
            onClick={handleToggleSound}
            className={`px-4 py-2 rounded-full transition duration-300 ease-in-out transform hover:scale-105 ${
              soundMuted
                ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                : "bg-purple-500 hover:bg-purple-600 text-white"
            }`}
          >
            {soundMuted ? "Unmute" : "Mute"}
          </button>
        </div>
      </nav>

      <div className="flex flex-col md:flex-row flex-1 p-4 space-x-0 md:space-x-4 space-y-4 md:space-y-0 overflow-auto">
        <div className="w-full md:w-2/3 bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl p-4">
          <video
            ref={videoRef}
            id="videoplayer"
            className="w-full h-full object-cover rounded-2xl"
            muted={soundMuted}
          ></video>
        </div>

        <div className="w-full md:w-1/3 bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl p-4 flex flex-col">
          <div className="flex-1 overflow-y-auto mb-4" ref={messageListRef}>
            <ul className="space-y-2">
              {messages.map((msg, index) => (
                <li key={index} className="p-3 bg-indigo-100 rounded-lg">
                  <div className="message-text text-indigo-800">{msg.text}</div>
                  <div className="message-time text-xs text-indigo-600">
                    {new Date(msg.date).toLocaleDateString()}{" "}
                    {new Date(msg.date).toLocaleTimeString()}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex">
            <input
              ref={messageInputRef}
              type="text"
              placeholder="Type a message"
              onKeyUp={handleKeyPress}
              className="flex-grow p-2 border border-indigo-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleSendMessage}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-r-full transition duration-300 ease-in-out"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
