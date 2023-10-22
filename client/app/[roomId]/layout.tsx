import Headers from "@/components/Headers";
import Sidebar from "@/components/Sidebar";
import React, { ReactNode } from "react";

interface Props {
  children: React.ReactNode;
}

const Roomlayout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <Headers />
      <div className="h-screen">
        <main className="h-full">{children}</main>

        <Sidebar />
      </div>
    </>
  );
};

export default Roomlayout;
