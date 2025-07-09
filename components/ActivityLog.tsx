"use client"

import type { Activity } from "@/types"
import styles from "./ActivityLog.module.css"

interface ActivityLogProps {
  activities: Activity[]
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case "task_created":
      return "➕"
    case "task_updated":
      return "✏️"
    case "task_deleted":
      return "🗑️"
    case "task_moved":
      return "↔️"
    case "task_assigned":
      return "👤"
    default:
      return "📝"
  }
}

const getActivityColor = (type: string) => {
  switch (type) {
    case "task_created":
      return "#48bb78"
    case "task_updated":
      return "#667eea"
    case "task_deleted":
      return "#e53e3e"
    case "task_moved":
      return "#ed8936"
    case "task_assigned":
      return "#38b2ac"
    default:
      return "#718096"
  }
}

const formatTimeAgo = (timestamp: string) => {
  const now = new Date()
  const time = new Date(timestamp)
  const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return "just now"
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes}m ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours}h ago`
  } else {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days}d ago`
  }
}

export default function ActivityLog({ activities }: ActivityLogProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Activity Log</h3>
        <span className={styles.count}>{activities.length} recent</span>
      </div>

      <div className={styles.activities}>
        {activities.length === 0 ? (
          <div className={styles.empty}>
            <p>No recent activity</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className={styles.activity}>
              <div className={styles.icon} style={{ backgroundColor: getActivityColor(activity.type) }}>
                {getActivityIcon(activity.type)}
              </div>
              <div className={styles.content}>
                <p className={styles.description}>{activity.description}</p>
                <div className={styles.meta}>
                  <span className={styles.user}>{activity.user}</span>
                  <span className={styles.time}>{formatTimeAgo(activity.timestamp)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
