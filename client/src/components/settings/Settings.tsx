"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Settings, User, LogOut, Moon, Sun, ChevronRight, ChevronLeft } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useTheme } from "next-themes"

export default function SettingsPanel() {
  const [expanded, setExpanded] = useState(false)
  const { theme, setTheme } = useTheme()

  return (
    <div
      className={`${
        expanded ? "w-64" : "w-16"
      } h-full bg-card border-r border-border transition-all duration-300 flex flex-col justify-between p-2`}
    >
      <div className="flex flex-col items-center gap-4 pt-2">
        

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-full ${expanded ? "w-full justify-start px-4" : ""}`}
              >
                {expanded ? (
                  <>
                    <User className="h-5 w-5 mr-2" />
                    <span>Profile</span>
                  </>
                ) : (
                  <User className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            {!expanded && <TooltipContent side="right">Profile</TooltipContent>}
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-full ${expanded ? "w-full justify-start px-4" : ""}`}
              >
                {expanded ? (
                  <>
                    <Settings className="h-5 w-5 mr-2" />
                    <span>Settings</span>
                  </>
                ) : (
                  <Settings className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            {!expanded && <TooltipContent side="right">Settings</TooltipContent>}
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={`rounded-full ${expanded ? "w-full justify-start px-4" : ""}`}
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {expanded ? (
                  <>
                    {theme === "dark" ? <Sun className="h-5 w-5 mr-2" /> : <Moon className="h-5 w-5 mr-2" />}
                    <span>Theme</span>
                  </>
                ) : theme === "dark" ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            {!expanded && <TooltipContent side="right">Toggle Theme</TooltipContent>}
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="mb-4">
        {expanded ? (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 px-2">
              <Avatar>
                <AvatarImage
                  src="https://gravatar.com/avatar/1c8e8a6e8d1fe52b782b280909abeb38?s=400&d=robohash&r=x"
                  alt="User"
                />
                <AvatarFallback>UN</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">User Name</span>
                <span className="text-xs text-muted-foreground">user@example.com</span>
              </div>
            </div>
            <Button variant="destructive" size="sm" className="mt-2">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="https://gravatar.com/avatar/1c8e8a6e8d1fe52b782b280909abeb38?s=400&d=robohash&r=x"
                      alt="User"
                    />
                    <AvatarFallback>UN</AvatarFallback>
                  </Avatar>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">Your Profile</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  )
}
