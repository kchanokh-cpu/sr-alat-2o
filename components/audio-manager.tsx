"use client"

import { useEffect, useRef, useState } from "react"

interface AudioManagerProps {
  audioFiles: string[]
  onAudioReady?: () => void
}

export function AudioManager({ audioFiles, onAudioReady }: AudioManagerProps) {
  const [loadedCount, setLoadedCount] = useState(0)
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({})

  useEffect(() => {
    // Preload all audio files
    audioFiles.forEach((audioFile) => {
      if (!audioRefs.current[audioFile]) {
        const audio = new Audio(audioFile)
        audio.preload = "auto"

        audio.addEventListener("canplaythrough", () => {
          setLoadedCount((prev) => prev + 1)
        })

        audio.addEventListener("error", (e) => {
          console.error(`Failed to load audio: ${audioFile}`, e)
        })

        audioRefs.current[audioFile] = audio
      }
    })

    return () => {
      // Cleanup audio elements
      Object.values(audioRefs.current).forEach((audio) => {
        audio.pause()
        audio.src = ""
      })
    }
  }, [audioFiles])

  useEffect(() => {
    if (loadedCount === audioFiles.length && onAudioReady) {
      onAudioReady()
    }
  }, [loadedCount, audioFiles.length, onAudioReady])

  const playAudio = (audioFile: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const audio = audioRefs.current[audioFile]
      if (audio) {
        audio.currentTime = 0
        audio
          .play()
          .then(() => {
            audio.onended = () => resolve()
          })
          .catch(reject)
      } else {
        reject(new Error(`Audio file not found: ${audioFile}`))
      }
    })
  }

  const stopAudio = (audioFile: string) => {
    const audio = audioRefs.current[audioFile]
    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }
  }

  const stopAllAudio = () => {
    Object.values(audioRefs.current).forEach((audio) => {
      audio.pause()
      audio.currentTime = 0
    })
  }

  return {
    playAudio,
    stopAudio,
    stopAllAudio,
    loadedCount,
    totalFiles: audioFiles.length,
    isReady: loadedCount === audioFiles.length,
  }
}
