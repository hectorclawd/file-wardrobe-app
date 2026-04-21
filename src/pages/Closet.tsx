import { useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Shirt, LayoutGrid, FolderOpen, ImageIcon, UploadCloud } from 'lucide-react'
import { useWardrobeStore } from '@/store/wardrobeStore'
import { Topbar } from '@/components/layout/Topbar'
import { StatCard } from '@/components/ui/StatCard'
import { FilterChip } from '@/components/ui/FilterChip'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { ClosetGrid } from '@/components/closet/ClosetGrid'
import { CATEGORIES, OCCASIONS, type Category, type Occasion } from '@/types'
import { compressImage } from '@/utils/colorUtils'

const ALL_FILTER = 'All'

export function Closet() {
  const { getActiveProfile, addClothingItem, removeClothingItem } = useWardrobeStore()
  const profile = getActiveProfile()

  const [filter, setFilter] = useState<Category | typeof ALL_FILTER>(ALL_FILTER)
  const [showAdd, setShowAdd] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const [form, setForm] = useState({
    name: '',
    category: '' as Category | '',
    occasion: '' as Occasion | '',
    color: '',
    imgSrc: null as string | null,
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  const filteredItems = profile?.clothes.filter(
    item => filter === ALL_FILTER || item.category === filter
  ) ?? []

  const uniqueCategories = profile ? [...new Set(profile.clothes.map(c => c.category))] : []

  const handleFile = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) return
    try {
      const compressed = await compressImage(file)
      setForm(f => ({ ...f, imgSrc: compressed }))
    } catch {
      const reader = new FileReader()
      reader.onload = e => setForm(f => ({ ...f, imgSrc: e.target?.result as string }))
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
    if (!profile || !form.name || !form.category || !form.occasion) return
    addClothingItem(profile.id, {
      name: form.name,
      category: form.category as Category,
      occasion: form.occasion as Occasion,
      color: form.color || '#888888',
      imgSrc: form.imgSrc,
    })
    setForm({ name: '', category: '', occasion: '', color: '', imgSrc: null })
    setShowAdd(false)
  }

  const handleDelete = (itemId: string) => {
    if (!profile) return
    removeClothingItem(profile.id, itemId)
  }

  const resetAndOpenAdd = () => {
    setForm({ name: '', category: '', occasion: '', color: '', imgSrc: null })
    setShowAdd(true)
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <Topbar
        title="My Closet"
        actions={
          <Button onClick={resetAndOpenAdd} size="sm">
            + Add Piece
          </Button>
        }
      />

      <div className="px-6 md:px-8 py-6 space-y-7 pb-24 md:pb-10">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard value={profile?.clothes.length ?? 0} label="Pieces" icon={<Shirt size={18} />} />
          <StatCard value={profile?.outfits.length ?? 0} label="Outfits" icon={<LayoutGrid size={18} />} />
          <StatCard value={uniqueCategories.length} label="Categories" icon={<FolderOpen size={18} />} />
          <StatCard value={profile?.inspo.length ?? 0} label="Inspo Photos" icon={<ImageIcon size={18} />} />
        </div>

        {/* Filters */}
        <div className="flex gap-2 flex-wrap">
          <FilterChip
            label="All"
            active={filter === ALL_FILTER}
            onClick={() => setFilter(ALL_FILTER)}
          />
          {CATEGORIES.map(cat => (
            <FilterChip
              key={cat}
              label={cat}
              active={filter === cat}
              onClick={() => setFilter(cat)}
            />
          ))}
        </div>

        {/* Grid */}
        <ClosetGrid
          items={filteredItems}
          filterKey={filter}
          onAdd={resetAndOpenAdd}
          onDelete={handleDelete}
        />
      </div>

      {/* Add Piece Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add a Piece" size="md">
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
            style={{ minHeight: form.imgSrc ? 'auto' : 120 }}
          >
            {form.imgSrc ? (
              <div className="flex flex-col items-center gap-2">
                <img
                  src={form.imgSrc}
                  alt="Preview"
                  className="w-24 h-32 object-cover rounded-md"
                />
                <span className="font-body text-xs text-muted">Click to change</span>
              </div>
            ) : (
              <>
                <UploadCloud size={24} className="text-muted" />
                <p className="font-body text-xs text-muted text-center">
                  Click to upload or drag & drop
                </p>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
            />
          </div>

          {/* Fields */}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="font-body text-xs text-muted uppercase tracking-wide block mb-1.5">Name *</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. White linen shirt"
                className="w-full px-4 py-2.5 rounded-md bg-surface border border-[var(--border)] font-body text-sm text-ink placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="font-body text-xs text-muted uppercase tracking-wide block mb-1.5">Category *</label>
              <select
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value as Category }))}
                className="w-full px-4 py-2.5 rounded-md bg-surface border border-[var(--border)] font-body text-sm text-ink focus:outline-none focus:border-accent transition-colors"
              >
                <option value="">Select...</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="font-body text-xs text-muted uppercase tracking-wide block mb-1.5">Occasion *</label>
              <select
                value={form.occasion}
                onChange={e => setForm(f => ({ ...f, occasion: e.target.value as Occasion }))}
                className="w-full px-4 py-2.5 rounded-md bg-surface border border-[var(--border)] font-body text-sm text-ink focus:outline-none focus:border-accent transition-colors"
              >
                <option value="">Select...</option>
                {OCCASIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="font-body text-xs text-muted uppercase tracking-wide block mb-1.5">Color (hex or name)</label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={form.color || '#888888'}
                  onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                  className="w-9 h-9 rounded cursor-pointer border border-[var(--border)] p-0.5 bg-transparent"
                />
                <input
                  type="text"
                  value={form.color}
                  onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
                  placeholder="#C4956A or Sand"
                  className="flex-1 px-4 py-2.5 rounded-md bg-surface border border-[var(--border)] font-body text-sm text-ink placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={!form.name || !form.category || !form.occasion}
            fullWidth
          >
            Add to Closet
          </Button>
        </div>
      </Modal>
    </div>
  )
}
