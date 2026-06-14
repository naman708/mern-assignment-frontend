import { useEffect, useState } from 'react'

// Debounced search input. Calls onSearch(value) ~400ms after the user stops typing.
export default function SearchBar({ onSearch, placeholder = 'Search by name or email...', initialValue = '' }) {
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    const id = setTimeout(() => onSearch(value.trim()), 400)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return (
    <div className="relative">
      <svg
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m1.35-5.4a6.75 6.75 0 11-13.5 0 6.75 6.75 0 0113.5 0z" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="input pl-9"
      />
    </div>
  )
}
