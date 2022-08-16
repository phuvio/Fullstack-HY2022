import React from 'react'
import { useDispatch } from 'react-redux'
import { manageNotification } from '../reducers/notificationReducer'
import {
  addCommentToBlog,
  addLikeToBlog,
  removeBlog,
} from '../reducers/blogsReducer'
import { useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { removeBlogFromUser } from '../reducers/usersReducer'
import {
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Button,
  Typography,
} from '@mui/material'

const BlogDetails = () => {
  const blogs = useSelector((state) => state.blogs)

  const id = useParams().id
  const blog = blogs.find((b) => b.id === id)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const likeBlog = (blog) => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id,
    }
    dispatch(addLikeToBlog(updatedBlog))
  }

  const deleteBlog = async (blog) => {
    const ok = window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)
    if (ok) {
      dispatch(
        manageNotification(
          {
            message: `Removed blog ${blog.title} by ${blog.author}`,
            type: 'info',
          },
          3000,
        ),
      )
      dispatch(removeBlog(blog))
      dispatch(removeBlogFromUser(blog))
      navigate('/')
    }
  }

  const addComment = async (event) => {
    event.preventDefault()
    const comment = event.target.comment.value
    event.target.comment.value = ''
    const newComment = {
      comment: comment,
      commentId: Number(Math.floor(Math.random() * 100000)),
    }
    const updatedBlog = {
      ...blog,
      user: blog.user.id,
      comments: blog.comments.concat(newComment),
    }
    dispatch(addCommentToBlog(updatedBlog))
  }

  return (
    <>
      <Typography variant="h4" component="h4" sx={{ m: 1 }}>
        {blog.title} {blog.author}
      </Typography>
      <Typography>
        <a href={blog.url}>{blog.url}</a>
      </Typography>
      <Typography>
        {blog.likes} likes
        <Button
          variant="contained"
          color="primary"
          size="small"
          sx={{ m: 0.3 }}
          onClick={() => likeBlog(blog)}
        >
          like
        </Button>
      </Typography>
      <Typography>added by {blog.user.name}</Typography>
      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={() => deleteBlog(blog)}
      >
        remove
      </Button>
      <form onSubmit={addComment}>
        <div>
          <input type="text" name="comment" />
          <Button type="submit">add comment</Button>
        </div>
      </form>
      <Typography variant="h5" component="h5" sx={{ m: 1 }}>
        comments
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {blog.comments.map((comment) => (
              <TableRow key={comment._id}>
                <TableCell>{comment.comment}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default BlogDetails
