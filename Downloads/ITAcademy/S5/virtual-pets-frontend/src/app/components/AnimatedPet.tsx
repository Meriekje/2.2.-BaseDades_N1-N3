"use client"

import { useState, useEffect } from "react"

interface AnimatedPetProps {
  type: "MOLE" | "MAGPIE" | "TOAD"
  name: string
  color: string
  happinessLevel: number
  energyLevel: number
  hungerLevel: number
  isActive?: boolean
  action?: "feed" | "play" | "rest" | null
}

const petEmojis = {
  MOLE: "🐭",
  MAGPIE: "🐦‍⬛",
  TOAD: "🐸",
}

const petAnimations = {
  MOLE: {
    idle: "animate-bounce",
    feed: "animate-pulse",
    play: "animate-spin",
    rest: "animate-none",
  },
  MAGPIE: {
    idle: "animate-bounce",
    feed: "animate-pulse",
    play: "animate-ping",
    rest: "animate-none",
  },
  TOAD: {
    idle: "animate-pulse",
    feed: "animate-bounce",
    play: "animate-ping",
    rest: "animate-none",
  },
}

export default function AnimatedPet({
  type,
  name,
  color,
  happinessLevel,
  energyLevel,
  hungerLevel,
  isActive = false,
  action = null,
}: AnimatedPetProps) {
  const [currentAnimation, setCurrentAnimation] = useState("idle")
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (action && isActive) {
      setIsAnimating(true)
      setCurrentAnimation(action)

      const timer = setTimeout(() => {
        setCurrentAnimation("idle")
        setIsAnimating(false)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [action, isActive])

  useEffect(() => {
    if (!isAnimating) {
      const interval = setInterval(() => {
        if (hungerLevel > 70) {
          setCurrentAnimation("feed")
        } else if (energyLevel < 30) {
          setCurrentAnimation("rest")
        } else if (happinessLevel > 70) {
          setCurrentAnimation("play")
        } else {
          setCurrentAnimation("idle")
        }
      }, 3000)

      return () => clearInterval(interval)
    }
  }, [hungerLevel, energyLevel, happinessLevel, isAnimating])

  const getAnimationClass = () => {
    const animations = petAnimations[type]
    return animations[currentAnimation as keyof typeof animations] || animations.idle
  }

  const getSpecialEffects = () => {
    if (currentAnimation === "feed") {
      return (
        <div className="absolute -top-2 -right-2 text-2xl animate-bounce">
          {type === "MOLE" ? "🪱" : type === "MAGPIE" ? "🌰" : "🪰"}
        </div>
      )
    }
    if (currentAnimation === "play") {
      return <div className="absolute -top-2 -right-2 text-2xl animate-spin">✨</div>
    }
    if (currentAnimation === "rest") {
      return <div className="absolute -top-2 -right-2 text-2xl animate-pulse">💤</div>
    }
    return null
  }

  return (
    <div className="relative w-24 h-24 mx-auto">
      <div
        className={`w-full h-full transition-all duration-500 ${getAnimationClass()}`}
        style={{
          filter: `hue-rotate(${color === "#FF6B6B" ? "0deg" : color === "#4ECDC4" ? "180deg" : "90deg"})`,
        }}
      >
        <div className="w-full h-full flex items-center justify-center text-6xl" style={{ color }}>
          {petEmojis[type]}
        </div>
      </div>
      {getSpecialEffects()}

      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
        {happinessLevel > 70 && <span className="text-lg">😊</span>}
        {happinessLevel <= 70 && happinessLevel > 40 && <span className="text-lg">😐</span>}
        {happinessLevel <= 40 && <span className="text-lg">😢</span>}
      </div>
    </div>
  )
}
