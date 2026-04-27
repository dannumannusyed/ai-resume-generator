export class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'

  log(message: string, data?: any) {
    if (this.isDevelopment) {
      console.log(`[LOG] ${message}`, data || '')
    }
  }

  info(message: string, data?: any) {
    console.info(`[INFO] ${message}`, data || '')
  }

  warn(message: string, data?: any) {
    console.warn(`[WARN] ${message}`, data || '')
  }

  error(message: string, error?: any) {
    console.error(`[ERROR] ${message}`, error || '')
  }

  debug(message: string, data?: any) {
    if (this.isDevelopment) {
      console.debug(`[DEBUG] ${message}`, data || '')
    }
  }

  group(label: string) {
    if (this.isDevelopment) {
      console.group(`[GROUP] ${label}`)
    }
  }

  groupEnd() {
    if (this.isDevelopment) {
      console.groupEnd()
    }
  }

  time(label: string) {
    if (this.isDevelopment) {
      console.time(`[TIME] ${label}`)
    }
  }

  timeEnd(label: string) {
    if (this.isDevelopment) {
      console.timeEnd(`[TIME] ${label}`)
    }
  }

  table(data: any) {
    if (this.isDevelopment) {
      console.table(data)
    }
  }
}

export const logger = new Logger()
