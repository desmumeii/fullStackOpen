import { useEffect, useState } from 'react'
import Filter from './components/Filter.jsx';
import PersonForm from './components/PersonForm.jsx';
import Numbers from './components/Numbers.jsx';
import axios from 'axios';

const App = () => {
  const [persons, setPersons] = useState([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        setPersons(response.data)
      })
  }, [])
  
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