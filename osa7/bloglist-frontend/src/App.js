import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Blog from './components/Blog'
import Users from './components/Users'
import Notification from './components/Notification'
import Login from './components/Login'
import BlogDetails from './components/BlogDetails'
import UserDetails from './components/UserDetails'
import blogService from './services/blogs'
import { initializeBlogs } from './reducers/blogsReducer'
import { initializeUsers } from './reducers/usersReducer'
import {
  removeCurrentUser,
  setCurrentUser,
} from './reducers/currentUserReducer'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from 'react-router-dom'
import { Container, AppBar, Toolbar, Button, Typography } from '@mui/material'

const App = () => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs())
    dispatch(initializeUsers())
  }, [dispatch])

  const currentUser = useSelector((state) => state.currentUser)

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setCurrentUser(user))
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken('')
    dispatch(removeCurrentUser())
  }

  if (currentUser === null) {
    return (
      <Router>
        <>
          <Login />
        </>
      </Router>
    )
  }

  return (
    <Container>
      <Router>
        <div>
          <Notification />
        </div>

        <AppBar position="static">
          <Toolbar>
            <Button color="inherit" component={Link} to="/">
              blogs
            </Button>
            <Button color="inherit" component={Link} to="/users">
              users
            </Button>
            <Typography variant="overline" align="right" style={{ flex: 1 }}>
              {currentUser.name} logged in
              <Button
                variant="contained"
                size="small"
                sx={{ m: 1 }}
                color="secondary"
                type="logout"
                onClick={() => handleLogout()}
              >
                logout
              </Button>
            </Typography>
          </Toolbar>
        </AppBar>
        <div>
          <Typography variant="h3" component="h3" sx={{ m: 1 }}>
            blog app
          </Typography>
        </div>

        <Routes>
          <Route path="/blogs/:id" element={<BlogDetails />} />
          <Route path="/blogs" element={<Blog />} />
          <Route path="/users/:id" element={<UserDetails />} />
          <Route path="/users" element={<Users />} />
          <Route path="/" element={<Navigate replace to="/blogs" />} />
        </Routes>
      </Router>
    </Container>
  )
}

export default App
