import { render, screen } from '@testing-library/react'
import Blog from './Blog.jsx'
import { expect } from 'vitest'

test('renders content', async () => {
    const blog = {
        title: 'Testing React components',
        author: 'Jane Doe',
        url: 'http://example.com/react-testing',
        likes: 42,
        user: {
            name: 'John Smith'
        }
    }

    const dummyUser = { username: 'anotherUser' }
    const mockLike = vi.fn()
    const mockDelete = vi.fn()

    render(<Blog blog={blog} user={dummyUser} handleLike={mockLike} handleDelete={mockDelete} />)

    const titleElement = screen.getByText('Testing React components', { exact: false })
    const authorElement = screen.getByText('Jane Doe', { exact: false })
    const urlElement = screen.queryByText('http://example.com/react-testing')
    const likesElement = screen.queryByText('likes 42')

    expect(titleElement).toBeVisible()
    expect(authorElement).toBeVisible()
    expect(urlElement).toBeNull()
    expect(likesElement).toBeNull()
})
