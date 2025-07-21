import { API_CONFIG, API_ENDPOINTS } from "../config/api"

interface LoginResponse {
  token: string
  user: {
    id: number
    username: string
    role: string
  }
}

interface RegisterResponse {
  token: string
  user: {
    id: number
    username: string
    role: string
  }
}

class AuthService {
  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${API_CONFIG.BASE_URL}${endpoint}`

    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Request failed" }))
      throw new Error(error.message || `HTTP ${response.status}`)
    }

    return response.json()
  }

  async login(username: string, password: string): Promise<LoginResponse> {
    return this.makeRequest(API_ENDPOINTS.AUTH.LOGIN, {
      method: "POST",
      body: JSON.stringify({ username, password }),
    })
  }

  async register(username: string, password: string): Promise<RegisterResponse> {
    return this.makeRequest(API_ENDPOINTS.AUTH.REGISTER, {
      method: "POST",
      body: JSON.stringify({ username, password }),
    })
  }

  async getCurrentUser() {
    const token = localStorage.getItem("token")
    if (!token) {
      throw new Error("No token found")
    }

    // Decode JWT token client-side (for demo purposes)
    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      return {
        id: payload.userId,
        username: payload.sub,
        role: payload.role || "ROLE_USER",
      }
    } catch (error) {
      throw new Error("Invalid token")
    }
  }
}

export const authService = new AuthService()
