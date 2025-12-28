import Link from "next/link";
import React from "react";
import { IoMdCart } from "react-icons/io";

const Header = () => {
  return (
    <header className="bg-[#fae8eb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-25">
          {/* LOGO */}
          <Link
            href="/"
            className="font-bold text-2xl sm:text-2xl text-red-700"
          >
            CLARINS
          </Link>

          {/* CART ICON */}
          <Link
            href="/cart"
            className="text-xl sm:text-2xl text-red-700 hover:text-gray-900 transition"
          >
            <IoMdCart />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
