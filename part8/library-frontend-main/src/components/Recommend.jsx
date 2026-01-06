const Recommended = ({ show, books, favoriteGenre }) => {
  if (!show) return null;
  if (!favoriteGenre) return <div>loading...</div>;

  const recommendedBooks = books.filter((b) =>
    b.genres.includes(favoriteGenre),
  );

  return (
    <div>
      <h2>recommended</h2>

      <p>
        books in your favorite genre <strong>{favoriteGenre}</strong>
      </p>

      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>
          {recommendedBooks.map((b) => (
            <tr key={b.id}>
              <td>{b.title}</td>
              <td>{b.author.name}</td>
              <td>{b.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Recommended;
