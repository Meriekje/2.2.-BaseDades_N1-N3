"use client"

import { useState } from "react"
import { usePets } from "../context/PetContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Heart, Zap, Apple, Bed, Edit, Trash2 } from "lucide-react"

interface Pet {
  id: number
  name: string
  type: "MAGPIE" | "DRAGON" | "UNICORN" | "PHOENIX"
  color: string
  happinessLevel: number
  energyLevel: number
  hungerLevel: number
  ownerId: number
  ownerUsername: string
}

interface PetCardProps {
  pet: Pet
}

const petEmojis = {
  MAGPIE: "🐦‍⬛",
  DRAGON: "🐉",
  UNICORN: "🦄",
  PHOENIX: "🔥",
}

const getStatusColor = (level: number) => {
  if (level >= 70) return "text-green-500"
  if (level >= 40) return "text-yellow-500"
  return "text-red-500"
}

const getProgressColor = (level: number) => {
  if (level >= 70) return "bg-green-500"
  if (level >= 40) return "bg-yellow-500"
  return "bg-red-500"
}

export default function PetCard({ pet }: PetCardProps) {
  const { feedPet, playWithPet, restPet, deletePet } = usePets()
  const [loading, setLoading] = useState<string | null>(null)

  const handleAction = async (action: string, petId: number) => {
    setLoading(action)
    try {
      switch (action) {
        case "feed":
          await feedPet(petId)
          break
        case "play":
          await playWithPet(petId)
          break
        case "rest":
          await restPet(petId)
          break
        case "delete":
          if (confirm(`Are you sure you want to release ${pet.name}?`)) {
            await deletePet(petId)
          }
          break
      }
    } catch (error) {
      console.error(`Error ${action}ing pet:`, error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
              style={{ backgroundColor: pet.color + "40" }}
            >
              {petEmojis[pet.type]}
            </div>
            <div>
              <CardTitle className="text-white text-lg">{pet.name}</CardTitle>
              <Badge variant="secondary" className="text-xs">
                {pet.type}
              </Badge>
            </div>
          </div>
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" className="text-white/70 hover:text-white hover:bg-white/20 p-1 h-8 w-8">
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-red-300 hover:text-red-200 hover:bg-red-500/20 p-1 h-8 w-8"
              onClick={() => handleAction("delete", pet.id)}
              disabled={loading === "delete"}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Heart className={`h-4 w-4 ${getStatusColor(pet.happinessLevel)}`} />
            <div className="flex-1">
              <div className="flex justify-between text-sm text-white/70 mb-1">
                <span>Happiness</span>
                <span>{pet.happinessLevel}%</span>
              </div>
              <Progress value={pet.happinessLevel} className="h-2" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Zap className={`h-4 w-4 ${getStatusColor(pet.energyLevel)}`} />
            <div className="flex-1">
              <div className="flex justify-between text-sm text-white/70 mb-1">
                <span>Energy</span>
                <span>{pet.energyLevel}%</span>
              </div>
              <Progress value={pet.energyLevel} className="h-2" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Apple className={`h-4 w-4 ${getStatusColor(100 - pet.hungerLevel)}`} />
            <div className="flex-1">
              <div className="flex justify-between text-sm text-white/70 mb-1">
                <span>Fullness</span>
                <span>{100 - pet.hungerLevel}%</span>
              </div>
              <Progress value={100 - pet.hungerLevel} className="h-2" />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <Button
            size="sm"
            variant="ghost"
            className="text-white hover:bg-green-500/20 hover:text-green-200"
            onClick={() => handleAction("feed", pet.id)}
            disabled={loading === "feed"}
          >
            <Apple className="h-4 w-4 mr-1" />
            Feed
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-white hover:bg-blue-500/20 hover:text-blue-200"
            onClick={() => handleAction("play", pet.id)}
            disabled={loading === "play"}
          >
            <Heart className="h-4 w-4 mr-1" />
            Play
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-white hover:bg-purple-500/20 hover:text-purple-200"
            onClick={() => handleAction("rest", pet.id)}
            disabled={loading === "rest"}
          >
            <Bed className="h-4 w-4 mr-1" />
            Rest
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
