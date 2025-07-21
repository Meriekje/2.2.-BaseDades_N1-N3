"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import AnimatedPet from "./AnimatedPet"

interface CreatePetModalProps {
  isOpen: boolean
  onClose: () => void
  onCreatePet: (petData: { name: string; type: string; color: string }) => void
}

const petTypes = [
  { value: "MOLE", label: "🐭 Mole", description: "Loves digging and eating worms" },
  { value: "MAGPIE", label: "🐦‍⬛ Magpie", description: "Clever bird that collects shiny things" },
  { value: "TOAD", label: "🐸 Toad", description: "Jumpy amphibian that catches flies" },
]

const petColors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F"]

export default function CreatePetModal({ isOpen, onClose, onCreatePet }: CreatePetModalProps) {
  const [name, setName] = useState("")
  const [type, setType] = useState("")
  const [color, setColor] = useState(petColors[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !type) {
      setError("Please fill in all fields")
      return
    }

    setLoading(true)
    setError("")

    // Simulate creation delay
    setTimeout(() => {
      onCreatePet({ name: name.trim(), type, color })
      setName("")
      setType("")
      setColor(petColors[0])
      setLoading(false)
    }, 1000)
  }

  const handleClose = () => {
    if (!loading) {
      setName("")
      setType("")
      setColor(petColors[0])
      setError("")
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="mb-4">
          <h2 className="text-xl font-bold">Adopt a New Pet</h2>
          <p className="text-gray-600">Choose your new virtual companion carefully!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Pet Preview */}
          {type && (
            <div className="flex justify-center py-4 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg">
              <AnimatedPet
                type={type as "MOLE" | "MAGPIE" | "TOAD"}
                name={name || "Preview"}
                color={color}
                happinessLevel={75}
                energyLevel={75}
                hungerLevel={25}
                isActive={false}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="pet-name">Pet Name</Label>
            <Input
              id="pet-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your pet's name"
              disabled={loading}
              maxLength={50}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pet-type">Pet Type</Label>
            <Select value={type} onValueChange={setType} disabled={loading}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a pet type" />
              </SelectTrigger>
              <SelectContent>
                {petTypes.map((petType) => (
                  <SelectItem key={petType.value} value={petType.value}>
                    <div className="flex flex-col">
                      <span>{petType.label}</span>
                      <span className="text-xs text-muted-foreground">{petType.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Pet Color Theme</Label>
            <div className="flex gap-2 flex-wrap">
              {petColors.map((colorOption) => (
                <button
                  key={colorOption}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    color === colorOption ? "border-gray-800 scale-110" : "border-gray-300 hover:scale-105"
                  }`}
                  style={{ backgroundColor: colorOption }}
                  onClick={() => setColor(colorOption)}
                  disabled={loading}
                />
              ))}
            </div>
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 bg-transparent"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || !name.trim() || !type} className="flex-1">
              {loading ? "Creating..." : "Adopt Pet"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
