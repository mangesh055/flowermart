import { HeroBanner } from '@/components/home/HeroBanner'
import { FeaturedCategories } from '@/components/home/FeaturedCategories'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { PopularGarlands } from '@/components/home/PopularGarlands'
import { WhyChooseUs } from '@/components/home/WhyChooseUs'
import { CustomOrderBanner } from '@/components/home/CustomOrderBanner'

export function HomePage() {
  return (
    <div className="space-y-0">
      <HeroBanner />
      <FeaturedCategories />
      <FeaturedProducts />
      <PopularGarlands />
      <WhyChooseUs />
      <CustomOrderBanner />
    </div>
  )
}

