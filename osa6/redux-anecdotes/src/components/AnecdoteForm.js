// import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { manageNotification } from '../reducers/notificationReducer'
import { connect } from 'react-redux'

const AnecdoteForm = (props) => {
  /* const dispatch = useDispatch()

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    dispatch(manageNotification(`you created anecdote '${content}'`, 5000))
    dispatch(createAnecdote(content))
  } */

  const addAnecdote = async (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    props.manageNotification(`you created anecdote '${content}'`, 5000)
    props.createAnecdote(content)
  }

  const anecdoteToCreate = () => {
    return (
      <>
        <h2>create new</h2>
        <form onSubmit={addAnecdote}>
          <div><input name='anecdote' /></div>
          <button type='submit'>create</button>
        </form>
      </>
    )
  }

  return (
    <>
      {anecdoteToCreate()}
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

const mapDispatchToProps = {
  createAnecdote,
  manageNotification
}

const ConnectedAnecdoteForm = connect(mapStateToProps, mapDispatchToProps)(AnecdoteForm)
export default ConnectedAnecdoteForm