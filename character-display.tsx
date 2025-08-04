"use client"

import { Card } from "@/components/ui/card"

interface CharacterDisplayProps {
  speaker: "lenoir" | "kouassi" | "user"
  isActive: boolean
}

export function CharacterDisplay({ speaker, isActive }: CharacterDisplayProps) {
  const getCharacterInfo = () => {
    switch (speaker) {
      case "lenoir":
        return {
          name: "Commandant Lenoir",
          image: "/images/characters/lenoir-portrait.jpg",
          title: "SRLUF Intelligence Officer",
          borderColor: "border-blue-400",
          bgColor: "bg-blue-900/20",
        }
      case "kouassi":
        return {
          name: "Kouassi",
          image: "/images/characters/kouassi-portrait.jpg",
          title: "UG Law Student",
          borderColor: "border-yellow-400",
          bgColor: "bg-yellow-900/20",
        }
      default:
        return {
          name: "Touré Yao",
          image: "/images/characters/toure-portrait.jpg",
          title: "SRLUF Agent",
          borderColor: "border-green-400",
          bgColor: "bg-green-900/20",
        }
    }
  }

  const character = getCharacterInfo()

  return (
    <Card
      className={`p-4 transition-all duration-300 ${
        isActive
          ? `${character.bgColor} ${character.borderColor} border-2 scale-105`
          : "bg-slate-800/50 border-slate-600"
      }`}
    >
      <div className="flex flex-col items-center space-y-2">
        <img
          src={character.image || "/placeholder.svg"}
          alt={character.name}
          className={`w-20 h-20 rounded-full object-cover transition-all duration-300 ${
            isActive ? `${character.borderColor} border-3` : "border-2 border-slate-500"
          }`}
        />
        <div className="text-center">
          <h3 className={`font-semibold text-sm ${isActive ? "text-white" : "text-slate-400"}`}>{character.name}</h3>
          <p className={`text-xs ${isActive ? "text-slate-300" : "text-slate-500"}`}>{character.title}</p>
        </div>
      </div>
    </Card>
  )
}
