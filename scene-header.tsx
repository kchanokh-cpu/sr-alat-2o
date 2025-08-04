"use client"

import { MapPin, Plane } from "lucide-react"

export function SceneHeader() {
  return (
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
  )
}
