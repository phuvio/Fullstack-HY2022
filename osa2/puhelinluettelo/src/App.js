import { useState, useEffect } from 'react'
import personsService from './services/persons'
import './index.css'

const Persons = ({showUsers, remove}) => 
  <span> 
    {showUsers.map(person => 
      <p key={person.name}>{person.name} {person.number} <button onClick={(e) => remove(person)}>delete</button></p>  
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

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }
  return (
    <div className="success">
      {message}
    </div>
  )
}
  
const Error = ({ message }) => {
  if (message === null) {
    return null
  }
  return (
    <div className="error">
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  useEffect(() => {
    personsService
      .getAll()
        .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const remove = (e) => {
    if (window.confirm(`delete ${e.name} ?`)) {
      personsService
        .remove(e.id)
          .then(removedPerson => {
            setPersons(persons.filter(p => p.id !== e.id))
            setSuccess(
              `Deleted ${e.name}`
            )
            setTimeout(() => {
              setSuccess(null)
            }, 5000)
          } )
          .catch(error => {
            setError(
              `Information of ${e.name} has already been removed from server`
            )
            setTimeout(() => {
              setError(null)
            }, 5000)
            setPersons(persons.filter(p => p.name !== e.name))
          })
    }
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
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const person = persons.find(p => p.name === newName.trim())
        const changedNumber = { ...person, number: newNumber }
        personsService
          .update(person.id, changedNumber)
            .then(updatedPerson => {
              setPersons(persons.map(p => p.id !== person.id ? p : updatedPerson))
              setSuccess(
                `${newName.trim()}'s number changed`
              )
              setTimeout(() => {
                setSuccess(null)
              }, 5000)
            })
            .catch(error => {
              setError(
                `Information of ${person.name} has already been removed from server`
              )
              setTimeout(() => {
                setError(null)
              }, 5000)
              setPersons(persons.filter(p => p.name !== person.name))
            })
      }
      setNewName('')
      setNewNumber('')
    } else if (newName.trim() === '') {
        setNewFilter('')
        setNewNumber('')
    } else {
      const personObject = {
            name: newName.trim(),
            number: newNumber,
          }
      personsService
        .create(personObject)
          .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setSuccess(
            `Added ${newName.trim()}`
          )
          setTimeout(() => {
            setSuccess(null)
          }, 5000)
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={success} />
      <Error message={error} />

      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />

      <h3>Add a new</h3>

      <PersonForm newName={newName} handleNameChange={handleNameChange} newNumber={newNumber} handleNumberChange={handleNumberChange} addName={addName} />

      <h3>Numbers</h3>

      <Persons showUsers={showUsers} remove={remove} />
    </div>
  )

}

export default App