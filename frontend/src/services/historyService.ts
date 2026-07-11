import { apiClient } from './apiClient'
import type { ReviewHistoryItem } from '../types/history'

export async function fetchReviewHistory() {
  const response = await apiClient.get<ReviewHistoryItem[]>('/api/history')
  return response.data
}
