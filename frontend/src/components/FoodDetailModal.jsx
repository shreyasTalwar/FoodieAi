import React from 'react';
import { IoStar, IoCartOutline, IoClose } from 'react-icons/io5';

const FoodDetailModal = ({ food, onClose, onAddToCart }) => {
  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-2xl rounded-3xl glass-panel border border-white/10 overflow-hidden flex flex-col md:flex-row relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 transition cursor-pointer z-10"
        >
          <IoClose className="text-xl" />
        </button>

        {/* Modal Left - Image */}
        <div className="w-full md:w-1/2 h-64 md:h-auto relative">
          <img
            src={food.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop'}
            alt={food.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Modal Right - Info */}
        <div className="w-full md:w-1/2 p-6 flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
              {food.category_name}
            </span>
            <h2 className="text-2xl font-black text-white mt-1 leading-tight">{food.name}</h2>
            <div className="flex items-center gap-3 mt-2">
              <span className="text-xl font-black text-rose-400">₹{food.price}</span>
              <div className="flex items-center gap-1 text-yellow-400 text-sm font-semibold">
                <IoStar /> {food.rating.toFixed(1)}
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4 flex flex-col gap-3">
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Description</h4>
              <p className="text-sm text-gray-400 leading-relaxed">{food.description}</p>
            </div>
            
            {food.ingredients && (
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Ingredients</h4>
                <p className="text-sm text-gray-400 leading-relaxed">{food.ingredients}</p>
              </div>
            )}

            {food.nutrition && (
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Nutrition Information</h4>
                <p className="text-sm text-gray-400 leading-relaxed">{food.nutrition}</p>
              </div>
            )}

            {food.allergens && (
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Allergen Warnings</h4>
                <p className="text-sm text-rose-300 bg-rose-950/20 border border-rose-900/30 px-3 py-1.5 rounded-lg text-xs font-medium">
                  ⚠️ Contains: {food.allergens}
                </p>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              onAddToCart(food.id);
              onClose();
            }}
            className="w-full py-3.5 rounded-2xl glow-button text-white font-bold flex items-center justify-center gap-2 mt-2 cursor-pointer"
          >
            <IoCartOutline className="text-lg" /> Add to Cart - ₹{food.price}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodDetailModal;
