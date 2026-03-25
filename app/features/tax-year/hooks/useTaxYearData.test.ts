import { useTaxYearData } from './useTaxYearData'

const mockData = {
  tax_brackets: [
    { min: 0, max: 50197, rate: 0.15 },
    { min: 50197, rate: 0.205 },
  ],
}

describe('useTaxYearData', () => {
  beforeEach(() => {
    useTaxYearData.setState({ data: null })
  })

  it('has the correct initial state', () => {
    const { data } = useTaxYearData.getState()

    expect(data).toBeNull()
  })

  it('sets data when setData is called', () => {
    useTaxYearData.getState().setData(mockData)

    expect(useTaxYearData.getState().data).toEqual(mockData)
  })

  it('overwrites previous data when setData is called again', () => {
    const newData = {
      errors: [{ code: '404', field: 'year', message: 'Not found' }],
    }

    useTaxYearData.getState().setData(mockData)
    useTaxYearData.getState().setData(newData)

    expect(useTaxYearData.getState().data).toEqual(newData)
  })

  it('stores data with errors', () => {
    const errorData = {
      errors: [{ code: '422', field: 'year', message: 'Invalid year' }],
    }

    useTaxYearData.getState().setData(errorData)

    expect(useTaxYearData.getState().data).toEqual(errorData)
  })
})
