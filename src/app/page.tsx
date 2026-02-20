import Image from "next/image";
import { Chat } from "./components/Chat";
import { PawPrintIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[50px_1fr] items-center justify-items-center min-h-screen p-8 pb-20 gap-5 sm:p-10">
       <h1 className="text-2xl font-bold text-center flex items-center gap-2 text-gray-800">
        Vet App Ai <PawPrintIcon />
      </h1>
      <Chat />
    </div>
  );
}
