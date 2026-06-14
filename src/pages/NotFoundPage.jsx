import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <p className="text-6xl font-black text-brand-600">404</p>
      <h1 className="mt-4 text-xl font-bold text-slate-800">Page not found</h1>
      <p className="mt-2 text-sm text-slate-500">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link to="/" className="btn-primary mt-6">Go home</Link>
    </div>
  )
}
