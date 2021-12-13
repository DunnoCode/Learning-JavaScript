import React from 'react';
import {Link} from 'react-router-dom'
import './card.css'

function Card({music}){

    return(
        <div className="card">
            <div className="cardBase">
                <Link style={{textDecoration: "none", fontSize: "2vh", marginTop: "1vh", marginLeft: "0.5vw",}} to={`/music/${music._id}`}>{music.music_name}</Link>
                <br/>
                <img 
                    style={{width:'200px', height:'200px'}}
                    src={`${process.env.REACT_APP_BACKEND_URI}/api/music/getMusicImage/${music.music_image}`}
                    alt="new"
                />
                <p><b>Category:</b> {music.category}</p>
                <p><b>Composer:</b> {music.composer}</p>
                <p><b>Price:</b> {music.price}</p>
                {
                    music.new_arrival?
                    <p style={{marginTop:"3vh", fontSize:"2vh", fontWeight:"bold", color:"red"}}>New products</p>:null
                }
            </div>
        </div>
    )
}

export default Card;