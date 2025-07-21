"use client"

import type React from "react"

import { useState } from "react"
import { usePets } from "../context/PetContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface CreatePetModalProps {
  isOpen: boolean
  onClose: () => void
}

const petTypes = [
  { value: "MAGPIE", label: "🐦‍⬛ Magpie", description: "Clever and curious" },
  { value: "DRAGON", label: "🐉 Dragon", description: "Powerful and majestic" },
  { value: "UNICORN", label: "🦄 Unicorn", description: "Pure and magical" },
  { value: "PHOENIX", label: "🔥 Phoenix", description: "Reborn from ashes" },
]

const petColors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F"]

export default function CreatePetModal({ isOpen, onClose }: CreatePetModalProps) {
  const [name, setName] = useState("")
  const [type, setType] = useState("")
  const [color, setColor] = useState(petColors[0])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { createPet } = usePets()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !type) {
      setError("Please fill in all fields")
      return
    }

    setLoading(true)
    setError("")

    try {
      const success = await createPet({ name: name.trim(), type, color })
      if (success) {
        setName("")
        setType("")
        setColor(petColors[0])
        onClose()
      } else {
        setError("Failed to create pet")
      }
    } catch (error) {
      setError("Failed to create pet")
    } finally {
      setLoading(false)
    }
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

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adopt a New Pet</DialogTitle>
          <DialogDescription>Choose your new virtual companion carefully!</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Label>Pet Color</Label>
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
      </DialogContent>
    </Dialog>
  )
}
