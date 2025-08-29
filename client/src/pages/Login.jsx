import { useState } from 'react'
import '../App.css'
import { Link } from "react-router-dom"

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    const trimmedUsername = username.trim()
    const trimmedPassword = password.trim()

    if (!trimmedUsername || !trimmedPassword) {
      alert('Please enter both username and password')
      return
    }

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: trimmedUsername, password: trimmedPassword })
      })

      if (response.ok) {
        const data = await response.text()
        console.log('Login successful:', data)
        //register Successfull
        window.location.href = '/'
      } else if (response.status === 401) {
        alert('Invalid username or password')
      } else {
        alert('An error occurred during login')
      }
    } catch (error) {
      console.error('Error during login:', error)
      alert('Login failed. Please try again.')
    }
  }

  return (
    <div>
      <input 
        type="text" 
        className='username'
        value={username}
        onChange={(e) => setUsername(e.target.value)} 
      />
      <input 
        type="password" 
        className='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)} 
      />
      <button className='submitLogin' onClick={handleLogin}>Login</button>

      <Link to={"/register"}>don't have a account , signup</Link>

    </div>
  )
}

export default Login
