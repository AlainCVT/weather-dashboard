import { afterAll, afterEach, beforeAll } from 'vitest'
import { server } from './mocks/server'

// Enable API mocking before all tests
beforeAll(() => server.listen())

// Reset any request handlers that we may have added during the tests
afterEach(() => server.resetHandlers())

// Disable API mocking after the tests are done
afterAll(() => server.close())
