import { useState, useEffect } from 'react'
import { Find, Show } from './components/Country'
import axios from 'axios'
const baseUrl = 'https://restcountries.com/v3.1/all'

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')

  const handleFilterChange = (e) => {
    setFilter(e.target.value)
  }

  useEffect(() => {
    axios
      .get(baseUrl)
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  /* filter countries */
  const showCountries = (filter !== '') 
    ? countries.filter(country => {
      return country.name.common.toLowerCase().includes(filter.toLowerCase())
    })
    : countries

  return (
    <div>
      <Find filter={filter} handleFilterChange={handleFilterChange} />

      <Show showCountries={showCountries} setFilter={setFilter} />
    </div>
  )
}

export default App;
