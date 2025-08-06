"use client"

import { useState, useEffect, useRef } from "react"
import HomeScreen from "@/components/home-screen"
import CrawlScreen from "@/components/crawl-screen"
import Gameplay from "@/components/gameplay"
import MissionEndScreen from "@/components/mission-end-screen"
import FauxPas from "@/components/faux-pas"

export type GameState = "title" | "crawl" | "game" | "complete" | "faux-pas"

export interface GameStats {
  missionStartTime: number | null
  missionEndTime: number | null
  totalRetries: number
  completedPhrases: string[]
}

export interface DialogueStep {
  id: number
  speaker: "lenoir" | "kouassi" | "user"
  text: string
  audioFile?: string
  userPrompt?: string
  fallbackText?: string
  fallbackAudio?: string
}

export const dialogueSteps: DialogueStep[] = [
  {
    id: 1,
    speaker: "lenoir",
    text: "Très bien, we're on Ghanaian soil, Agent Touré. But now we need to find the airport exit, la sortie. Regarde, that's Kouassi, who sat next to us on the plane in aisle C. Let's ask him where the exit is. Say to him: 'Excusez-moi, je cherche la sortie.'",
    audioFile:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Lenoir%20Line%201-ie4rCbCKrBo8UFDTCNcaG0i76mYzqF.mp3",
  },
  {
    id: 2,
    speaker: "user",
    text: "Ask Kouassi where the exit is:",
    userPrompt: "Excusez-moi, je cherche la sortie.",
    fallbackText: "Vous attendez quoi? What are you waiting for, Touré? Ask Kouassi where the exit is!",
    fallbackAudio:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Lenoir%20Line%202-cnkpjjbakQXOpmqfJplir4KIGK38nW.mp3",
  },
  {
    id: 3,
    speaker: "kouassi",
    text: "Oh, c'est Touré! Tu cherches la sortie? Viens, je t'y conduis.",
    audioFile:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Kouassi%20Line%201-Q3aH0V9uAB7Cy1jcvMykrmUEZx47Mz.mp3",
  },
  {
    id: 4,
    speaker: "lenoir",
    text: "Parfait. He's taking us to the exit. Hmm… he seems young, almost like a student. Ask him if he's also going to the University of Ghana at Legon. Remember: 'Est-ce que vous allez aussi à UG Legon ?' Allez-y.",
    audioFile:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Lenoir%20Line%203-ZEYY754ZIfDo5IQNg6kHR0qm1u542u.mp3",
  },
  {
    id: 5,
    speaker: "user",
    text: "Ask if Kouassi is going to UG Legon too:",
    userPrompt: "Est-ce que vous allez aussi à UG Legon ?",
    fallbackText: "Ce n'est pas compliqué, Touré. Ask if he's going to UG Legon!",
    fallbackAudio:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Lenoir%20Line%204-QzuMwDyRO0vyahPVI5WoRjZYUeFcbG.mp3",
  },
  {
    id: 6,
    speaker: "kouassi",
    text: "Oui, je vais à UG. Je suis étudiant là-bas, étudiant de droit, de troisième année. Toi aussi, non? T'inquiète, je vais te faire voir le campus.",
    audioFile:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Kouassi%20Line%202-OqehkGP0buOdLzyBE2e6oi3tbfwbE8.mp3",
  },
  {
    id: 7,
    speaker: "lenoir",
    text: "Fantastique. A guide on campus—perfect for our mission. Thank him with: 'Merci beaucoup, c'est ma première fois au Ghana.'",
    audioFile:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Lenoir%20Line%205-1ThUk6t0nWUUaibuez5xW7uY4sD3mG.mp3",
  },
  {
    id: 8,
    speaker: "user",
    text: "Thank him:",
    userPrompt: "Merci beaucoup, c'est ma première fois au Ghana.",
    fallbackText: "Pas le moment de rester muet, agent. Thank him!",
    fallbackAudio:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Lenoir%20Line%206-WMtDn6pKv5FlQ4peMTb1WJUJtxzOwO.mp3",
  },
  {
    id: 9,
    speaker: "kouassi",
    text: "Pas de problème! Maintenant, commandons un Bolt, je crois que j'ai encore une réduction dont je n'ai pas encore profité.",
    audioFile:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Kouassi%20Line%203-tiZ9yWSEf8PzJ8aJVfFxvYolsZn1Is.mp3",
  },
]

export const crawlText = [
  "Welcome to SeyGe Reflex — Another Life, Another Tongue™!",
  "",
  "🌍 You are Touré Yao, a fresh Ivorian recruit in the elite SRLUF:",
  "Service de Renseignement Linguistique de l'Union Francophone.",
  "",
  "Your mission? Infiltrate the University of Ghana, Legon under deep cover…",
  "Posing as a harmless language exchange student.",
  "",
  "But you're here to investigate a rogue Francophone cell",
  "suspected of using soft power to influence student politics.",
  "",
  "Your goal: Blend in. Gather intel. Report back.",
  "All without blowing your cover. And all entirely…in French.",
  "",
  "📡 You'll interact via your covert comm glasses,",
  "staying in constant touch with your handler:",
  "Commandant Lenoir — icy, brilliant, and watching your every move.",
  "",
  "He'll guide you. Challenge you.",
  "But he won't protect you if you slip.",
  "",
  "🧠 Your choices matter.",
  "Every response you give affects how the story unfolds.",
  "Every hesitation could cost you your mission… or your identity.",
  "",
  "Are you ready to live another life,",
  "in another tongue?",
]

export default function SeyGeReflexApp() {
  const [gameState, setGameState] = useState<GameState>("title")
  const [gameStats, setGameStats] = useState<GameStats>({
    missionStartTime: null,
    missionEndTime: null,
    totalRetries: 0,
    completedPhrases: []
  })
  const [currentFauxPasStep, setCurrentFauxPasStep] = useState<number | null>(null)

  // Audio refs that need to be shared across components
  const backgroundMusicRef = useRef<HTMLAudioElement>(null)
  const uiSoundRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    // Start background music
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.volume = 0.3
      backgroundMusicRef.current.loop = true
      backgroundMusicRef.current.play().catch(console.error)
    }
  }, [])

  const playUISound = () => {
    if (uiSoundRef.current) {
      uiSoundRef.current.currentTime = 0
      uiSoundRef.current.play().catch(console.error)
    }
  }

  const handleStateChange = (newState: GameState, data?: any) => {
    setGameState(newState)
    
    if (data) {
      if (data.stats) {
        setGameStats(data.stats)
      }
      if (data.fauxPasStep !== undefined) {
        setCurrentFauxPasStep(data.fauxPasStep)
      }
    }
  }

  const resetGame = () => {
    setGameStats({
      missionStartTime: null,
      missionEndTime: null,
      totalRetries: 0,
      completedPhrases: []
    })
    setCurrentFauxPasStep(null)
  }

  return (
    <>
      {/* Shared Audio Elements */}
      <audio ref={backgroundMusicRef} preload="auto">
        <source
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Bienvenue%20au%20Service-R9en2nhrrOkZlrEWyijvZ39PkZmoEs.mp3"
          type="audio/mpeg"
        />
      </audio>

      <audio ref={uiSoundRef} preload="auto">
        <source
          src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJH
