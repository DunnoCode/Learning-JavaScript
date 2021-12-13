import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom'
import CartCard from '../../components/CartCard/cartCard';
import { GiShoppingCart } from 'react-icons/gi';
import './shoppingCart.css'


function ShoppingCart(){

    let [selectedItem, setSelectedItems] = useState([])
    let [totalPrice, setTotalPrice] = useState(0)

    useEffect(() => {
        const getStorage = async() =>{
            let price
            let store = await localStorage.getItem('selectedItems')
            if(store){
                store = await JSON.parse(store)
                if(store.length !== 0){
                    price = store.reduce((a, b) => ({price: a.price + b.price})).price
                }else{
                    price = 0
                }
            }else{
                store = []
                price = 0
            }
            setTotalPrice(price)
            setSelectedItems(store)
        }
        getStorage()
    }, [])

    const remove = (item) => {
        alert(item)
        let store = selectedItem.filter(music => music.music_name !== item)
        localStorage.setItem('selectedItems', JSON.stringify(store))
        let price
        if(store.length !== 0){
            price = store.reduce((a, b) => ({price: a.price + b.price})).price
        }else{
            price = 0
        }
        setTotalPrice(price)
        setSelectedItems(store)
    }

    

    return(
        <div className="shoppingCart">
            <div className="base">
                {selectedItem.length !== 0 ? 
                    <>
                        {  
                        <div className="nav">
                            <p>Shopping Cart <GiShoppingCart /></p>
                            <div className="navInfo">
                                <Link style={{textDecoration: "none"}} to='/'><p>Back to Home</p></Link>
                                <p>{selectedItem.length > 1 ? `${selectedItem.length} items` : `${selectedItem.length} item`} in the cart</p>
                            </div>
                        </div>
                        }
                        {   
                            <div className="cards">
                            {
                                selectedItem.map(item => 
                                    <CartCard key={item._doc} onClick={() => {remove(item.music_name)}} selectedItem={item} />
                                )
                            }   
                            </div>
                        }
                        {   
                            <div className="control">
                                <p>TOTAL COST: {totalPrice}</p>
                                <Link style={{textDecoration: "none", backgroundColor: "rgba(211, 38, 38, 0.9)", padding: "1.5vh 1.5vw", color: "white", cursor: "pointer"}} to="/payment">CHECKOUT</Link>
                            </div>
                        }
                    </>
                :
                    <>
                        <div className="Nothing">
                            <p>You do not have any selected items yet.</p>
                            <Link style={{textDecoration: "none", marginTop: "3vh", fontSize: "2.5vh", cursor: "pointer", backgroundColor: "rgba(211, 38, 38, 0.9)", color: "white", padding: "1vh 1vw"}} to="/">Go Back Home Page</Link>
                        </div>
                    </>
                }
            </div>
        </div>
    )
}





export default ShoppingCart;