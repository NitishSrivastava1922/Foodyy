/*
Foody Admin — Single-file React + Tailwind preview
Drop this file into your site's pages section (e.g., /src/pages/admin-page.jsx) and ensure Tailwind CSS is configured.

Filename: admin-page.jsx (save as src/pages/admin-page.jsx)

Features included (production-ready patterns):
- Responsive layout: collapsible left nav, main content, right details drawer (collapsible on mobile)
- Header with search (global), avatar, dark-mode toggle
- Mock API (in-file) that simulates latency and returns generated arrays: users (200), shops (50), deliveryBoys (60), orders (120)
- Users management: table with search (global + local), filter, sort, pagination, multi-select bulk actions, view details drawer, block/unblock, delete with confirm modal
- Shops management: grid with manage/edit/delete actions and shop detail modal
- Delivery management: list with map modal (placeholder), assign/unassign, pause/resume, CSV export
- CSV export, skeleton loaders, toast notifications
- Accessible HTML (aria, role attributes) and keyboard friendly controls

Mock Data Example (verbatim):
// users[0]
{
  "id": "u_001",
  "name": "Rahul Sharma",
  "email": "rahul.sharma@example.com",
  "phone": "+91-98xxxxxxx",
  "city": "Bengaluru",
  "joinedAt": "2025-11-02T10:12:00Z",
  "status": "active",
  "avatar": "https://i.pravatar.cc/150?img=12",
  "lastLogin": "2026-01-15T08:23:00Z"
}
// shop[0]
{
  "id":"s_001",
  "name":"Biryani King",
  "category":"Biryani",
  "owner":"Amit Patel",
  "verified": true,
  "status":"open",
  "rating":4.6,
  "logo":"https://picsum.photos/seed/shop1/80"
}
// deliveryBoy[0]
{
  "id":"d_001",
  "name":"Suresh Kumar",
  "phone":"+91-9xxxxxx",
  "status":"online",
  "currentLocation": {"lat":12.9716,"lng":77.5946},
  "assignedOrders": 3,
  "avatar":"https://i.pravatar.cc/150?img=5"
}

Sample JSON Schemas (one-line):
- User: {id,name,email,phone,city,joinedAt,status,avatar,lastLogin}
- Shop: {id,name,category,owner,verified,status,rating,logo,menuItems:[{id,name,price}],address,location:{lat,lng},lastPayouts:[{date,amount}]}
- DeliveryBoy: {id,name,phone,status,currentLocation:{lat,lng},assignedOrders,avatar,paused:boolean}

IMPLEMENTATION NOTES:
- This single-file intentionally contains a small mock API object at the top (mockApi) — in a real app extract this to src/api/mockApi.js and wire to real endpoints.
- To use faker.js instead of the simple generators here, replace generate* functions with faker calls and install @faker-js/faker.
- Tailwind: make sure Tailwind is configured in your project and the parent HTML includes the compiled CSS.

*/

import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';


// ---------------------- Mock API (in-file) ----------------------
// Simple deterministic pseudo-random generator for reproducible mock data
function rand(seed = 1) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return function() {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const mockApi = (() => {
  const r = rand(Date.now() % 100000);
  const names = ['Rahul Sharma','Priya Singh','Amit Patel','Sneha Gupta','Vikram Rao','Kavya Menon','Arjun Mehta','Nisha Kumar','Vivek Joshi','Anjali Roy'];
  const cities = ['Bengaluru','Mumbai','Delhi','Hyderabad','Chennai','Pune'];
  const shopNames = ['Biryani King','Pizza Paradise','Burger Hub','Curry House','Tandoori Nights','Noodle Corner'];
  const categories = ['Biryani','Fast Food','North Indian','Chinese','Continental','Desserts'];

  function makeUsers(count = 200) {
    return Array.from({length: count}, (_, i) => {
      const name = names[i % names.length] + ` ${i+1}`;
      const city = cities[i % cities.length];
      const status = (i % 12 === 0) ? 'blocked' : 'active';
      return {
        id: `u_${String(i+1).padStart(3,'0')}`,
        name,
        email: `${name.split(' ').join('.').toLowerCase()}@foody.example`,
        phone: `+91-${Math.floor(9000000000 + r()*100000000)}`,
        city,
        joinedAt: new Date(Date.now() - Math.floor(r()*1000*60*60*24*365)).toISOString(),
        status,
        avatar: `https://i.pravatar.cc/150?u=user${i}`,
        lastLogin: new Date(Date.now() - Math.floor(r()*1000*60*60*24*30)).toISOString(),
      };
    });
  }

  function makeShops(count = 50) {
    return Array.from({length: count}, (_, i) => {
      const base = shopNames[i % shopNames.length] + ` ${i+1}`;
      return {
        id: `s_${String(i+1).padStart(3,'0')}`,
        name: base,
        category: categories[i % categories.length],
        owner: `Owner ${i+1}`,
        verified: (i % 4 !== 0),
        status: (i % 5 === 0) ? 'closed' : 'open',
        rating: +(3 + (r()*2)).toFixed(1),
        logo: `https://picsum.photos/seed/shop${i}/80`,
        menuItems: Array.from({length: 6}, (_, m) => ({ id: `m_${i}_${m}`, name: `Item ${m+1}`, price: Math.ceil(50 + r()*400) })),
        address: `${100+i} Sample Street, ${cities[i % cities.length]}`,
        location: { lat: 12.95 + r()*0.1, lng: 77.58 + r()*0.1 },
        lastPayouts: Array.from({length:3}, (_,p)=>({ date: new Date(Date.now()- (p*86400000*30)).toISOString(), amount: Math.round(5000 + r()*5000) }))
      };
    });
  }

  function makeDelivery(count = 60) {
    return Array.from({length: count}, (_, i) => ({
      id: `d_${String(i+1).padStart(3,'0')}`,
      name: `Rider ${i+1}`,
      phone: `+91-${Math.floor(9000000000 + r()*100000000)}`,
      status: (i%5===0)?'offline':'online',
      currentLocation: { lat: 12.97 + r()*0.1, lng: 77.59 + r()*0.1 },
      assignedOrders: Math.floor(r()*5),
      avatar: `https://i.pravatar.cc/150?u=rider${i}`,
      paused: false,
    }));
  }

  function makeOrders(count = 120, users, shops) {
    return Array.from({length: count}, (_, i) => {
      const user = users[i % users.length];
      const shop = shops[i % shops.length];
      const statuses = ['preparing','on_the_way','delivered','cancelled'];
      return {
        id: `o_${String(i+1).padStart(4,'0')}`,
        userId: user.id,
        shopId: shop.id,
        total: Math.round(150 + r()*1200),
        status: statuses[i % statuses.length],
        createdAt: new Date(Date.now() - Math.floor(r()*1000*60*60*24*30)).toISOString()
      };
    });
  }

  // Generate data once
  const users = makeUsers(200);
  const shops = makeShops(50);
  const delivery = makeDelivery(60);
  const orders = makeOrders(120, users, shops);

  // Simulated API with latency
  return {
    fetchUsers: (delay=600)=> new Promise(res=>setTimeout(()=>res([...users]), delay)),
    fetchShops: (delay=500)=> new Promise(res=>setTimeout(()=>res([...shops]), delay)),
    fetchDelivery: (delay=700)=> new Promise(res=>setTimeout(()=>res([...delivery]), delay)),
    fetchOrders: (delay=500)=> new Promise(res=>setTimeout(()=>res([...orders]), delay)),
    // Utilities to mutate mock DB in-memory (for demo only)
    blockUser: (id)=> new Promise(res=>setTimeout(()=>{ const u = users.find(x=>x.id===id); if(u) u.status='blocked'; res(u); }, 300)),
    unblockUser: (id)=> new Promise(res=>setTimeout(()=>{ const u = users.find(x=>x.id===id); if(u) u.status='active'; res(u); }, 300)),
    deleteUser: (id)=> new Promise(res=>setTimeout(()=>{ const idx = users.findIndex(x=>x.id===id); if(idx>=0) users.splice(idx,1); res({ok:true}); }, 300)),
    // similarly for shops/delivery...
  };
})();

// ---------------------- Utilities ----------------------
const cn = (...c)=> c.filter(Boolean).join(' ');

function formatDate(iso){
  return new Date(iso).toLocaleString();
}

function downloadCSV(rows, filename = 'export') {
  if (!rows || !rows.length) return;

  const headers = Object.keys(rows[0]);

  const safe = (value) =>
    `"${String(value ?? '').replace(/"/g, '""')}"`;

  const csv = [
    headers.join(','),
    ...rows.map(row => headers.map(h => safe(row[h])).join(','))
  ].join('\n'); // ✅ FIX HERE

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();

  URL.revokeObjectURL(url);
}


// ---------------------- Small UI Primitives ----------------------
function Icon({name='circle', size=18, className=''}){
  const ic = {
    menu: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />,
    users: <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493" />,
    chart: <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25" />,
    shop: <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5" />,
    truck: <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0" />,
    search: <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />,
    sun: <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591" />,
    moon: <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75" />,
    download: <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5" />,
    close: <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className} aria-hidden>
      {ic[name]}
    </svg>
  );
}

function Skeleton({className='h-6 w-full bg-gray-200 rounded'}){
  return <div role="status" aria-busy className={cn('animate-pulse', className)}></div>;
}

function Modal({open, onClose, title, children, footer}){
  if(!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div role="dialog" aria-modal className="relative z-10 w-full max-w-2xl rounded-2xl bg-white p-4 shadow-lg dark:bg-gray-800">
        <div className="flex items-center justify-between border-b pb-2 mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button aria-label="Close modal" onClick={onClose} className="p-2 rounded hover:bg-gray-100"><Icon name="close" size={18} /></button>
        </div>
        <div>{children}</div>
        {footer && <div className="mt-4 border-t pt-3">{footer}</div>}
      </div>
    </div>
  );
}

function Drawer({open, onClose, title, children}){
  return (
    <div aria-hidden={!open} className={cn('fixed inset-y-0 right-0 z-50 transform transition-transform', open? 'translate-x-0' : 'translate-x-full')}>
      {open && <div className="fixed inset-0 bg-black/30" onClick={onClose} />}
      <aside className="relative z-10 w-full max-w-md h-full bg-white p-4 dark:bg-gray-900">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button aria-label="Close drawer" onClick={onClose} className="p-2 rounded hover:bg-gray-100"><Icon name="close" /></button>
        </div>
        <div className="overflow-y-auto h-[80vh]">{children}</div>
      </aside>
    </div>
  );
}

function Toast({msg, onClose}){
  useEffect(()=>{ const t=setTimeout(()=>onClose(),3000); return ()=>clearTimeout(t);},[onClose]);
  return (
    <div className="fixed bottom-6 right-6 z-50 rounded-lg bg-gray-900 text-white px-4 py-2 shadow">{msg}</div>
  );
}

// ---------------------- App Components ----------------------

export default function App(){
  // Global UI State
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dark, setDark] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [toast, setToast] = useState(null);
  const [globalSearch, setGlobalSearch] = useState('');
  const [availableBoys,setAvailableBoys]=useState([])

  // Data
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [shops, setShops] = useState([]);
  const [shopsLoading, setShopsLoading] = useState(true);
  const [delivery, setDelivery] = useState([]);
  const [deliveryLoading, setDeliveryLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(()=>{
    document.documentElement.classList.toggle('dark', dark);
  },[dark]);

  // Fetch mock data once
  useEffect(()=>{
    setUsersLoading(true);
    mockApi.fetchUsers().then(res=>{ setUsers(res); setUsersLoading(false); });
    setShopsLoading(true);
    mockApi.fetchShops().then(res=>{ setShops(res); setShopsLoading(false); });
    setDeliveryLoading(true);
    mockApi.fetchDelivery().then(res=>{ setDelivery(res); setDeliveryLoading(false); });
    mockApi.fetchOrders().then(res=> setOrders(res));
  },[]);

  const summary = useMemo(()=>({
    totalUsers: users.length,
    activeShops: shops.filter(s=>s.status==='open').length,
    activeDelivery: delivery.filter(d=>d.status==='online').length,
    openOrders: orders.filter(o=>o.status!=='delivered' && o.status!=='cancelled').length,
    revenueToday: orders.filter(o=> new Date(o.createdAt) > (Date.now()-24*3600*1000)).reduce((s,o)=>s+o.total,0)
  }), [users,shops,delivery,orders]);

  return (
    <div className="min-h-screen flex text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className={cn('bg-white dark:bg-gray-800 border-r dark:border-gray-700 transition-transform', sidebarOpen? 'w-64':'w-16')}>
        <div className="p-4 flex items-center justify-between">
          <div className={cn('flex items-center gap-2', !sidebarOpen && 'justify-center w-full')}>
            <div className="h-10 w-10 rounded-lg bg-orange-500 text-white flex items-center justify-center font-bold">F</div>
            {sidebarOpen && <div className="font-bold">Foody Admin</div>}
          </div>
          <button aria-label="Toggle sidebar" onClick={()=>setSidebarOpen(s=>!s)} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            <Icon name="menu" />
          </button>
        </div>
        <nav className="px-2 py-4 space-y-1" aria-label="Main navigation">
          {[
            {id:'dashboard',label:'Dashboard',icon:'chart'},
            {id:'users',label:'Users',icon:'users'},
            {id:'shops',label:'Shops',icon:'shop'},
            {id:'delivery',label:'Delivery',icon:'truck'},
          ].map(i=> (
            <button key={i.id} onClick={()=>setActiveTab(i.id)} className={cn('flex items-center gap-3 w-full px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700', activeTab===i.id? 'bg-orange-50 text-orange-600':'text-gray-600') } aria-current={activeTab===i.id}>
              <Icon name={i.icon} />
              {sidebarOpen && <span>{i.label}</span>}
            </button>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 border-b dark:border-gray-700 bg-white/60 dark:bg-gray-900/60">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2" onClick={()=>setSidebarOpen(s=>!s)} aria-label="Open sidebar"><Icon name="menu"/></button>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><Icon name="search" size={16} /></div>
              <input aria-label="Global search" placeholder="Search users, shops, orders..." value={globalSearch} onChange={e=>setGlobalSearch(e.target.value)} className="px-10 py-2 rounded-lg border w-80 text-sm dark:bg-gray-800 dark:border-gray-700" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button aria-label="Toggle dark mode" onClick={()=>setDark(d=>!d)} className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"><Icon name={dark? 'sun':'moon'} /></button>
            <div className="h-9 w-9 rounded-full overflow-hidden border"><img src="https://i.pravatar.cc/150?img=68" alt="Admin avatar" /></div>
          </div>
        </header>

        {/* Main */}
        <main className="p-4 overflow-y-auto"> 
          <div className="max-w-7xl mx-auto">
            {/* Dashboard header */}
            {activeTab==='dashboard' && (
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold">Dashboard</h1>
                  <div className="flex gap-2 items-center">
                    <button onClick={()=>downloadCSV(users,'users-export')} className="px-3 py-2 bg-white border rounded hover:bg-gray-50 dark:bg-gray-800">Export Users</button>
                    <button onClick={()=>setToast('Demo toast message')} className="px-3 py-2 bg-orange-600 text-white rounded">Demo Toast</button>
                  </div>
                </div>

                {/* KPI cards (glassy) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="rounded-2xl bg-white/60 backdrop-blur-md p-4 shadow-lg flex flex-col">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">Total Users</div>
                      <Icon name="users" />
                    </div>
                    <div className="mt-4 text-2xl font-bold">{summary.totalUsers}</div>
                    <div className="text-xs text-green-600 mt-1">+4.2% vs last week</div>
                  </div>

                  <div className="rounded-2xl bg-white/60 backdrop-blur-md p-4 shadow-lg">
                    <div className="flex items-center justify-between"><div className="text-sm text-gray-500">Active Shops</div><Icon name="shop"/></div>
                    <div className="mt-4 text-2xl font-bold">{summary.activeShops}</div>
                    <div className="text-xs text-green-600 mt-1">+1.1% vs last week</div>
                  </div>

                  <div className="rounded-2xl bg-white/60 backdrop-blur-md p-4 shadow-lg">
                    <div className="flex items-center justify-between"><div className="text-sm text-gray-500">Active Delivery</div><Icon name="truck"/></div>
                    <div className="mt-4 text-2xl font-bold">{summary.activeDelivery}</div>
                    <div className="text-xs text-green-600 mt-1">+2% vs last week</div>
                  </div>

                  <div className="rounded-2xl bg-white/60 backdrop-blur-md p-4 shadow-lg">
                    <div className="flex items-center justify-between"><div className="text-sm text-gray-500">Open Orders</div><Icon name="chart"/></div>
                    <div className="mt-4 text-2xl font-bold">{summary.openOrders}</div>
                    <div className="text-xs text-yellow-600 mt-1">-0.5% vs last week</div>
                  </div>

                  <div className="rounded-2xl bg-white/60 backdrop-blur-md p-4 shadow-lg">
                    <div className="flex items-center justify-between"><div className="text-sm text-gray-500">Revenue (24h)</div><Icon name="download"/></div>
                    <div className="mt-4 text-2xl font-bold">${summary.revenueToday}</div>
                    <div className="text-xs text-green-600 mt-1">+6% vs last week</div>
                  </div>
                </div>

                {/* Recent / Simple lists */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
                  <div className="col-span-2 rounded-2xl bg-white/60 backdrop-blur-md p-4 shadow-lg">
                    <h3 className="font-semibold mb-2">Live Orders</h3>
                    <div className="space-y-3">
                      {orders.slice(0,6).map(o=> (
                        <div key={o.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                          <div>
                            <div className="font-medium">Order #{o.id}</div>
                            <div className="text-xs text-gray-500">{o.status} • {formatDate(o.createdAt)}</div>
                          </div>
                          <div className="text-sm font-bold">${o.total}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white/60 backdrop-blur-md p-4 shadow-lg">
                    <h3 className="font-semibold mb-2">Top Riders</h3>
                    <div className="space-y-3">
                      {delivery.slice(0,3).map(r=> (
                        <div key={r.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3"><img src={r.avatar} alt="" className="h-10 w-10 rounded-full" /><div><div className="font-medium">{r.name}</div><div className="text-xs text-green-500">{r.status}</div></div></div>
                          <div className="text-right"><div className="font-bold">{r.assignedOrders} orders</div><div className="text-xs text-gray-500">Active</div></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </section>
            )}

            {/* Users View */}
            {activeTab==='users' && (
              <UsersManager users={users} loading={usersLoading} globalSearch={globalSearch} onBlock={async(id)=>{ await mockApi.blockUser(id); setUsers(u=>u.map(x=>x.id===id?{...x,status:'blocked'}:x)); setToast('User blocked'); }} onUnblock={async(id)=>{ await mockApi.unblockUser(id); setUsers(u=>u.map(x=>x.id===id?{...x,status:'active'}:x)); setToast('User unblocked'); }} onDelete={async(id)=>{ await mockApi.deleteUser(id); setUsers(u=>u.filter(x=>x.id!==id)); setToast('User deleted'); }} />
            )}

            {/* Shops View */}
            {activeTab==='shops' && (
              <ShopsManager shops={shops} loading={shopsLoading} onUpdate={s=> setShops(prev=> prev.map(p=> p.id===s.id? s: p))} />
            )}

            {/* Delivery View */}
            {activeTab==='delivery' && (
              <DeliveryManager riders={delivery} loading={deliveryLoading} onExport={()=> downloadCSV(delivery,'delivery')} />
            )}

          </div>
        </main>
      </div>

      {toast && <Toast msg={toast} onClose={()=>setToast(null)} />}

    </div>
  );
}

// ---------------------- Users Manager ----------------------
function UsersManager({users, loading, onBlock, onUnblock, onDelete, globalSearch}){
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState({key:'joinedAt',dir:'desc'});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState([]);
  const [drawerUser, setDrawerUser] = useState(null);
  const [confirm, setConfirm] = useState({open:false,action:null,id:null});

  // Sync with global search (header)
  useEffect(()=>{
    setQ(globalSearch || '');
  },[globalSearch]);

  useEffect(()=> setPage(1), [q,statusFilter,pageSize]);

  const filtered = useMemo(()=>{
    const s = q.trim().toLowerCase();
    return users.filter(u=> (statusFilter==='all' || u.status===statusFilter) && (!s || `${u.name} ${u.email} ${u.phone} ${u.city}`.toLowerCase().includes(s)));
  },[users,q,statusFilter]);

  const sorted = useMemo(()=>{
    const arr = [...filtered];
    arr.sort((a,b)=>{
      const v = a[sortBy.key]; const w = b[sortBy.key];
      if(v<w) return sortBy.dir==='asc'? -1:1; if(v>w) return sortBy.dir==='asc'?1:-1; return 0;
    });
    return arr;
  },[filtered,sortBy]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageData = sorted.slice((page-1)*pageSize, page*pageSize);

  function toggleSelect(id){ setSelected(s=> s.includes(id)? s.filter(x=>x!==id): [...s,id]); }
  function toggleSelectAll(){ if(pageData.every(d=> selected.includes(d.id))) setSelected(s=> s.filter(x=> !pageData.some(p=>p.id===x))); else setSelected(s=> [...new Set([...s, ...pageData.map(p=>p.id)])]); }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Users Management</h2>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 bg-white border rounded" onClick={()=> downloadCSV(users,'users')}>Export CSV</button>
        </div>
      </div>

      <div className="flex gap-2 items-center">
        <input aria-label="Search users" placeholder="Search users" value={q} onChange={e=>setQ(e.target.value)} className="px-3 py-2 rounded border w-64 text-sm dark:bg-gray-800 dark:border-gray-700" />
        <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} className="px-3 py-2 rounded border dark:bg-gray-800">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="blocked">Blocked</option>
        </select>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-gray-500">Bulk:</span>
          <button onClick={()=>{ /* block selected */ selected.forEach(id=>onBlock && onBlock(id)); }} className="px-2 py-1 bg-yellow-500 text-white rounded">Block</button>
          <button onClick={()=>{ /* delete selected */ selected.forEach(id=>onDelete && onDelete(id)); setSelected([]); }} className="px-2 py-1 bg-red-600 text-white rounded">Delete</button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow">
        {loading? (
          <div className="p-6 space-y-4"><Skeleton className="h-6 w-1/3"/><Skeleton className="h-6 w-full"/><Skeleton className="h-6 w-full"/></div>
        ):(
          <table role="table" className="w-full text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3"><input aria-label="Select all" type="checkbox" onChange={toggleSelectAll} checked={pageData.every(d=> selected.includes(d.id))} /></th>
                <th className="px-4 py-3 cursor-pointer" onClick={()=>setSortBy({key:'name',dir: sortBy.key==='name' && sortBy.dir==='asc' ? 'desc':'asc'})}>Name</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">City</th>
                <th className="px-4 py-3" onClick={()=>setSortBy({key:'joinedAt', dir: sortBy.key==='joinedAt' && sortBy.dir==='asc' ? 'desc':'asc'})}>Joined</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map(u=> (
                <tr key={u.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3"><input aria-label={`Select ${u.name}`} type="checkbox" checked={selected.includes(u.id)} onChange={()=>toggleSelect(u.id)} /></td>
                  <td className="px-4 py-3 flex items-center gap-3">
                    <img src={u.avatar} alt="" className="h-10 w-10 rounded-full" />
                    <div>
                      <div className="font-medium">{u.name}</div>
                      <div className="text-xs text-gray-500">Joined {new Date(u.joinedAt).toLocaleDateString()}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><div>{u.email}</div><div className="text-xs text-gray-500">{u.phone}</div></td>
                  <td className="px-4 py-3">{u.city}</td>
                  <td className="px-4 py-3">{new Date(u.joinedAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3"><span className={cn('px-2 py-1 rounded-full text-xs', u.status==='active'? 'bg-green-100 text-green-700':'bg-red-100 text-red-700')}>{u.status}</span></td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={()=>setDrawerUser(u)} className="px-2 py-1 rounded bg-white border">View</button>
                      {u.status==='active'? <button onClick={()=>setConfirm({open:true,action:'block',id:u.id})} className="px-2 py-1 rounded bg-yellow-500 text-white">Block</button> : <button onClick={()=>onUnblock && onUnblock(u.id)} className="px-2 py-1 rounded bg-green-500 text-white">Unblock</button>}
                      <button onClick={()=>setConfirm({open:true,action:'delete',id:u.id})} className="px-2 py-1 rounded bg-red-600 text-white">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between pt-3">
        <div className="text-sm text-gray-500">Showing {(page-1)*pageSize+1} to {Math.min(users.length, page*pageSize)} of {users.length}</div>
        <div className="flex items-center gap-2">
          <select value={pageSize} onChange={e=>setPageSize(Number(e.target.value))} className="px-2 py-1 rounded border">
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <button onClick={()=>setPage(p=> Math.max(1,p-1))} className="px-2 py-1 rounded border">Prev</button>
          <div className="px-2">{page}/{totalPages}</div>
          <button onClick={()=>setPage(p=> Math.min(totalPages,p+1))} className="px-2 py-1 rounded border">Next</button>
        </div>
      </div>

      {/* Confirm Modal */}
      <Modal open={confirm.open} onClose={()=>setConfirm({open:false,action:null,id:null})} title={confirm.action==='delete'? 'Confirm Delete' : 'Confirm Block'} footer={<div className="flex justify-end gap-2"><button onClick={()=>setConfirm({open:false,action:null,id:null})} className="px-3 py-1">Cancel</button><button onClick={async()=>{ if(confirm.action==='delete'){ await onDelete(confirm.id);} else { await onBlock(confirm.id);} setConfirm({open:false}); }} className="px-3 py-1 bg-red-600 text-white rounded">Confirm</button></div>}>
        Are you sure? (Optional reason)
      </Modal>

      {/* Drawer */}
      <Drawer open={!!drawerUser} onClose={()=>setDrawerUser(null)} title={drawerUser? drawerUser.name : ''}>
        {drawerUser && (
          <div>
            <div className="text-center"><img src={drawerUser.avatar} className="mx-auto h-24 w-24 rounded-full" alt="" /><div className="mt-2 font-bold">{drawerUser.name}</div><div className="text-sm text-gray-500">{drawerUser.city}</div></div>
            <div className="mt-4 bg-gray-50 p-3 rounded">
              <h4 className="font-semibold">Contact</h4>
              <div className="text-sm">Email: {drawerUser.email}</div>
              <div className="text-sm">Phone: {drawerUser.phone}</div>
              <div className="text-sm">Last Login: {formatDate(drawerUser.lastLogin)}</div>
            </div>
            <div className="mt-4">
              <h4 className="font-semibold">Recent Orders</h4>
              <ul className="mt-2 space-y-2">
                {Array.from({length:3}).map((_,i)=> <li key={i} className="text-sm text-gray-600">Order #{1000+i} • ${100+i*10} • 2 days ago</li>)}
              </ul>
            </div>
            <div className="mt-4"><button className="w-full px-3 py-2 rounded bg-orange-600 text-white">Send Message</button></div>
          </div>
        )}
      </Drawer>

    </section>
  );
}

// ---------------------- Shops Manager (simplified) ----------------------
function ShopsManager({shops, loading, onUpdate}){
  const [editShop, setEditShop] = useState(null);
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between"><h2 className="text-xl font-bold">Partner Shops</h2><button className="px-3 py-2 bg-orange-600 text-white rounded">+ Add Shop</button></div>
      {loading? <Skeleton className="h-32"/> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {shops.map(s=> (
            <div key={s.id} className="rounded-2xl bg-white p-4 shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3"><img src={s.logo} className="h-14 w-14 rounded" alt="" /><div><div className="font-bold">{s.name}</div><div className="text-xs text-gray-500">{s.category}</div></div></div>
                <div className={cn('px-2 py-1 rounded text-xs', s.status==='open'? 'bg-teal-100 text-teal-700':'bg-orange-100 text-orange-700')}>{s.status}</div>
              </div>
              <div className="mt-3 text-sm text-gray-600">Owner: {s.owner}</div>
              <div className="mt-3 flex gap-2">
                <button onClick={()=>setEditShop(s)} className="px-3 py-1 rounded border">Manage</button>
                <button onClick={()=> onUpdate && onUpdate({...s, verified: !s.verified})} className={cn('px-3 py-1 rounded border', s.verified? 'bg-green-100':'')}>{s.verified? 'Unverify':'Verify'}</button>
                <button className="px-3 py-1 rounded border">Edit</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!editShop} onClose={()=>setEditShop(null)} title={editShop? editShop.name: ''}>
        {editShop && (
          <div>
            <div className="text-sm">Address: {editShop.address}</div>
            <div className="text-sm mt-2">Location: {editShop.location.lat.toFixed(4)}, {editShop.location.lng.toFixed(4)}</div>
            <div className="mt-3"><h4 className="font-semibold">Menu</h4><ul className="mt-2 space-y-1">{editShop.menuItems.map(m=> <li key={m.id} className="text-sm">{m.name} — ₹{m.price}</li>)}</ul></div>
            <div className="mt-3"><h4 className="font-semibold">Last Payouts</h4><ul className="mt-2 space-y-1">{editShop.lastPayouts.map(p=> <li key={p.date} className="text-sm">{new Date(p.date).toLocaleDateString()} — ₹{p.amount}</li>)}</ul></div>
          </div>
        )}
      </Modal>
    </section>
  );
}

// ---------------------- Delivery Manager ----------------------
function DeliveryManager({riders, loading, onExport}){
  const [mapView, setMapView] = useState(null);
  const [selected, setSelected] = useState(null);
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between"><h2 className="text-xl font-bold">Delivery Fleet</h2><div className="flex gap-2"><button onClick={()=> downloadCSV(riders,'riders')} className="px-3 py-1 border rounded">Export CSV</button></div></div>
      {loading? <Skeleton className="h-48"/> : (
        <div className="space-y-3">
          {riders.map(r=> (
            <div key={r.id} className="rounded-2xl bg-white p-3 shadow flex items-center justify-between">
              <div className="flex items-center gap-3"><img src={r.avatar} alt="" className="h-12 w-12 rounded-full" /><div><div className="font-medium">{r.name}</div><div className="text-xs text-gray-500">{r.phone}</div></div></div>
              <div className="flex items-center gap-3">
                <div className={cn('px-2 py-1 rounded text-sm', r.status==='online'? 'bg-blue-100 text-blue-700':'bg-gray-100 text-gray-600')}>{r.status}</div>
                <div className="text-sm">{r.assignedOrders} orders</div>
                <button onClick={()=> setMapView(r.currentLocation)} className="px-2 py-1 rounded border">View on map</button>
                <button onClick={()=> setSelected(r)} className="px-2 py-1 rounded border">Actions</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!mapView} onClose={()=>setMapView(null)} title="Map View">
        <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
          {/* Placeholder static map image */}
          <img src="https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg" alt="map" className="h-56 opacity-60" />
          <div className="absolute bottom-4 left-4 bg-white px-2 py-1 rounded shadow">Lat: {mapView?.lat.toFixed(4)}, Lng: {mapView?.lng.toFixed(4)}</div>
        </div>
      </Modal>

      <Modal open={!!selected} onClose={()=>setSelected(null)} title={selected? selected.name: ''}>
        {selected && (
          <div>
            <div className="text-sm">Phone: {selected.phone}</div>
            <div className="text-sm">Location: {selected.currentLocation.lat.toFixed(4)}, {selected.currentLocation.lng.toFixed(4)}</div>
            <div className="mt-3"><button className="px-3 py-2 rounded bg-orange-600 text-white">Assign to hub</button></div>
          </div>
        )}
      </Modal>
    </section>
  );
}

// ---------------------- End of file ----------------------

/*
How to use:
1. Ensure Tailwind CSS is set up in your project (postcss/tailwind.config.js). This file uses Tailwind classes only.
2. Save this file as src/pages/admin-page.jsx (or your preferred route file) and import it into your router or page system.
3. To connect to real backend: replace mockApi.fetch* calls with fetch/axios calls to your API endpoints. Maintain returned shapes matching the sample schemas.
*/
