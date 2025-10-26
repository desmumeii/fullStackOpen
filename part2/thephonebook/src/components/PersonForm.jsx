import { useState } from 'react'
import phonebookService from '../services/phonebook.js';

const PersonForm = ({ person, setPerson, showNotification }) => {
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const addName = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }
    if (!person.find(p => p.name === newName)) {
      showNotification(`Added ${newName}`)
      setPerson(person.concat(personObject))
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
      .then(data => {
        setPerson(person.concat(data))
      })
  }
  const confirmUpdate = () => {
    const personToUpdate = person.find(p => p.name === newName)
    const updatedPerson = { ...personToUpdate, number: newNumber }
    setNewName('')
    setNewNumber('')
    phonebookService
      .update(personToUpdate.id, updatedPerson)
      .then(data => {
        setPerson(person.map(p => p.id !== personToUpdate.id ? p : data))
      })
      .catch ( error => {
        showNotification(`Information of ${newName} has already been removed from server`, 'error')
        setPerson(person.filter(p => p.id !== personToUpdate.id))
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