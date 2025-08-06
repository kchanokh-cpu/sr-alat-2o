"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Volume2 } from 'lucide-react'
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
      await audioRef.current.play()
      
      audioRef.current.onended = () => {
        setIsPlayingAudio(false)
      }
    } catch (error) {
      console.error("Error playing fallback audio:", error)
      setIsPlayingAudio(false)
    }
  }

  const tryAgain = () => {
    playUISound()
    onStateChange("game")
  }

  const skipStep = () => {
    playUISound()
    // Move to next step in the dialogue
    onStateChange("game")
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: "url('/backgrounds/kotoka-airport.jpg')" }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Audio element */}
      <audio ref={audioRef} preload="none" />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-8 text-center bg-red-900/80 border-red-400 border-2">
          {/* Lenoir portrait */}
          <div className="mb-6">
            <img
              src="/characters/lenoir-portrait.jpg"
              alt="Commandant Lenoir"
              className="w-24 h-24 rounded-full object-cover border-4 border-red-400 mx-auto mb-4"
            />
            <h2 className="text-xl font-bold text-red-300">Commandant Lenoir</h2>
            <p className="text-sm text-red-400">Handler - SRLUF Intelligence</p>
          </div>

          {/* Warning message */}
          <div className="mb-6">
            <div className="text-4xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-red-300 mb-4">Communication Failure</h1>
          </div>

          {/* Fallback text */}
          <div className="bg-slate-800/50 p-6 rounded-lg mb-6">
            <p className="text-white text-lg leading-relaxed">
              {currentStep.fallbackText}
            </p>
          </div>

          {/* Audio controls */}
          <div className="mb-8">
            <Button
              onClick={playFallbackAudio}
              onMouseEnter={playUISound}
              disabled={isPlayingAudio}
              variant="outline"
              className="bg-slate-700 border-slate-600 hover:bg-slate-600 mb-4"
            >
              <Volume2 className="w-4 h-4 mr-2" />
              {isPlayingAudio ? "Playing..." : "Replay Handler Audio"}
            </Button>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={tryAgain}
              onMouseEnter={playUISound}
              className="bg-green-600 hover:bg-green-700 px-6 py-3"
            >
              🔄 Try Again
            </Button>
            <Button
              onClick={skipStep}
              onMouseEnter={playUISound}
              variant="outline"
              className="border-yellow-500 text-yellow-400 hover:bg-yellow-500 hover:text-black px-6 py-3"
            >
              ⏭️ Skip This Step
            </Button>
          </div>

          {/* Footer warning */}
          <div className="text-xs text-red-400 mt-6 pt-4 border-t border-red-700">
            Mission Status: COMPROMISED • Handler Intervention Required
          </div>
        </Card>
      </div>
    </div>
  )
}
