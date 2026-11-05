import { useState } from 'react'
import {
  Upload,
  Camera,
  MessageCircle,
  Sparkles,
  CheckCircle2,
  Calendar,
  IndianRupee,
  AlertCircle,
  X,
} from 'lucide-react'
import { customRequestService } from '@/services/customRequestService'
import { useSettingsStore } from '@/stores/settingsStore'
import { cn, buildWhatsAppLink } from '@/lib/utils'

export function CustomRequestPage() {
  const settings = useSettingsStore((state) => state.settings)

  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [occasion, setOccasion] = useState('Wedding / Vivah')
  const [description, setDescription] = useState('')
  const [flowerPreferences, setFlowerPreferences] = useState('')
  const [preferredColours, setPreferredColours] = useState('')
  const [budgetMin, setBudgetMin] = useState<number | ''>(1000)
  const [budgetMax, setBudgetMax] = useState<number | ''>(3500)
  const [requiredDate, setRequiredDate] = useState('')
  const [additionalInstructions, setAdditionalInstructions] = useState('')

  // Image Upload state
  const [imagePreview, setImagePreview] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedRequest, setSubmittedRequest] = useState<any>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image must be under 5 MB')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const validate = () => {
    const errs: Record<string, string> = {}
    if (!customerName.trim()) errs.customerName = 'Please enter your name'
    const digits = customerPhone.replace(/\D/g, '')
    if (digits.length < 10) errs.customerPhone = 'Enter a valid 10-digit mobile number'
    if (!requiredDate) errs.requiredDate = 'Please select your event date'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate() || isSubmitting) return

    setIsSubmitting(true)
    try {
      const res = await customRequestService.createRequest(
        {
          customer_name: customerName,
          customer_phone: customerPhone,
          occasion,
          reference_image_url: imagePreview || undefined,
          description,
          flower_preferences: flowerPreferences,
          preferred_colours: preferredColours,
          budget_min: budgetMin ? Number(budgetMin) : undefined,
          budget_max: budgetMax ? Number(budgetMax) : undefined,
          required_date: requiredDate,
          additional_instructions: additionalInstructions,
        },
        settings.store_name
      )

      if (res.success && res.request) {
        setSubmittedRequest(res.request)

        // Open WhatsApp with pre-filled message
        if (res.whatsappMessage) {
          const waUrl = buildWhatsAppLink(settings.whatsapp_number, res.whatsappMessage)
          window.open(waUrl, '_blank', 'noopener,noreferrer')
        }
      } else {
        alert(res.error || 'Failed to submit request')
      }
    } catch (err: any) {
      alert(err?.message || 'Error submitting request')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="py-8 sm:py-12 bg-ivory min-h-screen">
      <div className="section-container max-w-3xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2 border-b border-cream pb-6">
          <span className="badge-tag bg-saffron/15 text-saffron border border-saffron/30">
            Bespoke Garland Design
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-brown">
            Custom Garland & Decoration Request
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground font-body max-w-xl mx-auto">
            Share your reference photo and desired blooms. Our master artisans will craft custom garlands tailored to your ceremony and budget.
          </p>
        </div>

        {submittedRequest ? (
          /* Confirmation View */
          <div className="bg-white rounded-3xl p-8 border border-cream shadow-md text-center space-y-5 animate-in fade-in duration-300">
            <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>
            <div className="space-y-1">
              <h2 className="font-display font-bold text-2xl text-brown">
                Custom Request Submitted!
              </h2>
              <p className="text-sm text-muted-foreground">
                Reference Request Number: <strong className="text-brown font-mono">{submittedRequest.request_number}</strong>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 text-left space-y-1">
              <p className="font-bold">Next Steps:</p>
              <p>
                A WhatsApp chat window has been prepared. Please send the message along with your reference photo directly to the shop owner for quick quotation and confirmation.
              </p>
            </div>

            <div className="pt-2 flex justify-center">
              <button
                onClick={() => {
                  setSubmittedRequest(null)
                  setImagePreview('')
                }}
                className="btn-saffron text-xs py-2.5 px-6"
              >
                Submit Another Request
              </button>
            </div>
          </div>
        ) : (
          /* Request Form */
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-cream shadow-sm space-y-6">
            {/* Customer Details */}
            <div className="space-y-4">
              <h3 className="font-display font-semibold text-lg text-brown border-b border-cream pb-2">
                1. Your Contact Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-brown">
                    Full Name <span className="text-rose">*</span>
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Anjali Sharma"
                    className="w-full py-2.5 px-3 rounded-xl border border-cream bg-ivory/30 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/40"
                  />
                  {errors.customerName && (
                    <p className="text-[11px] text-rose font-medium">{errors.customerName}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-brown">
                    WhatsApp Mobile Number <span className="text-rose">*</span>
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full py-2.5 px-3 rounded-xl border border-cream bg-ivory/30 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/40"
                  />
                  {errors.customerPhone && (
                    <p className="text-[11px] text-rose font-medium">{errors.customerPhone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="space-y-4">
              <h3 className="font-display font-semibold text-lg text-brown border-b border-cream pb-2">
                2. Event & Timing
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-brown">Occasion / Ceremony</label>
                  <select
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl border border-cream bg-ivory/30 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/40 font-medium"
                  >
                    <option value="Wedding / Vivah Varmala">Wedding / Vivah Varmala</option>
                    <option value="Engagement / Ring Ceremony">Engagement / Ring Ceremony</option>
                    <option value="Reception / Sangeet">Reception / Sangeet</option>
                    <option value="Housewarming / Griha Pravesh">Housewarming / Griha Pravesh</option>
                    <option value="Temple Pooja / Satyanarayan">Temple Pooja / Satyanarayan</option>
                    <option value="Felicitation / VIP Welcome">Felicitation / VIP Welcome</option>
                    <option value="Other Auspicious Event">Other Auspicious Event</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-brown">
                    Required Date <span className="text-rose">*</span>
                  </label>
                  <input
                    type="date"
                    value={requiredDate}
                    onChange={(e) => setRequiredDate(e.target.value)}
                    className="w-full py-2.5 px-3 rounded-xl border border-cream bg-ivory/30 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/40 font-medium"
                  />
                  {errors.requiredDate && (
                    <p className="text-[11px] text-rose font-medium">{errors.requiredDate}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Reference Image Upload */}
            <div className="space-y-3">
              <h3 className="font-display font-semibold text-lg text-brown border-b border-cream pb-2 flex items-center gap-2">
                <Camera className="w-4 h-4 text-saffron" />
                3. Reference Photograph
              </h3>

              {imagePreview ? (
                <div className="relative w-48 h-48 rounded-2xl overflow-hidden border-2 border-saffron shadow-md">
                  <img src={imagePreview} alt="Reference preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImagePreview('')}
                    className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-rose transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-cream hover:border-saffron/60 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-cream/20 transition-all">
                  <Upload className="w-8 h-8 text-saffron mb-2" />
                  <p className="text-xs sm:text-sm font-semibold text-brown">
                    Click to upload garland reference image
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Supports JPEG, PNG, WebP up to 5 MB
                  </p>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Garland Preferences */}
            <div className="space-y-4">
              <h3 className="font-display font-semibold text-lg text-brown border-b border-cream pb-2">
                4. Flower, Colour & Budget Details
              </h3>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brown">
                  Garland Description & Length Specifications
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Pair of varmalas, approx 3.5 feet length each, medium thickness..."
                  className="w-full p-3 rounded-xl border border-cream bg-ivory/30 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/40 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-brown">Flower Preferences</label>
                  <input
                    type="text"
                    value={flowerPreferences}
                    onChange={(e) => setFlowerPreferences(e.target.value)}
                    placeholder="e.g. Dutch Roses, Mogra, Orchids, Carnations"
                    className="w-full py-2.5 px-3 rounded-xl border border-cream bg-ivory/30 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-brown">Preferred Colour Palette</label>
                  <input
                    type="text"
                    value={preferredColours}
                    onChange={(e) => setPreferredColours(e.target.value)}
                    placeholder="e.g. Pastel Pink & White, or Red & Gold"
                    className="w-full py-2.5 px-3 rounded-xl border border-cream bg-ivory/30 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-brown">Min Budget (₹)</label>
                  <input
                    type="number"
                    value={budgetMin}
                    onChange={(e) => setBudgetMin(e.target.value ? Number(e.target.value) : '')}
                    className="w-full py-2.5 px-3 rounded-xl border border-cream bg-ivory/30 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/40"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-brown">Max Budget (₹)</label>
                  <input
                    type="number"
                    value={budgetMax}
                    onChange={(e) => setBudgetMax(e.target.value ? Number(e.target.value) : '')}
                    className="w-full py-2.5 px-3 rounded-xl border border-cream bg-ivory/30 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/40"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brown">
                  Additional Instructions / Delivery Requests
                </label>
                <textarea
                  rows={2}
                  value={additionalInstructions}
                  onChange={(e) => setAdditionalInstructions(e.target.value)}
                  placeholder="e.g. Delivery required at venue banquet hall before 7:00 AM..."
                  className="w-full p-3 rounded-xl border border-cream bg-ivory/30 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/40 resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-green text-sm py-4 flex items-center justify-center gap-2 font-bold shadow-premium"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>{isSubmitting ? 'Submitting Request...' : 'Send Custom Request on WhatsApp'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

