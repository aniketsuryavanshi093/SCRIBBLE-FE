import { useEffect, useState } from "react";
import useSockets from "../../hooks/useSockets";
import { toast } from "react-toastify";
import CanvasDrawer from "./CanvasDrawer";
import { User } from "../../types/socketType";

const Game = () => {
  const { socket } = useSockets();
  const [gameStopped, setgameStopped] = useState(false);
  const [UserList, setUserList] = useState<User[] | null>(null);
  useEffect(() => {
    if (socket && socket.connected) {
      if (sessionStorage.getItem("userconnected")) {
        socket.emit("join room", {
          roomId: sessionStorage.getItem("roomid"),
          username: sessionStorage.getItem("username"),
          userId: sessionStorage.getItem("userid"),
        });
      }
      socket.on("game stopped", () => {
        toast.error("Game Stopped by admin");
        setgameStopped(true);
        setUserList(null);
      });
      socket.on("user list", (data) => {
        setUserList(data);
      });
      socket.on("user joined", ({ username }) => {
        toast.success(`${username} joined`);
      });
      socket.emit("get user list", sessionStorage.getItem("roomid"));
    }
  }, [socket]);
  console.log(UserList);
  const stopGame = () => {
    socket.emit("stop game", sessionStorage.getItem("roomid"));
  };
  return (
    <div>
      {gameStopped ? (
        <div className="flex justify-center items-center h-screen">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="flex justify-center items-center h-screen">
              <h1 className="text-3xl font-bold">Game Stopped</h1>
            </div>
          </div>
        </div>
      ) : (
        <>
          <p className="text-red-500">
            Game (room ID : {sessionStorage.getItem("roomid")})
            {sessionStorage.getItem("isAdmin") ===
              sessionStorage.getItem("userid") && (
              <button className="" onClick={stopGame}>
                Stop game
              </button>
            )}
          </p>
          <div className="flex justify-center gap-7 items-center ">
            <CanvasDrawer UserList={UserList ?? []} />
            <div className="bg-gray-100 w-1/2">
              <div className="max-w-sm mx-auto my-10">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                  <ul className="divide-y divide-gray-200">
                    {UserList?.map((el) => (
                      <li className="p-3 flex justify-between items-center user-card">
                        <div className="flex items-center">
                          <img
                            className="w-10 h-10 rounded-full"
                            src="https://unsplash.com/photos/oh0DITWoHi4/download?force=true&w=640"
                            alt="Christy"
                          />
                          <span className="ml-3 font-medium">
                            {el.username}
                          </span>
                        </div>
                        <div>
                          <button className="text-gray-500 hover:text-gray-700">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M4 6h16M4 12h16m-7 6h7"
                              />
                            </svg>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Game;
