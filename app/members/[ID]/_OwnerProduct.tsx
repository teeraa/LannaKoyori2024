"use client"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/pagination"
import { Pagination, Autoplay } from "swiper/modules"
import type { Product } from "@/app/types/page"
import { GrLocation } from "react-icons/gr"
import { ProductSkeleton, ProductSkeletonGrid, ProductSkeletonSwiper, HeaderSkeleton } from './Skeleton'
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

  return (
    <div className="bg-white rounded-md hover:shadow-lg p-4 cursor-pointer shadow-md group w-fit md:w-full lg:w-full" onClick={onClick}>
      <div className="rounded-md bg-white w-full">
        <div className="mx-auto w-full aspect-square max-w-[200px] overflow-hidden rounded-md">
          {imageError ? (
            <div className="w-full h-full bg-gray-400 rounded-md flex items-center justify-center">
              <span className="text-white text-xs text-center">ไม่มีภาพ</span>
            </div>
          ) : (
            <Image
              src={`/images/entreprenuer/Koyori_${product.businessinfo?.DataYear || ""}/${product.businessinfo?.BussinessNameEng?.replace(/\s+/g, "") || ""}/Product/${product.productName?.replace(/\s+/g, "") || ""}/${product.image || "/images/default.png"}`}
              alt={product?.productName || "สินค้า"}
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
          <div className="mt-2 w-full">
            <h1 className="text-[20px] text-start text-gray-600 truncate max-w-[200px]">{product?.productName || "สินค้า"}</h1>
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            <GrLocation className="w-4 h-4 mr-1" />
            <span className="truncate">{product?.businessinfo?.ProvinceT || "ไม่ระบุ"}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {[product?.materialMain?.Material, product?.materialSub1?.Material, product?.materialSub2?.Material]
              .filter(Boolean)
              .slice(0, 3)
              .map((material, index) => (
                <span key={index} className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full">
                  {material}
                </span>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}


export default function OwnerProduct({ roleThai, products, isLoading = false }: OwnerProductProps) {
  const ProductInfo = roleThai === "ครูช่าง" ? "ผลิตภัณฑ์ผู้ประกอบการ" : "ผลิตภัณฑ์ที่เกี่ยวข้อง"
  // ตรวจสอบว่าควรใช้ Swiper หรือ Grid
  const shouldUseSwiper = products && products.length > 6
  const hasProducts = products && products.length > 0

  return (
    <div className="relative">
      {isLoading ? (
        <HeaderSkeleton />
      ) : (
        <div className="flex items-center mb-4">
          <hr className="border-t-4 border-gray-600 flex-grow"></hr>
          <h1 className="text-[24px] font-bold md:ms-4 lg:ms-4 ms-4 text-blue-950">{ProductInfo}</h1>
        </div>
      )}

      <div className="relative min-h-[300px]">
        <div
          className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${isLoading ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
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
            // แสดง Swiper เมื่อมีสินค้ามากกว่า 6 ชิ้น
            <div className="py-4">
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
                slidesPerGroup={1}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                speed={1000}
                loop={true}
                breakpoints={{
                  0: { slidesPerView: 1, spaceBetween: 15 },
                  480: { slidesPerView: 1, spaceBetween: 20 },
                  640: { slidesPerView: 2, spaceBetween: 20 },
                  768: { slidesPerView: 3, spaceBetween: 25 },
                  1024: { slidesPerView: 4, spaceBetween: 30 },
                  1280: { slidesPerView: 5, spaceBetween: 30 },
                  1536: { slidesPerView: 6, spaceBetween: 30 },
                }}
                className="relative"
              >
                {products.map((product: any) => (
                  <SwiperSlide className="my-4 flex justify-center" key={product.ID}>
                    <Link href={`/products/${product.ID}`} className="w-full max-w-[250px]">
                      <ProductCard product={product} />
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ) : (
            <div className="">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6">
                {products.map((product: any) => (
                  <Link key={product.ID} href={`/products/${product.ID}`} className="flex justify-center w-full ">
                    <ProductCard product={product} />
                  </Link>
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
