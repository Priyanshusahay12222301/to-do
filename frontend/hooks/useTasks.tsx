"use client"

import { useState, useEffect } from "react"
import type { Task } from "@/types"

const INITIAL_TASKS: Task[] = [
  {
    id: "1",
    title: "Design new landing page",
    description: "Create wireframes and mockups for the new product landing page",
    status: "todo",
    priority: "high",
    assignedTo: "Alice",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Implement user authentication",
    description: "Set up JWT-based authentication system",
    status: "in-progress",
    priority: "high",
    assignedTo: "Bob",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Write API documentation",
    description: "Document all REST endpoints and WebSocket events",
    status: "todo",
    priority: "medium",
    assignedTo: "Charlie",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    title: "Set up CI/CD pipeline",
    description: "Configure automated testing and deployment",
    status: "done",
    priority: "medium",
    assignedTo: "Diana",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to fetch tasks
    const fetchTasks = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setTasks(INITIAL_TASKS)
      setLoading(false)
    }

    fetchTasks()
  }, [])

  const addTask = async (taskData: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setTasks((prev) => [...prev, newTask])

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    // Simulate potential conflict (5% chance)
    if (Math.random() < 0.05) {
      throw {
        type: "conflict",
        data: {
          taskId,
          currentVersion: tasks.find((t) => t.id === taskId),
          conflictingVersion: {
            ...tasks.find((t) => t.id === taskId),
            title: "Modified by another user",
            description: "This task was updated by someone else",
          },
          conflictingUser: "Another User",
        },
      }
    }

    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, ...updates, updatedAt: new Date().toISOString() } : task)),
    )

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  const deleteTask = async (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
  }

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
  }
}
