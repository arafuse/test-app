export function TaxYearForm() {
  return (
    <form>
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
