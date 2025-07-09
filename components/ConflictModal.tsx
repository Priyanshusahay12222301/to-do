"use client"

import type React from "react"

import { useState } from "react"
import styles from "./ConflictModal.module.css"

interface ConflictModalProps {
  conflictData: {
    taskId: string
    currentVersion: any
    conflictingVersion: any
    conflictingUser: string
  }
  onResolve: (resolution: "merge" | "overwrite", data: any) => void
  onClose: () => void
}

export default function ConflictModal({ conflictData, onResolve, onClose }: ConflictModalProps) {
  const [selectedResolution, setSelectedResolution] = useState<"current" | "conflicting" | "merge">("merge")
  const [mergedData, setMergedData] = useState({
    title: conflictData.currentVersion.title,
    description: conflictData.currentVersion.description,
    priority: conflictData.currentVersion.priority,
    assignedTo: conflictData.currentVersion.assignedTo,
  })

  const handleResolve = () => {
    if (selectedResolution === "current") {
      onResolve("overwrite", conflictData.currentVersion)
    } else if (selectedResolution === "conflicting") {
      onResolve("overwrite", conflictData.conflictingVersion)
    } else {
      onResolve("merge", mergedData)
    }
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className={styles.overlay} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Conflict Resolution</h2>
          <p className={styles.subtitle}>
            This task was modified by {conflictData.conflictingUser} while you were editing it.
          </p>
        </div>

        <div className={styles.content}>
          <div className={styles.resolutionOptions}>
            <label className={styles.option}>
              <input
                type="radio"
                name="resolution"
                value="current"
                checked={selectedResolution === "current"}
                onChange={(e) => setSelectedResolution(e.target.value as any)}
              />
              <div className={styles.optionContent}>
                <h4>Keep Your Version</h4>
                <div className={styles.versionPreview}>
                  <p>
                    <strong>Title:</strong> {conflictData.currentVersion.title}
                  </p>
                  <p>
                    <strong>Description:</strong> {conflictData.currentVersion.description}
                  </p>
                  <p>
                    <strong>Priority:</strong> {conflictData.currentVersion.priority}
                  </p>
                </div>
              </div>
            </label>

            <label className={styles.option}>
              <input
                type="radio"
                name="resolution"
                value="conflicting"
                checked={selectedResolution === "conflicting"}
                onChange={(e) => setSelectedResolution(e.target.value as any)}
              />
              <div className={styles.optionContent}>
                <h4>Use {conflictData.conflictingUser}'s Version</h4>
                <div className={styles.versionPreview}>
                  <p>
                    <strong>Title:</strong> {conflictData.conflictingVersion.title}
                  </p>
                  <p>
                    <strong>Description:</strong> {conflictData.conflictingVersion.description}
                  </p>
                  <p>
                    <strong>Priority:</strong> {conflictData.conflictingVersion.priority}
                  </p>
                </div>
              </div>
            </label>

            <label className={styles.option}>
              <input
                type="radio"
                name="resolution"
                value="merge"
                checked={selectedResolution === "merge"}
                onChange={(e) => setSelectedResolution(e.target.value as any)}
              />
              <div className={styles.optionContent}>
                <h4>Merge Changes</h4>
                {selectedResolution === "merge" && (
                  <div className={styles.mergeForm}>
                    <div className={styles.formGroup}>
                      <label>Title:</label>
                      <input
                        type="text"
                        value={mergedData.title}
                        onChange={(e) => setMergedData((prev) => ({ ...prev, title: e.target.value }))}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Description:</label>
                      <textarea
                        value={mergedData.description}
                        onChange={(e) => setMergedData((prev) => ({ ...prev, description: e.target.value }))}
                        className={styles.textarea}
                        rows={3}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Priority:</label>
                      <select
                        value={mergedData.priority}
                        onChange={(e) => setMergedData((prev) => ({ ...prev, priority: e.target.value as any }))}
                        className={styles.select}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </label>
          </div>
        </div>

        <div className={styles.actions}>
          <button onClick={onClose} className={styles.cancelButton}>
            Cancel
          </button>
          <button onClick={handleResolve} className={styles.resolveButton}>
            Resolve Conflict
          </button>
        </div>
      </div>
    </div>
  )
}
