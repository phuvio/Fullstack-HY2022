import React from 'react'
import { useSelector } from 'react-redux'
import { Alert } from '@mui/material'

const Notification = () => {
  const notification = useSelector((state) => state.notification)

  if (notification === null) {
    return null
  }

  /* const style = {
    color: notification.type === 'alert' ? 'red' : 'green',
    fontSize: 20,
    padding: 10,
    borderStyle: 'solid',
    borderRadius: 8,
    background: 'lightgrey',
    marginBottom: 10,
  } */

  if (notification.type === 'alert') {
    return (
      <div className="error">
        <Alert severity="error">{notification.message}</Alert>
      </div>
    )
  }

  return (
    <div className="error">
      <Alert severity="success">{notification.message}</Alert>
    </div>
  )
}

export default Notification
