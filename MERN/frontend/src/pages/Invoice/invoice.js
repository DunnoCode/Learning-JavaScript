import React, {useState, useEffect} from 'react';
import { useParams, useNavigate, Link } from "react-router-dom";
import './invoice.css'

function Invoice() {
    
    const params = useParams();
    const [invoice, setInvoice] = useState(null)
    const [orderedMusics, setOrderedMusics] = useState([])
    const [totalPrice, setTotalPrice] = useState(0)
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const requestOptions = {
                method: 'GET',
                headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            };
            let response = await fetch(`${process.env.REACT_APP_BACKEND_URI}/api/user/checkInvoice/${params.objectID}`, requestOptions)
            .then(async (response) => {
                if(response.status === 200){
                    return response
                }else{
                    navigate('/*');
                }
            }).then((data) => data.json()).catch(err => console.log(err))
            let sum = 0
            for(var i = 0; i < response.orderedMusics.length; i++){
                sum = sum + response.orderedMusics[i].quantity * response.orderedMusics[i].price
            }
            setInvoice(response)
            setOrderedMusics(response.orderedMusics)
            setTotalPrice(sum)
            localStorage.removeItem('selectedItems')
        }
        fetchData()
    }, [])

    return(
        <>
            {invoice === null?
                <div>Loading</div>
            :
                <div className="invoice">
                    <div className="base">
                        <div className="info">
                            <h1>INVOICE</h1>
                            <p><span>Full Name:</span> {invoice.full_name}</p>
                            <p><span>Company Name:</span> {invoice.company_name}</p>
                            <p><span>Address Line 1:</span> {invoice.address_1}</p>
                            <p><span>Address Line 2: </span>{invoice.address_2}</p>
                            <p><span>City: </span>{invoice.city}</p>
                            <p><span>Region:</span> {invoice.region}</p>
                            <p><span>Country:</span> {invoice.country}</p>
                            <p><span>Postcode: </span>{invoice.postcode}</p>
                        </div>
                        <div className="selectedItems">
                            { orderedMusics.length === 0?
                                <p>Loading</p>
                            :   
                                <>
                                <h1 style={{fontSize: "2.5vh", paddingBottom: "1vh"}}>Ordered Musics</h1>
                                {
                                    orderedMusics.map((music) => {
                                        return <p style={{paddingBottom:"1vh", fontSize: "2vh"}}>{music.quantity} x {music.music_name} $ {music.quantity * music.price}</p>
                                    })
                                }
                                </>
                            }
                            <p style={{fontSize: "2.5vh"}}><span style={{fontWeight: "700"}}>Total Price:</span> {totalPrice}</p>
                        </div>
                        <Link style={{paddingTop: "1vh", alignSelf: "center", fontSize: "2vh", textDecoration: "none", backgroundColor:"black", color:"white", padding:"1vh 2vw"}} to="../../">Back to Home</Link>
                    </div>
                </div>
            }
        </>
    )
}

export default Invoice
