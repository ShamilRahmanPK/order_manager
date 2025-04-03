import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginAPI, registerAPI } from '../services/allAPI'

function Auth() {
    const navigate = useNavigate()
    const [userInput,setUserInput] = useState({
        email:"",password:""
    })

    const login = async (e) => {
        e.preventDefault()
        if (userInput.email&&userInput.password) {
            // api call
            try {
                const result = await loginAPI(userInput)
                if (result.status==200) {
                    sessionStorage.setItem("user",JSON.stringify(result.data.user))
                    sessionStorage.setItem("token",result.data.token)
                    alert(`Welcome to Order Manager`)
                    navigate("/dashboard")
                }else{
                    if (result.response.status==404) {
                        alert(result.response.data)
                    }
                }
            } catch (err) {
                console.log(err);
            }
        } else {
            alert("Please fill the form completly")
        }
    }

    
  return (
    <div id="auth" className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
  <div className="container w-50 p-4 bg-white shadow rounded">
    <h2 className="text-center">Welcome Back</h2>
    
    <div className="input-group mb-3 mt-4">
      <input 
        type="text" 
        onChange={e => setUserInput({ ...userInput, email: e.target.value })} 
        className="form-control" 
        placeholder="Email"
      />
    </div>
    
    <div className="input-group mb-3">
      <input 
        type="password" 
        onChange={e => setUserInput({ ...userInput, password: e.target.value })} 
        className="form-control" 
        placeholder="Password"
      />
    </div>
    
    <div className="text-center">
      <button onClick={login} className="btn btn-primary w-100">Login</button>
      <br />
      <Link to={'/register'} className="text-primary mt-2 d-block">Not an existing user?!</Link>
    </div>
  </div>
</div>

  )
}

export default Auth