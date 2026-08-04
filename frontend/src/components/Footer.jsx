import React from 'react';
import { Link } from 'react-router-dom';
import { IoMailOutline, IoCallOutline, IoLocationOutline, IoLogoInstagram, IoLogoFacebook, IoLogoTwitter } from 'react-icons/io5';

const Footer = () => {
  return (
    <footer className="glass-panel border-t border-white/5 mt-auto pt-12 pb-8 px-6 text-gray-400">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        
        {/* Left Column: Brand and Info */}
        <div className="flex flex-col gap-4">
          <Link to="/" className="text-xl font-black tracking-tighter flex items-center gap-2 text-white">
            <span className="w-8 h-8 rounded-lg glow-button flex items-center justify-center text-white text-sm">F</span>
            <span>Foodie<span className="text-rose-500 glow-text">AI</span></span>
          </Link>
          <p className="text-sm leading-relaxed max-w-xs">
            Experience gourmet food ordered instantly, backed by our semantic AI Chef to answer all your menu queries, ingredients, and allergen checks.
          </p>
          <div className="flex gap-3 mt-2">
            <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-rose-600 hover:text-white transition text-lg border border-white/5">
              <IoLogoInstagram />
            </a>
            <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-rose-600 hover:text-white transition text-lg border border-white/5">
              <IoLogoFacebook />
            </a>
            <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-rose-600 hover:text-white transition text-lg border border-white/5">
              <IoLogoTwitter />
            </a>
          </div>
        </div>

        {/* Center Column: Quick Navigation */}
        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Quick Links</h4>
          <div className="grid grid-cols-2 gap-2 text-sm font-medium">
            <Link to="/" className="hover:text-rose-400 transition">Home</Link>
            <Link to="/menu" className="hover:text-rose-400 transition">Menu</Link>
            <Link to="/orders" className="hover:text-rose-400 transition">My Orders</Link>
            <Link to="/profile" className="hover:text-rose-400 transition">Profile</Link>
          </div>
        </div>

        {/* Right Column: Contact Details */}
        <div className="flex flex-col gap-3">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-1">Contact Support</h4>
          <div className="flex flex-col gap-2.5 text-sm">
            <a href="mailto:support@foodieai.com" className="flex items-center gap-2.5 hover:text-rose-400 transition">
              <IoMailOutline className="text-rose-500 text-lg" /> support@foodieai.com
            </a>
            <a href="tel:+1800FOODIE" className="flex items-center gap-2.5 hover:text-rose-400 transition">
              <IoCallOutline className="text-rose-500 text-lg" /> +1-800-FOODIE
            </a>
            <div className="flex items-start gap-2.5">
              <IoLocationOutline className="text-rose-500 text-lg mt-0.5 shrink-0" />
              <span>123 AI Boulevard, central kitchen, Bangalore, India</span>
            </div>
          </div>
        </div>

      </div>

      {/* Copyright Footer Bottom */}
      <div className="container mx-auto pt-6 border-t border-white/5 flex flex-wrap justify-between items-center gap-4 text-xs font-semibold text-gray-500">
        <p>© {new Date().getFullYear()} FoodieAI Inc. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-gray-400 transition">Privacy Policy</a>
          <a href="#" className="hover:text-gray-400 transition">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
