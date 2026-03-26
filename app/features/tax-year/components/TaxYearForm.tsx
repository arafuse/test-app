import { useCallback, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { useDebounce } from '~/hooks/useDebounce'
import { TaxYearData } from '~/types'
import { useTaxTable } from '../hooks/useTaxTable'
import { useTaxYearData } from '../hooks/useTaxYearData'

const API_ENDPOINT = 'http://localhost:5001/tax-calculator/tax-year'

export function TaxYearForm() {
  const taxYearData = useTaxYearData(state => state.data)
  const setTaxYearData = useTaxYearData(state => state.setData)
  const setTaxTableRows = useTaxTable(state => state.setRows)

  const [lastTaxYear, setLastTaxYear] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const handleError = useCallback((response: Response) => {
    if (response.status == 200) return

    const uiText =
      response.status == 500
        ? 'Temporary error, please try again'
        : 'Invalid tax year'

    toast.error(uiText)
  }, [])

  const updateTaxYearData = useCallback(
    async (taxYear: string) => {
      if (taxYear === lastTaxYear) return

      setLoading(true)
      const response = await fetch(`${API_ENDPOINT}/${taxYear}`)
      setLoading(false)

      const data = TaxYearData.parse(await response.json())
      handleError(response)

      if (!data.tax_brackets) return

      setTaxYearData(data)
      setLastTaxYear(taxYear)

      return data
    },
    [lastTaxYear, handleError, setTaxYearData, setLastTaxYear, setLoading],
  )

  const updateTaxYearDataDebounced = useDebounce<
    Parameters<typeof updateTaxYearData>,
    TaxYearData | undefined
  >(updateTaxYearData)

  const handleSubmit = useCallback(
    async (e: React.SubmitEvent<HTMLFormElement>) => {
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
    },
    [taxYearData, updateTaxYearDataDebounced, setTaxTableRows],
  )

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
        <button type="submit" className="btn">
          {loading ? "Loading..." : "Submit"}
        </button>
      </form>
    </>
  )
}
