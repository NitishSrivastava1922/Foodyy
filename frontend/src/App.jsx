import React, { useEffect, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { io } from 'socket.io-client'

import SplashScreen from "./components/SplashScreen"

import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import ForgotPassword from './pages/ForgotPassword'
import Home from './pages/Home'
import CreateEditShop from './pages/CreateEditShop'
import AddItem from './pages/AddItem'
import EditItem from './pages/EditItem'
import CartPage from './pages/CartPage'
import CheckOut from './pages/CheckOut'
import OrderPlaced from './pages/OrderPlaced'
import MyOrders from './pages/MyOrders'
import TrackOrderPage from './pages/TrackOrderPage'
import Shop from './pages/Shop'
import useGetCurrentUser from './hooks/useGetCurrentUser'
import useGetCity from './hooks/useGetCity'
import useGetMyshop from './hooks/useGetMyShop'
import useGetShopByCity from './hooks/useGetShopByCity'
import useGetItemsByCity from './hooks/useGetItemsByCity'
import useGetMyOrders from './hooks/useGetMyOrders'
import useUpdateLocation from './hooks/useUpdateLocation'
import UserProfile from './pages/UserProfile'
import DeliveryBoyProfile from './pages/DeliveryBoyProfile'
import AdminPage from './pages/AdminPage'
import { setSocket } from './redux/userSlice'

export const serverUrl = "https://foodyy-backend.onrender.com"

function App() {
  const { userData } = useSelector(state => state.user)
  const dispatch = useDispatch()

  const [showSplash, setShowSplash] = useState(true)

  // ---------- Splash screen timer ----------
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 3000) // 3 seconds

    return () => clearTimeout(timer)
  }, [])

  // ---------- Your existing hooks ----------
  useGetCurrentUser()
  useUpdateLocation()
  useGetCity()
  useGetMyshop()
  useGetShopByCity()
  useGetItemsByCity()
  useGetMyOrders()

  // ---------- Socket connection ----------
  useEffect(() => {
    const socketInstance = io(serverUrl, { withCredentials: true })
    dispatch(setSocket(socketInstance))

    socketInstance.on('connect', () => {
      if (userData) {
        socketInstance.emit('identity', { userId: userData._id })
      }
    })

    return () => {
      socketInstance.disconnect()
    }
  }, [userData?._id])

  // ---------- Show splash first ----------
  if (showSplash) {
    return <SplashScreen />
  }

  // ---------- Routes ----------
  return (
    <Routes>
      <Route path='/signup' element={!userData ? <SignUp /> : <Navigate to="/" />} />
      <Route path='/signin' element={!userData ? <SignIn /> : <Navigate to="/" />} />
      <Route path='/forgot-password' element={!userData ? <ForgotPassword /> : <Navigate to="/" />} />

      <Route path='/' element={userData ? <Home /> : <Navigate to="/signin" />} />
      <Route path='/create-edit-shop' element={userData ? <CreateEditShop /> : <Navigate to="/signin" />} />
      <Route path='/add-item' element={userData ? <AddItem /> : <Navigate to="/signin" />} />
      <Route path='/edit-item/:itemId' element={userData ? <EditItem /> : <Navigate to="/signin" />} />
      <Route path='/cart' element={userData ? <CartPage /> : <Navigate to="/signin" />} />
      <Route path='/checkout' element={userData ? <CheckOut /> : <Navigate to="/signin" />} />
      <Route path='/order-placed' element={userData ? <OrderPlaced /> : <Navigate to="/signin" />} />
      <Route path='/my-orders' element={userData ? <MyOrders /> : <Navigate to="/signin" />} />
      <Route path='/track-order/:orderId' element={userData ? <TrackOrderPage /> : <Navigate to="/signin" />} />
      <Route path='/shop/:shopId' element={userData ? <Shop /> : <Navigate to="/signin" />} />
      <Route path='/user-profile' element={userData ? <UserProfile /> : <Navigate to="/signin" />} />
      <Route path='/delivery-boy-profile' element={userData ?<DeliveryBoyProfile/> : <Navigate to="/signin" />} />
      <Route path='/admin-page' element={userData ?<AdminPage/> : <Navigate to="/signin" />} />
       
    </Routes>
  )
}

export default App
