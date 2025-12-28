"use client";

import React, { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import axios from "axios";

const CheckoutPage = () => {
  const [cartData, setCartData] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");

  const [subtotal, setSubtotal] = useState(0);
  const [deliveryCharge, setDeliveryCharge] = useState(0);

  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const taxRate = 0.005;
  const tax = subtotal >= 5000 ? Number((subtotal * taxRate).toFixed(2)) : 0;
  const total = subtotal + deliveryCharge + tax;

  // ================= CART =================
  const fetchCart = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/cart/allcart`
      );
      const data = res.data.data;
      setCartData(data);

      const sub = data.reduce(
        (acc, item) => acc + Number(item.totalprice || 0),
        0
      );
      setSubtotal(sub);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemoveItem = async (item) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API}/cart/deletecart/${item._id}`
      );
      fetchCart();
    } catch (error) {
      console.error(error);
    }
  };

  // ================= DISTRICT =================
  useEffect(() => {
    axios
      .get("https://bdapis.com/api/v1.2/districts")
      .then((res) => setDistricts(res.data.data))
      .catch(() => setDistricts([]));
  }, []);

  const handleSelectCity = (e) => {
    const city = e.target.value.trim();
    setSelectedCity(city);

    if (city.toLowerCase() === "dhaka") setDeliveryCharge(60);
    else setDeliveryCharge(120);
  };

  // PLACE ORDER
  const placeOrder = async () => {
    if (!name || !phone || !address || !selectedCity)
      return alert("Please fill all required fields");

    if (cartData.length === 0) return alert("Cart is empty");

    const payload = {
      paymentmethod: paymentMethod,
      city: selectedCity,
      address,
      name,
      phone,
      subtotal, // Already from cartData
      deliveryCharge,
      tax,
      total,
      items: cartData.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        totalprice: item.totalprice,
      })),
    };

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/order/createorder`,
        payload
      );
      alert("Order placed successfully");

      setCartData([]);
      setAddress("");
      setName("");
      setPhone("");
      setSelectedCity("");
      setSubtotal(0);
    } catch (error) {
      console.error(error);
      alert("Failed to place order");
    }
  };

  return (
    <div>
      <div className="sm:px-15 px-4 py-10">
        <div className="max-w-6xl mx-auto">
          {/* Main Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Delivery Form */}
            <div className="lg:col-span-2">
              <form className="space-y-8">
                <h2 className="text-2xl font-semibold text-slate-900">
                  Delivery Details
                </h2>
                <div className="grid gap-4">
                <div>
                    <label className="text-lg" htmlFor="">Enter your Name</label>
                    <input
                      type="text"
                      placeholder="Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="px-4 py-2 border border-gray-400 rounded-md w-full focus:outline-gray-600 mt-2"
                    />
                  </div>
                  <div>
                    <label className="text-lg" htmlFor="">Enter your Phone Number</label>
                    <input
                      type="text"
                      placeholder="Phone Number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="px-4 py-2 border border-gray-400 rounded-md w-full focus:outline-gray-600 mt-2"
                    />
                  </div>
                  <div>
                    <label className="text-lg" htmlFor="">Enter your Address</label>
                    <input
                      type="text"
                      placeholder="Address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="px-4 py-2 border border-gray-400 rounded-md w-full focus:outline-gray-600 mt-2"
                    />
                  </div>
                  <div>
                    <label className="text-lg" htmlFor="">Enter your City</label>
                    <select
                      value={selectedCity}
                      onChange={handleSelectCity}
                      className="px-4 py-2 border border-gray-400 rounded-md w-full mt-2"
                    >
                      <option value="">Select City</option>
                      {districts.map((d) => (
                        <option key={d.district} value={d.district}>
                          {d.district}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Payment */}
                <h2 className="text-2xl font-semibold text-slate-900 mt-6">
                  Payment Method
                </h2>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    Cash On Delivery
                  </label>
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <div className="border border-gray-300 rounded-md p-6 max-h-150 overflow-auto">
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">
                Order Summary
              </h2>
              {cartData.map((item) => (
                <div key={item._id} className="flex justify-between gap-4 mb-4">
                  <div className="flex gap-2 items-center">
                    <img
                      src={item.product.image[0]}
                      alt=""
                      className="w-16 h-16 object-contain"
                    />
                    <div>
                      <h3 className="text-lg font-medium">
                        {item.product.title}
                      </h3>
                      <p className="text-lg text-slate-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <p className="font-semibold">৳ {item.totalprice}</p>
                    <button
                      onClick={() => handleRemoveItem(item)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <RiDeleteBin6Line />
                    </button>
                  </div>
                </div>
              ))}

              <hr className="border-gray-300 my-4" />
              <div className="space-y-2">
                <p className="flex justify-between text-lg">
                  Subtotal <span>৳ {subtotal}</span>
                </p>
                <p className="flex justify-between text-lg">
                  Delivery Charge <span>৳ {deliveryCharge}</span>
                </p>
                <p className="flex justify-between text-lg">
                  Tax <span>৳ {tax}</span>
                </p>
                <p className="flex justify-between font-semibold text-lg">
                  Total <span>৳ {total}</span>
                </p>
              </div>
              <button
                onClick={placeOrder}
                className="mt-4 w-full bg-[#d17070] hover:bg-[#ad2e34] text-white py-2 rounded-md"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
