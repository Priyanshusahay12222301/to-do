"use client"

import type React from "react"

import type { Task } from "@/types"
import styles from "./TaskCard.module.css"

interface TaskCardProps {
  task: Task
  onClick: () => void
  onUpdate: (taskId: string, updates: Partial<Task>) => void
  onDelete: (taskId: string) => void
  onDragStart: () => void
}

const PRIORITY_COLORS = {
  low: "#68d391",
  medium: "#fbd38d",
  high: "#fc8181",
}

const PRIORITY_LABELS = {
  low: "Low",
  medium: "Medium",
  high: "High",
}

export default function TaskCard({ task, onClick, onUpdate, onDelete, onDragStart }: TaskCardProps) {
  const handleSmartAssign = async (e: React.MouseEvent) => {
    e.stopPropagation()
    // Simulate smart assign API call
    const users = ["Alice", "Bob", "Charlie", "Diana"]
    const randomUser = users[Math.floor(Math.random() * users.length)]
    onUpdate(task.id, { assignedTo: randomUser })
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm("Are you sure you want to delete this task?")) {
      onDelete(task.id)
    }
  }

  return (
    <div className={styles.card} onClick={onClick} draggable onDragStart={onDragStart}>
      <div className={styles.cardHeader}>
        <h4 className={styles.title}>{task.title}</h4>
        <div className={styles.priority} style={{ backgroundColor: PRIORITY_COLORS[task.priority] }}>
          {PRIORITY_LABELS[task.priority]}
        </div>
      </div>

      {task.description && <p className={styles.description}>{task.description}</p>}

      <div className={styles.cardFooter}>
        <div className={styles.assignee}>
          <div className={styles.avatar}>{task.assignedTo.charAt(0).toUpperCase()}</div>
          <span className={styles.assigneeName}>{task.assignedTo}</span>
        </div>

        <div className={styles.actions}>
          <button onClick={handleSmartAssign} className={styles.smartAssignButton} title="Smart Assign">
            🎯
          </button>
          <button onClick={handleDelete} className={styles.deleteButton} title="Delete Task">
            🗑️
          </button>
        </div>
      </div>
    </div>
  )
}
