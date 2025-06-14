//@ts-nocheck

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input"; // Assuming you have this component
import { useFirebase } from "@/Services/context";

import React,{ useState } from "react";
const ProductCard = React.memo(({ product,handleAddProduct }) => {
 
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-md transition p-4 flex flex-col" onClick={()=>{handleAddProduct(product)}}>
      <img src={product?.productImageURL} alt={product.productName} className="rounded-md h-[250px] w-full object-cover mb-3" />
      <div className="text-center mb-2">
        <p className="text-sm text-gray-500">{product.productName}</p>
      </div>
      <div className="text-center mb-2">
        <span className="text-emerald-600 font-bold mr-2">₹{product.salesPrice?.toFixed(2)}</span>
        <span className="text-red-500 line-through">₹{product.beforeDiscPrice?.toFixed(2)}</span>
      </div>
      {/* <div className="mt-auto flex justify-between items-center">
        {product.youtubeURL && <button><FaYoutube className="text-red-500 text-3xl cursor-pointer" /></button>}
        {qty > 0 ? (
          <div className="flex items-center mx-auto gap-2">
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
          <Button className="bg-green-500 text-white px-6 py-2 rounded-full mx-auto" onClick={() => toggleCart(product)}>
            Add To Cart
          </Button>
        )}
        <button onClick={() => {
          toggleWishList(product.id);
          toast.success(isInWishlist ? 'Product is removed from wishlist' : 'Product is added to wishlist')
        }}>
          {isInWishlist ? <FaHeart className="text-2xl text-red-500" /> : <CiHeart className="text-3xl" />}
        </button>
      </div> */}
    </div>
  );
});

const AdminProduct = ({ handleAddProduct }) => {
  const { products } = useFirebase();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter((item) =>
    item.productName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="text-sm">+ Add Product</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto p-4">
        <DialogHeader>
          <DialogTitle className="text-xl mb-4">Choose Product</DialogTitle>

          {/* Search Bar */}
          <Input
            placeholder="Search by product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />
        </DialogHeader>

        {/* Scrollable filtered product list */}
        <div className="space-y-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((item, index) => (
              <div key={index} className="shadow-md rounded-md overflow-hidden">
                <ProductCard product={item} handleAddProduct={handleAddProduct} />
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No products found.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminProduct;
