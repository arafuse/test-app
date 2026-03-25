import { useState } from 'react'

export function useDebounce<TArgs extends Array<any>>(
  fn: (...args: TArgs) => Promise<void>,
) {
  const [debounced, setDebounced] = useState(false)

  return async function (...args: TArgs) {
    try {
      if (debounced) return

      setDebounced(true)
      await fn(...args)
      setDebounced(false)
    } catch (error) {
      setDebounced(false)
      throw error
    }
  }
}
