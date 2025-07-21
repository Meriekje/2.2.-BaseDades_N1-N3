"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Plus, LogOut, User } from "lucide-react"
import PetCard from "./PetCard"
import CreatePetModal from "./CreatePetModal"

interface Pet {
  id: number
  name: string
  type: "MOLE" | "MAGPIE" | "TOAD"
  color: string
  happinessLevel: number
  energyLevel: number
  hungerLevel: number
}

interface DashboardProps {
  user: { username: string } | null
  onLogout: () => void
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  const [pets, setPets] = useState<Pet[]>([
    {
      id: 1,
      name: "Digger",
      type: "MOLE",
      color: "#FF6B6B",
      happinessLevel: 75,
      energyLevel: 60,
      hungerLevel: 30,
    },
    {
      id: 2,
      name: "Maggie",
      type: "MAGPIE",
      color: "#4ECDC4",
      happinessLevel: 85,
      energyLevel: 80,
      hungerLevel: 20,
    },
  ])
  const [showCreateModal, setShowCreateModal] = useState(false)

  const handleCreatePet = (petData: { name: string; type: string; color: string }) => {
    const newPet: Pet = {
      id: Date.now(),
      name: petData.name,
      type: petData.type as "MOLE" | "MAGPIE" | "TOAD",
      color: petData.color,
      happinessLevel: 50,
      energyLevel: 50,
      hungerLevel: 50,
    }
    setPets([...pets, newPet])
    setShowCreateModal(false)
  }

  const handlePetAction = (petId: number, action: string) => {
    setPets(
      pets.map((pet) => {
        if (pet.id === petId) {
          switch (action) {
            case "feed":
              return {
                ...pet,
                hungerLevel: Math.max(0, pet.hungerLevel - 20),
                happinessLevel: Math.min(100, pet.happinessLevel + 10),
              }
            case "play":
              return {
                ...pet,
                energyLevel: Math.max(0, pet.energyLevel - 15),
                happinessLevel: Math.min(100, pet.happinessLevel + 15),
              }
            case "rest":
              return { ...pet, energyLevel: Math.min(100, pet.energyLevel + 25) }
            default:
              return pet
          }
        }
        return pet
      }),
    )
  }

  const handleDeletePet = (petId: number) => {
    setPets(pets.filter((pet) => pet.id !== petId))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Welcome, {user?.username}!</h1>
              <p className="text-white/70 text-sm">Take care of your virtual pets</p>
            </div>
          </div>
          <Button onClick={onLogout} variant="ghost" className="text-white hover:bg-white/20">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Your Pets</h2>
            <p className="text-white/70">
              {pets.length === 0
                ? "No pets yet. Adopt your first companion!"
                : `You have ${pets.length} pet${pets.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Pet
          </Button>
        </div>

        {pets.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🐾</div>
            <h3 className="text-2xl font-bold text-white mb-2">No pets yet!</h3>
            <p className="text-white/70 mb-6">Adopt your first virtual pet to get started</p>
            <Button onClick={() => setShowCreateModal(true)} className="bg-white text-purple-600 hover:bg-white/90">
              <Plus className="h-4 w-4 mr-2" />
              Adopt Your First Pet
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} onAction={handlePetAction} onDelete={handleDeletePet} />
            ))}
          </div>
        )}
      </main>

      {/* Create Pet Modal */}
      {showCreateModal && (
        <CreatePetModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreatePet={handleCreatePet}
        />
      )}
    </div>
  )
}
