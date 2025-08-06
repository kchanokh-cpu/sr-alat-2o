"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronRight } from 'lucide-react'
import type { GameState } from "@/app/page"

interface HomeScreenProps {
  onStateChange: (newState: GameState) => void
  playUISound: () => void
}

export default function HomeScreen({ onStateChange, playUISound }: HomeScreenProps) {
  const [titleAnimation, setTitleAnimation] = useState("")

  useEffect(() => {
    // Animate title on load
    setTimeout(() => setTitleAnimation("animate-pulse"), 500)
  }, [])

  const startCrawl = () => {
    playUISound()
    onStateChange("crawl")
  }

  const quitGame = () => {
    playUISound()
    window.close()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* SRLUF Emblem Watermark */}
      <div className="absolute top-4 left-4 opacity-20 z-10">
        <img src="/srluf-emblem.png" alt="SRLUF" className="w-16 h-16" />
      </div>

      {/* Version Info */}
      <div className="absolute bottom-4 right-4 text-slate-500 text-xs font-mono">
        Ver. 0.1 | Internal Testing | Codename: Reflex Fire
      </div>

      {/* Airport Background with Motion */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
        <div className="absolute top-1/4 right-1/3 w-2 h-2 bg-red-500 rounded-full animate-pulse opacity-60" />
        <div className="absolute top-1/3 left-1/4 w-1 h-1 bg-blue-400 rounded-full animate-pulse opacity-40" />
        <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-green-400 rounded-full animate-pulse opacity-50" />
      </div>

      {/* Main Content */}
      <div className="relative z-20 min-h-screen flex flex-col items-center justify-center p-8">
        <div className="text-center space-y-8 max-w-2xl">
          {/* Title */}
          <div className={`space-y-4 ${titleAnimation}`}>
            <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 tracking-wider">
              SeyGe Reflex
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 font-light tracking-wide">
              Another Life, Another Tongue™
            </p>
            <p className="text-sm md:text-base text-slate-400 italic">Undercover. Uncovered. Unfiltered.</p>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
            <Button
              onClick={startCrawl}
              onMouseEnter={playUISound}
              className="bg-green-600 hover:bg-green-500 text-white px-8 py-4 text-lg font-semibold rounded-lg shadow-lg hover:shadow-green-500/25 transition-all duration-300 group"
            >
              <span className="mr-2">🟢</span>
              Begin
              <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              onClick={quitGame}
              onMouseEnter={playUISound}
              variant="outline"
              className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 bg-transparent"
            >
              <span className="mr-2">🔴</span>
              Abort Operation
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
