import { URLItemType } from "../types"

export const formatDateTime = (date: Date): string => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })
}

export const formatOtherDetails = (url: URLItemType): string => {
  return [
    ...Object.entries(url?.stats?.browserStats ?? {}),
    ...Object.entries(url?.stats?.cpuStats ?? {})
  ]
  .map(([k, v]) => `${k.toLowerCase()}: ${v}`)
  .join("; ")
}