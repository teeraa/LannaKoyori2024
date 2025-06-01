"use client"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { IoIosArrowDown } from "react-icons/io"
import { HiPhone } from "react-icons/hi2"
import { BiSolidCalendar } from "react-icons/bi"
import { BsTools } from "react-icons/bs"
import { HiLocationMarker } from "react-icons/hi"
import { PiGenderIntersexFill } from "react-icons/pi"

interface MemberDetailProps {
  member: any
  isLoading: boolean
  roleThai?: string
}

export default function MemberDetail({ member, isLoading, roleThai }: MemberDetailProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({})
  const [imageLoading, setImageLoading] = useState<{ [key: string]: boolean }>({
    banner: true,
    profile: true,
  })
  const [isSticky, setIsSticky] = useState(false)
  const memberCardRef = useRef<HTMLDivElement>(null)
  const stickyTriggerRef = useRef<HTMLDivElement>(null)

  const MemberInfo = roleThai === "ครูช่าง" ? "เกี่ยวกับผู้ประกอบการ" : "เกี่ยวกับผู้เชี่ยวชาญ"
  const checkLongTextRef = useRef<HTMLParagraphElement>(null)
  const [ReadMoreButton, setReadMoreButton] = useState(false)

  const handleImageError = (imageKey: string) => {
    setImageErrors((prev) => ({ ...prev, [imageKey]: true }))
    setImageLoading((prev) => ({ ...prev, [imageKey]: false }))
  }

  const handleImageLoad = (imageKey: string) => {
    setImageLoading((prev) => ({ ...prev, [imageKey]: false }))
  }

  // Sticky scroll handler
  useEffect(() => {
    const handleScroll = () => {
      // ตรวจสอบขนาดหน้าจอ - ทำงานเฉพาะ lg ขึ้นไป (1024px+)
      if (window.innerWidth < 1024) {
        setIsSticky(false)
        return
      }

      if (stickyTriggerRef.current) {
        const triggerRect = stickyTriggerRef.current.getBoundingClientRect()
        const navbarHeight = 80 // ความสูงของ navbar

        // เมื่อ trigger element เลื่อนผ่าน navbar แล้ว
        if (triggerRect.bottom <= navbarHeight) {
          setIsSticky(true)
        } else {
          setIsSticky(false)
        }
      }
    }

    const handleResize = () => {
      // เมื่อขนาดหน้าจอเปลี่ยน ให้ตรวจสอบใหม่
      if (window.innerWidth < 1024) {
        setIsSticky(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("resize", handleResize)
    
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  useEffect(() => {
    if (!isLoading && member && checkLongTextRef.current) {
      const pElement = checkLongTextRef.current
      const styles = window.getComputedStyle(pElement)
      const lineHeightStyle = styles.lineHeight
      const fontSizeStyle = styles.fontSize
      let lineHeightPx: number

      if (lineHeightStyle === "normal") {
        lineHeightPx = Number.parseFloat(fontSizeStyle) * 1.625
      } else {
        lineHeightPx = Number.parseFloat(lineHeightStyle)
      }

      if (pElement.scrollHeight > 0 && lineHeightPx > 0) {
        const numberOfLines = pElement.scrollHeight / lineHeightPx
        setReadMoreButton(numberOfLines > 5)
      } else {
        setReadMoreButton(false)
      }
    } else {
      setReadMoreButton(false)
    }
  }, [isLoading, member])

  const shouldShowImage = !isLoading && member
  const memberData = isLoading ? null : member

  return (
    <>
      {/* cover */}
      <div className="bg-gray-200 w-full h-[180px] sm:h-[220px] md:h-[280px] lg:h-[320px] overflow-hidden relative rounded-b-md">
        {isLoading ? (
          <div className="w-full h-full bg-gray-300 animate-pulse"></div>
        ) : imageErrors["banner"] ? (
          <div className="relative w-full h-screen">
            <div className="absolute top-2 right-2 w-24 h-12 md:w-48 md:h-24">
              <Image
                src="/images/korori-logo.png"
                alt="Logo"
                fill
                priority
                quality={90}
                style={{ objectFit: "contain" }}
              />
            </div>
          </div>
        ) : (
          <Image
            src={`/images/entreprenuer/Koyori_${memberData?.businessinfo?.DataYear || ""}/${memberData?.businessinfo?.BussinessNameEng?.replace(/\s+/g, "") || ""}/banner/${memberData?.businessinfo?.picture || ""}`}
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
            onLoad={() => handleImageLoad("banner")}
          />
        )}
      </div>

      {/* Sticky trigger point */}
      <div ref={stickyTriggerRef} className="h-0"></div>

      {/* Member info card */}
      <div className="py-4 px-0 relative">
        <div
          ref={memberCardRef}
          className={`bg-white/75 flex flex-col sm:flex-row gap-4 p-4 sm:p-6 rounded-md border border-gray-100 backdrop-blur-sm transition-all duration-300 ${
            isSticky ? "lg:fixed lg:top-20 lg:z-30 lg:shadow-lg lg:left-0 lg:right-0 " : "relative z-10"
          }`}
        >
          <div className="flex-shrink-0 flex justify-center sm:justify-start">
            <div
              className={`relative w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] md:w-[160px] md:h-[160px] lg:w-[180px] lg:h-[180px] -mt-12 sm:-mt-16 transition-all duration-300 ${isSticky ? "lg:-mt-0" : "lg:-mt-28"}`}
            >
              {isLoading ? (
                <div className="w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-md border-4 sm:border-6 border-white relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                </div>
              ) : imageErrors["profile"] ? (
                <div className="w-full h-full bg-gray-400 rounded-md border-4 sm:border-6 border-white flex items-center justify-center">
                  <span className="text-white text-xs sm:text-sm">ไม่มีภาพ</span>
                </div>
              ) : (
                <div className="relative w-full h-full">
                  {imageLoading.profile && shouldShowImage && (
                    <div className="absolute inset-0  w-full h-full bg-gray-300 animate-pulse rounded-md border-4 sm:border-6 border-white z-10"></div>
                  )}
                  <Image
                    src={`/images/entreprenuer/Koyori_${memberData?.businessinfo?.DataYear || ""}/${memberData?.businessinfo?.BussinessNameEng?.replace(/\s+/g, "") || ""}/Profile/${memberData?.picture || ""}`}
                    className="rounded-lg border-4 sm:border-6 border-white"
                    layout="fill"
                    objectFit="cover"
                    alt={memberData?.NameThai || ""}
                    onError={() => handleImageError("profile")}
                    onLoad={() => handleImageLoad("profile")}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-start items-center sm:items-start">
            <div className="text-center sm:text-left">
              {isLoading ? (
                <div className="space-y-3 w-full">
                  <div className="h-7 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-md relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                  </div>
                  <div className="h-5 w-3/4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded-md relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-[24px] sm:text-2xl lg:text-2xl font-bold text-blue-950 text-wrap">
                    {memberData?.NameThai}
                  </h1>
                  <h2 className="text-[20px] text-gray-700 text-wrap mb-2">{memberData?.NameEng}</h2>
                </>
              )}
            </div>

            <div className="w-full">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 text-gray-500 text-[14px]">
                {isLoading ? (
                  <div className="space-y-3 sm:space-y-0 sm:flex sm:gap-6">
                    {[1, 2, 3, 4].map((index) => (
                      <div key={index} className="flex items-center gap-2 my-1 sm:my-0">
                        <div className="w-4 h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                        </div>
                        <div className="h-4 w-16 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    {[
                      { icon: <BsTools size={16} />, value: memberData?.RoleThai },
                      { icon: <HiPhone size={16} />, value: memberData?.Contact },
                      { icon: <BiSolidCalendar size={16} />, value: memberData?.Year },
                      { icon: <PiGenderIntersexFill size={16} />, value: memberData?.gender },
                    ].map(({ icon, value }, index) => (
                      <div key={index} className="flex items-center gap-2 my-1 sm:my-0">
                        {value ? (
                          <>
                            <span className="text-gray-600 w-6 md:w-4 flex justify-start">{icon}</span>
                            <span className="text-gray-500">{value}</span>
                          </>
                        ) : null}
                      </div>
                    ))}
                  </>
                )}
              </div>
              {isLoading ? (
                <div className="flex items-start gap-2 pt-2">
                  <div className="w-4 h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded mt-1 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                  </div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                    </div>
                    <div className="h-4 w-2/3 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2 text-gray-500 text-[14px] pt-2">
                  <span className="text-gray-600 w-4 flex justify-start mt-1">
                    <HiLocationMarker size={16} />
                  </span>
                  <span>{memberData?.businessinfo.AddressThai}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Spacer เมื่อ sticky เพื่อไม่ให้เนื้อหาข้างล่างกระโดด */}
        {isSticky && <div className="hidden lg:block h-[200px] sm:h-[220px] md:h-[240px] lg:h-[260px]"></div>}
      </div>

      {/* Content sections */}
      <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-5 gap-4 ">
        <div className="col-span-1 md:col-span-2 mt-4 space-y-4">
          <div className="border border-gray-100 rounded-md p-4 bg-gradient-to-t from-white to-white/75 z-10 relative overflow-hidden">
            <div className="mb-4">
              {isLoading ? (
                <div className="h-[36px] bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded relative overflow-hidden pb-4" />
              ) : (
                <h1 className="text-[24px] font-bold  text-blue-950">{MemberInfo}</h1>
              )}
            </div>
            {isLoading ? (
              <div className="space-y-4">
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5, 6].map((index) => (
                    <div
                      key={index}
                      className={`h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded relative overflow-hidden ${
                        index === 4 ? "w-3/4" : index === 6 ? "w-5/6" : "w-full"
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  {[1, 2, 3].map((index) => (
                    <div
                      key={index}
                      className={`h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse rounded relative overflow-hidden ${
                        index === 2 ? "w-4/5" : "w-full"
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div
                className={`transition-all duration-700 ease-in-out overflow-hidden relative ${
                  isExpanded ? "max-h-none" : ReadMoreButton ? "max-h-36" : "max-h-none"
                } opacity-100`}
              >
                <div
                  className={`transition-opacity duration-500 ease-in-out ${showContent ? "opacity-100" : "opacity-100"}`}
                >
                  <p ref={checkLongTextRef} className="text-[16px] font-light text-gray-400 leading-relaxed">
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Neque quaerat ex expedita perspiciatis,
                    aliquam rem cumque doloribus aliquid fugit ipsam omnis perferendis quae, eveniet ut! Voluptate
                    repudiandae odio quaerat error eligendi distinctio iure eos? Laudantium consequuntur molestias
                    impedit possimus, sed, ea quos repellendus saepe reprehenderit perferendis corporis obcaecati!
                    Soluta perspiciatis esse distinctio ipsa harum quos labore voluptate consequuntur qui doloribus
                    impedit magnam atque temporibus explicabo alias cupiditate id consectetur mollitia ab necessitatibus
                    culpa, porro, facere itaque. Earum culpa vero voluptate tempora laudantium, quisquam, asperiores
                    deleniti obcaecati reiciendis molestias explicabo autem saepe delectus praesentium consequuntur?
                    Suscipit voluptas, deleniti vel aperiam debitis tempora eos alias esse. Est quasi quis eligendi
                    ducimus similique iste illum aliquam. Debitis soluta vero, incidunt dolorem rerum accusamus
                    laboriosam labore quasi quod neque tenetur obcaecati earum? Sit quasi corporis harum, assumenda rem
                    perferendis eum dolorum voluptas ad, doloremque quis dolorem iste, praesentium explicabo. Beatae,
                    quae dolor officia dolore ad voluptatem esse repellendus voluptas, fuga, facilis accusantium illo.
                    Ipsum quam assumenda ratione optio rerum, dignissimos accusantium rem incidunt modi asperiores,
                    architecto amet quaerat earum repellendus doloremque! Explicabo nobis, et dicta numquam autem iure
                    quos iusto veniam magnam cumque voluptas, ad quia voluptatibus delectus aut minima quae! Explicabo
                    voluptatum voluptas eligendi doloribus ratione, modi commodi placeat deleniti perferendis quasi iure
                    porro esse est exercitationem officiis quis soluta dolor rem iste, voluptatem consequatur eius, sed
                    nulla natus. Eligendi dignissimos dolores vel non, aut optio nihil adipisci facilis architecto
                    corporis quo laboriosam quae quisquam harum numquam modi illo earum accusamus sint consequuntur.
                  </p>
                </div>

                {!isExpanded && ReadMoreButton && (
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white via-white/75 to-transparent pointer-events-none py-4"></div>
                )}
              </div>
            )}

            {!isLoading && ReadMoreButton && !isExpanded && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => {
                    setShowContent(true)
                    setTimeout(() => {
                      setIsExpanded(true)
                    }, 100)
                  }}
                  className="group relative bg-blue-950 text-white px-6 py-2 rounded-full shadow-md flex items-center gap-2 font-medium"
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
        <div className="col-span-1 md:col-span-3 mt-4 space-y-4">
          <div className="border border-gray-100 rounded-md p-4 bg-gradient-to-t from-white to-white/75 z-10 relative overflow-hidden">
            <h1 className="text-[24px] font-bold mb-4 text-blue-950">เกี่ยวกับผู้ประกอบการ</h1>
          </div>
        </div>
      </div>
    </>
  )
}