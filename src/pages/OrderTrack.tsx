//@ts-nocheck

import Footer from "@/components/Footer";
import { useFirebase } from "@/Services/context";
import {
  Truck,
  CalendarCheck2,
  PackageCheck,
  AlertCircle,
  CheckCircle2,
  Box,
  Package,
  ArrowRight,
} from "lucide-react";
import { useEffect, useState } from "react";

const statusSteps = [
  { key: "orderPlaced", label: "Order Placed", icon: <Box /> },
  { key: "payment", label: "Payment", icon: <Package /> },
  { key: "shipped", label: "Shipped", icon: <Truck /> },
  { key: "delivered", label: "Delivered", icon: <CheckCircle2 /> },
];

const OrderTrack = () => {
  const [orders, setOrders] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const { getOrders, user } = useFirebase();

  useEffect(() => {
    const fetchOrders = async () => {
      const fetched = await getOrders();
      setOrders(fetched || {});
    };
    if (user) fetchOrders();
  }, [user]);
console.log(orders);
  return (
    <>
      <section className="min-h-[100vh] bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-8 space-y-10">
          <h2 className="text-3xl font-bold text-center text-gray-800">
            Track Your Order
          </h2>

          {/* Order List */}
          {orders && Object.keys(orders).length === 0 ? (
            <div className="text-center py-16">
              <AlertCircle className="mx-auto mb-4 text-red-400" size={48} />
              <h3 className="text-2xl font-semibold text-gray-700">
                No orders found
              </h3>
              <p className="text-gray-500 mt-2">
                You haven’t placed any orders yet. Start shopping now!
              </p>
              <img
                src="/empty-box.png"
                alt="No Orders"
                className="w-52 mx-auto mt-6 opacity-80"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(orders).map(([key, order]) => (
                <div
                  key={key}
                  onClick={() => setSelectedOrder(order)}
                  className="bg-white border border-blue-100 hover:border-blue-400 p-6 rounded-xl shadow-sm hover:shadow-md cursor-pointer transition"
                >
                  <h4 className="text-lg font-bold text-blue-800">
                    Order #{order.billNo}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {order.customer?.accounterName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {order.deliveryAddress}
                  </p>
                  <p className="text-sm text-gray-500">
                    {order.billProductList.length} items
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-400">Placed: {order.date}</p>
                    <p className="text-sm font-semibold text-green-700">
                      ₹{order.totalAmount+order.packingCharge || 0}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Selected Order Summary */}
          {selectedOrder && (
            <div className="mt-10 border-t pt-6">
              <h3 className="text-2xl font-bold mb-6 text-gray-800">
                Order Summary
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                <div className="bg-blue-100 p-6 rounded-xl shadow-md">
                  <PackageCheck className="mx-auto mb-2 text-blue-600" size={32} />
                  <p className="text-sm text-gray-500">Order ID</p>
                  <p className="text-xl font-semibold text-blue-700">
                    #{selectedOrder.billNo}
                  </p>
                </div>

                <div className="bg-green-100 p-6 rounded-xl shadow-md">
                  <Truck className="mx-auto mb-2 text-green-600" size={32} />
                  <p className="text-sm text-gray-500">Delivery Address</p>
                  <p className="text-base font-medium text-green-700">
                    {selectedOrder.deliveryAddress}
                  </p>
                </div>

                <div className="bg-yellow-100 p-6 rounded-xl shadow-md">
                  <CalendarCheck2 className="mx-auto mb-2 text-yellow-600" size={32} />
                  <p className="text-sm text-gray-500">Placed On</p>
                  <p className="text-base font-medium text-yellow-700">
                    {selectedOrder.date}
                  </p>
                </div>
              </div>

              {/* Timeline Status */}
              <div className="mt-10">
                <h4 className="text-lg font-semibold text-gray-700 mb-4">
                  Order Status
                </h4>
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                 {statusSteps.map((step, index) => {
  const completed = selectedOrder.statuses?.[step.key];
  const isShippedStep = step.key === "shipped";
  const isOrderPlacedStep = step.key === "orderPlaced";

  return (
    <div
      key={step.key}
      className="flex flex-col items-center gap-1 relative text-center"
    >
   

      {/* Step Circle and Label */}
      <div className="flex items-center gap-2">
        <div
          className={`rounded-full p-2 ${
            completed
              ? "bg-green-500 text-white"
              : "bg-gray-200 text-gray-400"
          }`}
        >
          {step.icon}
        </div>
        <span
          className={`text-sm font-medium ${
            completed ? "text-green-700" : "text-gray-500"
          }`}
        >
          {step.label}
        </span>

        {index < statusSteps.length - 1 && (
          <ArrowRight className="text-gray-300 mx-2 hidden md:block" />
        )}
      </div>

      {/* Pending Verification under 'Order Placed' */}
      {isOrderPlacedStep && !completed && (
        <span className="text-xs text-orange-500 mt-1 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" /> Pending verification
        </span>
      )}
         {/* LR Number on shipped step */}
      {isShippedStep && selectedOrder.lrNumber && (
        <span className="text-xs text-orange-500 mt-1 flex items-center">
          LR: {selectedOrder.lrNumber}
        </span>
      )}
    </div>
  );
})}


                </div>
              </div>

              {/* Items */}
              <div className="mt-10">
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Items</h4>
                <ul className="space-y-2">
                  {selectedOrder.billProductList?.map((item, idx) => (
                    <li
                      key={idx}
                      className="bg-gray-50 border p-4 rounded-lg shadow-sm"
                    >
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{item.productName}</span>
                        <span>
                          {item.qty} × ₹{item.salesPrice} ={" "}
                          <strong>₹{item.qty*item.salesPrice}</strong>
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="text-right text-xl font-bold text-gray-800 mt-4">
                  Total: ₹{selectedOrder.totalAmount+selectedOrder.packingCharge
}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
};

export default OrderTrack;
