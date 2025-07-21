"use client"

import { Crown } from "lucide-react"
import type React from "react"
import { useState, useEffect } from "react"
import { api, type Pet, type LoginResponse } from "../lib/api"
import AnimatedPet from "../components/AnimatedPet"
import { Heart, Zap, Apple, Bed, Plus, LogOut, User, Trash2 } from "lucide-react"

export default function VirtualPetsApp() {
  const [user, setUser] = useState<LoginResponse["user"] | null>(null)
  const [pets, setPets] = useState<Pet[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Login form
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isLogin, setIsLogin] = useState(true)

  // Create pet form
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newPetName, setNewPetName] = useState("")
  const [newPetType, setNewPetType] = useState<"MOLE" | "MAGPIE" | "TOAD">("MOLE")
  const [newPetColor, setNewPetColor] = useState("#FF6B6B")

  // Action states
  const [actionStates, setActionStates] = useState<Record<number, string>>({})

  // Check for existing token on load
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (token) {
      // Decode token to get user info (simple JWT decode)
      try {
        const payload = JSON.parse(atob(token.split(".")[1]))
        const userData = {
          id: payload.userId,
          username: payload.sub,
          role: payload.role || "ROLE_USER",
        }
        setUser(userData)
        loadPets(userData.role) // 🔄 Passar el rol
        if (userData.role === "ROLE_ADMIN") {
          loadUsers() // 🆕 Carregar usuaris si és admin
        }
      } catch (e) {
        localStorage.removeItem("token")
      }
    }
  }, [])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = isLogin ? await api.login(username, password) : await api.register(username, password)

      localStorage.setItem("token", response.token)
      setUser(response.user)
      await loadPets(response.user.role)
      if (response.user.role === "ROLE_ADMIN") {
        await loadUsers()
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const loadPets = async (userRole?: string) => {
    try {
      const petsData = await api.getPetsForCurrentUser(userRole)
      setPets(petsData)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const loadUsers = async () => {
    try {
      const usersData = await api.getAllUsers()
      setUsers(usersData)
    } catch (err: any) {
      console.error("Failed to load users:", err.message)
    }
  }

  const handleCreatePet = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPetName.trim()) return

    setLoading(true)
    try {
      const newPet = await api.createPet({
        name: newPetName.trim(),
        type: newPetType,
        color: newPetColor,
      })
      setPets([...pets, newPet])
      setNewPetName("")
      setShowCreateForm(false)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePetAction = async (petId: number, action: "feed" | "play" | "rest") => {
    setActionStates((prev) => ({ ...prev, [petId]: action }))

    try {
      let updatedPet: Pet
      switch (action) {
        case "feed":
          updatedPet = await api.feedPet(petId)
          break
        case "play":
          updatedPet = await api.playWithPet(petId)
          break
        case "rest":
          updatedPet = await api.restPet(petId)
          break
      }

      setPets(pets.map((pet) => (pet.id === petId ? updatedPet : pet)))

      // Clear action state after animation
      setTimeout(() => {
        setActionStates((prev) => ({ ...prev, [petId]: "" }))
      }, 2000)
    } catch (err: any) {
      setError(err.message)
      setActionStates((prev) => ({ ...prev, [petId]: "" }))
    }
  }

  const handleDeletePet = async (petId: number) => {
    if (!confirm("Are you sure you want to release this pet?")) return

    try {
      await api.deletePet(petId)
      setPets(pets.filter((pet) => pet.id !== petId))
    } catch (err: any) {
      setError(err.message)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    setPets([])
    setUsers([])
  }

  // Check if user is admin
  const isAdmin = user?.role === "ROLE_ADMIN"

  // Login/Register Form
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Virtual Pets</h1>
            <p className="text-white/80">Take care of your mole, magpie, and toad!</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30"
                required
              />
            </div>

            {error && <div className="text-red-300 text-sm">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white/20 hover:bg-white/30 text-white p-3 rounded-lg border border-white/30 disabled:opacity-50"
            >
              {loading ? "Loading..." : isLogin ? "Login" : "Register"}
            </button>

            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="w-full text-white/80 hover:text-white text-sm"
            >
              {isLogin ? "Need an account? Register" : "Have an account? Login"}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Main Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isAdmin ? <Crown className="h-8 w-8 text-yellow-400" /> : <User className="h-8 w-8 text-white" />}
            <div>
              <h1 className="text-xl font-bold text-white">
                Welcome, {user.username}! {isAdmin && <span className="text-yellow-400">(Admin)</span>}
              </h1>
              <p className="text-white/70 text-sm">
                {isAdmin ? "Manage all virtual pets" : "Take care of your virtual pets"}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-white hover:bg-white/20 px-4 py-2 rounded-lg"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">{isAdmin ? "All Pets" : "Your Pets"}</h2>
            <p className="text-white/70">
              {pets.length === 0
                ? isAdmin
                  ? "No pets in the system yet."
                  : "No pets yet. Accommodate your first companion!"
                : `${isAdmin ? "Total:" : "You have"} ${pets.length} pet${pets.length !== 1 ? "s" : ""}`}
            </p>
            {isAdmin && users.length > 0 && (
              <p className="text-white/60 text-sm mt-1">
                {users.length} user{users.length !== 1 ? "s" : ""} registered
              </p>
            )}
          </div>
          {!isAdmin && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg border border-white/30"
            >
              <Plus className="h-4 w-4" />
              Add Pet
            </button>
          )}
        </div>

        {error && <div className="bg-red-500/20 border border-red-500/50 text-white p-4 rounded-lg mb-4">{error}</div>}

        {/* Pets Grid */}
        {pets.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🐾</div>
            <h3 className="text-2xl font-bold text-white mb-2">
              {isAdmin ? "No pets in the system!" : "No pets yet!"}
            </h3>
            <p className="text-white/70 mb-6">
              {isAdmin ? "Users haven't accomodate any pets yet" : "Accomodate your first virtual pet to get started"}
            </p>
            {!isAdmin && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-white text-purple-600 hover:bg-white/90 px-6 py-3 rounded-lg font-medium"
              >
                Accomodate Your First Pet
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <div key={pet.id} className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">{pet.name}</h3>
                    <span className="text-white/70 text-sm">{pet.type}</span>
                    {/* 🆕 MOSTRAR PROPIETARI SI ÉS ADMIN */}
                    {isAdmin && <div className="text-white/60 text-xs mt-1">Owner: {pet.ownerUsername}</div>}
                  </div>
                  {(!isAdmin || pet.ownerId === user.id) && (
                    <button
                      onClick={() => handleDeletePet(pet.id)}
                      className="text-red-300 hover:text-red-200 hover:bg-red-500/20 p-2 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Animated Pet */}
                <div className="flex justify-center py-6">
                  <AnimatedPet
                    type={pet.type}
                    color={pet.color}
                    happinessLevel={pet.happinessLevel}
                    energyLevel={pet.energyLevel}
                    hungerLevel={pet.hungerLevel}
                    action={actionStates[pet.id] as any}
                    size={100}
                  />
                </div>

                {/* Stats */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-3">
                    <Heart className="h-4 w-4 text-red-400" />
                    <div className="flex-1">
                      <div className="flex justify-between text-sm text-white/70 mb-1">
                        <span>Happiness</span>
                        <span>{pet.happinessLevel}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div
                          className="bg-red-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${pet.happinessLevel}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Zap className="h-4 w-4 text-yellow-400" />
                    <div className="flex-1">
                      <div className="flex justify-between text-sm text-white/70 mb-1">
                        <span>Energy</span>
                        <span>{pet.energyLevel}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${pet.energyLevel}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Apple className="h-4 w-4 text-green-400" />
                    <div className="flex-1">
                      <div className="flex justify-between text-sm text-white/70 mb-1">
                        <span>Fullness</span>
                        <span>{100 - pet.hungerLevel}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div
                          className="bg-green-400 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${100 - pet.hungerLevel}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {(!isAdmin || pet.ownerId === user.id) && (
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => handlePetAction(pet.id, "feed")}
                      disabled={actionStates[pet.id] === "feed"}
                      className="flex items-center justify-center gap-1 bg-green-500/20 hover:bg-green-500/30 text-white py-2 px-3 rounded-lg text-sm disabled:opacity-50"
                    >
                      <Apple className="h-4 w-4" />
                      Feed
                    </button>
                    <button
                      onClick={() => handlePetAction(pet.id, "play")}
                      disabled={actionStates[pet.id] === "play"}
                      className="flex items-center justify-center gap-1 bg-blue-500/20 hover:bg-blue-500/30 text-white py-2 px-3 rounded-lg text-sm disabled:opacity-50"
                    >
                      <Heart className="h-4 w-4" />
                      Play
                    </button>
                    <button
                      onClick={() => handlePetAction(pet.id, "rest")}
                      disabled={actionStates[pet.id] === "rest"}
                      className="flex items-center justify-center gap-1 bg-purple-500/20 hover:bg-purple-500/30 text-white py-2 px-3 rounded-lg text-sm disabled:opacity-50"
                    >
                      <Bed className="h-4 w-4" />
                      Rest
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Create Pet Modal */}
        {!isAdmin && showCreateForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 w-full max-w-md border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">Adopt a New Pet</h2>

              <form onSubmit={handleCreatePet} className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Pet Name"
                    value={newPetName}
                    onChange={(e) => setNewPetName(e.target.value)}
                    className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30"
                    required
                  />
                </div>

                <div>
                  <select
                    value={newPetType}
                    onChange={(e) => setNewPetType(e.target.value as "MOLE" | "MAGPIE" | "TOAD")}
                    className="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30"
                  >
                    <option value="MOLE">🐭 Mole - Loves digging</option>
                    <option value="MAGPIE">🐦‍⬛ Magpie - Clever bird</option>
                    <option value="TOAD">🐸 Toad - Jumpy amphibian</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-2">Color Theme</label>
                  <div className="flex gap-2">
                    {["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD"].map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewPetColor(color)}
                        className={`w-8 h-8 rounded-full border-2 ${newPetColor === color ? "border-white" : "border-white/30"}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 bg-white/20 hover:bg-white/30 text-white py-3 rounded-lg border border-white/30"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-white/20 hover:bg-white/30 text-white py-3 rounded-lg border border-white/30 disabled:opacity-50"
                  >
                    {loading ? "Creating..." : "Accomodate Pet"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
