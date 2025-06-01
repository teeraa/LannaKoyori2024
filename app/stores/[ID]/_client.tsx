"use client"
import { useParams } from "next/navigation"
import Footer from "@/app/components/footer" // ตรวจสอบ path นี้ให้ถูกต้อง
import "swiper/css"
import "swiper/css/pagination"
import "@fancyapps/ui/dist/fancybox/fancybox.css"
import { useState, useEffect } from "react"
import OwnerProduct from "./_OwnerProduct" // ตรวจสอบ path นี้ให้ถูกต้อง
import StoreDetailComponent from "./_StoreDetail" // ตรวจสอบ path นี้ให้ถูกต้อง
import axios from "axios"

export interface PersonInfo {
    ID: number
    Contact: string
    RoleThai: string
    gender: string
    picture: string
    NameThai: string
    NameEng: string
    description?: string
}

export interface Store {
    ID: number
    BussinessName: string
    BussinessNameEng: string
    DataYear: string | number
    personinfo: PersonInfo
    // เพิ่ม properties อื่นๆ ของ Store ตามต้องการ
}

export interface Product {
    ID: number
    productName?: string
    businessinfo?: {
        DataYear?: string | number
        BussinessNameEng?: string
        NameThai?: string
    }
    image?: string
}

export default function StoreClientPage() {
    const params = useParams()
    const idParam = params.ID as string // รับ ID จาก params เป็น string ก่อน
    const [storeId, setStoreId] = useState<number | null>(null)

    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [currentStore, setCurrentStore] = useState<Store | null>(null)
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
            // ถ้า storeId ยังไม่ได้ถูกตั้งค่า (เช่น จากการ parsing error หรือ idParam ไม่มี)
            // isLoading และ error ควรถูกจัดการใน useEffect ก่อนหน้าแล้ว
            return
        }

        const fetchStoreDataAndThenProducts = async () => {
            setIsLoading(true)
            setError(null)
            setCurrentStore(null) // Reset store data
            setFilteredProducts([]) // Reset product data

            try {
                // 1. Fetch Store Data
                const storeResponse = await axios.get<{ data: Store[] } | Store[] | Store>(`/api/business/${storeId}`)

                let foundStore: Store | null = null
                const responseData = storeResponse.data
console.log("responseData:", responseData)
                if (responseData) {
                    if (Array.isArray(responseData)) {
                        foundStore = responseData.find((s: Store) => s.ID === storeId) || null
                    } else if (
                        typeof responseData === "object" &&
                        "data" in responseData &&
                        Array.isArray((responseData as any).data)
                    ) {
                        foundStore = (responseData as any).data.find((s: Store) => s.ID === storeId) || null
                    } else if (typeof responseData === "object" && "ID" in responseData) {
                        if ((responseData as Store).ID === storeId) {
                            foundStore = responseData as Store
                        }
                    }
                }

                setCurrentStore(foundStore)

                // 2. Fetch Product Data if Store is found
                if (foundStore) {
                    try {
                        const productResponse = await axios.get<Product[]>("/api/productByBus", {
                            params: { businessID: foundStore.ID },
                        })
                        setFilteredProducts(productResponse.data || [])
                    } catch (productError: any) {
                        console.error("Failed to fetch products:", productError)
                        // อาจจะตั้ง error เฉพาะสำหรับสินค้า หรือปล่อยให้ error หลักจัดการ
                        // setError("เกิดข้อผิดพลาดในการโหลดข้อมูลสินค้า")
                        setFilteredProducts([]) // Ensure products are empty on error
                    }
                } else {
                    // ถ้าไม่พบร้านค้า ก็ไม่จำเป็นต้องโหลดสินค้า และ currentStore จะเป็น null
                    // ซึ่งจะทำให้แสดง "ไม่พบข้อมูลร้านค้า" ด้านล่าง
                    setFilteredProducts([])
                }
            } catch (err: any) {
                console.error("Failed to fetch store data:", err)
                setError(err.response?.data?.error || "เกิดข้อผิดพลาดในการโหลดข้อมูลร้านค้า กรุณาลองใหม่อีกครั้ง")
                setCurrentStore(null) // Clear data on error
                setFilteredProducts([])
            } finally {
                setIsLoading(false)
            }
        }

        fetchStoreDataAndThenProducts()
    }, [storeId]) // ทำงานเมื่อ storeId (ที่เป็น number) เปลี่ยน

    // ส่วนการแสดงผล (Error, Not Found, Content)
    if (error) {
        return (
            <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
                <h2 className="text-2xl font-semibold text-red-600 mb-4">เกิดข้อผิดพลาด</h2>
                <p className="text-gray-700">{error}</p>
            </div>
        )
    }

    // แสดง "Not Found" เฉพาะเมื่อ isLoading เสร็จสิ้น และยังไม่มี currentStore
    if (!isLoading && !currentStore) {
        return (
            <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
                <h2 className="text-2xl font-semibold text-gray-700">ไม่พบข้อมูลร้านค้า</h2>
            </div>
        )
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

                <main className="pt-12 md:pt-[68px] relative z-10">
                    <StoreDetailComponent store={currentStore} isLoading={isLoading} />
                    <OwnerProduct products={filteredProducts} isLoading={isLoading /* หรือ isLoadingProducts ถ้าแยก state */} />
                </main>
            </div>
            <Footer />
        </>
    )
}
