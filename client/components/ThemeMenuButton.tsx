"use client";
import { useTheme } from "next-themes";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Laptop, Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const ThemeMenuButton = (props: React.HTMLAttributes<HTMLButtonElement>) => {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-9"
          aria-label="Switch theme"
          {...props}
        >
          <Sun size={18} className="inline-block dark:hidden"></Sun>
          <Moon size={18} className="hidden dark:inline-block"></Moon>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="top" align="end">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className={cn(theme === "light" && "bg-accent")}
        >
          <Sun className="mr-2 h-4 w-4"></Sun>
          <span>Light</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className={cn(theme === "dark" && "bg-accent")}
        >
          <Moon className="mr-2 h-4 w-4"></Moon>
          <span>Dark</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className={cn(theme === "system" && "bg-accent")}
        >
          <Laptop className="mr-2 h-4 w-4"></Laptop>
          <span>System</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeMenuButton;
