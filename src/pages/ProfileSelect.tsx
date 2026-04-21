import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Check } from 'lucide-react'
import { useWardrobeStore } from '@/store/wardrobeStore'
import { ProfileCard } from '@/components/layout/ProfileCard'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { gridContainer as container, cardVariant } from '@/utils/animations'

export function ProfileSelect() {
  const navigate = useNavigate()
  const { profiles, addProfile, updateProfileName, setActiveProfile } = useWardrobeStore()

  const [newName, setNewName] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editNames, setEditNames] = useState<Record<string, string>>({})

  const handleSelect = (id: string) => {
    setActiveProfile(id)
    navigate('/closet')
  }

  const handleAdd = () => {
    const trimmed = newName.trim()
    if (!trimmed) return
    addProfile(trimmed)
    setNewName('')
    setShowAddModal(false)
  }

  const handleEditOpen = () => {
    const names: Record<string, string> = {}
    profiles.forEach(p => { names[p.id] = p.name })
    setEditNames(names)
    setShowEditModal(true)
  }

  const handleEditSave = () => {
    Object.entries(editNames).forEach(([id, name]) => {
      if (name.trim()) updateProfileName(id, name.trim())
    })
    setShowEditModal(false)
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6 py-12">
      {/* Logo + tagline */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-center mb-14"
      >
        <h1 className="font-display text-7xl font-semibold text-ink tracking-tight">
          Fil<span style={{ color: 'var(--accent)' }}>é</span>
        </h1>
        <p className="font-body text-sm text-muted mt-3 tracking-wide">
          whose closet are we styling today?
        </p>
      </motion.div>

      {/* Profile cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-wrap justify-center gap-5"
      >
        <AnimatePresence>
          {profiles.map(profile => (
            <motion.div key={profile.id} variants={cardVariant} layout>
              <ProfileCard profile={profile} onClick={() => handleSelect(profile.id)} />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Add profile */}
        {profiles.length < 4 && (
          <motion.div variants={cardVariant}>
            <motion.button
              onClick={() => setShowAddModal(true)}
              whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(28,26,23,0.1)' }}
              whileTap={{ scale: 0.97 }}
              className="flex flex-col items-center justify-center gap-3 w-40 p-6 rounded-lg border-2 border-dashed border-[var(--border)] hover:border-accent text-muted hover:text-accent transition-colors cursor-pointer"
              style={{ minHeight: 170 }}
            >
              <div className="w-12 h-12 rounded-full border border-current flex items-center justify-center">
                <Plus size={20} />
              </div>
              <span className="font-body text-xs font-medium">Add profile</span>
            </motion.button>
          </motion.div>
        )}
      </motion.div>

      {/* Edit names button */}
      {profiles.length > 0 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          onClick={handleEditOpen}
          className="mt-10 flex items-center gap-1.5 font-body text-xs text-muted hover:text-ink transition-colors cursor-pointer"
        >
          <Pencil size={12} />
          Edit names
        </motion.button>
      )}

      {/* Empty state */}
      {profiles.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="font-body text-xs text-muted mt-6"
        >
          Create your first profile to get started
        </motion.p>
      )}

      {/* Add Profile Modal */}
      <Modal open={showAddModal} onClose={() => setShowAddModal(false)} title="New Profile">
        <div className="p-6 space-y-4">
          <div>
            <label className="font-body text-xs text-muted uppercase tracking-wide block mb-2">Name</label>
            <input
              type="text"
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="e.g. Sofia"
              autoFocus
              maxLength={20}
              className="w-full px-4 py-2.5 rounded-md bg-surface border border-[var(--border)] font-body text-sm text-ink placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
            />
          </div>
          <Button onClick={handleAdd} disabled={!newName.trim()} fullWidth>
            Create Profile
          </Button>
        </div>
      </Modal>

      {/* Edit Names Modal */}
      <Modal open={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Names">
        <div className="p-6 space-y-3">
          {profiles.map(p => (
            <div key={p.id}>
              <label className="font-body text-xs text-muted uppercase tracking-wide block mb-1.5">
                <span className="inline-block w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: p.accentColor }} />
                Profile
              </label>
              <input
                type="text"
                value={editNames[p.id] ?? ''}
                onChange={e => setEditNames(prev => ({ ...prev, [p.id]: e.target.value }))}
                maxLength={20}
                className="w-full px-4 py-2.5 rounded-md bg-surface border border-[var(--border)] font-body text-sm text-ink focus:outline-none focus:border-accent transition-colors"
              />
            </div>
          ))}
          <div className="pt-2">
            <Button onClick={handleEditSave} fullWidth className="gap-2">
              <Check size={14} />
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
