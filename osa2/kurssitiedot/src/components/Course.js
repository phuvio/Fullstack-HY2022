const Header = ({ name }) => <h3>{name}</h3>

const Total = ({ total }) => <p><strong>total of {total} exercises</strong></p>

const Content = ({ parts }) => 
  parts.map(part => <Part key={part.id} part={part} />)

const Part = ({ part }) =>
  <p>
    {part.name} {part.exercises}
  </p>

const Title = ({id}) => {
  if (id === 1) {
    return (<h1>Web development curriculum</h1>)
  }
}

const Course = ({ course, total }) => 
  <>
    <Title id={course.id} />
    <Header name={course.name} />
    <Content parts={course.parts} />    
    <Total total={total} />  
  </>

export default Course