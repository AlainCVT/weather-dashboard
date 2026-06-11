import { getLocation } from '@/api'
import Title from '@/components/Title'
import { useCoordinatesURL } from '@/hooks/useCoordinatesURL'
import type { Location } from '@/schemas/location'
import { PARIS_COORDS } from '@/tests/fixtures/coords'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import { Suspense, useEffect, useState, type PropsWithChildren } from 'react'
import { beforeEach, describe, expect, it } from 'vitest'

// Create a new QueryClient for each test with pre-cached data
const createTestQueryClient = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  // Pre-populate cache with France country name
  queryClient.setQueryData(['country', 'FR'], {
    name: {
      common: 'France',
      official: 'French Republic',
    },
  })

  return queryClient
}

const Wrapper = ({ children }: PropsWithChildren) => {
  const testQueryClient = createTestQueryClient()

  return (
    <QueryClientProvider client={testQueryClient}>
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
    </QueryClientProvider>
  )
}

// Test component that combines coordinates from URL with Title display
function TestComponent() {
  const [coords] = useCoordinatesURL()
  const [location, setLocation] = useState<Location | null>(null)

  useEffect(() => {
    if (coords) {
      getLocation(coords).then((result) => {
        setLocation(result?.[0] || null)
      })
    }
  }, [coords])

  return <Title location={location} />
}

describe('Integration: URL Coordinates to Title Display', () => {
  beforeEach(() => {
    // Set URL with coordinates for Paris
    window.history.replaceState(
      null,
      '',
      `/?lat=${PARIS_COORDS.lat}&lon=${PARIS_COORDS.lon}`,
    )
  })

  it('displays "Paris, Ile-de-France, France" when accessing URL with Paris coordinates', async () => {
    render(<TestComponent />, { wrapper: Wrapper })

    // Wait for the location to be fetched and the title to be rendered
    await waitFor(
      () => {
        expect(screen.getByText(/Paris.*Ile-de-France.*France/)).toBeDefined()
      },
      { timeout: 3000 },
    )
  })

  it('displays "Select a location" when no URL parameters provided', async () => {
    window.history.replaceState(null, '', '/')

    render(<TestComponent />, { wrapper: Wrapper })

    await waitFor(() => {
      expect(screen.getByText('Select a location')).toBeDefined()
    })
  })
})
