// import { useSelector  } from 'react-redux'
import { connect } from 'react-redux'

const Notification = (props) => {
  /* const notification = useSelector(state => state.notifications)

  if (notification === null) {
    return null
  } */

  const notificationToShow = () => {
    if (props.notifications === null) {
      return null
    }

    const style = {
      border: 'solid',
      padding: 10,
      borderWidth: 1
    }

    return (
      <div style={style}>
        {props.notifications}
      </div>
    )
  }

  return (
    <>
      {notificationToShow()}
    </>
  )
}

const mapStateToProps = (state) => {
  return {
    anecdotes: state.anecdotes,
    notifications: state.notifications,
    filter: state.filter
  }
}

const ConnectedNotification = connect(mapStateToProps)(Notification)
export default ConnectedNotification