"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Page = () => {
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // fetch product from backend
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/product/latestproduct`
        );
        setProduct(res.data.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchProduct();
  }, []);

  // add to cart using product id
  const handleAddToCart = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API}/cart/addtocart`,
        {
          product: product._id,
          quantity: 1,
        }
      );

      alert("Added to cart");
      router.push("/cart");
    } catch (err) {
      console.log(err);
      alert("Failed to add to cart");
    }
  };

  if (loading) return <p className="p-20">Loading...</p>;
  if (!product) return <p className="p-20">Product not found</p>;

  return (
    <div className="py-17">
      <div className="w-300 mx-auto flex">
        <div className="w-120">
          <h1 className="mt-10 text-4xl font-bold text-gray-800">
            {product.title}
          </h1>

          <h2 className="text-[#c05b63] mt-20 text-2xl font-semibold">
            Natural Inner Beauty
          </h2>

          <p className="text-gray-500 mt-6 text-lg">
            {product.description}
          </p>

          <p className="mt-6 text-2xl font-bold text-gray-800">
            ৳ {product.discountprice || product.price}
          </p>

          <button
            onClick={handleAddToCart}
            className="bg-[#d17070] hover:bg-[#ad2e34] text-white px-10 py-3 rounded-sm mt-20"
          >
            Add to cart
          </button>
        </div>

        <div className="flex relative">
          <img
            src={product.image?.[0]}
            alt={product.title}
            className="-mt-20 h-150"
          />
          <p className="absolute -rotate-90 text-[180px] font-bold mt-20 ml-90 text-[#f7c9cf]">
            serum
          </p>
        </div>
      </div>
    </div>
  );
};

export default Page;