"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { useTasks } from "@/hooks/useTasks"
import { useSocket } from "@/hooks/useSocket"
import KanbanBoard from "@/components/KanbanBoard"
import ActivityLog from "@/components/ActivityLog"
import TaskModal from "@/components/TaskModal"
import ConflictModal from "@/components/ConflictModal"
import type { Task } from "@/types"
import styles from "./dashboard.module.css"

export default function Dashboard() {
  const { user, logout } = useAuth()
  const { tasks, loading, addTask, updateTask, deleteTask } = useTasks()
  const { activities } = useSocket()
  const router = useRouter()
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [conflictData, setConflictData] = useState<any>(null)
  const [showActivityLog, setShowActivityLog] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
  }

  const handleTaskUpdate = async (taskId: string, updates: Partial<Task>) => {
    try {
      await updateTask(taskId, updates)
      setSelectedTask(null)
    } catch (error: any) {
      if (error.type === "conflict") {
        setConflictData(error.data)
      }
    }
  }

  const handleConflictResolve = async (resolution: "merge" | "overwrite", data: any) => {
    try {
      await updateTask(conflictData.taskId, data)
      setConflictData(null)
    } catch (error) {
      console.error("Failed to resolve conflict:", error)
    }
  }

  if (!user) return null

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading your workspace...</p>
      </div>
    )
  }

  return (
    <div className={styles.dashboard}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Collaborative Board</h1>
          <div className={styles.userInfo}>
            <span className={styles.welcome}>Welcome, {user.name}</span>
            <button onClick={() => setShowActivityLog(!showActivityLog)} className={styles.activityButton}>
              Activity Log
            </button>
            <button onClick={handleLogout} className={styles.logoutButton}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.boardContainer}>
          <KanbanBoard
            tasks={tasks}
            onTaskClick={handleTaskClick}
            onTaskUpdate={handleTaskUpdate}
            onTaskAdd={addTask}
            onTaskDelete={deleteTask}
          />
        </div>

        {showActivityLog && (
          <div className={styles.activityPanel}>
            <ActivityLog activities={activities} />
          </div>
        )}
      </main>

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={handleTaskUpdate}
          onDelete={deleteTask}
        />
      )}

      {conflictData && (
        <ConflictModal
          conflictData={conflictData}
          onResolve={handleConflictResolve}
          onClose={() => setConflictData(null)}
        />
      )}
    </div>
  )
}
