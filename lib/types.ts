export interface Bag {
  id: string
  name: string
  description: string | null
  price: number
  image_url: string | null
  category: string
  is_available: boolean
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  customer_name: string
  rating: number
  comment: string | null
  is_approved: boolean
  created_at: string
}

export interface Setting {
  id: string
  key: string
  value: string
  updated_at: string
}

export type SettingsMap = {
  whatsapp_number: string
  vodafone_cash_number: string
  store_name: string
  store_description: string
}
