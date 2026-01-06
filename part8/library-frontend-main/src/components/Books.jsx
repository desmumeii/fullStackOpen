import { useState } from "react";

const Books = ({ show, books }) => {
  const [genre, setGenre] = useState(null);

  const genres = [...new Set(books.flatMap((b) => b.genres))];

  const booksToShow = genre
    ? books.filter((b) => b.genres.includes(genre))
    : books;

  if (!show) {
    return null;
  }
  const handleGenreClick = async (g) => {
    setGenre(g);
  };
  return (
    <div>
      <h2>books</h2>
      {genre && (
        <p>
          in genre <strong>{genre}</strong>
        </p>
      )}
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksToShow.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 20 }}>
        {genres.map((g) => (
          <button
            key={g}
            onClick={() => handleGenreClick(g)}
            style={{ marginRight: 5 }}
          >
            {g}
          </button>
        ))}
        <button onClick={() => handleGenreClick(null)}>all genres</button>
      </div>
    </div>
  );
};

export default Books;
