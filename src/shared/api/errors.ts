import { isAxiosError } from 'axios'

type ApiErrorBody = {
  message?: string | string[]
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (isAxiosError(error)) {
    const message = (error.response?.data as ApiErrorBody | undefined)?.message
    if (Array.isArray(message) && message.length > 0) return message.join('\n')
    if (typeof message === 'string' && message.trim()) return message
  }
  return fallback
}
