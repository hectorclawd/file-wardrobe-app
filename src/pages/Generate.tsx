import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useWardrobeStore } from '@/store/wardrobeStore'
import { Topbar } from '@/components/layout/Topbar'
import { OccasionSelector } from '@/components/generate/OccasionSelector'
import { GeneratedOutfitCard } from '@/components/generate/GeneratedOutfitCard'
import { ManualPicker } from '@/components/generate/ManualPicker'
import { Button } from '@/components/ui/Button'
import { generateOutfit } from '@/utils/outfitGenerator'
import type { Occasion, ClothingItem } from '@/types'

type GeneratedResult = {
  pieces: ClothingItem[]
  rationale: string
  occasion: string
}

export function Generate() {
  const { getActiveProfile, addOutfit } = useWardrobeStore()
  const profile = getActiveProfile()

  const [selectedOccasion, setSelectedOccasion] = useState<Occasion | null>(null)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<GeneratedResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [savedMsg, setSavedMsg] = useState(false)

  // Manual picker
  const [manualSelected, setManualSelected] = useState<string[]>([])
  const [manualResult, setManualResult] = useState<GeneratedResult | null>(null)

  const runGeneration = async (occasion: Occasion, locked: ClothingItem[] = [], fromInspo: boolean = false) => {
    if (!profile) return
    setLoading(true)
    setResult(null)
    setError(null)
    setProgress(0)

    // Animated progress
    const interval = setInterval(() => {
      setProgress(p => Math.min(p + 8, 90))
    }, 120)

    await new Promise(r => setTimeout(r, 1500))
    clearInterval(interval)
    setProgress(100)

    const gen = generateOutfit(profile.clothes, occasion, locked)
    if (gen.error === 'not-enough-items') {
      setError('Add more pieces to your closet to generate this outfit.')
      setLoading(false)
      setProgress(0)
      return
    }

    await new Promise(r => setTimeout(r, 200))
    setResult({
      pieces: gen.pieces,
      rationale: gen.rationale + (fromInspo && profile.inspo.length > 0 ? ' Inspired by your mood board.' : ''),
      occasion,
    })
    setLoading(false)
    setProgress(0)
  }

  const handleGenerate = () => {
    if (!selectedOccasion) return
    runGeneration(selectedOccasion)
  }

  const handleInspoGenerate = () => {
    if (!selectedOccasion) return
    runGeneration(selectedOccasion, [], true)
  }

  const handleSave = (res: GeneratedResult) => {
    if (!profile) return
    addOutfit(profile.id, {
      label: `${res.occasion} Look`,
      pieces: res.pieces,
      occasion: res.occasion,
      fromInspo: false,
    })
    setSavedMsg(true)
    setTimeout(() => setSavedMsg(false), 2000)
  }

  const handleManualToggle = (id: string) => {
    setManualSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  const handleManualComplete = () => {
    if (!profile || manualSelected.length === 0) return
    const locked = profile.clothes.filter(c => manualSelected.includes(c.id))
    const occ = locked[0]?.occasion !== 'All occasions' ? locked[0]?.occasion as Occasion : 'Casual'
    const gen = generateOutfit(profile.clothes, occ, locked)
    if (gen.pieces.length > 0) {
      setManualResult({ pieces: gen.pieces, rationale: gen.rationale, occasion: occ })
    }
  }

  return (
    <motion.div
      className="flex-1 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Topbar title="AI Generate" />

      <div className="px-6 md:px-8 py-6 pb-24 md:pb-10 space-y-8 max-w-2xl">
        {/* Section 1 — Auto Generate */}
        <section className="space-y-5">
          <div>
            <h2 className="font-display text-xl font-medium text-ink">Generate Automatically</h2>
            <p className="font-body text-xs text-muted mt-1">Select an occasion and let Filé build a look</p>
          </div>

          <OccasionSelector selected={selectedOccasion} onSelect={setSelectedOccasion} />

          <div className="flex gap-3">
            <Button
              onClick={handleGenerate}
              disabled={!selectedOccasion || loading}
              size="md"
            >
              Generate Outfit
            </Button>
            {profile && profile.inspo.length > 0 && (
              <Button
                onClick={handleInspoGenerate}
                disabled={!selectedOccasion || loading}
                variant="secondary"
                size="md"
              >
                Based on Inspo Style
              </Button>
            )}
          </div>

          {/* Loading bar */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-2"
              >
                <p className="font-body text-xs text-muted">Styling your look...</p>
                <div className="h-1 bg-surface rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: 'var(--accent)' }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.15 }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          {error && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="font-body text-sm text-muted bg-surface rounded-md px-4 py-3"
            >
              {error}
            </motion.p>
          )}

          {/* Result */}
          <AnimatePresence mode="wait">
            {result && (
              <div className="space-y-2">
                <GeneratedOutfitCard
                  pieces={result.pieces}
                  rationale={result.rationale}
                  occasion={result.occasion}
                  onSave={() => handleSave(result)}
                  onRegenerate={() => selectedOccasion && runGeneration(selectedOccasion)}
                />
                {savedMsg && (
                  <motion.p
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="font-body text-xs text-accent text-center"
                  >
                    Outfit saved! ✓
                  </motion.p>
                )}
              </div>
            )}
          </AnimatePresence>
        </section>

        {/* Divider */}
        <div className="h-px bg-[var(--border)]" />

        {/* Section 2 — Build Your Own */}
        <section className="space-y-4">
          <div>
            <h2 className="font-display text-xl font-medium text-ink">Build Your Own</h2>
            <p className="font-body text-xs text-muted mt-1">Pick pieces and let Filé complete the look</p>
          </div>

          <ManualPicker
            items={profile?.clothes ?? []}
            selected={manualSelected}
            onToggle={handleManualToggle}
            onComplete={handleManualComplete}
          />

          <AnimatePresence mode="wait">
            {manualResult && (
              <div className="space-y-2">
                <GeneratedOutfitCard
                  pieces={manualResult.pieces}
                  rationale={manualResult.rationale}
                  occasion={manualResult.occasion}
                  onSave={() => handleSave(manualResult)}
                  onRegenerate={handleManualComplete}
                />
              </div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </motion.div>
  )
}
