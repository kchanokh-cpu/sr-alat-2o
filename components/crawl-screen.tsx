"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { GameState } from "@/app/page"

interface CrawlScreenProps {
  onStateChange: (newState: GameState) => void
  playUISound: () => void
}

export default function CrawlScreen({ onStateChange, playUISound }: CrawlScreenProps) {
  const [showSkipButton, setShowSkipButton] = useState(false)

  useEffect(() => {
    // Show skip button after 3 seconds
    const timer = setTimeout(() => {
      setShowSkipButton(true)
    }, 3000)

    // Auto-advance after crawl completes (30 seconds)
    const autoAdvanceTimer = setTimeout(() => {
      handleSkipCrawl()
    }, 30000)

    return () => {
      clearTimeout(timer)
      clearTimeout(autoAdvanceTimer)
    }
  }, [])

  const handleSkipCrawl = () => {
    playUISound()
    onStateChange("game")
  }

  const crawlText = `
    MISSION BRIEFING - CLASSIFIED

    Agent, you have been selected for Operation SEYGEREFLEX, 
    a critical memory retrieval training exercise.

    Your mission: Navigate through a series of linguistic 
    challenges designed to test your cognitive reflexes 
    and memory retention capabilities.

    You will encounter various scenarios requiring rapid 
    response and accurate recall. Each phase will test 
    different aspects of your mental agility.

    Remember: In the field, hesitation can mean the 
    difference between mission success and failure.

    Your performance will be monitored and evaluated 
    by Commandant Lenoir.

    Good luck, Agent. The future depends on your success.

    SRLUF - Service de Renseignement et de Liaison des Forces Unifiées
  `

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: "url('/backgrounds/legon-campus-satellite.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/80" />
      
      {/* Crawling text */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-8">
        <div className="text-green-400 text-lg leading-relaxed font-mono whitespace-pre-line animate-pulse">
          <div className="crawl-text">
            {crawlText}
          </div>
        </div>
      </div>

      {/* Skip button */}
      {showSkipButton && (
        <div className="fixed bottom-8 right-8 z-20">
          <Button
            onClick={handleSkipCrawl}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 border border-green-400 shadow-lg"
          >
            SKIP BRIEFING
          </Button>
        </div>
      )}

      <style jsx>{`
        .crawl-text {
          animation: crawl 25s linear forwards;
        }
        
        @keyframes crawl {
          0% {
            transform: translateY(100vh);
          }
          100% {
            transform: translateY(-100%);
          }
        }
      `}</style>
    </div>
  )
}
