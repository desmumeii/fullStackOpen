import { useState } from 'react'
import Filter from './components/Filter.jsx';
import PersonForm from './components/PersonForm.jsx';
import Numbers from './components/Numbers.jsx';

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [filter, setFilter] = useState('')

  const namesToShow = filter
    ? persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
    : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        <Filter 
          filter={filter}
          handleFilterChange={(event) => setFilter(event.target.value)}
        />
      </div>
      <h2>Add a new</h2>
        <PersonForm person={persons} setPerson={setPersons} />
      <h2>Numbers</h2>
      <div>
        <Numbers persons={namesToShow} />
      </div>
    </div>
  )
}

export default App