import React from 'react'
import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const addBlog = async (event) => {
    event.preventDefault()

    createBlog({
      title: newTitle.trim(),
      author: newAuthor.trim(),
      url: newUrl.trim()
    })

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <>
      <div>
        <h2>
          create new
        </h2>
        <form onSubmit={addBlog}>
          <div>
            title: <input
              className="blogForm"
              type="text"
              value={newTitle}
              onChange={({ target }) => setNewTitle(target.value)}
              id='title-input'
            />
            <br></br>
            author: <input
              className="blogForm"
              type="text"
              value={newAuthor}
              onChange={({ target }) => setNewAuthor(target.value)}
              id='author-input'
            />
            <br></br>
            url: <input
              className="blogForm"
              value={newUrl}
              onChange={({ target }) => setNewUrl(target.value)}
              id='url-input'
            />
          </div>
          <div>
            <button id='submit-button' type="submit">create</button>
          </div>
        </form>
      </div>
    </>
  )
}

export default BlogForm