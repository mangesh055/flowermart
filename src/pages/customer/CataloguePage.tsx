import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, SlidersHorizontal, Sparkles, Filter, X } from 'lucide-react'
import { productService } from '@/services/productService'
import { categoryService, INITIAL_CATEGORIES } from '@/services/categoryService'
import type { Product, Category } from '@/types/database'
import { ProductCard } from '@/components/catalogue/ProductCard'
import { cn } from '@/lib/utils'

export function CataloguePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialCategory = searchParams.get('category') || ''

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES)
  const [isLoading, setIsLoading] = useState(true)

  // Filter States
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'name'>('featured')
  const [onlyAvailable, setOnlyAvailable] = useState(false)

  // Sync category param with URL
  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat !== null) {
      setSelectedCategory(cat)
    }
  }, [searchParams])

  useEffect(() => {
    categoryService.getAll().then(setCategories)
    productService.getAll().then((data) => {
      setProducts(data)
      setIsLoading(false)
    })
  }, [])

  const handleCategorySelect = (slug: string) => {
    setSelectedCategory(slug)
    if (slug) {
      setSearchParams({ category: slug })
    } else {
      setSearchParams({})
    }
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('')
    setSortBy('featured')
    setOnlyAvailable(false)
    setSearchParams({})
  }

  // Filtered & Sorted items
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory) {
        const cat = categories.find((c) => c.slug === selectedCategory || c.name === selectedCategory)
        if (cat && p.category_id !== cat.id) return false
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchName = p.name.toLowerCase().includes(q)
        const matchMarathi = p.name_marathi?.includes(q)
        const matchDesc = p.description?.toLowerCase().includes(q)
        const matchFlower = p.flower_type?.toLowerCase().includes(q)
        const matchOccasion = p.occasion?.toLowerCase().includes(q)
        if (!matchName && !matchMarathi && !matchDesc && !matchFlower && !matchOccasion) return false
      }

      // Availability
      if (onlyAvailable && !p.is_available) {
        return false
      }

      return true
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price
      if (sortBy === 'price_desc') return b.price - a.price
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      // default: featured
      return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0)
    })
  }, [products, categories, selectedCategory, searchQuery, onlyAvailable, sortBy])

  const hasActiveFilters = Boolean(searchQuery || selectedCategory || onlyAvailable || sortBy !== 'featured')

  return (
    <div className="py-8 sm:py-12 bg-ivory min-h-screen">
      <div className="section-container space-y-8">
        {/* Page Header */}
        <div className="text-center sm:text-left space-y-2 border-b border-cream pb-6">
          <span className="badge-tag bg-saffron/15 text-saffron border border-saffron/30">
            Digital Garland Showcase
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-brown">
            Fresh Flower & Garland Catalogue
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground font-body max-w-2xl">
            Browse our full repertoire of hand-tied varmalas, festive pooja malas, mogra strands, and custom floral arrangements with real-time prices.
          </p>
        </div>

        {/* Search & Filter Controls Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-cream shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search garland name, flower (e.g. Mogra, Rose), occasion..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-cream bg-ivory/40 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/50 transition-all placeholder:text-muted-foreground/80"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-brown"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-4 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full py-2.5 px-3 rounded-xl border border-cream bg-ivory/40 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/50 text-brown font-medium"
              >
                <option value="featured">Sort by: Featured First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name">Alphabetical (A - Z)</option>
              </select>
            </div>

            {/* Availability Toggle */}
            <div className="md:col-span-3 flex items-center justify-between sm:justify-end gap-3 px-2">
              <label className="flex items-center gap-2 text-xs sm:text-sm font-medium text-brown cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                  className="w-4 h-4 rounded text-saffron focus:ring-saffron accent-saffron"
                />
                <span>In Stock Only</span>
              </label>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-rose hover:text-rose-700 font-semibold flex items-center gap-1 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Category Chips Scrollbar */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 scrollbar-none">
            <button
              onClick={() => handleCategorySelect('')}
              className={cn(
                'px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0',
                !selectedCategory
                  ? 'bg-brown text-white shadow-sm'
                  : 'bg-ivory hover:bg-cream text-brown border border-cream'
              )}
            >
              All Categories ({products.length})
            </button>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.slug || selectedCategory === cat.name
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.slug)}
                  className={cn(
                    'px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0',
                    isSelected
                      ? 'bg-saffron text-white shadow-sm'
                      : 'bg-ivory hover:bg-cream text-brown border border-cream'
                  )}
                >
                  {cat.name}
                </button>
              )
            })}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
          <span>
            Showing <strong className="text-brown">{filteredProducts.length}</strong> items
          </span>
          {selectedCategory && (
            <span className="flex items-center gap-1 font-medium text-brown">
              <Filter className="w-3 h-3 text-saffron" />
              Filtered by: {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
            </span>
          )}
        </div>

        {/* Product Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="rounded-2xl bg-white border border-cream p-4 space-y-4 animate-pulse h-80"
              />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-cream p-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-cream mx-auto flex items-center justify-center text-3xl">
              🌸
            </div>
            <h3 className="font-display font-semibold text-xl text-brown">
              No garlands matched your criteria
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              Try adjusting your search query, selecting a different category, or resetting all filters.
            </p>
            <button
              onClick={clearFilters}
              className="btn-saffron text-xs py-2 px-5 inline-flex items-center gap-1.5"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

