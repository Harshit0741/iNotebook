import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

const Login = (props) => {
    const [cred, setCred] = useState({email: "", password: ""})
    let history = useHistory();
    const handleSubmit = async (e)=>{
        e.preventDefault();
        fetch("")
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email: cred.email, password: cred.password})
        });
        const json = await response.json()
        console.log(json);
        if(json.success){
            //redirect
            localStorage.setItem('token', json.authtoken);
            props.showAlert("Logged In Successfully", "success");
            history.push("/");
        }
        else{
            props.showAlert("Invalid", "danger")
        }
    }
    const onChange = (e)=>{
        setCred({...cred,[e.target.name]: e.target.value})
    }
    return (
        <div className='mt-3'>
            <h2>Login to continue to iNotebook</h2>
            <form  onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" value={cred.email} onChange={onChange} name="email" aria-describedby="emailHelp"/>
                        <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" value={cred.password} onChange={onChange} id="password" name="password"/>
                </div>

                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default Login;
