import phonebookService from '../services/phonebook.js';

const Numbers = ({ persons, setPersons, showNotification }) => {

  const removeName = (id) => {
    phonebookService
      .remove(id)
      .then(() => {
        setPersons(persons.filter(p => p.id !== id))
      })
  }
  const confirmRemove = (id) => {
    const person = persons?.find(p => p.id === id)
    if (!person) return
    if (window.confirm(`Delete ${person.name}?`)) {
      removeName(id)
      showNotification(`Deleted ${person.name}`)
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