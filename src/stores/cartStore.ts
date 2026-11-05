import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, CartState } from '@/types/database'

interface CartStore extends CartState {
  addItem: (item: Omit<CartItem, 'line_total'>) => void
  updateQuantity: (product_id: string, quantity: number) => void
  removeItem: (product_id: string) => void
  clearCart: () => void
  setDeliveryCharge: (charge: number) => void
  getItemCount: () => number
}

function calculateTotals(items: CartItem[], delivery_charge: number) {
  const subtotal = items.reduce((sum, item) => sum + item.line_total, 0)
  return {
    subtotal,
    delivery_charge,
    total: subtotal + delivery_charge,
  }
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      subtotal: 0,
      delivery_charge: 0,
      total: 0,

      addItem: (newItem) => {
        const { items, delivery_charge } = get()
        const existingIndex = items.findIndex(
          (i) => i.product_id === newItem.product_id
        )

        let updatedItems: CartItem[]
        if (existingIndex > -1) {
          updatedItems = items.map((item, idx) => {
            if (idx === existingIndex) {
              const newQuantity = item.quantity + newItem.quantity
              return {
                ...item,
                quantity: newQuantity,
                line_total: newQuantity * item.unit_price,
                customization_notes: newItem.customization_notes || item.customization_notes,
                required_date: newItem.required_date || item.required_date,
              }
            }
            return item
          })
        } else {
          const itemWithTotal: CartItem = {
            ...newItem,
            line_total: newItem.quantity * newItem.unit_price,
          }
          updatedItems = [...items, itemWithTotal]
        }

        set({
          items: updatedItems,
          ...calculateTotals(updatedItems, delivery_charge),
        })
      },

      updateQuantity: (product_id, quantity) => {
        const { items, delivery_charge } = get()
        if (quantity <= 0) {
          const updatedItems = items.filter((i) => i.product_id !== product_id)
          set({
            items: updatedItems,
            ...calculateTotals(updatedItems, delivery_charge),
          })
          return
        }

        const updatedItems = items.map((item) => {
          if (item.product_id === product_id) {
            return {
              ...item,
              quantity,
              line_total: quantity * item.unit_price,
            }
          }
          return item
        })

        set({
          items: updatedItems,
          ...calculateTotals(updatedItems, delivery_charge),
        })
      },

      removeItem: (product_id) => {
        const { items, delivery_charge } = get()
        const updatedItems = items.filter((i) => i.product_id !== product_id)
        set({
          items: updatedItems,
          ...calculateTotals(updatedItems, delivery_charge),
        })
      },

      clearCart: () => {
        set({
          items: [],
          subtotal: 0,
          delivery_charge: 0,
          total: 0,
        })
      },

      setDeliveryCharge: (charge) => {
        const { items } = get()
        set(calculateTotals(items, charge))
      },

      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      },
    }),
    {
      name: 'santosh_pushpa_cart_v2',
    }
  )
)
