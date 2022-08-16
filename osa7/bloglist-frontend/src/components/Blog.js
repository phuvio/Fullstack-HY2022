import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { setVisibility } from '../reducers/blogCreationVisibility'
import BlogForm from '../components/BlogForm'
import {
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Button,
} from '@mui/material'

const Blog = () => {
  const blogs = useSelector((state) => state.blogs)
  const visibility = useSelector((state) => state.visibility)
  const dispatch = useDispatch()

  const compareLikes = (a, b) => {
    return b.likes - a.likes
  }

  const toggleVisibility = () => {
    dispatch(setVisibility(true))
  }

  return (
    <>
      {visibility ? (
        <BlogForm />
      ) : (
        <Button variant="contained" size="small" onClick={toggleVisibility}>
          new blog
        </Button>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {[...blogs].sort(compareLikes).map((blog) => (
              <TableRow className="blog" key={blog.id}>
                <TableCell>
                  <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                </TableCell>
                <TableCell>{blog.author}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default Blog

Blog.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    likes: PropTypes.number.isRequired,
    user: PropTypes.shape({
      username: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
    }),
  }),
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }),
}
