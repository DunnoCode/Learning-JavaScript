import React, {useState, useEffect} from 'react';
import { useParams, useNavigate, Link } from "react-router-dom";
import './music.css'

function Music(){

    const params = useParams();
    const navigate = useNavigate();
    const [music, setMusic] = useState(null)
    const [quantity, setQuantity] = useState(1)

    useEffect(() => {
        const fetchData = async () => {
            let response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/music/getMusicData/${params.objectID}`)
                                 .then((response) => {
                                     if(response.status === 200){
                                         return response
                                     }else{
                                        navigate('/*');
                                     }
                                 })
                                 .then((data) => data.json()).catch(err => console.log(err))
            console.log(response)
            setMusic(response)
        }
        fetchData()
    }, [params.objectID])
  
    const handleSubmit = async (evt) => {
        let musicList = await localStorage.getItem('selectedItems')
        if(!musicList){
            localStorage.setItem('selectedItems', `[{"music_name": "${music.music_name}", "quantity": ${quantity}, "price": ${music.price * quantity}}]`)
        }else{
            let found = false
            let store = await JSON.parse(musicList).map((item) => {
                if(item.music_name === music.music_name){
                    found = true
                    return { music_name: music.music_name, quantity: (parseInt(item.quantity) + parseInt(quantity)), price: (parseInt(item.price) + music.price * quantity)}
                }else{
                    return item
                }
            })
            if(found === false){
                store.push({ music_name: music.music_name, quantity: quantity, price: music.price * quantity})
            }
            localStorage.setItem('selectedItems', JSON.stringify(store))
            console.log(store[0])
        }
        alert(`Item has been stored`)
        // setQuantity(0)
    }

    return(
        <div className="music">
            <div className="base">
                {music ?
                    <> 
                        <div className="pathing">
                            <>
                                <Link to='/'><p className="pathName">Home</p></Link>
                                <p className="pathName">{`>`}</p>
                                <Link to={`/music/${params.objectID}`}><p className="pathName">{music.music_name}</p></Link>
                            </>
                        </div>
                        <div className="content">
                            <p className="title">{music.music_name}</p>
                            <img 
                                style={{width:'200px', height:'300px', marginTop:'20px'}}
                                src={`${process.env.REACT_APP_BACKEND_URI}/api/music/getMusicImage/${music.music_image}`}
                                alt={music.music_image}
                            />
                            <br/>
                            <audio controls style={{maxWidth:'400px', width:'80%', marginBottom:'20px'}}>
                                <source src={`${process.env.REACT_APP_BACKEND_URI}/api/music/getMusicAudio/${music.music_clip}`} type="audio/mpeg" />
                                Your browser does not support the audio element.
                            </audio>
                            <p className="text"><b>Category:</b> {music.category}</p>
                            <p className="text"><b>Composer:</b> {music.composer}</p>
                            <p className="text"><b>Description:</b> {music.description}</p>
                            <p className="text"><b>Published:</b> {music.published}</p>
                            <p className="text"><b>Price:</b> {music.price}</p>
                            <div className="addToCart">
                                <form onSubmit={handleSubmit}>
                                    <label>
                                        Quantity:
                                        <input type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)}/>
                                    </label>
                                    <button type="submit"> Add to Cart</button>
                                </form>
                            </div>
                        </div>
                    </>
                :   
                    <div className="base">
                        <div className="Loading">
                            <p>Loading</p>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default Music