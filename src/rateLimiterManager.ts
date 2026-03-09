import { SlidingWindowLog, SlidingWindowConfig } from "./algorithms/slidingWindow"
import { TokenBucket, TokenBucketConfig } from "./algorithms/tokenBucket"
import { RateLimiter } from "./types/rateLimiter"

type RateLimiterConfig = TokenBucketConfig | SlidingWindowConfig

export class RateLimiterManager {

    private readonly config: RateLimiterConfig
    private readonly limiters: Map<string, RateLimiter>

    constructor(config: RateLimiterConfig) {
        this.config = config
        this.limiters = new Map()
    }

    private createLimiter(): RateLimiter {

        switch (this.config.algorithm) {

            case "token-bucket":
                return new TokenBucket(this.config)

            case "sliding-window":
                return new SlidingWindowLog(this.config)

            default:
                throw new Error("Unsupported rate limiter algorithm")
        }
    }

    allowRequest(key: string): boolean {

        let limiter = this.limiters.get(key)

        if (!limiter) {
            limiter = this.createLimiter()
            this.limiters.set(key, limiter)
        }

        return limiter.allowRequest()
    }

}