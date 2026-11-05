import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { INITIAL_CATEGORIES } from '@/services/categoryService'

export function FeaturedCategories() {
  const categories = INITIAL_CATEGORIES.slice(0, 6)

  return (
    <section className="py-16 bg-cream/30 border-y border-cream">
      <div className="section-container">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
          <div className="text-center sm:text-left">
            <span className="badge-tag bg-saffron/15 text-saffron border border-saffron/30 mb-2">
              Browse Categories
            </span>
            <h2 className="font-display font-bold text-3xl sm:text-4xl text-brown">
              Garlands for Every Occasion
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-1">
              Select a category to explore designs, dimensions and prices
            </p>
          </div>
          <Link
            to="/catalogue"
            className="inline-flex items-center gap-2 text-sm font-semibold text-saffron hover:text-saffron-600 transition-colors"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className="group flex flex-col items-center bg-white rounded-2xl p-4 border border-cream shadow-sm hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 text-center"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-3 border-2 border-cream group-hover:border-saffron transition-colors shadow-inner">
                <img
                  src={cat.image_url}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <h3 className="font-display font-semibold text-sm sm:text-base text-brown group-hover:text-saffron transition-colors leading-tight">
                {cat.name}
              </h3>
              {cat.name_marathi && (
                <p className="font-marathi text-xs text-muted-foreground mt-1">
                  {cat.name_marathi}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

