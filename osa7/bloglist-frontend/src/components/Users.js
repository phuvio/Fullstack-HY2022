import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  Table,
  TableContainer,
  TableBody,
  TableRow,
  TableCell,
  Typography,
} from '@mui/material'
import { TableHead } from '@mui/material/node'

const Users = () => {
  const users = useSelector((state) => state.users)

  return (
    <>
      <Typography variant="h4" component="h4" sx={{ m: 1 }}>
        Users
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableCell>&nbsp;</TableCell>
            <TableCell>
              <strong>blogs created</strong>
            </TableCell>
          </TableHead>
          <TableBody>
            {[...users]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((user) => (
                <TableRow className="user" key={user.id}>
                  <TableCell>
                    <Link to={`/users/${user.id}`}>{user.name}</Link>
                  </TableCell>
                  <TableCell>{user.blogs.length}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  )
}

export default Users
