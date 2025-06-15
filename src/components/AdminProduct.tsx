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


import { storage } from "@/Services/Firebase.config";
import { getDownloadURL, ref as storageRef, uploadBytes } from "firebase/storage";
import { push, ref as dbRef, set } from "firebase/database";
import { database } from "@/Services/Firebase.config";
import toast from "react-hot-toast";
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



export const AddProductToShop = () => {
  const [formData, setFormData] = useState({
    CategoryName: "",
    FlavourCode: '',
    PriceListID: "",
    PriceListName: "",
    SubCategoryCode: '',
    active: true,
    beforeDiscPrice: "",
    cessPerc: "",
    cgstperc: "",
    companyID: "",
    contains: "",
    discAmt: "",
    discPerc: "",
    free: "",
    gst: '',
    hsnCode: "",
    id: "",
    importStatus: '',
    isMarginBased: "",
    margin: '',
    per: '',
    productCode: "",
    productGroupCode: "",
    productGroupId: "",
    productId: "",
    productImageURL: "",
    productImageURL2: "",
    productName: "",
    qty: '',
    rate: '',
    retailproduct: '',
    salesPrice: '',
    sgstperc: '',
    sortingorder: '',
    stock: '',
    stockValue: '',
    uom: '',
    uomid: "",
    youtubeURL: ""
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = async () => {
    if (!imageFile) return "";
    const imgRef = storageRef(storage, `products/${Date.now()}-${imageFile.name}`);
    const snapshot = await uploadBytes(imgRef, imageFile);
    return await getDownloadURL(snapshot.ref);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const imageUrl = await handleImageUpload();

      const ProductdbId = Date.now().toString(); // or use uuid if preferred
      const finalData = {
        ...formData,
        productImageURL: imageUrl,
        id:ProductdbId,
      };
     const productRef = dbRef(database, `FC/Products/${ProductdbId}`);
     await set(productRef, finalData);

      toast.success("Product added successfully!");

      // Reset form
      setFormData({
        CategoryName: "",
        FlavourCode: "",
        PriceListID: "",
        PriceListName: "",
        SubCategoryCode: "",
        active: "",
        beforeDiscPrice: "",
        cessPerc: "",
        cgstperc: "",
        companyID: "",
        contains: "",
        discAmt: "",
        discPerc: "",
        free: "",
        gst: "",
        hsnCode: "",
        id: "",
        importStatus: "",
        isMarginBased: "",
        margin: "",
        per: "",
        productCode: "",
        productGroupCode: "",
        productGroupId: "",
        productId: "",
        productImageURL: "",
        productImageURL2: "",
        productName: "",
        qty: "",
        rate: "",
        retailproduct: "",
        salesPrice: "",
        sgstperc: "",
        sortingorder: "",
        stock: "",
        stockValue: "",
        uom: "",
        uomid: "",
        youtubeURL: ""
      });

      setImageFile(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="text-sm mb-2">+ Add Product To Shop</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto p-4 w-full">
        <DialogHeader>
          <DialogTitle className="text-xl mb-4">Create Product</DialogTitle>
        </DialogHeader>

     <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
  <div>
    <label>Product Name</label>
    <Input type="text" placeholder="Product Name" value={formData.productName} onChange={(e) => handleChange("productName", e.target.value)} />
  </div>
  <div>
    <label>Category Name</label>
    <Input type="text" placeholder="Category Name" value={formData.CategoryName} onChange={(e) => handleChange("CategoryName", e.target.value)} />
  </div>
  <div>
    <label>Product Code</label>
    <Input type="text" placeholder="Product Code" value={formData.productCode} onChange={(e) => handleChange("productCode", e.target.value)} />
  </div>
  <div>
    <label>Before Discount Price</label>
    <Input type="number" placeholder="Before Discount Price" value={formData.beforeDiscPrice} onChange={(e) => handleChange("beforeDiscPrice", e.target.value === "" ? "" : +e.target.value)} />
  </div>
  <div>
    <label>Discount Amount</label>
    <Input type="number" placeholder="Discount Amount" value={formData.discAmt} onChange={(e) => handleChange("discAmt", e.target.value === "" ? "" : +e.target.value)} />
  </div>
  <div>
    <label>Discount %</label>
    <Input type="number" placeholder="Discount %" value={formData.discPerc} onChange={(e) => handleChange("discPerc", e.target.value)} />
  </div>
  <div>
    <label>GST</label>
    <Input type="number" placeholder="GST" value={formData.gst} onChange={(e) => handleChange("gst", e.target.value)} />
  </div>
  <div>
    <label>HSN Code</label>
    <Input type="text" placeholder="HSN Code" value={formData.hsnCode} onChange={(e) => handleChange("hsnCode", e.target.value)} />
  </div>
  <div>
    <label>Sales Price</label>
    <Input type="number" placeholder="Sales Price" value={formData.salesPrice} onChange={(e) => handleChange("salesPrice", e.target.value === "" ? "" : +e.target.value)} />
  </div>
  <div>
    <label>Flavour Code</label>
    <Input type="text" placeholder="Flavour Code" value={formData.FlavourCode} onChange={(e) => handleChange("FlavourCode", e.target.value)} />
  </div>
  <div>
    <label>Contains</label>
    <Input type="text" placeholder="Contains" value={formData.contains} onChange={(e) => handleChange("contains", e.target.value)} />
  </div>
  <div>
    <label>Stock</label>
    <Input type="number" placeholder="Stock" value={formData.stock} onChange={(e) => handleChange("stock", e.target.value)} />
  </div>
  <div>
    <label>Stock Value</label>
    <Input type="number" placeholder="Stock Value" value={formData.stockValue} onChange={(e) => handleChange("stockValue", e.target.value === "" ? "" : +e.target.value)} />
  </div>
  <div>
    <label>Rate</label>
    <Input type="number" placeholder="Rate" value={formData.rate} onChange={(e) => handleChange("rate", e.target.value)} />
  </div>
  <div>
    <label>Margin</label>
    <Input type="number" placeholder="Margin" value={formData.margin} onChange={(e) => handleChange("margin", e.target.value === "" ? "" : +e.target.value)} />
  </div>
  <div>
    <label>Sorting Order</label>
    <Input type="number" placeholder="Sorting Order" value={formData.sortingorder} onChange={(e) => handleChange("sortingorder", e.target.value === "" ? "" : +e.target.value)} />
  </div>
  <div>
    <label>UOM ID</label>
    <Input type="text" placeholder="UOM ID" value={formData.uomid} onChange={(e) => handleChange("uomid", e.target.value)} />
  </div>
  <div>
    <label>YouTube URL</label>
    <Input type="text" placeholder="YouTube URL" value={formData.youtubeURL} onChange={(e) => handleChange("youtubeURL", e.target.value)} />
  </div>
  <div>
    <label>Upload Image File For Product</label>
    <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
    {imageFile && (
      <div className="col-span-2">
        <p className="font-semibold">New Image Preview:</p>
        <img
          src={URL.createObjectURL(imageFile)}
          alt="New Preview"
          className="w-32 h-32 object-cover border rounded"
        />
      </div>)}
  </div>
</div>


        <div className="flex justify-end mt-4">
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Uploading..." : "Add Product"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};


const EditProductCard = React.memo(({ product,setselectedProduct }) => {
 
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-md transition p-4 flex flex-col" onClick={()=>{setselectedProduct(product)}}>
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
export const EditProduct=()=>{
    const { products } = useFirebase();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setselectedProduct] = useState(null);

  const [loading, setLoading] = useState(false);

  const filteredProducts = products.filter((item) =>
    item.productName?.toLowerCase().includes(searchTerm.toLowerCase())
  );
const [imageFile, setImageFile] = useState(null);

  const handleChange = (field: string, value: string | number | boolean) => {
    setselectedProduct((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImageUpload = async () => {
    if (!imageFile) return "";
    const imgRef = storageRef(storage, `products/${Date.now()}-${imageFile.name}`);
    const snapshot = await uploadBytes(imgRef, imageFile);
    return await getDownloadURL(snapshot.ref);
  };
   const handleSubmit = async () => {
    try {
      setLoading(true);
      const imageUrl = await handleImageUpload();

      const finalData = {
        ...selectedProduct,
        productImageURL: imageUrl?imageUrl:selectedProduct.productImageURL,
      };
     const productRef = dbRef(database, `FC/Products/${selectedProduct.id}`);
     await set(productRef, finalData);

      toast.success("Product added successfully!");

    
      setImageFile(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to Edit product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="text-sm mb-2">Edit Product</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto p-4">
        <DialogHeader>
          <DialogTitle className="text-xl mb-4">Choose Product To Edit</DialogTitle>
          <p>Total Items:{filteredProducts.length}</p>
           
          {/* Search Bar */}
          {!selectedProduct&&<Input
            placeholder="Search by product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />}
        </DialogHeader>

        {/* Scrollable filtered product list */}
       {!selectedProduct&&<div className="space-y-4">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((item, index) => (
              <div key={index} className="shadow-md rounded-md overflow-hidden">
                <EditProductCard product={item} setselectedProduct={setselectedProduct}/>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No products found.</p>
          )}
        </div>}
         <Button onClick={()=>setselectedProduct(null)} className="mb-4">
            ← Back 
          </Button>
        {selectedProduct?.productImageURL && (
          <div className="col-span-2">
           
            <p className="font-semibold">Current Image:</p>
            <img
              src={selectedProduct.productImageURL}
              alt="Current Product"
              className="w-32 h-32 object-cover border rounded"
            />
          </div>
          )}

       {selectedProduct && (
  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
    
    <div>
      <label>Product Name</label>
      <Input type="text" placeholder="Product Name" value={selectedProduct.productName} onChange={(e) => handleChange("productName", e.target.value)} />
    </div>
    <div>
      <label>Category Name</label>
      <Input type="text" placeholder="Category Name" value={selectedProduct.CategoryName} onChange={(e) => handleChange("CategoryName", e.target.value)} />
    </div>
    <div>
      <label>Product Code</label>
      <Input type="text" placeholder="Product Code" value={selectedProduct.productCode} onChange={(e) => handleChange("productCode", e.target.value)} />
    </div>
    <div>
      <label>Before Discount Price</label>
      <Input type="number" placeholder="Before Discount Price" value={selectedProduct.beforeDiscPrice} onChange={(e) => handleChange("beforeDiscPrice", +e.target.value)} />
    </div>
    <div>
      <label>Discount Amount</label>
      <Input type="number" placeholder="Discount Amount" value={selectedProduct.discAmt} onChange={(e) => handleChange("discAmt", +e.target.value)} />
    </div>
    <div>
      <label>Discount %</label>
      <Input type="number" placeholder="Discount %" value={selectedProduct.discPerc} onChange={(e) => handleChange("discPerc", +e.target.value)} />
    </div>
    <div>
      <label>GST</label>
      <Input type="number" placeholder="GST" value={selectedProduct.gst} onChange={(e) => handleChange("gst", +e.target.value)} />
    </div>
    <div>
      <label>HSN Code</label>
      <Input type="text" placeholder="HSN Code" value={selectedProduct.hsnCode} onChange={(e) => handleChange("hsnCode", e.target.value)} />
    </div>
    <div>
      <label>Sales Price</label>
      <Input type="number" placeholder="Sales Price" value={selectedProduct.salesPrice} onChange={(e) => handleChange("salesPrice", +e.target.value)} />
    </div>
    <div>
      <label>Flavour Code</label>
      <Input type="text" placeholder="Flavour Code" value={selectedProduct.FlavourCode} onChange={(e) => handleChange("FlavourCode", +e.target.value)} />
    </div>
    <div>
      <label>Contains</label>
      <Input type="text" placeholder="Contains" value={selectedProduct.contains} onChange={(e) => handleChange("contains", e.target.value)} />
    </div>
    <div>
      <label>Stock</label>
      <Input type="number" placeholder="Stock" value={selectedProduct.stock} onChange={(e) => handleChange("stock", +e.target.value)} />
    </div>
    <div>
      <label>Stock Value</label>
      <Input type="number" placeholder="Stock Value" value={selectedProduct.stockValue} onChange={(e) => handleChange("stockValue", +e.target.value)} />
    </div>
    <div>
      <label>Rate</label>
      <Input type="number" placeholder="Rate" value={selectedProduct.rate} onChange={(e) => handleChange("rate", +e.target.value)} />
    </div>
    <div>
      <label>Margin</label>
      <Input type="number" placeholder="Margin" value={selectedProduct.margin} onChange={(e) => handleChange("margin", +e.target.value)} />
    </div>
    <div>
      <label>Sorting Order</label>
      <Input type="number" placeholder="Sorting Order" value={selectedProduct.sortingorder} onChange={(e) => handleChange("sortingorder", +e.target.value)} />
    </div>
    <div>
      <label>UOM ID</label>
      <Input type="text" placeholder="UOM ID" value={selectedProduct.uomid} onChange={(e) => handleChange("uomid", e.target.value)} />
    </div>
    <div>
      <label>YouTube URL</label>
      <Input type="text" placeholder="YouTube URL" value={selectedProduct.youtubeURL} onChange={(e) => handleChange("youtubeURL", e.target.value)} />
    </div>

    <div className="col-span-2">
      <label className="font-semibold">Upload Image File For Product</label>
      <Input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
    </div>

    {imageFile && (
      <div className="col-span-2">
        <p className="font-semibold">New Image Preview:</p>
        <img
          src={URL.createObjectURL(imageFile)}
          alt="New Preview"
          className="w-32 h-32 object-cover border rounded"
        />
      </div>
    )}

    <div className="col-span-2 flex justify-end mt-4">
      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? "Uploading..." : "Edit Product"}
      </Button>
    </div>
  </div>
)}

      </DialogContent>
    </Dialog>
  );

}
