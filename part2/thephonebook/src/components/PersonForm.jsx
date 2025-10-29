import { useState } from 'react'
import phonebookService from '../services/phonebook.js';

const PersonForm = ({ persons, setPersons, showNotification }) => {
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const addName = (event) => {
    event.preventDefault()
    console.log('get to addname')
    const existingPerson = persons?.find(p => p.name === newName)
    if (existingPerson) {
      console.log('existing person found')
      if (window.confirm(`"${newName}" is already added to phonebook, replace the old number with a new one?`)) {
        confirmUpdate(existingPerson)
      }
      return
    }
    console.log('creating new person,out of check')
    const personObject = {
      name: newName,
      number: newNumber
    }

    phonebookService
      .create(personObject)
      .then(savedPerson => {
        setPersons(prev => prev.concat(savedPerson))
        showNotification(`Added ${savedPerson.name}`)
        setNewName('')
        setNewNumber('')
      })
      .catch ( error => {
        if (error.response) {
          if (error.response.status === 400) {
            showNotification(error.response.data.error, 'error')
            setNewName('')
            setNewNumber('')
            return
          }
        }
      })
  }

  const confirmUpdate = (existingPerson) => {
    const updatedPerson = { ...existingPerson, number: newNumber }
    phonebookService
      .update(existingPerson.id, updatedPerson)
      .then(data => {
        setPersons(persons.map(p => p.id !== existingPerson.id ? p : data))
        showNotification(`Updated ${data.name}`)
        setNewName('')
        setNewNumber('')
      })
      .catch ( error => {
        if (error.response) {
          if (error.response.status === 400) {
            showNotification(error.response.data.error, 'error')
            setNewName('')
            setNewNumber('')
            return
          }
          else if (error.response.status === 404) {
            showNotification(`Information of ${newName} has already been removed from server`, 'error')
            setPersons(persons.filter(p => p.id !== existingPerson.id))
            setNewName('')
            setNewNumber('')
            return
          }
        }
      })
  }
  return (
    <div>
    <form onSubmit={addName}>
        <div>
          name: <input 
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
          />
        </div> 
        <div>
          number: <input 
            value={newNumber}
            onChange={(event) => setNewNumber(event.target.value)}
          />
        </div>
      <div>
        <button type="submit">add</button>
      </div>
      </form>
    </div>
  )
}

export default PersonForm;