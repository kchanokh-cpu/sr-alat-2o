"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { GameState, GameStats } from "@/app/page"

interface MissionEndScreenProps {
  onStateChange: (newState: GameState) => void
  playUISound: () => void
  gameStats: GameStats
  resetGame: () => void
}

export default function MissionEndScreen({ onStateChange, playUISound, gameStats, resetGame }: MissionEndScreenProps) {
  const missionEndRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    // Play mission end audio
    if (missionEndRef.current) {
      missionEndRef.current.play().catch(console.error)
    }
  }, [])

  const getMissionTime = () => {
    if (gameStats.missionStartTime && gameStats.missionEndTime) {
      const seconds = Math.floor((gameStats.missionEndTime - gameStats.missionStartTime) / 1000)
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
    }
    return "0:00"
  }

  const getMemoryRetrievalSpeed = () => {
    if (gameStats.totalRetries <= 1) return "High"
    if (gameStats.totalRetries <= 3) return "Medium"
    return "Low"
  }

  const getRecommendedReplays = () => {
    const mrs = getMemoryRetrievalSpeed()
    if (mrs === "High") return 1
    if (mrs === "Medium") return 2
    return 3
  }

  const restartMission = () => {
    playUISound()
    resetGame()
    onStateChange("game")
  }

  const returnToTitle = () => {
    playUISound()
    resetGame()
    onStateChange("title")
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center relative flex items-center justify-center p-4"
      style={{ backgroundImage: "url('/backgrounds/legon-campus-satellite.jpg')" }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Mission End Audio */}
      <audio ref={missionEndRef} preload="auto">
        <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Lenoir%20Mission%201%20End-lE3sVqPFmLzECKR3EfWu083TwEXzvP.mp3" type="audio/mpeg" />
      </audio>

      <Card className="max-w-2xl w-full p-8 text-center bg-slate-800/90 border-green-500 border-2 relative z-10">
        <div className="text-6xl mb-4">🎯</div>
        <h1 className="text-3xl font-bold text-green-400 mb-6">Mission Accomplished</h1>

        {/* Mission Stats */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-700/80 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-400">{getMissionTime()}</div>
            <div className="text-sm text-slate-400">Mission Time</div>
          </div>
          <div className="bg-slate-700/80 p-4 rounded-lg">
            <div className="text-2xl font-bold text-yellow-400">{getMemoryRetrievalSpeed()}</div>
            <div className="text-sm text-slate-400">Memory Retrieval Speed</div>
          </div>
        </div>

        {/* Completed Phrases */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-green-300 mb-4">Phrases Mastered:</h3>
          <div className="space-y-2">
            {gameStats.completedPhrases.map((phrase, index) => (
              <div key={index} className="bg-slate-700/80 p-2 rounded text-sm text-slate-300">
                "{phrase}"
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="mb-8 p-4 bg-blue-900/30 border border-blue-400 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-300 mb-2">Training Recommendation:</h3>
          <p className="text-slate-300">
            Replay this scenario {getRecommendedReplays()} more time{getRecommendedReplays() > 1 ? "s" : ""} to
            achieve optimal memory consolidation.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={restartMission}
            onMouseEnter={playUISound}
            className="bg-green-600 hover:bg-green-700 px-6 py-3"
          >
            🔄 Replay Mission
          </Button>
          <Button
            onClick={returnToTitle}
            onMouseEnter={playUISound}
            variant="outline"
            className="border-slate-600 hover:bg-slate-700 px-6 py-3 bg-transparent"
          >
            🏠 Return to Title
          </Button>
        </div>

        <div className="text-sm text-slate-400 mt-6">Next Mission: Campus Infiltration - Coming Soon</div>
      </Card>
    </div>
  )
}
