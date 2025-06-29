"use client";
import Image from "next/image";
import { useRef, useState } from "react";
import { AiOutlineLink } from "react-icons/ai";
import Link from "next/link";
import { HiOutlineExternalLink } from "react-icons/hi";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import type { Product } from "./_client";
import ConsultDetail from "./_ConsultDetial";
import { IoCartOutline } from "react-icons/io5";
import { FiShoppingBag } from "react-icons/fi";
import { ProductDetailSkeleton } from "./Skeleton";
interface ProductDetailProps {
  product: Product | null | undefined;
  isLoading: boolean;
  isValidUrl(str: string): boolean;
}

export default function ProductDetail({ product, isLoading, isValidUrl }: ProductDetailProps) {
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});
  const [imageLoadingStates, setImageLoadingStates] = useState<{ [key: string]: boolean }>({
    main: true,
    sketch: true,
  });

  const handleImageError = (imageType: string) => {
    setImageErrors(prev => ({ ...prev, [imageType]: true }));
    setImageLoadingStates(prev => ({ ...prev, [imageType]: false }));
  };

  const handleImageLoad = (imageType: string) => {
    setImageLoadingStates(prev => ({ ...prev, [imageType]: false }));
  };

if (isLoading && !product) {
  return <ProductDetailSkeleton />;
}

  if (!product) {
    return <div className="text-red-500 text-center py-8">ไม่มีข้อมูลสินค้า</div>;
  }


  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="relative bg-white/50 p-4 rounded-md overflow-hidden h-[400px] md:h-[400px]">
            {isValidUrl(product.image) && !imageErrors.main ? (
              <Image
                src={product.image}
                className="w-full h-full object-cover p-4 rounded-md"
                fill
                alt={product.productName || "Product image"}
                priority
                onError={() => handleImageError('main')}
                onLoad={() => handleImageLoad('main')}
              />
            ) : (
              <div className="w-full h-full bg-white/50 flex items-center justify-center">
                <span className="text-gray-400">ไม่มีรูปภาพ</span>
              </div>
            )}
          </div>
          <div className="relative bg-white/50 rounded-md p-4">
            <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar" >
              {[...Array(5)].map((_, index) => (
                <a
                  href={isValidUrl(product.image) ? product.image : "#"}
                  data-fancybox="gallery"
                  key={`${product.image}-${product.ID}-${index}`}
                  className="snap-start flex-shrink-0 w-32 h-32"
                >
                  {isValidUrl(product.image) && !imageErrors.main ? (
                    <Image
                      src={product.image}
                      className="w-32 h-32 rounded-lg object-cover hover:scale-105 transition-transform duration-300"
                      width={128}
                      height={128}
                      alt={`${product.productName}`}
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm text-gray-400">ไม่มีรูป</span>
                    </div>
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white/50 rounded-md p-4 space-y-4">
          <h1 className="text-3xl font-bold text-blue-950">{product.productName || 'ไม่มีชื่อสินค้า'}</h1>

          <div className="space-y-4">
            <div className="flex gap-2 text-[24px] text-gray-600">
              ราคา :
              {product.price ? (
                <span className="text-green-600 font-semibold">{product.price.toLocaleString()} บาท</span>
              ) : (
                <span className="text-red-500">สินค้าหมด</span>
              )
              }
            </div>

            <div className="text-[18px] text-gray-600 flex items-center gap-2">
              ร้าน :
              <Link
                href={`/businesses/${product.bussinessID}`}
                className="flex items-center gap-2 text-blue-950 hover:underline underline-offset-4 transition-colors"
              >
                {" "}<span className="font-medium flex items-center gap-1">{product.businessinfo.BussinessName} <HiOutlineExternalLink size={18} /></span>
              </Link>
            </div>

            <div className="text-[18px] text-gray-600 flex items-center gap-2">
              ปี : <span>{product.businessinfo.DataYear}</span>
            </div>


            <div className="flex flex-wrap gap-2 text-[18px] border-b border-gray-200 pb-4">
              <span className="text-gray-600 font-medium">วัสดุ : </span>
              {product.mainMaterial && (
                <span className="text-sm text-blue-500 bg-blue-100 px-3 py-1 rounded-md">
                  {product.mainMaterial}
                </span>
              )}
              {product.subMaterial1 && (
                <span className="text-sm text-sky-500 bg-sky-100 px-3 py-1 rounded-md">
                  {product.subMaterial1}
                </span>
              )}
              {product.subMaterial2 && (
                <span className="text-sm text-sky-500 bg-sky-100 px-3 py-1 rounded-md">
                  {product.subMaterial2}
                </span>
              )}
              {product.subMaterial3 && (
                <span className="text-sm text-sky-500 bg-sky-100 px-3 py-1 rounded-md">
                  {product.subMaterial3}
                </span>
              )}
            </div>

            <div className="flex flex-row gap-4 text-[18px]">
              <div className="text-gray-600 w-full">
                <span className="font-medium">สี : </span>
                {product.color ? (
                  <span className="">{product.color}</span>
                ) : (
                  <span className="">-</span>
                )
                }
              </div>
              <div className="text-gray-600 w-full">
                <span className="font-medium">ขนาด : </span>
                {product.size ? (
                  <span className="">{product.size}</span>
                ) : (
                  <span className="">-</span>
                )
                }
              </div>
            </div>

            <Link
              href={product.link || "#"}
              className={`flex justify-center items-center gap-2 ${product.link ? "bg-blue-950 text-white hover:bg-blue-950/90 " : "bg-gray-300 text-gray-400 cursor-default"} w-full px-6 py-2 rounded-lg  transition-colors`}
            >
              <FiShoppingBag className="w-5 h-5" /> <span>สนใจสั่งซื้อ</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-4 bg-white/50 rounded-md">
             <div className="p-4 bg-white/30 backdrop-blur-md border-b border-gray-200/40 rounded-t-md">
            <h2 className="text-xl sm:text-2xl font-light text-blue-950">รายละเอียดผลิตภัณฑ์</h2>
          </div>
        <p className="text-gray-600 leading-relaxed p-4">{product.description || 'ไม่มีรายละเอียดสินค้า'}</p>
      </div>

      {/* Design Section */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-4 rounded-md">
        <div className="md:col-span-3 bg-white/50 rounded-md">
          <div className="p-4 bg-white/30 backdrop-blur-md border-b border-gray-200/40 rounded-t-md">
            <h2 className="text-xl sm:text-2xl font-light text-blue-950">การออกแบบ</h2>
          </div>
          {/* <h2 className="text-[20px] text-blue-950 mb-4">การออกแบบ</h2> */}
          <p className="text-gray-600 leading-relaxed p-4">
            {product.description ? `รายละเอียดการออกแบบ: ${product.description}` : 'ไม่มีข้อมูลการออกแบบ'}
          </p>
        </div>
        <div className="md:col-span-2">
          {isValidUrl(product.sketch) && !imageErrors.sketch ? (
            <div className="bg-white/50 rounded-md p-4">
              <Image
                src={product.sketch}
                className="w-full h-auto rounded-md object-cover"
                width={365}
                height={300}
                alt="Product sketch"
                onError={() => handleImageError('sketch')}
                onLoad={() => handleImageLoad('sketch')}
              />
            </div>
          ) : (
            <div className="w-full h-[300px] bg-gray-100 rounded-2xl flex items-center justify-center">
              <span className="text-gray-400">ไม่มีภาพร่าง</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}