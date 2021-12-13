import React from "react";
import { Link } from "react-router-dom";
import './404.css'

function Error(){
    
    return(
        <div className="error">
            <div className="base">
                <h1>Oops! Page not found!</h1>
                <p>The page you are looking for was not found.</p>
                <Link to="/"><button>Back to Home Page</button></Link>
            </div>
        </div>
    )
}

export default Error
