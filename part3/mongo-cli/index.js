const mongoose = require('mongoose')

const userArgs = process.argv.slice(2)
if (!(userArgs.length === 1 || userArgs.length === 3)) {
    console.log('invalid')
    process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://fullstack:${password}@cluster0.ntemfgm.mongodb.net/phoneBook?appName=Cluster0`

mongoose.set('strictQuery', false)

const personSchema = new mongoose.Schema({
    Name: String,
    Number: String
})

const Person = mongoose.model('person', personSchema)

mongoose.connect(url, {family: 4})
.then(() => {
    if(userArgs.length === 1){
        return Person.find({}).then(response => {response.forEach(person => console.log(person))})
    } else {
        const person = new Person({
            Name: userArgs[0],
            Number: userArgs[1]
        })
        return person.save()
            .then(response => console.log(`Response ${response}`))
    }
})
.catch(err => {
    console.log(`Error ${err}`)
    process.exit(1)
})
.finally(() => mongoose.connection.close())