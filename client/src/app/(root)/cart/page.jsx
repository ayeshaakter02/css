"use client";

import React, { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import axios from "axios";
import Link from "next/link";

const Page = () => {
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [subtotal, setSubtotal] = useState(0);

  // 🔹 Fetch cart (NO USER)
  const fetchCart = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API}/cart/allcart`
      );

      if (res.data.success) {
        setCartData(res.data.data);

        const sub = res.data.data.reduce(
          (acc, item) => acc + Number(item.totalprice || 0),
          0
        );
        setSubtotal(sub);
      }
    } catch (error) {
      console.error("Cart Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // 🔹 Delete cart item
  const handleRemoveItem = async (item) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API}/cart/deletecart/${item._id}`
      );
      fetchCart(); // refresh
    } catch (err) {
      console.log(err);
    }
  };

  // 🔹 Increase quantity
  const handleIncreQuantity = async (item) => {
    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API}/cart/updatequantity/${item._id}`,
        { quantity: item.quantity + 1 }
      );
      fetchCart();
    } catch (err) {
      console.log(err);
    }
  };

  // 🔹 Decrease quantity
  const handleDecreQuantity = async (item) => {
    if (item.quantity <= 1) return;

    try {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API}/cart/updatequantity/${item._id}`,
        { quantity: item.quantity - 1 }
      );
      fetchCart();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="mx-auto py-20">
      <div className="mx-auto max-w-6xl md:p-4">
        <h1 className="text-3xl font-extrabold text-[#c05b63] mb-5">
          Your Shopping Cart
        </h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT CART LIST */}
          <div className="lg:col-span-2 space-y-6">
            {loading ? (
              <p>Loading...</p>
            ) : cartData.length === 0 ? (
              <p>No items in cart</p>
            ) : (
              cartData.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-4 px-4 py-6 rounded-md shadow-sm border"
                >
                  <div className="flex gap-6">
                    <div className="w-24 h-24">
                      <img
                        src={item.product?.image[0]}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex flex-col gap-4">
                      <h3 className="font-semibold">
                        {item.product?.title}
                      </h3>

                      <h3 className="font-semibold">
                        ৳{item.product?.discountprice}
                      </h3>
                    </div>
                  </div>

                  <div className="ml-auto flex flex-col">
                    <button
                      onClick={() => handleRemoveItem(item)}
                      className="text-xl ml-7 text-red-500"
                    >
                      <RiDeleteBin6Line />
                    </button>

                    <div className="flex items-center gap-3 mt-auto">
                      <button
                        onClick={() => handleDecreQuantity(item)}
                        className="w-6 h-6 bg-[#ad2e34] text-white rounded-full"
                      >
                        -
                      </button>

                      <span className="font-semibold">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => handleIncreQuantity(item)}
                        className="w-6 h-6 bg-[#ad2e34] text-white rounded-full"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* RIGHT SUMMARY */}
          <div className="rounded-lg shadow-md p-6 border">
            <h3 className="text-lg font-bold mb-6">Order Summary</h3>

            <ul className="space-y-4">
              <li className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold">৳{subtotal}</span>
              </li>

              <hr />

              <li className="flex justify-between font-bold">
                <span>Total</span>
                <span>৳{subtotal}</span>
              </li>
            </ul>

            <Link
              href="/checkout"
              className="block text-center w-full px-4 py-3 mt-6 text-white bg-[#d17070] hover:bg-[#ad2e34] rounded-md"
            >
              Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
