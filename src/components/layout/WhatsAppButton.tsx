import { MessageCircle } from 'lucide-react'
import { useSettingsStore } from '@/stores/settingsStore'
import { buildWhatsAppLink } from '@/lib/utils'

export function WhatsAppButton() {
  const settings = useSettingsStore((state) => state.settings)
  const defaultText = `Hello ${settings.store_name}, I want to enquire about fresh flower garlands for an upcoming occasion.`
  const link = buildWhatsAppLink(settings.whatsapp_number, defaultText)

  return (
    <aside aria-label="WhatsApp quick chat" className="fixed bottom-6 right-6 z-50 flex items-center group">
      <span className="mr-3 px-3.5 py-1.5 rounded-full bg-brown/90 text-white text-xs font-medium shadow-lg backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none hidden sm:inline-block">
        Order on WhatsApp
      </span>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-premium hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-green-400/40 relative"
      >
        <MessageCircle className="w-7 h-7 fill-current" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-saffron border-2 border-white animate-ping" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-saffron border-2 border-white" />
      </a>
    </aside>
  )
}

