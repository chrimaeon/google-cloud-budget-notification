declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SLACK_WEBHOOK: string
    }
  }
}

export {}
