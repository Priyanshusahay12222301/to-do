"use client"

import type React from "react"

import { useState } from "react"
import type { Task, TaskStatus } from "@/types"
import Column from "./Column"
import styles from "./KanbanBoard.module.css"

interface KanbanBoardProps {
  tasks: Task[]
  onTaskClick: (task: Task) => void
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void
  onTaskAdd: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void
  onTaskDelete: (taskId: string) => void
}

const COLUMNS: { id: TaskStatus; title: string; color: string }[] = [
  { id: "todo", title: "To Do", color: "#e2e8f0" },
  { id: "in-progress", title: "In Progress", color: "#fed7aa" },
  { id: "done", title: "Done", color: "#bbf7d0" },
]

export default function KanbanBoard({ tasks, onTaskClick, onTaskUpdate, onTaskAdd, onTaskDelete }: KanbanBoardProps) {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)

  const handleDragStart = (task: Task) => {
    setDraggedTask(task)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (status: TaskStatus) => {
    if (draggedTask && draggedTask.status !== status) {
      onTaskUpdate(draggedTask.id, { status })
    }
    setDraggedTask(null)
  }

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status)
  }

  return (
    <div className={styles.board}>
      <div className={styles.boardHeader}>
        <h2 className={styles.boardTitle}>Project Board</h2>
        <div className={styles.boardStats}>
          <span className={styles.stat}>{tasks.length} Total Tasks</span>
          <span className={styles.stat}>{tasks.filter((t) => t.status === "done").length} Completed</span>
        </div>
      </div>

      <div className={styles.columns}>
        {COLUMNS.map((column) => (
          <Column
            key={column.id}
            title={column.title}
            status={column.id}
            color={column.color}
            tasks={getTasksByStatus(column.id)}
            onTaskClick={onTaskClick}
            onTaskUpdate={onTaskUpdate}
            onTaskAdd={onTaskAdd}
            onTaskDelete={onTaskDelete}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            isDraggedOver={draggedTask?.status !== column.id}
          />
        ))}
      </div>
    </div>
  )
}
