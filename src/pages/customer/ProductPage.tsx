import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  ShoppingBag,
  Check,
  Calendar,
  MessageCircle,
  Clock,
  Sparkles,
  ShieldCheck,
  Truck,
  Plus,
  Minus,
} from 'lucide-react'
import { productService } from '@/services/productService'
import { useCartStore } from '@/stores/cartStore'
import { useSettingsStore } from '@/stores/settingsStore'
import type { Product } from '@/types/database'
import { formatINR, formatPriceUnit, formatPriceUnitShort, buildWhatsAppLink, cn } from '@/lib/utils'

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const addItem = useCartStore((state) => state.addItem)
  const settings = useSettingsStore((state) => state.settings)

  const [product, setProduct] = useState<Product | null>(null)
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [requiredDate, setRequiredDate] = useState('')
  const [customizationNotes, setCustomizationNotes] = useState('')
  const [isAdded, setIsAdded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Default required date to tomorrow
  useEffect(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setRequiredDate(tomorrow.toISOString().split('T')[0])
  }, [])

  useEffect(() => {
    if (!slug) return
    setIsLoading(true)
    productService.getBySlug(slug).then((data) => {
      setProduct(data)
      if (data?.primary_image_url) {
        setSelectedImage(data.primary_image_url)
      } else if (data?.images && data.images.length > 0) {
        setSelectedImage(data.images[0].image_url)
      }
      setIsLoading(false)
    })
  }, [slug])

  if (isLoading) {
    return (
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-pulse">
          <div className="rounded-3xl bg-cream/50 aspect-square" />
          <div className="space-y-4">
            <div className="h-8 bg-cream/50 rounded-xl w-3/4" />
            <div className="h-6 bg-cream/50 rounded-xl w-1/3" />
            <div className="h-24 bg-cream/50 rounded-xl w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="section-container py-20 text-center space-y-4">
        <h2 className="font-display font-bold text-2xl text-brown">Garland Not Found</h2>
        <p className="text-sm text-muted-foreground">The requested product could not be located.</p>
        <Link to="/catalogue" className="btn-saffron inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Return to Catalogue
        </Link>
      </div>
    )
  }

  const allImages = [
    ...(product.primary_image_url ? [product.primary_image_url] : []),
    ...(product.images?.map((i) => i.image_url) || []),
  ].filter((url, idx, self) => self.indexOf(url) === idx)

  if (allImages.length === 0) {
    allImages.push('https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=800&auto=format&fit=crop&q=80')
  }

  const handleAddToCart = () => {
    if (!product.is_available) return

    addItem({
      product_id: product.id,
      product_name: product.name,
      product_slug: product.slug,
      image_url: selectedImage || product.primary_image_url,
      unit_price: product.price,
      price_unit: product.price_unit,
      quantity,
      customization_notes: customizationNotes.trim() || undefined,
      required_date: requiredDate || undefined,
    })

    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  const handleBuyNow = () => {
    handleAddToCart()
    navigate('/cart')
  }

  // Quick WhatsApp enquiry link for this specific garland
  const whatsAppDirectMsg = `Namaste ${settings.store_name}, I am interested in:
*${product.name}* (SKU: ${product.sku || 'N/A'})
Price: ${formatINR(product.price)} ${formatPriceUnitShort(product.price_unit)}
Quantity: ${quantity}
Required Date: ${requiredDate || 'As discussed'}
${customizationNotes ? `Customization: ${customizationNotes}` : ''}`

  return (
    <div className="py-8 sm:py-12 bg-ivory min-h-screen">
      <div className="section-container space-y-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-brown">Home</Link>
          <span>/</span>
          <Link to="/catalogue" className="hover:text-brown">Catalogue</Link>
          <span>/</span>
          {product.category && (
            <>
              <Link to={`/category/${product.category.slug}`} className="hover:text-brown">
                {product.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-brown font-medium truncate max-w-[200px] sm:max-w-xs">
            {product.name}
          </span>
        </div>

        {/* Product Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6 space-y-4">
            {/* Primary Large Image */}
            <div className="relative rounded-3xl overflow-hidden bg-white border border-cream shadow-md aspect-[4/3] sm:aspect-square">
              <img
                src={selectedImage || allImages[0]}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300"
              />
              {product.is_featured && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="badge-tag bg-saffron text-white shadow-md flex items-center gap-1">
                    <Sparkles className="w-3 h-3 fill-white" /> Featured Design
                  </span>
                </div>
              )}
              <div className="absolute top-4 right-4 z-10">
                <span
                  className={cn(
                    'badge-tag shadow-md',
                    product.is_available
                      ? 'bg-green-600 text-white'
                      : 'bg-red-600 text-white'
                  )}
                >
                  {product.is_available ? 'Available' : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Thumbnail Row */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {allImages.map((imgUrl, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(imgUrl)}
                    className={cn(
                      'w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0',
                      selectedImage === imgUrl
                        ? 'border-saffron scale-105 shadow-md'
                        : 'border-cream hover:border-saffron/40 opacity-80 hover:opacity-100'
                    )}
                  >
                    <img
                      src={imgUrl}
                      alt={`${product.name} angle ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs text-brown/80 font-medium">
              <div className="p-3 bg-white rounded-2xl border border-cream space-y-1">
                <ShieldCheck className="w-5 h-5 text-green-600 mx-auto" />
                <p>100% Fresh Guaranteed</p>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-cream space-y-1">
                <Clock className="w-5 h-5 text-saffron mx-auto" />
                <p>Early Morning Muhurat</p>
              </div>
              <div className="p-3 bg-white rounded-2xl border border-cream space-y-1">
                <Truck className="w-5 h-5 text-rose mx-auto" />
                <p>Safe Pickup / Delivery</p>
              </div>
            </div>
          </div>

          {/* Right Column: Information & Ordering Controls */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2 border-b border-cream pb-5">
              {product.sku && (
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  SKU: {product.sku}
                </span>
              )}
              <h1 className="font-display font-bold text-3xl sm:text-4xl text-brown leading-tight">
                {product.name}
              </h1>
              {product.name_marathi && (
                <p className="font-marathi text-lg text-rose font-medium">
                  {product.name_marathi}
                </p>
              )}

              {/* Price Banner */}
              <div className="flex items-baseline gap-2 pt-2">
                <span className="font-display font-bold text-3xl sm:text-4xl text-brown">
                  {formatINR(product.price)}
                </span>
                <span className="text-sm font-semibold text-muted-foreground">
                  {formatPriceUnit(product.price_unit)}
                </span>
              </div>
            </div>

            {/* Product Specifications Table */}
            <div className="bg-white rounded-2xl p-4 border border-cream space-y-2.5 text-xs sm:text-sm">
              {product.flower_type && (
                <div className="flex items-start justify-between gap-4 py-1 border-b border-cream/50">
                  <span className="text-muted-foreground font-medium shrink-0">Flower Varieties</span>
                  <span className="text-brown font-semibold text-right">{product.flower_type}</span>
                </div>
              )}
              {product.occasion && (
                <div className="flex items-start justify-between gap-4 py-1 border-b border-cream/50">
                  <span className="text-muted-foreground font-medium shrink-0">Ideal Occasion</span>
                  <span className="text-brown font-semibold text-right">{product.occasion}</span>
                </div>
              )}
              {product.category && (
                <div className="flex items-start justify-between gap-4 py-1">
                  <span className="text-muted-foreground font-medium shrink-0">Category</span>
                  <span className="text-brown font-semibold text-right">{product.category.name}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="font-display font-semibold text-base text-brown">
                Garland Details & Craftsmanship
              </h3>
              <p className="text-sm text-brown/80 leading-relaxed font-body">
                {product.description || 'Specially handcrafted using fresh early morning flowers selected for fragrance, longevity, and auspicious ceremonial grandeur.'}
              </p>
            </div>

            {/* Customization Options Box */}
            <div className="bg-cream/40 rounded-2xl p-5 border border-cream space-y-4">
              <h4 className="font-display font-semibold text-sm text-brown flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-saffron" />
                Customize for Your Event
              </h4>

              {/* Required Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brown flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-saffron" />
                  Required Date:
                </label>
                <input
                  type="date"
                  value={requiredDate}
                  onChange={(e) => setRequiredDate(e.target.value)}
                  className="w-full py-2 px-3 rounded-xl border border-cream bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-saffron/50 text-brown font-medium"
                />
              </div>

              {/* Customization Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-brown">
                  Special Notes / Specific Length / Color Preferences:
                </label>
                <textarea
                  value={customizationNotes}
                  onChange={(e) => setCustomizationNotes(e.target.value)}
                  placeholder="e.g. Please make it 4 feet in length, need lighter pink roses to match bridal lehenga..."
                  rows={2}
                  className="w-full p-3 rounded-xl border border-cream bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-saffron/50 text-brown placeholder:text-muted-foreground/70 resize-none"
                />
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-semibold text-brown">Quantity:</span>
                <div className="flex items-center gap-3 bg-white rounded-xl border border-cream p-1 shadow-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-cream text-brown disabled:opacity-40 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center font-bold text-sm text-brown">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-cream text-brown transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons: Add to Cart, Buy Now, WhatsApp Direct */}
            <div className="space-y-3 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.is_available}
                  className={cn(
                    'w-full py-3.5 px-6 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md',
                    !product.is_available
                      ? 'bg-muted text-muted-foreground cursor-not-allowed'
                      : isAdded
                      ? 'bg-green-600 text-white'
                      : 'bg-white border-2 border-saffron text-saffron hover:bg-saffron hover:text-white'
                  )}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>Added to Cart!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Cart</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={!product.is_available}
                  className="w-full btn-saffron text-sm py-3.5 flex items-center justify-center gap-2 disabled:opacity-50 shadow-premium"
                >
                  <span>Proceed to Checkout</span>
                </button>
              </div>

              {/* Direct WhatsApp Click-to-Chat Button */}
              <a
                href={buildWhatsAppLink(settings.whatsapp_number, whatsAppDirectMsg)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full btn-green text-xs sm:text-sm py-3 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Enquire or Order Direct on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

