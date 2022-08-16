import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders content', () => {
  const blog = {
    title: 'Component testing',
    author: 'react-testing-library',
    url: 'http://blogi.fi',
    likes: 1,
    user: '62d004c40885f7a494147b47',
  }

  render(<Blog blog={blog} />)

  const element = screen.findByText('Component testing')
  expect(element).toBeDefined()
})

test('rendes title and author, but not url nor like', () => {
  const blog = {
    title: 'Component testing',
    author: 'react-testing-library',
    url: 'http://blogi.fi',
    likes: 1,
    user: '62d004c40885f7a494147b47',
  }

  render(<Blog blog={blog} visible={false} />)

  screen.findByText('Component testing')
  screen.findByText('react-testing-library')
  const url = screen.queryByText('http://blogi.fi')
  expect(url).toBeNull()
  const like = screen.queryByText('1')
  expect(like).toBeNull()
})

test('url ja likes are shown after clicking the view button', async () => {
  const blog = {
    title: 'Component testing',
    author: 'react-testing-library',
    url: 'http://blogi.fi',
    likes: 1,
    user: '62d004c40885f7a494147b47',
  }

  const mockHandler = jest.fn()

  render(<Blog blog={blog} visible={false} changeVisibility={mockHandler} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  screen.findByText('Component testing')
  screen.findByText('react-testing-library')
  screen.findByText('http://blogi.fi')
  screen.findByText('1')
})

test('clicking button like two times calls event handler twice', async () => {
  const blog = {
    title: 'Component testing',
    author: 'react-testing-library',
    url: 'http://blogi.fi',
    likes: 1,
    user: '62d004c40885f7a494147b47',
  }

  const mockHandler = jest.fn()

  render(
    <Blog
      blog={blog}
      visible={false}
      changeVisibility={mockHandler}
      updateBlog={mockHandler}
    />,
  )

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})
