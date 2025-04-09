const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://syntaxmonkey2px:${password}@cluster0.4ko9m.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

console.log('Connecting to:', url); // Debugging the URL

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('person', personSchema)

const person = new Person({
  name: 'banana turle',
  number: '8312-12432-5324',
})

person.save().then(result => {
  console.log('person saved!')
  mongoose.connection.close()
})

Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })