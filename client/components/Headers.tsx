"use client";
import React from "react";
import SaveButton from "./SaveButton";
import ThemeMenuButton from "./ThemeMenuButton";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { PanelRightOpen } from "lucide-react";
import { Button } from "./ui/button";
import RightPanel from "./RightPanel";
import { useGameStore } from "@/stores/useGame";
import Countdown from "./Countdown";
import { useUserStore } from "@/stores/userStore";

const Headers = () => {
  const [turn] = useGameStore((state) => [state.turn]);
  const user = useUserStore((state) => state.user);

  return (
    <header className="sticky top-0 z-40 w-full select-none border-b bg-background/80 saturate-200 backdrop-blur-sm">
      <div className="container flex items-center justify-between py-3">
        <h2 className="text-lg font-medium">Pictionary</h2>

        <div className="flex items-center gap-3 md:gap-4">
          {turn?.id === user?.id && <Countdown />}
          <SaveButton />

          <ThemeMenuButton />
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="flex h-9 lg:hidden"
                aria-label="Open right panel"
              >
                <PanelRightOpen size={20} />
              </Button>
            </SheetTrigger>

            <SheetContent className="w-[17rem">
              <RightPanel />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Headers;
