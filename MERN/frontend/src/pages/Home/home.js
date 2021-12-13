import React, {useState, useEffect} from 'react';
import Card from "../../components/Card/card"
import {FaSearch} from 'react-icons/fa';
import './home.css'


function Home(){

    let [musicList, setMusicList] = useState([])
    let [dynamicMusicList, setDynamicMusicList] = useState([])
    let [search, setSearch] = useState('')
    let [category, setCategory] = useState('All Music')
    let [submit, setSubmit] = useState(``)

    useEffect(() => {
        const fetchData = async () => {
            let response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/music/getAllMusics`).then((data) => data.json()).catch(err => console.log(err))
            response = response.sort((a, b) => parseInt(a.music_clip.substr(1, a.music_clip.indexOf('.'))) - b.music_clip.substr(1, b.music_clip.indexOf('.')));
            setMusicList(response)
            setDynamicMusicList(response)
            console.log(response)
        }
        fetchData()
    }, [])



    const filterResult = (input) => {

        const containOne = (searchList, music) => {
            for(var i = 0; i < searchList.length; i++){
                if(music.music_name.includes(searchList[i]) || music.composer.includes(searchList[i])){
                    return true
                }
            }
            return false
        }

        const filterBySearch = (list) => {
            if(search === ''){
                return list
            }

            let searchList = search.split(" ")
            let newList = list.filter(music => containOne(searchList, music))
            return newList
        }

        const filterByCategory = (list, input) => {
            if(input === 'All Music'){
                return list
            }
            let newList = list.filter(music => music.category === input)
            return newList
        }
        if(input !== ''){
            let fitlerList = filterByCategory(musicList, input)
            fitlerList = filterBySearch(fitlerList)
            setDynamicMusicList(fitlerList)
            setCategory(input)
            setSubmit(search)
            return
        }else{
            console.log(search)
            console.log(category)
            let fitlerList = filterByCategory(musicList, category)
            fitlerList = filterBySearch(fitlerList)
            setDynamicMusicList(fitlerList)
            setSubmit(search)
            return
        }
    }
    
    return(
        <div className="home">
            <div className="base">
                <div className="sider">
                    <h1>Category</h1>
                    <p onClick={() => {filterResult("All Music")}} style={{ cursor: "pointer", textDecoration: "none", fontSize: "2vh", marginBottom: "2vh", color: "black", border: "1px solid black", padding: "0.5vh 0.5vw"}}>All Music</p>
                    <p onClick={() => {filterResult("Classical")}} style={{ cursor: "pointer", textDecoration: "none", fontSize: "2vh", marginBottom: "2vh", color: "black", border: "1px solid black", padding: "0.5vh 0.5vw"}}>Classical</p>
                    <p onClick={() => {filterResult("Baroque")}} style={{ cursor: "pointer", textDecoration: "none", fontSize: "2vh", marginBottom: "2vh", color: "black", border: "1px solid black", padding: "0.5vh 0.5vw"}}>Baroque</p>
                    <p onClick={() => {filterResult("Romantic")}} style={{ cursor: "pointer", textDecoration: "none", fontSize: "2vh", marginBottom: "2vh", color: "black", border: "1px solid black", padding: "0.5vh 0.5vw"}}>Romantic</p>
                    <p onClick={() => {filterResult("Late 19th")}} style={{ cursor: "pointer", textDecoration: "none", fontSize: "2vh", marginBottom: "2vh", color: "black", border: "1px solid black", padding: "0.5vh 0.5vw"}}>Late 19th</p>
                </div>
                <div className="content">
                    <div className="searcher">
                        <div class="search">
                                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="searchTerm" placeholder="Keywords Keywords (add a whitespace in the interval between keywords)" />
                                <button onClick={() => {filterResult('')}} type="submit" className="searchButton">
                                    <FaSearch/>
                                </button>
                        </div>
                        <p style={{marginBottom: "1vh", marginLeft: "2vw"}}>Search Result {submit === '' ? null : `: ${submit}`}</p>
                    </div>
                    <div>
                        <h1 style={{marginBottom: "1vh", marginLeft: "2vw"}}>{category}</h1>
                    </div>
                    {musicList ? 
                        <div className="cards">
                            {(dynamicMusicList === [] )? 
                                `Loading` 
                                : 
                                dynamicMusicList.map(music => <Card key={music._id} music={music} />
                            )}
                        </div>
                    :
                        `Loading`
                    }
                </div>
            </div>
        </div>
    )
}

export default Home;