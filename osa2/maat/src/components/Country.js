import { useState, useEffect } from 'react'
import axios from "axios"

/* filter for the countries */
const Find = ({filter, handleFilterChange}) => 
  <div>
    find countries <input 
                      type="text"
                      value={filter}
                      onChange={handleFilterChange}
                   />
  </div>

/* country info */
const Show = ({showCountries, setFilter}) => {
  if (showCountries.length === 1) {
    const selectedCountry = showCountries[0]
    return (
      <div>
        <h2>{selectedCountry.name.common}</h2>
        <span>
            capital {selectedCountry.capital} <br />
            area {selectedCountry.area}</span>
        <h3>languages:</h3>
        <ul>
          {
            Object.entries(selectedCountry.languages).map(([key, val]) =>
              <li key={key}>{val}</li>
            )
          } 
        </ul>
        <img src={selectedCountry.flags.png} width={140} />

        <CapitalWeather capital={selectedCountry.capital} />

      </div>
    )
  } else if (showCountries.length < 11) {
    return (
      <div>
        {showCountries.map(country =>
          <p key={country.ccn3}>{country.name.common} <button onClick={(e) => setFilter(country.name.common)}>show</button></p>
        )}
      </div>
    )
  } else {
    return (
      <div>
        Too many matches, specify another filter
      </div>
    )
  }
}

/* weather in capital city */
const CapitalWeather = ({capital}) => {
  const [currentWeather, setCurrentWeather] = useState(null)
  
  const openWeatherUrl = new URL(`https://api.openweathermap.org/data/2.5/weather`)
  const api_key = process.env.REACT_APP_API_KEY
  openWeatherUrl.searchParams.set("q", `${capital}`)
  openWeatherUrl.searchParams.set("units", "metric")
  openWeatherUrl.searchParams.set("appid", `${api_key}`) 
  
  useEffect(() => {
    axios 
      .get(openWeatherUrl)
      .then(response => {
        setCurrentWeather(response.data)
      })
      .catch(error => {
        console.log(error)
      })
  }, [])

  const weatherIcon = currentWeather?.weather[0].icon
  const iconUrl = new URL(` http://openweathermap.org/img/wn/${weatherIcon}@2x.png`)
  
  if (currentWeather === null) {
    return null
  } else {
    return (
      <div>
        <h3>Weather in {capital}</h3>
        <p>temperature {currentWeather?.main.temp} Celcius</p>
        <img src={iconUrl} />
        <p>wind {currentWeather?.wind.speed} m/s</p>
      </div>
    )
  }
}

export { Find, Show }