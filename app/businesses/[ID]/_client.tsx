"use client"
import { useParams } from "next/navigation"
import Footer from "@/app/components/footer"
import "swiper/css"
import "swiper/css/pagination"
import "@fancyapps/ui/dist/fancybox/fancybox.css"
import { useState, useEffect } from "react"
import OwnerProduct from "./_OwnerProduct"
import BusinessDetailComponent from "./_BusinessDetail"
import axios from "axios"

const sampleYoutubeVideos: YouTubeVideo[] = [
    {
        id: "lC72308b18Y",
        url: "https://www.youtube.com/watch?v=lC72308b18Y&t=7s",
        title: "Marks within Patterns of Clay : koyori Season 2 [ENG]",
    },
    {
        id: "vWvjqOVJOio",
        url: "https://www.youtube.com/watch?v=vWvjqOVJOio",
        title: "Koyori Project โครงการพัฒนานักออกแบบรุ่นใหม่ สู่การเพิ่มรายได้งานหัตถกรรมไทยพื้นที่ภาคเหนือตอ",
    },
    {
        id: "rvaHMcgLGnk",
        url: "https://www.youtube.com/watch?v=rvaHMcgLGnk",
        title: "MHESI Inside ตอน Koyori Project 2021งานวิจัยเพิ่มสมรรถนะการออกแบบงานหัตถกรรมพื้นเมือง",
    },
    {
        id: "HccWHra-y_g",
        url: "https://www.youtube.com/watch?v=HccWHra-y_g",
        title: "นวัตหัตถศิลป์แห่งล้านนา | koyori หลอมรวม สืบสาน งานหัตถศิลป์",
    },
    {
        id: "iCCB5s4X0dc",
        url: "https://www.youtube.com/watch?v=iCCB5s4X0dc",
        title: "ผลิตภัณฑ์ท้องถิ่นจากมิตรสองวัย | koyori หลอมรวม สืบสาน งานหัตถศิลป์",
    },
    {
        id: "6aq1AcgKJ_U",
        url: "https://www.youtube.com/watch?v=6aq1AcgKJ_U",
        title: `กระทรวง อว.สนับสนุนโครงการ "Koyori Project 2021" หวังเพิ่มมูลค่าหัตถกรรมชุมชนในยุค New Normal`,
    },
    {
        id: "zG3x3qAF534",
        url: "https://www.youtube.com/watch?v=zG3x3qAF534",
        title: "รอยยิ้มจากธรรมชาติ : koyori หลอมรวม สืบสาน งานหัตถศิลป์ ซีซัน 2 [ไทย]",
    },
    {
        id: "Qiib6swlTY4",
        url: "https://www.youtube.com/watch?v=Qiib6swlTY4",
        title: "​หัตถศิลป์จากผลผลิตทางธรรมชาติ | Koyori หลอมรวม สืบสาน งานหัตถศิลป์",
    },
]

export interface Business {
    BusinessID: number;
    Year: number;
    BusiTypeId?: number; // อาจไม่ต้องใส่ถ้ามีแค่ชื่อประเภท
    BussinessName: string;
    BussinessNameEng: string;
    AddressThai: string;
    AddressT?: string;
    TumbolT?: string;
    AmphurT?: string;
    ProvinceT?: string;
    ZipCodeT?: string;
    CountryT?: string;
    AddressEng?: string | null;
    AddressE?: string | null;
    TumbolE?: string | null;
    AmphurE?: string | null;
    ProvinceE?: string;
    ZipCodeE?: string | null;
    CountryE?: string | null;
    Latitude: string;
    Longtitude: string;
    picture: string;
    username?: string;
    password?: string;

    memberNameThai?: string;
    memberNameEng?: string;
    memberRoleThai?: string;
    memberRoleEng?: string;
    memberPosition?: string;
    memberNationality?: string;
    memberGender?: string;
    memberContact?: string;
    BusiTypeName_TH?: string;
    BusiTypeName_EN?: string;
    description_TH?: string;
    description_EN?: string;
    description_JP?: string;
    url?: string;
    contactUs: MemberContactUsInfo
    Contact?: string
    memberID?: number
    vedio: YouTubeVideo[]

    banner?: string
    memberpicture?: string
}


interface MemberContactUsInfo {
    facebook_name?: string
    facebook_url?: string
    instagram_name?: string
    instagram_url?: string
    lineId_name?: string
    line_url?: string
    email?: string
    phone?: string
    tiktok_name?: string
    tiktok_url?: string
    website_name?: string
    website_url?: string
    youtube_name?: string
    youtube_url?: string
}

export interface YouTubeVideo {
    id: string
    url: string
    title?: string
}

export interface Material {
    ID: number
    Material: string
}

export interface Product {
    ID: number;
    productName: string;
    price: number;
    mainMaterial: number;
    subMaterial1: number;
    subMaterial2: number;
    subMaterial3: number;
    bussinessID: number;
    image: string;
    sketch: string;
    description: string | null;
    color: string | null;
    size: string | null;
    materialMain: Material;
    materialSub1: Material;
    materialSub2: Material;
    materialSub3: Material;
    businessinfo: Business;
}
export default function StoreClientPage() {
    const params = useParams()
    const idParam = params.ID as string
    const [storeId, setStoreId] = useState<number | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [currentStore, setCurrentStore] = useState<Business | null>(null)
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([])

    useEffect(() => {
        if (idParam) {
            const parsedId = Number.parseInt(idParam, 10)
            if (!isNaN(parsedId)) {
                setStoreId(parsedId)
            } else {
                setError("รหัสร้านค้าไม่ถูกต้อง (Invalid ID format)")
                setIsLoading(false)
                setCurrentStore(null)
                setFilteredProducts([])
            }
        } else {
            setError("ไม่พบรหัสร้านค้าใน URL")
            setIsLoading(false)
        }
    }, [idParam])

    useEffect(() => {
        if (storeId === null) {
            return
        }

        const fetchStoreDataAndThenProducts = async () => {
            setIsLoading(true)
            setError(null)
            setCurrentStore(null)
            setFilteredProducts([])

            try {
                console.log("Fetching store data for ID:", storeId)
                const storeResponse = await axios.get(`/api/business/${storeId}`)

                console.log("Raw API Response:", storeResponse.data)
                console.log("Response type:", typeof storeResponse.data)
                console.log("Is array:", Array.isArray(storeResponse.data))

                let getBusiness: Business | null = null
                const responseData = storeResponse.data

                // ปรับปรุงการ parse ข้อมูลให้ชัดเจนขึ้น
                if (responseData) {
                    // กรณีที่ response เป็น array โดยตรง
                    if (Array.isArray(responseData)) {
                        console.log("Response is array, length:", responseData.length)
                        getBusiness = responseData.find((s: Business) => s.BusinessID === storeId) || null
                        console.log("Found business from array:", getBusiness?.BussinessName)
                    }
                    // กรณีที่ response เป็น object ที่มี data property เป็น array
                    else if (responseData.data && Array.isArray(responseData.data)) {
                        console.log("Response has data array, length:", responseData.data.length)
                        getBusiness = responseData.data.find((s: Business) => s.BusinessID === storeId) || null
                        console.log("Found business from data array:", getBusiness?.BussinessName)
                    }
                    // กรณีที่ response เป็น business object เดียว
                    else if (responseData.BusinessID) {
                        console.log("Response is single business object, ID:", responseData.BusinessID)
                        if (responseData.BusinessID === storeId) {
                            getBusiness = responseData as Business
                            console.log("Using single business object:", getBusiness.BussinessName)
                        }
                    }
                    else {
                        console.log("Unknown response structure:", Object.keys(responseData))
                    }
                }


                setCurrentStore(getBusiness)

                if (getBusiness) {
                    try {
                        console.log("Fetching products for business ID:", getBusiness.BusinessID)
                        const productResponse = await axios.get<Product[]>("/api/productByBus", {
                            params: { businessID: getBusiness.BusinessID },
                        })
                        console.log("Products fetched:", productResponse.data?.length || 0)
                        setFilteredProducts(productResponse.data || [])
                    } catch (productError: any) {
                        console.error("Failed to fetch products:", productError)
                        setFilteredProducts([])
                    }
                } else {
                    console.log("No business found, setting empty products")
                    setFilteredProducts([])
                }
            } catch (err: any) {
                console.error("Failed to fetch store data:", err)
                console.error("Error response:", err.response?.data)
                setError(err.response?.data?.error || "เกิดข้อผิดพลาดในการโหลดข้อมูลร้านค้า กรุณาลองใหม่อีกครั้ง")
                setCurrentStore(null)
                setFilteredProducts([])
            } finally {
                setIsLoading(false)
            }
        }

        fetchStoreDataAndThenProducts()
    }, [storeId])



    if (error) {
        return (
            <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
                <h2 className="text-2xl font-semibold text-red-600 mb-4">เกิดข้อผิดพลาด</h2>
                <p className="text-gray-700">{error}</p>
            </div>
        )
    }



    return (
        <>
            <div className="mx-4 md:mx-auto md:container lg:container lg:mx-auto">
                <div className="fixed inset-0 z-0 flex justify-start items-start top-40">
                    <div className="w-10/12 h-40 md:h-96 bg-gradient-to-tr from-cyan-500 via-blue-300 to-green-500 rounded-[60%] blur-3xl opacity-30 transform scale-110 rotate-[20deg] md:rotate-[20deg]"></div>
                </div>
                <div className="fixed inset-0 z-0 flex justify-end items-end bottom-0">
                    <div className="w-96 h-96 md:h-96 bg-gradient-to-tr from-cyan-500 via-blue-300 to-red-500 rounded-[60%] blur-3xl opacity-30 transform scale-80 rotate-[0deg] md:rotate-[140deg]"></div>
                </div>

                <main className="pt-12 md:pt-[68px] relative z-10">
                    <BusinessDetailComponent store={currentStore} isLoading={isLoading} videos={sampleYoutubeVideos} />
                    <OwnerProduct products={filteredProducts} isLoading={isLoading} />
                </main>
            </div>
            <Footer />
        </>
    )
}
