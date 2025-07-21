"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { petService } from "../services/petService"

interface Pet {
  id: number
  name: string
  type: "MOLE" | "MAGPIE" | "TOAD"
  color: string
  happinessLevel: number
  energyLevel: number
  hungerLevel: number
  ownerId: number
  ownerUsername: string
}

interface PetContextType {
  pets: Pet[]
  loading: boolean
  fetchPets: () => Promise<void>
  createPet: (petData: { name: string; type: string; color: string }) => Promise<boolean>
  updatePet: (id: number, petData: { name: string; type: string; color: string }) => Promise<boolean>
  deletePet: (id: number) => Promise<boolean>
  feedPet: (id: number) => Promise<boolean>
  playWithPet: (id: number) => Promise<boolean>
  restPet: (id: number) => Promise<boolean>
}

const PetContext = createContext<PetContextType | undefined>(undefined)

export function PetProvider({ children }: { children: ReactNode }) {
  const [pets, setPets] = useState<Pet[]>([])
  const [loading, setLoading] = useState(false)

  const fetchPets = async () => {
    setLoading(true)
    try {
      const petsData = await petService.getUserPets()
      setPets(petsData)
    } catch (error) {
      console.error("Error fetching pets:", error)
    } finally {
      setLoading(false)
    }
  }

  const createPet = async (petData: { name: string; type: string; color: string }): Promise<boolean> => {
    try {
      const newPet = await petService.createPet(petData)
      setPets((prev) => [...prev, newPet])
      return true
    } catch (error) {
      console.error("Error creating pet:", error)
      return false
    }
  }

  const updatePet = async (id: number, petData: { name: string; type: string; color: string }): Promise<boolean> => {
    try {
      const updatedPet = await petService.updatePet(id, petData)
      setPets((prev) => prev.map((pet) => (pet.id === id ? updatedPet : pet)))
      return true
    } catch (error) {
      console.error("Error updating pet:", error)
      return false
    }
  }

  const deletePet = async (id: number): Promise<boolean> => {
    try {
      await petService.deletePet(id)
      setPets((prev) => prev.filter((pet) => pet.id !== id))
      return true
    } catch (error) {
      console.error("Error deleting pet:", error)
      return false
    }
  }

  const feedPet = async (id: number): Promise<boolean> => {
    try {
      const updatedPet = await petService.feedPet(id)
      setPets((prev) => prev.map((pet) => (pet.id === id ? updatedPet : pet)))
      return true
    } catch (error) {
      console.error("Error feeding pet:", error)
      return false
    }
  }

  const playWithPet = async (id: number): Promise<boolean> => {
    try {
      const updatedPet = await petService.playWithPet(id)
      setPets((prev) => prev.map((pet) => (pet.id === id ? updatedPet : pet)))
      return true
    } catch (error) {
      console.error("Error playing with pet:", error)
      return false
    }
  }

  const restPet = async (id: number): Promise<boolean> => {
    try {
      const updatedPet = await petService.restPet(id)
      setPets((prev) => prev.map((pet) => (pet.id === id ? updatedPet : pet)))
      return true
    } catch (error) {
      console.error("Error resting pet:", error)
      return false
    }
  }

  return (
    <PetContext.Provider
      value={{
        pets,
        loading,
        fetchPets,
        createPet,
        updatePet,
        deletePet,
        feedPet,
        playWithPet,
        restPet,
      }}
    >
      {children}
    </PetContext.Provider>
  )
}

export function usePets() {
  const context = useContext(PetContext)
  if (context === undefined) {
    throw new Error("usePets must be used within a PetProvider")
  }
  return context
}
