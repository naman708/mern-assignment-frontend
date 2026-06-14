import { useEffect, useRef, useState } from 'react'

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp']
const MAX_BYTES = 2 * 1024 * 1024 // 2MB

// Controlled file picker with a live preview. Calls onChange(file | null).
// `initialPreview` shows an existing image (e.g. current profile photo) until a
// new file is chosen. Reports client-side validation errors via onError(msg).
export default function ImageUpload({ onChange, onError, initialPreview = null, label = 'Profile image' }) {
  const [preview, setPreview] = useState(initialPreview)
  const objectUrlRef = useRef(null)
  const inputRef = useRef(null)

  // Revoke any created object URL on unmount / when it changes to avoid leaks.
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    }
  }, [])

  const setObjectUrl = (file) => {
    if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
    const url = URL.createObjectURL(file)
    objectUrlRef.current = url
    setPreview(url)
  }

  const reset = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current)
      objectUrlRef.current = null
    }
    setPreview(initialPreview)
    if (inputRef.current) inputRef.current.value = ''
    onChange?.(null)
  }

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    onError?.('')
    if (!file) {
      reset()
      return
    }
    if (!ACCEPTED.includes(file.type)) {
      onError?.('Image must be JPEG, PNG, or WebP.')
      reset()
      return
    }
    if (file.size > MAX_BYTES) {
      onError?.('Image must be 2MB or smaller.')
      reset()
      return
    }
    setObjectUrl(file)
    onChange?.(file)
  }

  return (
    <div>
      <span className="label">{label}</span>
      <div className="flex items-center gap-4">
        <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200">
          {preview ? (
            <img src={preview} alt="preview" className="h-full w-full object-cover" />
          ) : (
            <span className="text-xs text-slate-400">No image</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFile}
            className="block text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-100"
          />
          {preview && preview !== initialPreview && (
            <button type="button" onClick={reset} className="self-start text-xs text-slate-500 hover:text-red-600">
              Remove selected image
            </button>
          )}
          <p className="text-xs text-slate-400">JPEG, PNG, or WebP. Max 2MB.</p>
        </div>
      </div>
    </div>
  )
}
