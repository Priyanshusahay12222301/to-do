"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for stored token on mount
    const token = localStorage.getItem("auth_token")
    const userData = localStorage.getItem("user_data")

    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        localStorage.removeItem("auth_token")
        localStorage.removeItem("user_data")
      }
    }

    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock authentication - accept demo credentials or any email ending with @example.com
    if (
      (email === "demo@example.com" && password === "password") ||
      (email.endsWith("@example.com") && password.length >= 6)
    ) {
      const userData = {
        id: "1",
        name: email === "demo@example.com" ? "Demo User" : email.split("@")[0],
        email: email,
      }

      const token = "mock_jwt_token_" + Date.now()

      localStorage.setItem("auth_token", token)
      localStorage.setItem("user_data", JSON.stringify(userData))
      setUser(userData)
    } else {
      throw new Error("Invalid credentials. Use demo@example.com / password or register a new account.")
    }
  }

  const register = async (name: string, email: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Accept any valid email for registration
    const userData = {
      id: Date.now().toString(),
      name,
      email,
    }

    const token = "mock_jwt_token_" + Date.now()

    localStorage.setItem("auth_token", token)
    localStorage.setItem("user_data", JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user_data")
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
