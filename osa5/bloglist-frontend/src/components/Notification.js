import React from 'react'

const Notification = ({ notification }) => {
  if (notification === null) {
    return null
  }

  const style = {
    color: notification.type === 'alert' ? 'red' : 'green',
    fontSize: 20,
    padding: 10,
    borderStyle: 'solid',
    borderRadius: 8,
    background: 'lightgrey',
    marginBottom: 10,
  }

  return (
    <div className="error" style={style}>
      {notification.message}
    </div>
  )
}

export default Notification