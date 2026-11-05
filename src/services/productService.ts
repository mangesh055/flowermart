import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { Product } from '@/types/database'
import { INITIAL_CATEGORIES } from './categoryService'

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    category_id: 'cat-2',
    name: 'Royal Bridal Varmala (Red Dutch Rose & Baby Breath)',
    name_marathi: 'शाही नवरदेव-नवरी वरमाला (लाल गुलाब व जिप्सो)',
    slug: 'royal-bridal-varmala-red-dutch-rose',
    description: 'Exquisitely handcrafted wedding varmala pair made from selected Dutch red roses, white baby’s breath (gypsophila), and pearl accents. Light weight and long lasting for full wedding rituals.',
    flower_type: 'Dutch Red Rose, Baby’s Breath, Jasmine',
    occasion: 'Wedding / Vivah / Reception',
    sku: 'SPB-VM-01',
    price: 2499,
    price_unit: 'per_pair',
    is_available: true,
    is_featured: true,
    display_order: 1,
    primary_image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString(),
    images: [
      {
        id: 'img-1-1',
        product_id: 'prod-1',
        image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
        display_order: 1,
        is_primary: true,
        created_at: new Date().toISOString(),
      },
      {
        id: 'img-1-2',
        product_id: 'prod-1',
        image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
        display_order: 2,
        is_primary: false,
        created_at: new Date().toISOString(),
      },
    ],
  },
  {
    id: 'prod-2',
    category_id: 'cat-2',
    name: 'Pastel Blush Pink & White Orchid Varmala',
    name_marathi: 'पेस्टल पिंक आणि पांढऱ्या ऑर्किडची वरमाला',
    slug: 'pastel-pink-white-orchid-varmala',
    description: 'Modern pastel luxury varmala pair combining soft pink roses and pristine white Dendrobium orchids with golden zari thread finish.',
    flower_type: 'Pink Rose, White Orchid, Carnations',
    occasion: 'Destination Wedding / Reception',
    sku: 'SPB-VM-02',
    price: 3200,
    price_unit: 'per_pair',
    is_available: true,
    is_featured: true,
    display_order: 2,
    primary_image_url: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-3',
    category_id: 'cat-1',
    name: 'Traditional Zendu (Marigold) & Sevanti Haar',
    name_marathi: 'पारंपरिक झेंडू व शेवंतीचा हार',
    slug: 'traditional-zendu-sevanti-haar',
    description: 'Rich orange and golden yellow marigold flowers densely intertwined with white sevanti. Auspicious and classic for all pooja, housewarming and festival ceremonies.',
    flower_type: 'Orange Zendu, Yellow Zendu, White Sevanti',
    occasion: 'Daily Pooja, Diwali, Ganesh Chaturthi, Griha Pravesh',
    sku: 'SPB-TH-01',
    price: 250,
    price_unit: 'per_piece',
    is_available: true,
    is_featured: true,
    display_order: 3,
    primary_image_url: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=800&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-4',
    category_id: 'cat-4',
    name: 'Fresh Madurai Mogra (Jasmine) Garland',
    name_marathi: 'ताजा मदुराई मोगरा हार',
    slug: 'fresh-madurai-mogra-jasmine-garland',
    description: 'Intoxicatingly sweet-scented pure white Mogra blossoms strung tightly by master florists. Perfect for deity offerings and VIP felicitations.',
    flower_type: 'Fresh Mogra (Jasmine)',
    occasion: 'Temple Pooja, Satyanarayan, Felicitations',
    sku: 'SPB-JM-01',
    price: 450,
    price_unit: 'per_metre',
    is_available: true,
    is_featured: true,
    display_order: 4,
    primary_image_url: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=800&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-5',
    category_id: 'cat-3',
    name: 'Velvet Red Rose Garland with Gold Tassels',
    name_marathi: 'मखमली लाल गुलाबाचा हार',
    slug: 'velvet-red-rose-garland-gold-tassels',
    description: 'Full bloom deep red roses handcrafted with traditional golden tassels and emerald green leaf borders.',
    flower_type: 'Red Roses, Ashoka Leaves',
    occasion: 'Anniversary, Temple Offering, Honor / Welcome',
    sku: 'SPB-RG-01',
    price: 650,
    price_unit: 'per_piece',
    is_available: true,
    is_featured: false,
    display_order: 5,
    primary_image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-6',
    category_id: 'cat-5',
    name: 'Sacred Tulsi & Kamal (Lotus) Pooja Mala',
    name_marathi: 'पवित्र तुळस आणि कमळ पूजा माळ',
    slug: 'sacred-tulsi-kamal-lotus-pooja-mala',
    description: 'Sacred offering mala featuring fragrant Tulsi leaves, pink lotus buds, and champa flowers. Ideal for Lord Krishna and Vishnu poojas.',
    flower_type: 'Tulsi, Lotus, Champa',
    occasion: 'Ekadashi, Satyanarayan, Temple Rituals',
    sku: 'SPB-PJ-01',
    price: 550,
    price_unit: 'per_piece',
    is_available: true,
    is_featured: true,
    display_order: 6,
    primary_image_url: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=800&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-7',
    category_id: 'cat-6',
    name: 'Traditional Marigold Entrance Toran (10 Feet)',
    name_marathi: 'पारंपरिक झेंडूचे प्रवेशद्वार तोरण',
    slug: 'traditional-marigold-entrance-toran',
    description: '10 feet long heavy floral entryway toran woven with dense yellow marigold, mango leaves, and rose accents for welcoming positivity.',
    flower_type: 'Marigold, Mango Leaves, Rose Petals',
    occasion: 'Diwali, Housewarming, Wedding Entryway',
    sku: 'SPB-TR-01',
    price: 1200,
    price_unit: 'per_piece',
    is_available: true,
    is_featured: false,
    display_order: 7,
    primary_image_url: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?w=800&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString(),
  },
  {
    id: 'prod-8',
    category_id: 'cat-7',
    name: 'Premium Wedding Car Floral Bonnet & Door Styling',
    name_marathi: 'लक्झरी लग्न कार सजावट सेट',
    slug: 'premium-wedding-car-floral-styling',
    description: 'Complete wedding car decoration package with front bonnet bouquet, ribbon swoops, side mirror flowers, and rear window garland.',
    flower_type: 'Orchids, Carnations, Roses, Asparagus fern',
    occasion: 'Baraat / Wedding Car Decoration',
    sku: 'SPB-CR-01',
    price: 3500,
    price_unit: 'per_set',
    is_available: true,
    is_featured: true,
    display_order: 8,
    primary_image_url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString(),
  },
]

export const productService = {
  async getAll(params?: {
    categorySlug?: string
    search?: string
    sortBy?: 'price_asc' | 'price_desc' | 'featured' | 'newest'
    availabilityOnly?: boolean
  }): Promise<Product[]> {
    let products = [...INITIAL_PRODUCTS]

    if (isSupabaseConfigured) {
      try {
        let query = supabase
          .from('products')
          .select('*, category:categories(*), images:product_images(*)')
          .order('display_order', { ascending: true })

        if (params?.availabilityOnly) {
          query = query.eq('is_available', true)
        }

        const { data, error } = await query
        if (!error && data && data.length > 0) {
          products = data
        }
      } catch (err) {
        console.warn('Falling back to local product data:', err)
      }
    }

    // Attach category object if not already attached
    products = products.map((p) => {
      if (!p.category) {
        const cat = INITIAL_CATEGORIES.find((c) => c.id === p.category_id)
        return { ...p, category: cat }
      }
      return p
    })

    // Filter by Category
    if (params?.categorySlug) {
      const targetCat = INITIAL_CATEGORIES.find((c) => c.slug === params.categorySlug)
      if (targetCat) {
        products = products.filter((p) => p.category_id === targetCat.id)
      }
    }

    // Search filter
    if (params?.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim()
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.flower_type?.toLowerCase().includes(q) ||
          p.occasion?.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q) ||
          p.name_marathi?.includes(q)
      )
    }

    // Availability filter
    if (params?.availabilityOnly) {
      products = products.filter((p) => p.is_available)
    }

    // Sort
    if (params?.sortBy === 'price_asc') {
      products.sort((a, b) => a.price - b.price)
    } else if (params?.sortBy === 'price_desc') {
      products.sort((a, b) => b.price - a.price)
    } else if (params?.sortBy === 'featured') {
      products.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0))
    }

    return products
  },

  async getBySlug(slug: string): Promise<Product | null> {
    const products = await this.getAll()
    const product = products.find((p) => p.slug === slug)
    return product || null
  },

  async getFeatured(): Promise<Product[]> {
    const products = await this.getAll()
    return products.filter((p) => p.is_featured)
  },
}

