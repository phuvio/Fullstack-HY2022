// import { useDispatch, useSelector } from 'react-redux'
import { connect } from 'react-redux'
import { changeFilter } from '../reducers/filterReducer'

const Filter = (props) => {
  /* const filter = useSelector(state => state.filter)

  const dispatch = useDispatch()

  const handleChange = (event) => {
    event.preventDefault()
    dispatch(changeFilter(event.target.value))
  } */

  const filterToShow = () => {
    return (
      <>
        <div>filter
          <input
            value={props.filter}
            onChange={(event) => props.changeFilter(event.target.value)}
          />
        </div>
      </>
    )
  }

  return (
    <>
      {filterToShow()}
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
  changeFilter
}

const ConnectedFilter = connect(mapStateToProps, mapDispatchToProps)(Filter)
export default ConnectedFilter