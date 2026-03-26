import type { TaxBracket, TaxBracketResult } from '~/types'

export function taxResultsFrom(
  salary: number,
  brackets: Array<TaxBracket>,
): Array<TaxBracketResult> {
  return brackets.map(({ min, max, rate }) => {
    const portion = Math.min(salary, max ?? salary)
    const bracketSalary = Math.max(0, portion - min)

    return {
      min,
      max,
      salary: bracketSalary,
      total: bracketSalary * rate,
      rate: rate
    }
  })
}
