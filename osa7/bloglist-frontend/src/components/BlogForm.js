import React from 'react'
import { createBlog } from '../reducers/blogsReducer'
import { manageNotification } from '../reducers/notificationReducer'
import { useDispatch } from 'react-redux'
import { setVisibility } from '../reducers/blogCreationVisibility'
import { TextField, Button, Typography } from '@mui/material/node'

const BlogForm = () => {
  const dispatch = useDispatch()

  const addBlog = async (event) => {
    event.preventDefault()
    const title = event.target.title.value
    const author = event.target.author.value
    const url = event.target.url.value
    const content = {
      title: title,
      author: author,
      url: url,
    }
    event.target.title.value = ''
    event.target.author.value = ''
    event.target.url.value = ''
    dispatch(
      manageNotification(
        { message: `new blog ${title} by ${author} created`, type: 'info' },
        3000,
      ),
    )
    dispatch(createBlog(content))
    dispatch(setVisibility(false))
  }

  const toggleVisibility = () => {
    dispatch(setVisibility(false))
  }

  return (
    <>
      <div>
        <Typography variant="h5" component="h5" sx={{ m: 0.5 }}>
          create new
        </Typography>
        <form onSubmit={addBlog}>
          <div>
            <TextField
              label="title"
              variant="standard"
              className="blogForm"
              type="text"
              name="title"
              id="title-input"
            />
            <br></br>
            <TextField
              label="author"
              variant="standard"
              className="blogForm"
              type="text"
              name="author"
              id="author-input"
            />
            <br></br>
            <TextField
              label="url"
              variant="standard"
              className="blogForm"
              name="url"
              id="url-input"
            />
          </div>
          <div>
            <Button
              variant="contained"
              sx={{ m: 1 }}
              size="small"
              color="primary"
              id="submit-button"
              type="submit"
            >
              create
            </Button>
            <Button
              variant="contained"
              sx={{ m: 1 }}
              color="primary"
              size="small"
              onClick={toggleVisibility}
            >
              cancel
            </Button>
          </div>
        </form>
      </div>
    </>
  )
}

export default BlogForm
