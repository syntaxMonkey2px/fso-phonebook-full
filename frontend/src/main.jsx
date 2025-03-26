import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
// import axios from 'axios'

// axios
//   .get('http://localhost:3001/persons')
//   .then(response => {
//     const persons = response.data
//     ReactDOM.createRoot(document.getElementById('root')).render(<App persons={persons} />)
//     console.log(persons)
// })
// const promise2 = axios.get('http://localhost:3001/foobar')
// console.log(promise2)