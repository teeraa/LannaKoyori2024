"use client"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/pagination"
import { Pagination, Autoplay } from "swiper/modules"
import type { Product } from "./_client"
import { ProductSkeletonGrid, ProductSkeletonSwiper, HeaderSkeleton } from "./Skeleton"
import { AiOutlineShoppingCart } from "react-icons/ai"
import { IoStorefrontOutline } from "react-icons/io5"

interface OwnerProductProps {
  products: Product[]
  isLoading?: boolean
  roleThai?: string
}

const ProductCard = ({ product, onClick }: { product: Product; onClick?: () => void }) => {
  const [imageError, setImageError] = useState(false)

  const handleImageError = () => {
    setImageError(true)
  }

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
      onClick={onClick}
    >
      <div className="rounded-md bg-white w-full">
        <div className="mx-auto w-[180px] md:w-full lg:w-full aspect-square max-w-[200px] overflow-hidden rounded-md">
          {imageError ? (
            <div className="w-full h-full bg-gray-400 rounded-md flex items-center justify-center">
              <span className="text-white text-xs text-center">ไม่มีภาพ</span>
            </div>
          ) : (
            <Image
              src={isValidUrl(product?.image) ? product?.image : "/"}
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
              {product?.productName || "สินค้า"}
            </h1>
            <div className="text-[12px] text-blue-500 bg-blue-100 px-2 py-[1px] rounded-[4px] truncate w-fit text-center min-w-[40px]">
              {product?.materialMain.Material || "ไม่ระบุวัสดุ"}
            </div>
          </div>

          <div className="flex items-center w-full">
            <IoStorefrontOutline size={20} className="text-gray-400 mr-2" />
            <div className="flex items-center justify-end w-full  border-l border-gray-300">
              <p className="text-[14px] text-gray-400 m-0 text-end truncate max-w-[135px]">
                {product?.BussinessName || "ไม่ระบุ"}
              </p>
            </div>
          </div>

          <div className="flex items-center w-full">
            <AiOutlineShoppingCart size={20} className="text-gray-400 mr-2" />
            <div className="flex items-center w-full border-l border-gray-300">
              {product?.price && Number(product.price) > 0 ? (
                <p className="w-full text-[14px] text-green-600 text-end m-0">
                  {Number(product.price).toLocaleString("th-TH")} บาท
                </p>
              ) : (
                <p className="w-full text-[14px] text-red-500 text-end m-0">สินค้าหมด</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function OwnerProduct({ roleThai, products, isLoading = false }: OwnerProductProps) {
  const ProductInfo = roleThai === "ครูช่าง" ? "ผลิตภัณฑ์ผู้ประกอบการ" : `ผลิตภัณฑ์ที่ผู้เชี่ยวชาญเกี่ยวข้อง`
  const shouldUseSwiper = products && products.length > 6
  const hasProducts = products && products.length > 0

  return (
    <div className="relative">
      {isLoading ? (
        <HeaderSkeleton />
      ) : (
        <div
          className="flex items-center
"
        >
          <hr className="border-t-4 border-gray-600 flex-grow"></hr>
          <h1 className="text-[24px] font-bold md:ms-4 lg:ms-4 ms-4 text-blue-950">{ProductInfo}</h1>
        </div>
      )}

      <div className="relative">
        <div
          className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
            isLoading ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
          }`}
        >
          {shouldUseSwiper ? <ProductSkeletonSwiper /> : <ProductSkeletonGrid />}
        </div>

        <div className={`transition-opacity duration-500 ease-in-out ${isLoading ? "opacity-0" : "opacity-100"}`}>
          {!hasProducts ? (
            <div className="flex justify-center py-8 w-full min-h-[300px] items-center">
              <p className="text-gray-500 text-lg">ไม่มีสินค้าที่จะแสดง</p>
            </div>
          ) : shouldUseSwiper ? (
            <div className="mb-4">
              <Swiper
                modules={[Pagination, Autoplay]}
                pagination={{
                  clickable: true,
                  el: ".custom-pagination",
                  dynamicBullets: false,
                  renderBullet: (index, className) => {
                    if (index < 6) {
                      return `<span class="${className}"></span>`
                    }
                    return ""
                  },
                }}
                spaceBetween={30}
                slidesPerView={3}
                centeredSlides={true}
                slidesPerGroup={1}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                speed={1000}
                loop={products.length > 6}
                breakpoints={{
                  0: {
                    slidesPerView: "auto", // Use 'auto'
                    spaceBetween: 15,
                    centeredSlides: true,
                  },
                  480: {
                    slidesPerView: "auto", // Use 'auto'
                    spaceBetween: 20,
                    centeredSlides: true,
                  },
                  // Keep other breakpoints as they are, or adjust if needed
                  640: { slidesPerView: 2, spaceBetween: 20, centeredSlides: false }, // Example: turn off centering for larger views
                  768: { slidesPerView: 3, spaceBetween: 25, centeredSlides: false },
                  1024: { slidesPerView: 4, spaceBetween: 30, centeredSlides: false },
                  1280: { slidesPerView: 5, spaceBetween: 30, centeredSlides: false },
                  1536: { slidesPerView: 6, spaceBetween: 30, centeredSlides: false },
                }}
                className="relative"
              >
                {products.map((productItem: Product) => (
                  <SwiperSlide className="my-4" key={productItem.ID}>
                    <Link href={`/products/${productItem.ID}`} className="w-full flex justify-center">
                      <ProductCard product={productItem} />
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ) : (
            <div className="">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6">
                {products.map((productItem: Product) => (
                  <div className="my-4" key={productItem.ID}>
                    <Link href={`/products/${productItem.ID}`} className="flex justify-center w-full">
                      <ProductCard product={productItem} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="custom-pagination flex justify-center mt-4"></div>
    </div>
  )
}
