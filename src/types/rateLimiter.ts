export interface RateLimiter {
    allowRequest(): boolean
}