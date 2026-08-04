import React from 'react';
import { IoStar, IoCartOutline } from 'react-icons/io5';

const FoodCard = ({ food, onViewDetails, onAddToCart }) => {
  return (
    <div className="rounded-2xl glass-card border border-white/5 overflow-hidden flex flex-col h-full">
      {/* Food Image */}
      <div 
        className="h-48 overflow-hidden relative cursor-pointer"
        onClick={onViewDetails}
      >
        <img
          src={food.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop'}
          alt={food.name}
          className="w-full h-full object-cover hover:scale-105 transition duration-500"
        />
        <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1 text-rose-400 text-xs font-semibold">
          <IoStar className="text-yellow-400" /> {food.rating.toFixed(1)}
        </div>
      </div>

      {/* Info Body */}
      <div className="p-5 flex flex-col flex-grow gap-3">
        <div className="flex justify-between items-start">
          <h3 
            className="text-lg font-bold text-white hover:text-rose-400 transition cursor-pointer"
            onClick={onViewDetails}
          >
            {food.name}
          </h3>
          <span className="text-lg font-extrabold text-rose-400">₹{food.price}</span>
        </div>
        
        <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed flex-grow">
          {food.description || 'No description available for this delicious menu item.'}
        </p>

        {/* Footer Buttons */}
        <div className="flex gap-2 mt-2">
          <button
            onClick={onViewDetails}
            className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-white text-xs font-bold transition cursor-pointer text-center"
          >
            View details
          </button>
          <button
            onClick={() => onAddToCart(food.id)}
            className="px-4 py-2.5 rounded-xl glow-button text-white text-xs font-bold flex items-center gap-2 cursor-pointer"
          >
            <IoCartOutline className="text-base" /> Add to cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
