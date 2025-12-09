import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, test, expect } from 'vitest'
import BlogForm from './BlogForm'

test('new blog form calls createBlog with correct details', async () => {
  const user = userEvent.setup()
  const mockHandler = vi.fn()

  render(<BlogForm createBlog={mockHandler} />)

  // Select inputs by their role – BlogForm has 3 textboxes in order
  const inputs = screen.getAllByRole('textbox')
  const titleInput = inputs[0]
  const authorInput = inputs[1]
  const urlInput = inputs[2]

  const createButton = screen.getByText(/create/i)

  await user.type(titleInput, 'Testing React components')
  await user.type(authorInput, 'Jane Doe')
  await user.type(urlInput, 'http://example.com/react-testing')
  await user.click(createButton)

  expect(mockHandler).toHaveBeenCalledTimes(1)
  expect(mockHandler).toHaveBeenCalledWith({
    title: 'Testing React components',
    author: 'Jane Doe',
    url: 'http://example.com/react-testing'
  })
})
