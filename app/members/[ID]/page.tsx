"use client"
import Image from "next/image"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import Footer from "@/app/components/footer"
import { IoIosArrowDown } from "react-icons/io"
// swiper slide
import { Swiper, SwiperSlide } from "swiper/react"
import "swiper/css"
import "swiper/css/pagination"
import { Pagination, Autoplay } from "swiper/modules"
import Skeleton from "./skeleton_loading"

import axios from "axios"

export default function MemberDetail() {
  const pathname = usePathname()
  const params = useParams()
  const ID = Number.parseInt(params.ID as string)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [members, setMembers] = useState<any>([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({})

  const handleImageError = (imageKey: string) => {
    setImageErrors((prev) => ({ ...prev, [imageKey]: true }))
  }

  // หา member ที่ ID ตรงกัน
  const member = members.flat().find((m: any) => m.ID === ID)
  const businessID = member?.businessinfo?.ID

  const fetchMembers = async (id: number) => {
    try {
      // เรียก API ด้วย Axios
      const response = await axios.get(`/api/members/${id}`)
      setMembers(response.data)
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to fetch members")
    } finally {
      setIsLoading(false)
    }
  }
  const fetchProducts = async (id: number | null = null) => {
    try {
      const params: Record<string, any> = {}
      if (id) params.businessID = id

      const response = await axios.get("/api/productByBus", { params })
      setFilteredProducts(response.data)
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to fetch products")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setIsLoading(true)
    fetchMembers(ID) // ดึงข้อมูลทั้งหมดเมื่อโหลดหน้าเว็บ
  }, [ID])

  useEffect(() => {
    if (businessID) {
      fetchProducts(businessID)
    }
  }, [businessID])

  if (isLoading) {
    return <Skeleton />
  }

  if (!member) {
    return <div className="container">ไม่พบข้อมูลสมาชิก</div>
  }

  return (
    <>
      <div className="container pb-10 px-4 sm:px-6 lg:px-8">
        <div className="fixed inset-0 z-0 flex justify-start items-start top-40">
          <div className="w-10/12 h-40 md:h-96 bg-gradient-to-tr from-cyan-500 via-blue-300 to-green-500 rounded-[60%] blur-3xl opacity-30 transform scale-110 rotate-[20deg] md:rotate-[20deg]"></div>
        </div>
        <div className="fixed inset-0 z-0 flex justify-end items-end bottom-0">
          <div className="w-96 h-96 md:h-96 bg-gradient-to-tr from-cyan-500 via-blue-300 to-red-500 rounded-[60%] blur-3xl opacity-30 transform scale-80 rotate-[0deg] md:rotate-[140deg]"></div>
        </div>
        <main className=" pt-12 md:pt-[68px]">
          <div className="bg-red-200 w-full h-[180px] sm:h-[220px] md:h-[280px] lg:h-[320px] overflow-hidden relative rounded-b-md">
            {imageErrors["banner"] ? (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center">
              </div>
            ) : (
              <Image
                src={`/images/entreprenuer/Koyori_${member.businessinfo?.DataYear || ""}/${member.businessinfo?.BussinessNameEng?.replace(/\s+/g, "") || ""}/banner/${member.businessinfo?.picture || ""}`}
                layout="fill"
                alt=""
                priority={true}
                quality={90}
                style={{
                  objectFit: "cover",
                  objectPosition: "top",
                  width: "100%",
                  height: "100%",
                }}
                onError={() => handleImageError("banner")}
              />
            )}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 md:gap-6 p-4 lg:px-0">
            <div className="xl:col-span-1 flex flex-col sm:flex-row xl:flex-col items-center justify-center p-4 sm:p-6 bg-white/75 rounded-md z-10 border border-gray-100">
              <div className="flex flex-col items-center sm:items-start xl:items-center sm:mr-6 xl:mr-0">
                <div className="relative w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] md:w-[160px] md:h-[160px] lg:w-[180px] lg:h-[180px] xl:w-[200px] xl:h-[200px] -mt-12 sm:-mt-16 lg:-mt-20 xl:-mt-24">
                  {imageErrors["profile"] ? (
                    <div className="w-full h-full bg-gray-400 rounded-full border-4 sm:border-6 border-white flex items-center justify-center">
                      <span className="text-white text-xs sm:text-sm">ไม่มีภาพ</span>
                    </div>
                  ) : (
                    <Image
                      src={`/images/entreprenuer/Koyori_${member.businessinfo?.DataYear || ""}/${member.businessinfo?.BussinessNameEng?.replace(/\s+/g, "") || ""}/Profile/${member.picture || ""}`}
                      className="rounded-full border-4 sm:border-6 border-white"
                      layout="fill"
                      objectFit="cover"
                      alt={member.NameThai}
                      onError={() => handleImageError("profile")}
                    />
                  )}
                </div>
                <div className="text-center sm:text-left xl:text-center mt-4">
                  <h1 className="text-xl sm:text-2xl lg:text-2xl font-bold text-gray-600 text-wrap">
                    {member.NameThai}
                  </h1>
                  <h2 className="text-base sm:text-lg text-gray-400 text-wrap">({member.NameEng})</h2>
                </div>
              </div>
              <div className="mt-4 sm:mt-0 xl:mt-6 w-full sm:flex-1 xl:flex-none">
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_2fr] xl:grid-cols-[1fr_2fr] gap-2 text-sm lg:text-base text-gray-600">
                  <div className="font-semibold text-gray-500">เบอร์โทรศัพท์</div>
                  <div className="text-gray-400 text-wrap mb-2 sm:mb-0">{member.Contact}</div>
                  <div className="font-semibold text-gray-500">ตำแหน่ง</div>
                  <div className="text-gray-400 text-wrap mb-2 sm:mb-0">{member.RoleThai}</div>
                  <div className="font-semibold text-gray-500">ปี</div>
                  <div className="text-gray-400 text-wrap mb-2 sm:mb-0">{member.Year}</div>
                  <div className="font-semibold text-gray-500">เพศ</div>
                  <div className="text-gray-400 text-wrap">{member.gender}</div>
                </div>
              </div>
            </div>
            <div className="xl:col-span-3 space-y-4">
              <div className="border border-gray-100 rounded-md p-4 bg-gradient-to-t from-white to-white/75 z-10 relative overflow-hidden">
                <h1 className="text-2xl font-bold mb-4 text-gray-600">เกี่ยวกับผู้ประกอบการ</h1>
                <div
                  className={`transition-all duration-700 ease-in-out ${
                    isExpanded ? "max-h-none opacity-100" : "max-h-36 opacity-100"
                  } overflow-hidden relative`}
                >
                  <div
                    className={`transition-opacity duration-500 ease-in-out ${
                      showContent ? "opacity-100" : "opacity-100"
                    }`}
                  >
                    <p className="text-lg text-gray-400 leading-relaxed">
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit. Neque quaerat ex expedita perspiciatis,
                      aliquam rem cumque doloribus aliquid fugit ipsam omnis perferendis quae, eveniet ut! Voluptate
                      repudiandae odio quaerat error eligendi distinctio iure eos? Laudantium consequuntur molestias
                      impedit possimus, sed, ea quos repellendus saepe reprehenderit perferendis corporis obcaecati!
                      Soluta perspiciatis esse distinctio ipsa harum quos labore voluptate consequuntur qui doloribus
                      impedit magnam atque temporibus explicabo alias cupiditate id consectetur mollitia ab
                      necessitatibus culpa, porro, facere itaque. Earum culpa vero voluptate tempora laudantium,
                      quisquam, asperiores deleniti obcaecati reiciendis molestias explicabo autem saepe delectus
                      praesentium consequuntur? Suscipit voluptas, deleniti vel aperiam debitis tempora eos alias esse.
                      Est quasi quis eligendi ducimus similique iste illum aliquam. Debitis soluta vero, incidunt
                      dolorem rerum accusamus laboriosam labore quasi quod neque tenetur obcaecati earum? Sit quasi
                      corporis harum, assumenda rem perferendis eum dolorum voluptas ad, doloremque quis dolorem iste,
                      praesentium explicabo. Beatae, quae dolor officia dolore ad voluptatem esse repellendus voluptas,
                      fuga, facilis accusantium illo. Ipsum quam assumenda ratione optio rerum, dignissimos accusantium
                      rem incidunt modi asperiores, architecto amet quaerat earum repellendus doloremque! Explicabo
                      nobis, et dicta numquam autem iure quos iusto veniam magnam cumque voluptas, ad quia voluptatibus
                      delectus aut minima quae! Explicabo voluptatum voluptas eligendi doloribus ratione, modi commodi
                      placeat deleniti perferendis quasi iure porro esse est exercitationem officiis quis soluta dolor
                      rem iste, voluptatem consequatur eius, sed nulla natus. Eligendi dignissimos dolores vel non, aut
                      optio nihil adipisci facilis architecto corporis quo laboriosam quae quisquam harum numquam modi
                      illo earum accusamus sint consequuntur.
                    </p>
                  </div>

                  {!isExpanded && (
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white/75 to-transparent pointer-events-none py-4"></div>
                  )}
                </div>

                {!isExpanded && (
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={() => {
                        setShowContent(true)
                        setTimeout(() => {
                          setIsExpanded(true)
                        }, 100)
                      }}
                      className="group relative bg-blue-950 text-white px-6 py-2 rounded-full shadow-md  flex items-center gap-2 font-medium"
                    >
                      <span className="transition-all duration-300">อ่านต่อ</span>
                      <div className="transform transition-transform duration-300">
                        <IoIosArrowDown className="w-5 h-5" />
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="flex items-center my-4">
              <hr className="border-t-4 border-gray-600 flex-grow"></hr>
              <h1 className="text-3xl md:text-3xl lg:text-5xl font-bold md:ms-4 lg:ms-4 ms-4 text-gray-600 ">
                สินค้าผู้ประกอบการ
              </h1>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-between gap-4 py-4">
              {filteredProducts.length > 6 ? (
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
                    480: { slidesPerView: 2, spaceBetween: 20 },
                    640: { slidesPerView: 2, spaceBetween: 20 },
                    768: { slidesPerView: 3, spaceBetween: 25 },
                    1024: { slidesPerView: 4, spaceBetween: 30 },
                    1280: { slidesPerView: 5, spaceBetween: 30 },
                    1536: { slidesPerView: 6, spaceBetween: 30 },
                  }}
                  className="relative"
                >
                  {filteredProducts.map((product: any) => (
                    <SwiperSlide className="my-4 flex justify-center" key={product.ID}>
                      <Link
                        key={product.ID}
                        href={`/products/${product.ID}`}
                        className="cursor-pointer flex justify-center w-full"
                      >
                        {imageErrors[`product-${product.ID}`] ? (
                          <div className="w-[150px] h-[150px] bg-gray-400 rounded-md flex items-center justify-center shadow-md">
                            <span className="text-white text-xs text-center">ไม่มีภาพ</span>
                          </div>
                        ) : (
                          <Image
                            src={`/images/entreprenuer/Koyori_${product.businessinfo?.DataYear || ""}/${product.businessinfo?.BussinessNameEng?.replace(/\s+/g, "") || ""}/Product/${product.productName?.replace(/\s+/g, "") || ""}/${product.image || ""}`}
                            width={150}
                            height={150}
                            alt="models"
                            className="rounded-md hover:shadow-md border-3 border-white shadow-md hover:border-2"
                            onError={() => handleImageError(`product-${product.ID}`)}
                          />
                        )}
                      </Link>
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
                  {filteredProducts.map((product: any) => (
                    <Link
                      key={product.ID}
                      href={`/products/${product.ID}`}
                      className="cursor-pointer flex justify-center w-full"
                    >
                      {imageErrors[`product-${product.ID}`] ? (
                        <div className="w-full max-w-[150px] aspect-square bg-gray-400 rounded-md flex items-center justify-center shadow-md">
                          <span className="text-white text-xs text-center">ไม่มีภาพ</span>
                        </div>
                      ) : (
                        <Image
                          src={`/images/entreprenuer/Koyori_${product.businessinfo?.DataYear || ""}/${product.businessinfo?.BussinessNameEng?.replace(/\s+/g, "") || ""}/Product/${product.productName?.replace(/\s+/g, "") || ""}/${product.image || ""}`}
                          width={150}
                          height={150}
                          alt="models"
                          className="w-full max-w-[150px] aspect-square object-cover rounded-md hover:shadow-md border-3 border-white shadow-md hover:border-2 transition-all duration-200"
                          onError={() => handleImageError(`product-${product.ID}`)}
                        />
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <div className="custom-pagination absolute bottom-0 left-0 right-0 flex justify-center mt-4"></div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  )
}