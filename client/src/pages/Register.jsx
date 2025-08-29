import '../App.css'
import { useState } from 'react'
import { Link } from 'react-router-dom'

function Register() {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const handleRegister = async () => {
        const trimmedUsername = username.trim()
        const trimmedPassword = password.trim()

        if (!trimmedUsername || !trimmedPassword) {
        alert('Please enter both username and password')
        return
        }

        try {
        const response = await fetch('http://localhost:3000/Register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: trimmedUsername, password: trimmedPassword })
        })

        if (response.ok) {
            const data = await response.text()
             console.log('Login successful:', data)
            //Login successful
            window.location.href = '/'
        } else if (response.status === 401) {
            alert('Invalid username or password')
        } else if (response.status === 409) {
            alert('Username alredy exists, try another username')
        } else {
            alert('An error occurred during login')
        }
        } catch (error) {
        console.error('Error during login:', error)
        alert('Login failed. Please try again.')
        }
  }
 
    return (
        <>
            <input type="text" onChange={(e) => {setUsername(e.target.value)}} value={username}/>
            <input type="password" onChange={(e) => {setPassword(e.target.value)}} value={password}/>
            <button onClick={handleRegister}>Register</button>
            <Link to={"/login"}>already have a account, Login</Link>
        </>
    )
}

export default Register