"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { IoStorefrontOutline } from "react-icons/io5";

interface ProductCardProps {
  ID: number;
  productName: string;
  image?: string;
  BusinessName: string;
  Material: string
  price?: number
}

export default function ProductCard({ productName, image, BusinessName, ID  ,price,Material}: ProductCardProps) {
  const router = useRouter();
  const [imageError, setImageError] = useState(false)

   const handleImageError = () => {
    setImageError(true)
  }

  const handleProductLink = () => {
    if (ID) router.push(`/products/${ID}`); 
  };

   function isValidUrl(str: string) {
    try {
      new URL(str)
      return true
    } catch {
      return false
    }
  }

  return (
    <div
          className="bg-white rounded-md hover:shadow-lg p-4 cursor-pointer shadow-md group w-fit md:w-full lg:w-full"
          onClick={handleProductLink}
        >
          <div className="rounded-md bg-white w-full">
            <div className="mx-auto w-[180px] md:w-full lg:w-full aspect-square max-w-[200px] overflow-hidden rounded-md">
              {imageError ? (
                <div className="w-full h-full bg-gray-400 rounded-md flex items-center justify-center">
                  <span className="text-white text-xs text-center">ไม่มีภาพ</span>
                </div>
              ) : (
                <Image
                  src={image || "/images/default.jpg"}
                  alt={``}
                  width={200}
                  height={200}
                  quality={90}
                  placeholder="blur"
                  blurDataURL="/images/default.jpg"
                  priority={true}
                  className="rounded-md transition-transform duration-300 group-hover:scale-110 origin-center w-full h-full object-cover"
                  sizes="(max-width: 640px) 150px, (max-width: 768px) 180px, (max-width: 1024px) 200px, 220px"
                  onError={handleImageError}
                />
              )}
            </div>
    
            <div className="flex flex-col justify-center gap-2">
              <div className="flex items-center gap-2 mt-2 w-full">
                <h1 className="text-[20px] text-start text-gray-600 truncate max-w-[132px]">
                  {productName || "สินค้า"}
                </h1>
                <div className="text-[12px] text-blue-500 bg-blue-100 px-2 py-[1px] rounded-[4px] truncate w-fit text-center min-w-[40px]">
                  {Material || "ไม่ระบุวัสดุ"}
                </div>
              </div>
    
              <div className="flex items-center w-full">
                <IoStorefrontOutline size={20} className="text-gray-400 mr-2" />
                <div className="flex items-center justify-end border-l w-full border-gray-300">
                  <p className="text-[14px] text-gray-400 m-0 text-end truncate max-w-[135px]">
                    {BusinessName || "ไม่ระบุ"}
                  </p>
                </div>
              </div>
    
              <div className="flex items-center w-full">
                <AiOutlineShoppingCart size={20} className="text-gray-400 mr-2" />
                <div className="flex items-center w-full border-l border-gray-300">
                  {price && Number(price) > 0 ? (
                    <p className="w-full text-[14px] text-green-600 text-end m-0">
                      {Number(price).toLocaleString("th-TH")} บาท
                    </p>
                  ) : (
                    <p className="w-full text-[14px] text-red-500 text-end m-0">สินค้าหมด</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
  );
}
