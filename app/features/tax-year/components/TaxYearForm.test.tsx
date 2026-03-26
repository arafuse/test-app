import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import toast from 'react-hot-toast'
import { TaxYearForm } from './TaxYearForm'
import { useTaxTable } from '../hooks/useTaxTable'
import { useTaxYearData } from '../hooks/useTaxYearData'

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: Object.assign(jest.fn(), { error: jest.fn() }),
  Toaster: () => null,
}))

const mockFetch = jest.fn()
global.fetch = mockFetch

const mockBrackets = [
  { min: 0, max: 50197, rate: 0.15 },
  { min: 50197, rate: 0.205 },
]

const mockTaxYearData = { tax_brackets: mockBrackets }

function submitForm(annualIncome = '80000', taxYear = '2022') {
  fireEvent.change(screen.getByLabelText('Annual Income'), {
    target: { value: annualIncome },
  })
  fireEvent.change(screen.getByLabelText('Tax Year'), {
    target: { value: taxYear },
  })
  fireEvent.submit(
    screen.getByRole('button', { name: 'Submit' }).closest('form')!,
  )
}

describe('TaxYearForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    useTaxYearData.setState({ data: null })
    useTaxTable.setState({ salary: 0, rows: [] })
  })

  it('renders all form fields', () => {
    render(<TaxYearForm />)

    expect(screen.getByLabelText('Annual Income')).toBeInTheDocument()
    expect(screen.getByLabelText('Tax Year')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
  })

  it('fetches tax data for the submitted tax year', async () => {
    mockFetch.mockResolvedValueOnce({ json: async () => mockTaxYearData })

    render(<TaxYearForm />)
    submitForm('80000', '2022')

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:5001/tax-calculator/tax-year/2022',
      )
    })
  })

  it('updates the tax year data store on a successful fetch', async () => {
    mockFetch.mockResolvedValueOnce({ json: async () => mockTaxYearData })

    render(<TaxYearForm />)
    submitForm('80000', '2022')

    await waitFor(() => {
      expect(useTaxYearData.getState().data).toEqual(mockTaxYearData)
    })
  })

  it('updates the tax table store with the entered salary and fetched brackets', async () => {
    mockFetch.mockResolvedValueOnce({ json: async () => mockTaxYearData })

    render(<TaxYearForm />)
    submitForm('80000', '2022')

    await waitFor(() => {
      expect(useTaxTable.getState().salary).toBe(80000)
      expect(useTaxTable.getState().rows).toHaveLength(mockBrackets.length)
    })
  })

  it('shows an error toast when the API returns errors', async () => {
    const errorData = {
      errors: [
        {
          code: 'NOT_FOUND',
          field: 'tax_year',
          message: 'Tax year not found.',
        },
      ],
    }
    mockFetch.mockResolvedValueOnce({ json: async () => errorData })

    render(<TaxYearForm />)
    submitForm('80000', '1999')

    await waitFor(() => {
      expect(jest.mocked(toast.error)).toHaveBeenCalledWith(
        'Invalid tax year',
      )
    })
  })

  it('does not update the tax year data store when the response has no tax_brackets', async () => {
    const errorData = {
      errors: [
        {
          code: 'NOT_FOUND',
          field: 'tax_year',
          message: 'Tax year not found.',
        },
      ],
    }
    mockFetch.mockResolvedValueOnce({ json: async () => errorData })

    render(<TaxYearForm />)
    submitForm('80000', '1999')

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })

    expect(useTaxYearData.getState().data).toBeNull()
  })

  it('does not re-fetch when the same tax year is submitted again', async () => {
    mockFetch.mockResolvedValue({ json: async () => mockTaxYearData })

    render(<TaxYearForm />)
    submitForm('80000', '2022')

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })

    submitForm('80000', '2022')

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledTimes(1)
    })
  })
})
