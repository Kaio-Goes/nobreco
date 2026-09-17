"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-store";

export default function CartLink() {
  const { totalCount } = useCart();

  return (
    <Link
      href="/carrinho"
      aria-label="Carrinho"
      className="relative flex h-9 w-9 items-center justify-center rounded-full text-preto/70 transition-colors hover:bg-preto/5 hover:text-preto"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        className="h-5 w-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.877-4.7 2.242-7.171a1.125 1.125 0 0 0-1.113-1.303H5.25M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
        />
      </svg>
      {totalCount > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-bordo px-1 text-[10px] font-semibold text-off-white">
          {totalCount}
        </span>
      )}
    </Link>
  );
}
