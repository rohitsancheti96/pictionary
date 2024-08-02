"use client";
import { useGameStore } from "@/stores/useGame";
import React, { useEffect } from "react";
import { Input } from "./ui/input";
import { Form } from "./ui/form";
import { useUserStore } from "@/stores/userStore";
import { socket } from "@/lib/socket";

function ChatArea() {
  const [messages, setMessages] = useGameStore((state) => [
    state.messages,
    state.setMessages,
  ]);
  const LoggedInUser = useUserStore((state) => state.user);
  const [text, setText] = React.useState("");
  const word = useGameStore((state) => state.word);

  useEffect(() => {
    console.log("receive-message");
    socket.on("receive-message", (data) => {
      const res = JSON.parse(data);
      setMessages([...messages, res]);
    });
  }, [messages]);

  if (LoggedInUser)
    return (
      <div>
        <div className="h-[300px] w-full bg-[#f5f5f5]">
          {messages.map(({ user, message }) => (
            <div key={user.id}>
              {user.username}:{" "}
              {word === message && user.id !== LoggedInUser.id
                ? "*******"
                : message}
            </div>
          ))}
        </div>
        <Input
          placeholder="Enter message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setMessages([...messages, { user: LoggedInUser, message: text }]);
              socket.emit("send-message", {
                user: LoggedInUser,
                message: text,
              });
              setText("");
            }
          }}
        />
      </div>
    );
}

export default ChatArea;
