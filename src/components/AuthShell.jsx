import { Link } from 'react-router-dom'

// Centered card layout shared by all auth pages (login, register, reset, etc.).
export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="card p-6 sm:p-8">
          <div className="mb-6 text-center">
            <Link to="/" className="mb-4 inline-grid h-11 w-11 place-items-center rounded-xl bg-brand-600 text-lg font-bold text-white">
              U
            </Link>
            <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
          </div>
          {children}
        </div>
        {footer && <div className="mt-4 text-center text-sm text-slate-500">{footer}</div>}
      </div>
    </div>
  )
}
