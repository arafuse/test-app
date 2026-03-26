import { useTaxTable } from '../hooks/useTaxTable'

export function TaxYearResults() {
  const taxTableRows = useTaxTable(state => state.rows)
  const taxTableSalary = useTaxTable(state => state.salary)

  if (taxTableRows.length == 0) return null

  const totalTaxes = taxTableRows.reduce((sum, row) => sum + row.total, 0)
  const effectiveRate = taxTableSalary > 0 ? totalTaxes / taxTableSalary : 0

  function renderRows() {
    return taxTableRows.map((row, i) => {
      if (!row.salary) return null

      return (
        <tr key={i}>
          <td>{row.salary.toFixed(2)}</td>
          <td>{row.total.toFixed(2)}</td>
        </tr>
      )
    })
  }

  return (
    <div>
      <br/>
      <p>Total Taxes: {totalTaxes.toFixed(2)}</p>
      <p>Effective Tax Rate: {(effectiveRate * 100).toFixed(2)}%</p>
      <br/>
      <table>
        <thead>
          <tr>
            <th>Salary</th>
            <th>Total Taxes</th>
          </tr>
        </thead>
        <tbody>
          {renderRows()}
        </tbody>
      </table>
    </div>
  )
}
