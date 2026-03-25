import { create } from 'zustand'
import type { TaxBracket, TaxTable } from '~/types'
import { taxResultsFrom } from '../utils/taxResultsFrom'

type TaxTableStore = TaxTable & {
  setRows: (salary: number, brackets: Array<TaxBracket>) => void
}

export const useTaxTable = create<TaxTableStore>(set => ({
  salary: 0,
  rows: [],
  setRows: (salary, brackets) =>
    set({ salary, rows: taxResultsFrom(salary, brackets) }),
}))
