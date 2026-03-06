export class TokenBucket {
    readonly bucketSize: number
    readonly fillRate: number

    private tokens: number
    private lastRefillTimestamp: number

    constructor(bucketSize: number, fillRate: number, initialTokens: number) {
        if (bucketSize <= 0) throw new Error("bucketSize must be > 0")
        if (fillRate <= 0) throw new Error("fillRate must be > 0")
        if (initialTokens < 0) throw new Error("initialTokens cannot be negative")

        this.bucketSize = bucketSize
        this.fillRate = fillRate
        this.tokens = Math.min(initialTokens, bucketSize)
        this.lastRefillTimestamp = Date.now()
    }

    private lazyRefillTokens() {
        const now = Date.now()
        const elapsedTime = now - this.lastRefillTimestamp

        const tokensToAdd = Math.floor((elapsedTime / 1000) * this.fillRate)

        if (tokensToAdd > 0) {
            this.tokens = Math.min(this.bucketSize, this.tokens + tokensToAdd)
            this.lastRefillTimestamp = now
        }
    }

    allowRequest(): boolean {
        this.lazyRefillTokens()

        if (this.tokens >= 1) {
            this.tokens -= 1
            return true
        }

        return false
    }
}