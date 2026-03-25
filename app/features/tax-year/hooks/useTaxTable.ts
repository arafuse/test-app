import { create } from 'zustand'
import type { TaxBracket, TaxTable } from '~/types'
import { taxResultsFrom } from '../utils/taxResultsFrom'

type TaxTableStore = TaxTable & {
  setRows: (salary: number, brackets: Array<TaxBracket>) => void
}

export const useTaxTable = create<TaxTableStore>(set => ({
  rows: [],
  setRows: (salary, brackets) =>
    set({ rows: taxResultsFrom(salary, brackets) }),
}))
