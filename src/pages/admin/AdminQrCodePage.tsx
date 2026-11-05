import { useState, useEffect, useRef } from 'react'
import QRCode from 'qrcode'
import {
  Download,
  Printer,
  QrCode,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
} from 'lucide-react'
import { useSettingsStore } from '@/stores/settingsStore'

export function AdminQrCodePage() {
  const settings = useSettingsStore((state) => state.settings)
  const [catalogueUrl, setCatalogueUrl] = useState('')
  const [dataUrl, setDataUrl] = useState('')
  const [copied, setCopied] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Generate URL based on window location or settings website URL
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://santoshpushpa.in'
    const fullUrl = `${origin}/catalogue`
    setCatalogueUrl(fullUrl)

    QRCode.toDataURL(
      fullUrl,
      {
        width: 360,
        margin: 2,
        color: {
          dark: '#493629', // Dark brown
          light: '#FFFFFF',
        },
      },
      (err, url) => {
        if (!err && url) {
          setDataUrl(url)
        }
      }
    )
  }, [])

  const handleDownloadPNG = () => {
    if (!dataUrl) return
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = `Santosh_Pushpa_Catalogue_QR.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(catalogueUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream pb-4">
        <div>
          <span className="badge-tag bg-saffron/15 text-saffron border border-saffron/30">
            Store Marketing & In-Shop Standee
          </span>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-brown">
            Catalogue QR Code Generator
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Print this high-resolution QR standee to place at your counter in Dadar market for instant customer browsing
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadPNG}
            className="btn-saffron text-xs py-2 px-4 flex items-center gap-1.5 shadow-md"
          >
            <Download className="w-4 h-4" />
            <span>Download PNG</span>
          </button>
          <button
            onClick={handlePrint}
            className="btn-outline-saffron text-xs py-2 px-4 flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>Print Standee</span>
          </button>
        </div>
      </div>

      {/* Main Display Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Standee Preview Frame (Print-Ready) */}
        <div className="lg:col-span-7 flex justify-center">
          <div
            id="print-standee"
            className="w-full max-w-md bg-white rounded-3xl p-8 border-4 border-saffron shadow-2xl text-center space-y-6 relative overflow-hidden"
          >
            {/* Decorative Top Accent */}
            <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-saffron via-rose to-saffron" />

            {/* Shop Brand Header */}
            <div className="space-y-1.5 pt-2">
              <span className="text-3xl">🌸</span>
              <h2 className="font-display font-bold text-2xl text-brown tracking-tight">
                {settings.store_name}
              </h2>
              <p className="font-marathi text-sm text-rose font-semibold">
                {settings.store_name_marathi || 'संतोष पुष्प भंडार - दादर'}
              </p>
              <p className="text-[11px] text-muted-foreground">
                Shop No. 4, Dadar Flower Mandi, Mumbai
              </p>
            </div>

            {/* QR Image Box */}
            <div className="p-4 bg-ivory/60 rounded-3xl border-2 border-dashed border-saffron/40 inline-block shadow-inner">
              {dataUrl ? (
                <img
                  src={dataUrl}
                  alt="Catalogue QR Code"
                  className="w-56 h-56 mx-auto rounded-xl"
                />
              ) : (
                <div className="w-56 h-56 flex items-center justify-center text-xs text-muted-foreground">
                  Generating QR...
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="space-y-2">
              <span className="badge-tag bg-green-100 text-green-800 text-xs py-1 px-3">
                Scan with any Phone Camera or UPI App
              </span>
              <p className="font-display font-semibold text-base text-brown">
                View Full Digital Catalogue & WhatsApp Booking
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Browse our fresh varmalas, pooja malas & place orders directly on WhatsApp!
              </p>
            </div>

            {/* Bottom Footer Details */}
            <div className="border-t border-cream pt-3 text-[11px] text-muted-foreground space-y-0.5">
              <p>📞 Phone / WhatsApp: <strong>{settings.whatsapp_number}</strong></p>
              <p>📍 Dadar Station (West), Mumbai</p>
            </div>
          </div>
        </div>

        {/* Right: Controls & URL sharing */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white rounded-3xl p-6 border border-cream shadow-sm space-y-4">
            <h3 className="font-display font-bold text-lg text-brown">
              Catalogue Target Link
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs text-muted-foreground font-semibold">
                Target Web Address:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={catalogueUrl}
                  className="w-full py-2 px-3 rounded-xl border border-cream bg-ivory/40 text-xs font-mono text-brown"
                />
                <button
                  onClick={handleCopyLink}
                  className="p-2 rounded-xl bg-saffron text-white hover:bg-saffron-600 transition-colors"
                  title="Copy link"
                >
                  {copied ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <a
                href={catalogueUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-saffron text-xs py-2.5 flex items-center justify-center gap-2"
              >
                <span>Open Public Catalogue</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Standee Tips */}
          <div className="bg-white rounded-3xl p-6 border border-cream shadow-sm space-y-3 text-xs sm:text-sm text-brown/80 font-body">
            <h4 className="font-display font-semibold text-base text-brown flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-saffron" />
              Shop Standee Printing Tips
            </h4>
            <ul className="list-disc list-inside space-y-1.5 text-xs text-muted-foreground leading-relaxed">
              <li>Print on A4 or A5 laminated cardboard or acrylic standee.</li>
              <li>Place near your cash counter or flower display rack.</li>
              <li>Customers waiting in rush hours can scan and build their order immediately.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

