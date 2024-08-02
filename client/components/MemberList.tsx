"use client";

import { useMemberStore } from "@/stores/memberStore";
import { useEffect } from "react";
import { toast } from "./ui/use-toast";
import { socket } from "@/lib/socket";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function MemberList() {
  const [members, setMembers] = useMemberStore((state) => [
    state.members,
    state.setMembers,
  ]);

  useEffect(() => {
    socket.on("update-members", (members) => {
      setMembers(members);
    });

    socket.on("send-notification", ({ title, message }) => {
      toast({ title, description: message });
    });
  }, [toast, setMembers]);

  return (
    <aside className="border-r px-6 py-8 lg:block col-span-2">
      <div className="relative flex h-full w-[12.5rem] flex-col gap-6">
        <div className="my-6 select-none">
          <h2 className="pb-2.5 font-medium">Members</h2>

          <ScrollArea className="h-48">
            <ul className="flex flex-col gap-1 rounded-md px-1">
              {members.map(({ id, username }) => (
                <li key={id}>{username}</li>
              ))}
            </ul>
          </ScrollArea>
        </div>
      </div>
    </aside>
  );
}
