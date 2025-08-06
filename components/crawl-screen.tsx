"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ChevronRight } from 'lucide-react'
import type { GameState } from "@/app/page"
import { crawlText } from "@/app/page"

interface CrawlScreenProps {
  onStateChange: (newState: GameState) => void
  playUISound: () => void
}

export default function CrawlScreen({ onStateChange, playUISound }: CrawlScreenProps) {
  const [crawlIndex, setCrawlIndex] = useState(0)
  const crawlTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Start the crawl animation
    crawlTimerRef.current = setInterval(() => {
      setCrawlIndex((prev) => {
        if (prev >= crawlText.length - 1) {
          if (crawlTimerRef.current) clearInterval(crawlTimerRef.current)
          return prev
        }
        return prev + 1
      })
    }, 800)

    return () => {
      if (crawlTimerRef.current) clearInterval(crawlTimerRef.current)
    }
  }, [])

  const startGame = () => {
    playUISound()
    onStateChange("game")
    if (crawlTimerRef.current) clearInterval(crawlTimerRef.current)
  }

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono relative overflow-hidden">
      {/* Skip Button */}
      <Button
        onClick={startGame}
        onMouseEnter={playUISound}
        className="absolute top-4 right-4 z-50 bg-slate-800 hover:bg-slate-700 text-green-400 border border-green-400"
      >
        Skip <ChevronRight className="ml-1 w-4 h-4" />
      </Button>

      {/* Crawl Text */}
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-3xl text-center space-y-6">
          {crawlText.slice(0, crawlIndex + 1).map((line, index) => (
            <div
              key={index}
              className={`text-lg md:text-xl leading-relaxed transition-opacity duration-1000 ${
                index === crawlIndex ? "opacity-100 animate-pulse" : "opacity-80"
              }`}
            >
              {line}
            </div>
          ))}

          {crawlIndex >= crawlText.length - 1 && (
            <div className="mt-12 animate-pulse">
              <Button
                onClick={startGame}
                onMouseEnter={playUISound}
                className="bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 text-xl font-bold rounded-lg shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
              >
                🟪 Begin Mission 1: Arrival
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
