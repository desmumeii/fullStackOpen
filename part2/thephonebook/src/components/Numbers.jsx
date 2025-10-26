import phonebookService from '../services/phonebook.js';

const Numbers = ({ persons, setPersons }) => {

  const removeName = (id) => {
    phonebookService
      .remove(id)
      .then(() => {
        setPersons(persons.filter(p => p.id !== id))
      })
  }
  const confirmRemove = (id) => {
    if (window.confirm(`Delete ${persons.find(p => p.id === id).name}?`)) {
      removeName(id)
    }
  }

  const toggleRemove = (id) => {
    return (
      <button onClick={() => confirmRemove(id)}>delete</button>
  )
}
  return (
    <div>
      {persons.map((person, index) => (
        <div key={index}>{person.name} {person.number} {toggleRemove(person.id)}</div>
      ))}
    </div>
  )
}

export default Numbers;