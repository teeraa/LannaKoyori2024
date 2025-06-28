"use client";
import Image from "next/image";
import { useState } from "react";
import { AiOutlineLink } from "react-icons/ai";
import Link from "next/link";
import type { Product, ConsultantInfo } from "./_client";
import ConsultDetail from "./_ConsultDetial";

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

  // Loading skeleton
  if (isLoading && !product) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="h-[330px] w-[330px] bg-gray-300 rounded-md"></div>
          <div className="col-span-2">
            <div className="h-8 bg-gray-300 rounded mb-4"></div>
            <div className="h-4 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return <div className="text-red-500">ไม่มีข้อมูลสินค้า</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 py-4 px-0">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 md:gap-4 overflow-hidden">
          <div className="col-span-1 h-[450px] w-full">
            {isValidUrl(product.image) && !imageErrors.main ? (
              <Image
                src={product.image}
                className="rounded-md w-full h-full object-cover"
                width={330}
                height={330}
                alt={product.productName || "Product image"}
                priority={true}
                onError={() => handleImageError('main')}
                onLoad={() => handleImageLoad('main')}
              />
            ) : (
              <div className="w-full h-full bg-gray-300 rounded-md flex items-center justify-center">
                <span className="text-gray-500">ไม่มีรูปภาพ</span>
              </div>
            )}
          </div>

          <div className="justify-center col-span-2 border-1 rounded-md px-0 md:p-4 bg-white/50 z-10 border-gray-100">
            <div className="flex items-center gap-2">
              <div className="text-[24px] font-bold text-blue-950 text-wrap">
                {product.productName || 'ไม่มีชื่อสินค้า'}
              </div>
              <span className="text-[14px] text-blue-500 bg-blue-100 px-4 py-[2px] rounded-md truncate w-fit text-center min-w-[40px]">
                วัตถุดืบหลัก
              </span>
            </div>

            {product.price && (
              <div className="text-[20px] font-bold text-gray-600 mb-4">
                ราคา : <span className="text-green-500">
                  {product.price.toLocaleString()+" บาท"}
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 gap-4 text-sm">
              {product.color && (
                <div>
                  <span className="font-semibold">สี:</span> {product.color}
                </div>
              )}
              {product.size && (
                <div>
                  <span className="font-semibold">ขนาด:</span> {product.size}
                </div>
              )}
              {product.subMaterial1Id && product.subMaterial2Id && product.subMaterial3Id && (
                <div>
                  <span className="font-semibold">ขนาด:</span> {product.subMaterial1Id}, {product.subMaterial2Id}, {product.subMaterial3Id}
                </div>
              )}
            </div>


          </div>
        </div>
        {/* Gallery */}
        <div className="border-1 more-show rounded-md px-0 md:p-4 bg-white/50 z-10 border-gray-100">
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-4 ">
            {[...Array(5)].map((_, index) => (
              <a
                href={isValidUrl(product.image) ? product.image : "#"}
                data-fancybox="gallery"
                key={product.image}
                className=""
              >
                {isValidUrl(product.image) && !imageErrors.main ? (
                  <Image
                    src={product.image}
                    className="w-40 h-40 rounded-md object-cover"
                    width={97}
                    height={97}
                    alt={`${product.productName} gallery ${1}`}
                  />
                ) : (
                  <div className="w-40 h-40 bg-gray-300 rounded-md flex items-center justify-center">
                    <span className="text-xs text-gray-500">ไม่มีรูป</span>
                  </div>
                )}
              </a>
            ))}
          </div>
        </div>
        {/* Business Info */}
        <div className="show-detail py-4">
          <div className="border-1 border-gray-100 rounded-md bg-white/50 md:p-4 px-4 mb-6">
            <h1 className="text-2xl font-semibold text-gray-600 mb-2">รายละเอียดผลิตภัณฑ์</h1>
            <div className="text-lg text-gray-600">
              {product.description || 'ไม่มีรายละเอียดสินค้า'}
            </div>
          </div>
        </div>

        {/* Sketch Section */}
        <div className="show-sketch grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="sketch-detail bg-white/50 text-gray-600 rounded-xl px-4 md:p-4 col-span-3">
            <h1 className="font-semibold text-2xl text-gray-600 mb-2">การออกแบบ</h1>
            <div className="text-gray-600">
              {product.description ?
                `รายละเอียดการออกแบบ: ${product.description}` :
                'ไม่มีข้อมูลการออกแบบ'
              }
            </div>
          </div>

          <div className="sketch-image col-span-2 flex justify-end">
            {isValidUrl(product.sketch) && !imageErrors.sketch ? (
              <Image
                src={product.sketch}
                className="rounded-xl w-full h-auto object-cover"
                width={365}
                height={300}
                alt="Product sketch"
                onError={() => handleImageError('sketch')}
                onLoad={() => handleImageLoad('sketch')}
              />
            ) : (
              <div className="w-full h-[300px] bg-gray-300 rounded-xl flex items-center justify-center">
                <span className="text-gray-500">ไม่มีภาพร่าง</span>
              </div>
            )}
          </div>
        </div>


      </div>
    </>
  );
}