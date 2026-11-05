import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { categoryService } from '@/services/categoryService'
import { productService } from '@/services/productService'
import type { Category, Product } from '@/types/database'
import { ProductCard } from '@/components/catalogue/ProductCard'

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    setIsLoading(true)

    Promise.all([
      categoryService.getBySlug(slug),
      productService.getAll({ categorySlug: slug }),
    ]).then(([catData, prodData]) => {
      setCategory(catData)
      setProducts(prodData)
      setIsLoading(false)
    })
  }, [slug])

  if (!isLoading && !category) {
    return (
      <div className="section-container py-20 text-center space-y-4">
        <h2 className="font-display font-bold text-2xl text-brown">Category not found</h2>
        <p className="text-sm text-muted-foreground">The requested category could not be located.</p>
        <Link to="/catalogue" className="btn-saffron inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Catalogue
        </Link>
      </div>
    )
  }

  return (
    <div className="py-8 sm:py-12 bg-ivory min-h-screen">
      <div className="section-container space-y-8">
        {/* Breadcrumb / Back button */}
        <div>
          <Link
            to="/catalogue"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-brown transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to All Garlands
          </Link>
        </div>

        {/* Category Hero / Header */}
        {category && (
          <div className="relative rounded-3xl overflow-hidden bg-white border border-cream shadow-sm p-6 sm:p-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 border-cream shrink-0 shadow-md">
              <img
                src={category.image_url}
                alt={category.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-2 text-center md:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="badge-tag bg-saffron/15 text-saffron border border-saffron/30">
                  Category
                </span>
                {category.name_marathi && (
                  <span className="font-marathi text-sm text-rose font-medium">
                    {category.name_marathi}
                  </span>
                )}
              </div>
              <h1 className="font-display font-bold text-3xl sm:text-4xl text-brown">
                {category.name}
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl font-body">
                {category.description || 'Explore our artisanal garland collection meticulously prepared with fresh fragrant blossoms.'}
              </p>
            </div>
          </div>
        )}

        {/* Product Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
            <span>
              Showing <strong className="text-brown">{products.length}</strong> items in this category
            </span>
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
          ) : products.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-cream p-8 space-y-4">
              <Sparkles className="w-12 h-12 text-saffron mx-auto" />
              <h3 className="font-display font-semibold text-xl text-brown">
                No products currently listed in this category
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Check back shortly or request a custom order for this garland style on WhatsApp.
              </p>
              <Link to="/custom-request" className="btn-saffron text-xs py-2 px-5 inline-flex">
                Custom Garland Request
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

