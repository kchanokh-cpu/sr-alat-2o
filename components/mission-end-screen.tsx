"use client"

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
  const getMissionDuration = () => {
    if (gameStats.missionStartTime && gameStats.missionEndTime) {
      const duration = gameStats.missionEndTime - gameStats.missionStartTime
      const minutes = Math.floor(duration / 60000)
      const seconds = Math.floor((duration % 60000) / 1000)
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }
    return "N/A"
  }

  const getPerformanceRating = () => {
    const retries = gameStats.totalRetries
    if (retries === 0) return { rating: "EXCELLENT", color: "text-green-400", emoji: "🏆" }
    if (retries <= 2) return { rating: "GOOD", color: "text-blue-400", emoji: "👍" }
    if (retries <= 5) return { rating: "FAIR", color: "text-yellow-400", emoji: "⚠️" }
    return { rating: "NEEDS IMPROVEMENT", color: "text-red-400", emoji: "📚" }
  }

  const performance = getPerformanceRating()

  const playAgain = () => {
    playUISound()
    resetGame()
    onStateChange("title")
  }

  const quitGame = () => {
    playUISound()
    window.close()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 text-center bg-slate-800 border-green-500 border-2">
        <div className="space-y-6">
          {/* Mission Complete Header */}
          <div>
            <div className="text-6xl mb-4">🎯</div>
            <h1 className="text-3xl font-bold text-green-400 mb-2">Mission Complete</h1>
            <p className="text-slate-300 text-lg">En route to UG Campus…</p>
          </div>

          {/* Mission Stats */}
          <div className="bg-slate-900/50 rounded-lg p-6 space-y-4">
            <h2 className="text-xl font-semibold text-white mb-4">Mission Statistics</h2>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-slate-800/50 p-3 rounded">
                <div className="text-slate-400">Duration</div>
                <div className="text-white font-mono text-lg">{getMissionDuration()}</div>
              </div>
              
              <div className="bg-slate-800/50 p-3 rounded">
                <div className="text-slate-400">Retries</div>
                <div className="text-white font-mono text-lg">{gameStats.totalRetries}</div>
              </div>
              
              <div className="bg-slate-800/50 p-3 rounded">
                <div className="text-slate-400">Phrases Completed</div>
                <div className="text-white font-mono text-lg">{gameStats.completedPhrases.length}</div>
              </div>
              
              <div className="bg-slate-800/50 p-3 rounded">
                <div className="text-slate-400">Performance</div>
                <div className={`font-bold text-lg ${performance.color}`}>
                  {performance.emoji} {performance.rating}
                </div>
              </div>
            </div>
          </div>

          {/* Completed Phrases */}
          {gameStats.completedPhrases.length > 0 && (
            <div className="bg-slate-900/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-3">Phrases Mastered</h3>
              <div className="space-y-2 text-left">
                {gameStats.completedPhrases.map((phrase, index) => (
                  <div key={index} className="bg-slate-800/50 p-2 rounded text-green-300 text-sm">
                    "{phrase}"
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mission Status */}
          <div className="text-sm text-slate-400 space-y-1">
            <div>Mission Status: <span className="text-green-400 font-semibold">SUCCESS</span></div>
            <div>Agent Status: <span className="text-blue-400 font-semibold">COVER INTACT</span></div>
            <div>Next Objective: <span className="text-yellow-400 font-semibold">CAMPUS INFILTRATION</span></div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              onClick={playAgain}
              onMouseEnter={playUISound}
              className="bg-green-600 hover:bg-green-500 text-white px-8 py-3 text-lg font-semibold"
            >
              🔄 Play Again
            </Button>

            <Button
              onClick={quitGame}
              onMouseEnter={playUISound}
              variant="outline"
              className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white px-8 py-3 text-lg font-semibold"
            >
              🚪 Exit
            </Button>
          </div>

          {/* Footer */}
          <div className="text-xs text-slate-500 pt-4 border-t border-slate-700">
            SeyGe Reflex™ Training Simulation • SRLUF Internal Use Only
          </div>
        </div>
      </Card>
    </div>
  )
}
