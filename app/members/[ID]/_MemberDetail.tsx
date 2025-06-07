"use client"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { IoIosArrowDown } from "react-icons/io"
import { HiPhone, HiLocationMarker, HiOutlineExternalLink } from "react-icons/hi"
import { FaCalendarAlt, FaGlobeAmericas, FaMapMarkedAlt } from "react-icons/fa"
import { BsTools } from "react-icons/bs"
import { PiGenderIntersexFill } from "react-icons/pi"
import { MdImageNotSupported } from "react-icons/md"
import Link from "next/link"
import type { Member } from "./_client"

interface MemberDetailProps {
  member?: Member | null
  isLoading: boolean
  roleThai?: string
}

export default function MemberDetail({ member, isLoading, roleThai }: MemberDetailProps) {
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({})
  const [imageLoadingStates, setImageLoadingStates] = useState<{ [key: string]: boolean }>({
    banner: true,
    profile: true,
    businessShopImage: true,
  })
  const MemberInfo = roleThai === "ครูช่าง" ? "ผู้ประกอบการ" : "ผู้เชี่ยวชาญ" // No longer needed here
  const prevMemberIdRef = useRef<number | string | undefined>()
  const prevProfilePictureNameRef = useRef<string | undefined>()
  const prevBannerSrcRef = useRef<string | undefined>()
  const prevShopImageSrcRef = useRef<string | undefined>()
  const prevShopImageKeyRef = useRef<string | undefined>()

  const [isThaiDescExpanded, setIsThaiDescExpanded] = useState(true)
  const [isJapanDescExpanded, setIsJapanDescExpanded] = useState(false)
  const [isEngDescExpanded, setIsEngDescExpanded] = useState(false)

  const handleImageError = (imageKey: string) => {
    setImageErrors((prev) => ({ ...prev, [imageKey]: true }))
    setImageLoadingStates((prev) => ({ ...prev, [imageKey]: false }))
  }

  const handleImageLoad = (imageKey: string) => {
    setImageErrors((prev) => ({ ...prev, [imageKey]: false }))
    setImageLoadingStates((prev) => ({ ...prev, [imageKey]: false }))
  }

  function isValidUrl(str: string) {
    try {
      new URL(str)
      return true
    } catch {
      return false
    }
  }

  const memberData = isLoading ? null : member

  const mainBannerImageSrc = isValidUrl(memberData?.memberBanner || "/") ? memberData?.memberBanner : "/"
  const profileImageSrc = isValidUrl(memberData?.memberpicture || "/") ? memberData?.memberpicture : "/"
  const storeProfileImageSrc = isValidUrl(memberData?.picture || "/") ? memberData?.picture : "/"
  const shopImageKey = memberData?.BusinessID
    ? `businessShopImage_${memberData.BusinessID}`
    : "businessShopImage_default"

  useEffect(() => {
    const currentMemberId = memberData?.memberID
    const currentProfilePictureName = memberData?.picture
    const currentBannerSrc = mainBannerImageSrc
    const currentShopImageSrc = storeProfileImageSrc
    const currentShopImageKey = memberData?.BusinessID
      ? `businessShopImage_${memberData.BusinessID}`
      : "businessShopImage_default"

    setImageLoadingStates((prevLoadingStates) => {
      const newLoadingStates = { ...prevLoadingStates }
      if (isLoading) {
        newLoadingStates.profile = true
        newLoadingStates.banner = true
        newLoadingStates[currentShopImageKey] = true
        setImageErrors({})
        return newLoadingStates
      }
      if (currentMemberId !== undefined) {
        if (currentProfilePictureName) {
          if (
            currentMemberId !== prevMemberIdRef.current ||
            currentProfilePictureName !== prevProfilePictureNameRef.current
          ) {
            newLoadingStates.profile = true
            setImageErrors((prev) => ({ ...prev, profile: false }))
          }
        } else {
          newLoadingStates.profile = false
        }
      } else {
        newLoadingStates.profile = false
      }
      if (currentMemberId !== undefined) {
        if (currentBannerSrc) {
          if (currentBannerSrc !== prevBannerSrcRef.current || currentMemberId !== prevMemberIdRef.current) {
            newLoadingStates.banner = true
            setImageErrors((prev) => ({ ...prev, banner: false }))
          }
        } else {
          newLoadingStates.banner = false
        }
      } else {
        newLoadingStates.banner = false
      }
      if (prevShopImageKeyRef.current && prevShopImageKeyRef.current !== currentShopImageKey) {
        newLoadingStates[prevShopImageKeyRef.current] = false
      }
      if (memberData?.BusinessID !== undefined) {
        if (currentShopImageSrc) {
          if (
            currentShopImageSrc !== prevShopImageSrcRef.current ||
            memberData.BusinessID.toString() !== prevMemberIdRef.current?.toString()
          ) {
            newLoadingStates[currentShopImageKey] = true
            setImageErrors((prev) => ({ ...prev, [currentShopImageKey]: false }))
          }
        } else {
          newLoadingStates[currentShopImageKey] = false
        }
      } else {
        newLoadingStates[currentShopImageKey] = false
      }
      return newLoadingStates
    })

    prevMemberIdRef.current = currentMemberId
    prevProfilePictureNameRef.current = currentProfilePictureName
    prevBannerSrcRef.current = currentBannerSrc
    prevShopImageSrcRef.current = currentShopImageSrc
    prevShopImageKeyRef.current = currentShopImageKey
  }, [memberData, isLoading, profileImageSrc, mainBannerImageSrc, storeProfileImageSrc])

  const shopInitialLetter = memberData?.BussinessName?.charAt(0)?.toLocaleUpperCase("th") || ""
  const profileInitialLetter = memberData?.memberNameThai?.charAt(0)?.toLocaleUpperCase("th") || ""

  const mapEmbedUrl =
    memberData?.Latitude &&
    memberData?.Longtitude &&
    Number.parseFloat(memberData?.Latitude) !== 0 &&
    Number.parseFloat(memberData?.Longtitude) !== 0
      ? `https://maps.google.com/maps?q=${memberData.Latitude},${memberData.Longtitude}&hl=th&z=15&output=embed&iwloc=B`
      : ""

  const showProfileLoadingAnimation = imageLoadingStates.profile && !isLoading && memberData?.picture

  return (
    <>
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
          <>
            {imageLoadingStates.banner && mainBannerImageSrc && (
              <div className="absolute inset-0 w-full h-full bg-gray-300 animate-pulse z-10"></div>
            )}
            <Image
              key={mainBannerImageSrc || "/"}
              src={mainBannerImageSrc || "/"}
              layout="fill"
              alt={``}
              priority={true}
              quality={90}
              style={{ objectFit: "cover", objectPosition: "center" }}
              onError={() => handleImageError("banner")}
              onLoad={() => handleImageLoad("banner")}
            />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 py-4 px-0">
        <div className="bg-white/75 backdrop-blur-sm flex flex-col sm:flex-row gap-4 p-4 sm:p-6 rounded-lg z-10 border border-gray-200/50">
          <div className="flex-shrink-0 flex justify-center sm:justify-start">
            <div className="relative w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] md:w-[160px] md:h-[160px] lg:w-[180px] lg:h-[180px] -mt-12 sm:-mt-16 lg:-mt-28">
              {isLoading ? (
                <div className="w-full h-full bg-gray-300 animate-pulse rounded-md border-4 sm:border-[6px] border-white "></div>
              ) : imageErrors["profile"] || !profileImageSrc ? (
                profileInitialLetter ? (
                  <div className="w-full h-full bg-gray-400 rounded-md border-4 sm:border-[6px] border-white flex items-center justify-center text-center">
                    <span className="text-4xl sm:text-5xl font-semibold text-white select-none">
                      {profileInitialLetter}
                    </span>
                  </div>
                ) : (
                  <div className="w-full h-full bg-gray-400 rounded-md border-4 sm:border-[6px] border-white flex flex-col items-center justify-center text-center">
                    <MdImageNotSupported className="w-8 h-8 text-white" />
                    <span className="text-white text-xs sm:text-sm mt-1">ไม่มีภาพ</span>
                  </div>
                )
              ) : (
                <div className="relative w-full h-full">
                  {showProfileLoadingAnimation && (
                    <div className="absolute inset-0 w-full h-full bg-gray-300 animate-pulse rounded-md border-4 sm:border-[6px] border-white z-10"></div>
                  )}
                  <Image
                    key={profileImageSrc || "profile-placeholder"}
                    src={profileImageSrc || "/placeholder.svg?width=180&height=180&query=profile+picture"}
                    className="rounded-lg border-4 sm:border-[6px] border-white "
                    layout="fill"
                    objectFit="cover"
                    alt={``}
                    onError={() => handleImageError("profile")}
                    onLoad={() => handleImageLoad("profile")}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 flex flex-col justify-start items-center sm:items-start">
            <div className="text-center sm:text-left w-full">
              {isLoading ? (
                <div className="space-y-3 w-full mb-4">
                  <div className="h-7 w-3/4 bg-gray-300 animate-pulse rounded-md sm:mx-0 mx-auto"></div>
                  <div className="h-5 w-1/2 bg-gray-300 animate-pulse rounded-md sm:mx-0 mx-auto"></div>
                </div>
              ) : (
                <>
                  <h1 className="text-[24px] sm:text-2xl lg:text-2xl font-light text-blue-950 text-wrap">
                    {memberData?.memberNameThai || "-"}
                  </h1>
                  <h2 className="text-[20px] text-gray-600 text-wrap mb-2">{memberData?.memberNameEng || "-"}</h2>
                </>
              )}
            </div>
            <div className="w-full">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-x-6 sm:gap-y-2 text-gray-500 text-[14px] flex-wrap">
                {isLoading ? (
                  <>
                    {[1, 2, 3, 4].map((index) => (
                      <div key={index} className="flex items-center gap-2 my-1 sm:my-0">
                        <div className="w-4 h-4 bg-gray-300 animate-pulse rounded-full"></div>
                        <div className="h-4 w-16 bg-gray-300 animate-pulse rounded"></div>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    {[
                      { icon: <BsTools className="text-gray-500" size={15} />, value: memberData?.memberRoleThai },
                      { icon: <HiPhone className="text-gray-500" size={15} />, value: memberData?.contactUs.phone },
                      { icon: <FaCalendarAlt className="text-gray-500" size={15} />, value: memberData?.Year },
                      {
                        icon: <PiGenderIntersexFill className="text-gray-500" size={15} />,
                        value: memberData?.memberGender,
                      },
                    ].map(({ icon, value }, index) =>
                      value ? (
                        <div key={index} className="flex items-center gap-2 my-1 sm:my-0">
                          <span className="flex-shrink-0 text-gray-600">{icon}</span>
                          <span className="text-gray-400">{value}</span>
                        </div>
                      ) : null,
                    )}
                  </>
                )}
              </div>
              {isLoading ? (
                <div className="flex flex-row items-center gap-2 pt-2">
                  <div className="w-4 h-4 bg-gray-300 animate-pulse rounded-full mt-1"></div>
                  <div className="h-4 w-full bg-gray-300 animate-pulse rounded"></div>
                </div>
              ) : (
                memberData?.AddressThai && (
                  <div className="flex items-start gap-2 text-gray-500 text-[14px] pt-2">
                    <HiLocationMarker className="text-gray-600 flex-shrink-0 mt-0.5" size={16} />
                    <span className="text-gray-400">{memberData?.AddressThai}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 lg:grid-cols-5 gap-4">
          <div className={`col-span-1 ${roleThai === "ครูช่าง" ? "md:col-span-2" : "md:col-span-5"} mt-4 space-y-4`}>
            {isLoading ? (
              <>
                {[1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className="bg-white/70 backdrop-blur-xl border border-gray-300/70 rounded-md z-10 relative overflow-hidden animate-pulse"
                  >
                    <div className="p-4 bg-gray-200/50 border-b border-gray-300/70">
                      <div className="h-6 w-2/3 bg-gray-300/70 rounded"></div>
                    </div>
                    <div className="p-4">
                      <div className="h-4 w-full bg-gray-300/70 rounded"></div>
                      <div className="h-4 w-5/6 bg-gray-300/70 rounded mt-2"></div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                {/* เกี่ยวกับผู้ประกอบการ ไทย */}
                <div className="bg-white/70 backdrop-blur-xl border border-gray-200/60 rounded-md z-10 relative overflow-hidden">
                  <div className="p-4 bg-white/30 backdrop-blur-md border-b border-gray-200/40">
                    <button
                      onClick={() => setIsThaiDescExpanded(!isThaiDescExpanded)}
                      className="flex items-center justify-between w-full text-left group"
                      aria-expanded={isThaiDescExpanded}
                      aria-controls="thai-description-content-card"
                    >
                      <h2 className="text-xl sm:text-2xl font-light text-blue-950">เกี่ยวกับ{MemberInfo} (ภาษาไทย)</h2>
                      <IoIosArrowDown
                        className={`w-5 h-5 text-blue-950 transform transition-transform duration-300 ${
                          isThaiDescExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>
                  {isThaiDescExpanded && (
                    <div id="thai-description-content-card" className="p-4">
                      <p className="text-base font-light text-gray-600 leading-relaxed whitespace-pre-line">
                        {memberData?.description_TH &&
                        memberData.description_TH.trim() !== ""
                          ? memberData.description_TH
                          : "ไม่มีข้อมูลเกี่ยวกับผู้ประกอบการ"}
                      </p>
                    </div>
                  )}
                </div>

                {/*  เกี่ยวกับผู้ประกอบการ ญี่ปุ่ม */}
                <div className="bg-white/70 backdrop-blur-xl border border-gray-200/60 rounded-md z-10 relative overflow-hidden">
                  <div className="p-4 bg-white/30 backdrop-blur-md border-b border-gray-200/40">
                    <button
                      onClick={() => setIsJapanDescExpanded(!isJapanDescExpanded)}
                      className="flex items-center justify-between w-full text-left group"
                      aria-expanded={isJapanDescExpanded}
                      aria-controls="japan-description-content-card"
                    >
                      <h2 className="text-xl sm:text-2xl font-light text-blue-950">เกี่ยวกับ{MemberInfo} (ภาษาญี่ปุ่น)</h2>
                      <IoIosArrowDown
                        className={`w-5 h-5 text-blue-950 transform transition-transform duration-300 ${
                          isJapanDescExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>
                  {isJapanDescExpanded && (
                    <div id="japan-description-content-card" className="p-4">
                      <p className="text-base font-light text-gray-600 leading-relaxed whitespace-pre-line">
                        {memberData?.description_JP &&
                        memberData.description_JP.trim() !== ""
                          ? memberData.description_JP
                          : "ไม่มีข้อมูลเกี่ยวกับผู้ประกอบการ"}
                      </p>
                    </div>
                  )}
                </div>

                {/* เกี่ยวกับผู้ประกอบการ อังกฤษ */}
                <div className="bg-white/70 backdrop-blur-xl border border-gray-200/60 rounded-md z-10 relative overflow-hidden">
                  <div className="p-4 bg-white/30 backdrop-blur-md border-b border-gray-200/40">
                    <button
                      onClick={() => setIsEngDescExpanded(!isEngDescExpanded)}
                      className="flex items-center justify-between w-full text-left group"
                      aria-expanded={isEngDescExpanded}
                      aria-controls="eng-description-content-card"
                    >
                      <h2 className="text-xl sm:text-2xl font-light text-blue-950">เกี่ยวกับ{MemberInfo} (ภาษาอังกฤษ)</h2>
                      <IoIosArrowDown
                        className={`w-5 h-5 text-blue-950 transform transition-transform duration-300 ${
                          isEngDescExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>
                  {isEngDescExpanded && (
                    <div id="eng-description-content-card" className="p-4">
                      <p className="text-base font-light text-gray-600 leading-relaxed whitespace-pre-line">
                        {memberData?.description_EN &&
                        memberData.description_EN.trim() !== ""
                          ? memberData.description_EN
                          : "ไม่มีข้อมูลเกี่ยวกับผู้ประกอบการ"}
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {roleThai === "ครูช่าง" && !isLoading && (
            <div className="col-span-1 md:col-span-3 mt-4">
              <div className="bg-white/70 backdrop-blur-xl border border-gray-200/60 rounded-md overflow-hidden w-full transition-all duration-300 ease-in-out">
                <div className="p-4 bg-white/30 backdrop-blur-md border-b border-gray-200/40">
                  <h2 className="text-xl sm:text-2xl font-light text-blue-950">ร้านค้าผู้ประกอบการ</h2>
                </div>

                <div className="p-4 space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden border-2 border-white bg-gray-200 flex items-center justify-center">
                      {imageErrors[shopImageKey] || !storeProfileImageSrc ? (
                        shopInitialLetter && !imageErrors[shopImageKey] ? (
                          <div className="w-full h-full bg-gray-400 flex items-center justify-center rounded-md">
                            <span className="text-2xl sm:text-3xl font-semibold text-white select-none">
                              {shopInitialLetter}
                            </span>
                          </div>
                        ) : (
                          <div className="w-full h-full bg-gray-400 flex flex-col items-center justify-center text-center rounded-md">
                            <MdImageNotSupported className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                            <span className="text-white text-xs mt-1">ไม่มีภาพ</span>
                          </div>
                        )
                      ) : (
                        <div className="relative w-full h-full">
                          <Image
                            key={storeProfileImageSrc}
                            src={storeProfileImageSrc || "/placeholder.svg"}
                            alt={`โลโก้ ${memberData?.BussinessName || "ร้านค้า"}`}
                            layout="fill"
                            objectFit="cover"
                            className="rounded-md"
                            onError={() => handleImageError(shopImageKey)}
                            onLoad={() => handleImageLoad(shopImageKey)}
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex-grow">
                      <Link
                        href={`/businesses/${memberData?.BusinessID}`}
                        className="text-[20px] sm:text-xl font-light text-blue-950 hover:underline underline-offset-4 "
                      >
                        <p className="flex items-center gap-2 m-0">
                          {memberData?.BussinessName || "-"}
                          <HiOutlineExternalLink size={18} />
                        </p>
                      </Link>
                      {memberData?.BussinessNameEng && (
                        <p className="text-[16px] text-gray-500">({memberData?.BussinessNameEng})</p>
                      )}
                      {memberData?.Year && (
                        <p className="flex items-center gap-2 text-[14px] text-gray-400 mt-0.5">
                          <FaCalendarAlt size={16} className="text-gray-600" /> {memberData?.Year}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start space-x-2 text-sm">
                    <HiLocationMarker className="w-4 h-4 text-gray-600 flex-shrink-0 mt-1" />
                    <p className="text-gray-400 leading-relaxed">{memberData?.AddressThai || "-"}</p>
                  </div>
                  {memberData?.contactUs && (
                    <div className="flex items-start space-x-2 text-sm">
                      <HiPhone className="w-4 h-4 text-gray-600 flex-shrink-0 mt-1" />
                      <p className="text-gray-400 break-all">{memberData.contactUs?.phone}</p>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  {mapEmbedUrl ? (
                    <div className="w-full h-72 md:h-96 bg-gray-200 rounded-md overflow-hidden">
                      <iframe
                        src={mapEmbedUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen={false}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title={`แผนที่ร้าน ${memberData?.BussinessName || ""}`}
                      ></iframe>
                    </div>
                  ) : (
                    <div className="w-full h-72 md:h-96 bg-gray-200/50 backdrop-blur-sm flex flex-col items-center justify-center text-gray-500 rounded-md">
                      <FaMapMarkedAlt className="w-16 h-16 mb-3 text-gray-400" />
                      <span className="text-sm text-center">ไม่สามารถแสดงแผนที่ได้ (ไม่มีข้อมูลพิกัด)</span>
                    </div>
                  )}

                  {mapEmbedUrl ? (
                    <div className="flex items-center justify-end border-t border-gray-200 pt-1 mt-4">
                      {memberData?.Latitude &&
                        memberData?.Longtitude &&
                        Number.parseFloat(memberData?.Latitude) !== 0 &&
                        Number.parseFloat(memberData?.Longtitude) !== 0 && (
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${memberData?.Latitude},${memberData?.Longtitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 inline-flex items-center justify-center w-full sm:w-auto px-6 py-2 bg-blue-950 hover:bg-blue-950/80 text-white rounded-md transition-colors duration-300 group text-[14px] font-light"
                          >
                            <FaGlobeAmericas className="w-4 h-4 mr-2" />
                            เปิดใน Google Maps
                            <HiOutlineExternalLink className="w-4 h-4 ml-2 opacity-80 group-hover:opacity-100 transition-opacity" />
                          </a>
                        )}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          )}
          {roleThai === "ครูช่าง" && isLoading && (
            <div className="col-span-1 md:col-span-3 mt-4">
              <div className="bg-white/70 backdrop-blur-xl border border-gray-200/60 rounded-md overflow-hidden w-full">
                <div className="p-4 bg-white/30 backdrop-blur-md border-b border-gray-200/40">
                  <div className="h-7 w-2/5 bg-gray-300/70 rounded animate-pulse"></div>
                </div>
                <div className="p-4 space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-300/70 rounded-md animate-pulse"></div>
                    <div className="flex-grow space-y-2">
                      <div className="h-5 w-3/4 bg-gray-300/70 rounded animate-pulse"></div>
                      <div className="h-4 w-1/2 bg-gray-300/70 rounded animate-pulse"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-300/70 rounded animate-pulse"></div>
                    <div className="h-4 w-5/6 bg-gray-300/70 rounded animate-pulse"></div>
                  </div>
                  <div className="h-10 w-full sm:w-1/2 bg-gray-300/70 rounded-lg animate-pulse mt-3"></div>
                </div>
                <div className="p-4">
                  <div className="w-full h-72 md:h-96 bg-gray-300/50 backdrop-blur-sm animate-pulse rounded-md"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
