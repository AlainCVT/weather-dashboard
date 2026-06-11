import Title from '@/components/Title'
import type { Location } from '@/schemas/location'
import { MARSEILLE_COORDS, PARIS_COORDS } from '@/tests/fixtures/coords'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import { Suspense, type PropsWithChildren } from 'react'
import { describe, expect, it } from 'vitest'

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

describe('Title Component', () => {
  it('renders "Select a location" when no location is provided', async () => {
    render(<Title />, { wrapper: Wrapper })

    // The Suspense should resolve since there's no query to suspend
    await waitFor(() => {
      expect(screen.getByText('Select a location')).toBeDefined()
    })
  })

  it('renders location name correctly with country', async () => {
    const location: Location = {
      name: 'Paris',
      ...PARIS_COORDS,
      country: 'FR',
      state: 'Ile-de-France',
    }

    render(<Title location={location} />, { wrapper: Wrapper })

    // The country name is pre-cached, so it should render immediately
    await waitFor(() => {
      expect(screen.getByText(/Paris, Ile-de-France, France/)).toBeDefined()
    })
  })

  it('renders without state when state is not provided', async () => {
    const location: Location = {
      name: 'Marseille',
      ...MARSEILLE_COORDS,
      country: 'FR',
    }

    render(<Title location={location} />, { wrapper: Wrapper })

    // The country name is pre-cached
    await waitFor(() => {
      expect(screen.getByText(/Marseille, France/)).toBeDefined()
    })
  })

  it('applies custom className', async () => {
    render(<Title className="custom-class" />, { wrapper: Wrapper })

    await waitFor(() => {
      const heading = screen.getByRole('heading')
      expect(heading.className).toContain('custom-class')
    })
  })
})
