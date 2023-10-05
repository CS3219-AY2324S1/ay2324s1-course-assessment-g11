import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['./systemtest/**/*.test.ts'],
    exclude: ['./test/**/*'],
    threads: false
  }
})