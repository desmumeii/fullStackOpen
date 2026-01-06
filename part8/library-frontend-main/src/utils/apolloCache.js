import { ALL_BOOKS } from '../queries'
import { ALL_AUTHORS } from '../queries'

export const addBookToCache = (cache, bookToAdd) => {
  cache.updateQuery({ query: ALL_BOOKS }, ({ allBooks }) => {
    const bookExists = allBooks.some(
      (book) => book.id === bookToAdd.id,
    )

    if (bookExists) {
      return { allBooks }
    }

    return {
      allBooks: allBooks.concat(bookToAdd),
    }
  })

  cache.updateQuery({ query: ALL_AUTHORS }, ({ allAuthors }) => {
    const authorExists = allAuthors.some(
      a => a.name === bookToAdd.author.name
    )

    if (authorExists) {
      return { allAuthors }
    }

    return {
      allAuthors: allAuthors.concat(bookToAdd.author)
    }
  })
}