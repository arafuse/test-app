import { create } from 'zustand'
import type { TaxYearData } from '~/types'

type TaxYearDataStore = {
  data: TaxYearData | null
  setData: (data: TaxYearData) => void
}

export const useTaxYearData = create<TaxYearDataStore>((set) => ({
  data: null,
  setData: (data) => set({ data }),
}))
