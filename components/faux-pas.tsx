"use client"

import { useState, useEffect, useRef } from "react"
import { Volume2, AlertTriangle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { GameState } from "@/app/page"
import { dialogueSteps } from "@/app/page"

interface FauxPasProps {
  onStateChange: (newState: GameState) => void
  playUISound: () => void
  stepId: number
}

export default function FauxPas({ onStateChange, playUISound, stepId }: FauxPasProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const currentStep = dialogueSteps[stepId]

  useEffect(() => {
    // Auto-play fallback audio when component mounts
    if (currentStep.fallbackAudio) {
      setTimeout(() => {
        playFallbackAudio()
      }, 500)
    }
  }, [])

  const playFallbackAudio = async () => {
    if (!audioRef.current || !currentStep.fallbackAudio) return

    try {
      setIsPlayingAudio(true)
      audioRef.current.src = currentStep.fallbackAudio
      
      const onEnded = () => {
        setIsPlayingAudio(false)
        if (audioRef.current) {
          audioRef.current.removeEventListener("ended", onEnded)
        }
      }

      audioRef.current.addEventListener("ended", onEnded)
      await audioRef.current.play()
    } catch (error) {
      console.error("Error playing fallback audio:", error)
      setIsPlayingAudio(false)
    }
  }

  const returnToGame = () => {
    playUISound()
    onStateChange("game")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900/20 via-slate-900 to-slate-800 flex items-center justify-center p-4">
      {/* Audio player */}
      <audio ref={audioRef} preload="none" />

      {/* Audio Status Indicator */}
      {isPlayingAudio && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-600 rounded-lg p-3 flex items-center space-x-2">
            <Volume2 className="w-4 h-4 animate-pulse text-blue-400" />
            <span className="text-white text-sm font-medium">Commandant Lenoir speaking...</span>
          </div>
        </div>
      )}

      <Card className="max-w-2xl w-full p-8 text-center bg-slate-800 border-red-500 border-2">
        <div className="flex items-center justify-center mb-6">
          <AlertTriangle className="w-16 h-16 text-red-400" />
        </div>
        
        <h1 className="text-3xl font-bold text-red-400 mb-6">Faux Pas</h1>
        
        <div className="mb-8">
          <div className="bg-red-900/20 border border-red-400 rounded-lg p-6 mb-6">
            <div className="flex items-start space-x-4">
              <img
                src="/characters/lenoir-portrait.jpg"
                alt="Commandant Lenoir"
                className="w-16 h-16 rounded-full object-cover border-2 border-blue-400"
              />
              <div className="flex-1 text-left">
                <h3 className="text-blue-300 font-semibold mb-2">Commandant Lenoir:</h3>
                <p className="text-white text-lg leading-relaxed">
                  {currentStep.fallbackText}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-4 mb-6">
            {currentStep.fallbackAudio && (
              <Button
                onClick={playFallbackAudio}
                onMouseEnter={playUISound}
                disabled={isPlayingAudio}
                variant="outline"
                className="bg-slate-700 border-slate-600 hover:bg-slate-600"
              >
                <Volume2 className="w-4 h-4 mr-2" />
                {isPlayingAudio ? "Playing..." : "Replay Audio"}
              </Button>
            )}
          </div>
        </div>

        <div className="text-slate-400 text-sm mb-6">
          Don't worry, Agent Touré. Even the best operatives need practice. Let's try again.
        </div>

        <Button
          onClick={returnToGame}
          onMouseEnter={playUISound}
          className="bg-green-600 hover:bg-green-700 px-8 py-3 text-lg"
        >
          Try Again
        </Button>
      </Card>
    </div>
  )
}
