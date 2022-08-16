import { createSlice } from '@reduxjs/toolkit'

const initialState = JSON.parse(
  window.localStorage.getItem('loggedBlogappUser'),
)
console.log(initialState)

const currentUserSlice = createSlice({
  name: 'currentUser',
  initialState: initialState,
  reducers: {
    setCurrentUser(state, action) {
      const user = action.payload
      return user
    },
    removeCurrentUser() {
      return null
    },
  },
})

export const { setCurrentUser, removeCurrentUser } = currentUserSlice.actions
export default currentUserSlice.reducer
