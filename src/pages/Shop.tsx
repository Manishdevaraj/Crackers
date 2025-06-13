//@ts-nocheck

import React,{ useEffect, useState, useMemo } from "react";
import { CiHeart } from "react-icons/ci";
import { FaHeart, FaYoutube, FaTable, FaThLarge, FaFilter } from "react-icons/fa";
import { useFirebase } from "@/Services/context";
import { Button } from "@/components/ui/button";

import { Drawer, DrawerTrigger, DrawerContent } from '@/components/ui/drawer';
import { Slider } from '@/components/ui/slider';

const TAGS = ['Best Selling', 'New Arrival', 'Recommended', 'Childrens Items', 'Popular Items'];


// ✅ Memoized Components
export const ProductCard = React.memo(({ product }) => {
  const { toggleWishList, wishlistIds, toggleCart, cartItems, updateCartQty } = useFirebase();
  const isInWishlist = wishlistIds.includes(product.id);
  const currentProduct = cartItems?.[product.productId];
  const qty = currentProduct?.qty || 0;

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-md transition p-4 flex flex-col">
      <img src={product?.productImageURL} alt={product.productName} className="rounded-md h-[250px] w-full object-cover mb-3" />
      <div className="text-center mb-2">
        <p className="text-sm text-gray-500">{product.productName}</p>
      </div>
      <div className="text-center mb-2">
        <span className="text-emerald-600 font-bold mr-2">₹{product.salesPrice}</span>
        <span className="text-red-500 line-through">₹{product.beforeDiscPrice}</span>
      </div>
      <div className="mt-auto flex justify-between items-center">
        <button><FaYoutube className="text-red-500 text-3xl cursor-pointer" /></button>
        {qty > 0 ? (
          <div className="flex items-center gap-3 border border-gray-300 rounded-full px-3 py-1 bg-gray-50 shadow-sm w-[120px] mx-auto">
            <button onClick={() => updateCartQty(product.productId, "dec")} className="w-8 h-8 bg-red-500 text-white rounded-full">−</button>
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => updateCartQty(product.productId, parseInt(e.target.value))}
              className="w-16 text-center border rounded px-2 py-1"
            />
            <button onClick={() => updateCartQty(product.productId, "inc")} className="w-8 h-8 bg-green-500 text-white rounded-full">+</button>
          </div>
        ) : (
          <Button className="bg-green-500 text-white px-6 py-2 rounded-full mx-auto" onClick={() => toggleCart(product)}>
            Add To Cart
          </Button>
        )}
        <button onClick={() => toggleWishList(product.id)}>
          {isInWishlist ? <FaHeart className="text-2xl text-red-500" /> : <CiHeart className="text-3xl" />}
        </button>
      </div>
    </div>
  );
});

export const ProductTableRow = React.memo(({ product }) => {
  const { toggleWishList, wishlistIds, toggleCart, cartItems, updateCartQty } = useFirebase();
  const isInWishlist = wishlistIds.includes(product.id);
  const currentProduct = cartItems?.[product.productId];
  const qty = currentProduct?.qty || 0;

  return (
    <tr className="border-b">
      <td className="p-2"><img src={product.productImageURL} alt="" className="w-20 h-20 object-cover rounded-md" /></td>
      <td className="p-2">{product.productName}</td>
      <td className="p-2">₹{product.salesPrice}</td>
      <td className="p-2">
        {qty > 0 ? (
          <div className="flex items-center gap-2">
            <button onClick={() => updateCartQty(product.productId, "dec")} className="px-2 py-1 bg-red-500 text-white rounded">−</button>
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => updateCartQty(product.productId, parseInt(e.target.value))}
              className="w-16 text-center border rounded px-2 py-1"
            />
            <button onClick={() => updateCartQty(product.productId, "inc")} className="px-2 py-1 bg-green-500 text-white rounded">+</button>
          </div>
        ) : (
          <Button className="bg-green-500 text-white text-sm" onClick={() => toggleCart(product)}>Add</Button>
        )}
      </td>
      <td className="p-2 text-center">
        <button onClick={() => toggleWishList(product.id)}>
          {isInWishlist ? <FaHeart className="text-xl text-red-500" /> : <CiHeart className="text-2xl" />}
        </button>
      </td>
    </tr>
  );
});



const Shop = () => {
  const { searchTerm, products } = useFirebase();
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filteredproducts, setFilteredproducts] = useState([]);
  const [viewMode, setViewMode] = useState('grid');

  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [drawerOpen, setDrawerOpen] = useState(false);

  // Pagination
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedSearch(searchTerm.toLowerCase());
    }, 300);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  useEffect(() => {
    let filtered = products.filter(p =>
      p?.productName?.toLowerCase().includes(debouncedSearch)
    );

    // Apply price filter
    filtered = filtered.filter(
      p => p.salesPrice >= priceRange[0] && p.salesPrice <= priceRange[1]
    );

    // Apply tag filters if any
    if (selectedTags.length > 0) {
      filtered = filtered.filter(p =>
        selectedTags.some(tag => p.tags?.toLowerCase().includes(tag.toLowerCase()))
      );
    }

    setFilteredproducts(filtered);
    setCurrentPage(1);
  }, [debouncedSearch, products, priceRange, selectedTags]);

  const totalPages = Math.ceil(filteredproducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredproducts.slice(start, start + itemsPerPage);
  }, [filteredproducts, currentPage]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen px-4 md:px-10 py-10 bg-gray-50">
      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3 flex-wrap">
          <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
            <DrawerTrigger asChild>
              <Button className="flex gap-2 items-center bg-emerald-500 text-white">
                <FaFilter /> Filter
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="p-4 space-y-6">
                <div>
                  <h2 className="font-semibold text-lg">Price</h2>
                  <Slider
                    defaultValue={priceRange}
                    min={0}
                    max={1000}
                    step={10}
                    onValueChange={val => setPriceRange(val)}
                  />
                  <div className="text-sm text-muted-foreground mt-1">
                    ₹{priceRange[0]} - ₹{priceRange[1]}
                  </div>
                </div>

                <div>
                  <h2 className="font-semibold text-lg">Tags</h2>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {TAGS.map(tag => (
                      <Button
                        key={tag}
                        variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                        onClick={() => toggleTag(tag)}
                      >
                        {tag}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </DrawerContent>
          </Drawer>

          <p className="text-gray-600 font-medium">
            We found {filteredproducts.length} items!
          </p>
        </div>

        {/* View Mode Switch */}
        <div className="flex gap-2">
          <button onClick={() => setViewMode('grid')} className={`border p-2 rounded ${viewMode === 'grid' ? 'bg-emerald-200' : 'bg-white'}`}>
            <FaThLarge />
          </button>
          <button onClick={() => setViewMode('table')} className={`border p-2 rounded ${viewMode === 'table' ? 'bg-emerald-200' : 'bg-white'}`}>
            <FaTable />
          </button>
        </div>
      </div>

      {/* Grid or Table View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="overflow-auto bg-white rounded shadow">
          <table className="w-full text-left min-w-[600px]">
            <thead className="bg-gray-100 text-sm uppercase">
              <tr>
                <th className="p-2">Image</th>
                <th className="p-2">Name</th>
                <th className="p-2">Price</th>
                <th className="p-2">Cart</th>
                <th className="p-2 text-center">Wishlist</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((product, i) => (
                <ProductTableRow key={i} product={product} />
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="mt-6 flex justify-center gap-2 flex-wrap">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-emerald-400 text-white' : 'bg-white'}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Shop;

