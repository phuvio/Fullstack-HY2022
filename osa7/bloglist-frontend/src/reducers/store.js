import { configureStore } from '@reduxjs/toolkit'
import blogsReducer from './blogsReducer'
import notificationReducer from './notificationReducer'
import visibilityReducer from './blogCreationVisibility'
import usersReducer from './usersReducer'
import currentUserReducer from './currentUserReducer'

const store = configureStore({
  reducer: {
    blogs: blogsReducer,
    notification: notificationReducer,
    visibility: visibilityReducer,
    users: usersReducer,
    currentUser: currentUserReducer,
  },
})

export default store
