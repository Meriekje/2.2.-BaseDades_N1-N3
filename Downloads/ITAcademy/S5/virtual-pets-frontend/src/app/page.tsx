"use client"
import { useState } from "react"
import LoginPage from "./components/LoginPage"
import Dashboard from "./components/Dashboard"

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState<{ username: string } | null>(null)

  const handleLogin = (username: string) => {
    setUser({ username })
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setUser(null)
    setIsLoggedIn(false)
  }

  return (
    <div>{isLoggedIn ? <Dashboard user={user} onLogout={handleLogout} /> : <LoginPage onLogin={handleLogin} />}</div>
  )
}
