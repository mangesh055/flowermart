import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import type { PriceUnit } from "@/types/database"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatINR(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) return "₹0"
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatPriceUnit(unit: PriceUnit | string): string {
  switch (unit) {
    case "per_piece":
      return "per piece"
    case "per_pair":
      return "per pair"
    case "per_metre":
      return "per metre"
    case "per_set":
      return "per set"
    case "per_kg":
      return "per kg"
    case "custom_quotation":
      return "quotation"
    default:
      return unit?.replace("_", " ") || ""
  }
}

export function formatPriceUnitShort(unit: PriceUnit | string): string {
  switch (unit) {
    case "per_piece":
      return "/ pc"
    case "per_pair":
      return "/ pair"
    case "per_metre":
      return "/ mtr"
    case "per_set":
      return "/ set"
    case "per_kg":
      return "/ kg"
    case "custom_quotation":
      return "(on quote)"
    default:
      return ""
  }
}

export function formatDateIST(dateStr: string | Date | null | undefined): string {
  if (!dateStr) return "N/A"
  try {
    const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr
    return new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date)
  } catch {
    return String(dateStr)
  }
}

export function formatDateTimeIST(dateStr: string | Date | null | undefined): string {
  if (!dateStr) return "N/A"
  try {
    const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr
    return new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date)
  } catch {
    return String(dateStr)
  }
}

export function generateOrderNumber(): string {
  const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, "")
  const randomPart = Math.floor(1000 + Math.random() * 9000)
  return `SPB-${datePart}-${randomPart}`
}

export function generateRequestNumber(): string {
  const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, "")
  const randomPart = Math.floor(1000 + Math.random() * 9000)
  return `REQ-${datePart}-${randomPart}`
}

export function cleanPhone(phone: string): string {
  // Strip non-digits
  const digits = phone.replace(/\D/g, "")
  if (digits.length === 10) {
    return `91${digits}`
  }
  if (digits.startsWith("0") && digits.length === 11) {
    return `91${digits.slice(1)}`
  }
  return digits
}

export function buildWhatsAppLink(phone: string, text: string): string {
  const targetPhone = cleanPhone(phone)
  return `https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`
}

