const Header = ({ course }) => {
  return(
    <h1>{course}</h1>
  );
}

const Part = ({ part, exercises }) => {
  return (
    <p>
      {part} {exercises}
    </p>
  );
}

const Content = ({parts}) => {

  return (
    <div>
      <Part part={parts[0].name} exercises={parts[0].exercises} />
      <Part part={parts[1].name} exercises={parts[1].exercises} />
      <Part part={parts[2].name} exercises={parts[2].exercises} />
    </div>
  );
}

const Total = ({parts})=> {
  let exe1 = parts[0].exercises;
  let exe2 = parts[1].exercises;
  let exe3 = parts[2].exercises;

  let total = exe1 + exe2 + exe3;
  return (
    <p>
    Number of exercises {total}
    </p>
  );
}

const App = () => {
  const course = 'Half Stack application development'
  const parts = [
    {
      name: 'Fundamentals of React',
      exercises: 10
    },
    {
      name: 'Using props to pass data',
      exercises: 7
    },
    {
      name: 'State of a component',
      exercises: 14
    }
  ]

  return (
    <div>
      <Header course={course} />
      <Content parts={parts} />
      <Total parts={parts} />
    </div>
  )
}

export default App