import React from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CartItemCard from '../components/CartItemCard';
import CartEmptyDark from '../components/CartEmptyDark';

function CartPage() {
  const navigate = useNavigate()
  const { cartItems, totalAmount ,userData} = useSelector(state => state.user)
  

  const subtotal = Number(totalAmount || 0)
  const discount = 0
  const tax = 0
  const shippingCost = totalAmount>500?0:(totalAmount==0)?0:40
  const total = subtotal - discount + tax + shippingCost

  const fmt = (v) =>
    typeof v === 'number'
      ? `₹${v.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}`
      : v

  return (
    // outer peach/cream soft gradient background
    <div
      className="min-h-screen flex items-start justify-center p-6"
      style={{
        background:
          'linear-gradient(135deg, #fff8f3 0%, #fdeee3 40%, #f6d8c7 100%)',
      }}
    >
      {/* centered card container */}
      <div className="w-full max-w-[1100px] rounded-2xl bg-[rgba(255,255,255,0.9)] shadow-2xl p-6 lg:p-10"
           style={{ backdropFilter: 'blur(6px)' }}>
        {/* header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              aria-label="Go back"
              onClick={() => navigate('/')}
              className="p-1 rounded-md hover:bg-[rgba(0,0,0,0.03)] transition cursor-pointer"
            >
              <IoIosArrowRoundBack size={30} className="text-[#ff4d2d]" />
            </button>
            <div>
              <h1 className="text-3xl font-serif text-[#1f1f1f]">Cart</h1>
              <nav className="text-sm text-gray-500 mt-1">
                <span className="font-medium text-[#ff4d2d]">1. Cart</span>
                <span className="mx-3">—</span>
                <span>2. Checkout</span>
                <span className="mx-3">—</span>
                <span>3. Payment</span>
              </nav>
            </div>
          </div>

          {/* (optional) small shop logo / user area placeholder */}
          <div className="hidden md:flex items-center text-sm text-gray-600">
            <div className="mr-4">Hi, {userData.fullName}</div>
            <div className="w-9 h-9 bg-white rounded-full shadow-sm flex items-center justify-center">🛍️</div>
          </div>
        </div>

        {/* grid: left items (2 cols) + right summary (1 col) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: items list (span 2 on desktop) */}
          <div className="lg:col-span-2">
            {cartItems?.length === 0 ? (
              <CartEmptyDark />
            ) : (
              <>
                <div className="space-y-6">
                  {cartItems?.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-[rgba(255,255,255,0.8)] rounded-xl p-4 shadow-sm border"
                    >
                      {/* using your CartItemCard to render item content */}
                      <CartItemCard data={item} />
                    </div>
                  ))}
                </div>

                {/* totals / checkout CTA (mobile-friendly) */}
                <div className="mt-6 flex flex-col gap-3">
                  <div className="hidden sm:flex items-center justify-between bg-white p-4 rounded-xl shadow border">
                    <h2 className="text-lg font-semibold">Total Amount</h2>
                    <div className="text-xl font-bold text-[#ff4d2d]">{fmt(total)}</div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => navigate('/checkout')}
                      className="bg-[#ff4d2d] text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-[#e64526] transition"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* RIGHT: order summary */}
          <aside className="lg:col-span-1">
            <div className="w-full bg-[rgba(255,255,255,0.98)] rounded-xl p-6 shadow border sticky top-6">
              <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

              <div className="space-y-3 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Sub Total</span>
                  <span className="font-medium">{fmt(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span className="font-medium text-gray-600">{fmt(discount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span className="font-medium text-gray-600">{fmt(tax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  {
                    total>500?<span className="font-medium text-[#ff6a4d]">Free</span>

                    :<span className="font-medium text-[#ff6a4d]">{shippingCost}</span>
                  }
                  
                </div>

                <div className="border-t pt-3 mt-2 flex justify-between items-center">
                  <span className="text-base font-semibold">Total</span>
                  <span className="text-base font-bold">{fmt(total)}</span>
                </div>
              </div>

              {
                subtotal && <button 
                onClick={() => navigate('/checkout')}
                className="mt-6 w-full py-3 rounded-full bg-black text-white text-sm font-medium hover:opacity-95 transition"
                aria-label="Proceed to checkout"
              >
                Proceed to Checkout
              </button>
              }

              <p className="mt-3 text-xs text-gray-500">
                Estimated Delivery by <span className="font-medium">30 Minutes.</span>
              </p>
            </div>

            {/* coupon box */}
            <div className="mt-6">
              <div className="bg-[rgba(255,255,255,0.98)] rounded-xl p-4 shadow border">
                <h4 className="text-sm font-semibold mb-2">Have a Coupon?</h4>
                <div className="flex gap-2">
                  <input
                    className="flex-1 px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-[#ffd3c7]"
                    placeholder="Coupon Code"
                    aria-label="Coupon code"
                  />
                  <button className="px-3 py-2 rounded-md text-[#ff4d2d] font-semibold hover:bg-[rgba(255,77,45,0.06)] transition">
                    Apply
                  </button>
                </div>
              </div>
            </div>

          </aside>
        </div>
      </div>
    </div>
  )
}

export default CartPage
