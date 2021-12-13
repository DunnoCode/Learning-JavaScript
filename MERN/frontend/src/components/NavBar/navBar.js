import React, {useState} from "react";
import { Link } from "react-router-dom";
import "./navBar.css"

function NavBar(){

    const [token, setToken] = useState(localStorage.getItem('token'))


    return (
        <>
            <div className="navBar">
                <div className="base">
                    <div className="logo">
                        <Link style={{textDecoration: "none", color: "black"}} to='/'><p>RAY RAY MUSIC SHOP ♪♪</p></Link>
                    </div>
                    <div className="pathing">
                        <div>
                            {token ? 
                                <p style={{textDecoration: "none", backgroundColor: "rgba(211, 38, 38, 0.9)", padding: "1.5vh 1.5vw", color: "white", cursor: "pointer"}} onClick={async () => { await localStorage.removeItem('token'); await setToken(localStorage.getItem('token')) ; alert(`successfully logout`)}}>Logout</p> 
                            : 
                                <Link style={{textDecoration: "none", backgroundColor: "rgba(211, 38, 38, 0.9)", padding: "1.5vh 1.5vw", color: "white", cursor: "pointer"}} to="/login">LogIn</Link>
                            }
                        </div>
                        <div>
                            {token?
                                null
                            :
                            <Link style={{textDecoration: "none", backgroundColor: "rgba(211, 38, 38, 0.9)", padding: "1.5vh 1.5vw", color: "white", cursor: "pointer"}} to="/register">Register</Link> 
                            }
                        </div>
                        <div>
                            <Link style={{textDecoration: "none", backgroundColor: "rgba(211, 38, 38, 0.9)", padding: "1.5vh 1.5vw", color: "white", cursor: "pointer"}} to="/shoppingCart">ShoppingCart</Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NavBar