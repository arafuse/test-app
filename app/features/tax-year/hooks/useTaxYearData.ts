import { create } from 'zustand'

type TaxBracket = {
  min: number
  max?: number
  rate: number
}

type TaxYearError = {
  code: string
  field: string
  message: string
}

type TaxYearData = {
  tax_brackets?: TaxBracket[]
  errors?: TaxYearError[]
}

type TaxYearDataStore = {
  data: TaxYearData | null
  setData: (data: TaxYearData) => void
}

export const useTaxYearData = create<TaxYearDataStore>((set) => ({
  data: null,
  setData: (data) => set({ data }),
}))
