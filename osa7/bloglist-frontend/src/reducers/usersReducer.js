import { createSlice } from '@reduxjs/toolkit'

import usersService from '../services/users'

const usersSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {
    setUser(state, action) {
      return action.payload
    },
    removeBlogFromUser(state, action) {
      const content = action.payload
      const blogID = content.id
      const userID = content.user.id
      const newState = state.map((user) =>
        user.id !== userID
          ? user
          : { ...user, blogs: user.blogs.filter((blog) => blog.id !== blogID) },
      )
      return newState
    },
  },
})

export const { setUser, removeBlogFromUser } = usersSlice.actions

export const initializeUsers = () => {
  return async (dispatch) => {
    const users = await usersService.getAll()
    dispatch(setUser(users))
  }
}

export default usersSlice.reducer
