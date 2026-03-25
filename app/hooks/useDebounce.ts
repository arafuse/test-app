import { useState } from 'react'

export function useDebounce<TArgs extends Array<any>, TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
) {
  const [debounced, setDebounced] = useState(false)

  return async function (...args: TArgs) {
    try {
      if (debounced) return

      setDebounced(true)
      const result = await fn(...args)
      setDebounced(false)
      return result
    } catch (error) {
      setDebounced(false)
      throw error
    }
  }
}
