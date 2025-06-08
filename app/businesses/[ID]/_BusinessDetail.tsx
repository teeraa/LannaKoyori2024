"use client"

import Image from "next/image"
import type { Business, YouTubeVideo } from "./_client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { HiExternalLink, HiLocationMarker } from "react-icons/hi"
import { FaCalendarAlt, FaRegBuilding, FaGlobeAmericas, FaMapMarkedAlt, FaPlayCircle } from "react-icons/fa"
import { BsTools } from "react-icons/bs"
import { PiGenderIntersexFill } from "react-icons/pi"
import { MdImageNotSupported } from "react-icons/md"
import { FaFacebookSquare, FaLine, FaYoutube } from "react-icons/fa"
import { FaPhone, FaEarthAsia } from "react-icons/fa6"
import { MdEmail } from "react-icons/md"
import { PiInstagramLogoFill } from "react-icons/pi"
import { AiFillTikTok } from "react-icons/ai"
import { IoIosArrowDown } from "react-icons/io"

interface StoreDetailProps {
  store: Business | null
  isLoading: boolean
  videos?: YouTubeVideo[]
}

const getYouTubeEmbedId = (video: YouTubeVideo): string | null => {
  if (video.id && video.id.length === 11) {
    return video.id
  }
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = video.url.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}

type EnrichedYouTubeVideo = YouTubeVideo & { embedId: string }

export default function StoreDetailComponent({ store, isLoading, videos = [] }: StoreDetailProps) {
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({})
  const [imageLoadingStates, setImageLoadingStates] = useState<{ [key: string]: boolean }>({
    banner: true,
    profile: true,
    storeProfile: true,
  })

  const [isThaiDescExpanded, setIsThaiDescExpanded] = useState(true)
  const [isJapanDescExpanded, setIsJapanDescExpanded] = useState(false)
  const [isEngDescExpanded, setIsEngDescExpanded] = useState(false)

  const storeData = isLoading ? null : store

  const validVideos: EnrichedYouTubeVideo[] = videos
    .map((video) => {
      const embedId = getYouTubeEmbedId(video)
      return embedId ? { ...video, embedId } : null
    })
    .filter((v): v is EnrichedYouTubeVideo => v !== null)

  const [selectedVideo, setSelectedVideo] = useState<EnrichedYouTubeVideo | null>(null)

  useEffect(() => {
    if (validVideos.length > 0) {
      const currentSelectedStillValid = selectedVideo
        ? validVideos.find((v) => v.embedId === selectedVideo.embedId)
        : null
      if (currentSelectedStillValid) {
        setSelectedVideo(currentSelectedStillValid)
      } else {
        setSelectedVideo(validVideos[0])
      }
    } else {
      setSelectedVideo(null)
    }
    // eslint-disable-next-line
  }, [videos, validVideos.length])

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

  const bannerImageSrc = isValidUrl(storeData?.banner || "/") ? storeData?.banner : "/"
  const storeProfileImageSrc = isValidUrl(storeData?.picture || "/") ? storeData?.picture : "/"
  const profileImageSrc = isValidUrl(storeData?.memberpicture || "/") ? storeData?.memberpicture : "/"

  const storeInitialLetter = storeData?.BussinessName?.charAt(0)?.toLocaleUpperCase("th") || ""
  const personInitialLetter = storeData?.memberNameThai?.charAt(0)?.toLocaleUpperCase("th") || ""

  const mapEmbedUrl =
    storeData?.Latitude &&
    storeData?.Longtitude &&
    Number.parseFloat(storeData.Latitude) !== 0 &&
    Number.parseFloat(storeData.Longtitude) !== 0
      ? `https://maps.google.com/maps?q=${storeData.Latitude},${storeData.Longtitude}&hl=th&z=15&output=embed&iwloc=B`
      : ""

  const showStoreProfileLoadingAnimation = imageLoadingStates.storeProfile && !isLoading && storeData?.picture

  const handleThaiDescToggle = () => {
    const currentlyExpanded = isThaiDescExpanded
    setIsThaiDescExpanded(!currentlyExpanded)
    if (!currentlyExpanded) {
      // If it's being opened
      setIsJapanDescExpanded(false)
      setIsEngDescExpanded(false)
    }
  }

  const handleJapanDescToggle = () => {
    const currentlyExpanded = isJapanDescExpanded
    setIsJapanDescExpanded(!currentlyExpanded)
    if (!currentlyExpanded) {
      // If it's being opened
      setIsThaiDescExpanded(false)
      setIsEngDescExpanded(false)
    }
  }

  const handleEngDescToggle = () => {
    const currentlyExpanded = isEngDescExpanded
    setIsEngDescExpanded(!currentlyExpanded)
    if (!currentlyExpanded) {
      // If it's being opened
      setIsThaiDescExpanded(false)
      setIsJapanDescExpanded(false)
    }
  }

  return (
    <>
      {/* ปก Section */}
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
            {imageLoadingStates.banner && bannerImageSrc && (
              <div className="absolute inset-0 w-full h-full bg-gray-300 animate-pulse z-10"></div>
            )}
            <Image
              key={bannerImageSrc}
              src={bannerImageSrc || "/placeholder.svg?width=1280&height=320&query=store+banner"}
              layout="fill"
              alt={storeData?.BussinessName || "แบนเนอร์ร้าน"}
              priority={true}
              quality={90}
              style={{ objectFit: "cover", objectPosition: "center" }}
              onError={() => handleImageError("banner")}
              onLoad={() => handleImageLoad("banner")}
            />
          </>
        )}
      </div>

      {/* เนื้อหา */}
      <div className="grid grid-cols-1 py-4 px-0">
        <div className="bg-white/75 backdrop-blur-sm flex flex-col sm:flex-row gap-4 p-4 sm:p-6 rounded-lg z-10 border border-gray-200/50">
          <div className="flex-shrink-0 flex justify-center sm:justify-start">
            <div className="relative w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] md:w-[160px] md:h-[160px] lg:w-[180px] lg:h-[180px] -mt-12 sm:-mt-16 lg:-mt-28">
              {isLoading ? (
                <div className="w-full h-full bg-gray-300 animate-pulse rounded-md border-4 sm:border-[6px] border-white"></div>
              ) : imageErrors["storeProfile"] || !storeProfileImageSrc ? (
                storeInitialLetter ? (
                  <div className="w-full h-full bg-blue-950 rounded-md border-4 sm:border-[6px] border-white flex items-center justify-center text-center">
                    <span className="text-4xl sm:text-5xl font-semibold text-white select-none">
                      {storeInitialLetter}
                    </span>
                  </div>
                ) : (
                  <div className="w-full h-full bg-gray-400 rounded-md border-4 sm:border-[6px] border-white flex flex-col items-center justify-center text-center">
                    <FaRegBuilding className="w-8 h-8 text-white" />
                    <span className="text-white text-xs sm:text-sm mt-1">ไม่มีภาพ</span>
                  </div>
                )
              ) : (
                <div className="relative w-full h-full">
                  {showStoreProfileLoadingAnimation && (
                    <div className="absolute inset-0 w-full h-full bg-gray-300 animate-pulse rounded-md border-4 sm:border-[6px] border-white z-10"></div>
                  )}
                  <Image
                    key={storeProfileImageSrc}
                    src={storeProfileImageSrc || "/placeholder.svg?width=180&height=180&query=store+profile"}
                    className="rounded-lg border-4 sm:border-[6px] border-white"
                    layout="fill"
                    objectFit="cover"
                    alt={storeData?.BussinessName || "โลโก้ร้าน"}
                    onError={() => handleImageError("storeProfile")}
                    onLoad={() => handleImageLoad("storeProfile")}
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
                    {storeData?.BussinessName || "-"}
                  </h1>
                  <h2 className="text-[20px] text-gray-600 text-wrap mb-2">({storeData?.BussinessNameEng || "-"})</h2>
                </>
              )}
            </div>
            <div className="w-full">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-x-6 sm:gap-y-2 text-gray-500 text-[14px] flex-wrap">
                {isLoading ? (
                  <>
                    {[1, 2, 3].map((index) => (
                      <div key={index} className="flex items-center gap-2 my-1 sm:my-0">
                        <div className="w-4 h-4 bg-gray-300 animate-pulse rounded-full"></div>
                        <div className="h-4 w-16 bg-gray-300 animate-pulse rounded"></div>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    {[
                      { icon: <FaCalendarAlt className="text-gray-500" size={15} />, value: storeData?.Year },
                      { icon: <FaPhone className="text-gray-500" size={15} />, value: storeData?.Contact },
                      {
                        icon: <FaPhone className="text-gray-500" size={15} />,
                        label: storeData?.contactUs?.phone,
                      },
                      {
                        icon: <MdEmail className="text-gray-500" size={15} />,
                        label: storeData?.contactUs?.email,
                      },
                      {
                        icon: <FaFacebookSquare className="text-gray-500" size={15} />,
                        label: storeData?.contactUs?.facebook_name,
                        link: storeData?.contactUs?.facebook_url,
                      },
                      {
                        icon: <PiInstagramLogoFill className="text-gray-500" size={15} />,
                        label: storeData?.contactUs?.instagram_name,
                        link: storeData?.contactUs?.instagram_url,
                      },
                      {
                        icon: <FaLine className="text-gray-500" size={15} />,
                        label: storeData?.contactUs?.lineId_name,
                        link: storeData?.contactUs?.line_url,
                      },
                      {
                        icon: <AiFillTikTok className="text-gray-500" size={15} />,
                        label: storeData?.contactUs?.tiktok_name,
                        link: storeData?.contactUs?.tiktok_url,
                      },
                      {
                        icon: <FaEarthAsia className="text-gray-500" size={15} />,
                        label: storeData?.contactUs?.website_name,
                        link: storeData?.contactUs?.website_url,
                      },
                      {
                        icon: <FaYoutube className="text-gray-500" size={15} />,
                        label: storeData?.contactUs?.youtube_name,
                        link: storeData?.contactUs?.youtube_url,
                      },
                    ].map(({ icon, label, link }, index) => {
                      let showItem = false

                      // Check for phone or email (identified by 'link' property being undefined in their object definition)
                      if (typeof link === "undefined") {
                        if (label && label.trim() !== "") {
                          // Phone number or email string exists and is not empty
                          showItem = true
                        }
                      } else {
                        // For social media, website, etc. (identified by 'link' property being present)
                        if (label && label.trim() !== "" && link && link.trim() !== "") {
                          // Both name and URL exist and are not empty
                          showItem = true
                        }
                      }

                      return showItem ? (
                        <div key={index} className="flex items-center gap-2 my-1 sm:my-0">
                          <span className="flex-shrink-0 text-gray-600">{icon}</span>
                          {link ? ( // If it's an item that should be a link (social media, website)
                            <a
                              href={link} // Ensure 'link' is a valid URL string
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-blue-600 hover:underline truncate max-w-[150px]"
                            >
                              {label}
                            </a> // If it's phone or email (no 'link' property, or 'link' is falsy but showItem is true)
                          ) : (
                            <span className="text-gray-400 truncate max-w-[150px]">{label}</span>
                          )}
                        </div>
                      ) : null
                    })}
                  </>
                )}
              </div>
              {isLoading ? (
                <div className="flex flex-row items-center gap-2 pt-2">
                  <div className="w-4 h-4 bg-gray-300 animate-pulse rounded-full mt-1"></div>
                  <div className="h-4 w-full bg-gray-300 animate-pulse rounded"></div>
                </div>
              ) : (
                storeData?.AddressThai && (
                  <div className="flex items-start gap-2 text-gray-500 text-[14px] pt-2">
                    <HiLocationMarker className="text-gray-600 flex-shrink-0 mt-0.5" size={16} />
                    <span className="text-gray-400">{storeData.AddressThai}</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
          <div className="col-span-1 md:col-span-2 ">
            <div className={`col-span-1 md:col-span-2 space-y-4`}>
              {isLoading ? (
                <>
                  {[1, 2, 3].map((index) => (
                    <div
                      key={index}
                      className="bg-white/70 backdrop-blur-xl border border-gray-300/70 rounded-md z-10 relative overflow-hidden animate-pulse"
                    >
                      <div className="p-4 bg-white-200/50 backdrop-blur-md border-b border-gray-300/70">
                        <div className="h-8 w-2/3 bg-gray-300/70 rounded"></div>
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
                        onClick={handleThaiDescToggle}
                        className="flex items-center justify-between w-full text-left group"
                        aria-expanded={isThaiDescExpanded}
                        aria-controls="thai-description-content-card"
                      >
                        <h2 className="text-xl sm:text-2xl font-light text-blue-950">เกี่ยวกับร้าน (ภาษาไทย)</h2>
                        <IoIosArrowDown
                          className={`w-5 h-5 text-blue-950 transform transition-transform duration-300 ${
                            isThaiDescExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </div>
                    {isThaiDescExpanded && (
                      <div id="thai-description-content-card" className="p-4">
                        <p className="text-base font-light text-gray-600 leading-relaxed whitespace-pre-line indent-8 text-justify">
                          {storeData?.description_TH && storeData.description_TH.trim() !== ""
                            ? storeData.description_TH
                            : "ไม่มีข้อมูลเกี่ยวกับผู้ประกอบการ"}
                        </p>
                      </div>
                    )}
                  </div>

                  {/*  เกี่ยวกับผู้ประกอบการ ญี่ปุ่ม */}
                  <div className="bg-white/70 backdrop-blur-xl border border-gray-200/60 rounded-md z-10 relative overflow-hidden">
                    <div className="p-4 bg-white/30 backdrop-blur-md border-b border-gray-200/40">
                      <button
                        onClick={handleJapanDescToggle}
                        className="flex items-center justify-between w-full text-left group"
                        aria-expanded={isJapanDescExpanded}
                        aria-controls="japan-description-content-card"
                      >
                        <h2 className="text-xl sm:text-2xl font-light text-blue-950">เกี่ยวกับร้าน (ภาษาญี่ปุ่น)</h2>
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
                          {storeData?.description_JP && storeData.description_JP.trim() !== ""
                            ? storeData.description_JP
                            : "ไม่มีข้อมูลเกี่ยวกับผู้ประกอบการ"}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* เกี่ยวกับผู้ประกอบการ อังกฤษ */}
                  <div className="bg-white/70 backdrop-blur-xl border border-gray-200/60 rounded-md z-10 relative overflow-hidden">
                    <div className="p-4 bg-white/30 backdrop-blur-md border-b border-gray-200/40">
                      <button
                        onClick={handleEngDescToggle}
                        className="flex items-center justify-between w-full text-left group"
                        aria-expanded={isEngDescExpanded}
                        aria-controls="eng-description-content-card"
                      >
                        <h2 className="text-xl sm:text-2xl font-light text-blue-950">เกี่ยวกับร้าน (ภาษาอังกฤษ)</h2>
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
                          {storeData?.description_EN && storeData.description_EN.trim() !== ""
                            ? storeData.description_EN
                            : "ไม่มีข้อมูลเกี่ยวกับผู้ประกอบการ"}
                        </p>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="col-span-1 md:col-span-3 ">
            <div className="bg-white/70 backdrop-blur-xl border border-gray-200/60 rounded-md overflow-hidden w-full">
              <div className="p-4 bg-white/30 backdrop-blur-md border-b border-gray-200/40">
                {isLoading ? (
                  <div className="h-8 w-2/5 bg-gray-300 animate-pulse rounded"></div>
                ) : (
                  <h2 className="text-xl sm:text-2xl font-light text-blue-950">ผู้ประกอบการ</h2>
                )}
              </div>
              <div className="p-4 space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden border-2 border-white bg-gray-200 flex items-center justify-center">
                    {isLoading ? (
                      <div className="w-full h-full bg-gray-300 animate-pulse rounded-md"></div>
                    ) : !imageLoadingStates.profile &&
                      (imageErrors.profile || !profileImageSrc) &&
                      personInitialLetter ? (
                      <span className="text-3xl sm:text-4xl font-semibold text-gray-500 select-none">
                        {personInitialLetter}
                      </span>
                    ) : !imageLoadingStates.profile &&
                      (imageErrors.profile || !profileImageSrc) &&
                      !personInitialLetter ? (
                      <MdImageNotSupported className="w-8 h-8 text-gray-400" />
                    ) : (
                      <Image
                        key={profileImageSrc || "entrepreneur-profile-placeholder"}
                        src={profileImageSrc || "/placeholder.svg?width=80&height=80&query=entrepreneur+profile"}
                        alt={`รูปโปรไฟล์ ${storeData?.memberNameThai || "ผู้ประกอบการ"}`}
                        width={80}
                        height={80}
                        objectFit="cover"
                        className="rounded-md"
                        onError={() => handleImageError("profile")}
                        onLoad={() => handleImageLoad("profile")}
                      />
                    )}
                  </div>
                  <div className="flex-grow">
                    {isLoading ? (
                      <div className="space-y-2">
                        <div className="h-5 w-3/4 bg-gray-300 animate-pulse rounded"></div>
                        <div className="h-4 w-1/2 bg-gray-300 animate-pulse rounded"></div>
                        <div className="h-4 w-2/3 bg-gray-300 animate-pulse rounded"></div>
                      </div>
                    ) : (
                      <>
                        <Link
                          href={`/members/${storeData?.memberID || "default-id"}`}
                          className="text-[20px] sm:text-xl font-light text-blue-950 hover:underline underline-offset-4"
                        >
                          <p className="flex items-center gap-2 m-0">
                            {storeData?.memberNameThai || "-"}
                            <HiExternalLink size={18} />
                          </p>
                        </Link>
                        {storeData?.memberNameEng && (
                          <p className="text-[16px] text-gray-500">({storeData.memberNameEng})</p>
                        )}
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                          {storeData?.memberRoleThai && (
                            <div className="flex items-center gap-1">
                              <BsTools size={14} />
                              <span>{storeData.memberRoleThai}</span>
                            </div>
                          )}
                          {storeData?.memberGender && (
                            <div className="flex items-center gap-1">
                              <PiGenderIntersexFill size={14} />
                              <span>{storeData.memberGender}</span>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
                {/* {isLoading ? (
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-gray-300 animate-pulse rounded"></div>
                    <div className="h-4 w-5/6 bg-gray-300 animate-pulse rounded"></div>
                  </div>
                ) : (
                  <>
                    {storeData?.Contact && (
                      <div className="flex items-start space-x-2 text-sm">
                        <FaPhone className="w-4 h-4 text-gray-600 flex-shrink-0 mt-1" />
                        <p className="text-gray-400 break-all">{storeData.Contact}</p>
                      </div>
                    )}
                    {storeData?.memberPosition && (
                      <div className="flex items-start space-x-2 text-sm">
                        <BsTools className="w-4 h-4 text-gray-600 flex-shrink-0 mt-1" />
                        <p className="text-gray-400">{storeData.memberPosition}</p>
                      </div>
                    )}
                  </>
                )} */}
              </div>
              <div className="p-4">
                {mapEmbedUrl ? (
                  <div className="relative w-full h-72 md:h-96 bg-gray-200 rounded-md overflow-hidden">
                    <iframe
                      src={mapEmbedUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={false}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`แผนที่ร้าน ${storeData?.BussinessName || ""}`}
                    ></iframe>
                  </div>
                ) : (
                  <div className="w-full h-72 md:h-96 bg-gray-200/50 backdrop-blur-sm flex flex-col items-center justify-center text-gray-500 rounded-md">
                    <FaMapMarkedAlt className="w-16 h-16 mb-3 text-gray-400" />
                    <span className="text-sm text-center">ไม่สามารถแสดงแผนที่ได้ (ไม่มีข้อมูลพิกัด)</span>
                  </div>
                )}
                {mapEmbedUrl && (
                  <div className="flex items-center justify-end border-t border-gray-200/60 pt-3 mt-4">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${storeData?.Latitude},${storeData?.Longtitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-2 bg-blue-950 hover:bg-blue-950/80 text-white rounded-md transition-colors duration-300 group text-[14px] font-light"
                    >
                      <FaGlobeAmericas className="w-4 h-4 mr-2" />
                      เปิดใน Google Maps
                      <HiExternalLink className="w-4 h-4 ml-2 opacity-80 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ยูทูแ Section */}
        {isLoading && (
          <div className="mt-8">
            <div className="p-4 bg-white/70 backdrop-blur-xl border border-gray-200/60 rounded-t-md">
              <div className="h-7 w-2/5 bg-gray-300 animate-pulse rounded"></div>
            </div>
            <div className="bg-white/50 backdrop-blur-lg border border-t-0 border-gray-200/60 rounded-b-md p-4">
              <div className="aspect-video bg-gray-300 animate-pulse rounded-lg"></div>
              <div className="mt-3 h-5 w-3/4 bg-gray-300 animate-pulse rounded"></div>
              <div className="mt-1 h-4 w-1/4 bg-gray-300 animate-pulse rounded"></div>{" "}
              <div className="mt-6 mb-3 h-5 w-1/3 bg-gray-300 animate-pulse rounded"></div>{" "}
              <div className="flex overflow-x-auto space-x-3 py-4 px-2 -mb-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="group rounded-lg overflow-hidden border-2 border-transparent flex-shrink-0 w-40 sm:w-48 md:w-56"
                  >
                    <div className="relative aspect-video bg-gray-300 animate-pulse"></div>
                    <div className="p-2 bg-gray-200 animate-pulse">
                      <div className="h-3 w-full bg-gray-300 animate-pulse rounded"></div>{" "}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {!isLoading && validVideos.length > 0 && (
          <div className="mt-8">
            <div className="p-4 bg-white/70 backdrop-blur-xl border border-gray-200/60 rounded-t-md">
              <h2 className="text-xl sm:text-2xl font-light text-blue-950 flex items-center">
                {/* <FaPlayCircle className="mr-3 text-red-600" /> */}
                วิดีโอแกลเลอรี่
              </h2>
            </div>
            <div className="bg-white/50 backdrop-blur-lg border border-t-0 border-gray-200/60 rounded-b-md p-4">
              {selectedVideo ? (
                <div className="">
                  <div className="aspect-video bg-black rounded-lg overflow-hidden border border-gray-300/50">
                    <iframe
                      key={selectedVideo.embedId}
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${selectedVideo.embedId}?autoplay=0&rel=0`}
                      title={selectedVideo.title || "YouTube video player"}
                      frameBorder="0"
                      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      className="rounded-lg"
                    ></iframe>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-blue-950 truncate" title={selectedVideo.title}>
                    {selectedVideo.title || "วิดีโอ"}
                  </h3>
                  <a
                    href={selectedVideo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-500 hover:text-red-600 hover:underline flex items-center mt-1"
                  >
                    ดูบน YouTube <HiExternalLink className="ml-1" />
                  </a>
                </div>
              ) : (
                <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center mb-6 text-gray-400">
                  <FaPlayCircle className="text-4xl mr-2" />
                  <p>เลือกวิดีโอจากรายการด้านล่างเพื่อเล่น</p>
                </div>
              )}
              <h4 className="text-md font-semibold text-blue-900 mb-3 mt-6">รายการวิดีโอ:</h4>
              <div className="flex overflow-x-auto space-x-3 py-4 px-2 -mb-3">
                {validVideos.map((video) => (
                  <div
                    key={video.embedId}
                    onClick={() => setSelectedVideo(video)}
                    className={`group cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ease-in-out
                          flex-shrink-0 w-40 sm:w-48 md:w-56
                          ${selectedVideo?.embedId === video.embedId ? "border-red-600 scale-105" : "border-transparent hover:border-red-400"}`}
                  >
                    <div className="relative aspect-video bg-gray-700">
                      <Image
                        src={`https://img.youtube.com/vi/${video.embedId}/mqdefault.jpg`}
                        alt={video.title || "Video thumbnail"}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-300 group-hover:scale-110"
                        unoptimized={true}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <FaPlayCircle className="text-white text-4xl opacity-80" />
                      </div>
                      {selectedVideo?.embedId === video.embedId && (
                        <div className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full">
                          <FaPlayCircle size={12} />
                        </div>
                      )}
                    </div>
                    <p
                      className="p-2 text-xs text-gray-800 bg-gray-100 group-hover:bg-gray-200 truncate transition-colors"
                      title={video.title}
                    >
                      {video.title || "วิดีโอ YouTube"}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {!isLoading && videos.length > 0 && validVideos.length === 0 && (
          <div className="mt-8 p-4 bg-white/70 backdrop-blur-xl border border-gray-200/60 rounded-md">
            <h2 className="text-xl sm:text-2xl font-light text-blue-950 mb-2 flex items-center">
              <FaPlayCircle className="mr-3 text-red-600" />
              วิดีโอแกลเลอรี่
            </h2>
            <p className="text-gray-600">ไม่พบวิดีโอ YouTube ที่ถูกต้องสำหรับแสดงผลในแกลเลอรี่</p>
          </div>
        )}
      </div>
    </>
  )
}
