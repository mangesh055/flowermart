import { useState, useEffect } from 'react'
import { productService } from '@/services/productService'
import type { Product } from '@/types/database'
import { ProductCard } from '@/components/catalogue/ProductCard'

export function PopularGarlands() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    productService.getAll().then((data) => {
      // Pick 4 different products from the full set
      setProducts(data.slice(2, 6))
    })
  }, [])

  return (
    <section className="py-16 bg-cream/20 border-t border-cream">
      <div className="section-container">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="badge-tag bg-green-100 text-green-800 border border-green-200 mb-2">
            Pooja & Wedding Specials
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-brown">
            Popular Traditional Creations
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">
            Auspicious blooms hand-woven to sanctify temples, welcoming thresholds, and matrimonial rites.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  )
}

