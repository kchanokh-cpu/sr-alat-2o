"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Mic, MicOff, Volume2 } from 'lucide-react'
import { GameState, GameStats } from "@/app/page"

interface GameplayProps {
  onStateChange: (newState: GameState, data?: any) => void
  playUISound: () => void
  gameStats: GameStats
  setGameStats: (stats: GameStats) => void
}

interface DialogueStep {
  id: number
  character: string
  characterImage: string
  text: string
  audioUrl: string
  expectedResponse?: string
  isUserResponse?: boolean
}

const dialogueSteps: DialogueStep[] = [
  {
    id: 1,
    character: "Commandant Lenoir",
    characterImage: "/characters/lenoir-portrait.jpg",
    text: "Bonjour, Agent. Êtes-vous prêt pour votre mission?",
    audioUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Bonjour%2C%20Agent.%20%C3%8Ates-vous%20pr%C3%AAt%20pour%20votre%20mission-yOQGJmH8zr6vZ8pQqOGJmH8zr6vZ8pQ.mp3"
  },
  {
    id: 2,
    character: "User Response",
    characterImage: "/placeholder-user.jpg",
    text: "Respond: 'Oui, Commandant. Je suis prêt.'",
    audioUrl: "",
    expectedResponse: "Oui, Commandant. Je suis prêt.",
    isUserResponse: true
  },
  {
    id: 3,
    character: "Dr. Kouassi",
    characterImage: "/characters/kouassi-portrait.jpg",
    text: "Excellent. Votre première épreuve commence maintenant.",
    audioUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Excellent.%20Votre%20premi%C3%A8re%20%C3%A9preuve%20commence%20maintenant-8pQqOGJmH8zr6vZ8pQqOGJmH8zr6vZ8.mp3"
  },
  {
    id: 4,
    character: "User Response",
    characterImage: "/placeholder-user.jpg",
    text: "Respond: 'Je comprends. Que dois-je faire?'",
    audioUrl: "",
    expectedResponse: "Je comprends. Que dois-je faire?",
    isUserResponse: true
  },
  {
    id: 5,
    character: "Agent Touré",
    characterImage: "/characters/toure-portrait.jpg",
    text: "Très bien. Mission accomplie, Agent.",
    audioUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Tr%C3%A8s%20bien.%20Mission%20accomplie%2C%20Agent-qOGJmH8zr6vZ8pQqOGJmH8zr6vZ8pQq.mp3"
  }
]

export default function Gameplay({ onStateChange, playUISound, gameStats, setGameStats }: GameplayProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [canStartRecording, setCanStartRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [hasPlayedAudio, setHasPlayedAudio] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  const audioRef = useRef<HTMLAudioElement>(null)
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)

  useEffect(() => {
    // Initialize mission start time
    if (!gameStats.missionStartTime) {
      setGameStats({
        ...gameStats,
        missionStartTime: Date.now()
      })
    }
  }, [])

  useEffect(() => {
    // Auto-play audio for non-user steps
    const step = dialogueSteps[currentStep]
    if (step && !step.isUserResponse && step.audioUrl) {
      playStepAudio()
    } else if (step && step.isUserResponse) {
      setCanStartRecording(true)
      setHasPlayedAudio(true)
    }
  }, [currentStep])

  const playStepAudio = () => {
    const step = dialogueSteps[currentStep]
    if (audioRef.current && step.audioUrl) {
      audioRef.current.src = step.audioUrl
      audioRef.current.play().catch(console.error)
    }
  }

  const handleAudioEnded = () => {
    setHasPlayedAudio(true)
    setCanStartRecording(true)
  }

  const startRecording = async () => {
    if (!canStartRecording) return

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      setIsRecording(true)
      setRecordingTime(0)
      
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)

      mediaRecorder.start()

      // Auto-stop after 10 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
          stopRecording()
        }
      }, 10000)

    } catch (error) {
      console.error("Error starting recording:", error)
      // Trigger faux pas for recording failure
      handleFauxPas()
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop())
    }

    if (recordingTimerRef.current) {
      clearInterval(recordingTimerRef.current)
    }

    setIsRecording(false)
    setRecordingTime(0)

    // Simulate processing and move to next step
    setTimeout(() => {
      handleStepComplete()
    }, 1000)
  }

  const handleStepComplete = () => {
    const step = dialogueSteps[currentStep]
    
    // Add completed phrase to stats
    if (step.expectedResponse) {
      setGameStats(prev => ({
        ...prev,
        completedPhrases: [...prev.completedPhrases, step.expectedResponse!]
      }))
    }

    // Move to next step or complete mission
    if (currentStep < dialogueSteps.length - 1) {
      setCurrentStep(prev => prev + 1)
      setCanStartRecording(false)
      setHasPlayedAudio(false)
      setRetryCount(0)
    } else {
      // Mission complete
      setGameStats(prev => ({
        ...prev,
        missionEndTime: Date.now()
      }))
      onStateChange("complete", { stats: gameStats })
    }
  }

  const handleFauxPas = () => {
    setRetryCount(prev => prev + 1)
    setGameStats(prev => ({
      ...prev,
      totalRetries: prev.totalRetries + 1
    }))
    
    onStateChange("faux-pas", { fauxPasStep: currentStep })
  }

  const handleSkipStep = () => {
    playUISound()
    handleStepComplete()
  }

  const currentDialogue = dialogueSteps[currentStep]
  const progress = ((currentStep + 1) / dialogueSteps.length) * 100

  if (!currentDialogue) return null

  return (
    <div 
      className="min-h-screen flex flex-col relative"
      style={{
        backgroundImage: "url('/backgrounds/kotoka-airport.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70" />
      
      {/* Progress bar */}
      <div className="relative z-10 p-4">
        <Progress value={progress} className="w-full" />
        <p className="text-green-400 text-sm mt-2 text-center">
          Step {currentStep + 1} of {dialogueSteps.length}
        </p>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl bg-black/80 border-green-500">
          <CardContent className="p-6">
            {/* Character display */}
            <div className="flex items-center space-x-4 mb-6">
              <img 
                src={currentDialogue.characterImage || "/placeholder.svg"} 
                alt={currentDialogue.character}
                className="w-16 h-16 rounded-full border-2 border-green-400"
              />
              <div>
                <h3 className="text-green-400 font-semibold text-lg">
                  {currentDialogue.character}
                </h3>
              </div>
            </div>

            {/* Dialogue text */}
            <div className="mb-6">
              <p className="text-white text-lg leading-relaxed">
                {currentDialogue.text}
              </p>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center space-y-4">
              {!currentDialogue.isUserResponse ? (
                // Audio playback controls
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={playStepAudio}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Volume2 className="w-4 h-4 mr-2" />
                    Play Audio
                  </Button>
                  
                  {hasPlayedAudio && (
                    <Button
                      onClick={handleSkipStep}
                      variant="outline"
                      className="border-green-500 text-green-400"
                    >
                      Continue
                    </Button>
                  )}
                </div>
              ) : (
                // Recording controls
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex items-center space-x-4">
                    <Button
                      onClick={isRecording ? stopRecording : startRecording}
                      disabled={!canStartRecording}
                      className={`${
                        isRecording 
                          ? "bg-red-600 hover:bg-red-700" 
                          : "bg-green-600 hover:bg-green-700"
                      } px-8 py-4`}
                    >
                      {isRecording ? (
                        <>
                          <MicOff className="w-5 h-5 mr-2" />
                          Stop Recording ({recordingTime}s)
                        </>
                      ) : (
                        <>
                          <Mic className="w-5 h-5 mr-2" />
                          Start Recording
                        </>
                      )}
                    </Button>
                  </div>

                  {retryCount > 0 && (
                    <p className="text-yellow-400 text-sm">
                      Retry attempt: {retryCount}
                    </p>
                  )}

                  <Button
                    onClick={handleFauxPas}
                    variant="outline"
                    className="border-yellow-500 text-yellow-400 text-sm"
                  >
                    Need Help?
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
