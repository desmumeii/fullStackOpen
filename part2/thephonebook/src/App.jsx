import { useEffect, useState } from 'react'
import Filter from './components/Filter.jsx';
import PersonForm from './components/PersonForm.jsx';
import Numbers from './components/Numbers.jsx';
import phonebookService from './services/phonebook.js';
import ShowNotification from './components/ShowNotification.jsx';

const App = () => {
  const [persons, setPersons] = useState([])
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)

  const showNotification = (message, type) => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000);
  }

  useEffect(() => {
    phonebookService
      .getAll()
      .then(data => {
        setPersons(data)
      })
  }, [])
  
  const namesToShow = filter
    ? persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
    : persons

  return (
    <div>
      <h2>Phonebook</h2>
      <ShowNotification notification={notification} />
      <div>
        <Filter 
          filter={filter}
          handleFilterChange={(event) => setFilter(event.target.value)}
        />
      </div>
      <h2>Add a new</h2>
        <PersonForm person={persons} setPerson={setPersons} showNotification={showNotification} />
      <h2>Numbers</h2>
      <div>
        <Numbers persons={namesToShow} setPersons={setPersons} />
      </div>
    </div>
  )
}

export default App