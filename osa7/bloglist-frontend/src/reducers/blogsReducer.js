import { createSlice } from '@reduxjs/toolkit'
import blogsService from '../services/blogs'
import { manageNotification } from './notificationReducer'
import { initializeUsers } from '../reducers/usersReducer'

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    likeBlog(state, action) {
      const id = action.payload
      const blogToLike = state.find((b) => b.id === id)
      const newState = { ...blogToLike, likes: blogToLike.likes + 1 }
      return state.map((blog) => (blog.id !== id ? blog : newState))
    },
    appendBlog(state, action) {
      state.push(action.payload)
    },
    setBlog(state, action) {
      return action.payload
    },
    delBlog(state, action) {
      const id = action.payload
      return state.filter((b) => b.id !== id)
    },
    commentBlog(state, action) {
      const blog = action.payload
      const id = blog.id
      const comments = blog.comments
      const blogToAddComment = state.find((b) => b.id === id)
      const newState = { ...blogToAddComment, comments: comments }
      return state.map((blog) => (blog.id !== id ? blog : newState))
    },
  },
})

export const { likeBlog, appendBlog, setBlog, delBlog, commentBlog } =
  blogsSlice.actions

export const removeBlog = (blog) => {
  return async (dispatch) => {
    try {
      await blogsService.remove(blog)
      dispatch(delBlog(blog.id))
    } catch (error) {
      dispatch(
        manageNotification(
          { message: 'only the creator can delete a blog', type: 'alert' },
          3000,
        ),
      )
    }
  }
}

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogsService.getAll()
    dispatch(setBlog(blogs))
  }
}

export const createBlog = (content) => {
  return async (dispatch) => {
    const newBlog = await blogsService.create(content)
    dispatch(appendBlog(newBlog))
    dispatch(initializeUsers())
  }
}

export const addLikeToBlog = (blog) => {
  return async (dispatch) => {
    await blogsService.update(blog)
    dispatch(likeBlog(blog.id))
  }
}

export const addCommentToBlog = (blog) => {
  return async (dispatch) => {
    const newBlog = await blogsService.update(blog)
    dispatch(commentBlog(newBlog))
  }
}

export default blogsSlice.reducer
