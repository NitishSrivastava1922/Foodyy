import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";
import deliveryBoy from '../assets/deliveryboyNew.jpeg'
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { useState } from "react";
import { useEffect } from "react";
import { setSearchItems, setUserData } from '../redux/userSlice';


// DeliveryBoyProfile.jsx
// Edited per request:
// - Added "FOODYY" heading at the top (product name)
// - Replaced sparkline with Recharts BarChart using the provided JSX
// - Updated product color to match the Bar fill (#ff4d2d)
// - Kept Back button (top-left) which calls `onBack` prop or goes to `/` by default

export default function DeliveryBoyProfile({ onBack }) {
    const { userData, currentCity ,cartItems} = useSelector(state => state.user)
   
     const [todayDeliveries,setTodayDeliveries]=useState([])
     const [availableAssignments,setAvailableAssignments]=useState(null)
     const dispatch=useDispatch()
    const handleTodayDeliveries = async () => {
  const result = await axios.get(
    `${serverUrl}/api/order/get-today-deliveries`,
    { withCredentials: true }
  )
  
  setTodayDeliveries(result.data)
}
 const getAssignments=async () => {
    try {
      const result=await axios.get(`${serverUrl}/api/order/get-assignments`,{withCredentials:true})
      
      setAvailableAssignments(result.data)
    } catch (error) {
      console.log(error)
    }
  }
useEffect(()=>{
getAssignments()
handleTodayDeliveries()
  },[userData])
 console.log(userData)

  // sample deliveries data (assume you'll pass the same shape)
  
  

  const productColor = "#ff4d2d"; // bar fill color per your snippet

  function handleBack() {
    if (typeof onBack === "function") return onBack();
    // fallback to root
    window.location.href = "/";
  }
   const handleLogOut = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/auth/signout`, { withCredentials: true })
            dispatch(setUserData(null))
        } catch (error) {
            console.log(error)
        }
    }

  return (
    <div style={{ ['--product']: productColor }} className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f2027] via-[#203a43] to-[#2c5364] p-6">

      {/* Back button (top-left) */}
      <div className="absolute top-6 left-6">
        <button onClick={handleBack} aria-label="Go home" className="flex items-center gap-2 bg-black/30 backdrop-blur-md border border-white/10 text-white px-3 py-2 rounded-lg hover:scale-105 transition">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm">Go to Foodyy</span>
        </button>
      </div>

      {/* Header with product name */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
        <div className="px-4 py-2 rounded-lg bg-black/25 border border-white/10 text-white font-semibold tracking-wide" style={{ color: 'var(--product)' }}>
          FOODYY
        </div>
      </div>

      {/* Glass Card */}
      <div className="w-full max-w-5xl rounded-3xl bg-white/6 backdrop-blur-2xl border border-white/10 shadow-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6 relative">

        {/* LEFT – Profile */}
        <div className="col-span-1 flex flex-col items-center text-center bg-black/25 rounded-2xl p-6">
          <div className="relative">
            <img
              src={deliveryBoy}
              alt="Delivery Boy"
              className="w-28 h-28 rounded-full border-4 shadow-lg object-cover"
              style={{ borderColor: 'var(--product)' }} loading="lazy"
            />
            <span className="absolute bottom-0 right-0 transform translate-x-1 translate-y-1 w-5 h-5 rounded-full" style={{ background: 'var(--product)', boxShadow: '0 0 0 4px rgba(0,0,0,0.5)' }} />
          </div>

          <h2 className="mt-4 text-xl font-semibold text-white">{userData.fullName}</h2>
          <p className="text-sm text-gray-300">Delivery Partner</p>

          <div className="mt-4 px-4 py-2 rounded-full text-sm inline-flex items-center gap-2" style={{ background: 'rgba(255,77,45,0.10)', color: 'var(--product)' }}>
            <span className="w-2 h-2 rounded-full inline-block" style={{ background: 'var(--product)' }} />
            Active
          </div>

          <div className="mt-6 w-full space-y-3 text-left">
            <div className="flex justify-between text-gray-300 text-sm">
              <span>ID</span>
              <span className="text-white">#DP-14597</span>
            </div>
            <div className="flex justify-between text-gray-300 text-sm">
              <span>Vehicle</span>
              <span className="text-white">Bike</span>
            </div>
            <div className="flex justify-between text-gray-300 text-sm">
              <span>City</span>
              <span className="text-white">{currentCity}</span>
            </div>
          </div>

          <div className="mt-5 w-full flex gap-3">
            <button style={{ background: 'var(--product)', color: '#fff' }} className="flex-1 hover:brightness-90 transition text-white py-2 rounded-lg shadow">Call Shop Owner</button>
            <button className="flex-1 bg-white/6 hover:bg-white/10 transition text-white py-2 rounded-lg border border-white/10">Message</button>
            
          </div>
           <div className="mt-5">
               <button  className="p-7 flex items-center justify-center bg-white/6 hover:bg-white/10 transition text-white py-2 rounded-lg border border-white/10 cursor-pointer" onClick={handleLogOut}> Log Out </button>
           </div>
          

        </div>

        {/* RIGHT – Stats & Widgets */}
        <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-4">

          {/* Deliveries Bar Chart */}
          <div className="bg-black/25 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm"></p>
                <h3 className="text-2xl font-bold text-white mt-2">Your Performance</h3>
                <p className="text-gray-400 text-sm mt-1">Today (hourly)</p>
              </div>
                 <div className="text-right text-gray-300 text-sm">
                     Updated at {new Date().toLocaleTimeString()}
                  </div>
            </div>

            <div className="mt-4 h-48">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={todayDeliveries}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" tickFormatter={(h) => `${h}:00`} />
                  <YAxis allowDecimals={false} />
                  <Tooltip formatter={(value) => [value, "orders"]} labelFormatter={(label) => `${label}:00`} />
                  <Bar dataKey="count" fill={productColor} />
                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>

          {/* Deliveries Card */}
          <div className="bg-black/25 rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Deliveries</p>
              <h3 className="text-2xl font-bold text-white mt-2">45,120</h3>
              <p className="text-gray-400 text-sm mt-1">All time</p>
            </div>
            <div className="text-right text-gray-300 text-sm">⭐ 4,120 rating points</div>
          </div>

          {/* Rating (Span 2 cols) */}
          <div className="bg-black/25 rounded-2xl p-5 col-span-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Rating</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="text-yellow-400 text-xl">★★★★★</div>
                  <div className="text-white font-semibold text-lg">4.8</div>
                  <div className="text-sm text-gray-300">(based on 4,120 ratings)</div>
                </div>
              </div>

              <div className="flex flex-col items-end text-right">
                <div className="text-gray-400 text-sm">Availability</div>
                <div className="mt-2 inline-flex items-center gap-2 bg-white/6 px-3 py-1 rounded-full">
                  <span className="w-2 h-2 rounded-full inline-block" style={{ background: 'var(--product)' }} />
                  <span className="text-white text-sm">Online</span>
                </div>
              </div>
            </div>

            <div className="mt-4 w-full bg-gradient-to-r from-[var(--product)] to-[var(--product)] h-2 rounded-full overflow-hidden shadow-inner">
              <div className="w-[72%] h-full bg-white/0" />
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3 text-center text-sm text-gray-300">
              <div className="bg-black/20 p-3 rounded-lg">
                <div className="text-white font-semibold">{availableAssignments?.length>0?availableAssignments?.length:0}</div>
                <div className="text-xs">Active Orders</div>
              </div>
              <div className="bg-black/20 p-3 rounded-lg">
                <div className="text-white font-semibold">{availableAssignments?.length>0?availableAssignments?.length:0}</div>
                <div className="text-xs">Pending</div>
              </div>
              <div className="bg-black/20 p-3 rounded-lg">
                <div className="text-white font-semibold">{todayDeliveries.length}</div>
                <div className="text-xs">Completed Today</div>
              </div>
            </div>

          </div>

        </div>
             
      </div>
      
    </div>
  );
}

/*
  USAGE:
  - This file is a single React component using Tailwind CSS classes.
  - Props:
    - onBack: optional function called when the top-left Back/Home button is clicked
  - To preview quickly:
    1) Create a new React app (Vite/CRA) and install Tailwind using the official guide
    2) Paste this file as `DeliveryBoyProfile.jsx` and import it in App.jsx
    3) Install `recharts` (npm i recharts) and run

  QUICK SANDBOX: I can create a CodeSandbox link for live preview if you want.
*/
