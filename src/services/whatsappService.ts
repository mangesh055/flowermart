import type { Order, CustomRequest } from '@/types/database'
import { formatINR, formatPriceUnitShort, formatDateIST, buildWhatsAppLink } from '@/lib/utils'

export function generateOrderWhatsAppMessage(order: Order, storeName = 'Santosh Pushpa Bhandar'): string {
  const itemsText = order.items && order.items.length > 0
    ? order.items
        .map(
          (item, idx) =>
            `${idx + 1}. *${item.product_name}* x ${item.quantity} ${formatPriceUnitShort(item.price_unit)} = ${formatINR(item.line_total)}`
        )
        .join('\n')
    : 'No items'

  const advancePaid = order.advance_paid ?? 0
  const balanceDue = order.balance_amount ?? Math.max(0, order.total_amount - advancePaid)

  const paymentBreakdown = `💰 *TOTAL DEAL AMOUNT:* *${formatINR(order.total_amount)}*
💵 *Advance / Paid:* ${formatINR(advancePaid)}
⏳ *Remaining Balance Due:* *${formatINR(balanceDue)}*${order.payment_note ? `\n💳 *Payment Note:* ${order.payment_note}` : ''}`

  const message = `🌸 *NEW ORDER REQUEST* 🌸
*${storeName}*

📋 *Order ID:* \`${order.order_number}\`
📅 *Required Date:* ${formatDateIST(order.required_date)}
⏰ *Required Time:* ${order.required_time || 'Standard store hours'}

👤 *Customer Details:*
• Name: ${order.customer_name}
• Phone: ${order.customer_phone}
${order.customer_alternate_phone ? `• Alt Phone: ${order.customer_alternate_phone}` : ''}

🛒 *Ordered Items:*
${itemsText}

🏪 *Collection:* Store Pickup (Dadar Flower Market)
${order.special_instructions ? `\n📝 *Special Instructions:*\n${order.special_instructions}\n` : ''}
${paymentBreakdown}

_Please confirm availability and order acceptance._ Thank you!`

  return message
}

export function generateCustomRequestWhatsAppMessage(request: CustomRequest, storeName = 'Santosh Pushpa Bhandar'): string {
  const budgetText = request.budget_max
    ? `${formatINR(request.budget_min || 0)} - ${formatINR(request.budget_max)}`
    : request.budget_min
    ? `From ${formatINR(request.budget_min)}`
    : 'Not specified'

  const message = `✨ *CUSTOM GARLAND DESIGN REQUEST* ✨
*${storeName}*

📋 *Request ID:* \`${request.request_number}\`
👤 *Customer:* ${request.customer_name} (${request.customer_phone})
🎉 *Occasion:* ${request.occasion || 'General / Special Event'}
📅 *Required Date:* ${request.required_date ? formatDateIST(request.required_date) : 'As soon as possible'}
💰 *Budget:* ${budgetText}

🌸 *Garland Description:*
${request.description || 'No description provided'}

🌺 *Flower Preferences:* ${request.flower_preferences || 'Open to suggestion'}
🎨 *Preferred Colours:* ${request.preferred_colours || 'Open to suggestion'}
${request.reference_image_url ? `\n📷 *Reference Image:* Attached / Uploaded to portal` : ''}
${request.additional_instructions ? `\n📝 *Notes:* ${request.additional_instructions}` : ''}

_Please review and share a price quotation._`

  return message
}

export function openOrderInWhatsApp(order: Order, whatsappNumber: string, storeName?: string): void {
  const text = generateOrderWhatsAppMessage(order, storeName)
  const link = buildWhatsAppLink(whatsappNumber, text)
  window.open(link, '_blank', 'noopener,noreferrer')
}

export function openCustomRequestInWhatsApp(request: CustomRequest, whatsappNumber: string, storeName?: string): void {
  const text = generateCustomRequestWhatsAppMessage(request, storeName)
  const link = buildWhatsAppLink(whatsappNumber, text)
  window.open(link, '_blank', 'noopener,noreferrer')
}

