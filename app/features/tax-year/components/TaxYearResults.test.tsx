import { render, screen } from '@testing-library/react'
import { TaxYearResults } from './TaxYearResults'
import { useTaxTable } from '../hooks/useTaxTable'

const mockRows = [
  { min: 0, max: 50197, salary: 50197, total: 7529.55 },
  { min: 50197, max: undefined, salary: 29803, total: 6109.615 },
]

describe('TaxYearResults', () => {
  beforeEach(() => {
    useTaxTable.setState({ salary: 0, rows: [] })
  })

  it('renders nothing when there are no rows', () => {
    const { container } = render(<TaxYearResults />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders the total taxes', () => {
    useTaxTable.setState({ salary: 80000, rows: mockRows })

    render(<TaxYearResults />)

    const total = mockRows.reduce((sum, row) => sum + row.total, 0)
    expect(
      screen.getByText(`Total Taxes: ${total.toFixed(2)}`),
    ).toBeInTheDocument()
  })

  it('renders the effective tax rate', () => {
    useTaxTable.setState({ salary: 80000, rows: mockRows })

    render(<TaxYearResults />)

    const total = mockRows.reduce((sum, row) => sum + row.total, 0)
    const rate = ((total / 80000) * 100).toFixed(2)
    expect(screen.getByText(`Effective Tax Rate: ${rate}%`)).toBeInTheDocument()
  })

  it('renders a table row for each bracket with a non-zero salary', () => {
    useTaxTable.setState({ salary: 80000, rows: mockRows })

    render(<TaxYearResults />)

    const rows = screen.getAllByRole('row')
    // header row + one row per bracket with salary
    expect(rows).toHaveLength(mockRows.length + 1)
  })

  it('skips rows where salary is zero', () => {
    const rowsWithZero = [
      { min: 0, max: 50197, salary: 50197, total: 7529.55 },
      { min: 50197, max: 100392, salary: 0, total: 0 },
      { min: 100392, max: undefined, salary: 0, total: 0 },
    ]
    useTaxTable.setState({ salary: 50197, rows: rowsWithZero })

    render(<TaxYearResults />)

    const rows = screen.getAllByRole('row')
    expect(rows).toHaveLength(2) // header + 1 non-zero row
  })

  it('shows an effective rate of 0% when salary is zero', () => {
    const rows = [{ min: 0, max: 50197, salary: 0, total: 0 }]
    useTaxTable.setState({ salary: 0, rows })

    render(<TaxYearResults />)

    expect(screen.getByText('Effective Tax Rate: 0.00%')).toBeInTheDocument()
  })
})
