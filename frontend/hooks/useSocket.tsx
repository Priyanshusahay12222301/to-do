"use client"

import { useState, useEffect } from "react"
import type { Activity } from "@/types"

const MOCK_ACTIVITIES: Activity[] = [
  {
    id: "1",
    type: "task_created",
    description: 'Created task "Design new landing page"',
    user: "Alice",
    timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
  },
  {
    id: "2",
    type: "task_updated",
    description: 'Updated task "Implement user authentication"',
    user: "Bob",
    timestamp: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
  },
  {
    id: "3",
    type: "task_moved",
    description: 'Moved task "Set up CI/CD pipeline" to Done',
    user: "Diana",
    timestamp: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
  },
  {
    id: "4",
    type: "task_assigned",
    description: 'Assigned task "Write API documentation" to Charlie',
    user: "Alice",
    timestamp: new Date(Date.now() - 1200000).toISOString(), // 20 minutes ago
  },
]

export function useSocket() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    // Simulate WebSocket connection
    const connectSocket = () => {
      setConnected(true)
      setActivities(MOCK_ACTIVITIES)

      // Simulate receiving real-time updates
      const interval = setInterval(() => {
        const randomActivity: Activity = {
          id: Date.now().toString(),
          type: ["task_created", "task_updated", "task_moved", "task_assigned"][Math.floor(Math.random() * 4)] as any,
          description: `Random activity ${Math.floor(Math.random() * 1000)}`,
          user: ["Alice", "Bob", "Charlie", "Diana"][Math.floor(Math.random() * 4)],
          timestamp: new Date().toISOString(),
        }

        setActivities((prev) => [randomActivity, ...prev.slice(0, 19)]) // Keep only last 20
      }, 30000) // New activity every 30 seconds

      return () => clearInterval(interval)
    }

    const cleanup = connectSocket()

    return () => {
      setConnected(false)
      cleanup?.()
    }
  }, [])

  return {
    activities,
    connected,
  }
}
