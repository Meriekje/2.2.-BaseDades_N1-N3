import { API_CONFIG, API_ENDPOINTS } from "../config/api"

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

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`

    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Request failed" }))
      throw new Error(error.message || `HTTP ${response.status}`)
    }

    return response.json()
  }

  async getUserPets(): Promise<Pet[]> {
    return this.makeRequest(API_ENDPOINTS.PETS.LIST)
  }

  async createPet(petData: CreatePetData): Promise<Pet> {
    return this.makeRequest(API_ENDPOINTS.PETS.CREATE, {
      method: "POST",
      body: JSON.stringify(petData),
    })
  }

  async updatePet(id: number, petData: CreatePetData): Promise<Pet> {
    return this.makeRequest(API_ENDPOINTS.PETS.UPDATE(id), {
      method: "PUT",
      body: JSON.stringify(petData),
    })
  }

  async deletePet(id: number): Promise<void> {
    await this.makeRequest(API_ENDPOINTS.PETS.DELETE(id), {
      method: "DELETE",
    })
  }

  async feedPet(id: number): Promise<Pet> {
    return this.makeRequest(API_ENDPOINTS.PETS.FEED(id), {
      method: "POST",
    })
  }

  async playWithPet(id: number): Promise<Pet> {
    return this.makeRequest(API_ENDPOINTS.PETS.PLAY(id), {
      method: "POST",
    })
  }

  async restPet(id: number): Promise<Pet> {
    return this.makeRequest(API_ENDPOINTS.PETS.REST(id), {
      method: "POST",
    })
  }
}

export const petService = new PetService()
