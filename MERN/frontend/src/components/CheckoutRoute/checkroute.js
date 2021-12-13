import React from 'react'
import PaymentLogin from '../../pages/Payment/payment.login.v2'
import PaymentRegister from '../../pages/Payment/payment.register.v2'

function checkoutRoute(){
    let isAuthenticated = localStorage.getItem('token');
    return isAuthenticated ? <PaymentLogin /> : <PaymentRegister />;
}

export default checkoutRoute;