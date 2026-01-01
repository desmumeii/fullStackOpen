import { useState, useEffect } from 'react'
import axios from 'axios'

export const useCountry = (name) => {
  const [country, setCountry] = useState(null)

  useEffect(() => {
    if (!name) {
      setCountry(null)
      return
    }

    const fetchCountry = async () => {
      try {
        const response = await axios.get(
          `https://studies.cs.helsinki.fi/restcountries/api/name/${name}`
        )
        setCountry({
          found: true,
          data: response.data
        })
      } catch (error) {
        setCountry({
          found: false
        })
      }
    }

    fetchCountry()
  }, [name])   // 👈 effect runs ONLY when name changes

  return country
}
