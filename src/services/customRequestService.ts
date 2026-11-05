import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { CustomRequest } from '@/types/database'
import { generateRequestNumber } from '@/lib/utils'
import { generateCustomRequestWhatsAppMessage } from './whatsappService'

export interface CreateCustomRequestInput {
  customer_name: string
  customer_phone: string
  occasion?: string
  reference_image_url?: string
  description?: string
  flower_preferences?: string
  preferred_colours?: string
  budget_min?: number
  budget_max?: number
  required_date?: string
  additional_instructions?: string
}

const LOCAL_CUSTOM_REQUESTS_KEY = 'santosh_pushpa_custom_requests_v1'

export const customRequestService = {
  getLocalRequests(): CustomRequest[] {
    try {
      const raw = localStorage.getItem(LOCAL_CUSTOM_REQUESTS_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  },

  saveLocalRequest(req: CustomRequest) {
    try {
      const list = this.getLocalRequests()
      list.unshift(req)
      localStorage.setItem(LOCAL_CUSTOM_REQUESTS_KEY, JSON.stringify(list))
    } catch (e) {
      console.warn('Could not save custom request locally:', e)
    }
  },

  async createRequest(input: CreateCustomRequestInput, storeName?: string): Promise<{
    success: boolean
    request?: CustomRequest
    whatsappMessage?: string
    error?: string
  }> {
    try {
      const requestNumber = generateRequestNumber()
      const newReq: CustomRequest = {
        id: `req-${Date.now()}`,
        request_number: requestNumber,
        customer_name: input.customer_name.trim(),
        customer_phone: input.customer_phone.trim(),
        occasion: input.occasion,
        reference_image_url: input.reference_image_url,
        description: input.description,
        flower_preferences: input.flower_preferences,
        preferred_colours: input.preferred_colours,
        budget_min: input.budget_min,
        budget_max: input.budget_max,
        required_date: input.required_date,
        additional_instructions: input.additional_instructions,
        status: 'new',
        created_at: new Date().toISOString(),
      }

      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase
            .from('custom_requests')
            .insert({
              request_number: newReq.request_number,
              customer_name: newReq.customer_name,
              customer_phone: newReq.customer_phone,
              occasion: newReq.occasion,
              reference_image_url: newReq.reference_image_url,
              description: newReq.description,
              flower_preferences: newReq.flower_preferences,
              preferred_colours: newReq.preferred_colours,
              budget_min: newReq.budget_min,
              budget_max: newReq.budget_max,
              required_date: newReq.required_date,
              additional_instructions: newReq.additional_instructions,
              status: 'new',
            })
            .select()
            .single()

          if (!error && data) {
            newReq.id = data.id
          }
        } catch (err) {
          console.warn('Could not insert custom request into Supabase:', err)
        }
      }

      this.saveLocalRequest(newReq)
      const whatsappMessage = generateCustomRequestWhatsAppMessage(newReq, storeName)

      return {
        success: true,
        request: newReq,
        whatsappMessage,
      }
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Failed to submit request',
      }
    }
  },

  async getAllRequests(): Promise<CustomRequest[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('custom_requests')
          .select('*')
          .order('created_at', { ascending: false })

        if (!error && data) return data
      } catch (err) {
        console.warn('Failed to load custom requests from Supabase:', err)
      }
    }
    return this.getLocalRequests()
  },
}

