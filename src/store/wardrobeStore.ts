import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { UserProfile, ClothingItem, Outfit, InspoPhoto } from '@/types'
import { PROFILE_COLORS } from '@/types'

interface WardrobeState {
  profiles: UserProfile[]
  activeProfileId: string | null
  _hasHydrated: boolean

  // Selectors
  getActiveProfile: () => UserProfile | undefined

  // Hydration
  setHasHydrated: (val: boolean) => void

  // Profile actions
  addProfile: (name: string) => void
  updateProfileName: (id: string, name: string) => void
  setActiveProfile: (id: string) => void
  removeProfile: (id: string) => void

  // Clothes actions
  addClothingItem: (profileId: string, item: Omit<ClothingItem, 'id' | 'addedAt'>) => void
  removeClothingItem: (profileId: string, itemId: string) => void

  // Outfit actions
  addOutfit: (profileId: string, outfit: Omit<Outfit, 'id' | 'createdAt'>) => void
  removeOutfit: (profileId: string, outfitId: string) => void

  // Inspo actions
  addInspoPhoto: (profileId: string, photo: Omit<InspoPhoto, 'id' | 'addedAt'>) => void
  removeInspoPhoto: (profileId: string, photoId: string) => void
}

export const useWardrobeStore = create<WardrobeState>()(
  persist(
    (set, get) => ({
      profiles: [],
      activeProfileId: null,
      _hasHydrated: false,

      getActiveProfile: () => {
        const { profiles, activeProfileId } = get()
        return profiles.find(p => p.id === activeProfileId)
      },

      setHasHydrated: (val) => set({ _hasHydrated: val }),

      addProfile: (name) => {
        const { profiles } = get()
        if (profiles.length >= 4) return
        const slot = `profile-${(profiles.length % 4) + 1}`
        const color = PROFILE_COLORS[slot]
        const newProfile: UserProfile = {
          id: crypto.randomUUID(),
          name,
          accentColor: color.hex,
          accentRgb: color.rgb,
          clothes: [],
          outfits: [],
          inspo: [],
        }
        set({ profiles: [...profiles, newProfile] })
      },

      updateProfileName: (id, name) => {
        set(state => ({
          profiles: state.profiles.map(p => p.id === id ? { ...p, name } : p)
        }))
      },

      setActiveProfile: (id) => set({ activeProfileId: id }),

      removeProfile: (id) => {
        set(state => ({
          profiles: state.profiles.filter(p => p.id !== id),
          activeProfileId: state.activeProfileId === id ? null : state.activeProfileId,
        }))
      },

      addClothingItem: (profileId, item) => {
        set(state => ({
          profiles: state.profiles.map(p =>
            p.id === profileId
              ? { ...p, clothes: [...p.clothes, { ...item, id: crypto.randomUUID(), addedAt: Date.now() }] }
              : p
          )
        }))
      },

      removeClothingItem: (profileId, itemId) => {
        set(state => ({
          profiles: state.profiles.map(p =>
            p.id === profileId
              ? { ...p, clothes: p.clothes.filter(c => c.id !== itemId) }
              : p
          )
        }))
      },

      addOutfit: (profileId, outfit) => {
        set(state => ({
          profiles: state.profiles.map(p =>
            p.id === profileId
              ? { ...p, outfits: [...p.outfits, { ...outfit, id: crypto.randomUUID(), createdAt: Date.now() }] }
              : p
          )
        }))
      },

      removeOutfit: (profileId, outfitId) => {
        set(state => ({
          profiles: state.profiles.map(p =>
            p.id === profileId
              ? { ...p, outfits: p.outfits.filter(o => o.id !== outfitId) }
              : p
          )
        }))
      },

      addInspoPhoto: (profileId, photo) => {
        set(state => ({
          profiles: state.profiles.map(p =>
            p.id === profileId
              ? { ...p, inspo: [...p.inspo, { ...photo, id: crypto.randomUUID(), addedAt: Date.now() }] }
              : p
          )
        }))
      },

      removeInspoPhoto: (profileId, photoId) => {
        set(state => ({
          profiles: state.profiles.map(p =>
            p.id === profileId
              ? { ...p, inspo: p.inspo.filter(i => i.id !== photoId) }
              : p
          )
        }))
      },
    }),
    {
      name: 'filé-wardrobe',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) state.setHasHydrated(true)
      },
    }
  )
)
