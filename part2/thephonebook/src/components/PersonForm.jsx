import { useState } from 'react'

const PersonForm = ({ person, setPerson }) => {
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const addName = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }
    if (!person.find(p => p.name === newName)) {
      setPerson(person.concat(personObject))
    }
    else {
      alert(`${newName} is already added to phonebook`)
    }
    setNewName('')
    setNewNumber('')
    console.log(newName);
    console.log(newNumber);
  }

  return (
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
  )
}

export default PersonForm;