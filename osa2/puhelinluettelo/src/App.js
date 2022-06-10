import { useState } from 'react'

const Persons = ({showUsers}) => 
  <span> 
    {showUsers.map(person => 
      <p key={person.name}>{person.name} {person.number}</p>  
    )}
  </span>

const PersonForm = ({newName, handleNameChange, newNumber, handleNumberChange, addName}) => 
  <form onSubmit={addName}>
    <div>
      name: <input 
                type="text"
                value={newName} 
                onChange={handleNameChange}
            />
            <br></br>
      number: <input 
                value={newNumber}
                onChange={handleNumberChange}
              />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>

const Filter = ({newFilter, handleFilterChange}) => 
  <div>
    filter shown with <input 
                          type="text"
                          value={newFilter}
                          onChange={handleFilterChange}
                      />
  </div>

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  const showUsers = (newFilter !== '')
    ? persons.filter(person => {
        return person.name.toLowerCase().includes(newFilter)
      })
    : persons

  const addName = (event) => {
    event.preventDefault()
    const isFound = persons.some(element => {
      if (element.name === newName.trim()) {
        return true
      }
      return false
    })
    if (isFound) { 
      alert(`${newName} is already added to phonebook`)
      setNewName('')
      setNewNumber('')
    } else {
      const personObject = {
        name: newName.trim(),
        number: newNumber
      }
      setPersons(persons.concat(personObject))
      setNewName('')
      setNewNumber('')
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />

      <h3>Add a new</h3>

      <PersonForm newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} addName={addName} />

      <h3>Numbers</h3>

      <Persons showUsers={showUsers} />
    </div>
  )

}

export default App