import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { WhatsAppButton } from './WhatsAppButton'

export function CustomerLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-ivory text-foreground selection:bg-saffron selection:text-white">
      <Navbar />
      <main className="flex-1 pt-20">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}

