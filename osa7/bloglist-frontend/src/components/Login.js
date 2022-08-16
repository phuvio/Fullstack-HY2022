import React from 'react'
import Notification from '../components/Notification'
import { useDispatch } from 'react-redux'
import loginService from '../services/login'
import blogService from '../services/blogs'
import { manageNotification } from '../reducers/notificationReducer'
import { setCurrentUser } from '../reducers/currentUserReducer'
import { TextField, Button, Typography } from '@mui/material'

const Login = () => {
  const dispatch = useDispatch()

  const handleLogin = async (event) => {
    event.preventDefault()
    const username = event.target.username.value
    const password = event.target.password.value
    try {
      const user = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      event.target.username.value = ''
      event.target.password.value = ''
      dispatch(
        setCurrentUser(
          JSON.parse(window.localStorage.getItem('loggedBlogappUser')),
        ),
      )
    } catch (exception) {
      dispatch(
        manageNotification(
          { message: 'wrong username or password', type: 'alert' },
          3000,
        ),
      )
    }
  }

  return (
    <>
      <Notification />
      <Typography variant="h3" component="h3" sx={{ m: 1 }}>
        log in to application
      </Typography>
      <form onSubmit={handleLogin}>
        <div>
          <TextField
            id="username"
            type="text"
            name="Username"
            label="username"
            variant="filled"
          />
        </div>
        <div>
          <TextField
            id="password"
            type="password"
            name="Password"
            label="password"
            variant="filled"
          />
        </div>
        <Button
          id="login-button"
          type="submit"
          variant="contained"
          color="primary"
        >
          login
        </Button>
      </form>
    </>
  )
}

export default Login
