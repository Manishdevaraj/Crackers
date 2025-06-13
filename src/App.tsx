import { Route, Routes } from "react-router-dom"
import Hero from "./pages/Hero"
import Register from "./pages/Register"
import MainNav from "./components/nav/MainNav"
import SubNav from "./components/nav/SubNav"
import Login from "./pages/Login"
import OrderTrack from "./pages/OrderTrack"
import AboutUs from "./pages/AboutUs"
import Contactus from "./pages/Contactus"
import Shop from "./pages/Shop"
import Cart from "./pages/Cart"
import WishList from "./pages/WishList"
import CheckOut from "./pages/CheckOut"

const App = () => {
  return (
    <>
     <MainNav />
     <SubNav />
    <Routes>
      <Route path='/' element={<Hero/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/track-order' element={<OrderTrack/>}/>
      <Route path='/aboutus' element={<AboutUs/>}/>
      <Route path='/contactus' element={<Contactus/>}/>
      <Route path='/shop' element={<Shop/>}/>
      <Route path='/cart' element={<Cart/>}/>
      <Route path='/  ' element={<WishList/>}/>
      <Route path='/checkout' element={<CheckOut/>}/>










    </Routes>
    </>
  )
}

export default App