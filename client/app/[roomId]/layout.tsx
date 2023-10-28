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
      <div className="h-[calc(100vh-3.8rem) lg:grid lg:grid-cols-[minmax(0,1fr)_15.5rem]">
        <main className="h-full">{children}</main>

        <Sidebar />
      </div>
    </>
  );
};

export default Roomlayout;
