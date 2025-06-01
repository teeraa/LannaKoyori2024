"use client"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { IoIosArrowDown } from "react-icons/io"

interface MemberDetailProps {
    member: any
    isLoading: boolean
}

export default function MemberDetail({ member, isLoading }: MemberDetailProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [showContent, setShowContent] = useState(false)
    const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({})
    const [imageLoading, setImageLoading] = useState<{ [key: string]: boolean }>({
        banner: true,
        profile: true,
    })

    const checkLongTextRef = useRef<HTMLParagraphElement>(null)
    const [ReadMoreButton, setReadMoreButton] = useState(false)

    const handleImageError = (imageKey: string) => {
        setImageErrors((prev) => ({ ...prev, [imageKey]: true }))
        setImageLoading((prev) => ({ ...prev, [imageKey]: false }))
    }

    const handleImageLoad = (imageKey: string) => {
        setImageLoading((prev) => ({ ...prev, [imageKey]: false }))
    }

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
                    <Image
                        src={`/images/entreprenuer/Koyori_${member?.businessinfo?.DataYear || ""}/${member?.businessinfo?.BussinessNameEng?.replace(/\s+/g, "") || ""}/banner/${member?.businessinfo?.picture || ""}`}
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

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 md:gap-6 py-4 px-0">
                <div className="xl:col-span-1 flex flex-col sm:flex-row xl:flex-col items-center justify-center p-4 sm:p-6 bg-white/75 rounded-md z-10 border border-gray-100">
                    <div className="flex flex-col items-center sm:items-start xl:items-center sm:mr-6 xl:mr-0">
                        <div className="relative w-[120px] h-[120px] sm:w-[140px] sm:h-[140px] md:w-[160px] md:h-[160px] lg:w-[180px] lg:h-[180px] xl:w-[200px] xl:h-[200px] -mt-12 sm:-mt-16 lg:-mt-20 xl:-mt-24">
                            {isLoading ? (
                                <div className="w-full h-full bg-gray-300 animate-pulse rounded-full border-4 sm:border-6 border-white"></div>
                            ) : imageErrors["profile"] ? (
                                <div className="w-full h-full bg-gray-400 rounded-full border-4 sm:border-6 border-white flex items-center justify-center">
                                    <span className="text-white text-xs sm:text-sm">ไม่มีภาพ</span>
                                </div>
                            ) : (
                                <div className="relative w-full h-full">
                                    {imageLoading.profile && shouldShowImage && (
                                        <div className="absolute inset-0 w-full h-full bg-gray-300 animate-pulse rounded-full border-4 sm:border-6 border-white z-10"></div>
                                    )}
                                    <Image
                                        src={`/images/entreprenuer/Koyori_${member?.businessinfo?.DataYear || ""}/${member?.businessinfo?.BussinessNameEng?.replace(/\s+/g, "") || ""}/Profile/${member?.picture || ""}`}
                                        className="rounded-full border-4 sm:border-6 border-white"
                                        layout="fill"
                                        objectFit="cover"
                                        alt={member?.NameThai || ""}
                                        onError={() => handleImageError("profile")}
                                        onLoad={() => handleImageLoad("profile")}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Name */}
                        <div className="text-center sm:text-left xl:text-center mt-4">
                            {isLoading ? (
                                <div className="space-y-2">
                                    <div className="h-6 w-32 sm:w-40 bg-gray-300 animate-pulse rounded"></div>
                                    <div className="h-4 w-24 sm:w-32 bg-gray-300 animate-pulse rounded"></div>
                                </div>
                            ) : (
                                <>
                                    <h1 className="text-[20px] sm:text-2xl lg:text-2xl font-bold text-blue-950 text-wrap">
                                        {member?.NameThai}
                                    </h1>
                                    <h2 className="text-[20px] text-gray-400 text-wrap">({member?.NameEng})</h2>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="mt-4 sm:mt-0 xl:mt-6 w-full sm:flex-1 xl:flex-none">
                        <div className="grid grid-cols-1 gap-2 text-[16px]">
                            {/* Row Template */}
                            {[
                                { label: 'เบอร์โทรศัพท์', value: member?.Contact },
                                { label: 'ตำแหน่ง', value: member?.RoleThai },
                                { label: 'ปี', value: member?.Year },
                                { label: 'เพศ', value: member?.gender },
                            ].map(({ label, value }, index) => (
                                <div key={index} className="flex flex-nowrap items-start gap-2">
                                    <div className="font-semibold text-gray-500 min-w-[100px] whitespace-nowrap">{label}</div>
                                    {isLoading ? (
                                        <div className="h-4 w-full bg-gray-300 animate-pulse rounded mb-2 sm:mb-0"></div>
                                    ) : (
                                        <div className="text-gray-400 mb-2 sm:mb-0 line-clamp-2 break-words">{value || '-'}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                <div className="xl:col-span-3 space-y-4">
                    <div className="border border-gray-100 rounded-md p-4 bg-gradient-to-t from-white to-white/75 z-10 relative overflow-hidden">
                        <h1 className="text-[24px] font-bold mb-4 text-blue-950">เกี่ยวกับผู้ประกอบการ</h1>

                        {isLoading ? (
                            <div className="space-y-3">
                                <div className="h-4 w-full bg-gray-300 animate-pulse rounded"></div>
                                <div className="h-4 w-full bg-gray-300 animate-pulse rounded"></div>
                                <div className="h-4 w-full bg-gray-300 animate-pulse rounded"></div>
                                <div className="h-4 w-3/4 bg-gray-300 animate-pulse rounded"></div>
                                <div className="h-4 w-full bg-gray-300 animate-pulse rounded"></div>
                                <div className="h-4 w-5/6 bg-gray-300 animate-pulse rounded"></div>
                            </div>
                        ) : (
                            <div
                                className={`transition-all duration-700 ease-in-out overflow-hidden relative ${isExpanded
                                    ? "max-h-none"
                                    : ReadMoreButton
                                        ? "max-h-36"
                                        :
                                        "max-h-none" // แสดงเกี่ยวกับผู้ประกอบการทั้งหมดหากไม่เกิน 5 บรรทัด
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
            </div>
        </>
    )
}
