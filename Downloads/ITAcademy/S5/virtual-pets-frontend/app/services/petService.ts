const API_BASE_URL = "http://localhost:8080/api"

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

interface CreatePetData {
  name: string
  type: string
  color: string
}

class PetService {
  private getAuthHeaders() {
    const token = localStorage.getItem("token")
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  }

  async getUserPets(): Promise<Pet[]> {
    const response = await fetch(`${API_BASE_URL}/pets`, {
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error("Failed to fetch pets")
    }

    return response.json()
  }

  async createPet(petData: CreatePetData): Promise<Pet> {
    const response = await fetch(`${API_BASE_URL}/pets`, {
      method: "POST",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(petData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to create pet")
    }

    return response.json()
  }

  async updatePet(id: number, petData: CreatePetData): Promise<Pet> {
    const response = await fetch(`${API_BASE_URL}/pets/${id}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(petData),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to update pet")
    }

    return response.json()
  }

  async deletePet(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/pets/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to delete pet")
    }
  }

  async feedPet(id: number): Promise<Pet> {
    const response = await fetch(`${API_BASE_URL}/pets/${id}/feed`, {
      method: "POST",
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to feed pet")
    }

    return response.json()
  }

  async playWithPet(id: number): Promise<Pet> {
    const response = await fetch(`${API_BASE_URL}/pets/${id}/play`, {
      method: "POST",
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to play with pet")
    }

    return response.json()
  }

  async restPet(id: number): Promise<Pet> {
    const response = await fetch(`${API_BASE_URL}/pets/${id}/rest`, {
      method: "POST",
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to rest pet")
    }

    return response.json()
  }
}

export const petService = new PetService()
