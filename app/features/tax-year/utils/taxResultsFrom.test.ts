import { taxResultsFrom } from './taxResultsFrom'

const brackets = [
  { min: 0, max: 50197, rate: 0.15 },
  { min: 50197, max: 100392, rate: 0.205 },
  { min: 100392, rate: 0.26 },
]

describe('taxResultsFrom', () => {
  it('returns one result per bracket', () => {
    expect(taxResultsFrom(80000, brackets)).toHaveLength(brackets.length)
  })

  it('passes min and max through to each result', () => {
    const results = taxResultsFrom(80000, brackets)

    expect(results[0]).toMatchObject({ min: 0, max: 50197 })
    expect(results[1]).toMatchObject({ min: 50197, max: 100392 })
    expect(results[2]).toMatchObject({ min: 100392, max: undefined })
  })

  it('computes correct salary and total for each bracket when salary spans multiple brackets', () => {
    const results = taxResultsFrom(80000, brackets)

    // First bracket: 0–50197 → full 50197
    expect(results[0].salary).toBe(50197)
    expect(results[0].total).toBeCloseTo(50197 * 0.15)

    // Second bracket: 50197–80000 → 29803
    expect(results[1].salary).toBe(29803)
    expect(results[1].total).toBeCloseTo(29803 * 0.205)

    // Third bracket: above salary → 0
    expect(results[2].salary).toBe(0)
    expect(results[2].total).toBe(0)
  })

  it('produces zero salary and total for all brackets above the salary', () => {
    const results = taxResultsFrom(30000, brackets)

    expect(results[1].salary).toBe(0)
    expect(results[1].total).toBe(0)
    expect(results[2].salary).toBe(0)
    expect(results[2].total).toBe(0)
  })

  it('handles a salary exactly at a bracket boundary', () => {
    const results = taxResultsFrom(50197, brackets)

    expect(results[0].salary).toBe(50197)
    expect(results[1].salary).toBe(0)
  })

  it('handles the top bracket with no max', () => {
    const results = taxResultsFrom(120000, brackets)

    // Top bracket: 100392–120000 → 19608
    expect(results[2].salary).toBe(19608)
    expect(results[2].total).toBeCloseTo(19608 * 0.26)
  })

  it('returns empty array for empty brackets', () => {
    expect(taxResultsFrom(80000, [])).toEqual([])
  })
})
