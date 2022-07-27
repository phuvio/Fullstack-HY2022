import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const user = userEvent.setup()
  const createBlog = jest.fn()

  const { container } = render(<BlogForm createBlog={createBlog} />)

  const title = container.querySelector('#title-input')
  await user.type(title, 'Component testing')
  const author = container.querySelector('#author-input')
  await user.type(author, 'react-testing-library')
  const url = container.querySelector('#url-input')
  await user.type(url, 'http://blogi.fi')

  const submit = screen.getByText('create')
  await user.click(submit)

  expect(createBlog).toHaveBeenCalled()
  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Component testing')
  expect(createBlog.mock.calls[0][0].author).toBe('react-testing-library')
  expect(createBlog.mock.calls[0][0].url).toBe('http://blogi.fi')
})