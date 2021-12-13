import React, {useState} from 'react';
import { useNavigate, Link } from "react-router-dom";
import './login.css'


const Login = () => {
    const [correctLogin, setCorrectLogin] = useState(true)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [wrongEmail, setWrongEmail] = useState(false)
    const [wrongPassword, setWrongPassword] = useState(false)
    const [wrongEmailMessage, setWrongEmailMessage] = useState('')
    const [wrongPasswordMessage, setWrongPasswordMessage] = useState('')

    const navigate = useNavigate();

    const login = async() => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: `${email}`, password: `${password}` })
        };
        await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/auth/login`, requestOptions)
        .then(async (response) => {
            let data = await response.json()
            if(response.status === 200){
                console.log(data);
                await localStorage.setItem('token', data.token)
                alert("Login Successfully")
                navigate('/');
                setCorrectLogin(true)
            }else{
                if(data.message === "Wrong email/password"){
                    setCorrectLogin(false)
                }
            }
        })
        .catch(err => console.log(err))
    }

    const handleSubmit = async (e) =>{
        e.preventDefault();
        if(email === '' || password === '' || password.length < 5){
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
            return
        }else{
            setWrongPasswordMessage('')
            setWrongPassword(false)
            setWrongEmailMessage('')
            setWrongEmail(false)
            await login()
        }
    }


    return (
        <>  
            <div className="login">
                <div className="base">
                    <div className="shopName">
                        <p>Ray Ray Music Shop</p>
                    </div>
                    <form className="loginForm" onSubmit={handleSubmit}>
                        <div className="title">
                            <p>LOGIN FORM</p>
                        </div>
                        <div className="inputBase">
                            <label htmlFor="email">Email</label>
                            <input type="email" value={email} placeholder="Email (Required)" onChange={e => setEmail(e.target.value)}/>
                            {wrongEmail ? <div className="warning"><p>{wrongEmailMessage}</p></div> : null}
                        </div>
                        <div className="inputBase">
                            <label htmlFor="password">Password</label>
                            <input type="password" value={password} placeholder="Password (Required)" onChange={e => setPassword(e.target.value)}/>
                            {wrongPassword ? <div className="warning"><p>{wrongPasswordMessage}</p></div> : null}
                        </div>
                        <div>
                            {!correctLogin? <div className="warning"><p>Incorrect input Email/Password. Please try again.</p></div> : null}
                        </div>
                        <div className="buttons">
                            <button type="submit">LOGIN</button>
                            <Link to="/register"><button>REGISTER</button></Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Login;