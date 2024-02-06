import { useState, useRef } from "react"

export const useFetchData = <T,>(fetchFunction: () => Promise<T>): T => {
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<Error | null>(null)
  const promiseRef = useRef<Promise<T> | null>(null)

  if (!promiseRef.current) {
    promiseRef.current = fetchFunction()

    promiseRef.current.then(
      (fetchedData) => {
        setData(fetchedData)
        promiseRef.current = null
      },
      (fetchError) => {
        setError(fetchError)
        promiseRef.current = null
      }
    )
  }

  if (error) {
    throw error
  }

  if (!data) {
    throw promiseRef.current
  }

  return data as T
}
