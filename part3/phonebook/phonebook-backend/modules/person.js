const { default: mongoose } = require("mongoose");

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URL

mongoose.connect(url, {family: 4})
.then(response => {
    console.log("Connected to MongoDB")
    console.log(`${response}`)
}).catch(err => {
    console.log("Failed to connect to MongoDB")
    console.log(`${err}`)
})

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: String
})

personSchema.set('toJSON', {
    transform: (_,returnedObject) => {
        returnedObject.id = returnedObject._id.toString(),
        delete returnedObject._id,
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)