# token-flow

A lightweight TypeScript implementation of common rate limiting algorithms.

## Features
- Multiple rate limiting algorithms
- Simple request check API
- Configurable limits and window sizes
- Lightweight and dependency-free

## Implemented Algorithms

- **Token Bucket** — burst-friendly limiter with configurable refill rate
- **Sliding Window Log** — precise request tracking using timestamp windows

## Example

```ts
import { TokenBucket } from "token-flow"

const limiter = new TokenBucket(10, 2, 10)

if (limiter.allowRequest()) {
  // process request
} else {
  // reject request
}