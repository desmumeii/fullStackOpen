import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Togglable from './Togglable'
import { expect, test, vi } from 'vitest'

test('renders its children only after button click', async () => {
  const user = userEvent.setup()

  render(
    <Togglable buttonLabel="show details">
      <div className="testContent">
        http://example.com/react-testing
        <br />
        likes 42
      </div>
    </Togglable>
  )

  const content = screen.getByText(/http:\/\/example.com/i)
  expect(content).not.toBeVisible()

  const button = screen.getByText('show details')
  await user.click(button)

  expect(content).toBeVisible()

  const cancelButton = screen.getByText('cancel')
  await user.click(cancelButton)

  expect(content).not.toBeVisible()
})

test('like button calls event handler twice when clicked twice', async () => {
  const user = userEvent.setup()
  const mockHandler = vi.fn()

  render(
    <Togglable buttonLabel="show details">
      <button onClick={mockHandler}>like</button>
    </Togglable>
  )

  const toggleButton = screen.getByText('show details')
  await user.click(toggleButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler).toHaveBeenCalledTimes(2)
})
