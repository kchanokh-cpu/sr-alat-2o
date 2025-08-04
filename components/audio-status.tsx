"use client"

import { Volume2 } from "lucide-react"

interface AudioStatusProps {
  isPlaying: boolean
  currentAudio?: string
  speaker?: "lenoir" | "kouassi" | "user"
}

export function AudioStatus({ isPlaying, currentAudio, speaker }: AudioStatusProps) {
  if (!isPlaying) return null

  const getSpeakerColor = () => {
    switch (speaker) {
      case "lenoir":
        return "text-blue-400"
      case "kouassi":
        return "text-yellow-400"
      default:
        return "text-green-400"
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-600 rounded-lg p-3 flex items-center space-x-2">
        <Volume2 className={`w-4 h-4 animate-pulse ${getSpeakerColor()}`} />
        <span className="text-white text-sm font-medium">
          {speaker === "lenoir" ? "Commandant Lenoir" : speaker === "kouassi" ? "Kouassi" : "Audio"} speaking...
        </span>
      </div>
    </div>
  )
}
