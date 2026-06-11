import { PARIS_COORDS } from '@/tests/fixtures/coords'
import { HttpResponse, http } from 'msw'

const OPENWEATHER_API_URL = import.meta.env.VITE_OPENWEATHER_API_URL
const RESTCOUNTRIES_API_URL = import.meta.env.VITE_RESTCOUNTRIES_API_URL

export const handlers = [
  // Mock reverse geocoding for Paris coordinates
  http.get(`${OPENWEATHER_API_URL}/geo/1.0/reverse`, ({ request }) => {
    const url = new URL(request.url)
    const lat = url.searchParams.get('lat')
    const lon = url.searchParams.get('lon')

    // Paris coordinates
    if (
      lat === PARIS_COORDS.lat.toString() &&
      lon === PARIS_COORDS.lon.toString()
    ) {
      return HttpResponse.json([
        {
          name: 'Paris',
          ...PARIS_COORDS,
          country: 'FR',
          state: 'Ile-de-France',
        },
      ])
    }

    return HttpResponse.json([])
  }),

  // Mock country name lookup - match any request to this endpoint
  http.get(`${RESTCOUNTRIES_API_URL}/v3.1/alpha/:code`, ({ params }) => {
    const { code } = params

    if (code === 'FR') {
      return HttpResponse.json({
        name: {
          common: 'France',
          official: 'French Republic',
        },
      })
    }

    // Default response for other countries
    return HttpResponse.json({
      name: {
        common: 'Unknown Country',
        official: 'Unknown Country',
      },
    })
  }),

  // Mock direct geocoding (city search)
  http.get(`${OPENWEATHER_API_URL}/geo/1.0/direct`, ({ request }) => {
    const url = new URL(request.url)
    const q = url.searchParams.get('q')

    if (q === 'Paris') {
      return HttpResponse.json([
        {
          name: 'Paris',
          ...PARIS_COORDS,
          country: 'FR',
          state: 'Ile-de-France',
        },
      ])
    }

    return HttpResponse.json([])
  }),
]
