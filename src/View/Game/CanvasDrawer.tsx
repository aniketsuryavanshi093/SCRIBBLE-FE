/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import React, { FC, useEffect, useRef, useState } from "react";
import { User } from "../../types/socketType";
import useSockets from "../../hooks/useSockets";

const CanvasDrawer: FC<{ UserList: User[] | null }> = ({ UserList }) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);
  const [isDrawer, setIsDrawer] = useState(false);
  const [color, setColor] = useState("black");
  const { socket } = useSockets();
  const startDrawing = (e: any) => {
    if (!isDrawer) return;
    setIsDrawing(true);
    draw(e);
  };
  useEffect(() => {
    if (socket && socket?.connected) {
      socket.on("draw", (data) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d")!;
        drawLine(ctx, data.x, data.y, data.color);
        console.log(data);
      });
    }
  }, [socket]);

  console.log(isDrawer, "isDrawer");

  useEffect(() => {
    if (UserList?.length) {
      if (
        UserList.find(
          (user) => user.userId === sessionStorage.getItem("userid")
        )?.isDrawer
      ) {
        setIsDrawer(true);
      } else {
        setIsDrawer(false);
      }
    }
  }, [UserList]);

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.beginPath();
  };

  const draw = (e: { clientX: number; clientY: number }) => {
    if (!isDrawing || !isDrawer) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d")!;
    const rect = canvas?.getBoundingClientRect()!;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    drawLine(ctx, x, y, color);
    socket.emit("draw", {
      x,
      y,
      color,
      roomId: sessionStorage.getItem("roomid"),
    });
    // socket.emit("draw", {
    //   x,
    //   y,
    //   color,
    //   roomId: sessionStorage.getItem("roomid"),
    // });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const drawLine = (
    ctx: {
      lineWidth: number;
      lineCap: string;
      strokeStyle: any;
      lineTo: (arg0: any, arg1: any) => void;
      stroke: () => void;
      beginPath: () => void;
      moveTo: (arg0: any, arg1: any) => void;
    },
    x: number,
    y: number,
    color: any
  ) => {
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = color;
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  return (
    <div>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{
          border: "1px solid black",
          display: sessionStorage.getItem("roomid") ? "block" : "none",
        }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
      />
      {/* Color picker placeholder for future implementation */}
      <div>
        <label>
          Color:
          <select value={color} onChange={(e) => setColor(e.target.value)}>
            <option value="black">Black</option>
            <option value="red">Red</option>
            <option value="blue">Blue</option>
            <option value="green">Green</option>
          </select>
        </label>
      </div>
    </div>
  );
};

export default CanvasDrawer;
