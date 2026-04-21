export function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '')
  const full = clean.length === 3
    ? clean.split('').map(c => c + c).join('')
    : clean
  const n = parseInt(full, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  if (max === min) return [0, 0, l]
  const d = max - min
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
  let h = 0
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6
  else if (max === g) h = ((b - r) / d + 2) / 6
  else h = ((r - g) / d + 4) / 6
  return [h * 360, s, l]
}

export function colorHarmonyScore(hexColors: string[]): number {
  const validColors = hexColors.filter(Boolean)
  if (validColors.length < 2) return 1

  const hsls = validColors.map(hex => {
    const [r, g, b] = hexToRgb(hex)
    return rgbToHsl(r, g, b)
  })

  const nonNeutrals = hsls.filter(([, s]) => s > 0.15)
  if (nonNeutrals.length < 2) return 1

  let totalScore = 0
  let pairs = 0
  for (let i = 0; i < nonNeutrals.length; i++) {
    for (let j = i + 1; j < nonNeutrals.length; j++) {
      const diff = Math.abs(nonNeutrals[i][0] - nonNeutrals[j][0])
      const hueDist = Math.min(diff, 360 - diff)
      // Analogous (< 30°) or complementary (~180°) score high
      if (hueDist < 30) totalScore += 1
      else if (hueDist > 150 && hueDist < 210) totalScore += 0.8
      else if (hueDist > 240 && hueDist < 300) totalScore += 0.6
      else totalScore += 0.3
      pairs++
    }
  }
  return pairs > 0 ? totalScore / pairs : 1
}

export function darkenHex(hex: string, amount: number): string {
  const [r, g, b] = hexToRgb(hex)
  const factor = 1 - amount
  const dr = Math.round(r * factor)
  const dg = Math.round(g * factor)
  const db = Math.round(b * factor)
  return `#${[dr, dg, db].map(v => v.toString(16).padStart(2, '0')).join('')}`
}

export function hexToRgbString(hex: string): string {
  const [r, g, b] = hexToRgb(hex)
  return `${r} ${g} ${b}`
}

export async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const MAX_W = 600
        const MAX_H = 800
        let { width, height } = img
        if (width > MAX_W || height > MAX_H) {
          const ratio = Math.min(MAX_W / width, MAX_H / height)
          width = Math.round(width * ratio)
          height = Math.round(height * ratio)
        }
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) { reject(new Error('No canvas context')); return }
        ctx.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL('image/jpeg', 0.75))
      }
      img.onerror = reject
      img.src = e.target?.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
