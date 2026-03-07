export class SlidingWindowLog {
    readonly windowSize: number
    readonly count: number
    private window: number[]

    constructor(windowSize: number, count: number) {
        if (windowSize < 100) throw new Error("Window size must be greater than 100ms")
        if (count <= 0) throw new Error("Count must be a positive number")

        this.windowSize = windowSize
        this.count = count
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

        if (this.window.length < this.count) {
            this.window.push(now)
            return true
        }

        return false
    }
}