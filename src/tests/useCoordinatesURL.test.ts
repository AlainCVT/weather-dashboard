import { useCoordinatesURL } from '@/hooks/useCoordinatesURL'
import { PARIS_COORDS } from '@/tests/fixtures/coords'
import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('useCoordinatesURL', () => {
  beforeEach(() => {
    // Clear URL before each test
    window.history.replaceState(null, '', '/')
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('returns null when no coordinates in URL', () => {
    const { result } = renderHook(() => useCoordinatesURL())
    const [coords] = result.current

    expect(coords).toBeNull()
  })

  it('parses coordinates from URL on mount', () => {
    // Set URL with coordinates for Paris
    window.history.replaceState(
      null,
      '',
      `/?lat=${PARIS_COORDS.lat}&lon=${PARIS_COORDS.lon}`,
    )

    const { result } = renderHook(() => useCoordinatesURL())
    const [coords] = result.current

    expect(coords).toEqual(PARIS_COORDS)
  })

  it('updates coordinates when setCoords is called', () => {
    const { result, rerender } = renderHook(() => useCoordinatesURL())

    act(() => {
      const [, setCoords] = result.current
      setCoords(PARIS_COORDS)
    })

    rerender()

    const [coords] = result.current
    expect(coords).toEqual(PARIS_COORDS)
  })

  it('updates URL when updateURL is called with coordinates', () => {
    const { result } = renderHook(() => useCoordinatesURL())

    act(() => {
      const [, , updateURL] = result.current
      updateURL(PARIS_COORDS)
    })

    // Check if URL was updated
    const params = new URLSearchParams(window.location.search)
    expect(params.get('lat')).toBe(PARIS_COORDS.lat.toString())
    expect(params.get('lon')).toBe(PARIS_COORDS.lon.toString())
  })

  it('clears coordinates when setCoords(null) is called', () => {
    // Set initial coordinates
    window.history.replaceState(
      null,
      '',
      `/?lat=${PARIS_COORDS.lat}&lon=${PARIS_COORDS.lon}`,
    )

    const { result, rerender } = renderHook(() => useCoordinatesURL())

    act(() => {
      const [, setCoords] = result.current
      setCoords(null)
    })

    rerender()

    const [coords] = result.current
    expect(coords).toBeNull()
  })

  it('removes coordinates from URL when updateURL(null) is called', () => {
    window.history.replaceState(
      null,
      '',
      `/?lat=${PARIS_COORDS.lat}&lon=${PARIS_COORDS.lon}`,
    )

    const { result } = renderHook(() => useCoordinatesURL())

    act(() => {
      const [, , updateURL] = result.current
      updateURL(null)
    })

    // Check if URL was cleared
    const params = new URLSearchParams(window.location.search)
    expect(params.has('lat')).toBe(false)
    expect(params.has('lon')).toBe(false)
  })

  it('preserves other URL parameters when updating coordinates', () => {
    window.history.replaceState(null, '', '/?theme=dark&lang=fr')

    const { result } = renderHook(() => useCoordinatesURL())

    act(() => {
      const [, , updateURL] = result.current
      updateURL(PARIS_COORDS)
    })

    const params = new URLSearchParams(window.location.search)
    expect(params.get('theme')).toBe('dark')
    expect(params.get('lang')).toBe('fr')
    expect(params.get('lat')).toBe(PARIS_COORDS.lat.toString())
    expect(params.get('lon')).toBe(PARIS_COORDS.lon.toString())
  })

  it('returns updateURL function for manual updates', () => {
    const { result } = renderHook(() => useCoordinatesURL())
    const [, , updateURL] = result.current

    expect(typeof updateURL).toBe('function')

    act(() => {
      updateURL(PARIS_COORDS)
    })

    const params = new URLSearchParams(window.location.search)
    expect(params.get('lat')).toBe(PARIS_COORDS.lat.toString())
    expect(params.get('lon')).toBe(PARIS_COORDS.lon.toString())
  })

  it('ignores invalid coordinates in URL', () => {
    window.history.replaceState(null, '', '/?lat=invalid&lon=2.3')

    const { result } = renderHook(() => useCoordinatesURL())
    const [coords] = result.current

    expect(coords).toBeNull()
  })
})
