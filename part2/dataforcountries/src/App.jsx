import { useEffect, useState } from 'react'
import axios from 'axios'

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [weather, setWeather] = useState([])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const handleShowCountry = (countryName) => {
    setFilter(countryName)
  }

  const countriesToShow = filter
    ? countries.filter(country => country.name.common.toLowerCase().includes(filter.toLowerCase()))
    : countries

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  useEffect(() => {
    if (countriesToShow.length === 1) {
      const country = countriesToShow[0]
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY
      axios
        .get(`https://api.openweathermap.org/data/2.5/weather?q=${country.capital[0]}&appid=${apiKey}&units=metric`)
        .then(response => {
          setWeather(response.data)
        })
    }
  }, [countriesToShow])

  return (
    <div>
      <div>
        find countries: <input 
          value={filter}
          onChange={handleFilterChange}
        />
      </div>
      <div>
        {countriesToShow.length > 10
          ? 'Too many matches, specify another filter'
          : countriesToShow.length === 1
            ? (
              <>
                <CountryDetail country={countriesToShow[0]} />
                {weather?.main && <Weather weather={weather} />}
              </>
            )
            : <CountryList countries={countriesToShow} handleShowCountry={handleShowCountry} />
    }
      </div>
    </div>
  )
}

const CountryList = ({ countries, handleShowCountry }) => {
  return (
    <div>
      {countries.map((country, index) => 
        <div key={index}>
          {country.name.common} 
          <button onClick={() => handleShowCountry(country.name.common)}>show</button>
        </div>  
      )}
    </div>
  )
}

const CountryDetail = ({ country }) => {
  return (
    <div>
      <h2>{country.name.common}</h2>
      <div>Capital: {country.capital[0]}</div>
      <div>Area: {country.area}</div>
      <h2>Languages</h2>
      <ul>
        {Object.values(country.languages).map((language, index) => (
          <li key={index}>{language}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={`Flag of ${country.name.common}`} />
    </div>
  )
}
const Weather = ({ weather }) => {
  return (
    <div>
      <h2>Weather in {weather.name}</h2>
      <div>Temperature: {weather.main.temp} °C</div>
      <img 
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt={`Weather icon for ${weather.name}`} />
      <div>Wind: {weather.wind.speed} m/s</div>
    </div>
  )
}

export default App
