export {}

declare global {
  interface Window {
    Sentry?: {
      captureException: (error: unknown, context?: { extra?: unknown }) => void
    }
  }
}
