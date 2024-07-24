import { useEffect, useState } from "react";
import useSockets from "../../hooks/useSockets";
import { useNavigate } from "react-router-dom";
import { v1 as uuidv1 } from "uuid";

const Join = () => {
  const [RoomId, setRoomId] = useState("");
  const [username, setusername] = useState("");
  const { socket } = useSockets();
  const [RoomFulleror, setRoomError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (socket && socket?.connected) {
      socket.on("room not found", () => {
        setRoomError("Room not found");
      });
      socket.on("room created", (data) => {
        sessionStorage.setItem("userconnected", socket.id!);
        sessionStorage.setItem("userid", data?.userId);
        sessionStorage.setItem("isAdmin", data?.userId);
        sessionStorage.setItem("roomid", data?.roomId);
        navigate("/game");
      });
      socket.on("room joined", (data) => {
        sessionStorage.setItem("userconnected", socket.id!);
        sessionStorage.setItem("username", data?.username);
        sessionStorage.setItem("userid", data?.userId);
        sessionStorage.setItem("roomid", data?.roomId);
        navigate("/game");
      });
      socket.on("room full", () => {
        setRoomError("room full");
      });
    }
  }, [socket]);

  const joinRoom = () => {
    if (!RoomId || !username) {
      return;
    }
    socket.emit("join room", { roomId: RoomId, username, userId: uuidv1() });
    setRoomError("");
  };
  const createRoom = () => {
    socket.emit("create room", uuidv1());
  };
  return (
    <div>
      {RoomFulleror && <p className="text-red-700">Room is full</p>}
      <p>Join a room Or create a room.</p>
      <div>
        <input
          value={RoomId}
          onChange={(e) => setRoomId(e.target.value)}
          type="text"
        />
        <input
          value={username}
          onChange={(e) => setusername(e.target.value)}
          type="text"
        />
        <button onClick={joinRoom}> Join </button>
        <p>or</p>
        <button onClick={() => createRoom()}> Create</button>
      </div>
    </div>
  );
};

export default Join;
