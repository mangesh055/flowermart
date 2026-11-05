import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Flame } from 'lucide-react'
import { productService } from '@/services/productService'
import type { Product } from '@/types/database'
import { ProductCard } from '@/components/catalogue/ProductCard'

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    productService.getFeatured().then((data) => {
      setProducts(data.slice(0, 4))
      setIsLoading(false)
    })
  }, [])

  return (
    <section className="py-16 sm:py-20 bg-ivory">
      <div className="section-container">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
          <div className="text-center sm:text-left">
            <span className="badge-tag bg-rose/15 text-rose border border-rose/30 mb-2 flex items-center gap-1 w-fit mx-auto sm:mx-0">
              <Flame className="w-3.5 h-3.5 fill-rose" />
              Top Recommendations
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-brown">
              Featured Garland Designs
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Our most celebrated and frequently ordered garland arrangements
            </p>
          </div>
          <Link
            to="/catalogue"
            className="inline-flex items-center gap-2 text-sm font-semibold text-saffron hover:text-saffron-600 transition-colors"
          >
            <span>Explore Entire Catalogue</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="rounded-2xl bg-white border border-cream p-4 space-y-4 animate-pulse h-80"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

