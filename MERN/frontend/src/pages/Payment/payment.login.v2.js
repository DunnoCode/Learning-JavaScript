import React, {useState, useEffect} from 'react';
import { useNavigate, Link } from "react-router-dom";
import './payment.login.css'


const PaymentLogin = () => {
    const navigate = useNavigate();

    let [selectedItems, setSelectedItems] = useState([])
    let [totalPrice, setTotalPrice] = useState(0)

    const [full_name, setfull_name] = useState('')
    const [company_name, setcompany_name] = useState('')
    const [address_1, setaddress_1] = useState('')
    const [address_2, setaddress_2] = useState('')
    const [city, setcity] = useState('')
    const [region_state_district, setregion_state_district] = useState('')
    const [country, setcountry] = useState('')
    const [postcode, setpostcode] = useState('')

    const [wrongfull_name, setWrongfull_name] = useState(false)
    const [wrongaddress_1, setWrongaddress_1] = useState(false)
    const [wrongcity, setWrongcity] = useState(false)
    const [wrongcountry, setWrongcountry] = useState(false)
    const [wrongpostcode, setWrongpostcode] = useState(false)

    const [wrongfull_nameMessage, setWrongfull_nameMessage] = useState('')
    const [wrongaddress_1Message, setWrongaddress_1Message] = useState('')
    const [wrongcityMessage, setWrongcityMessage] = useState('')
    const [wrongcountryMessage, setWrongcountryMessage] = useState('')
    const [wrongpostcodeMessage, setWrongpostcodeMessage] = useState('')
    
    useEffect(() => {
        const getStorage = async() =>{
            let price
            let store = await localStorage.getItem('selectedItems')
            store = await JSON.parse(store)
            if(store.length !== 0){
                price = store.reduce((a, b) => ({price: a.price + b.price})).price
            }else{
                price = 0
            }
            setTotalPrice(price)
            setSelectedItems(store)
        }
        getStorage()
    }, [])


    



    const confirmDelivery = async () => {
        let order = JSON.parse(localStorage.getItem('selectedItems'))
        let orderList = []
        for(var i = 0; i < order.length; i++){
            orderList.push({"music_name": order[i].music_name, "quantity": order[i].quantity})
        }
        
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            body: JSON.stringify({order: orderList, full_name: full_name, company_name: company_name, address_1: address_1, address_2: address_2, city: city, region: region_state_district, country: country, postcode: postcode})
        };
        await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/user/checkoutWithLogin`, requestOptions).then(async (response) =>{
            let data = await response.json()
            if(response.status === 200){
                console.log(data)
                alert("Submitted Successfully")
                navigate(`/invoice/${data.newOrder}`);
            }else{
                console.log(data.message)
                return
            }
        })
    }


    const handleSubmit = async (e) =>{
        e.preventDefault();
        if(full_name === '' || address_1 === '' || city === ''|| country === ''|| postcode === ''){
            if(full_name === ''){
                setWrongfull_nameMessage('Full Name is required')
                setWrongfull_name(true)
            }else{
                setWrongfull_nameMessage('')
                setWrongfull_name(false)
            }
            if(address_1 === ''){
                setWrongaddress_1Message('Address is required')
                setWrongaddress_1(true)
            }else{
                setWrongaddress_1Message('')
                setWrongaddress_1(false)
            }
            if(city === ''){
                setWrongcityMessage('City is required')
                setWrongcity(true)
            }else{
                setWrongcityMessage('')
                setWrongcity(false)
            }
            if(country === ''){
                setWrongcountryMessage('City is required')
                setWrongcountry(true)
            }else{
                setWrongcountryMessage('')
                setWrongcountry(false)
            }
            if(postcode === ''){
                setWrongpostcodeMessage('City is required')
                setWrongpostcode(true)
            }else{
                setWrongpostcodeMessage('')
                setWrongpostcode(false)
            }
            return
        }else{
            setWrongfull_nameMessage('')
            setWrongfull_name(false)
            setWrongaddress_1Message('')
            setWrongaddress_1(false)
            setWrongcityMessage('')
            setWrongcity(false)
            setWrongcountryMessage('')
            setWrongcountry(false)
            setWrongpostcodeMessage('')
            setWrongpostcode(false)
            await confirmDelivery()
        }
    }

    return (
        <>  
            <div className="paymentLogin">
                <div className="base">
                    <div className="shopName">
                        <p>Ray Ray Music Shop</p>
                    </div>
                    <form className="deliveryForm" onSubmit={handleSubmit}>
                        <div className="title">
                            <p>DELIVERY FORM</p>
                        </div>
                        <div className="inputBase">
                            <label htmlFor="full_name">Full Name</label>
                            <input type="text" value={full_name} placeholder="Full Name (Required)" onChange={e => setfull_name(e.target.value)}/>
                            {wrongfull_name ? <div className="warning"><p>{wrongfull_nameMessage}</p></div> : null}
                        </div>
                        <div className="inputBase">
                            <label htmlFor="company_name">Company Name</label>
                            <input type="text" value={company_name} placeholder="Company Name" onChange={e => setcompany_name(e.target.value)}/>
                        </div>
                        <div className="inputBase">
                            <label htmlFor="address_1">Address 1</label>
                            <input type="text" value={address_1} placeholder="Address Line 1 (Required)" onChange={e => setaddress_1(e.target.value)}/>
                            {wrongaddress_1 ? <div className="warning"><p>{wrongaddress_1Message}</p></div> : null}
                        </div>
                        <div className="inputBase">
                            <label htmlFor="address_2">Address 2</label>
                            <input type="text" value={address_2} placeholder="Address Line 2" onChange={e => setaddress_2(e.target.value)}/>
                        </div>
                        <div className="inputBase">
                            <label htmlFor="city">City</label>
                            <input type="text" value={city} placeholder="City (Required)" onChange={e => setcity(e.target.value)}/>
                            {wrongcity ? <div className="warning"><p>{wrongcityMessage}</p></div> : null}
                        </div>
                        <div className="inputBase">
                            <label htmlFor="region_state_district">Region/State/District</label>
                            <input type="text" value={region_state_district} placeholder="Region/State/District" onChange={e => setregion_state_district(e.target.value)}/>
                        </div>
                        <div className="inputBase">
                            <label htmlFor="country">Country</label>
                            <input type="text" value={country} placeholder="Country (Required)" onChange={e => setcountry(e.target.value)}/>
                            {wrongcountry ? <div className="warning"><p>{wrongcountryMessage}</p></div> : null}
                        </div>
                        <div className="inputBase">
                            <label htmlFor="postcode">Postcode/Zip Code</label>
                            <input type="text" value={postcode} placeholder="Postcode (Requried)" onChange={e => setpostcode(e.target.value)}/>
                            {wrongpostcode ? <div className="warning"><p>{wrongpostcodeMessage}</p></div> : null}
                        </div>
                        <div className="selectedItems">
                            <p style={{alignSelf: "center", fontWeight: "500", fontSize: "2.5vh", paddingLeft: "2vw", borderBottom: "1px solid black"}}>Your order</p>
                            {selectedItems.length > 0 ?
                                selectedItems.map((music) => {
                                    return <p>{music.quantity} x {music.music_name} {"  "} ${music.price}</p>
                                })
                            :
                                null
                            }
                            {totalPrice?
                                <p><b>Total Price: </b>${totalPrice}</p>
                            :
                                null
                            }
                        </div>
                        <div className="buttons">
                            <button type="submit">Confirm</button>
                            <Link to="/shoppingCart"><button>Change</button></Link>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default PaymentLogin;