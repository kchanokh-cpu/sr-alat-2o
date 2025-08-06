"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import type { GameState } from "@/app/page"
import { crawlText } from "@/app/page"

interface CrawlScreenProps {
  onStateChange: (newState: GameState) => void
  playUISound: () => void
}

export default function CrawlScreen({ onStateChange, playUISound }: CrawlScreenProps) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0)
  const [displayedText, setDisplayedText] = useState<string[]>([])
  const [showSkipButton, setShowSkipButton] = useState(false)

  useEffect(() => {
    setShowSkipButton(true)

    const interval = setInterval(() => {
      if (currentLineIndex < crawlText.length) {
        setDisplayedText(prev => [...prev, crawlText[currentLineIndex]])
        setCurrentLineIndex(prev => prev + 1)
      } else {
        clearInterval(interval)
        setTimeout(() => {
          onStateChange("game")
        }, 2000)
      }
    }, 800)

    return () => clearInterval(interval)
  }, [currentLineIndex, onStateChange])

  const skipCrawl = () => {
    playUISound()
    onStateChange("game")
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Stars background */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-black">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Skip button */}
      {showSkipButton && (
        <Button
          onClick={skipCrawl}
          onMouseEnter={playUISound}
          className="absolute top-4 right-4 z-10 bg-slate-800/80 hover:bg-slate-700 text-white"
        >
          Skip Intro
        </Button>
      )}

      {/* Crawling text */}
      <div className="relative z-10 max-w-4xl w-full text-center">
        <div className="space-y-4">
          {displayedText.map((line, index) => (
            <div
              key={index}
              className={`transition-all duration-1000 ${
                line.startsWith("🌍") || line.startsWith("📡") || line.startsWith("🧠")
                  ? "text-yellow-400 text-xl font-bold"
                  : line === ""
                    ? "h-4"
                    : line.includes("SeyGe Reflex")
                      ? "text-green-400 text-3xl font-bold"
                      : line.includes("SRLUF")
                        ? "text-blue-400 text-lg font-semibold"
                        : "text-slate-300 text-lg"
              } ${index === displayedText.length - 1 ? "animate-fade-in" : ""}`}
            >
              {line}
            </div>
          ))}
        </div>
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-2">
          {crawlText.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                index < currentLineIndex ? "bg-green-400" : "bg-slate-600"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
