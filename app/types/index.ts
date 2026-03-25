export type TaxBracket = {
  min: number
  max?: number
  rate: number
}

export type TaxYearError = {
  code: string
  field: string
  message: string
}

export type TaxYearData = {
  tax_brackets?: TaxBracket[]
  errors?: TaxYearError[]
}

export type TaxBracketResult = {
  min: number
  max?: number
  salary: number
  total: number
}

export type TaxTable = {
  salary: number
  rows: Array<TaxBracketResult>
}
