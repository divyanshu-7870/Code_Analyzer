import { apiClient } from './apiClient'
import type { ApplyFixRequest, ApplyFixResponse, ReviewRequest, ReviewResponse } from '../types/review'

export async function reviewCode(payload: ReviewRequest) {
  const response = await apiClient.post<ReviewResponse>('/api/review', payload)
  return response.data
}

export async function applyFix(payload: ApplyFixRequest) {
  const response = await apiClient.post<ApplyFixResponse>('/api/apply', payload)
  return response.data
}
