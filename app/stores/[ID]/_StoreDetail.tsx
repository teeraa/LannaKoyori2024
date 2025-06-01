import Image from "next/image"
import type { Store } from "./_client"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { HiExternalLink } from "react-icons/hi";
interface StoreDetailProps {
    store: Store | null
    isLoading: boolean
}

const SkeletonText = ({ className = "w-full" }: { className?: string }) => (
    <div
        className={`bg-gray-300 animate-pulse rounded ${className}`}
        style={{ height: "1em", marginBottom: "0.25em" }}
    ></div>
)

const SkeletonParagraph = ({ lines = 3 }: { lines?: number }) => (
    <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
            <SkeletonText key={i} className={i === lines - 1 ? "w-4/5" : "w-full"} />
        ))}
    </div>
)

export default function StoreDetailComponent({ store, isLoading }: StoreDetailProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [showContent, setShowContent] = useState(false)
    const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({})
    const [imageLoading, setImageLoading] = useState<{ [key: string]: boolean }>({
        banner: true,
        profile: true,
    })
    const checkLongTextRef = useRef<HTMLParagraphElement>(null)
    const [ReadMoreButton, setReadMoreButton] = useState(false)
    const InfoRow = ({
        label,
        value,
        isLoadingValue,
    }: { label: string; value: string | number | undefined; isLoadingValue: boolean }) => (
        <>
            <div className="font-semibold text-gray-600">{label}:</div>
            {isLoadingValue ? (
                <SkeletonText className="w-3/5" />
            ) : (
                <div className="text-gray-500 text-wrap">{value || "-"}</div>
            )}
        </>
    )
    useEffect(() => {
        if (!isLoading && store && checkLongTextRef.current) {
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
    }, [isLoading, store])

    const shouldShowImage = !isLoading && store

    const handleImageError = (imageKey: string) => {
        setImageErrors((prev) => ({ ...prev, [imageKey]: true }))
        setImageLoading((prev) => ({ ...prev, [imageKey]: false }))
    }

    const handleImageLoad = (imageKey: string) => {
        setImageLoading((prev) => ({ ...prev, [imageKey]: false }))
    }

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

                    // <Image
                    //     src={`${store?.Banner}`}
                    //     layout="fill"
                    //     alt=""
                    //     priority={true}
                    //     quality={90}
                    //     style={{
                    //         objectFit: "cover",
                    //         objectPosition: "top",
                    //         width: "100%",
                    //         height: "100%",
                    //     }}
                    //     onError={() => handleImageError("banner")}
                    //     onLoad={() => handleImageLoad("banner")}
                    // />
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 py-4 md:p-4 md:py-4 lg:px-0">
                {/* Left Column: Store Info */}
                <div className="col-span-1 lg:col-span-2 flex flex-col items-start justify-start p-4 bg-white/75 backdrop-blur-sm rounded-lg z-10 border border-gray-200">
                    {isLoading ? (
                        <SkeletonText className="w-full h-8 mb-2" />
                    ) : (
                        <h1 className="text-[32px] font-bold text-gray-600 text-wrap mb-2">
                            {store?.BussinessName || "ชื่อร้าน..."}&nbsp;
                        </h1>
                    )}
                    {isLoading ? (
                        <SkeletonText className="w-full h-8 mb-6" />
                    ) : (
                        <h2 className="text-lg lg:text-xl text-gray-500 text-wrap mb-6">
                            ({store?.BussinessNameEng || "Store Name..."})
                        </h2>
                    )}

                    <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-4 text-sm lg:text-base text-gray-700 w-full">
                        <InfoRow label="เบอร์โทรศัพท์" value={store?.personinfo.Contact} isLoadingValue={isLoading} />
                        <InfoRow label="ตำแหน่ง" value={store?.personinfo.RoleThai} isLoadingValue={isLoading} />
                        <InfoRow label="ปี" value={store?.DataYear} isLoadingValue={isLoading} />
                        <InfoRow label="เพศ" value={store?.personinfo.gender} isLoadingValue={isLoading} />
                    </div>
                </div>

                {/* Right Column: Entrepreneur Info */}
                <div className="col-span-1 lg:col-span-3 border border-gray-200 rounded-lg p-4 bg-white/75 backdrop-blur-sm relative">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
                        <div className="grid place-items-center md:flex justify-center items-start gap-4 w-full md:w-auto">
                            <div className="relative w-[160px] h-[160px] md:w-[180px] md:h-[180px] flex-shrink-0">
                                {isLoading ? (
                                    <div className="w-full h-full bg-gray-300 rounded-md animate-pulse"></div>
                                ) : (
                                    <Image
                                        src={
                                            store?.personinfo.picture && store?.DataYear && store?.BussinessNameEng
                                                ? `/images/entreprenuer/Koyori_${store.DataYear}/${store.BussinessNameEng.replace(/\s+/g, "")}/Profile/${store.personinfo.picture}`
                                                : "/placeholder.svg?width=180&height=180&text=Profile"
                                        }
                                        className="rounded-md border-4 border-white"
                                        layout="fill"
                                        objectFit="cover"
                                        alt={`${store?.personinfo.NameThai || "ผู้ประกอบการ"} profile picture`}
                                    />
                                )}
                            </div>
                            <div className="flex flex-col gap-1 mt-4 md:mt-0 text-center md:text-start">
                                <span className="text-[18px] font-medium text-white bg-blue-950 px-2 py-1 rounded-md w-fit mx-auto md:mx-0">
                                    ผู้ประกอบการ
                                </span>

                                {isLoading ? (
                                    <SkeletonText className="w-48 h-8 mt-1 mx-auto md:mx-0" />
                                ) : (
                                    <Link href={`/members/${store?.personinfo.ID}`} className="text-blue-950 m-0 hover:underline underline-offset-4 ">
                                        <h1 className="flex items-center gap-2 text-[20px] font-bold text-wrap mt-1">
                                            {store?.personinfo.NameThai || "-"}
                                            <span><HiExternalLink size={28} /></span>
                                        </h1>
                                    </Link>
                                )}
                                {isLoading ? (
                                    <SkeletonText className="w-36 h-6 mt-1 mx-auto md:mx-0" />
                                ) : (
                                    <h2 className="text-[20px] text-gray-500 text-wrap">
                                        {store?.personinfo.NameEng || "-"}
                                    </h2>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* About Entrepreneur Section */}
                    <div className="mt-6">
                        <h3 className="text-xl font-semibold mb-3 text-gray-700 border-b pb-2">
                            เกี่ยวกับผู้ประกอบการ {/* Static Text */}
                        </h3>
                        <div className="max-h-60 overflow-y-auto text-gray-600 prose prose-sm lg:prose-base">
                            {isLoading ? (
                                <SkeletonParagraph lines={5} />
                            ) : (
                                <p>{store?.personinfo.description || "ยังไม่มีข้อมูลเกี่ยวกับผู้ประกอบการท่านนี้"}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
