import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { IoCartOutline, IoClose, IoAdd, IoRemove, IoLogOutOutline, IoPersonCircleOutline, IoShieldOutline } from 'react-icons/io5';
import api from './api';

import Landing from './pages/Landing';
import Menu from './pages/Menu';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Chatbot from './components/Chatbot';
import Footer from './components/Footer';

function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState({ items: [], total_price: 0 });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [address, setAddress] = useState('');
  const [isOrdering, setIsOrdering] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchCart();
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      const res = await api.get('/cart');
      setCart(res.data);
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  const handleAddToCart = async (foodId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await api.post('/cart', { food_id: foodId, quantity: 1 });
      fetchCart();
      setIsCartOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateQuantity = async (itemId, newQty) => {
    if (newQty <= 0) {
      handleRemoveFromCart(itemId);
      return;
    }
    try {
      await api.put(`/cart/${itemId}`, { quantity: newQty });
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveFromCart = async (itemId) => {
    try {
      await api.delete(`/cart/${itemId}`);
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!address.trim()) return;
    
    setIsOrdering(true);
    try {
      await api.post('/orders', { address });
      setAddress('');
      setIsCartOpen(false);
      fetchCart();
      navigate('/orders');
    } catch (err) {
      console.error(err);
      alert('Error placing order');
    } finally {
      setIsOrdering(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCart({ items: [], total_price: 0 });
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#030712] text-gray-100">
      {/* Navigation Header */}
      <header className="h-20 glass-panel border-b border-white/5 sticky top-0 z-40 flex items-center px-6">
        <div className="container mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-black tracking-tighter flex items-center gap-2">
            <span className="w-9 h-9 rounded-xl glow-button flex items-center justify-center text-white text-base">F</span>
            <span>Foodie<span className="text-rose-500 glow-text">AI</span></span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-gray-400">
            <Link to="/" className={`hover:text-rose-400 transition ${location.pathname === '/' ? 'text-rose-500' : ''}`}>Home</Link>
            <Link to="/menu" className={`hover:text-rose-400 transition ${location.pathname === '/menu' ? 'text-rose-500' : ''}`}>Menu</Link>
            {user && (
              <>
                <Link to="/orders" className={`hover:text-rose-400 transition ${location.pathname === '/orders' ? 'text-rose-500' : ''}`}>My Orders</Link>
                <Link to="/profile" className={`hover:text-rose-400 transition ${location.pathname === '/profile' ? 'text-rose-500' : ''}`}>Profile</Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className={`hover:text-rose-400 transition flex items-center gap-1 ${location.pathname === '/admin' ? 'text-rose-500' : ''}`}>
                    <IoShieldOutline /> Admin Ops
                  </Link>
                )}
              </>
            )}
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-4">
            {/* Cart Button */}
            {user && (
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white cursor-pointer transition"
              >
                <IoCartOutline className="text-xl" />
                {cart.items.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-600 text-[10px] font-bold flex items-center justify-center text-white">
                    {cart.items.length}
                  </span>
                )}
              </button>
            )}

            {/* Auth Profile / Login */}
            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden lg:flex flex-col text-right">
                  <span className="text-xs font-bold text-white leading-tight">{user.username}</span>
                  <span className="text-[10px] text-gray-400 capitalize">{user.role}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl bg-rose-950/20 border border-rose-900/30 text-rose-400 hover:bg-rose-900/30 cursor-pointer transition flex items-center gap-2 text-sm font-semibold"
                  title="Logout"
                >
                  <IoLogOutOutline className="text-lg" /> <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-5 py-2.5 rounded-xl glow-button text-white font-bold text-sm"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/menu" element={<Menu onAddToCart={handleAddToCart} />} />
          <Route path="/login" element={<Login onLoginSuccess={setUser} />} />
          {user && (
            <>
              <Route path="/orders" element={<Orders />} />
              <Route path="/profile" element={<Profile />} />
              {user.role === 'admin' && (
                <Route path="/admin" element={<AdminDashboard />} />
              )}
            </>
          )}
        </Routes>
      </main>

      {/* Footer component */}
      <Footer />

      {/* Cart Sliding Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md glass-panel border-l border-white/10 flex flex-col h-full shadow-2xl">
              {/* Drawer Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-xl font-black text-white">Your Basket</h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white cursor-pointer"
                >
                  <IoClose className="text-xl" />
                </button>
              </div>

              {/* Cart Items list */}
              <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
                {cart.items.length === 0 ? (
                  <div className="text-center py-16 flex flex-col items-center gap-2">
                    <IoCartOutline className="text-5xl text-gray-600 mb-2" />
                    <p className="text-gray-400 text-sm">Your basket is currently empty.</p>
                  </div>
                ) : (
                  cart.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-4 p-3 rounded-2xl bg-white/5 border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-800 border border-white/5">
                          <img
                            src={item.food.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&auto=format&fit=crop'}
                            alt={item.food.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white leading-tight">{item.food.name}</h4>
                          <span className="text-xs text-rose-400 font-extrabold">₹{item.food.price}</span>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 cursor-pointer"
                        >
                          <IoRemove />
                        </button>
                        <span className="text-sm font-bold text-white w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 cursor-pointer"
                        >
                          <IoAdd />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Checkout Form */}
              {cart.items.length > 0 && (
                <div className="p-6 border-t border-white/5 bg-gray-950/40 flex flex-col gap-4">
                  <div className="flex justify-between items-center text-sm font-bold text-gray-300">
                    <span>Total Amount:</span>
                    <span className="text-2xl font-black text-rose-400">₹{cart.total_price}</span>
                  </div>

                  <form onSubmit={handlePlaceOrder} className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Delivery Address</label>
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter full address..."
                        required
                        className="w-full px-4 py-2.5 rounded-xl glass-input text-xs text-white"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isOrdering}
                      className="w-full py-3.5 rounded-xl glow-button text-white font-bold text-sm cursor-pointer disabled:opacity-50 mt-2"
                    >
                      {isOrdering ? 'Placing Order...' : 'Confirm Delivery - Place Order'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* RAG Floating Chatbot */}
      {user && <Chatbot />}
    </div>
  );
}

export default App;
