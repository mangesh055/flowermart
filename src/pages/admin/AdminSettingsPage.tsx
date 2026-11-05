import { useState } from 'react'
import {
  Save,
  CheckCircle2,
  Store,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Truck,
  Globe,
  Instagram,
} from 'lucide-react'
import { useSettingsStore } from '@/stores/settingsStore'

export function AdminSettingsPage() {
  const { settings, updateSettings } = useSettingsStore()

  const [storeName, setStoreName] = useState(settings.store_name)
  const [storeNameMarathi, setStoreNameMarathi] = useState(settings.store_name_marathi || '')
  const [whatsappNumber, setWhatsappNumber] = useState(settings.whatsapp_number)
  const [contactNumber, setContactNumber] = useState(settings.contact_number)
  const [alternateNumber, setAlternateNumber] = useState(settings.alternate_number || '')
  const [address, setAddress] = useState(settings.address)
  const [addressMarathi, setAddressMarathi] = useState(settings.address_marathi || '')
  const [city, setCity] = useState(settings.city || 'Mumbai')
  const [pincode, setPincode] = useState(settings.pincode || '400028')
  const [googleMapsLink, setGoogleMapsLink] = useState(settings.google_maps_link || '')
  const [openingHours, setOpeningHours] = useState(settings.opening_hours || '')
  const [isDeliveryAvailable, setIsDeliveryAvailable] = useState(settings.is_delivery_available)
  const [defaultDeliveryCharge, setDefaultDeliveryCharge] = useState(settings.default_delivery_charge)
  const [websiteUrl, setWebsiteUrl] = useState(settings.website_url || '')
  const [instagramUrl, setInstagramUrl] = useState(settings.instagram_url || '')

  const [isSaved, setIsSaved] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateSettings({
      store_name: storeName.trim(),
      store_name_marathi: storeNameMarathi.trim() || undefined,
      whatsapp_number: whatsappNumber.trim(),
      contact_number: contactNumber.trim(),
      alternate_number: alternateNumber.trim() || undefined,
      address: address.trim(),
      address_marathi: addressMarathi.trim() || undefined,
      city: city.trim(),
      pincode: pincode.trim(),
      google_maps_link: googleMapsLink.trim() || undefined,
      opening_hours: openingHours.trim(),
      is_delivery_available: isDeliveryAvailable,
      default_delivery_charge: Number(defaultDeliveryCharge),
      website_url: websiteUrl.trim() || undefined,
      instagram_url: instagramUrl.trim() || undefined,
    })

    setIsSaved(true)
    setTimeout(() => setIsSaved(false), 2500)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream pb-4">
        <div>
          <span className="badge-tag bg-saffron/15 text-saffron border border-saffron/30">
            Configuration
          </span>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-brown">
            Store Profile & WhatsApp Settings
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Configure your shop name, contact numbers, Dadar market address, and delivery fees
          </p>
        </div>

        {isSaved && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-100 text-green-800 text-xs font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-green-700" />
            <span>Settings Saved Successfully!</span>
          </div>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Brand Details */}
        <div className="bg-white rounded-3xl p-6 border border-cream shadow-sm space-y-4">
          <h2 className="font-display font-semibold text-lg text-brown flex items-center gap-2 border-b border-cream pb-2">
            <Store className="w-4 h-4 text-saffron" />
            1. Shop Identity
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-brown">Store Name (English)</label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full py-2 px-3 rounded-xl border border-cream bg-ivory/30 text-xs sm:text-sm font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-brown">Store Name (Marathi / Devanagari)</label>
              <input
                type="text"
                value={storeNameMarathi}
                onChange={(e) => setStoreNameMarathi(e.target.value)}
                className="w-full py-2 px-3 rounded-xl border border-cream bg-ivory/30 text-xs sm:text-sm font-marathi"
              />
            </div>
          </div>
        </div>

        {/* WhatsApp & Contact Numbers */}
        <div className="bg-white rounded-3xl p-6 border border-cream shadow-sm space-y-4">
          <h2 className="font-display font-semibold text-lg text-brown flex items-center gap-2 border-b border-cream pb-2">
            <MessageCircle className="w-4 h-4 text-green-600" />
            2. WhatsApp & Phone Numbers
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-brown">
                WhatsApp Ordering Number (with country code)
              </label>
              <input
                type="text"
                required
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                placeholder="919876543210"
                className="w-full py-2 px-3 rounded-xl border border-cream bg-ivory/30 text-xs sm:text-sm font-mono font-bold text-green-800"
              />
              <p className="text-[10px] text-muted-foreground">
                All customer orders will be sent to this WhatsApp.
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-brown">Calling Number (Shop Desk)</label>
              <input
                type="text"
                required
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full py-2 px-3 rounded-xl border border-cream bg-ivory/30 text-xs sm:text-sm font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-brown">Alternate / Secondary Number</label>
              <input
                type="text"
                value={alternateNumber}
                onChange={(e) => setAlternateNumber(e.target.value)}
                placeholder="+91 91234 56789"
                className="w-full py-2 px-3 rounded-xl border border-cream bg-ivory/30 text-xs sm:text-sm font-medium"
              />
            </div>
          </div>
        </div>

        {/* Physical Address & Market Hours */}
        <div className="bg-white rounded-3xl p-6 border border-cream shadow-sm space-y-4">
          <h2 className="font-display font-semibold text-lg text-brown flex items-center gap-2 border-b border-cream pb-2">
            <MapPin className="w-4 h-4 text-rose" />
            3. Address & Operating Hours
          </h2>

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-brown">Shop Address (English)</label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full py-2 px-3 rounded-xl border border-cream bg-ivory/30 text-xs sm:text-sm font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-brown">Shop Address (Marathi)</label>
              <input
                type="text"
                value={addressMarathi}
                onChange={(e) => setAddressMarathi(e.target.value)}
                className="w-full py-2 px-3 rounded-xl border border-cream bg-ivory/30 text-xs sm:text-sm font-marathi"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-brown">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-cream bg-ivory/30 text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-brown">Pincode</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-cream bg-ivory/30 text-xs sm:text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-brown">Market Timings</label>
                <input
                  type="text"
                  value={openingHours}
                  onChange={(e) => setOpeningHours(e.target.value)}
                  placeholder="Mon - Sun: 5:00 AM - 10:00 PM"
                  className="w-full py-2 px-3 rounded-xl border border-cream bg-ivory/30 text-xs sm:text-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-brown">Google Maps Link</label>
              <input
                type="url"
                value={googleMapsLink}
                onChange={(e) => setGoogleMapsLink(e.target.value)}
                placeholder="https://maps.google.com/..."
                className="w-full py-2 px-3 rounded-xl border border-cream bg-ivory/30 text-xs sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Delivery Options */}
        <div className="bg-white rounded-3xl p-6 border border-cream shadow-sm space-y-4">
          <h2 className="font-display font-semibold text-lg text-brown flex items-center gap-2 border-b border-cream pb-2">
            <Truck className="w-4 h-4 text-saffron" />
            4. Delivery Logistics
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-brown">
                Default Home Delivery Fee (₹)
              </label>
              <input
                type="number"
                min={0}
                value={defaultDeliveryCharge}
                onChange={(e) => setDefaultDeliveryCharge(Number(e.target.value))}
                className="w-full py-2 px-3 rounded-xl border border-cream bg-ivory/30 text-xs sm:text-sm font-bold"
              />
            </div>

            <div className="pt-4">
              <label className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-brown cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDeliveryAvailable}
                  onChange={(e) => setIsDeliveryAvailable(e.target.checked)}
                  className="w-4 h-4 rounded text-saffron accent-saffron"
                />
                <span>Offer Home Delivery Option at Checkout</span>
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-2">
          <button
            type="submit"
            className="w-full sm:w-auto btn-saffron text-sm py-3.5 px-8 flex items-center justify-center gap-2 font-bold shadow-premium"
          >
            <Save className="w-4 h-4" />
            <span>Save Store Settings</span>
          </button>
        </div>
      </form>
    </div>
  )
}

