require('dotenv').config()
console.log('MONGODB_URI:', process.env.MONGODB_URI); // Debugging the URI

const express = require('express')
const Person = require('./models/person')

const app = express()

app.use(express.json());


app.get('/api/persons', (request, response)=>{
    response.json(persons)
})



app.get('/api/persons/:id', (request, response)=>{
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if(person){
        response.json(person)
    }else{
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    response.status(204).end()
})

app.get('/info', (request, response)=> {
    const numPeople = persons.length
    const latestDate = new Date
    
    response.send(`<p>Phonebook has info for ${numPeople} people</p>
                    <p>Last update: ${latestDate}</p>`)
})



app.post('/api/persons', (request, response)=>{

    const body = request.body

    if (!body.name || !body.number){
        return response.status(404).json({  
            error: 'bro content is empty'
        })
    }

    const currentPerson = persons.find(person => person.name === body.name);

    if(currentPerson){
        return response.status(400).json({ 
            error: 'name must be unique' 
        })
    }


    const person = request.body;
    
    //do ... while terminates when while = false
    let newId;
    do {
        newId = Math.floor(Math.random() * 100000) 
    } while (persons.find(p => p.id === String(newId)));



    person.id = String(newId);
    persons = persons.concat(person);
    response.status(201).json(person);

})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () =>{
    console.log(`server is live running on ${PORT}`)
})