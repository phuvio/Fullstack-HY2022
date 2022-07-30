import { useSelector, useDispatch } from 'react-redux'
import { updateAnecdote } from '../reducers/anecdoteReducer'
import { manageNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector(state => {
    if (state.filter === '') {
      return state.anecdotes
    }
    const filteredAnecdotes = state.anecdotes.filter(a => a.content.toLowerCase().includes(state.filter.toLowerCase()))
    console.log(filteredAnecdotes)
    return filteredAnecdotes
  })
  console.log(anecdotes)
  const dispatch = useDispatch()

  const vote = (anecdote) => {
    dispatch(updateAnecdote(anecdote))
    dispatch(manageNotification(`you voted '${anecdote.content}'`, 5000))
  }

  const compareVotes = (a, b) => {
    return (b.votes - a.votes)
  }

  return (
    <>
      {[...anecdotes].sort(compareVotes).map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </>
  )
}

export default AnecdoteList