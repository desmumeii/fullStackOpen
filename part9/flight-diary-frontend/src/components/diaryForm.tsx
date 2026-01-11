import { useState } from "react";
import type { NewDiaryEntry } from "../types";

interface Props {
  onSubmit: (entry: NewDiaryEntry) => void;
}

const weatherOptions = ["sunny", "rainy", "cloudy", "stormy", "windy"];
const visibilityOptions = ["great", "good", "ok", "poor"];

const DiaryEntryForm = ({ onSubmit }: Props) => {
  const [entry, setEntry] = useState<NewDiaryEntry>({
    date: "",
    weather: "",
    visibility: "",
    comment: "",
  });

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    onSubmit(entry);
    setEntry({ date: "", weather: "", visibility: "", comment: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Date:
          <input
            type="date"
            value={entry.date}
            onChange={(e) => setEntry({ ...entry, date: e.target.value })}
          />
        </label>
      </div>

      <div>
        Visibility:
        {visibilityOptions.map((v) => (
          <label key={v} style={{ marginRight: "10px" }}>
            <input
              type="radio"
              name="visibility"
              value={v}
              checked={entry.visibility === v}
              onChange={() => setEntry({ ...entry, visibility: v })}
            />
            {v}
          </label>
        ))}
      </div>

      <div>
        Weather:
        {weatherOptions.map((w) => (
          <label key={w} style={{ marginRight: "10px" }}>
            <input
              type="radio"
              name="weather"
              value={w}
              checked={entry.weather === w}
              onChange={() => setEntry({ ...entry, weather: w })}
            />
            {w}
          </label>
        ))}
      </div>

      <div>
        <label>
          Comment:
          <input
            type="text"
            value={entry.comment}
            onChange={(e) => setEntry({ ...entry, comment: e.target.value })}
          />
        </label>
      </div>

      <button type="submit">Add Entry</button>
    </form>
  );
};

export default DiaryEntryForm;
