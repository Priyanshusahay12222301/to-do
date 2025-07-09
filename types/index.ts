export type TaskStatus = "todo" | "in-progress" | "done"

export type TaskPriority = "low" | "medium" | "high"

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  assignedTo: string
  createdAt: string
  updatedAt: string
}

export interface Activity {
  id: string
  type: "task_created" | "task_updated" | "task_deleted" | "task_moved" | "task_assigned"
  description: string
  user: string
  timestamp: string
}

export interface User {
  id: string
  name: string
  email: string
}
