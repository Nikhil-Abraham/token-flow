import { RateLimiter } from "../types/rateLimiter"

export type TokenBucketConfig = {
    algorithm: "token-bucket"
    bucketSize: number
    fillRate: number
    initialTokens: number
}

export class TokenBucket implements RateLimiter {
    readonly bucketSize: number
    readonly fillRate: number

    private tokens: number
    private lastRefillTimestamp: number

    constructor(config: TokenBucketConfig) {
        if (config.bucketSize <= 0) throw new Error("bucketSize must be > 0")
        if (config.fillRate <= 0) throw new Error("fillRate must be > 0")
        if (config.initialTokens < 0) throw new Error("initialTokens cannot be negative")

        this.bucketSize = config.bucketSize
        this.fillRate = config.fillRate
        this.tokens = Math.min(config.initialTokens, config.bucketSize)
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