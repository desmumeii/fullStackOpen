import { useState } from 'react'
import phonebookService from '../services/phonebook.js';

const PersonForm = ({ persons, setPersons, showNotification }) => {
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const addName = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }
    if (!persons?.find(p => p.name === newName)) {
      showNotification(`Added ${newName}`)
      setPersons(prev => prev.concat(personObject))
    }
    else {
      if (window.confirm(`"${newName}" is already added to phonebook, replace the old number with a new one?`)) {
        showNotification(`Updated ${newName}'s number`)
        confirmUpdate()
      }
      return
    }
    setNewName('')
    setNewNumber('')
    phonebookService
      .create(personObject)
      .then(data => setPersons(prev => prev.concat(data)))
  }
  const confirmUpdate = () => {
    const personToUpdate = persons.find(p => p.name === newName)
    if (!personToUpdate) return
    const updatedPerson = { ...personToUpdate, number: newNumber }
    setNewName('')
    setNewNumber('')
    phonebookService
      .update(personToUpdate.id, updatedPerson)
      .then(data => {
        setPersons(persons.map(p => p.id !== personToUpdate.id ? p : data))
      })
      .catch ( error => {
        showNotification(`Information of ${newName} has already been removed from server`, 'error')
        setPersons(persons.filter(p => p.id !== personToUpdate.id))
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