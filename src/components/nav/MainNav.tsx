//@ts-nocheck


import { FaUser, FaHeart, FaShoppingCart, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useFirebase } from '@/Services/context';

const MainNav = () => {
  const { searchTerm, setSearchTerm, cartItems } = useFirebase();
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate('/shop');
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-4 bg-white shadow-md">
      
      {/* Logo */}
      <div className="flex items-center justify-center md:justify-start w-full md:w-auto">
        <img src="/logo.png" alt="Logo" className="h-12 object-contain" />
      </div>

      {/* Search Input */}
      <div className="flex w-full md:w-1/2 border border-green-500 rounded overflow-hidden">
        <input
          type="text"
          placeholder="Search for items..."
          className="flex-1 px-4 py-2 focus:outline-none"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch} className="px-4 py-2 bg-green-500 text-white">
          <FaSearch />
        </button>
      </div>

      {/* Icons Section */}
      <div className="flex items-center gap-6">
        
        {/* Account */}
        <div className="relative group cursor-pointer">
          <div className="flex items-center gap-2">
            <FaUser />
            <span>Account</span>
          </div>
          <div className="absolute top-full right-0 mt-2 bg-white border rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 w-40">
            <div
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => navigate('/register')}
            >
              Register
            </div>
            <div
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => navigate('/login')}
            >
              Login
            </div>
          </div>
        </div>

        {/* Wishlist */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate('/wishlist')}
        >
          <FaHeart />
          <span>Wishlist</span>
        </div>

        {/* Cart */}
        <div
          className="relative flex items-center gap-2 cursor-pointer"
          onClick={() => navigate('/cart')}
        >
          <FaShoppingCart />
          <span>Cart</span>
          <span className="absolute -top-2 -right-3 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
            {Object.keys(cartItems).length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MainNav;
