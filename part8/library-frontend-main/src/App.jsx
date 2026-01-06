import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Recommended from './components/Recommend'
import { useMutation, useQuery, useApolloClient, useSubscription } from '@apollo/client/react'
import { ALL_AUTHORS, ALL_BOOKS, ADD_BOOK, ME, BOOK_ADDED } from './queries'
import LoginForm from './components/LoginForm'
import { addBookToCache } from './utils/apolloCache'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(localStorage.getItem('library-user-token') || null)
  const client = useApolloClient()

  const authorsResult = useQuery(ALL_AUTHORS)
  const booksResult = useQuery(ALL_BOOKS)
  const addBookResult = useMutation(ADD_BOOK)
  

  const meResult = useQuery(ME, { skip: !token, fetchPolicy: 'network-only' })
  const favoriteGenre = token && meResult.data?.me ? meResult.data.me.favoriteGenre : null
  const allBooks = booksResult.data?.allBooks || []

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded
      window.alert(`New book added: ${addedBook.title} by ${addedBook.author.name}`)
      addBookToCache(client.cache, addedBook)
    }
  })
  if (authorsResult.loading || booksResult.loading || (token && meResult.loading)) {
    return <div>loading...</div>
  }

  

  const onLogout = () => {
    setPage('authors')
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }
  const handleLogin = (token) => {
    setToken(token)
    setPage('authors')
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {!token && <button onClick={() => setPage('login')}>login</button>}
        {!token && page === 'login' && (
          <LoginForm setToken={handleLogin} setError={() => {}} />
        )}
        
        {token && <button onClick={() => setPage('add')}>add book</button>}
        {token && <button onClick={onLogout}>logout</button>}
        {token && <button onClick={() => setPage('recommend')}>recommend</button>}
      </div>

      <Authors show={page === 'authors'} authors={authorsResult.data.allAuthors} token={token} />
      <Books show={page === 'books'} books={booksResult.data.allBooks || []} />
      <NewBook show={page === 'add'} addBookResult={addBookResult} />
      <Recommended show={page === 'recommend'} books={allBooks} favoriteGenre={favoriteGenre} />
    </div>
  )
}

export default App
