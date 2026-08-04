import React from 'react';

const CategoryFilters = ({ categories, selectedCategory, setSelectedCategory }) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-thin">
      <button
        onClick={() => setSelectedCategory(null)}
        className={`px-6 py-2.5 rounded-full text-sm font-bold border transition cursor-pointer whitespace-nowrap ${
          selectedCategory === null
            ? 'bg-rose-600 border-rose-600 text-white'
            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
        }`}
      >
        All Items
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => setSelectedCategory(cat.id)}
          className={`px-6 py-2.5 rounded-full text-sm font-bold border transition cursor-pointer whitespace-nowrap ${
            selectedCategory === cat.id
              ? 'bg-rose-600 border-rose-600 text-white'
              : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilters;
