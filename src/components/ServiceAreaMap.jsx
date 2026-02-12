import { useEffect, useRef } from 'react'
import { serviceAreaCoords } from '../data/serviceArea'

function loadGoogleMaps() {
  return new Promise((resolve, reject) => {
    if (window.google?.maps) {
      resolve(window.google.maps)
      return
    }

    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_KEY}&v=weekly&libraries=maps`
    script.async = true
    script.onload = () => resolve(window.google.maps)
    script.onerror = () => reject(new Error('Google Maps failed to load'))
    document.head.appendChild(script)
  })
}

export default function ServiceAreaMap() {
  const mapRef = useRef(null)

  useEffect(() => {
    let cancelled = false

    async function init() {
      const maps = await loadGoogleMaps()
      if (cancelled || !mapRef.current) return

      const { Map, Polygon } = await maps.importLibrary('maps')

      const bounds = new maps.LatLngBounds()
      serviceAreaCoords.forEach(coord => bounds.extend(coord))

      const map = new Map(mapRef.current, {
        zoom: 8,
        center: bounds.getCenter(),
        mapId: 'd2aa162fc56190bcf5343083',
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      })

      new Polygon({
        paths: serviceAreaCoords,
        strokeColor: '#0F9D58',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#0F9D58',
        fillOpacity: 0.15,
        map,
      })

      map.fitBounds(bounds, { top: 10, right: 10, bottom: 10, left: 10 })
    }

    init()
    return () => { cancelled = true }
  }, [])

  return (
    <section
      id="service-area"
      className="px-4 pt-32 pb-11 bg-base-100 transition-colors duration-300 scroll-mt-0 dark:bg-base-800 sm:px-6 sm:pt-32 sm:pb-12 md:px-8 md:pt-28 md:pb-13 lg:px-10 lg:pt-32 lg:pb-14"
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="mb-1 text-2xl font-bold text-left text-base-content dark:text-dark-base-content md:text-3xl md:mb-2 lg:text-4xl lg:mb-3">
          Service Area
        </h2>
        <p className="mb-3 text-md text-left text-base-content dark:text-dark-base-content md:mb-4 lg:mb-5">
          We proudly serve communities throughout the Rio Grande valley
        </p>
        <div
          ref={mapRef}
          className="w-full h-[64vh] overflow-hidden bg-base-750 border border-base-300 rounded-md shadow-xl dark:bg-dark-base-600 dark:border-base-600"
        />
        <p className="my-3 text-sm text-left text-base-content dark:text-dark-base-content md:text-md">
          If your location is not within our service area, please contact us.
        </p>
      </div>
    </section>
  )
}
