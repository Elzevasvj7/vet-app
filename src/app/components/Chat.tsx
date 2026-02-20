"use client";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { PawPrint, PawPrintIcon, User } from "lucide-react";
import React from "react";
export const Chat = () => {
  const { messages, status, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });
  const [input, setInput] = React.useState("");
  return (
    <div className="flex flex-col items-center w-full">
      {/* Mensajes */}
      {/* Input */}
      <div className="max-h-72 overflow-y-auto flex flex-col gap-2 p-2 w-full">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex w-full text-gray-600 ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.parts.map((part, index) =>
              part.type === "text" ? (
                <div
                  key={index}
                  className={`flex gap-1 items-end ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div className="rounded-full bg-gray-200 p-2 flex items-center justify-center w-10 h-10">
                    {message.role === "user" ? <User /> : <PawPrint />}
                  </div>
                  <p
                    className={`bg-amber-100 rounded-2xl p-4 flex-1 w-auto ${
                      message.role === "user"
                        ? "rounded-br-none"
                        : "rounded-bl-none"
                    }`}
                  >
                    {part.text}
                  </p>
                </div>
              ) : null
            )}
          </div>
        ))}
      </div>
      {
        status !== "ready" &&
        <div className="flex w-full mt-4 items-center gap-2">
         <PawPrint /> <p className="bg-amber-100 rounded-2xl p-4 w-full animate-pulse">Pensando...</p>
        </div>
      }
      <form
        className="w-full mt-4"
        action=""
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage({ text: input });
          setInput("");
        }}
      >
        <div className="w-full">
          <input
            className="w-full p-2 border-2 border-gray-300 rounded-2xl"
            value={input}
            type="text"
            placeholder="Escribe aquí..."
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="mt-2 flex justify-end">
            <button className="p-2 bg-amber-100 rounded-2xl">Enviar</button>
          </div>
        </div>
      </form>
    </div>
  );
};
