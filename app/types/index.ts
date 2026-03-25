export type TaxBracket = {
  min: number
  max?: number
  rate: number
}

export type TaxBracketResult = {
    min: number
    max?: number
    salary: number
    total: number  
}