import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-5">
        <div className="text-6xl">🌸</div>
        <h1 className="font-display font-bold text-6xl text-brown">404</h1>
        <h2 className="font-display font-semibold text-2xl text-brown">Page Not Found</h2>
        <p className="text-sm text-muted-foreground">
          The garland page or link you are seeking is unavailable or has been relocated.
        </p>
        <div className="pt-2">
          <Link to="/" className="btn-saffron inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

