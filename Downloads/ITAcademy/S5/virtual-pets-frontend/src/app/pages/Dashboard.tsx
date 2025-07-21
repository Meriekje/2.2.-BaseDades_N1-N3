"use client"

import { useEffect, useState } from "react"
import { useAuth } from "../context/AuthContext"
import { usePets } from "../context/PetContext"
import PetCard from "../components/PetCard"
import CreatePetModal from "../components/CreatePetModal"
import { Button } from "@/components/ui/button"
import { Plus, LogOut, User } from "lucide-react"

export default function Dashboard() {
  const { user, logout } = useAuth()
  const { pets, loading, fetchPets } = usePets()
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    fetchPets()
  }, [])

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
          <Button onClick={logout} variant="ghost" className="text-white hover:bg-white/20">
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

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : pets.length === 0 ? (
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
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        )}
      </main>

      {/* Create Pet Modal */}
      {showCreateModal && <CreatePetModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />}
    </div>
  )
}
