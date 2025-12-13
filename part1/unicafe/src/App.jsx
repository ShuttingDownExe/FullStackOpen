import {useState} from "react";

/**
 *
 * @param {function} onClick
 * @param {string} text
 * @returns {React.JSX.Element}
 */

const AddFeedback = ({onClick, text}) => {
    return(
        <button onClick={onClick}>{text}</button>
    )
}

/**
 *
 * @param {number} good
 * @param {number} neutral
 * @param {number} bad
 * @returns {React.JSX.Element}
 */

const DisplayFeedback = ({good, neutral,bad}) => {
    return(
        <>
            <tr>
                <td>good</td>
                <td>{good}</td>
            </tr>
            <tr>
                <td>neutral</td>
                <td>{neutral}</td>
            </tr>
            <tr>
                <td>bad</td>
                <td>{bad}</td>
            </tr>
        </>
    )
}

const StatisticLine = ({text, value}) => {
    return(
        <tr>
            <td>{text}</td>
            <td>{value}</td>
        </tr>
    )
}

/**
 *
 * @param {number} good
 * @param {number} neutral
 * @param {number} bad
 */
const DisplayStatistics = ({good, neutral, bad}) => {
    const total = good+neutral+bad;
    const average = (good - bad) / total;
    const positive = (good/total)*100;

    return(
        <>
            <StatisticLine text={"total"} value={total} />
            <StatisticLine text={"average"} value={average} />
            <StatisticLine text={"positive"} value={positive} />
        </>
    )
}

/**
 *
 * @param {number} good
 * @param {number} neutral
 * @param {number} bad
 * @returns {React.JSX.Element}
 */

const DisplayInformation = ({good, neutral, bad}) => {
    if(good===0 && neutral===0 && bad===0){
        return (
            <p>No feedback given</p>
        )
    }

    return(
        <table>
            <tbody>
                <DisplayFeedback good={good} neutral={neutral} bad={bad}/>
                <DisplayStatistics good={good} neutral={neutral} bad={bad}/>
            </tbody>
        </table>
    )
}

const App = () => {
    const [good, setGood] = useState(0);
    const [neutral, setNeutral] = useState(0);
    const [bad, setBad] = useState(0);

    const feedback = {
        good: {
            type: "good",
            count: good,
            onClick: () => {
                setGood(good + 1);
            }
        },
        neutral: {
            type: "neutral",
            count: neutral,
            onClick: () => {
                setNeutral(neutral + 1);
            }
        },
        bad: {
            type: "bad",
            count: bad,
            onClick: () => {
                setBad(bad + 1);
            }
        }
    }

    return (
        <>
            <div>
                <h1>give feedback</h1>
                <AddFeedback text={feedback.good.type} onClick={() => feedback.good.onClick()}/>
                <AddFeedback text={feedback.neutral.type} onClick={() => feedback.neutral.onClick()}/>
                <AddFeedback text={feedback.bad.type} onClick={() => feedback.bad.onClick()}/>
            </div>
            <div>
                <h1>statistics</h1>
                <DisplayInformation good={good} neutral={neutral} bad={bad}/>
            </div>
        </>
    )
}

export default App