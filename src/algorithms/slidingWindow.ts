import { RateLimiter } from "../types/rateLimiter"

export type SlidingWindowConfig = {
    algorithm: "sliding-window"
    windowSize: number
    maxRequests: number
}

export class SlidingWindowLog implements RateLimiter {
    readonly windowSize: number
    readonly maxRequests: number
    private window: number[]

    constructor(config: SlidingWindowConfig) {
        if (config.windowSize < 100) throw new Error("Window size must be greater than 100ms")
        if (config.maxRequests <= 0) throw new Error("Count must be a positive number")

        this.windowSize = config.windowSize
        this.maxRequests = config.maxRequests
        this.window = []
    }

    private lazySlideWindow(now: number) {
        const windowStart = now - this.windowSize

        while (this.window.length > 0 && this.window[0] <= windowStart) {
            this.window.shift()
        }
    }

    allowRequest(): boolean {
        const now = Date.now()

        this.lazySlideWindow(now)

        if (this.window.length < this.maxRequests) {
            this.window.push(now)
            return true
        }

        return false
    }
}