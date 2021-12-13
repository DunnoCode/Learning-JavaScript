import React from "react"
import './cartCard.css'

function CartCard({ onClick, selectedItem }){
    return (
        <div className="cartCard">
            <div className="base">
                <div className="card">
                    <div className="left">
                        <p className="selectedName">{selectedItem.music_name}</p>
                        <p className="text">Quantity: {selectedItem.quantity}</p>
                        <p className="text">Total: {selectedItem.price}</p>
                    </div>
                    <div className="right">
                        <button onClick={onClick}>
                            <span style={{fontWeight: 900}}>Delete</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
  };

export default CartCard;