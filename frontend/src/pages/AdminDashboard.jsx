import React, { useState, useEffect } from 'react';
import { IoFastFoodOutline, IoListOutline, IoBagHandleOutline, IoCloudUploadOutline, IoTrashOutline, IoPencilOutline, IoAddCircleOutline } from 'react-icons/io5';
import api from '../api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('foods');
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [kbDocs, setKbDocs] = useState([]);
  
  // Create / Edit Food state
  const [showFoodModal, setShowFoodModal] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [foodForm, setFoodForm] = useState({
    name: '', description: '', price: '', category_id: '',
    image_url: '', ingredients: '', nutrition: '', allergens: ''
  });
  
  // Category Form
  const [newCatName, setNewCatName] = useState('');
  
  // KB Upload State
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState('');
  
  useEffect(() => {
    fetchFoods();
    fetchCategories();
    fetchOrders();
    fetchKbDocs();
  }, []);

  const fetchFoods = async () => {
    try {
      const res = await api.get('/foods');
      setFoods(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
      if (res.data.length > 0 && !foodForm.category_id) {
        setFoodForm(prev => ({ ...prev, category_id: res.data[0].id }));
      }
    } catch (err) { console.error(err); }
  };

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      setOrders(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchKbDocs = async () => {
    try {
      const res = await api.get('/knowledge-base');
      setKbDocs(res.data);
    } catch (err) { console.error(err); }
  };

  // --- Food Operations ---
  const handleSaveFood = async (e) => {
    e.preventDefault();
    try {
      if (editingFood) {
        await api.put(`/foods/${editingFood.id}`, foodForm);
      } else {
        await api.post('/foods', foodForm);
      }
      fetchFoods();
      setShowFoodModal(false);
      setEditingFood(null);
      setFoodForm({
        name: '', description: '', price: '', category_id: categories[0]?.id || '',
        image_url: '', ingredients: '', nutrition: '', allergens: ''
      });
    } catch (err) {
      console.error(err);
      alert('Error saving food item');
    }
  };

  const handleEditFood = (food) => {
    setEditingFood(food);
    setFoodForm({
      name: food.name,
      description: food.description || '',
      price: food.price,
      category_id: food.category_id,
      image_url: food.image_url || '',
      ingredients: food.ingredients || '',
      nutrition: food.nutrition || '',
      allergens: food.allergens || ''
    });
    setShowFoodModal(true);
  };

  const handleDeleteFood = async (id) => {
    if (!window.confirm('Delete this food item?')) return;
    try {
      await api.delete(`/foods/${id}`);
      fetchFoods();
    } catch (err) { console.error(err); }
  };

  // --- Category Operations ---
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      await api.post('/categories', { name: newCatName });
      setNewCatName('');
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Error adding category');
    }
  };

  // --- Order Status ---
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}`, { status: newStatus });
      fetchOrders();
    } catch (err) { console.error(err); }
  };

  // --- KB Upload ---
  const handleUploadKb = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    
    const formData = new FormData();
    formData.append('file', selectedFile);
    
    setUploadProgress('Uploading and indexing...');
    try {
      await api.post('/knowledge-base', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadProgress('Successfully uploaded and chunk-indexed!');
      setSelectedFile(null);
      fetchKbDocs();
    } catch (err) {
      console.error(err);
      setUploadProgress('Error uploading document.');
    }
  };

  const handleDeleteKbDoc = async (filename) => {
    if (!window.confirm(`Delete document "${filename}" from vector index?`)) return;
    try {
      await api.delete(`/knowledge-base/${filename}`);
      fetchKbDocs();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-black text-white mb-8">Admin Operations</h2>
      
      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-8 border-b border-white/10">
        <button
          onClick={() => setActiveTab('foods')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'foods' ? 'bg-rose-600 text-white' : 'hover:bg-white/5 text-gray-400'
          }`}
        >
          <IoFastFoodOutline className="text-lg" /> Manage Foods
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'categories' ? 'bg-rose-600 text-white' : 'hover:bg-white/5 text-gray-400'
          }`}
        >
          <IoListOutline className="text-lg" /> Categories
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'orders' ? 'bg-rose-600 text-white' : 'hover:bg-white/5 text-gray-400'
          }`}
        >
          <IoBagHandleOutline className="text-lg" /> Customer Orders
        </button>
        <button
          onClick={() => setActiveTab('kb')}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold transition whitespace-nowrap cursor-pointer ${
            activeTab === 'kb' ? 'bg-rose-600 text-white' : 'hover:bg-white/5 text-gray-400'
          }`}
        >
          <IoCloudUploadOutline className="text-lg" /> RAG Knowledge Base
        </button>
      </div>

      {/* TABS CONTAINER */}
      <div>
        {/* Tab 1: Foods */}
        {activeTab === 'foods' && (
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">Food Menu Registry</h3>
              <button
                onClick={() => {
                  setEditingFood(null);
                  setFoodForm({
                    name: '', description: '', price: '', category_id: categories[0]?.id || '',
                    image_url: '', ingredients: '', nutrition: '', allergens: ''
                  });
                  setShowFoodModal(true);
                }}
                className="px-5 py-2.5 rounded-xl glow-button text-white text-sm font-bold flex items-center gap-2 cursor-pointer"
              >
                <IoAddCircleOutline className="text-lg" /> Add New Food
              </button>
            </div>

            {/* Foods Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {foods.map(food => (
                <div key={food.id} className="rounded-2xl glass-panel border border-white/5 overflow-hidden flex gap-4 p-4 items-center">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-800 shrink-0">
                    <img src={food.image_url} alt={food.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white truncate">{food.name}</h4>
                    <span className="text-xs text-rose-400 font-semibold">{food.category_name}</span>
                    <p className="text-sm font-extrabold text-white mt-1">₹{food.price}</p>
                  </div>
                  <div className="flex flex-col gap-2 shrink-0">
                    <button
                      onClick={() => handleEditFood(food)}
                      className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-rose-400 border border-white/10 cursor-pointer"
                    >
                      <IoPencilOutline />
                    </button>
                    <button
                      onClick={() => handleDeleteFood(food.id)}
                      className="p-2 rounded-lg bg-rose-950/20 hover:bg-rose-900/40 text-rose-400 border border-rose-900/30 cursor-pointer"
                    >
                      <IoTrashOutline />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Categories */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Create Category */}
            <div className="rounded-3xl glass-panel border border-white/10 p-6">
              <h3 className="text-lg font-bold text-white mb-4">Add Category</h3>
              <form onSubmit={handleAddCategory} className="flex gap-2">
                <input
                  type="text"
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="e.g. Pasta, Soups"
                  required
                  className="flex-1 px-4 py-2.5 rounded-xl glass-input text-sm text-white"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl glow-button text-white font-bold text-sm cursor-pointer"
                >
                  Create
                </button>
              </form>
            </div>

            {/* List Categories */}
            <div className="rounded-3xl glass-panel border border-white/10 p-6 flex flex-col gap-3">
              <h3 className="text-lg font-bold text-white mb-2">Existing Categories</h3>
              {categories.map(cat => (
                <div key={cat.id} className="px-4 py-3 rounded-xl bg-white/5 border border-white/5 text-gray-300 text-sm font-semibold">
                  {cat.name}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Customer Orders */}
        {activeTab === 'orders' && (
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-bold text-white mb-2">Live Customer Orders</h3>
            <div className="flex flex-col gap-4">
              {orders.map(order => (
                <div key={order.id} className="rounded-2xl glass-panel border border-white/5 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-rose-400 font-bold uppercase">Order #FDAI-{order.id}</span>
                    <h4 className="font-bold text-white text-base">User: {order.username}</h4>
                    <p className="text-xs text-gray-400 mt-0.5">Address: {order.address}</p>
                    <p className="text-xs text-gray-400">Total Price: <span className="font-bold text-rose-300">₹{order.total_price}</span></p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {order.items.map(item => (
                        <span key={item.id} className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-gray-300 border border-white/5">
                          {item.food_name} x{item.quantity}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400">Status</span>
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                      className="px-3 py-1.5 rounded-lg bg-gray-900 border border-white/10 text-xs text-white cursor-pointer"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Preparing">Preparing</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: RAG Knowledge Base */}
        {activeTab === 'kb' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Upload form */}
            <div className="rounded-3xl glass-panel border border-white/10 p-6 flex flex-col gap-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <IoCloudUploadOutline className="text-rose-500" /> Upload Knowledge Document
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Upload custom guidelines, policies, or menu descriptions in text format (`.txt`). 
                The system will automatically parse and convert them to chunk embeddings.
              </p>

              <form onSubmit={handleUploadKb} className="flex flex-col gap-3">
                <input
                  type="file"
                  accept=".txt"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  required
                  className="block w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-rose-950/40 file:text-rose-400 hover:file:bg-rose-900/60 file:cursor-pointer"
                />
                <button
                  type="submit"
                  className="py-2.5 rounded-xl glow-button text-white font-bold text-sm cursor-pointer mt-2"
                >
                  Upload & Index
                </button>
              </form>
              
              {uploadProgress && (
                <div className="p-3 bg-white/5 rounded-xl text-xs font-semibold text-rose-300 border border-white/5 mt-2">
                  ℹ️ {uploadProgress}
                </div>
              )}
            </div>

            {/* List Active Documents */}
            <div className="rounded-3xl glass-panel border border-white/10 p-6 flex flex-col gap-3">
              <h3 className="text-lg font-bold text-white mb-2">Active KB Documents</h3>
              {kbDocs.length === 0 ? (
                <p className="text-xs text-gray-400">No custom documents indexed yet.</p>
              ) : (
                kbDocs.map(filename => (
                  <div key={filename} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 gap-2">
                    <span className="text-xs text-gray-300 font-semibold truncate">{filename}</span>
                    <button
                      onClick={() => handleDeleteKbDoc(filename)}
                      className="p-1.5 rounded-lg bg-rose-950/20 hover:bg-rose-900/40 border border-rose-900/30 text-rose-400 cursor-pointer text-xs"
                    >
                      <IoTrashOutline />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* FOOD MODAL (NEW/EDIT) */}
      {showFoodModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-xl rounded-3xl glass-panel border border-white/10 p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-white mb-6">
              {editingFood ? `Edit Food: ${editingFood.name}` : 'Add New Food Item'}
            </h3>
            
            <form onSubmit={handleSaveFood} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-gray-400 font-bold uppercase">Name</label>
                  <input
                    type="text"
                    value={foodForm.name}
                    onChange={(e) => setFoodForm({ ...foodForm, name: e.target.value })}
                    required
                    className="px-3 py-2 rounded-xl glass-input text-xs text-white"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-gray-400 font-bold uppercase">Price (INR)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={foodForm.price}
                    onChange={(e) => setFoodForm({ ...foodForm, price: e.target.value })}
                    required
                    className="px-3 py-2 rounded-xl glass-input text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-gray-400 font-bold uppercase">Category</label>
                  <select
                    value={foodForm.category_id}
                    onChange={(e) => setFoodForm({ ...foodForm, category_id: e.target.value })}
                    required
                    className="px-3 py-2 rounded-xl glass-input text-xs text-white bg-gray-900 border border-white/10"
                  >
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-gray-400 font-bold uppercase">Image URL</label>
                  <input
                    type="text"
                    value={foodForm.image_url}
                    onChange={(e) => setFoodForm({ ...foodForm, image_url: e.target.value })}
                    placeholder="https://example.com/food.jpg"
                    className="px-3 py-2 rounded-xl glass-input text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-400 font-bold uppercase">Description</label>
                <textarea
                  value={foodForm.description}
                  onChange={(e) => setFoodForm({ ...foodForm, description: e.target.value })}
                  rows="2"
                  className="px-3 py-2 rounded-xl glass-input text-xs text-white resize-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-gray-400 font-bold uppercase">Ingredients (comma separated)</label>
                <input
                  type="text"
                  value={foodForm.ingredients}
                  onChange={(e) => setFoodForm({ ...foodForm, ingredients: e.target.value })}
                  placeholder="Wheat, Cheese, Tomatoes"
                  className="px-3 py-2 rounded-xl glass-input text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-gray-400 font-bold uppercase">Nutrition Facts</label>
                  <input
                    type="text"
                    value={foodForm.nutrition}
                    onChange={(e) => setFoodForm({ ...foodForm, nutrition: e.target.value })}
                    placeholder="Calories: 250 kcal, Protein: 10g"
                    className="px-3 py-2 rounded-xl glass-input text-xs text-white"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-gray-400 font-bold uppercase">Allergen Information</label>
                  <input
                    type="text"
                    value={foodForm.allergens}
                    onChange={(e) => setFoodForm({ ...foodForm, allergens: e.target.value })}
                    placeholder="Gluten, Dairy"
                    className="px-3 py-2 rounded-xl glass-input text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setShowFoodModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-white/10 text-xs text-white hover:bg-white/5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl glow-button text-white text-xs font-bold cursor-pointer"
                >
                  Save Food
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
