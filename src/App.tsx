import { Route, Routes } from "react-router-dom"
import Hero from "./pages/Hero"
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
import { useFirebase } from "./Services/context"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useEffect, useState } from "react"
import Register from "./pages/Register"

const App = () => {
  const { setting, products, cartItems, TAGS, isNewUser } = useFirebase();
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    if (isNewUser) {
      setOpenDialog(true);

      const interval = setInterval(() => {
        setOpenDialog(true);
      }, 30000); // 30 seconds

      return () => clearInterval(interval);
    }
  }, [isNewUser]);

  if (!setting && !products && !cartItems && !TAGS) {
    return (
      <div className="flex items-center justify-center h-screen">
        <img src="/loader.svg" className="w-[200px] h-[100px] text-4xl" />
      </div>
    )
  }

  return (
    <>
      <MainNav />
      <SubNav />
      <Routes>
        <Route path='/' element={<Hero />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route path='/track-order' element={<OrderTrack />} />
        <Route path='/aboutus' element={<AboutUs />} />
        <Route path='/contactus' element={<Contactus />} />
        <Route path='/shop' element={<Shop />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/wishlist' element={<WishList />} />
        <Route path='/checkout' element={<CheckOut />} />
      </Routes>

      {isNewUser && (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="max-w-3xl">
            <Register isDialog={true} />
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

export default App
