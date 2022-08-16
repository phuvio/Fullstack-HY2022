import { createSlice } from '@reduxjs/toolkit'

const blogCreationVisibilitySlice = createSlice({
  name: 'blogCreationVisibility',
  initialState: false,
  reducers: {
    setVisibility(state, action) {
      const visibility = action.payload
      return visibility
    },
  },
})

export const { setVisibility } = blogCreationVisibilitySlice.actions
export default blogCreationVisibilitySlice.reducer
