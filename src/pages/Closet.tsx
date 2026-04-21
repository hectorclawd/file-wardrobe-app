import { useState, useRef, useCallback } from 'react'
import { Shirt, LayoutGrid, FolderOpen, ImageIcon, UploadCloud, Plus, X } from 'lucide-react'
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

interface PieceRow {
  id: string
  name: string
  category: Category | ''
  occasion: Occasion | ''
  color: string
}

function emptyRow(): PieceRow {
  return { id: crypto.randomUUID(), name: '', category: '', occasion: '', color: '' }
}

export function Closet() {
  const { getActiveProfile, addClothingItem, removeClothingItem } = useWardrobeStore()
  const profile = getActiveProfile()

  const [filter, setFilter] = useState<Category | typeof ALL_FILTER>(ALL_FILTER)

  // Single piece modal
  const [showAdd, setShowAdd] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [form, setForm] = useState({ name: '', category: '' as Category | '', occasion: '' as Occasion | '', color: '', imgSrc: null as string | null })
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Full outfit modal
  const [showOutfit, setShowOutfit] = useState(false)
  const [outfitPhoto, setOutfitPhoto] = useState<string | null>(null)
  const [outfitDragging, setOutfitDragging] = useState(false)
  const [pieces, setPieces] = useState<PieceRow[]>([emptyRow(), emptyRow()])
  const outfitFileRef = useRef<HTMLInputElement>(null)

  const filteredItems = profile?.clothes.filter(
    item => filter === ALL_FILTER || item.category === filter
  ) ?? []
  const uniqueCategories = profile ? [...new Set(profile.clothes.map(c => c.category))] : []

  // ── Single piece handlers ──────────────────────────────────────────────────
  const handleFile = useCallback(async (file: File, setter: (s: string) => void) => {
    if (!file.type.startsWith('image/')) return
    try { setter(await compressImage(file)) }
    catch { const r = new FileReader(); r.onload = e => setter(e.target?.result as string); r.readAsDataURL(file) }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false)
    const f = e.dataTransfer.files[0]; if (f) handleFile(f, s => setForm(p => ({ ...p, imgSrc: s })))
  }, [handleFile])

  const handleSave = () => {
    if (!profile || !form.name || !form.category || !form.occasion) return
    addClothingItem(profile.id, { name: form.name, category: form.category as Category, occasion: form.occasion as Occasion, color: form.color || '#888888', imgSrc: form.imgSrc })
    setForm({ name: '', category: '', occasion: '', color: '', imgSrc: null })
    setShowAdd(false)
  }

  // ── Full outfit handlers ───────────────────────────────────────────────────
  const handleOutfitDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setOutfitDragging(false)
    const f = e.dataTransfer.files[0]; if (f) handleFile(f, setOutfitPhoto)
  }, [handleFile])

  const updatePiece = (id: string, field: keyof PieceRow, value: string) => {
    setPieces(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p))
  }

  const handleSaveOutfit = () => {
    if (!profile) return
    const valid = pieces.filter(p => p.name && p.category && p.occasion)
    valid.forEach(p => {
      addClothingItem(profile.id, {
        name: p.name,
        category: p.category as Category,
        occasion: p.occasion as Occasion,
        color: p.color || '#888888',
        imgSrc: outfitPhoto,
      })
    })
    setOutfitPhoto(null)
    setPieces([emptyRow(), emptyRow()])
    setShowOutfit(false)
  }

  const validPieceCount = pieces.filter(p => p.name && p.category && p.occasion).length

  const inputCls = 'w-full px-3 py-2 rounded-md bg-surface border border-[var(--border)] font-body text-sm text-ink placeholder:text-muted focus:outline-none focus:border-accent transition-colors'
  const labelCls = 'font-body text-xs text-muted uppercase tracking-wide block mb-1.5'

  return (
    <div className="flex-1 overflow-y-auto">
      <Topbar
        title="My Closet"
        actions={
          <div className="flex gap-2">
            <Button onClick={() => { setOutfitPhoto(null); setPieces([emptyRow(), emptyRow()]); setShowOutfit(true) }} variant="secondary" size="sm">
              Upload Outfit
            </Button>
            <Button onClick={() => { setForm({ name: '', category: '', occasion: '', color: '', imgSrc: null }); setShowAdd(true) }} size="sm">
              + Add Piece
            </Button>
          </div>
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
          <FilterChip label="All" active={filter === ALL_FILTER} onClick={() => setFilter(ALL_FILTER)} />
          {CATEGORIES.map(cat => (
            <FilterChip key={cat} label={cat} active={filter === cat} onClick={() => setFilter(cat)} />
          ))}
        </div>

        {/* Grid */}
        <ClosetGrid
          items={filteredItems}
          filterKey={filter}
          onAdd={() => { setForm({ name: '', category: '', occasion: '', color: '', imgSrc: null }); setShowAdd(true) }}
          onDelete={id => profile && removeClothingItem(profile.id, id)}
        />
      </div>

      {/* ── Add Single Piece Modal ─────────────────────────────────────────── */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add a Piece" size="md">
        <div className="p-6 space-y-4">
          <div
            onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
            onDragEnter={() => setIsDragging(true)}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`rounded-md border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-2 py-6 ${isDragging ? 'border-accent bg-accent-light' : 'border-[var(--border)] hover:border-accent bg-surface'}`}
            style={{ minHeight: form.imgSrc ? 'auto' : 120 }}
          >
            {form.imgSrc
              ? <div className="flex flex-col items-center gap-2"><img src={form.imgSrc} alt="Preview" className="w-24 h-32 object-cover rounded-md" /><span className="font-body text-xs text-muted">Click to change</span></div>
              : <><UploadCloud size={24} className="text-muted" /><p className="font-body text-xs text-muted text-center">Click to upload or drag & drop</p></>
            }
            <input ref={fileInputRef} type="file" accept="image/*" className="sr-only" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f, s => setForm(p => ({ ...p, imgSrc: s }))) }} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className={labelCls}>Name *</label>
              <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. White linen shirt" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Category *</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as Category }))} className={inputCls}>
                <option value="">Select...</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>Occasion *</label>
              <select value={form.occasion} onChange={e => setForm(f => ({ ...f, occasion: e.target.value as Occasion }))} className={inputCls}>
                <option value="">Select...</option>
                {OCCASIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className={labelCls}>Color</label>
              <div className="flex gap-2 items-center">
                <input type="color" value={form.color || '#888888'} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} className="w-9 h-9 rounded cursor-pointer border border-[var(--border)] p-0.5 bg-transparent" />
                <input type="text" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} placeholder="#C4956A or Sand" className={`${inputCls} flex-1`} />
              </div>
            </div>
          </div>
          <Button onClick={handleSave} disabled={!form.name || !form.category || !form.occasion} fullWidth>Add to Closet</Button>
        </div>
      </Modal>

      {/* ── Upload Full Outfit Modal ───────────────────────────────────────── */}
      <Modal open={showOutfit} onClose={() => setShowOutfit(false)} title="Upload Full Outfit" size="lg">
        <div className="p-6 space-y-5">
          <p className="font-body text-xs text-muted">Upload a photo of your full outfit, then identify each piece below. All pieces will be added to your closet using the outfit photo as reference.</p>

          {/* Outfit photo upload */}
          <div
            onDragOver={e => { e.preventDefault(); setOutfitDragging(true) }}
            onDragEnter={() => setOutfitDragging(true)}
            onDragLeave={() => setOutfitDragging(false)}
            onDrop={handleOutfitDrop}
            onClick={() => outfitFileRef.current?.click()}
            className={`rounded-md border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${outfitDragging ? 'border-accent bg-accent-light' : 'border-[var(--border)] hover:border-accent bg-surface'}`}
            style={{ minHeight: outfitPhoto ? 'auto' : 120, padding: outfitPhoto ? 0 : undefined }}
          >
            {outfitPhoto
              ? <img src={outfitPhoto} alt="Outfit" className="w-full max-h-64 object-contain rounded-md" />
              : <div className="flex flex-col items-center gap-2 py-6"><UploadCloud size={24} className="text-muted" /><p className="font-body text-xs text-muted">Upload outfit photo</p></div>
            }
            <input ref={outfitFileRef} type="file" accept="image/*" className="sr-only" onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f, setOutfitPhoto) }} />
          </div>

          {/* Piece rows */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-body text-sm font-medium text-ink">Identify the pieces</h3>
              <span className="font-body text-xs text-muted">{validPieceCount} piece{validPieceCount !== 1 ? 's' : ''} ready</span>
            </div>

            {pieces.map((piece, i) => (
              <div key={piece.id} className="bg-surface rounded-md p-3 space-y-2.5 relative">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-body text-xs font-medium text-muted uppercase tracking-wide">Piece {i + 1}</span>
                  {pieces.length > 1 && (
                    <button onClick={() => setPieces(prev => prev.filter(p => p.id !== piece.id))} className="text-muted hover:text-ink transition-colors cursor-pointer" aria-label="Remove piece">
                      <X size={14} />
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={piece.name}
                  onChange={e => updatePiece(piece.id, 'name', e.target.value)}
                  placeholder={`e.g. ${['White shirt', 'Black jeans', 'Leather boots', 'Blazer'][i % 4]}`}
                  className={inputCls}
                />
                <div className="grid grid-cols-2 gap-2">
                  <select value={piece.category} onChange={e => updatePiece(piece.id, 'category', e.target.value)} className={inputCls}>
                    <option value="">Category...</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <select value={piece.occasion} onChange={e => updatePiece(piece.id, 'occasion', e.target.value)} className={inputCls}>
                    <option value="">Occasion...</option>
                    {OCCASIONS.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                </div>
                <div className="flex gap-2 items-center">
                  <input type="color" value={piece.color || '#888888'} onChange={e => updatePiece(piece.id, 'color', e.target.value)} className="w-8 h-8 rounded cursor-pointer border border-[var(--border)] p-0.5 bg-transparent flex-shrink-0" />
                  <input type="text" value={piece.color} onChange={e => updatePiece(piece.id, 'color', e.target.value)} placeholder="Color (optional)" className={`${inputCls} flex-1`} />
                </div>
              </div>
            ))}

            <button
              onClick={() => setPieces(prev => [...prev, emptyRow()])}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md border border-dashed border-[var(--border)] hover:border-accent text-muted hover:text-accent font-body text-xs font-medium transition-colors cursor-pointer"
            >
              <Plus size={13} /> Add another piece
            </button>
          </div>

          <Button onClick={handleSaveOutfit} disabled={validPieceCount === 0} fullWidth>
            Save {validPieceCount > 0 ? `${validPieceCount} piece${validPieceCount !== 1 ? 's' : ''}` : 'pieces'} to Closet
          </Button>
        </div>
      </Modal>
    </div>
  )
}
