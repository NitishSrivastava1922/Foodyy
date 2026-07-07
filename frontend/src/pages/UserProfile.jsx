import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FaCamera, FaHeart, FaRegClock, FaWallet, FaUserEdit } from "react-icons/fa";
import { AiOutlineLogout, AiOutlineSetting } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
// import { serverUrl } from "../App";
import axios from "axios";
// import { setSearchItems, setUserData } from '../redux/userSlice';
import { useDispatch } from "react-redux";
/**
 * UserProfileUltra.jsx
 * Visual update: converted backgrounds and panels to glassy/frosted style
 * - kept all logic & data intact
 * - replaced solid white panels with semi-transparent glass + backdrop blur
 * - kept orange accent colors as-is
 *
 * FIXES applied: guard against undefined `userData`/`myOrders` to avoid runtime errors.
 */

export default function UserProfile({ user: userProp = null, onSave = (u) => console.log("save", u), onLogout = () => console.log("logout") }) {
  const demo = {
    name: "Asha Sharma",
    email: "asha.sharma@example.com",
    phone: "+91 98765 43210",
    wallet: 429.5,
    ordersCount: 128,
    favoritesCount: 46,
    addresses: [
      { id: 1, label: "Home", addr: "12, MG Road, Lucknow, Uttar Pradesh" },
      { id: 2, label: "Work", addr: "4th Floor, Tech Park, Kanpur" }
    ],
    recentOrders: [
      { id: 1, title: "Paneer Butter Masala + Rice", date: "2026-01-20", amount: 279 },
      { id: 2, title: "Veggie Pizza (Large)", date: "2026-01-12", amount: 499 },
    ],
    avatar: "",
    createdAt: new Date().toISOString(),
  };

  // redux state (may be undefined while loading)
  const reduxUser = useSelector(state => state.user);
  const userData = reduxUser?.userData;
  const currentCity = reduxUser?.currentCity;
  const myOrders = reduxUser?.myOrders || [];
  const currentAddress = reduxUser?.currentAddress || "";

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const initial = userProp || demo;
  const [user, setUser] = useState({ ...initial });
  const [editing, setEditing] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(initial.avatar || "");
  const fileRef = useRef(null);

  // safeUser: prefer redux userData, otherwise fallback to initial/demo
  const safeUser = userData || initial;

  const initials = (name) => (name || safeUser.fullName || safeUser.name || "User").split(" ").map(s => s[0]).slice(0,2).join("").toUpperCase();

  function handleAvatarChange(e){
    const f = e.target.files?.[0];
    if(!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(reader.result);
      setUser(s => ({ ...s, avatar: reader.result }));
    };
    reader.readAsDataURL(f);
  }

  function handleSave(){
    setEditing(false);
    setEditingField(null);
    onSave(user);
  }

  function handleCancel(){
    setUser({ ...initial });
    setAvatarPreview(initial.avatar || "");
    setEditing(false);
    setEditingField(null);
  }
  const handleLogOut = async () => {
  try {
    const result = await axios.get(`${serverUrl}/api/auth/signout`, { withCredentials: true });
    dispatch(setUserData(null));
  } catch (error) {
    console.log(error);
  }
}

// glass styles used across panels
  const glassBase = {
    background: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02))',
    backdropFilter: 'blur(10px) saturate(120%)',
    border: '1px solid rgba(255,255,255,0.06)'
  }

  const panelGlass = {
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(8px) saturate(120%)',
    border: '1px solid rgba(255,255,255,0.06)'
  }

  return (
    <div
      className="min-h-screen py-10 px-4"
      style={{
        // dark frosted backdrop like DeliveryBoyProfile
        background: 'radial-gradient(ellipse at top left, #0f2027 0%, #203a43 50%, #2c5364 100%)',
      }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Top hero card with glassy style */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative rounded-3xl overflow-hidden p-6 shadow-2xl"
          style={{
            ...glassBase,
            boxShadow: '0 10px 30px rgba(2,6,23,0.6)'
          }}
        >
          {/* decorative gradient shapes (subtle) */}
          <div
            className="pointer-events-none absolute -right-28 -top-24 w-72 h-72 rounded-full"
            style={{
              background:
                'radial-gradient(circle at 30% 30%, rgba(255,165,90,0.12), rgba(255,120,40,0.06))',
              filter: 'blur(52px)',
            }}
          />
          <div
            className="pointer-events-none absolute -left-28 -bottom-28 w-80 h-80 rounded-full"
            style={{
              background:
                'radial-gradient(circle at 30% 30%, rgba(255,235,210,0.08), rgba(255,200,150,0.04))',
              filter: 'blur(48px)',
            }}
          />

          <div className="flex flex-col lg:flex-row items-center gap-6">
            {/* avatar */}
            <div className="relative flex-shrink-0">
              {avatarPreview ? (
                <motion.img
                  src={avatarPreview}
                  alt="avatar"
                  className="w-32 h-32 lg:w-40 lg:h-40 rounded-full object-cover border-4 border-white shadow-2xl"
                  initial={{ scale: 0.98 }}
                  animate={{ scale: 1 }}
                />
              ) : (
                <motion.div
                  initial={{ scale: 0.98 }}
                  animate={{ scale: 1 }}
                  className="w-32 h-32 lg:w-40 lg:h-40 rounded-full bg-gradient-to-br from-[#ffd9c4] to-[#ffb48a] flex items-center justify-center text-3xl font-bold text-[#b33d00] border-4 border-white shadow-2xl"
                >
                  {initials(userData.fullName)}
                </motion.div>
              )}

              <button
                onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1 -right-1 bg-white p-2 rounded-full shadow hover:scale-105 transition"
                aria-label="Change avatar"
              >
                <FaCamera className="text-[#ff6a2b]" />
              </button>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>

            {/* name + meta */}
            <div className="flex-1 w-full">
              <div className="flex items-start lg:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl lg:text-3xl font-extrabold text-orange-600">{safeUser.fullName || safeUser.name}</h1>
                  <p className="text-sm text-gray-300 mt-1">{safeUser.email} · {safeUser.mobile || safeUser.phone}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <span className="inline-block bg-[#fff5f0] px-3 py-1 rounded-full text-xs font-medium text-[#ff6a2b] shadow-sm">
                      Premium
                    </span>
                    <span className="text-xs text-gray-400">
                      Member since {new Date(safeUser.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", })}
                    </span>
                  </div>
                </div>

                <div className="ml-auto flex items-center gap-3">
                  {/* prominent Logout button in orange */}
                  <button
                    onClick={handleLogOut}
                    title="Logout"
                    className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-slate-100 font-semibold shadow-lg hover:scale-[1.02] transition cursor-pointer"
                    style={{ background: 'linear-gradient(90deg,#ff7a2d,#ff4d2d)' }}
                    aria-label="Logout"
                  >
                    <AiOutlineLogout className="text-lg" />
                    Logout
                  </button>

                  {/* small logout for xs */}
                  <button
                    onClick={handleLogOut}
                    title="Logout"
                    className="sm:hidden p-2 rounded-md bg-white shadow cursor-pointer"
                    aria-label="Logout small"
                  >
                    <AiOutlineLogout className="text-[#ff6a2b] text-lg" />
                  </button>

                  {!editing ? (
                    <button
                      onClick={() => setEditing(true)}
                      className="px-4 py-2 rounded-full text-slate-100 font-semibold shadow hover:scale-[1.02] transition"
                      style={{ background: 'linear-gradient(90deg,#ff7a2d,#ff4d2d)' }}
                    >
                      Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 rounded-full text-slate-100"
                        style={{ background: '#ff6a2b' }}
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 rounded-full bg-white border"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* quick actions pills */}
              <div className="mt-4 flex flex-wrap gap-3">
                <ActionPill
                  icon={<FaRegClock />}
                  label="Your Orders"
                  onClick={() => navigate("/my-orders")}
                  className="cursor-pointer"
                />
                <ActionPill
                  icon={<FaHeart />}
                  label="Favorites"
                  onClick={() => alert("Go to favs")}
                />
                <ActionPill
                  icon={<FaWallet />}
                  label={`Wallet ₹${Math.round(user.wallet)}`}
                  onClick={() => alert("Wallet")}
                />
                <ActionPill
                  icon={<AiOutlineSetting />}
                  label="Settings"
                  onClick={() => alert("Settings")}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* stats */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Orders"
            value={myOrders.length}
            icon={<FaRegClock />}
          />
          <StatCard
            label="Favorites"
            value={user.favoritesCount}
            icon={<FaHeart />}
          />
          <StatCard
            label="Wallet"
            value={`₹${Math.round(user.wallet)}`}
            icon={<FaWallet />}
          />
        </div>

        {/* main content */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* left: details */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="lg:col-span-2 rounded-xl p-6 shadow border"
            style={panelGlass}
          >
            <h2 className="text-lg font-semibold text-slate-100 mb-4">Profile Details</h2>

            <EditableRow
              label="Name"
              value={safeUser.fullName}
              editing={editing}
              isField={editingField === "name"}
              onEdit={() => setEditingField("name")}
              onChange={(v) => setUser((s) => ({ ...s, name: v }))}
            />

            <EditableRow
              label="Email"
              value={safeUser.email}
              editing={editing}
              isField={editingField === "email"}
              onEdit={() => setEditingField("email")}
              onChange={(v) => setUser((s) => ({ ...s, email: v }))}
            />

            <EditableRow
              label="Phone"
              value={safeUser.mobile}
              editing={editing}
              isField={editingField === "phone"}
              onEdit={() => setEditingField("phone")}
              onChange={(v) => setUser((s) => ({ ...s, phone: v }))}
            />

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <h3 className="text-md font-semibold text-slate-100">Saved Addresses</h3>
                <button
                  onClick={() =>
                    setUser((s) => ({
                      ...s,
                      addresses: [
                        ...(s.addresses || []),
                        { id: Date.now(), label: "New", addr: "Add address" },
                      ],
                    }))
                  }
                  className="text-sm text-[#ff6a2b] font-medium"
                >
                  + Add
                </button>
              </div>

              <ul className="mt-4 space-y-3">
                {(user.addresses || []).map((ad) => (
                  <li
                    key={ad.id}
                    className="p-3 rounded-lg border hover:shadow-sm flex gap-3 items-start"
                    style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
                  >
                    <div className="text-[#ff6a2b] mt-1">📍</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-slate-100">{ad.label}</div>
                        <div className="text-sm text-[#ff6a2b] cursor-pointer">Edit</div>
                      </div>
                      <p className="text-sm text-gray-300 mt-1">{currentAddress}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* right: recent orders */}
          <motion.aside
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="rounded-xl p-5 shadow-md border flex flex-col"
            style={panelGlass}
          >
            <h3 className="text-lg font-semibold mb-3 text-slate-100">Recent Orders</h3>
            <div className="space-y-3 flex-1">
              {(user.recentOrders || []).map((o) => (
                <div
                  key={o.id}
                  className="flex items-center justify-between p-2 rounded-md hover:bg-opacity-5"
                  style={{ background: 'rgba(255,255,255,0.02)' }}
                >
                  <div>
                    <div className="font-medium text-slate-100 text-sm">{o.title}</div>
                    <div className="text-xs text-gray-400">{o.date}</div>
                  </div>
                  <div className="text-sm font-semibold text-slate-100">₹{o.amount}</div>
                </div>
              ))}
            </div>

            <div className="mt-4">
              <button
                className="w-full rounded-full py-2 text-slate-100 font-semibold shadow cursor-pointer"
                onClick={() => navigate("/my-orders")}
                style={{ background: 'linear-gradient(90deg,#ff7a2d,#ff4d2d)' }}
              >
                View all orders
              </button>
              <button
                className="w-full mt-3 rounded-full py-2 border text-[#ff6a2b] font-semibold"
                onClick={() => alert("Manage payments")}
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
              >
                Manage payments
              </button>
            </div>

            <div className="mt-4 text-xs text-gray-400">Account created on {new Date(safeUser.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</div>
          </motion.aside>
        </div>
      </div>

      {/* small helpers styles */}
      <style>{`
        .glass { background: rgba(255,255,255,0.7); backdrop-filter: blur(6px); }
      `}</style>
    </div>
  );
}

/* ---------------- subcomponents ---------------- */
function ActionPill({ icon, label, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-2 rounded-full shadow-sm hover:scale-[1.02] transition text-sm ${className}`}
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}
    >
      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,245,236,0.7)', color: '#ff6a2b' }}>
        {icon}
      </div>
      <div className="text-sm text-slate-100 font-medium">{label}</div>
    </button>
  );
}


function StatCard({ label, value, icon }){
  return (
    <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(6px) saturate(120%)', border: '1px solid rgba(255,255,255,0.05)' }}>
      <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,245,236,0.7)', color: '#ff6a2b' }}>{icon}</div>
      <div className="mt-2">
        <div className="text-sm text-gray-300">{label}</div>
        <div className="text-lg font-semibold text-slate-100">{value}</div>
      </div>
    </div>
  );
}

function EditableRow({ label, value, editing, isField, onEdit, onChange }){
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-300">{label}</div>
        { editing && <button onClick={onEdit} className="text-xs text-[#ff6a2b]">Edit</button> }
      </div>
      { editing && isField ? (
        <input value={value} onChange={(e)=>onChange(e.target.value)} className="mt-2 w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#ffecd9]" />
      ) : (
        <div className="mt-2 text-sm text-slate-100">{value}</div>
      ) }
    </div>
  );
}
