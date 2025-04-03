import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { registerAPI } from '../services/allAPI';


function Register() {
    const navigate = useNavigate()
    const [userInput,setUserInput] = useState({
        email:"",username:"",password:""
    })

    console.log(userInput);
    
    const register = async (e) => {
        e.preventDefault()
        if (userInput.email&&userInput&&userInput.password) {
            // api call
            try {
                const result = await registerAPI(userInput)
                if (result.status==200) {
                    alert(`Welcome ${result.data?.username},Please login`)
                    navigate("/login")
                }else{
                    if (result.status==406) {
                        alert(result.response.data)
                        setUserInput({email:"",username:"",password:""})
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
    <div id="register" className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
  <div className="container w-50 p-4 bg-white shadow rounded">
    <h2 className="text-center">Register</h2>

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
        type="text" 
        onChange={e => setUserInput({ ...userInput, username: e.target.value })}  
        className="form-control" 
        placeholder="Username"
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
      <button className="btn btn-primary w-100" type="submit" onClick={register}>Register</button>
      <br />
      <Link to={'/'} className="text-primary mt-2 d-block">Already have an account?</Link>
    </div>
  </div>
</div>

  )
}

export default Register