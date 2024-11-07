
// import './App.css'
import React from 'react'
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';
import './App.css'
import Register from './register';
import Login from './login';
import HomePage from './homePage';
import Dashboard from './dashboard';
const App:React.FC=()=> {
  return (
  <Router>
    <Routes>
      <Route path='/' element={<HomePage/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/dashboard' element={<Dashboard/>}/>
    </Routes>
  </Router>
  )
}

export default App
