import React from 'react';
import { Link } from 'react-router-dom';
import { 
  IoFastFoodOutline, 
  IoChatbubbleEllipsesOutline, 
  IoShieldCheckmarkOutline, 
  IoSparklesOutline, 
  IoArrowForward, 
  IoStar,
  IoTimeOutline,
  IoBicycleOutline
} from 'react-icons/io5';

const Landing = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col justify-center px-6 lg:px-16 py-12 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-rose-600/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-rose-500/5 blur-[150px] pointer-events-none" />

      {/* Hero Section Split Layout */}
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
        
        {/* Left Column: Headline and CTAs */}
        <div className="lg:col-span-7 flex flex-col items-start text-left gap-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider animate-pulse">
            <IoSparklesOutline /> Experience AI-Powered Dining
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-[1.1] max-w-2xl">
            Savor the Future. <br />
            <span className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 bg-clip-text text-transparent glow-text">
              Chat with AI Chef.
            </span>
          </h1>
          
          <p className="text-base md:text-lg text-gray-400 max-w-xl leading-relaxed">
            Order premium chef-curated dishes instantly. Get real-time answers about ingredients, customized allergen warnings, and custom combinations from our active RAG AI Support.
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-4 mt-2 w-full sm:w-auto">
            <Link
              to="/menu"
              className="flex-1 sm:flex-initial px-8 py-4 rounded-2xl glow-button text-white font-extrabold text-sm flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform duration-200 cursor-pointer"
            >
              Explore Menu <IoArrowForward className="text-lg" />
            </Link>
            <Link
              to="/login"
              className="flex-1 sm:flex-initial px-8 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-extrabold text-sm flex items-center justify-center hover:scale-[1.02] transition-transform duration-200 cursor-pointer"
            >
              Sign In to Order
            </Link>
          </div>

          {/* Trust Indicators / Stats */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/5 w-full max-w-lg mt-4">
            <div>
              <h4 className="text-2xl md:text-3xl font-black text-white">4.9★</h4>
              <p className="text-xs text-gray-500 font-semibold uppercase mt-0.5">Average Rating</p>
            </div>
            <div>
              <h4 className="text-2xl md:text-3xl font-black text-white">20 Mins</h4>
              <p className="text-xs text-gray-500 font-semibold uppercase mt-0.5">Fast Delivery</p>
            </div>
            <div>
              <h4 className="text-2xl md:text-3xl font-black text-white">RAG AI</h4>
              <p className="text-xs text-gray-500 font-semibold uppercase mt-0.5">Chef Assistant</p>
            </div>
          </div>
        </div>

        {/* Right Column: Premium Food Showcase Visual Card */}
        <div className="lg:col-span-5 flex justify-center items-center relative">
          {/* Main Visual Card */}
          <div className="w-full max-w-sm rounded-[32px] glass-panel border border-white/10 overflow-hidden shadow-2xl relative group transform hover:rotate-1 transition-all duration-300">
            {/* Special Tag */}
            <div className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center gap-1.5 text-rose-400 text-xs font-bold uppercase tracking-wider">
              <IoSparklesOutline className="text-xs text-yellow-400" /> Chef's Special
            </div>
            
            {/* Image Container */}
            <div className="h-64 overflow-hidden relative">
              <img
                src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop"
                alt="Margherita Pizza"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />
            </div>

            {/* Food Info */}
            <div className="p-6 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">Italian Specialty</span>
                  <h3 className="text-xl font-bold text-white mt-0.5">Margherita Pizza</h3>
                </div>
                <span className="text-xl font-black text-rose-400">₹249</span>
              </div>

              <p className="text-xs text-gray-400 leading-relaxed">
                Crispy hand-stretched sourdough crust topped with rich vine-ripened tomato sauce, fresh buffalo mozzarella, and aromatic basil leaves.
              </p>

              {/* Extra badges */}
              <div className="flex gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] text-gray-400 font-semibold flex items-center gap-1">
                  <IoTimeOutline /> 15 Mins
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] text-gray-400 font-semibold flex items-center gap-1">
                  <IoBicycleOutline /> Free Delivery
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-[10px] text-gray-400 font-semibold flex items-center gap-1">
                  <IoStar className="text-yellow-400" /> 4.9
                </span>
              </div>

              <Link
                to="/menu"
                className="w-full py-3 rounded-xl bg-white/5 hover:bg-rose-600 border border-white/10 hover:border-rose-600 text-white font-bold text-xs text-center transition-all duration-300 mt-2"
              >
                Add to Basket - Explore Menu
              </Link>
            </div>
          </div>
        </div>

      </div>

      {/* Features Showcase Section */}
      <div className="container mx-auto mt-24 z-10">
        <h2 className="text-2xl font-black text-white text-center mb-12 uppercase tracking-wider">
          Why Order With <span className="text-rose-500">FoodieAI</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto w-full">
          
          {/* Card 1 */}
          <div className="p-6 rounded-2xl glass-card border border-white/5 flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-600/25 text-rose-400 flex items-center justify-center text-2xl border border-rose-500/20">
              <IoFastFoodOutline />
            </div>
            <h3 className="text-lg font-bold text-white">Gourmet Taste</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Every dish is crafted using premium, fresh, locally sourced ingredients prepared by culinary specialists.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl glass-card border border-white/5 flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-600/25 text-rose-400 flex items-center justify-center text-2xl border border-rose-500/20">
              <IoChatbubbleEllipsesOutline />
            </div>
            <h3 className="text-lg font-bold text-white">AI RAG Chef Assistant</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Curious about dairy, sugar levels, or recipe pairings? Ask our AI Chef directly inside the support widget anytime.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl glass-card border border-white/5 flex flex-col gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-600/25 text-rose-400 flex items-center justify-center text-2xl border border-rose-500/20">
              <IoShieldCheckmarkOutline />
            </div>
            <h3 className="text-lg font-bold text-white">Instant Fulfillment</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Log in to save multiple items, place your orders, and track your kitchen fulfillment and delivery status live.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Landing;
