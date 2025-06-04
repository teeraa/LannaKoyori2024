"use client"
import { useParams } from "next/navigation"
import Footer from "@/app/components/footer"
import "swiper/css"
import "swiper/css/pagination"
import "@fancyapps/ui/dist/fancybox/fancybox.css"
import { useState, useEffect } from "react"
import OwnerProduct from "./_OwnerProduct"
import StoreDetailComponent from "./_StoreDetail"
import axios from "axios"

const sampleYoutubeVideos: YouTubeVideo[] = [
  { id: "lC72308b18Y", url: "https://www.youtube.com/watch?v=lC72308b18Y&t=7s", title: "Marks within Patterns of Clay : koyori Season 2 [ENG]" },
  { id: "vWvjqOVJOio", url: "https://www.youtube.com/watch?v=vWvjqOVJOio", title: "Koyori Project โครงการพัฒนานักออกแบบรุ่นใหม่ สู่การเพิ่มรายได้งานหัตถกรรมไทยพื้นที่ภาคเหนือตอ" },
  { id: "rvaHMcgLGnk", url: "https://www.youtube.com/watch?v=rvaHMcgLGnk", title: "MHESI Inside ตอน Koyori Project 2021งานวิจัยเพิ่มสมรรถนะการออกแบบงานหัตถกรรมพื้นเมือง" },
  { id: "HccWHra-y_g", url: "https://www.youtube.com/watch?v=HccWHra-y_g", title: "นวัตหัตถศิลป์แห่งล้านนา | koyori หลอมรวม สืบสาน งานหัตถศิลป์" },
  { id: "iCCB5s4X0dc", url: "https://www.youtube.com/watch?v=iCCB5s4X0dc", title: "ผลิตภัณฑ์ท้องถิ่นจากมิตรสองวัย | koyori หลอมรวม สืบสาน งานหัตถศิลป์" },
  { id: "6aq1AcgKJ_U", url: "https://www.youtube.com/watch?v=6aq1AcgKJ_U", title: `กระทรวง อว.สนับสนุนโครงการ "Koyori Project 2021" หวังเพิ่มมูลค่าหัตถกรรมชุมชนในยุค New Normal` },
  { id: "zG3x3qAF534", url: "https://www.youtube.com/watch?v=zG3x3qAF534", title: "รอยยิ้มจากธรรมชาติ : koyori หลอมรวม สืบสาน งานหัตถศิลป์ ซีซัน 2 [ไทย]" },
  { id: "Qiib6swlTY4", url: "https://www.youtube.com/watch?v=Qiib6swlTY4", title: "​หัตถศิลป์จากผลผลิตทางธรรมชาติ | Koyori หลอมรวม สืบสาน งานหัตถศิลป์" },
  
]



export interface YouTubeVideo {
    id: string
    url: string
    title?: string
}

export interface BusinessInfo {
    banner_image_url: string
    ID: number
    DataYear: number
    BusiTypeId: string
    BussinessName: string
    BussinessNameEng: string
    AddressThai: string
    AddressT: string
    TumbolT: string
    AmphurT: string
    ProvinceT: string
    ZipCodeT: string
    CountryT: string
    AddressEng: string
    AddressE: string
    TumbolE: string
    AmphurE: string
    ProvinceE: string
    ZipCodeE: string
    CountryE: string
    Latitude: string
    Longtitude: string
    picture: string
    username: string
    password: string
    personinfo?: Member
    youtubeVideos?: YouTubeVideo[]
}

const youtube: YouTubeVideo[] = [
    {
        id: "9eT0eK2XnI8",
        url: "https://www.youtube.com/watch?v=Q4V3zN0Xrdo",
        title: "clip1",
    },
    {
        id: "9eT0eK2XnI8",
        url: "https://www.youtube.com/watch?v=Q4V3zN0Xrdo",
        title: "clip2",
    },
    {
        id: "9eT0eK2XnI8",
        url: "https://www.youtube.com/watch?v=Q4V3zN0Xrdo",
        title: "clip3",
    },
]

export interface Material {
    ID: number
    Material: string
}

interface MemberContactUsInfo {
  facebook_name?: string;
  facebook_url?: string;
  instagram_name?: string;
  instagram_url?: string;
  lineId_name?: string; 
  line_url?: string;
  email?: string;
  phone?: string;
  tiktok_name?: string; 
  tiktok_url?: string;
  website_name?: string;
  website_url?: string;
  youtube_name?: string;
  youtube_url?: string;
}

export interface Member {
    ProvinceT: string
    BussinessNameEng: any
    DataYear: string
    ID: number
    BusinessID: number
    NameThai: string
    NameEng: string
    RoleThai: string
    RoleEng: string
    Position: string
    nationality: string
    gender: string
    Institute: string
    Contact: string
    contactUs: MemberContactUsInfo
    Year: number
    picture: string
    businessinfo: BusinessInfo
    description?: string
}

export interface Product {
    ID: number
    productName: string
    price: number
    mainMaterial: number
    subMaterial1: number
    subMaterial2: number
    subMaterial3: number
    bussinessID: number
    image: string
    sketch: string
    description: string | null
    color: string | null
    size: string | null
    materialMain: Material
    materialSub1: Material
    materialSub2: Material
    materialSub3: Material
    businessinfo: Member
}

export default function StoreClientPage() {
    const params = useParams()
    const idParam = params.ID as string
    const [storeId, setStoreId] = useState<number | null>(null)

    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [currentStore, setCurrentStore] = useState<BusinessInfo | null>(null)
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([])

    useEffect(() => {
        // แปลง ID จาก param เป็น number
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
                const storeResponse = await axios.get<{ data: BusinessInfo[] } | BusinessInfo[] | BusinessInfo>(
                    `/api/business/${storeId}`,
                )

                let foundStore: BusinessInfo | null = null
                const responseData = storeResponse.data
                console.log("responseData:", responseData)
                if (responseData) {
                    if (Array.isArray(responseData)) {
                        foundStore = responseData.find((s: BusinessInfo) => s.ID === storeId) || null
                    } else if (
                        typeof responseData === "object" &&
                        "data" in responseData &&
                        Array.isArray((responseData as any).data)
                    ) {
                        foundStore = (responseData as any).data.find((s: BusinessInfo) => s.ID === storeId) || null
                    } else if (typeof responseData === "object" && "ID" in responseData) {
                        if ((responseData as BusinessInfo).ID === storeId) {
                            foundStore = responseData as BusinessInfo
                        }
                    }
                }

                setCurrentStore(foundStore)

                if (foundStore) {
                    try {
                        const productResponse = await axios.get<Product[]>("/api/productByBus", {
                            params: { businessID: foundStore.ID },
                        })
                        setFilteredProducts(productResponse.data || [])
                    } catch (productError: any) {
                        console.error("Failed to fetch products:", productError)

                        setFilteredProducts([])
                    }
                } else {

                    setFilteredProducts([])
                }
            } catch (err: any) {
                console.error("Failed to fetch store data:", err)
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

    if (!isLoading && !currentStore) {
        return (
            <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
                <h2 className="text-2xl font-semibold text-gray-700">ไม่พบข้อมูลร้านค้า</h2>
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
                    <StoreDetailComponent 
                    store={currentStore} 
                    isLoading={isLoading} 
                    videos={sampleYoutubeVideos}
                    />
                    <OwnerProduct products={filteredProducts} isLoading={isLoading} />
                </main>
            </div>
            <Footer />
        </>
    )
}
