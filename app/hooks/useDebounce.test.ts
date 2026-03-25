import { act, renderHook } from '@testing-library/react'
import { useDebounce } from './useDebounce'

describe('useDebounce', () => {
  it('calls the wrapped function with the provided arguments', async () => {
    const fn = jest.fn().mockResolvedValue(undefined)
    const { result } = renderHook(() => useDebounce(fn))

    await act(async () => {
      await result.current('arg1', 'arg2')
    })

    expect(fn).toHaveBeenCalledWith('arg1', 'arg2')
  })

  it('ignores subsequent calls while the first is still running', async () => {
    let resolve!: () => void

    const fn = jest.fn(
      () =>
        new Promise<void>(res => {
          resolve = res
        }),
    )

    const { result } = renderHook(() => useDebounce(fn))

    let firstCall!: Promise<void>

    act(() => {
      firstCall = result.current()
    })

    act(() => {
      result.current()
      result.current()
    })

    await act(async () => {
      resolve()
      await firstCall
    })

    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('allows a second call after the first has resolved', async () => {
    const fn = jest.fn().mockResolvedValue(undefined)
    const { result } = renderHook(() => useDebounce(fn))

    await act(async () => {
      await result.current()
    })

    await act(async () => {
      await result.current()
    })

    expect(fn).toHaveBeenCalledTimes(2)
  })

  it('rethrows errors from the wrapped function', async () => {
    const error = new Error('boom')
    const fn = jest.fn().mockRejectedValue(error)
    const { result } = renderHook(() => useDebounce(fn))

    let thrown: unknown

    await act(async () => {
      await result.current().catch(e => {
        thrown = e
      })
    })

    expect(thrown).toBe(error)
  })

  it('allows calls again after an error', async () => {
    const fn = jest
      .fn()
      .mockRejectedValueOnce(new Error('boom'))
      .mockResolvedValue(undefined)

    const { result } = renderHook(() => useDebounce(fn))

    await act(async () => {
      await result.current().catch(() => {})
    })

    await act(async () => {
      await result.current()
    })

    expect(fn).toHaveBeenCalledTimes(2)
  })
})
