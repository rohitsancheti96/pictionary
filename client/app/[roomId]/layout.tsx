"use client";
import Headers from "@/components/Headers";
import MemberList from "@/components/MemberList";
import Sidebar from "@/components/Sidebar";
import { socket } from "@/lib/socket";
import { useUserStore } from "@/stores/userStore";
import { redirect } from "next/navigation";
import React, { useEffect, useLayoutEffect } from "react";

interface Props {
  children: React.ReactNode;
}

const Roomlayout: React.FC<Props> = ({ children }) => {
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    if (!user) {
      redirect("/");
    }
  }, [user]);

  if (!user) return null;

  return (
    <>
      <Headers />
      <div className="h-[calc(100vh-3.8rem)] grid grid-cols-12 gap-4">
        <MemberList />
        <main className="h-full col-span-8">{children}</main>

        <Sidebar />
      </div>
    </>
  );
};

export default Roomlayout;
