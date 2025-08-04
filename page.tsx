"use client"

import { useState, useEffect, useRef } from "react"
import { Mic, MicOff, Volume2, MapPin, Plane, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { PronunciationGuide } from "@/components/pronunciation-guide"

interface DialogueStep {
  id: number
  speaker: "lenoir" | "kouassi" | "user"
  text: string
  audioFile?: string
  userPrompt?: string
  fallbackText?: string
  fallbackAudio?: string
}

const dialogueSteps: DialogueStep[] = [
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

const pronunciationGuides = {
  "Excusez-moi, je cherche la sortie.": {
    phonetic: "eks-kü-ZAY mwah, zhuh SHERSH lah sor-TEE",
    translation: "Excuse me, I'm looking for the exit.",
    audioFile: "/audio/pronunciation/excusez-moi-sortie.mp3",
  },
  "Est-ce que vous allez aussi à UG Legon ?": {
    phonetic: "es-kuh voo zah-LAY oh-SEE ah ü-zhay luh-GOHN",
    translation: "Are you also going to UG Legon?",
    audioFile: "/audio/pronunciation/ug-legon-question.mp3",
  },
  "Merci beaucoup, c'est ma première fois au Ghana.": {
    phonetic: "mer-SEE boh-KOO, say mah pruh-mee-YAIR fwah oh gah-NAH",
    translation: "Thank you very much, it's my first time in Ghana.",
    audioFile: "/audio/pronunciation/merci-premiere-fois.mp3",
  },
}

const crawlText = [
  "Welcome to SeyGe Reflex — Another Life, Another Tongue™!",
  "",
  "🌍 You are Touré Yao, a fresh recruit in the elite SRLUF:",
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
  const [gameState, setGameState] = useState<"title" | "crawl" | "game" | "complete">("title")
  const [currentStep, setCurrentStep] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTimer, setRecordingTimer] = useState(0)
  const [showFallback, setShowFallback] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [audioPermission, setAudioPermission] = useState(false)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [currentAudioSpeaker, setCurrentAudioSpeaker] = useState<"lenoir" | "kouassi" | null>(null)
  const [audioLoadingPromise, setAudioLoadingPromise] = useState<Promise<void> | null>(null)
  const [crawlIndex, setCrawlIndex] = useState(0)
  const [titleAnimation, setTitleAnimation] = useState("")

  const audioRef = useRef<HTMLAudioElement>(null)
  const backgroundMusicRef = useRef<HTMLAudioElement>(null)
  const uiSoundRef = useRef<HTMLAudioElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const crawlTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Start background music
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.volume = 0.3
      backgroundMusicRef.current.loop = true
      backgroundMusicRef.current.play().catch(console.error)
    }

    // Animate title on load
    setTimeout(() => setTitleAnimation("animate-pulse"), 500)

    // Request microphone permission
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(() => setAudioPermission(true))
      .catch(console.error)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (crawlTimerRef.current) clearInterval(crawlTimerRef.current)
    }
  }, [])

  const playUISound = () => {
    if (uiSoundRef.current) {
      uiSoundRef.current.currentTime = 0
      uiSoundRef.current.play().catch(console.error)
    }
  }

  const stopCurrentAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlayingAudio(false)
      setCurrentAudioSpeaker(null)
    }
  }

  const playAudio = async (audioFile: string, speaker?: "lenoir" | "kouassi") => {
    if (!audioRef.current) return

    try {
      stopCurrentAudio()

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
      setCurrentAudioSpeaker(speaker || null)

      const onEnded = () => {
        setIsPlayingAudio(false)
        setCurrentAudioSpeaker(null)
        if (audioRef.current) {
          audioRef.current.removeEventListener("ended", onEnded)
          audioRef.current.removeEventListener("error", onPlayError)
        }
      }

      const onPlayError = () => {
        setIsPlayingAudio(false)
        setCurrentAudioSpeaker(null)
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
      setCurrentAudioSpeaker(null)
      setAudioLoadingPromise(null)
    }
  }

  const startRecording = async () => {
    if (!audioPermission) return

    try {
      stopCurrentAudio()

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)

      setMediaRecorder(recorder)
      setIsRecording(true)
      setRecordingTimer(5)
      setShowFallback(false)

      timerRef.current = setInterval(() => {
        setRecordingTimer((prev) => {
          if (prev <= 1) {
            stopRecording()
            showFallbackMessage()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      recorder.start()

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setTimeout(() => {
            completeUserStep()
          }, 500)
        }
      }
    } catch (error) {
      console.error("Error starting recording:", error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop()
      mediaRecorder.stream.getTracks().forEach((track) => track.stop())
      setIsRecording(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  const showFallbackMessage = () => {
    const step = dialogueSteps[currentStep]
    if (step.fallbackText) {
      setShowFallback(true)
      if (step.fallbackAudio) {
        setTimeout(() => {
          playAudio(step.fallbackAudio!, "lenoir")
        }, 100)
      }
      setTimeout(() => {
        setShowFallback(false)
        startRecording()
      }, 3000)
    }
  }

  const completeUserStep = () => {
    setIsRecording(false)
    setShowFallback(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    // Auto-advance to next step and play audio automatically
    setTimeout(() => {
      if (currentStep < dialogueSteps.length - 1) {
        const nextStep = currentStep + 1
        setCurrentStep(nextStep)

        // Auto-play the next character's audio
        const nextDialogue = dialogueSteps[nextStep]
        if (nextDialogue.audioFile && nextDialogue.speaker !== "user") {
          setTimeout(() => {
            playAudio(nextDialogue.audioFile!, nextDialogue.speaker as "lenoir" | "kouassi")
          }, 500)
        }
      } else {
        setGameState("complete")
      }
    }, 1000)
  }

  const nextStep = () => {
    playUISound()
    stopCurrentAudio()

    if (currentStep < dialogueSteps.length - 1) {
      const nextStepIndex = currentStep + 1
      setCurrentStep(nextStepIndex)

      // Auto-play audio for non-user steps
      const nextDialogue = dialogueSteps[nextStepIndex]
      if (nextDialogue.audioFile && nextDialogue.speaker !== "user") {
        setTimeout(() => {
          playAudio(nextDialogue.audioFile!, nextDialogue.speaker as "lenoir" | "kouassi")
        }, 500)
      }
    } else {
      setGameState("complete")
    }
  }

  const startCrawl = () => {
    playUISound()
    setGameState("crawl")
    setCrawlIndex(0)

    crawlTimerRef.current = setInterval(() => {
      setCrawlIndex((prev) => {
        if (prev >= crawlText.length - 1) {
          if (crawlTimerRef.current) clearInterval(crawlTimerRef.current)
          return prev
        }
        return prev + 1
      })
    }, 800)
  }

  const startGame = () => {
    playUISound()
    setGameState("game")
    if (crawlTimerRef.current) clearInterval(crawlTimerRef.current)

    // Auto-play first dialogue audio
    const firstDialogue = dialogueSteps[0]
    if (firstDialogue.audioFile) {
      setTimeout(() => {
        playAudio(firstDialogue.audioFile!, firstDialogue.speaker as "lenoir" | "kouassi")
      }, 500)
    }
  }

  const quitGame = () => {
    playUISound()
    window.close()
  }

  // Title Screen
  if (gameState === "title") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Background Music */}
        <audio ref={backgroundMusicRef} preload="auto">
          <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Bienvenue%20au%20Service-R9en2nhrrOkZlrEWyijvZ39PkZmoEs.mp3" type="audio/mpeg" />
        </audio>

        {/* UI Sound */}
        <audio ref={uiSoundRef} preload="auto">
          <source src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hV" />
        </audio>

        {/* SRLUF Emblem Watermark */}
        <div className="absolute top-4 left-4 opacity-20 z-10">
          <img src="/images/srluf-emblem.png" alt="SRLUF" className="w-16 h-16" />
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

  // Crawl Screen
  if (gameState === "crawl") {
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

  // Game Complete Screen
  if (gameState === "complete") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center bg-slate-800 border-green-500 border-2">
          <div className="text-6xl mb-4">🎯</div>
          <h1 className="text-2xl font-bold text-green-400 mb-4">Scene Complete</h1>
          <p className="text-slate-300 mb-6">En route to UG Campus…</p>
          <div className="text-sm text-slate-400">
            Mission Status: <span className="text-green-400 font-semibold">SUCCESS</span>
          </div>
        </Card>
      </div>
    )
  }

  // Main Game
  const currentDialogue = dialogueSteps[currentStep]
  const progress = ((currentStep + 1) / dialogueSteps.length) * 100

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: "url('/images/backgrounds/kotoka-airport.jpg')" }}
    >
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Audio Status Indicator */}
      {isPlayingAudio && currentAudioSpeaker && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-slate-800/90 backdrop-blur-sm border border-slate-600 rounded-lg p-3 flex items-center space-x-2">
            <Volume2
              className={`w-4 h-4 animate-pulse ${
                currentAudioSpeaker === "lenoir" ? "text-blue-400" : "text-yellow-400"
              }`}
            />
            <span className="text-white text-sm font-medium">
              {currentAudioSpeaker === "lenoir" ? "Commandant Lenoir" : "Kouassi"} speaking...
            </span>
          </div>
        </div>
      )}

      {/* Main audio player */}
      <audio ref={audioRef} preload="none" />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col p-4">
        {/* Header */}
        <div className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700 p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Plane className="w-5 h-5 text-green-400" />
                <span className="text-green-400 font-mono text-sm">SRLUF REFLEX TRAINING</span>
              </div>
              <div className="h-4 w-px bg-slate-600" />
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 font-mono text-sm">KOTOKA INTERNATIONAL AIRPORT</span>
              </div>
            </div>
            <div className="text-blue-400 font-mono text-sm">SCENE 1 - GHANA</div>
          </div>
        </div>

        {/* Progress bar */}
        <Progress value={progress} className="mb-6 h-2 bg-slate-800" />

        {/* Character displays */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {/* Lenoir */}
          <Card
            className={`p-4 transition-all duration-300 ${
              currentDialogue.speaker === "lenoir"
                ? "bg-blue-900/20 border-blue-400 border-2 scale-105"
                : "bg-slate-800/50 border-slate-600"
            }`}
          >
            <div className="flex flex-col items-center space-y-2">
              <img
                src="/images/characters/lenoir-portrait.jpg"
                alt="Commandant Lenoir"
                className={`w-20 h-20 rounded-full object-cover transition-all duration-300 ${
                  currentDialogue.speaker === "lenoir" ? "border-blue-400 border-3" : "border-2 border-slate-500"
                }`}
              />
              <div className="text-center">
                <h3
                  className={`font-semibold text-sm ${
                    currentDialogue.speaker === "lenoir" ? "text-white" : "text-slate-400"
                  }`}
                >
                  Commandant Lenoir
                </h3>
                <p className={`text-xs ${currentDialogue.speaker === "lenoir" ? "text-slate-300" : "text-slate-500"}`}>
                  SRLUF Intelligence Officer
                </p>
              </div>
            </div>
          </Card>

          {/* Touré */}
          <Card
            className={`p-4 transition-all duration-300 ${
              currentDialogue.speaker === "user"
                ? "bg-green-900/20 border-green-400 border-2 scale-105"
                : "bg-slate-800/50 border-slate-600"
            }`}
          >
            <div className="flex flex-col items-center space-y-2">
              <img
                src="/images/characters/toure-portrait.jpg"
                alt="Touré Yao"
                className={`w-20 h-20 rounded-full object-cover transition-all duration-300 ${
                  currentDialogue.speaker === "user" ? "border-green-400 border-3" : "border-2 border-slate-500"
                }`}
              />
              <div className="text-center">
                <h3
                  className={`font-semibold text-sm ${
                    currentDialogue.speaker === "user" ? "text-white" : "text-slate-400"
                  }`}
                >
                  Touré Yao
                </h3>
                <p className={`text-xs ${currentDialogue.speaker === "user" ? "text-slate-300" : "text-slate-500"}`}>
                  SRLUF Agent
                </p>
              </div>
            </div>
          </Card>

          {/* Kouassi */}
          <Card
            className={`p-4 transition-all duration-300 ${
              currentDialogue.speaker === "kouassi"
                ? "bg-yellow-900/20 border-yellow-400 border-2 scale-105"
                : "bg-slate-800/50 border-slate-600"
            }`}
          >
            <div className="flex flex-col items-center space-y-2">
              <img
                src="/images/characters/kouassi-portrait.jpg"
                alt="Kouassi"
                className={`w-20 h-20 rounded-full object-cover transition-all duration-300 ${
                  currentDialogue.speaker === "kouassi" ? "border-yellow-400 border-3" : "border-2 border-slate-500"
                }`}
              />
              <div className="text-center">
                <h3
                  className={`font-semibold text-sm ${
                    currentDialogue.speaker === "kouassi" ? "text-white" : "text-slate-400"
                  }`}
                >
                  Kouassi
                </h3>
                <p className={`text-xs ${currentDialogue.speaker === "kouassi" ? "text-slate-300" : "text-slate-500"}`}>
                  UG Law Student
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main dialogue area */}
        <div className="flex-1 flex flex-col justify-center space-y-6">
          {/* Current dialogue */}
          <Card
            className={`p-6 max-w-2xl mx-auto w-full relative ${
              currentDialogue.speaker === "lenoir"
                ? "bg-blue-900/80 border-blue-400"
                : currentDialogue.speaker === "kouassi"
                  ? "bg-yellow-900/80 border-yellow-400"
                  : "bg-green-900/80 border-green-400"
            }`}
          >
            {/* Character portrait overlay for active speaker */}
            {currentDialogue.speaker !== "user" && (
              <div className="absolute -top-6 -left-6 z-10">
                <img
                  src={
                    currentDialogue.speaker === "lenoir"
                      ? "/images/characters/lenoir-portrait.jpg"
                      : "/images/characters/kouassi-portrait.jpg"
                  }
                  alt={currentDialogue.speaker === "lenoir" ? "Commandant Lenoir" : "Kouassi"}
                  className={`w-16 h-16 rounded-full object-cover border-3 ${
                    currentDialogue.speaker === "lenoir" ? "border-blue-400" : "border-yellow-400"
                  }`}
                />
              </div>
            )}

            <div className="flex items-start space-x-4">
              <div
                className={`w-3 h-3 rounded-full mt-2 ${
                  currentDialogue.speaker === "lenoir"
                    ? "bg-blue-400"
                    : currentDialogue.speaker === "kouassi"
                      ? "bg-yellow-400"
                      : "bg-green-400"
                }`}
              />

              <div className="flex-1">
                <p className="text-white text-lg leading-relaxed mb-4">
                  {showFallback && currentDialogue.fallbackText ? currentDialogue.fallbackText : currentDialogue.text}
                </p>

                {currentDialogue.userPrompt && (
                  <div className="space-y-4">
                    <div className="bg-slate-800/50 p-4 rounded-lg">
                      <p className="text-green-300 font-semibold text-xl">"{currentDialogue.userPrompt}"</p>
                    </div>

                    <PronunciationGuide
                      phrase={currentDialogue.userPrompt}
                      phonetic={
                        pronunciationGuides[currentDialogue.userPrompt as keyof typeof pronunciationGuides]?.phonetic ||
                        ""
                      }
                      translation={
                        pronunciationGuides[currentDialogue.userPrompt as keyof typeof pronunciationGuides]
                          ?.translation || ""
                      }
                      audioFile={
                        pronunciationGuides[currentDialogue.userPrompt as keyof typeof pronunciationGuides]?.audioFile
                      }
                      onPlayAudio={(audioFile) => playAudio(audioFile)}
                    />
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  {currentDialogue.audioFile && currentDialogue.speaker !== "user" && (
                    <Button
                      onClick={() =>
                        playAudio(currentDialogue.audioFile!, currentDialogue.speaker as "lenoir" | "kouassi")
                      }
                      onMouseEnter={playUISound}
                      disabled={isPlayingAudio}
                      variant="outline"
                      size="sm"
                      className="bg-slate-700 border-slate-600 hover:bg-slate-600"
                    >
                      <Volume2 className="w-4 h-4 mr-2" />
                      {isPlayingAudio ? "Playing..." : "Replay Audio"}
                    </Button>
                  )}

                  {currentDialogue.speaker !== "user" && (
                    <Button onClick={nextStep} onMouseEnter={playUISound} className="bg-green-600 hover:bg-green-700">
                      Continue
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Recording interface for user prompts */}
          {currentDialogue.speaker === "user" && (
            <Card className="p-6 max-w-md mx-auto w-full bg-slate-800/90 border-green-400">
              <div className="text-center">
                {!isRecording ? (
                  <Button
                    onClick={startRecording}
                    onMouseEnter={playUISound}
                    disabled={!audioPermission}
                    className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg"
                  >
                    <Mic className="w-6 h-6 mr-2" />
                    Start Recording
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center space-x-2">
                      <MicOff className="w-6 h-6 text-red-400 animate-pulse" />
                      <span className="text-white text-lg">Recording...</span>
                    </div>

                    <div className="text-3xl font-bold text-red-400">{recordingTimer}s</div>

                    <Button
                      onClick={() => {
                        stopRecording()
                        completeUserStep()
                      }}
                      onMouseEnter={playUISound}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Complete
                    </Button>
                  </div>
                )}

                {!audioPermission && <p className="text-red-400 text-sm mt-2">Microphone permission required</p>}
              </div>
            </Card>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-slate-400 text-sm mt-6">
          Step {currentStep + 1} of {dialogueSteps.length} • SeyGe Reflex™ Training Simulation
        </div>
      </div>
    </div>
  )
}
