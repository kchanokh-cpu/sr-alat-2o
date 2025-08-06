"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { GameState } from "@/app/page"

interface HomeScreenProps {
  onStateChange: (newState: GameState) => void
  playUISound: () => void
}

export default function HomeScreen({ onStateChange, playUISound }: HomeScreenProps) {
  const [logoVisible, setLogoVisible] = useState(false)

  useEffect(() => {
    // Animate logo entrance
    setTimeout(() => setLogoVisible(true), 500)
  }, [])

  const startGame = () => {
    playUISound()
    onStateChange("crawl")
  }

  const exitGame = () => {
    playUISound()
    window.close()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 text-center bg-slate-800/90 border-slate-600">
        {/* Logo and Title */}
        <div className={`transition-all duration-1000 ${logoVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <img
            src="/srluf-emblem.png"
            alt="SRLUF Emblem"
            className="w-24 h-24 mx-auto mb-6"
          />
          
          <h1 className="text-4xl font-bold text-green-400 mb-2">SeyGe Reflex</h1>
          <p className="text-xl text-slate-300 mb-2">Another Life, Another Tongue™</p>
          <p className="text-sm text-slate-400 mb-8">Service de Renseignement Linguistique de l'Union Francophone</p>
        </div>

        {/* Mission Brief */}
        <div className="bg-slate-900/50 p-6 rounded-lg mb-8">
          <h2 className="text-lg font-semibold text-blue-400 mb-3">Mission Brief</h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Agent Touré, you are about to begin your first deep-cover assignment. 
            Your mission: infiltrate the University of Ghana, Legon, posing as a language exchange student. 
            Your handler, Commandant Lenoir, will guide you through critical interactions. 
            Remember: every word matters. Every hesitation could blow your cover.
          </p>
        </div>

        {/* Menu Options */}
        <div className="space-y-4">
          <Button
            onClick={startGame}
            onMouseEnter={playUISound}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-4 text-lg font-semibold"
          >
            🎯 Begin Mission
          </Button>

          <Button
            onClick={exitGame}
            onMouseEnter={playUISound}
            variant="outline"
            className="w-full border-red-500 text-red-400 hover:bg-red-500 hover:text-white py-4 text-lg font-semibold"
          >
            🚪 Exit
          </Button>
        </div>

        {/* Footer */}
        <div className="text-xs text-slate-500 mt-8 pt-4 border-t border-slate-700">
          SRLUF Training Simulation • Classified • For Internal Use Only
        </div>
      </Card>
    </div>
  )
}
