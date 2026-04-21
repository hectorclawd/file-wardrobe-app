import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useWardrobeStore } from '@/store/wardrobeStore'
import { Topbar } from '@/components/layout/Topbar'
import { OutfitGrid } from '@/components/outfits/OutfitGrid'
import { Button } from '@/components/ui/Button'

export function Outfits() {
  const navigate = useNavigate()
  const { getActiveProfile, removeOutfit } = useWardrobeStore()
  const profile = getActiveProfile()

  const handleDelete = (outfitId: string) => {
    if (!profile) return
    removeOutfit(profile.id, outfitId)
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
        title="Outfits"
        actions={
          <Button onClick={() => navigate('/generate')} size="sm">
            Generate ✨
          </Button>
        }
      />

      <div className="px-6 md:px-8 py-6 pb-24 md:pb-10">
        <OutfitGrid
          outfits={profile?.outfits ?? []}
          onDelete={handleDelete}
          onGenerateCTA={() => navigate('/generate')}
        />
      </div>
    </motion.div>
  )
}
