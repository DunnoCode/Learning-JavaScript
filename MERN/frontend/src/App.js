import * as React from "react";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Home from "./pages/Home/home"
import Login from "./pages/Login/login.v2"
import Register from "./pages/Register/register.v2";
import ShoppingCart from "./pages/ShoppingCart/shoppingCart"
import Music from "./pages/Music/music"
import Error  from "./pages/Error/404";
import Invoice from "./pages/Invoice/invoice";
import NavBar from "./components/NavBar/navBar"
import CheckoutRoute from "./components/CheckoutRoute/checkroute";



function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<><NavBar /><Home /> </>} />
          <Route path="/music/:objectID" element={<><NavBar /><Music/></>} />
          {/* path without NavBar */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/shoppingCart" element={<ShoppingCart/>} />
          <Route path="/payment" element={<CheckoutRoute />}/>
          <Route path="/invoice/:objectID" element={<Invoice/>}/>
          <Route path="*" element={<Error/>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}



export default App;
