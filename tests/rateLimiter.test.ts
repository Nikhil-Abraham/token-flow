import { describe, it, expect } from "vitest"
import { RateLimiterManager } from "../src/rateLimiterManager"

describe("Token Bucket Rate Limiter", () => {

    it("should allow requests within bucket capacity", () => {

        const limiter = new RateLimiterManager({
            algorithm: "token-bucket",
            bucketSize: 5,
            fillRate: 1,
            initialTokens: 5
        })

        let allowed = 0

        for (let i = 0; i < 5; i++) {
            if (limiter.allowRequest("user1")) {
                allowed++
            }
        }

        expect(allowed).toBe(5)
    })

    it("should block requests after capacity exceeded", () => {

        const limiter = new RateLimiterManager({
            algorithm: "token-bucket",
            bucketSize: 3,
            fillRate: 1,
            initialTokens: 3
        })

        let allowed = 0
        let blocked = 0

        for (let i = 0; i < 10; i++) {
            if (limiter.allowRequest("user1")) {
                allowed++
            } else {
                blocked++
            }
        }

        expect(allowed).toBe(3)
        expect(blocked).toBeGreaterThan(0)
    })

})

describe("Sliding Window Rate Limiter", () => {

    it("should enforce request limit within window", () => {

        const limiter = new RateLimiterManager({
            algorithm: "sliding-window",
            windowSize: 1000,
            maxRequests: 3
        })

        let allowed = 0
        let blocked = 0

        for (let i = 0; i < 5; i++) {
            if (limiter.allowRequest("user1")) {
                allowed++
            } else {
                blocked++
            }
        }

        expect(allowed).toBe(3)
        expect(blocked).toBe(2)
    })

})

/*
------------------------------------------------
STRESS TEST
------------------------------------------------
*/

describe("RateLimiter Stress Test", () => {

    it("should handle high request volume", () => {

        const limiter = new RateLimiterManager({
            algorithm: "token-bucket",
            bucketSize: 100,
            fillRate: 50,
            initialTokens: 100
        })

        const USERS = 1000
        const REQUESTS_PER_USER = 1000

        let allowed = 0
        let blocked = 0

        const start = performance.now()

        for (let u = 0; u < USERS; u++) {

            const user = `user-${u}`

            for (let r = 0; r < REQUESTS_PER_USER; r++) {

                if (limiter.allowRequest(user)) {
                    allowed++
                } else {
                    blocked++
                }

            }
        }

        const end = performance.now()

        const totalRequests = USERS * REQUESTS_PER_USER

        console.log("----- Stress Test Results -----")
        console.log("Total Requests:", totalRequests)
        console.log("Allowed:", allowed)
        console.log("Blocked:", blocked)
        console.log("Execution Time:", (end - start).toFixed(2), "ms")

        expect(totalRequests).toBeGreaterThan(0)

    })

})