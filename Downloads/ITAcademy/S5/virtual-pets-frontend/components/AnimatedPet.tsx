"use client"

import { useEffect, useState } from "react"

interface AnimatedPetProps {
  type: "MOLE" | "MAGPIE" | "TOAD"
  color: string
  happinessLevel: number
  energyLevel: number
  hungerLevel: number
  action?: "feed" | "play" | "rest" | null
  size?: number
}

export default function AnimatedPet({
  type,
  color,
  happinessLevel,
  energyLevel,
  hungerLevel,
  action = null,
  size = 80,
}: AnimatedPetProps) {
  const [currentAnimation, setCurrentAnimation] = useState("idle")

  // Determine animation based on stats and action
  useEffect(() => {
    if (action) {
      setCurrentAnimation(action)
      const timer = setTimeout(() => setCurrentAnimation("idle"), 2000)
      return () => clearTimeout(timer)
    } else {
      // Auto-animate based on pet stats
      if (hungerLevel > 70) {
        setCurrentAnimation("hungry")
      } else if (energyLevel < 30) {
        setCurrentAnimation("tired")
      } else if (happinessLevel > 80) {
        setCurrentAnimation("happy")
      } else {
        setCurrentAnimation("idle")
      }
    }
  }, [action, hungerLevel, energyLevel, happinessLevel])

  const getAnimationClass = () => {
    switch (currentAnimation) {
      case "feed":
      case "hungry":
        return "animate-bounce-gentle"
      case "play":
      case "happy":
        return type === "MAGPIE" ? "animate-wiggle" : "animate-hop"
      case "rest":
      case "tired":
        return "animate-pulse"
      default:
        return type === "TOAD" ? "animate-hop" : "animate-bounce-gentle"
    }
  }

  const getSvgPath = () => `/assets/${type.toLowerCase()}.svg`

  const getActionEmoji = () => {
    if (currentAnimation === "feed" || currentAnimation === "hungry") {
      return type === "MOLE" ? "🪱" : type === "MAGPIE" ? "🌰" : "🪰"
    }
    if (currentAnimation === "play" || currentAnimation === "happy") {
      return "✨"
    }
    if (currentAnimation === "rest" || currentAnimation === "tired") {
      return "💤"
    }
    return null
  }

  return (
    <div className="relative flex items-center justify-center">
      <div className={`transition-all duration-500 ${getAnimationClass()}`} style={{ width: size, height: size }}>
        <img
          src={getSvgPath() || "/placeholder.svg"}
          alt={type}
          className="w-full h-full object-contain"
          style={{
            filter: `hue-rotate(${color === "#FF6B6B" ? "0deg" : color === "#4ECDC4" ? "180deg" : "90deg"})`,
          }}
        />
      </div>

      {/* Action indicator */}
      {getActionEmoji() && <div className="absolute -top-2 -right-2 text-2xl animate-bounce">{getActionEmoji()}</div>}

      {/* Mood indicator */}
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
        {happinessLevel > 70 && <span className="text-lg">😊</span>}
        {happinessLevel <= 70 && happinessLevel > 40 && <span className="text-lg">😐</span>}
        {happinessLevel <= 40 && <span className="text-lg">😢</span>}
      </div>
    </div>
  )
}
