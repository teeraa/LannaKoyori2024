"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { IoStorefrontOutline } from "react-icons/io5";

interface ProductCardProps {
  ID: string;
  productName: string;
  image?: string;
  BusinessName: string;
}

export default function ProductCard({ productName, image, BusinessName, ID }: ProductCardProps) {
  const router = useRouter();

  const handleProductLink = () => {
    if (ID) router.push(`/products/${ID}`); 
  };

  return (
    <div
      className="bg-white rounded-md  hover:shadow-md p-[15px] cursor-pointer border-2 border-gray-200"
      onClick={handleProductLink}
    >
      <div className="rounded-md bg-white w-48">
        <div className="mx-auto w-42 h-44 group overflow-hidden">
          <Image
            src={image || "/images/default.jpg"}
            alt={productName} 
            width={128}
            height={128}
            priority={true}
            className="rounded-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3 origin-center"
            style={{
              objectFit: "cover",
              objectPosition: "top center",
              width: "100%",
              height: "100%",
            }}
          />
        </div>
        <div className="mt-2">
          <h1 className="card-title text-xl text-start text-gray-600 truncate">
            {productName}
          </h1>
          <h1 className="text-md text-start text-gray-400 flex justify-start items-center gap-2 truncate">
            <span>
              <IoStorefrontOutline size={16} />
            </span>
            {BusinessName}
          </h1>
        </div>
      </div>
    </div>
  );
}
