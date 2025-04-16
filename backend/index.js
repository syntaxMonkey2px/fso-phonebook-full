require('dotenv').config()
console.log('MONGODB_URI:', process.env.MONGODB_URI); // Debugging the URI

const express = require('express')
const path = require('path')
const cors = require('cors')
const Person = require('./models/person')

const app = express()

// Middleware ((order matters!
app.use(cors())  
app.use(express.json());
app.use(express.static('dist')) // Add this BEFORE your routes

//API routes
app.get('/api/persons', (request, response, next)=>{
    Person.find({})
        .then(persons => {
                console.log('Sending persons:', persons); // Debug log
            response.json(persons);
        })
        .catch(error =>  next(error) )
    
})

app.get('/api/persons/:id', (request, response, next)=>{
    Person.findById(request.params.id)
        .then(person => {
            if(person){
                response.json(person)
            }else{
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
    response.status(204).end()
        })
        .catch(error => next(error))
})


app.get('/info', (request, response, next)=> {
    Person.countDocuments({}) //MongoDB method to count documents
        .then(count => {
        const latestDate = new Date()
        response.send(`<p>Phonebook has info for ${count} people</p>
                    <p>Last update: ${latestDate}</p>`)
        })
        .catch(error => next (error))
})



app.post('/api/persons', (request, response, next)=>{

    const body = request.body;

    if (!body.name || !body.number){
        return response.status(400).json({  
            error: 'bro content is empty'
        })
    }

    Person.findOne({ name: body.name}) // Check if name already exists
        .then(currentPerson => {
            if(currentPerson){
                return response.status(400).json({ 
                    error: 'name must be unique' 
                })
            }

            // Create a new person if name doesnt exist
            const person = new Person ({
                name: body.name,
                number: body.number,
            })
    
            person.save()
                .then(savedPerson => {
                    response.json(savedPerson)
                }) 
                .catch (error => next(error))

        })
        .catch(error => next(error))
})

// Catch-all route for serving index.html for any other requests
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });

const errorHandler = (error, request, response, next) =>{
    console.error(error.message)

    if(error.name === 'CastError'){
        return response.status(400).send({error: 'your id is malformed, mate'})
    }else if (error.name === 'ValidationError'){
        return response.status(400).json({error: error.message})
    }

    next(error)
}
app.use(errorHandler)


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () =>{
    console.log(`server is live running on ${PORT}`)
})