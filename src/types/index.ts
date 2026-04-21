export type Category = 'Tops' | 'Bottoms' | 'Dresses' | 'Outerwear' | 'Shoes' | 'Accessories'
export type Occasion = 'Casual' | 'Work' | 'Night Out' | 'Formal' | 'Sport' | 'Date Night' | 'All occasions'

export interface ClothingItem {
  id: string
  name: string
  category: Category
  occasion: Occasion
  color: string
  imgSrc: string | null
  addedAt: number
}

export interface Outfit {
  id: string
  label: string
  pieces: ClothingItem[]
  occasion: string
  createdAt: number
  fromInspo: boolean
}

export interface InspoPhoto {
  id: string
  imgSrc: string
  note: string
  addedAt: number
}

export interface UserProfile {
  id: string
  name: string
  accentColor: string
  accentRgb: string
  clothes: ClothingItem[]
  outfits: Outfit[]
  inspo: InspoPhoto[]
}

export const CATEGORIES: Category[] = ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories']
export const OCCASIONS: Occasion[] = ['Casual', 'Work', 'Night Out', 'Formal', 'Sport', 'Date Night', 'All occasions']

export const CATEGORY_EMOJIS: Record<Category, string> = {
  Tops: '👕',
  Bottoms: '👖',
  Dresses: '👗',
  Outerwear: '🧥',
  Shoes: '👟',
  Accessories: '👜',
}

export const OCCASION_COLORS: Record<Occasion, string> = {
  'Casual':        '#6B9E7A',
  'Work':          '#5C8FAB',
  'Night Out':     '#8B7BAB',
  'Formal':        '#1C1A17',
  'Sport':         '#C4607A',
  'Date Night':    '#C4956A',
  'All occasions': '#7A7570',
}

export const PROFILE_COLORS: Record<string, { hex: string; rgb: string }> = {
  'profile-1': { hex: '#5C8FAB', rgb: '92 143 171' },
  'profile-2': { hex: '#C4607A', rgb: '196 96 122' },
  'profile-3': { hex: '#8B7BAB', rgb: '139 123 171' },
  'profile-4': { hex: '#6B9E7A', rgb: '107 158 122' },
}
