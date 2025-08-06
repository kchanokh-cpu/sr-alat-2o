"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Volume2 } from 'lucide-react'
import { GameState } from "@/app/page"

interface FauxPasProps {
  onStateChange: (newState: GameState) => void
  playUISound: () => void
  stepNumber: number
}

interface FallbackResponse {
  stepNumber: number
  text: string
  audioUrl: string
}

const fallbackResponses: FallbackResponse[] = [
  {
    stepNumber: 2,
    text: "Ne vous inquiétez pas, Agent. Répétez après moi: 'Oui, Commandant. Je suis prêt.'",
    audioUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ne%20vous%20inqui%C3%A9tez%20pas%2C%20Agent-fallback-2.mp3"
  },
  {
    stepNumber: 4,
    text: "Écoutez attentivement et répétez: 'Je comprends. Que dois-je faire?'",
    audioUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%C3%89coutez%20attentivement-fallback-4.mp3"
  }
]

export default function FauxPas({ onStateChange, playUISound, stepNumber }: FauxPasProps) {
  const [countdown, setCountdown] = useState(5)
  const [hasPlayedAudio, setHasPlayedAudio] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const fallbackResponse = fallbackResponses.find(r => r.stepNumber === stepNumber)

  useEffect(() => {
    // Auto-play fallback audio
    if (fallbackResponse && audioRef.current) {
      audioRef.current.src = fallbackResponse.audioUrl
      audioRef.current.play().catch(console.error)
    }
  }, [fallbackResponse])

  useEffect(() => {
    // Start countdown after audio ends
    if (hasPlayedAudio) {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            handleReturnToGame()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [hasPlayedAudio])

  const handleAudioEnded = () => {
    setHasPlayedAudio(true)
  }

  const handleReturnToGame = () => {
    playUISound()
    onStateChange("game")
  }

  const handlePlayAgain = () => {
    if (audioRef.current && fallbackResponse) {
      audioRef.current.currentTime = 0
      audioRef.current.play().catch(console.error)
    }
  }

  if (!fallbackResponse) {
    // If no fallback response found, return to game
    handleReturnToGame()
    return null
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
      <div className="absolute inset-0 bg-black/80" />
      
      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl mx-auto p-6">
        <Card className="bg-black/90 border-yellow-500">
          <CardContent className="p-6">
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-yellow-400 mb-2">
                ASSISTANCE REQUIRED
              </h1>
              <p className="text-yellow-300">
                Commandant Lenoir is providing guidance
              </p>
            </div>

            {/* Character display */}
            <div className="flex items-center space-x-4 mb-6">
              <img 
                src="/characters/lenoir-portrait.jpg" 
                alt="Commandant Lenoir"
                className="w-16 h-16 rounded-full border-2 border-yellow-400"
              />
              <div>
                <h3 className="text-yellow-400 font-semibold text-lg">
                  Commandant Lenoir
                </h3>
                <p className="text-yellow-300 text-sm">Providing Assistance</p>
              </div>
            </div>

            {/* Fallback text */}
            <div className="mb-6">
              <p className="text-white text-lg leading-relaxed">
                {fallbackResponse.text}
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center space-y-4">
              <Button
                onClick={handlePlayAgain}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Volume2 className="w-4 h-4 mr-2" />
                Play Again
              </Button>

              {hasPlayedAudio && (
                <div className="text-center">
                  <p className="text-yellow-300 mb-2">
                    Returning to mission in {countdown} seconds...
                  </p>
                  <Button
                    onClick={handleReturnToGame}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Continue Now
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Audio element */}
      <audio 
        ref={audioRef} 
        onEnded={handleAudioEnded}
        preload="auto"
      />
    </div>
  )
}
