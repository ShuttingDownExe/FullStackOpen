/**
 * @typedef {Object} part
 * @property {string} name
 * @property {number} exercises
 * @property {number} id
 *
 * @typedef {Object} course
 * @property {string} name
 * @property {number} id
 * @property {Array<part>} parts
 *
 */


/**
 * @param {{ parts: part[]}}
 */

const Total = ({parts}) => {
    return (
        <p>
            Number of exercises {
            parts.reduce(
                (sum, part) => sum + part.exercises,0
            )
        }
        </p>
    )
}

const Part = ({part}) => {
    return(
        <p>{part.name} {part.exercises}</p>
    )
}


const CourseInfo = ({course}) => {
    return (
        <>
            <h1>{course.name}</h1>
            {
                course.parts.map(
                    part => <Part key={part.id} part={part}/>
                )
            }
            <Total parts={course.parts}/>
        </>
    )
}

/**
 * @param {{ courses: Array<course>}}
 */

const Course = ({courses}) => {
    return (
        <>
            {
                courses.map(c =>
                    <CourseInfo key={c.id} course={c}/>
                )
            }
        </>
    )
}

export default Course