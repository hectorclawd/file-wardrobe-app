import type { ClothingItem, Outfit } from '@/types'
import { colorHarmonyScore } from './colorUtils'

export interface GeneratedResult {
  pieces: ClothingItem[]
  rationale: string
  occasion: string
  error?: string
}

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function maybeFrom<T>(arr: T[]): T | null {
  return arr.length > 0 ? randomFrom(arr) : null
}

const RATIONALE_TEMPLATES: Record<string, (pieces: ClothingItem[]) => string> = {
  'Casual': (p) => `An effortless everyday look. ${p[0]?.name ?? 'The top'} pairs beautifully${p[1] ? ` with ${p[1].name}` : ''} for a relaxed, put-together feel.`,
  'Work': (p) => `Polished and professional. ${p[0]?.name ?? 'The main piece'} reads authoritative without sacrificing comfort — perfect for the office.`,
  'Night Out': (p) => `High-impact after-dark dressing. ${p[0]?.name ?? 'This piece'} is the statement here${p[1] ? `, anchored by ${p[1].name}` : ''}.`,
  'Formal': (p) => `Classic and refined. This combination signals understated elegance — ${p[0]?.name ?? 'the anchor piece'} does the heavy lifting.`,
  'Sport': (p) => `Performance-ready and sharp. ${p[0]?.name ?? 'The top'} keeps you moving while ${p[1]?.name ?? 'the bottoms'} complete the athletic silhouette.`,
  'Date Night': (p) => `Effortlessly romantic. The interplay between ${p[0]?.name ?? 'your pieces'} and ${p[1]?.name ?? 'the finishing touch'} strikes just the right note.`,
}

function buildOutfit(
  slots: Record<string, ClothingItem[]>,
  eligible: ClothingItem[],
  lockedPieces: ClothingItem[]
): ClothingItem[] {
  const locked = new Set(lockedPieces.map(p => p.id))

  const useDress = slots.dress.length > 0 && Math.random() < 0.4

  let picked: (ClothingItem | null)[] = []

  if (useDress) {
    const dress = lockedPieces.find(p => p.category === 'Dresses') ?? maybeFrom(slots.dress.filter(p => !locked.has(p.id)))
    const outer = lockedPieces.find(p => p.category === 'Outerwear') ?? maybeFrom(slots.outer.filter(p => !locked.has(p.id)))
    const shoes = lockedPieces.find(p => p.category === 'Shoes') ?? maybeFrom(slots.shoes.filter(p => !locked.has(p.id)))
    const accessory = lockedPieces.find(p => p.category === 'Accessories') ?? maybeFrom(slots.accessory.filter(p => !locked.has(p.id)))
    picked = [dress, outer, shoes, accessory]
  } else if (slots.top.length > 0 || lockedPieces.some(p => p.category === 'Tops')) {
    const top = lockedPieces.find(p => p.category === 'Tops') ?? maybeFrom(slots.top.filter(p => !locked.has(p.id)))
    const bottom = lockedPieces.find(p => p.category === 'Bottoms') ?? maybeFrom(slots.bottom.filter(p => !locked.has(p.id)))
    const outer = lockedPieces.find(p => p.category === 'Outerwear') ?? maybeFrom(slots.outer.filter(p => !locked.has(p.id)))
    const shoes = lockedPieces.find(p => p.category === 'Shoes') ?? maybeFrom(slots.shoes.filter(p => !locked.has(p.id)))
    picked = [top, bottom, outer, shoes]
  } else {
    const sample = eligible.filter(p => !locked.has(p.id)).slice(0, 4 - lockedPieces.length)
    picked = [...lockedPieces, ...sample]
  }

  const allPicked = [...lockedPieces, ...picked.filter((p): p is ClothingItem => p !== null && !locked.has(p.id))]
  const unique: ClothingItem[] = []
  const seen = new Set<string>()
  for (const p of allPicked) {
    if (!seen.has(p.id)) { seen.add(p.id); unique.push(p) }
  }
  return unique.slice(0, 4)
}

export function generateOutfit(
  clothes: ClothingItem[],
  occasion: string,
  lockedPieces: ClothingItem[] = []
): GeneratedResult {
  let eligible = clothes.filter(
    p => p.occasion === occasion || p.occasion === 'All occasions'
  )
  if (eligible.length + lockedPieces.length < 2) {
    eligible = clothes
  }
  if (eligible.length + lockedPieces.length < 1) {
    return { pieces: [], rationale: '', occasion, error: 'not-enough-items' }
  }

  const slots = {
    top:       eligible.filter(p => p.category === 'Tops'),
    bottom:    eligible.filter(p => p.category === 'Bottoms'),
    dress:     eligible.filter(p => p.category === 'Dresses'),
    outer:     eligible.filter(p => p.category === 'Outerwear'),
    shoes:     eligible.filter(p => p.category === 'Shoes'),
    accessory: eligible.filter(p => p.category === 'Accessories'),
  }

  let best: ClothingItem[] = []
  let bestScore = -1

  for (let attempt = 0; attempt < 3; attempt++) {
    const candidate = buildOutfit(slots, eligible, lockedPieces)
    const hexColors = candidate.map(p => p.color).filter(c => c.startsWith('#'))
    const score = colorHarmonyScore(hexColors)
    if (score > bestScore) {
      bestScore = score
      best = candidate
    }
    if (score >= 0.6) break
  }

  const template = RATIONALE_TEMPLATES[occasion]
  const rationale = template ? template(best) : `A well-balanced outfit for ${occasion} occasions. Each piece complements the next.`

  return { pieces: best, rationale, occasion }
}

export function generateOutfitObject(
  clothes: ClothingItem[],
  occasion: string,
  lockedPieces: ClothingItem[] = [],
  fromInspo = false
): Omit<Outfit, 'id' | 'createdAt'> {
  const result = generateOutfit(clothes, occasion, lockedPieces)
  return {
    label: `${occasion} Look`,
    pieces: result.pieces,
    occasion,
    fromInspo,
  }
}
