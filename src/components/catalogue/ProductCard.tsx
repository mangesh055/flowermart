import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Eye, Check, Sparkles } from 'lucide-react'
import type { Product } from '@/types/database'
import { formatINR, formatPriceUnitShort, cn } from '@/lib/utils'
import { useCartStore } from '@/stores/cartStore'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!product.is_available) return

    addItem({
      product_id: product.id,
      product_name: product.name,
      product_slug: product.slug,
      image_url: product.primary_image_url,
      unit_price: product.price,
      price_unit: product.price_unit,
      quantity: 1,
    })

    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 1500)
  }

  return (
    <div className="card-garland group">
      {/* Product Image Container */}
      <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden bg-cream/30">
        <img
          src={product.primary_image_url || 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=800&auto=format&fit=crop&q=80'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.is_featured && (
            <span className="badge-tag bg-saffron text-white shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3 fill-white" />
              Featured
            </span>
          )}
          {product.category && (
            <span className="badge-tag bg-white/90 backdrop-blur-sm text-brown text-[11px] border border-cream">
              {product.category.name}
            </span>
          )}
        </div>

        {/* Availability Badge */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <span
            className={cn(
              'badge-tag shadow-sm backdrop-blur-sm',
              product.is_available
                ? 'bg-green-600/90 text-white'
                : 'bg-red-600/90 text-white'
            )}
          >
            {product.is_available ? 'Available' : 'Out of Stock'}
          </span>
        </div>

        {/* Quick View Button Hover overlay */}
        <Link
          to={`/product/${product.slug}`}
          className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
          aria-label={`View details of ${product.name}`}
        >
          <span className="px-4 py-2 rounded-xl bg-white/95 text-brown text-xs font-semibold shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5" /> View Details
          </span>
        </Link>
      </div>

      {/* Card Body */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div className="space-y-1.5 mb-3">
          <Link
            to={`/product/${product.slug}`}
            className="font-display font-semibold text-base sm:text-lg text-brown group-hover:text-saffron transition-colors line-clamp-2 leading-snug"
          >
            {product.name}
          </Link>

          {product.name_marathi && (
            <p className="font-marathi text-xs text-rose font-medium line-clamp-1">
              {product.name_marathi}
            </p>
          )}

          {product.flower_type && (
            <p className="text-xs text-muted-foreground line-clamp-1">
              Flowers: {product.flower_type}
            </p>
          )}
        </div>

        {/* Price & Action Button */}
        <div className="pt-2 border-t border-cream flex items-center justify-between gap-2 mt-auto">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-display font-bold text-lg sm:text-xl text-brown">
                {formatINR(product.price)}
              </span>
              <span className="text-xs text-muted-foreground font-medium">
                {formatPriceUnitShort(product.price_unit)}
              </span>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!product.is_available}
            className={cn(
              'px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm',
              !product.is_available
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : isAdded
                ? 'bg-green-600 text-white'
                : 'bg-saffron hover:bg-saffron-600 text-white hover:shadow-md'
            )}
            title={product.is_available ? 'Add to cart' : 'Currently unavailable'}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

