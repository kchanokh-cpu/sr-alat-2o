"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Volume2, BookOpen } from "lucide-react"
import { useState } from "react"

interface PronunciationGuideProps {
  phrase: string
  phonetic: string
  translation: string
  audioFile?: string
  onPlayAudio?: (audioFile: string) => void
}

export function PronunciationGuide({ phrase, phonetic, translation, audioFile, onPlayAudio }: PronunciationGuideProps) {
  const [showGuide, setShowGuide] = useState(false)

  return (
    <div className="space-y-2">
      <Button
        onClick={() => setShowGuide(!showGuide)}
        variant="outline"
        size="sm"
        className="bg-slate-700 border-slate-600 hover:bg-slate-600"
      >
        <BookOpen className="w-4 h-4 mr-2" />
        {showGuide ? "Hide" : "Show"} Pronunciation Guide
      </Button>

      {showGuide && (
        <Card className="p-4 bg-slate-800/90 border-blue-400">
          <div className="space-y-3">
            <div>
              <h4 className="text-blue-300 font-semibold mb-1">French Phrase:</h4>
              <p className="text-white text-lg font-medium">{phrase}</p>
            </div>

            <div>
              <h4 className="text-blue-300 font-semibold mb-1">Pronunciation:</h4>
              <p className="text-blue-200 italic">[{phonetic}]</p>
            </div>

            <div>
              <h4 className="text-blue-300 font-semibold mb-1">Translation:</h4>
              <p className="text-slate-300">{translation}</p>
            </div>

            {audioFile && onPlayAudio && (
              <Button onClick={() => onPlayAudio(audioFile)} size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Volume2 className="w-4 h-4 mr-2" />
                Listen to Pronunciation
              </Button>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}
