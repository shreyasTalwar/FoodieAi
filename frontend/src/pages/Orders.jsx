import React, { useState, useEffect } from 'react';
import { IoBagHandleOutline, IoTimeOutline, IoLocationOutline } from 'react-icons/io5';
import api from '../api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
      case 'Confirmed': return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
      case 'Preparing': return 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20';
      case 'Out for Delivery': return 'bg-purple-500/10 text-purple-400 border border-purple-500/20';
      case 'Delivered': return 'bg-green-500/10 text-green-400 border border-green-500/20';
      case 'Cancelled': return 'bg-rose-500/10 text-rose-400 border border-rose-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border border-gray-500/20';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h2 className="text-3xl font-black text-white mb-8 flex items-center gap-3">
        <IoBagHandleOutline className="text-rose-500" /> Order History
      </h2>

      {isLoading ? (
        <div className="flex flex-col gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 rounded-2xl glass-card animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 rounded-3xl glass-panel border border-white/5 p-8">
          <p className="text-gray-400 text-lg mb-4">You have not placed any orders yet.</p>
          <a
            href="/menu"
            className="inline-block px-6 py-3 rounded-2xl glow-button text-white font-semibold text-sm transition"
          >
            Browse Menu
          </a>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order) => (
            <div key={order.id} className="rounded-3xl glass-panel border border-white/10 p-6 flex flex-col gap-4">
              {/* Order Info Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/5">
                <div>
                  <span className="text-xs text-gray-400">Order ID</span>
                  <h3 className="text-lg font-bold text-white">#FDAI-{order.id}</h3>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-xs text-gray-400">Placed On</span>
                    <p className="text-sm text-gray-300 font-medium flex items-center gap-1.5 justify-end">
                      <IoTimeOutline className="text-gray-400" /> {order.created_at}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="flex flex-col gap-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-4 py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-800 border border-white/5">
                        <img
                          src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&auto=format&fit=crop'}
                          alt={item.food_name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">{item.food_name}</h4>
                        <span className="text-xs text-gray-400">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-gray-300">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Order Footer summary */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/5 mt-2">
                <div className="flex items-start gap-2 max-w-md">
                  <IoLocationOutline className="text-rose-500 text-lg mt-0.5 shrink-0" />
                  <div>
                    <span className="text-xs text-gray-400">Delivery Address</span>
                    <p className="text-xs text-gray-300 line-clamp-1">{order.address}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-400">Total Price</span>
                  <p className="text-xl font-black text-rose-400">₹{order.total_price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
