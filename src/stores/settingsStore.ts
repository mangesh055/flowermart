import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { StoreSettings } from '@/types/database'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export const DEFAULT_STORE_SETTINGS: StoreSettings = {
  id: 'default-settings-id',
  store_name: 'Santosh Pushpa Bhandar',
  store_name_marathi: 'संतोष पुष्प भंडार',
  whatsapp_number: '919876543210',
  contact_number: '+91 98765 43210',
  alternate_number: '+91 91234 56789',
  address: 'Shop No. 4, Flower Market, Station Road, Dadar (West)',
  address_marathi: 'दुकान क्र. ४, फूल बाजार, स्टेशन रोड, दादर (पश्चिम)',
  city: 'Mumbai',
  state: 'Maharashtra',
  pincode: '400028',
  google_maps_link: 'https://maps.google.com',
  opening_hours: 'Mon - Sun: 5:00 AM - 10:00 PM',
  website_url: 'https://santoshpushpa.in',
  instagram_url: 'https://instagram.com/santoshpushpabhandar',
  facebook_url: '',
  is_delivery_available: true,
  default_delivery_charge: 50,
  free_delivery_above: 999,
  created_at: new Date().toISOString(),
}

interface SettingsState {
  settings: StoreSettings
  isLoading: boolean
  fetchSettings: () => Promise<void>
  updateSettings: (newSettings: Partial<StoreSettings>) => Promise<boolean>
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      settings: DEFAULT_STORE_SETTINGS,
      isLoading: false,

      fetchSettings: async () => {
        if (!isSupabaseConfigured) return
        try {
          set({ isLoading: true })
          const { data, error } = await supabase
            .from('store_settings')
            .select('*')
            .limit(1)
            .maybeSingle()

          if (!error && data) {
            set({ settings: { ...DEFAULT_STORE_SETTINGS, ...data } })
          }
        } catch (err) {
          console.warn('Could not load store settings from Supabase, using current state:', err)
        } finally {
          set({ isLoading: false })
        }
      },

      updateSettings: async (newSettings) => {
        const merged = { ...get().settings, ...newSettings }
        set({ settings: merged })

        if (isSupabaseConfigured) {
          try {
            const { error } = await supabase
              .from('store_settings')
              .upsert(merged)
            return !error
          } catch (err) {
            console.error('Failed to update settings in Supabase:', err)
            return false
          }
        }
        return true
      },
    }),
    {
      name: 'santosh_pushpa_settings_v1',
    }
  )
)

