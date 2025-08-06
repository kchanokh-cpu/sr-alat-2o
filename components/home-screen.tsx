"use client"

import { Button } from "@/components/ui/button"
import { GameState } from "@/app/page"

interface HomeScreenProps {
  onStateChange: (newState: GameState) => void
  playUISound: () => void
}

export default function HomeScreen({ onStateChange, playUISound }: HomeScreenProps) {
  const handleBeginMission = () => {
    playUISound()
    onStateChange("crawl")
  }

  const handleAbortOperation = () => {
    playUISound()
    // Could add confirmation dialog or just close/refresh
    window.location.reload()
  }

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center relative"
      style={{
        backgroundImage: "url('/backgrounds/kotoka-airport.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60" />
      
      {/* Content */}
      <div className="relative z-10 text-center space-y-8">
        {/* SRLUF Logo */}
        <div className="mb-8">
          <img 
            src="/srluf-emblem.png" 
            alt="SRLUF Emblem" 
            className="w-32 h-32 mx-auto mb-4"
          />
        </div>

        {/* Animated Title */}
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-green-400 animate-pulse tracking-wider">
            SEYGEREFLEX
          </h1>
          <h2 className="text-2xl text-green-300 font-semibold">
            MEMORY RETRIEVAL TRAINING SYSTEM
          </h2>
          <p className="text-green-200 text-lg max-w-2xl mx-auto">
            Service de Renseignement et de Liaison des Forces Unifiées
          </p>
        </div>

        {/* Mission Buttons */}
        <div className="space-y-4 pt-8">
          <Button
            onClick={handleBeginMission}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-xl font-semibold border-2 border-green-400 shadow-lg hover:shadow-green-400/50 transition-all duration-300"
          >
            BEGIN MISSION
          </Button>
          
          <div className="pt-4">
            <Button
              onClick={handleAbortOperation}
              variant="outline"
              className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white px-6 py-2 transition-all duration-300"
            >
              ABORT OPERATION
            </Button>
          </div>
        </div>

        {/* Status indicator */}
        <div className="pt-8 text-green-300 text-sm">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>SYSTEM READY</span>
          </div>
        </div>
      </div>
    </div>
  )
}
