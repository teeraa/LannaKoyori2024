"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { VscTools } from "react-icons/vsc";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import type { ConsultantInfo } from "./_client";
import { ConsultDetailSkeleton } from "./Skeleton";

interface ConsultDetailProps {
  consults: ConsultantInfo[];
  isLoading: boolean;
  isValidUrl(str: string): boolean;
}

export default function ConsultDetail({ consults, isLoading, isValidUrl }: ConsultDetailProps) {
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});

  const handleImageError = (consultId: number) => {
    setImageErrors(prev => ({ ...prev, [consultId]: true }));
  };

  const placeholderSrc = "/placeholder.svg?width=200&height=200";
  const blurSrc = "/placeholder.svg?width=20&height=20";
  const shouldUseSwiper = consults && consults.length > 6;
  const hasConsults = consults && consults.length > 0;

 
//   return (
//   <div className="relative">
//     {isLoading ? (
//       <ConsultDetailSkeleton />
//     ) : (
//       <>
//         <div className="flex items-center my-4">
//           <hr className="border-t-4 border-gray-600 flex-grow"></hr>
//           <h1 className="text-blue-950 text-[24px] ms-4">
//             ผู้ที่เกี่ยวข้อง
//           </h1>
//         </div>
//         {/* Rest of the existing content */}
//         <div className={`transition-opacity duration-500 ease-in-out ${isLoading ? "opacity-0" : "opacity-100"}`}>
//           {/* Existing content inside the transition-opacity div */}
//         </div>
//       </>
//     )}
//     <div className="custom-pagination flex justify-center mt-4"></div>
//   </div>
// );


  return (
    <div className="relative">
    {isLoading ? (
      <ConsultDetailSkeleton />
    ) : (
      <>
        <div className="flex items-center my-4">
          <hr className="border-t-4 border-gray-600 flex-grow"></hr>
          <h1 className="text-blue-950 text-[24px] ms-4">
            ผู้ที่เกี่ยวข้อง
          </h1>
        </div>

      <div className="relative">
        <div className={`transition-opacity duration-500 ease-in-out ${isLoading ? "opacity-0" : "opacity-100"}`}>
          {!hasConsults ? (
            <div className="flex justify-center py-8 w-full min-h-[300px] items-center">
              <p className="text-blue-950 text-[24px]">ไม่มีข้อมูลที่ปรึกษาที่จะแสดง</p>
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
                      return `<span class="${className}"></span>`;
                    }
                    return "";
                  },
                }}
                spaceBetween={15}
                slidesPerView={1}
                centeredSlides={true}
                slidesPerGroup={1}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                speed={1000}
                loop={consults.length > 6}
                breakpoints={{
                  0: {
                    slidesPerView: 1,
                    spaceBetween: 15,
                    centeredSlides: true,
                  },
                  480: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                    centeredSlides: true,
                  },
                  640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                    centeredSlides: false,
                  },
                  768: {
                    slidesPerView: 3,
                    spaceBetween: 25,
                    centeredSlides: false,
                  },
                  1024: {
                    slidesPerView: 4,
                    spaceBetween: 30,
                    centeredSlides: false,
                  },
                  1280: {
                    slidesPerView: 5,
                    spaceBetween: 30,
                    centeredSlides: false,
                  },
                }}
                className="relative"
              >
                {consults.map((consult: ConsultantInfo) => (
                  <SwiperSlide className="my-4" key={consult.ID}>
                    <Link
                      href={`/members/${consult.ID}`}
                      prefetch={true}
                      className="flex justify-center w-full"
                    >
                      <div className="bg-white rounded-md hover:shadow-lg p-4 cursor-pointer shadow-md w-fit group block transition-shadow duration-300">
                        <div className="rounded-md bg-white w-full">
                          <div className="mx-auto w-[180px] md:w-full lg:w-full aspect-square max-w-[200px] overflow-hidden rounded-md">
                            {isValidUrl(consult.picture) && !imageErrors[consult.ID] ? (
                              <Image
                                src={consult.picture}
                                alt={consult.NameThai || consult.NameEng || "ไม่ระบุชื่อ"}
                                width={200}
                                height={200}
                                quality={90}
                                placeholder="blur"
                                blurDataURL={blurSrc}
                                priority={true}
                                className="rounded-md transition-transform duration-300 group-hover:scale-110 origin-center w-full h-full object-cover"
                                onError={() => handleImageError(consult.ID)}
                              />
                            ) : (
                              <Image
                                src={placeholderSrc}
                                alt="Placeholder"
                                width={200}
                                height={200}
                                quality={90}
                                placeholder="blur"
                                blurDataURL={blurSrc}
                                priority={true}
                                className="rounded-md w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="mt-2 w-full">
                            <h1 className="text-xl text-start text-gray-600 truncate w-full">
                              {consult.NameThai || consult.NameEng || "ไม่ระบุชื่อ"}
                            </h1>
                            <h2 className="text-md text-start text-gray-400 flex justify-start items-center gap-2 truncate w-full font-light">
                              <VscTools size={16} aria-hidden="true" />
                              {consult.RoleThai || "ไม่ระบุบทบาท"}
                            </h2>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          ) : (
            <div className="show-member h-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 items-center gap-8 md:gap-4 mb-4 place-content-center">
              {consults.map((consult: ConsultantInfo) => (
                <Link
                  key={consult.ID}
                  href={`/members/${consult.ID}`}
                  prefetch={true}
                  className="bg-white rounded-md hover:shadow-lg p-4 cursor-pointer shadow-md w-full group block transition-shadow duration-300"
                >
                  <div className="rounded-md bg-white w-full">
                    <div className="mx-auto w-full aspect-square max-w-[200px] overflow-hidden rounded-md">
                      {isValidUrl(consult.picture) && !imageErrors[consult.ID] ? (
                        <Image
                          src={consult.picture}
                          alt={consult.NameThai || consult.NameEng || "ไม่ระบุชื่อ"}
                          width={200}
                          height={200}
                          quality={90}
                          placeholder="blur"
                          blurDataURL={blurSrc}
                          priority={true}
                          className="rounded-md transition-transform duration-300 group-hover:scale-110 origin-center w-full h-full object-cover"
                          onError={() => handleImageError(consult.ID)}
                        />
                      ) : (
                        <Image
                          src={placeholderSrc}
                          alt="Placeholder"
                          width={200}
                          height={200}
                          quality={90}
                          placeholder="blur"
                          blurDataURL={blurSrc}
                          priority={true}
                          className="rounded-md w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="mt-2 w-full">
                      <h1 className="text-xl text-start text-gray-600 truncate w-full">
                        {consult.NameThai || consult.NameEng || "ไม่ระบุชื่อ"}
                      </h1>
                      <h2 className="text-md text-start text-gray-400 flex justify-start items-center gap-2 truncate w-full font-light">
                        <VscTools size={16} aria-hidden="true" />
                        {consult.RoleThai || "ไม่ระบุบทบาท"}
                      </h2>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      </>
       )}
      <div className="custom-pagination flex justify-center mt-4"></div>
    </div>
  );
}