import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
import { useNavigate } from "react-router-dom";

export default function Broadcaster() {
  const videoRef = useRef(null);
  const messageInputRef = useRef(null);
  const messageListRef = useRef(null);
  const peerClientRef = useRef(null);
  const socketRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [stream, setStream] = useState(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_APP_SERVER, {
      transports: ["websocket"],
    });

    peerClientRef.current = new Peer(undefined, {
      host: import.meta.env.VITE_APP_PEER,
    });

    const peerClient = peerClientRef.current;
    const socket = socketRef.current;

    socket.on("new-message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on("backfill-messages", (existingMessages) => {
      setMessages(existingMessages);
    });

    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        setStream(stream);
        if (videoRef.current) {
          addVideoStream(videoRef.current, stream);
        }

        socket.on("viewer-connected", (viewerId) => {
          connectToNewViewer(viewerId, stream);
        });
      })
      .catch((err) => console.log("Failed to get user media", err));

    peerClient.on("open", (streamerId) => {
      socket.emit("join-as-streamer", streamerId);
    });

    peerClient.on("close", () => {
      socket.emit("disconnect-as-streamer", peerClient.id);
    });

    socket.on("disconnect", () => {
      socket.emit("disconnect-as-streamer", peerClient.id);
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

  function connectToNewViewer(viewerId, stream) {
    peerClientRef.current.call(viewerId, stream);
  }

  function toggleVideo() {
    const videoTrack = stream.getVideoTracks()[0];
    videoTrack.enabled = !videoTrack.enabled;
    setIsVideoEnabled(videoTrack.enabled);
  }

  function toggleAudio() {
    const audioTrack = stream.getAudioTracks()[0];
    audioTrack.enabled = !audioTrack.enabled;
    setIsAudioEnabled(audioTrack.enabled);
  }

  return (
    <div className="h-screen bg-gradient-to-br from-purple-100 to-indigo-200 flex flex-col overflow-auto">
      <nav className="bg-white bg-opacity-90 backdrop-filter backdrop-blur-lg shadow-md p-4 flex justify-between items-center">
        <h1 className="text-3xl font-extrabold text-indigo-600">StreamHub</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate("/")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
          >
            Home
          </button>
          <button
            className={`px-4 py-2 rounded-full transition duration-300 ease-in-out transform hover:scale-105 ${
              isVideoEnabled
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
            onClick={toggleVideo}
          >
            {isVideoEnabled ? "Stop Video" : "Start Video"}
          </button>
          <button
            className={`px-4 py-2 rounded-full transition duration-300 ease-in-out transform hover:scale-105 ${
              isAudioEnabled
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
            }`}
            onClick={toggleAudio}
          >
            {isAudioEnabled ? "Mute" : "Unmute"}
          </button>
        </div>
      </nav>

      <div className="flex flex-col md:flex-row flex-1 p-4 space-x-0 md:space-x-4 space-y-4 md:space-y-0 overflow-auto">
        <div className="w-full md:w-2/3 bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl p-4">
          <video
            ref={videoRef}
            id="videoRecording"
            muted
            className="w-full h-full object-cover rounded-2xl"
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
          <div className="mt-4">
            <input
              ref={messageInputRef}
              type="text"
              placeholder="Type your message..."
              className="w-full p-2 border border-gray-300 rounded-md"
              onKeyPress={(e) => {
                if (e.key === "Enter" && messageInputRef.current.value.trim()) {
                  socketRef.current.emit(
                    "add-message-to-live-chat",
                    messageInputRef.current.value.trim()
                  );
                  messageInputRef.current.value = "";
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
