import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: null,
  reducers: {
    setNotification(state, action) {
      const content = action.payload
      return content
    },
    removeNotification() {
      return null
    },
  },
})

let timeoutId
export const manageNotification = (content, timeout) => {
  return (dispatch) => {
    dispatch(setNotification(content))
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      dispatch(removeNotification())
    }, timeout)
  }
}

export const { setNotification, removeNotification } = notificationSlice.actions
export default notificationSlice.reducer
