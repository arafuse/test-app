import { useEffect, useState } from 'react'
import { useTaxYearData } from '../hooks/useTaxYearData'

export function TaxYearForm() {
  const taxYearData = useTaxYearData(state => state.data)
  const setTaxYearData = useTaxYearData(state => state.setData)

  const [lastSubmittedTaxYear, setLastSubmittedTaxYear] = useState<
    string | null
  >(null)

  useEffect(() => {
    console.log(taxYearData)
  })

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()

    const form = e.currentTarget
    const taxYear = (form.elements.namedItem('taxYear') as HTMLInputElement)
      .value

    if (taxYear === lastSubmittedTaxYear) return

    const response = await fetch(
      `http://localhost:5001/tax-calculator/tax-year/${taxYear}`,
    )
    const data = await response.json()

    setTaxYearData(data)
    setLastSubmittedTaxYear(taxYear)
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
