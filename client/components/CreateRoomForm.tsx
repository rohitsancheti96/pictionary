"use client";

import React, { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components//ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createRoomSchema } from "@/lib/validations.ts/createRoom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import CopyButton from "./CopyButton";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/userStore";
import { useMemberStore } from "@/stores/memberStore";
import { socket } from "@/lib/socket";
import { RoomJoinedData } from "@/types/typing";
import { useToast } from "./ui/use-toast";
import { Loader2 } from "lucide-react";

type CreatRoomForm = z.infer<typeof createRoomSchema>;

function CreateRoomForm({ roomId }: { roomId: string }) {
  const router = useRouter();
  const { toast } = useToast();
  const setUser = useUserStore((state) => state.setUser);
  const setMembers = useMemberStore((state) => state.setMembers);

  const [isLoading, setIsLoading] = useState(false);

  function onSubmit({ username }: CreatRoomForm) {
    console.log({ username });
    setIsLoading(true);
    console.log({ roomId, username });
    socket.emit("create-room", { roomId, username });
  }

  const form = useForm<CreatRoomForm>({
    resolver: zodResolver(createRoomSchema),
    defaultValues: {
      username: "",
    },
  });

  useEffect(() => {
    socket.on("room-joined", ({ user, roomId, members }: RoomJoinedData) => {
      setUser(user);
      setMembers(members);
      router.replace(`/${roomId}`);
    });

    function handleErrorMessage({ message }: { message: string }) {
      toast({ title: "Failed to Join room!", description: message });
    }

    socket.on("room-not-found", handleErrorMessage);
    socket.on("invalid-data", handleErrorMessage);

    return () => {
      socket.off("room-joined");
      socket.off("room-not-found");
      socket.off("invalid-data");
    };
  }, [router, toast, setUser, setMembers]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">Username</FormLabel>
              <FormControl>
                <Input placeholder="johndoe" {...field} />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <div>
          <p className="mb-2 mt-2 text-sm font-medium">Room ID</p>

          <div className="flex h-10 w-full items-center justify-between rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground">
            <span>{roomId}</span>
            <CopyButton value={roomId} />
          </div>
        </div>
        <Button
          type="submit"
          className="mt-4 w-full bg-primary text-primary-foreground"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Create a Room"
          )}
        </Button>
      </form>
    </Form>
  );
}

export default CreateRoomForm;
