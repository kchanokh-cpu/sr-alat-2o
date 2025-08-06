"use client"

import { useState, useEffect, useRef } from "react"
import { Mic, MicOff, Volume2, MapPin, Plane, ChevronRight } from 'lucide-react'
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
  const [gameState, setGameState] = useState<"title" | "crawl" | "game" | "complete">("title")
  const [currentStep, setCurrentStep] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTimer, setRecordingTimer] = useState(5)
  const [showFallback, setShowFallback] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [audioPermission, setAudioPermission] = useState(false)
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [currentAudioSpeaker, setCurrentAudioSpeaker] = useState<"lenoir" | "kouassi" | null>(null)
  const [audioLoadingPromise, setAudioLoadingPromise] = useState<Promise<void> | null>(null)
  const [crawlIndex, setCrawlIndex] = useState(0)
  const [titleAnimation, setTitleAnimation] = useState("")

  // New states for enhanced functionality
  const [isPlayingFallbackAudio, setIsPlayingFallbackAudio] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [totalRetries, setTotalRetries] = useState(0)
  const [currentUserStepRetries, setCurrentUserStepRetries] = useState(0)
  const [missionStartTime, setMissionStartTime] = useState<number | null>(null)
  const [missionEndTime, setMissionEndTime] = useState<number | null>(null)
  const [completedPhrases, setCompletedPhrases] = useState<string[]>([])

  const audioRef = useRef<HTMLAudioElement>(null)
  const fallbackAudioRef = useRef<HTMLAudioElement>(null)
  const backgroundMusicRef = useRef<HTMLAudioElement>(null)
  const airportAmbienceRef = useRef<HTMLAudioElement>(null)
  const heartbeatRef = useRef<HTMLAudioElement>(null)
  const missionEndRef = useRef<HTMLAudioElement>(null)
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

  const stopFallbackAudio = () => {
    if (fallbackAudioRef.current) {
      fallbackAudioRef.current.pause()
      fallbackAudioRef.current.currentTime = 0
      setIsPlayingFallbackAudio(false)
    }
  }

  const playAudio = async (audioFile: string, speaker?: "lenoir" | "kouassi") => {
    if (!audioRef.current) return

    try {
      stopCurrentAudio()
      stopFallbackAudio()

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

  const playFallbackAudio = async (audioFile: string) => {
    if (!fallbackAudioRef.current) return

    try {
      stopCurrentAudio()
      stopFallbackAudio()

      setIsPlayingFallbackAudio(true)

      const onEnded = () => {
        setIsPlayingFallbackAudio(false)
        setShowFallback(false)
        if (fallbackAudioRef.current) {
          fallbackAudioRef.current.removeEventListener("ended", onEnded)
          fallbackAudioRef.current.removeEventListener("error", onError)
        }
        // Restart recording after fallback audio ends
        setTimeout(() => {
          startRecording()
        }, 1000)
      }

      const onError = () => {
        setIsPlayingFallbackAudio(false)
        setShowFallback(false)
        if (fallbackAudioRef.current) {
          fallbackAudioRef.current.removeEventListener("ended", onEnded)
          fallbackAudioRef.current.removeEventListener("error", onError)
        }
      }

      fallbackAudioRef.current.addEventListener("ended", onEnded)
      fallbackAudioRef.current.addEventListener("error", onError)

      fallbackAudioRef.current.src = audioFile
      await fallbackAudioRef.current.play()
    } catch (error) {
      console.error("Error playing fallback audio:", error)
      setIsPlayingFallbackAudio(false)
      setShowFallback(false)
    }
  }

  const startRecording = async () => {
    if (!audioPermission) return

    try {
      stopCurrentAudio()
      stopFallbackAudio()

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)

      setMediaRecorder(recorder)
      setIsRecording(true)

      // Progressive countdown: 7 + current retries for this step
      const countdown = 7 + currentUserStepRetries
      setRecordingTimer(countdown)
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
    if (step.fallbackText && step.fallbackAudio) {
      setShowFallback(true)
      setCurrentUserStepRetries((prev) => prev + 1)
      setTotalRetries((prev) => prev + 1)

      setTimeout(() => {
        playFallbackAudio(step.fallbackAudio!)
      }, 100)
    }
  }

  const completeUserStep = () => {
    setIsRecording(false)
    setShowFallback(false)
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    // Add completed phrase
    const step = dialogueSteps[currentStep]
    if (step.userPrompt) {
      setCompletedPhrases((prev) => [...prev, step.userPrompt!])
    }

    // Reset retries for this step
    setCurrentUserStepRetries(0)

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
        // Mission complete
        setMissionEndTime(Date.now())
        setGameState("complete")
      }
    }, 1000)
  }

  const nextStep = () => {
    playUISound()
    stopCurrentAudio()
    stopFallbackAudio()

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
      setMissionEndTime(Date.now())
      setGameState("complete")
    }
  }

  const startCrawl = () => {
    playUISound()
    setGameState("crawl")
    setCrawlIndex(0)
    // Keep background music playing

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
    setMissionStartTime(Date.now())
    if (crawlTimerRef.current) clearInterval(crawlTimerRef.current)

    // Fade background music and start airport ambience
    if (backgroundMusicRef.current) {
      const fadeOut = setInterval(() => {
        if (backgroundMusicRef.current && backgroundMusicRef.current.volume > 0.05) {
          backgroundMusicRef.current.volume -= 0.05
        } else {
          clearInterval(fadeOut)
          if (backgroundMusicRef.current) {
            backgroundMusicRef.current.pause()
          }
        }
      }, 100)
    }

    // Start airport ambience
    if (airportAmbienceRef.current) {
      airportAmbienceRef.current.volume = 0.2
      airportAmbienceRef.current.loop = true
      airportAmbienceRef.current.play().catch(console.error)
    }

    // Auto-play first dialogue audio
    const firstDialogue = dialogueSteps[0]
    if (firstDialogue.audioFile) {
      setTimeout(() => {
        playAudio(firstDialogue.audioFile!, firstDialogue.speaker as "lenoir" | "kouassi")
      }, 500)
    }
  }

  const restartMission = () => {
    playUISound()
    setCurrentStep(0)
    setTotalRetries(0)
    setCurrentUserStepRetries(0)
    setCompletedPhrases([])
    setMissionStartTime(null)
    setMissionEndTime(null)
    setShowFallback(false)
    stopCurrentAudio()
    stopFallbackAudio()

    // Stop all audio
    if (heartbeatRef.current) heartbeatRef.current.pause()
    if (missionEndRef.current) missionEndRef.current.pause()
    if (backgroundMusicRef.current) backgroundMusicRef.current.pause()

    setGameState("game")
    setMissionStartTime(Date.now())

    // Start airport ambience
    if (airportAmbienceRef.current) {
      airportAmbienceRef.current.volume = 0.2
      airportAmbienceRef.current.loop = true
      airportAmbienceRef.current.play().catch(console.error)
    }

    // Auto-play first dialogue audio
    const firstDialogue = dialogueSteps[0]
    if (firstDialogue.audioFile) {
      setTimeout(() => {
        playAudio(firstDialogue.audioFile!, firstDialogue.speaker as "lenoir" | "kouassi")
      }, 500)
    }
  }

  const returnToTitle = () => {
    playUISound()
    setGameState("title")
    setCurrentStep(0)
    setTotalRetries(0)
    setCurrentUserStepRetries(0)
    setCompletedPhrases([])
    setMissionStartTime(null)
    setMissionEndTime(null)
    setShowFallback(false)
    stopCurrentAudio()
    stopFallbackAudio()

    // Stop all audio except background music
    if (heartbeatRef.current) heartbeatRef.current.pause()
    if (missionEndRef.current) missionEndRef.current.pause()
    if (airportAmbienceRef.current) airportAmbienceRef.current.pause()

    // Restart background music
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.volume = 0.3
      backgroundMusicRef.current.currentTime = 0
      backgroundMusicRef.current.play().catch(console.error)
    }
  }

  const quitGame = () => {
    playUISound()
    window.close()
  }

  // Calculate mission stats
  const getMissionTime = () => {
    if (missionStartTime && missionEndTime) {
      const seconds = Math.floor((missionEndTime - missionStartTime) / 1000)
      const minutes = Math.floor(seconds / 60)
      const remainingSeconds = seconds % 60
      return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
    }
    return "0:00"
  }

  const getMemoryRetrievalSpeed = () => {
    if (totalRetries <= 1) return "High"
    if (totalRetries <= 3) return "Medium"
    return "Low"
  }

  const getRecommendedReplays = () => {
    const mrs = getMemoryRetrievalSpeed()
    if (mrs === "High") return 1
    if (mrs === "Medium") return 2
    return 3
  }

  // Title Screen
  if (gameState === "title") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
        {/* Background Music */}
        <audio ref={backgroundMusicRef} preload="auto">
          <source
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Bienvenue%20au%20Service-R9en2nhrrOkZlrEWyijvZ39PkZmoEs.mp3"
            type="audio/mpeg"
          />
        </audio>

        {/* Airport Ambience */}
        <audio ref={airportAmbienceRef} preload="auto">
          <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/airport-ambiance-1-34146-OY48ZNNqkBsTa9kIiKfmMFo50TZcRo.mp3" type="audio/mpeg" />
        </audio>

        {/* Heartbeat */}
        <audio ref={heartbeatRef} preload="auto">
          <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/heartbeat-sound-372448-VOqT7dvxMtW1ZgYRZvOHdncEixERso.mp3" type="audio/mpeg" />
        </audio>

        {/* Mission End */}
        <audio ref={missionEndRef} preload="auto">
          <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Lenoir%20Mission%201%20End-lE3sVqPFmLzECKR3EfWu083TwEXzvP.mp3" type="audio/mpeg" />
        </audio>

        {/* UI Sound */}
        <audio ref={uiSoundRef} preload="auto">
          <source
            src="data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEYcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBji
