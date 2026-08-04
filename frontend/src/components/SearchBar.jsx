import React from 'react';
import { IoSearchOutline, IoFilter } from 'react-icons/io5';

const SearchBar = ({ search, setSearch, sortBy, setSortBy, onSearchSubmit }) => {
  return (
    <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4 mb-8">
      {/* Search Form */}
      <form onSubmit={onSearchSubmit} className="w-full md:w-96 flex gap-2">
        <div className="relative flex-1">
          <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search favorite foods..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl glass-input text-sm text-white"
          />
        </div>
        <button
          type="submit"
          className="px-6 py-3 rounded-2xl glow-button text-white text-sm font-semibold cursor-pointer"
        >
          Search
        </button>
      </form>

      {/* Sorting Dropdown */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        <IoFilter className="text-gray-400 text-lg" />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-3 rounded-2xl glass-input text-sm text-white bg-gray-900 border border-white/10 cursor-pointer"
        >
          <option value="">Sort by (Default)</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>
    </div>
  );
};

export default SearchBar;
