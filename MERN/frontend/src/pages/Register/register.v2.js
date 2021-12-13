import React, {useState} from 'react';
import { useNavigate, Link } from "react-router-dom";
import './register.css'

const Register = () => {
    const navigate = useNavigate();
    const [userExist, setUserExist] = useState(false)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [first_name, setfirst_name] = useState('')
    const [last_name, setlast_name] = useState('')
    const [wrongEmail, setWrongEmail] = useState(false)
    const [wrongPassword, setWrongPassword] = useState(false)
    const [wrongfirst_name, setWrongfirst_name] = useState(false)
    const [wronglast_name, setWronglast_name] = useState(false)
    const [wrongfirst_nameMessage, setWrongfirst_nameMessage] = useState('')
    const [wrongEmailMessage, setWrongEmailMessage] = useState('')
    const [wrongPasswordMessage, setWrongPasswordMessage] = useState('')
    const [wronglast_nameMessage, setWronglast_nameMessage] = useState('')


    
    const register = async () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ first_name: first_name, last_name: last_name, email: email, password: password })
        };
        await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/auth/register`, requestOptions)
        .then(async (response) => {
            let data = await response.json()
            if(response.status === 200){
                localStorage.setItem('token', data.token)
                alert("Register Successfully")
                setUserExist(false)
                navigate('/');
            }else{
                if(data.message === "User already exist"){
                    setUserExist(true)
                    return
                }
            }
        })
        .catch(err => console.log(err))
    }

    const handleSubmit = async (e) =>{
        e.preventDefault();
        if(email === '' || password === '' || password.length < 5 || last_name === '' || first_name === ''){
            if(email === ''){
                setWrongEmailMessage('Email is required')
                setWrongEmail(true)
            }else{
                setWrongEmailMessage('')
                setWrongEmail(false)
            }
            if(password === '' || password.length < 5){
                if(password === ''){
                    setWrongPasswordMessage('Password is required')
                    setWrongPassword(true)
                }else{
                    setWrongPasswordMessage('Password at least 5 characters')
                    setWrongPassword(true)
                }
            }else{
                setWrongPasswordMessage('')
                setWrongPassword(false)
            }
            if(last_name === ''){
                setWronglast_nameMessage('Last Name is required')
                setWronglast_name(true)
            }else{
                setWronglast_nameMessage('')
                setWronglast_name(false)
            }
            if(first_name === ''){
                setWrongfirst_nameMessage('First Name is required')
                setWrongfirst_name(true)
            }else{
                setWrongfirst_nameMessage('')
                setWrongfirst_name(false)
            }
            return
        }else{
            setWrongfirst_nameMessage('')
            setWrongfirst_name(false)
            setWronglast_nameMessage('')
            setWronglast_name(false)
            setWrongPasswordMessage('')
            setWrongPassword(false)
            setWrongEmailMessage('')
            setWrongEmail(false)
            await register()
        }
    }
    return (
      <>
        <div className="register">
            <div className="base">
                <div className="shopName">
                    <p>Ray Ray Music Shop</p>
                </div>
                <form className="registerForm" onSubmit={handleSubmit}>
                    <div className="title">
                        <p>REGISTER FORM</p>
                    </div>
                    <div className="inputBase">
                        <label htmlFor="first_name">First Name</label>
                        <input type="text" value={first_name} placeholder="First Name (Required)" onChange={e => setfirst_name(e.target.value)}/>
                        {wrongfirst_name ? <div className="warning"><p>{wrongfirst_nameMessage}</p></div> : null}
                    </div>
                    <div className="inputBase">
                        <label htmlFor="last_name">Last Name</label>
                        <input type="text" value={last_name} placeholder="Last Name (Required)" onChange={e => setlast_name(e.target.value)}/>
                        {wronglast_name ? <div className="warning"><p>{wronglast_nameMessage}</p></div> : null}
                    </div>
                    <div className="inputBase">
                        <label htmlFor="email">Email Address</label>
                        <input type="email" value={email} placeholder="Email (Required)" onChange={e => setEmail(e.target.value)}/>
                        {wrongEmail ? <div className="warning"><p>{wrongEmailMessage}</p></div> : null}
                    </div>
                    <div className="inputBase">
                        <label htmlFor="password">password</label>
                        <input type="password" value={password} placeholder="Password (Required)" onChange={e => setPassword(e.target.value)}/>
                        {wrongPassword ? <div className="warning"><p>{wrongPasswordMessage}</p></div> : null}
                    </div>
                    <div>
                        {userExist? <div className="warning" style={{color: "red", fontSize: "2vh"}}><p>Email Already Registered. Please register with another email address.</p></div> : null}
                    </div>
                    <div className="buttons">
                        <button type="submit">REGISTER</button>
                        <Link to="/login"><button>LOGIN</button></Link>
                    </div>
                </form>
            </div>
        </div>
        </>
    );
};

export default Register;