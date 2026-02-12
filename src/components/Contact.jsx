import { useState, useEffect, useRef } from 'react'
import { IMaskInput } from 'react-imask'
import emailjs from '@emailjs/browser'
import { huskyLocation } from '../data/serviceArea'

// ── Contact Form ──

function ContactForm() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState({ text: '', type: '' })
  const [sending, setSending] = useState(false)

  function formatName(value) {
    return value.toLowerCase().replace(/\b[a-z]/g, l => l.toUpperCase())
  }

  function counterClass(length, max, min = 0) {
    if (length === max || length < min) return 'text-sm text-error dark:text-dark-error ml-2 font-semibold'
    if (length > max * 0.8) return 'text-sm text-warning dark:text-dark-warning ml-2 font-semibold'
    if (min && length >= min) return 'text-sm text-success dark:text-dark-success ml-2 font-semibold'
    if (!min) return 'text-sm text-success dark:text-dark-success ml-2 font-semibold'
    return 'text-sm text-base-400 dark:text-base-400 ml-2'
  }

  function handleSubmit(e) {
    e.preventDefault()
    setStatus({ text: '', type: '' })

    const nameParts = name.trim().split(/\s+/).filter(p => p.length > 0)
    if (nameParts.length < 2) {
      setStatus({ text: 'Please enter both first and last name.', type: 'error' })
      return
    }
    if (subject.trim().length < 4) {
      setStatus({ text: 'Subject must be at least 4 characters.', type: 'error' })
      return
    }
    if (message.trim().length < 16) {
      setStatus({ text: 'Message must be at least 20 characters.', type: 'error' })
      return
    }

    setSending(true)

    emailjs.send('service_8uwodx9', 'template_8ir0hso', {
      from_name: name.trim(),
      phone,
      from_email: email,
      subject: subject.trim(),
      message: message.trim(),
    }).then(() => {
      setStatus({ text: 'Thank you! Your message has been sent successfully.', type: 'success' })
      setName('')
      setPhone('')
      setEmail('')
      setSubject('')
      setMessage('')
    }).catch(() => {
      setStatus({ text: 'Failed to send message. Please try again or call us directly.', type: 'error' })
    }).finally(() => {
      setSending(false)
    })
  }

  const statusClass = status.type === 'success'
    ? 'text-center text-sm text-success dark:text-dark-success mt-2'
    : 'text-center text-sm text-error dark:text-dark-error mt-2'

  const inputClass = 'p-2 border bg-base-100 border-base-300 rounded-md focus:outline-none focus:border-none focus:ring-2 placeholder:text-base-250 caret-secondary focus:ring-secondary dark:caret-dark-secondary dark:border-base-500 dark:bg-base-700 dark:text-dark-base-content dark:focus:ring-dark-secondary'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col">
      <div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Name */}
          <div className="flex flex-col">
            <label htmlFor="name" className="mb-2 font-medium text-base-750 dark:text-base-250">Name</label>
            <input
              type="text"
              id="name"
              placeholder="Full Name"
              required
              value={name}
              onChange={e => setName(formatName(e.target.value))}
              className={inputClass}
            />
          </div>

          {/* Phone */}
          <div className="flex flex-col">
            <label htmlFor="phone" className="mb-2 font-medium text-base-750 dark:text-base-250">Phone</label>
            <IMaskInput
              mask="(000) 000-0000"
              id="phone"
              placeholder="(505) 555-5555"
              required
              value={phone}
              onAccept={val => setPhone(val)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col mt-2">
          <label htmlFor="email" className="mb-2 font-medium text-base-750 dark:text-base-250">Email</label>
          <input
            type="email"
            id="email"
            maxLength={64}
            minLength={8}
            placeholder="youremail@example.com"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Subject */}
        <div className="flex flex-col mt-2">
          <label htmlFor="subject" className="mb-2 font-medium text-base-750 dark:text-base-250">
            Subject
            <span className={subject.length > 0 ? counterClass(subject.length, 128, 4) : 'ml-2 text-sm text-base-400 dark:text-base-400'}>
              ({subject.length}/128)
            </span>
          </label>
          <input
            type="text"
            id="subject"
            maxLength={128}
            minLength={4}
            placeholder="Enter the subject..."
            required
            value={subject}
            onChange={e => setSubject(e.target.value)}
            className={inputClass}
          />
        </div>

        {/* Message */}
        <div className="flex flex-col mt-2">
          <label htmlFor="message" className="mb-2 font-medium text-base-750 dark:text-base-250">
            Message
            <span className={message.length > 0 ? counterClass(message.length, 1024, 16) : 'ml-2 text-sm text-base-400 dark:text-base-400'}>
              ({message.length}/1024)
            </span>
          </label>
          <textarea
            id="message"
            rows={11}
            minLength={16}
            maxLength={1024}
            placeholder="Enter your message..."
            required
            value={message}
            onChange={e => setMessage(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={sending}
        className="w-full mt-6 px-6 pt-2 pb-2.5 text-lg font-semibold text-secondary/60 border border-secondary/50 rounded-md transition hover:cursor-pointer hover:bg-secondary/10 focus:bg-secondary/25 dark:border-primary/90 dark:text-primary/90 dark:hover:bg-dark-primary/20 dark:focus:bg-dark-primary/40"
      >
        {sending ? 'Sending...' : 'Send Message'}
      </button>

      {status.text && <p className={statusClass}>{status.text}</p>}
    </form>
  )
}

// ── Headquarters Map + Place Details ──

function HeadquartersInfo() {
  const mapRef = useRef(null)
  const [placeDetails, setPlaceDetails] = useState(null)
  const [hoursOpen, setHoursOpen] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function init() {
      // Wait for Google Maps to be available
      if (!window.google?.maps) {
        await new Promise(resolve => {
          const check = setInterval(() => {
            if (window.google?.maps) { clearInterval(check); resolve() }
          }, 200)
        })
      }

      if (cancelled || !mapRef.current) return

      const { Map } = await google.maps.importLibrary('maps')
      const { AdvancedMarkerElement } = await google.maps.importLibrary('marker')

      const map = new Map(mapRef.current, {
        zoom: 15,
        center: huskyLocation,
        mapId: 'd2aa162fc56190bcf5343083',
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      })

      new AdvancedMarkerElement({
        map,
        position: huskyLocation,
        title: 'Husky Well & Pump Service',
      })

      // Fetch place details via legacy PlacesService
      const service = new google.maps.places.PlacesService(map)
      service.textSearch(
        { location: huskyLocation, radius: 50, query: 'Husky Well & Pump Service' },
        (results, searchStatus) => {
          if (cancelled) return
          if (searchStatus === google.maps.places.PlacesServiceStatus.OK && results?.length > 0) {
            service.getDetails({ placeId: results[0].place_id }, (details, detailStatus) => {
              if (cancelled) return
              if (detailStatus === google.maps.places.PlacesServiceStatus.OK && details) {
                setPlaceDetails(details)
              }
            })
          }
        }
      )
    }

    init()
    return () => { cancelled = true }
  }, [])

  return (
    <div className="flex flex-col gap-4 sm:gap-6 md:gap-8 lg:gap-10">
      <div
        ref={mapRef}
        className="w-full h-72 overflow-hidden border border-base-300 rounded-md shadow-lg dark:border-base-600 lg:h-80"
      />
      <div className="flex-grow p-5 bg-secondary/16 border border-secondary/50 dark:bg-base-800/50 dark:border-base-700 rounded-md shadow-lg sm:p-6 md:p-8 lg:p-10">
        {!placeDetails ? (
          <div className="animate-pulse">
            <div className="w-3/4 h-4 mb-2 rounded" />
            <div className="w-1/2 h-3 rounded" />
          </div>
        ) : (
          <>
            <h3 className="text-lg font-bold text-base-content dark:text-dark-base-content">
              {placeDetails.name}
            </h3>
            <p className="text-base-750 dark:text-base-100 text-sm mt-1">
              {placeDetails.formatted_address}
            </p>

            {placeDetails.rating && (
              <div className="flex items-center gap-1 mt-2">
                <span className="text-warning">★</span>
                <span className="text-base-850 dark:text-base-100 font-medium">
                  {placeDetails.rating.toFixed(1)}
                </span>
                <span className="text-base-850 dark:text-base-100 text-sm">
                  ({placeDetails.user_ratings_total} reviews)
                </span>
              </div>
            )}

            {placeDetails.opening_hours?.isOpen && (
              <div className="mt-2">
                {(() => {
                  try {
                    return placeDetails.opening_hours.isOpen()
                      ? <span className="text-success dark:text-dark-success font-medium">Open now</span>
                      : <span className="text-error dark:text-dark-error font-medium">Closed now</span>
                  } catch { return null }
                })()}
              </div>
            )}

            {placeDetails.opening_hours?.weekday_text && (
              <div className="mt-3">
                <button
                  onClick={() => setHoursOpen(prev => !prev)}
                  className="text-secondary dark:text-dark-secondary text-sm font-medium hover:underline hover:cursor-pointer flex items-center gap-1"
                >
                  <span>View hours</span>
                  <svg className={`w-4 h-4 transition-transform ${hoursOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {hoursOpen && (
                  <div className="mt-2 text-sm text-base-750 dark:text-base-100 space-y-1">
                    {placeDetails.opening_hours.weekday_text.map(day => (
                      <p key={day}>{day}</p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {placeDetails.url && (
              <a
                href={placeDetails.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 text-secondary dark:text-dark-secondary text-sm font-medium hover:underline"
              >
                View on Google Maps →
              </a>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// ── Contact Section ──

export default function Contact() {
  return (
    <section
      id="contact"
      className="px-4 pt-32 pb-11 bg-base-50 transition-colors duration-300 scroll-mt-0 dark:bg-base-750 sm:px-6 sm:pt-32 sm:pb-12 md:px-8 md:pt-28 md:pb-13 lg:px-10 lg:pt-32 lg:pb-14"
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="mb-1 text-2xl font-bold text-left text-base-content dark:text-dark-base-content sm:mb-5 md:text-3xl md:mb-4 lg:text-4xl lg:mb-6">
          Contact Us
        </h2>
        <h3 className="mb-3 text-left text-base-750 dark:text-base-250 sm:mb-5 md:mb-6 lg:mb-7">
          Please enter your information below, and we will get back to you as soon as possible.
        </h3>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-stretch">
          <ContactForm />
          <HeadquartersInfo />
        </div>
      </div>
    </section>
  )
}
