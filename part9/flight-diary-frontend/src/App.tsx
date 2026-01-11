import { useState, useEffect } from "react"
import type { DiaryEntry, NewDiaryEntry } from "./types"
import { getAllDiaries, createDiaryEntry } from "./service/diaryService"
import DiaryEntryForm from "./components/diaryForm"
const App = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([])

  useEffect(() => {
    getAllDiaries().then((data) => {
      setEntries(data)
    })
  }, [])

  const addEntry = (entry: NewDiaryEntry) => {
    createDiaryEntry(entry).then((data) => setEntries(entries.concat(data)));
  };

  return (
    <div>
      <h1>Add New Diary Entry</h1>
      <DiaryEntryForm onSubmit={addEntry} />
      <h1>Diary Entries</h1>
      <ul>
        {entries.map((entry) => (
          <div key={entry.id}>
            <h2>{entry.date}</h2>
            <li>Visibility: {entry.visibility}</li>
            <li>Weather: {entry.weather}</li>
          </div>
        ))}
      </ul>
    </div>
  )
}
export default App
