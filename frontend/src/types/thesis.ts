// frontend/src/types/thesis.ts
export interface ThesisTopic {
  id: number
  title: string
  category: string
  datasetName: string
  datasetUrl: string
  datasetSize: string
  isLocked: boolean
  isLockedByMe: boolean
  lockedAt?: string
  lockedByUserId?: number
}

export interface ThesisProject {
  id: number
  userId: number
  topicId: number
  projectId?: number
  repoUrl?: string
  deployUrl?: string
  createdAt: string
  updatedAt: string
  topic: ThesisTopic
}
