import * as z from 'zod'

export const TaxBracket = z.object({
  min: z.number(),
  max: z.number().optional(),
  rate: z.number(),
})

export const TaxYearError = z.object({
  code: z.string(),
  field: z.string(),
  message: z.string(),
})

export const TaxYearData = z.object({
  tax_brackets: z.array(TaxBracket).optional(),
  errors: z.array(TaxYearError).optional()
})

export type TaxBracket = z.infer<typeof TaxBracket>
export type TaxYearError = z.infer<typeof TaxYearError>
export type TaxYearData = z.infer<typeof TaxYearData>

export type TaxBracketResult = {
  min: number
  max?: number
  salary: number
  total: number
  rate: number
}

export type TaxTable = {
  salary: number
  rows: Array<TaxBracketResult>
}
