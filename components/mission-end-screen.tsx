"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { GameState, GameStats } from "@/app/page"

interface MissionEndScreenProps {
  onStateChange: (newState: GameState) => void
  playUISound: () => void
  gameStats: GameStats
  onResetGame: () => void
}

export default function MissionEndScreen({ 
  onStateChange, 
  playUISound, 
  gameStats, 
  onResetGame 
}: MissionEndScreenProps) {
  
  const calculateMissionTime = () => {
    if (gameStats.missionStartTime && gameStats.missionEndTime) {
      const duration = gameStats.missionEndTime - gameStats.missionStartTime
      const minutes = Math.floor(duration / 60000)
      const seconds = Math.floor((duration % 60000) / 1000)
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }
    return "00:00"
  }

  const calculateMemorySpeed = () => {
    const phrasesCount = gameStats.completedPhrases.length
    if (gameStats.missionStartTime && gameStats.missionEndTime && phrasesCount > 0) {
      const duration = (gameStats.missionEndTime - gameStats.missionStartTime) / 1000
      const speed = (phrasesCount / duration * 60).toFixed(1) // phrases per minute
      return `${speed} phrases/min`
    }
    return "0.0 phrases/min"
  }

  const getPerformanceRating = () => {
    const retries = gameStats.totalRetries
    if (retries === 0) return { rating: "EXCELLENT", color: "text-green-400", message: "Flawless execution, Agent." }
    if (retries <= 2) return { rating: "GOOD", color: "text-blue-400", message: "Solid performance with minor adjustments." }
    if (retries <= 5) return { rating: "SATISFACTORY", color: "text-yellow-400", message: "Acceptable, but room for improvement." }
    return { rating: "NEEDS IMPROVEMENT", color: "text-red-400", message: "Additional training recommended." }
  }

  const handleReplayMission = () => {
    playUISound()
    onResetGame()
    onStateChange("crawl")
  }

  const handleReturnToTitle = () => {
    playUISound()
    onResetGame()
    onStateChange("title")
  }

  const performance = getPerformanceRating()

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center relative"
      style={{
        backgroundImage: "url('/backgrounds/legon-campus-satellite.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/80" />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <img 
            src="/srluf-emblem.png" 
            alt="SRLUF Emblem" 
            className="w-24 h-24 mx-auto mb-4"
          />
          <h1 className="text-4xl font-bold text-green-400 mb-2">
            MISSION ACCOMPLISHED
          </h1>
          <p className="text-green-300 text-lg">
            Operation SEYGEREFLEX Complete
          </p>
        </div>

        {/* Mission Statistics */}
        <Card className="bg-black/80 border-green-500 mb-6">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold text-green-400 mb-4 text-center">
              MISSION STATISTICS
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <h3 className="text-green-300 font-semibold mb-2">Mission Time</h3>
                <p className="text-white text-2xl font-mono">{calculateMissionTime()}</p>
              </div>
              
              <div>
                <h3 className="text-green-300 font-semibold mb-2">Phrases Mastered</h3>
                <p className="text-white text-2xl font-mono">{gameStats.completedPhrases.length}</p>
              </div>
              
              <div>
                <h3 className="text-green-300 font-semibold mb-2">Memory Retrieval Speed</h3>
                <p className="text-white text-xl font-mono">{calculateMemorySpeed()}</p>
              </div>
            </div>

            <div className="mt-6 text-center">
              <h3 className="text-green-300 font-semibold mb-2">Total Retries</h3>
              <p className="text-white text-2xl font-mono">{gameStats.totalRetries}</p>
            </div>
          </CardContent>
        </Card>

        {/* Commandant's Assessment */}
        <Card className="bg-black/80 border-green-500 mb-6">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <img 
                src="/characters/lenoir-portrait.jpg" 
                alt="Commandant Lenoir"
                className="w-16 h-16 rounded-full border-2 border-green-400"
              />
              <div className="flex-1">
                <h3 className="text-green-400 font-semibold text-lg mb-2">
                  Commandant Lenoir's Assessment
                </h3>
                <div className="mb-3">
                  <span className="text-green-300">Performance Rating: </span>
                  <span className={`font-bold ${performance.color}`}>
                    {performance.rating}
                  </span>
                </div>
                <p className="text-white leading-relaxed">
                  {performance.message} Your cognitive reflexes and memory retention 
                  capabilities have been evaluated. {gameStats.totalRetries === 0 
                    ? "Your flawless execution demonstrates exceptional field readiness." 
                    : "Continue training to enhance your operational effectiveness."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="bg-black/80 border-green-500 mb-8">
          <CardContent className="p-6">
            <h3 className="text-green-400 font-semibold text-lg mb-3">
              Training Recommendations
            </h3>
            <ul className="text-white space-y-2">
              <li>• Regular practice sessions to maintain cognitive sharpness</li>
              <li>• Focus on reducing response time for critical scenarios</li>
              <li>• Review linguistic patterns for improved accuracy</li>
              {gameStats.totalRetries > 3 && (
                <li className="text-yellow-400">• Additional memory retention exercises recommended</li>
              )}
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleReplayMission}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold"
          >
            REPLAY MISSION
          </Button>
          
          <Button
            onClick={handleReturnToTitle}
            variant="outline"
            className="border-green-500 text-green-400 hover:bg-green-500 hover:text-white px-8 py-3 text-lg"
          >
            RETURN TO TITLE
          </Button>
        </div>
      </div>
    </div>
  )
}
