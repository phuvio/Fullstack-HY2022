import React from 'react'
import { useState, useEffect } from 'react'
import personsService from './services/persons'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Error from './components/Error'
import Notification from './components/Notification'
import './index.css'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)

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
          })
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

  const showUsers = (newFilter.length !== 0)
    ? persons.filter(person => 
        person.name.toLowerCase().includes(newFilter.toLowerCase())
      )
    : persons

  const addName = (event) => {
    event.preventDefault()
    const foundPerson = persons.find(p => p.name === newName.trim())
    if (foundPerson) { 
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        personsService
          .update(foundPerson.id, { ...foundPerson, number: newNumber })
            .then(updatedPerson => {
              setPersons(persons.map(p => p.id !== foundPerson.id ? p : updatedPerson))
              setSuccess(
                `${newName.trim()}'s number changed`
              )
              setTimeout(() => {
                setSuccess(null)
              }, 5000)
            })
          .catch(error => {
            if (!error.response.data) {
              setError(
                `Information of ${foundPerson.name} has already been removed from server`
              )
              setPersons(persons.filter(p => p.name !== foundPerson.name))
            } else if (error.response.data.error.startsWith('Validation')) {
              setError(error.response.data.error)
            } else {
              setError(
                `Information of ${foundPerson.name} has already been removed from server`
              )
              setPersons(persons.filter(p => p.name !== foundPerson.name))
            }
            setTimeout(() => {
              setError(null)
            }, 5000)
          })
      }
    } else {
      const personObject = {
            name: newName.trim(),
            number: newNumber,
          }
      personsService
        .create(personObject)
          .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setSuccess(
            `Added ${newName.trim()}`
          )
          setTimeout(() => {
            setSuccess(null)
          }, 5000)
          setNewName('')
        })
        .catch(error => {
          setError(error.response.data.error)
          setTimeout(() => {
            setError(null)
          }, 5000)
        })
    }
    setNewName('')
    setNewNumber('')
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={success} />
      <Error message={error} />

      <Filter 
        newFilter={newFilter} 
        handleFilterChange={({ target }) => setNewFilter(target.value)} 
      />

      <h3>Add a new</h3>

      <PersonForm 
        newName={newName} 
        handleNameChange={({ target }) => setNewName(target.value)} 
        newNumber={newNumber} 
        handleNumberChange={({ target }) => setNewNumber(target.value)} 
        addName={addName} 
      />

      <h3>Numbers</h3>

      <Persons 
        showUsers={showUsers} 
        remove={remove} 
      />
    </div>
  )

}

export default App