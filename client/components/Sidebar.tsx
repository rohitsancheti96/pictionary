import React from "react";
import MemberList from "./MemberList";
import LeaveRoom from "./LeaveRoom";
import StartGame from "./StartGame";
import ChatArea from "./ChatArea";

const Sidebar = () => {
  return (
    <aside className="border-l px-3 py-8 lg:block col-span-2">
      <div className="relative flex h-full w-full flex-col gap-6">
        <ChatArea />
        {/* <StartGame />
        <LeaveRoom /> */}
      </div>
    </aside>
  );
};

export default Sidebar;
