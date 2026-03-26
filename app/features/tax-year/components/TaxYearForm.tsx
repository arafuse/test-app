import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { useDebounce } from '~/hooks/useDebounce'
import type { TaxBracket, TaxYearData } from '~/types'
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

  async function updateTaxYearData(taxYear: string) {
    if (taxYear === lastSubmittedTaxYear) return

    const response = await fetch(`${API_ENDPOINT}/${taxYear}`)
    const data = (await response.json()) as TaxYearData // TODO: Type guard

    if (data.errors && data.errors.length > 0) {
      const text = `${data.errors[0].code}: ${data.errors[0].message}`
      toast.error(text)
    }

    if (!data.tax_brackets) return 

    setTaxYearData(data)
    setLastSubmittedTaxYear(taxYear)

    return data
  }

  const updateTaxYearDataDebounced = useDebounce<
    Parameters<typeof updateTaxYearData>,
    TaxYearData | undefined
  >(updateTaxYearData)

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()

    const form = e.currentTarget

    const taxYearElement = form.elements.namedItem(
      'taxYear',
    ) as HTMLInputElement

    const annualIncomeElement = form.elements.namedItem(
      'annualIncome',
    ) as HTMLInputElement

    const data = await updateTaxYearDataDebounced(taxYearElement.value)
    const salary = Number(annualIncomeElement.value)
    const brackets = data?.tax_brackets || taxYearData?.tax_brackets

    if (brackets && !Number.isNaN(salary)) setTaxTableRows(salary, brackets)
  }

  return (
    <>
      <Toaster />

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
        <button type="submit" className="btn">Submit</button>
      </form>
    </>
  )
}
