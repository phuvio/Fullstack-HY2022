import React from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import {
  TableContainer,
  Typography,
  Table,
  TableRow,
  TableCell,
} from '@mui/material'

const UserDetails = () => {
  const users = useSelector((state) => state.users)

  const id = useParams().id
  const user = users.find((u) => u.id === id)

  if (!user) {
    return null
  }

  return (
    <>
      <Typography variant="h4" component="h4" sx={{ m: 1 }}>
        {user.name}
      </Typography>
      <Typography variant="h5" component="h5" sx={{ m: 1 }}>
        added blogs
      </Typography>
      <TableContainer>
        <Table>
          {[...user.blogs].map((blog) => (
            <TableRow key={blog.id}>
              <TableCell>{blog.title}</TableCell>
            </TableRow>
          ))}
        </Table>
      </TableContainer>
    </>
  )
}

export default UserDetails
