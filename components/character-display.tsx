"use client"

import { useState, useEffect } from "react"

interface CharacterDisplayProps {
  character: "lenoir" | "kouassi" | "toure"
  isActive?: boolean
  isRecording?: boolean
}

export function CharacterDisplay({ character, isActive = false, isRecording = false }: CharacterDisplayProps) {
  const [imageError, setImageError] = useState(false)

  const characterData = {
    lenoir: {
      name: "Commandant Lenoir",
      image: "/characters/lenoir-portrait.jpg",
      color: "blue-400",
      fallback: "/placeholder-user.jpg",
    },
    kouassi: {
      name: "Kouassi",
      image: "/characters/kouassi-portrait.jpg",
      color: "green-400",
      fallback: "/placeholder-user.jpg",
    },
    toure: {
      name: "Agent Touré",
      image: "/characters/toure-portrait.jpg",
      color: "yellow-400",
      fallback: "/placeholder-user.jpg",
    },
  }

  const data = characterData[character]

  useEffect(() => {
    setImageError(false)
  }, [character])

  const getBorderClass = () => {
    if (isRecording) {
      return `border-red-400 shadow-lg shadow-red-400/50 animate-pulse`
    }
    if (isActive) {
      return `border-${data.color} shadow-lg shadow-${data.color}/50`
    }
    return "border-gray-600"
  }

  return (
    <div className="text-center">
      <img
        src={imageError ? data.fallback : data.image}
        alt={data.name}
        className={`w-32 h-32 rounded-full mx-auto border-4 transition-all duration-300 ${getBorderClass()}`}
        onError={() => setImageError(true)}
      />
      <div className={`text-${data.color} font-bold mt-2`}>
        {data.name}
        {character === "toure" && " (You)"}
      </div>
    </div>
  )
}
