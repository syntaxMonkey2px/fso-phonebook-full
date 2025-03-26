import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'


const Filter = ({filter, handleFilter}) =>{

  return(
    <div>
      <label>filter</label> 
      <input 
      value={filter}
      onChange={handleFilter}
      placeholder="filter with name"/>
  </div>
  )
};


  const PersonalForm = ({addName, handleInputChange, handleNumChange, newName, newNum}) =>{
    return(
      <div>
        <form onSubmit={addName}> 
              
                <label>name </label>
                <input
                value={newName}
                onChange={handleInputChange}
                  />

                <label>number</label>
                  <input
                  value={newNum}
                  onChange={handleNumChange}
                  />
              
          <div>
          <button type="submit">add</button>
          </div>
        </form>
      </div>
    )
  };



  const Persons = ({persons, setPersons, filter}) =>{

    const DelButton = ({id}) =>{

      const areYouSure = (id) => {

        if (window.confirm('are you sure you want to remove' )){
          personService
            .remove(id)
            .then(()=>{
              setPersons(persons.filter(person => person.id !== id))
            })
            .catch(error=>{
              console.error('i fucked up', error);
            })
        }else{
          console.log('alright then');
        }
      }


      return(
        <button className='rm-btn' onClick={()=>areYouSure(id)}>remove</button>
      )
    }

    const personsToShow = filter
    ? persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
    : persons;

    return(
        <table>
          <tbody>
            {personsToShow.map(person =>
              <tr key={person.id}>

                <td>
                  {person.name}
                </td>
                <td>
                  <i>{person.number}</i>
                  </td>
                  <td>
                  <DelButton id={person.id}/>
                </td>
              </tr>
          )}
          </tbody>

        </table>
    )
  };

// take the react component out of the app so it doesnt refresh everytime the app states got updated
// meaning jumping out of input field everytime theres an input in this case


const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }  ]) 
  const [newName, setNewName] = useState('')
  const [newNum, setNewNum] = useState('')


  // const hook = () => {
  //       console.log('effect')
  //       axios      
  //         .get('http://localhost:3001/persons')      
  //         .then(response => {        
  //           console.log('promise fulfilled')        
  //           setPersons(response.data)      
  //         })  
  //       }
  // useEffect(hook, [])  
  //       console.log('render', persons.length, 'persons')

  useEffect(() => {
    personService
          .getAll()
          .then(response => {
              setPersons(response.data)
              }) 
            }, [])


  const [filter, setFilter] = useState('')

  const handleInputChange = (event) => {
    setNewName(event.target.value);
  }
  const handleNumChange = (event) => {
    setNewNum(event.target.value);
  };
  
  const handleFilter = (event) => {
    setFilter(event.target.value)
   };
  
   const addName = (event) => {
    event.preventDefault()
    const newObj = {
      name: newName,
      number: newNum,
      id: persons.length + 1,
    }
  
    if (persons.some(persons => persons.name === newName)){
      alert(newName + ' has already been added to our phonebook.')
    }else{
      // axios.post('http://localhost:3001/persons', newObj)
      //   .then(response=> {
      //     setPersons(persons.concat(response.data));
      //     setNewName('');
      //     setNewNum('');
      //     console.log('now we have', {persons});
      //     alert(`${newName} is added to phonebook`)
      //   })
      personService      
      .create(newObj)      
      .then(response => {        
        setPersons(persons.concat(response.data));
        setNewName('');
        setNewNum('');   
        console.log('now we have', {persons});
        alert(`${newName} is added to phonebook`)
      })
  
    }



  };
  return(
    <div className="app">
      <h2>Phonebook</h2>
        <PersonalForm 
        addName={addName}
        handleInputChange={handleInputChange}
        handleNumChange={handleNumChange}
        newName={newName}
        newNum={newNum}
        />
      <div>
        <h2>Numbers</h2>
        <div>
        <Filter filter={filter} handleFilter={handleFilter} />
      </div>
        <Persons persons={persons} setPersons={setPersons} filter={filter}/>
      </div>
    </div>
  )

}


export default App