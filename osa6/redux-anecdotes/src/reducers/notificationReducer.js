import { createSlice } from '@reduxjs/toolkit'

const initialState = null

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotification(state, action) {
      const content = action.payload
      return content
    },
    removeNotification() {
      return null
    }
  }
})

let timeoutID
export const manageNotification = (content, timeout) => {
  return (dispatch) => {
    dispatch(setNotification(content))
    if (timeoutID) clearTimeout(timeoutID)
    timeoutID = setTimeout(() => {
      dispatch(removeNotification())
    }, timeout)
  }
}

export const { setNotification, removeNotification } = notificationSlice.actions
export default notificationSlice.reducer