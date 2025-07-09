"use client"

import type React from "react"

import { useState } from "react"
import type { Task, TaskStatus } from "@/types"
import TaskCard from "./TaskCard"
import styles from "./Column.module.css"

interface ColumnProps {
  title: string
  status: TaskStatus
  color: string
  tasks: Task[]
  onTaskClick: (task: Task) => void
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void
  onTaskAdd: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void
  onTaskDelete: (taskId: string) => void
  onDragStart: (task: Task) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (status: TaskStatus) => void
  isDraggedOver: boolean
}

export default function Column({
  title,
  status,
  color,
  tasks,
  onTaskClick,
  onTaskUpdate,
  onTaskAdd,
  onTaskDelete,
  onDragStart,
  onDragOver,
  onDrop,
  isDraggedOver,
}: ColumnProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium" as "low" | "medium" | "high",
    assignedTo: "current-user",
  })

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTask.title.trim()) {
      onTaskAdd({
        ...newTask,
        status,
      })
      setNewTask({
        title: "",
        description: "",
        priority: "medium",
        assignedTo: "current-user",
      })
      setShowAddForm(false)
    }
  }

  return (
    <div
      className={`${styles.column} ${isDraggedOver ? styles.dragOver : ""}`}
      onDragOver={onDragOver}
      onDrop={() => onDrop(status)}
    >
      <div className={styles.columnHeader} style={{ backgroundColor: color }}>
        <h3 className={styles.columnTitle}>{title}</h3>
        <span className={styles.taskCount}>{tasks.length}</span>
      </div>

      <div className={styles.taskList}>
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onClick={() => onTaskClick(task)}
            onUpdate={onTaskUpdate}
            onDelete={onTaskDelete}
            onDragStart={() => onDragStart(task)}
          />
        ))}

        {showAddForm ? (
          <form onSubmit={handleAddTask} className={styles.addForm}>
            <input
              type="text"
              placeholder="Task title..."
              value={newTask.title}
              onChange={(e) => setNewTask((prev) => ({ ...prev, title: e.target.value }))}
              className={styles.addInput}
              autoFocus
            />
            <textarea
              placeholder="Description (optional)..."
              value={newTask.description}
              onChange={(e) => setNewTask((prev) => ({ ...prev, description: e.target.value }))}
              className={styles.addTextarea}
              rows={2}
            />
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask((prev) => ({ ...prev, priority: e.target.value as any }))}
              className={styles.addSelect}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>
            <div className={styles.addActions}>
              <button type="submit" className={styles.addButton}>
                Add Task
              </button>
              <button type="button" onClick={() => setShowAddForm(false)} className={styles.cancelButton}>
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button onClick={() => setShowAddForm(true)} className={styles.addTaskButton}>
            + Add Task
          </button>
        )}
      </div>
    </div>
  )
}
