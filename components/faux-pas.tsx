"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Volume2, AlertTriangle } from 'lucide-react'
import type { GameState } from "@/app/page"
import { dialogueSteps } from "@/app/page"

interface FauxPasProps {
  onStateChange: (newState: GameState) => void
  playUISound: () => void
  stepId: number
}

export default function FauxPas({ onStateChange, playUISound, stepId }: FauxPasProps) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [audioLoadingPromise, setAudioLoadingPromise] = useState<Promise<void> | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const step = dialogueSteps[stepId]

  useEffect(() => {
    // Auto-play fallback audio when component mounts
    if (step?.fallbackAudio) {
      setTimeout(() => {
        playAudio(step.fallbackAudio!)
      }, 500)
    }
  }, [step])

  const playAudio = async (audioFile: string) => {
    if (!audioRef.current) return

    try {
      if (audioLoadingPromise) {
        await audioLoadingPromise
      }

      const loadingPromise = new Promise<void>((resolve, reject) => {
        if (!audioRef.current) {
          reject(new Error("Audio element not available"))
          return
        }

        const audio = audioRef.current

        const onCanPlay = () => {
          audio.removeEventListener("canplay", onCanPlay)
          audio.removeEventListener("error", onError)
          resolve()
        }

        const onError = (e: Event) => {
          audio.removeEventListener("canplay", onCanPlay)
          audio.removeEventListener("error", onError)
          reject(new Error("Failed to load audio"))
        }

        audio.addEventListener("canplay", onCanPlay)
        audio.addEventListener("error", onError)

        audio.src = audioFile
        audio.load()
      })

      setAudioLoadingPromise(loadingPromise)
      await loadingPromise

      if (!audioRef.current) return

      setIsPlayingAudio(true)

      const onEnded = () => {
        setIsPlayingAudio(false)
        if (audioRef.current) {
          audioRef.current.removeEventListener("ended", onEnded)
          audioRef.current.removeEventListener("error", onPlayError)
        }
      }

      const onPlayError = () => {
        setIsPlayingAudio(false)
        if (audioRef.current) {
          audioRef.current.removeEventListener("ended", onEnded)
          audioRef.current.removeEventListener("error", onPlayError)
        }
      }

      audioRef.current.addEventListener("ended", onEnded)
      audioRef.current.addEventListener("error", onPlayError)

      await audioRef.current.play()
      setAudioLoadingPromise(null)
    } catch (error) {
      console.error("Error playing audio:", error)
      setIsPlayingAudio(false)
      setAudioLoadingPromise(null)
    }
  }

  const returnToGame = () => {
    playUISound()
    onStateChange("game")
  }

  if (!step || !step.fallbackText) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-900/20 via-slate-900 to-slate-800 flex items-center justify-center p-4">
      {/* Audio Status Indicator */}
      {isPlayingAudio && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-slate-800/90 backdrop-blur-sm border border-red-600 rounded-lg p-3 flex items-center space-x-2">
            <Volume2 className="w-4 h-4 animate-pulse text-red-400" />
            <span className="text-white text-sm font-medium">Commandant Lenoir speaking...</span>
          </div>
        </div>
      )}

      {/* Main audio player */}
      <audio ref={audioRef} preload="none" />

      <Card className="max-w-2xl w-full p-8 text-center bg-slate-800 border-red-500 border-2">
        <div className="space-y-6">
          {/* Warning Header */}
          <div>
            <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-red-400 mb-2">Faux Pas Detected</h1>
            <p className="text-slate-300">Your handler is not pleased...</p>
          </div>

          {/* Lenoir's Portrait */}
          <div className="flex justify-center">
            <img
              src="/characters/lenoir-portrait.jpg"
              alt="Commandant Lenoir"
              className="w-24 h-24 rounded-full object-cover border-4 border-red-400 shadow-lg shadow-red-400/50"
            />
          </div>

          {/* Fallback Message */}
          <Card className="p-6 bg-red-900/20 border-red-400">
            <div className="flex items-start space-x-4">
              <div className="w-3 h-3 rounded-full mt-2 bg-red-400" />
              <div className="flex-1">
                <p className="text-white text-lg leading-relaxed mb-4">
                  {step.fallbackText}
                </p>

                <div className="flex items-center space-x-3 justify-center">
                  {step.fallbackAudio && (
                    <Button
                      onClick={() => playAudio(step.fallbackAudio!)}
                      onMouseEnter={playUISound}
                      disabled={isPlayingAudio}
                      variant="outline"
                      size="sm"
                      className="bg-slate-700 border-red-600 hover:bg-red-600 text-red-400 hover:text-white"
                    >
                      <Volume2 className="w-4 h-4 mr-2" />
                      {isPlayingAudio ? "Playing..." : "Replay Audio"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Instructions */}
          <div className="bg-slate-900/50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-yellow-400 mb-2">Mission Guidance</h3>
            <p className="text-slate-300 text-sm">
              Listen carefully to your handler's instructions. You will be returned to the previous step to try again.
              Remember: hesitation in the field can compromise the entire operation.
            </p>
          </div>

          {/* Return Button */}
          <Button
            onClick={returnToGame}
            onMouseEnter={playUISound}
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 text-lg font-semibold"
          >
            🔄 Return to Mission
          </Button>

          {/* Footer */}
          <div className="text-xs text-slate-500 pt-4 border-t border-slate-700">
            Failure is not an option • SRLUF Training Protocol
          </div>
        </div>
      </Card>
    </div>
  )
}
