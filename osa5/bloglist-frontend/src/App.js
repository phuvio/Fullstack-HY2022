import React from 'react'
import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import Login from './components/Login'
import blogService from './services/blogs'
import loginService from './services/login'
import './index.css'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const notify = (message, type='info') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 3000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      notify('wrong username or password', 'alert')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken('')
    setUser(null)
  }

  const compareLikes = (a, b) => {
    return (b.likes - a.likes)
  }

  const updateBlog = async (blog) => {
    const newBlog = {
      author: blog.author,
      id: blog.id,
      title: blog.title,
      url: blog.url,
      likes: blog.likes + 1
    }
    try {
      const updatedBlog = await blogService.update(newBlog)
      setBlogs(blogs.map(blog => blog.id !== updatedBlog.id ? blog : updatedBlog))
    } catch (error) {
      notify (`could not update blog ${newBlog.title}`, 'alert')
    }
  }

  const addBlog = async (blogObject) => {
    try {
      const savedBlog = await blogService.create(blogObject)
      blogFormRef.current.toggleVisibility()
      setBlogs(blogs.concat(savedBlog))
      notify(`a new blog ${blogObject.title} by ${blogObject.author} added`)
    } catch (error) {
      notify(
        'could not save, title and url are needed', 'alert'
      )
    }
  }

  const removeBlog = async (blog) => {
    const toRemove = blogs.find(b => b.id === blog.id)
    const ok = window.confirm(`Remove blog ${toRemove.title} by ${toRemove.author}?`)
    if (ok) {
      try {
        await blogService.remove(blog)
        setBlogs(blogs.filter(b => b.id !== blog.id))
        notify(`Removed blog ${blog.title} by ${blog.author}`)
      } catch (error) {
        notify ('only the creator can delete a blog', 'alert')
      }
    }
  }

  const blogFormRef = useRef()

  if (user === null) {
    return (
      <>
        <h2>log in to application</h2>
        <Notification notification={notification} />

        <Login
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          handleLogin={handleLogin}
        />
      </>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification} />

      <p>
        {user.name} logged in
        <button type="logout" onClick={() => handleLogout()}>logout</button>
      </p>

      <Togglable buttonlabel="new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>

      {blogs.sort(compareLikes).map(blog =>
        <Blog key={blog.id} blog={blog} updateBlog={updateBlog} removeBlog={removeBlog} />
      )}
    </div>
  )
}

export default App
