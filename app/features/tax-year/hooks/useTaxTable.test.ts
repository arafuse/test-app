import { useTaxTable } from './useTaxTable'

const mockBrackets = [
  { min: 0, max: 50197, rate: 0.15 },
  { min: 50197, rate: 0.205 },
]

describe('useTaxTable', () => {
  beforeEach(() => {
    useTaxTable.setState({ salary: 0, rows: [] })
  })

  it('has the correct initial state', () => {
    const { salary, rows } = useTaxTable.getState()

    expect(salary).toBe(0)
    expect(rows).toEqual([])
  })

  it('sets the salary when setRows is called', () => {
    useTaxTable.getState().setRows(80000, mockBrackets)

    expect(useTaxTable.getState().salary).toBe(80000)
  })

  it('computes a row for each bracket', () => {
    useTaxTable.getState().setRows(80000, mockBrackets)

    expect(useTaxTable.getState().rows).toHaveLength(mockBrackets.length)
  })

  it('computes correct totals for a salary spanning multiple brackets', () => {
    useTaxTable.getState().setRows(80000, mockBrackets)

    const [firstRow, secondRow] = useTaxTable.getState().rows

    // First bracket: 0–50197 → 50197 * 0.15
    expect(firstRow.salary).toBe(50197)
    expect(firstRow.total).toBeCloseTo(50197 * 0.15)

    // Second bracket: 50197–80000 → 29803 * 0.205
    expect(secondRow.salary).toBe(29803)
    expect(secondRow.total).toBeCloseTo(29803 * 0.205)
  })

  it('produces zero salary and total for brackets above the salary', () => {
    useTaxTable.getState().setRows(30000, mockBrackets)

    const [, secondRow] = useTaxTable.getState().rows

    expect(secondRow.salary).toBe(0)
    expect(secondRow.total).toBe(0)
  })

  it('overwrites previous results when called again', () => {
    useTaxTable.getState().setRows(80000, mockBrackets)
    useTaxTable.getState().setRows(40000, mockBrackets)

    expect(useTaxTable.getState().salary).toBe(40000)
    expect(useTaxTable.getState().rows[0].salary).toBe(40000)
  })
})
