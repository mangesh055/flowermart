import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { Category } from '@/types/database'

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: 'Traditional Garlands',
    name_marathi: 'पारंपरिक हार',
    slug: 'traditional-garlands',
    description: 'Classic marigold, sevanti, and mixed floral garlands for daily pooja, festivities and rituals.',
    image_url: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=800&auto=format&fit=crop&q=80',
    display_order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'cat-2',
    name: 'Wedding Varmala',
    name_marathi: 'लग्न वरमाला',
    slug: 'wedding-varmala',
    description: 'Majestic wedding varmala pairs crafted with premium Dutch roses, baby breath, and exotic orchids.',
    image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
    display_order: 2,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'cat-3',
    name: 'Rose Garlands',
    name_marathi: 'गुलाबाचे हार',
    slug: 'rose-garlands',
    description: 'Handwoven fragrant red, pink, and ivory rose garlands for receptions, milestones and honours.',
    image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    display_order: 3,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'cat-4',
    name: 'Jasmine Garlands',
    name_marathi: 'मोगरा / जाई-जुई हार',
    slug: 'jasmine-garlands',
    description: 'Aromatic pure Mogra and Madurai Malli garlands, veni, and traditional bridal hair gajras.',
    image_url: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=800&auto=format&fit=crop&q=80',
    display_order: 4,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'cat-5',
    name: 'Pooja Garlands',
    name_marathi: 'पूजा हार',
    slug: 'pooja-garlands',
    description: 'Special sacred garlands for Satyanarayan Katha, Ganesh Pooja, Navratri, and Temple offerings.',
    image_url: 'https://images.unsplash.com/photo-1628155930542-3c7a64e2c833?w=800&auto=format&fit=crop&q=80',
    display_order: 5,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'cat-6',
    name: 'Mandap Decoration',
    name_marathi: 'मंडप सजावट',
    slug: 'mandap-decoration',
    description: 'Grand floral backdrops, wedding entryway torans, stage arches, and temple setups.',
    image_url: 'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?w=800&auto=format&fit=crop&q=80',
    display_order: 6,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'cat-7',
    name: 'Car Decoration',
    name_marathi: 'कार सजावट',
    slug: 'car-decoration',
    description: 'Elegant fresh flower wedding car decoration with satin ribbons, bonnet blooms and side styling.',
    image_url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop&q=80',
    display_order: 7,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: 'cat-8',
    name: 'Custom Garlands',
    name_marathi: 'कस्टम / ऑर्डरनुसार हार',
    slug: 'custom-garlands',
    description: 'Made-to-order personalized garlands customized for your special ceremony themes and lengths.',
    image_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80',
    display_order: 8,
    is_active: true,
    created_at: new Date().toISOString(),
  },
]

export const categoryService = {
  async getAll(): Promise<Category[]> {
    if (!isSupabaseConfigured) {
      return INITIAL_CATEGORIES
    }

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })

      if (error || !data || data.length === 0) {
        return INITIAL_CATEGORIES
      }
      return data
    } catch {
      return INITIAL_CATEGORIES
    }
  },

  async getBySlug(slug: string): Promise<Category | null> {
    const all = await this.getAll()
    return all.find((c) => c.slug === slug) || null
  },
}

