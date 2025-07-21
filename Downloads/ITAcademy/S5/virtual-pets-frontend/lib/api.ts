const API_BASE_URL = "http://localhost:8080/api"

interface LoginResponse {
  token: string
  user: {
    id: number
    username: string
    role: string
  }
}

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

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem("token")
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  }

  // Auth endpoints
  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Login failed")
    }

    return response.json()
  }

  async register(username: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Registration failed")
    }

    return response.json()
  }

  // Pet endpoints
  async getPets(): Promise<Pet[]> {
    const response = await fetch(`${API_BASE_URL}/pets`, {
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) throw new Error("Failed to fetch pets")
    return response.json()
  }

  async getAllPets(): Promise<Pet[]> {
    const response = await fetch(`${API_BASE_URL}/admin/pets`, {
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) throw new Error("Failed to fetch all pets")
    return response.json()
  }

  async getAllUsers(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) throw new Error("Failed to fetch all users")
    return response.json()
  }

  async getPetsForCurrentUser(userRole?: string): Promise<Pet[]> {
    if (userRole === "ROLE_ADMIN") {
      return this.getAllPets() // Admin sees all pets
    } else {
      return this.getPets() // user sees only their own pets
    }
  }

  async createPet(petData: { name: string; type: string; color: string }): Promise<Pet> {
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

  async feedPet(id: number): Promise<Pet> {
    const response = await fetch(`${API_BASE_URL}/pets/${id}/feed`, {
      method: "POST",
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) throw new Error("Failed to feed pet")
    return response.json()
  }

  async playWithPet(id: number): Promise<Pet> {
    const response = await fetch(`${API_BASE_URL}/pets/${id}/play`, {
      method: "POST",
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) throw new Error("Failed to play with pet")
    return response.json()
  }

  async restPet(id: number): Promise<Pet> {
    const response = await fetch(`${API_BASE_URL}/pets/${id}/rest`, {
      method: "POST",
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) throw new Error("Failed to rest pet")
    return response.json()
  }

  async deletePet(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/pets/${id}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) throw new Error("Failed to delete pet")
  }
}

export const api = new ApiService()
export type { Pet, LoginResponse }
