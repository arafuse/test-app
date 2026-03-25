import { useEffect, useState } from 'react'
import type { TaxYearData } from '~/types'
import { useDebounce } from '~/hooks/useDebounce'
import { useTaxTable } from '../hooks/useTaxTable'
import { useTaxYearData } from '../hooks/useTaxYearData'

const API_ENDPOINT = 'http://localhost:5001/tax-calculator/tax-year'

export function TaxYearForm() {
  const [lastSubmittedTaxYear, setLastSubmittedTaxYear] = useState<
    string | null
  >(null)

  const taxYearData = useTaxYearData(state => state.data)
  const setTaxYearData = useTaxYearData(state => state.setData)
  const setTaxTableRows = useTaxTable(state => state.setRows)

  useEffect(() => {
    console.log(taxYearData)
  }, [taxYearData])

  async function updateTaxYearData(taxYear: string) {
    if (taxYear === lastSubmittedTaxYear) return

    const response = await fetch(`${API_ENDPOINT}/${taxYear}`)
    const data = (await response.json()) as TaxYearData // TODO: Type guard

    // TODO: Error notificaton
    if (data.errors) {
      return
    }

    setTaxYearData(data)
    setLastSubmittedTaxYear(taxYear)
  }

  const updateTaxYearDataDebounced =
    useDebounce<Parameters<typeof updateTaxYearData>>(updateTaxYearData)

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()

    const form = e.currentTarget

    const taxYearElement = form.elements.namedItem(
      'taxYear',
    ) as HTMLInputElement

    const annualIncomeElement = form.elements.namedItem(
      'annualIncome',
    ) as HTMLInputElement

    await updateTaxYearDataDebounced(taxYearElement.value)
    const salary = Number(annualIncomeElement.value)

    if (taxYearData?.tax_brackets && !Number.isNaN(salary)) {
      setTaxTableRows(salary, taxYearData.tax_brackets)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="annualIncome">Annual Income</label>
        <input id="annualIncome" name="annualIncome" type="number" min="0" />
      </div>
      <div>
        <label htmlFor="taxYear">Tax Year</label>
        <input
          id="taxYear"
          name="taxYear"
          type="number"
          min="2000"
          max="2100"
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  )
}
