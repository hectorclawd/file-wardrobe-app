import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { ImageIcon, UploadCloud } from 'lucide-react'
import { useWardrobeStore } from '@/store/wardrobeStore'
import { Topbar } from '@/components/layout/Topbar'
import { InspoGrid } from '@/components/inspo/InspoGrid'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { compressImage } from '@/utils/colorUtils'

export function Inspo() {
  const { getActiveProfile, addInspoPhoto, removeInspoPhoto } = useWardrobeStore()
  const profile = getActiveProfile()

  const [showAdd, setShowAdd] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [imgSrc, setImgSrc] = useState<string | null>(null)
  const [note, setNote] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return
    try {
      const compressed = await compressImage(file)
      setImgSrc(compressed)
    } catch {
      const reader = new FileReader()
      reader.onload = e => setImgSrc(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleSave = () => {
    if (!profile || !imgSrc) return
    addInspoPhoto(profile.id, { imgSrc, note })
    setImgSrc(null)
    setNote('')
    setShowAdd(false)
  }

  const openAdd = () => {
    setImgSrc(null)
    setNote('')
    setShowAdd(true)
  }

  return (
    <motion.div
      className="flex-1 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Topbar
        title="Inspiration"
        actions={
          <Button onClick={openAdd} size="sm">
            + Add Inspo
          </Button>
        }
      />

      <div className="px-6 md:px-8 py-6 pb-24 md:pb-10 space-y-6">
        {/* Intro */}
        <div className="flex items-start gap-3 bg-accent-light rounded-md px-4 py-3">
          <ImageIcon size={16} className="text-accent mt-0.5 flex-shrink-0" />
          <p className="font-body text-xs text-muted leading-relaxed">
            Save style photos that inspire you. Your inspiration board informs the AI when generating outfit suggestions based on your style.
          </p>
        </div>

        <InspoGrid
          photos={profile?.inspo ?? []}
          onDelete={(id) => profile && removeInspoPhoto(profile.id, id)}
          onAdd={openAdd}
        />
      </div>

      {/* Add Inspo Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Inspiration">
        <div className="p-6 space-y-4">
          {/* Upload zone */}
          <div
            onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
            onDragEnter={() => setIsDragging(true)}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative rounded-md border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-2 py-6 ${
              isDragging ? 'border-accent bg-accent-light' : 'border-[var(--border)] hover:border-accent bg-surface'
            }`}
            style={{ minHeight: imgSrc ? 'auto' : 140 }}
          >
            {imgSrc ? (
              <div className="flex flex-col items-center gap-2">
                <img src={imgSrc} alt="Preview" className="w-32 object-cover rounded-md" style={{ maxHeight: 180 }} />
                <span className="font-body text-xs text-muted">Click to change</span>
              </div>
            ) : (
              <>
                <UploadCloud size={28} className="text-muted" />
                <p className="font-body text-xs text-muted text-center">Click to upload or drag & drop</p>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="sr-only"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
            />
          </div>

          {/* Note */}
          <div>
            <label className="font-body text-xs text-muted uppercase tracking-wide block mb-1.5">
              Style Notes (optional)
            </label>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="e.g. Love the oversized blazer + loafers combo..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-md bg-surface border border-[var(--border)] font-body text-sm text-ink placeholder:text-muted focus:outline-none focus:border-accent transition-colors resize-none"
            />
          </div>

          <Button onClick={handleSave} disabled={!imgSrc} fullWidth>
            Add to Inspiration Board
          </Button>
        </div>
      </Modal>
    </motion.div>
  )
}
