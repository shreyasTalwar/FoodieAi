import React, { useState, useEffect } from 'react';
import api from '../api';

// Subcomponents
import SearchBar from '../components/SearchBar';
import CategoryFilters from '../components/CategoryFilters';
import FoodCard from '../components/FoodCard';
import FoodDetailModal from '../components/FoodDetailModal';

const Menu = ({ onAddToCart }) => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [selectedFood, setSelectedFood] = useState(null); // Detail modal
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchFoods();
  }, [selectedCategory, sortBy, search]);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFoods = async () => {
    setIsLoading(true);
    try {
      const params = {};
      if (selectedCategory) params.category_id = selectedCategory;
      if (sortBy) params.sort_by = sortBy;
      if (search) params.search = search;
      
      const res = await api.get('/foods', { params });
      setFoods(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchFoods();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Component 1: Search & Filters Bar */}
      <SearchBar
        search={search}
        setSearch={setSearch}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* Component 2: Category Filters Pills */}
      <CategoryFilters
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Foods Grid Display */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-96 rounded-2xl glass-card animate-pulse bg-white/5" />
          ))}
        </div>
      ) : foods.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg">No food items found matching your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {foods.map((food) => (
            /* Component 3: Individual Food Card */
            <FoodCard
              key={food.id}
              food={food}
              onViewDetails={() => setSelectedFood(food)}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}

      {/* Component 4: Food Details Modal sheet */}
      {selectedFood && (
        <FoodDetailModal
          food={selectedFood}
          onClose={() => setSelectedFood(null)}
          onAddToCart={onAddToCart}
        />
      )}
    </div>
  );
};

export default Menu;
