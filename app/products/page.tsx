"use client"
import { useEffect, useState, useCallback, useRef } from "react"
import type React from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

import Pagination from "../components/pagination"
import ProductCard from "../components/ProductCard"
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io"
import { LuLeaf } from "react-icons/lu"
import { FaRegLightbulb } from "react-icons/fa6"
import { VscSettings } from "react-icons/vsc"
import { IoClose, IoBagOutline } from "react-icons/io5"
import { IoIosSearch } from "react-icons/io"
import axios from "axios"

export interface Product {
  ID: number
  productName: string
  price: number
  bussinessID: number
  BussinessName: string
  image: string
  sketch: string
  description: string | null
  color: string | null
  size: string | null
  materialMain: Material
}

export interface Material {
  ID: number
  Material: string
}

// Corrected interface to match the API response for business types
interface BusinessType {
  BusiTypeId: number
  BusiTypeName_TH: string
  BusiTypeName_EN: string
}
export default function ProductList() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState("")
  const [FilterToggle, setFilterToggle] = useState(false)
  const [MaterialDropdown, setMaterialDropdown] = useState(true)
  const [TypeDropdown, setTypeDropdown] = useState(true)

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [businessType, setBusinessType] = useState<BusinessType[]>([])
  const [searchbtn_moblie, setsearchbtn_moblie] = useState(false)

  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null)
  // State now holds the numeric ID
  const [selectedType, setSelectedType] = useState<number | null>(null)

  const [error, setError] = useState<string | null>(null)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isContentLoading, setIsContentLoading] = useState(false)

  const initialFetchDone = useRef(false)

  const [meta, setMeta] = useState<{
    page?: number
    limit?: number
    totalPages?: number
    totalData?: number
  }>({})

  const currentPage = Number.parseInt(searchParams.get("page") || "1", 10)
  const pageSize = Number.parseInt(searchParams.get("limit") || "12", 10)

  useEffect(() => {
    const currentParams = new URLSearchParams(searchParams.toString())
    let needsUpdate = false

    if (!currentParams.has("page")) {
      currentParams.set("page", "1")
      needsUpdate = true
    }
    if (!currentParams.has("limit")) {
      currentParams.set("limit", "12")
      needsUpdate = true
    }

    if (needsUpdate) {
      router.replace(`${pathname}?${currentParams.toString()}`, { scroll: false })
    }
  }, [searchParams, router, pathname])

  useEffect(() => {
    const handleResize = () => {
      setsearchbtn_moblie(window.innerWidth < 640)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  function toggleSidebar() {
    setFilterToggle(!FilterToggle)
  }
  const closeFilter = () => {
    setFilterToggle(false)
  }

  const fetchProductsAndUpdateState = useCallback(
    async (
      currentSearch: string,
      currentMaterial: string | null,
      currentBusiTypeId: number | null, // Parameter is the ID
      page: number,
      limit: number,
      isInitialProductFetch = false,
    ) => {
      if (!isInitialProductFetch) {
        setIsContentLoading(true)
      }
      setError(null)
      try {
        const params: Record<string, any> = { page, limit }
        if (currentSearch) params.search = currentSearch
        if (currentMaterial) params.material = currentMaterial
        // The parameter NAME is 'businessType', but the VALUE is the numeric ID
        if (currentBusiTypeId) params.businessType = currentBusiTypeId

        const response = await axios.get("/api/products", { params })

        const productsPayload = response.data.payload || response.data
        const metaPayload = response.data.meta

        setFilteredProducts(Array.isArray(productsPayload) ? productsPayload : [])

        if (metaPayload && typeof metaPayload.totalData === "number" && typeof metaPayload.total_pages === "number") {
          // ใช้ total_pages ตามที่ API ส่งมา
          setMeta({
            page: metaPayload.page,
            limit: metaPayload.limit,
            totalPages: metaPayload.total_pages,
            totalData: metaPayload.totalData
          })
        } else {
          const allFetchedProductsCount = Array.isArray(productsPayload) ? productsPayload.length : 0
          setMeta({
            page: page,
            limit: limit,
            totalPages: Math.ceil(allFetchedProductsCount / limit) || 1,
            totalData: allFetchedProductsCount,
          })
        }
      } catch (error: any) {
        setError(error.response?.data?.error || "Failed to fetch products")
        setFilteredProducts([])
        setMeta({ page, limit, totalPages: 1, totalData: 0 })
      } finally {
        if (!isInitialProductFetch) {
          setIsContentLoading(false)
        }
      }
    },
    [],
  )

  useEffect(() => {
    // Read the 'businessType' parameter from the URL, as that's what we're setting
    const initialSearch = searchParams.get("search") || ""
    const initialMaterial = searchParams.get("material") || null
    const initialType = searchParams.get("businessType") ? Number(searchParams.get("businessType")) : null

    setSearch(initialSearch)
    setSelectedMaterial(initialMaterial)
    setSelectedType(initialType)

    if (!searchParams.has("page") || !searchParams.has("limit")) {
      return
    }

    const performInitialLoad = async () => {
      setIsInitialLoading(true)

      const fetchFilterOptions = async () => {
        try {
          const [materialsData, businessTypeDataRes] = await Promise.allSettled([
            axios.get("/api/materials"),
            axios.get("/api/businessType"),
          ])

          if (materialsData.status === "fulfilled") {
            setMaterials(materialsData.value.data)
          } else {
            console.error("Failed to fetch materials:", materialsData.reason)
            setMaterials([])
          }

          if (businessTypeDataRes.status === "fulfilled") {
            setBusinessType(businessTypeDataRes.value.data)
          } else {
            console.error("Failed to fetch business types:", businessTypeDataRes.reason)
            setBusinessType([])
          }
        } catch (err) {
          console.error("Error fetching filter options:", err)
          setMaterials([])
          setBusinessType([])
        }
      }

      await Promise.all([
        fetchFilterOptions(),
        fetchProductsAndUpdateState(initialSearch, initialMaterial, initialType, currentPage, pageSize, true),
      ])

      setIsInitialLoading(false)
      initialFetchDone.current = true
    }

    const performSubsequentLoad = () => {
      fetchProductsAndUpdateState(initialSearch, initialMaterial, initialType, currentPage, pageSize, false)
    }

    if (!initialFetchDone.current) {
      performInitialLoad()
    } else {
      performSubsequentLoad()
    }
  }, [searchParams, fetchProductsAndUpdateState, currentPage, pageSize])

  const updateURLParams = useCallback(
    (newParamsUpdates: Record<string, string | number | null>) => {
      const currentParams = new URLSearchParams(searchParams.toString())
      let pageNeedsReset = false
      let isLimitChange = false

      Object.entries(newParamsUpdates).forEach(([key, value]) => {
        const oldValue = currentParams.get(key)
        if (value !== null && value !== undefined && String(value).trim() !== "") {
          if (String(value) !== oldValue) {
            currentParams.set(key, String(value))
            if (key !== "page") {
              pageNeedsReset = true
            }
            if (key === "limit") {
              isLimitChange = true
            }
          }
        } else {
          if (currentParams.has(key)) {
            currentParams.delete(key)
            if (key !== "page") {
              pageNeedsReset = true
            }
          }
        }
      })
;
      if (pageNeedsReset) {
        if (!("page" in newParamsUpdates) || isLimitChange) {
          currentParams.set("page", "1")
        }
      }

      if (!currentParams.has("page")) currentParams.set("page", "1")
      if (!currentParams.has("limit")) currentParams.set("limit", "12")

      router.push(`${pathname}?${currentParams.toString()}`, { scroll: false })
    },
    [router, pathname, searchParams],
  )

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateURLParams({ search: search, page: 1 })
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch(value)
  }

  const handlePageChange = (newPage: number) => {
    updateURLParams({ page: newPage })
  }

  const handleLimitChange = (newLimit: number) => {
    updateURLParams({ limit: newLimit, page: 1 })
  }

  const handleMaterialFilter = (materialClicked: string) => {
    const newMaterial = selectedMaterial === materialClicked ? null : materialClicked
    updateURLParams({ material: newMaterial, page: 1 })
  }

  const handleBusinessTypeFilter = (typeIdClicked: number) => {
    const newTypeId = selectedType === typeIdClicked ? null : typeIdClicked
    updateURLParams({ businessType: newTypeId, page: 1 })
  }

  function isValidUrl(str: string) {
    try {
      new URL(str)
      return true
    } catch {
      return false
    }
  }

  const productsToDisplay = filteredProducts
  const shouldShowFilterLoading = isInitialLoading
  const shouldShowContentLoading = isInitialLoading || isContentLoading

  return (
    <div className="md:container">
      {/* Background gradients */}
      <div className="fixed inset-0 z-0 flex justify-start items-start top-40">
        <div className="w-10/12 h-40 md:h-96 bg-gradient-to-tr from-cyan-500 via-blue-300 to-green-500 rounded-[60%] blur-3xl opacity-30 transform scale-110 rotate-[20deg] md:rotate-[20deg]"></div>
      </div>
      <div className="fixed inset-0 z-0 flex justify-end items-end bottom-0">
        <div className="w-96 h-96 md:h-96 bg-gradient-to-tr from-cyan-500 via-blue-300 to-red-500 rounded-[60%] blur-3xl opacity-30 transform scale-80 rotate-[0deg] md:rotate-[140deg]"></div>
      </div>
      <div className="flex h-full max-h-full md:h-screen lg:h-screen overflow-hidden bg-white/75 border-none border-gray-200 md:border pt-12 lg:pt-[68px] md:pt-[68px]">
        {/* Filter Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 w-3/4 lg:w-1/4 h-full border-l no-scrollbar overflow-y-auto border-gray-200 bg-white transform transition-transform duration-300 ease-in-out z-50 md:z-20 lg:static lg:translate-x-0 ${FilterToggle ? "translate-x-0 w-full" : "-translate-x-full"
            }`}
        >
          <div className="sticky top-0 inset-x-0 z-20 px-4 py-[11px] text-center border-y border-gray-200 bg-gray-50 flex items-center justify-between lg:justify-center md:justify-between">
            <h1 className="text-3xl font-medium text-gray-600">กรองข้อมูล</h1>
            <button onClick={closeFilter} className={`text-2xl text-gray-800 ${!FilterToggle ? "hidden" : "block"}`}>
              <IoClose />
            </button>
          </div>
          <div className="w-full no-scrollbar">
            <div className="w-full overflow-y-auto">
              {/* Material Filter */}
              <div className="mb-4 text-gray-600">
                <button className="w-full text-left py-2 px-4" onClick={() => setMaterialDropdown(!MaterialDropdown)}>
                  <h1 className="flex items-center gap-2">
                    <LuLeaf />
                    <span className="font-semibold">วัสดุ / อุปกรณ์ / ส่วนประกอบ</span>
                    {MaterialDropdown ? (
                      <IoIosArrowUp className="ml-auto w-4 h-4 transform" />
                    ) : (
                      <IoIosArrowDown className="ml-auto w-4 h-4 transform" />
                    )}
                  </h1>
                </button>
                {MaterialDropdown && (
                  <ul className="mt-2 flex flex-wrap gap-4 overflow-y-auto justify-start mx-4">
                    {shouldShowFilterLoading
                      ? Array.from({ length: 5 }).map((_, index) => (
                        <li key={`mat-skeleton-${index}`}>
                          <div className="animate-pulse bg-gray-200 text-md block py-1 px-3 rounded-md border border-gray-300 w-24 h-8"></div>
                        </li>
                      ))
                      : materials.map((mat: Material) => (
                        <li key={mat.ID}>
                          <button
                            onClick={() => handleMaterialFilter(mat.Material)}
                            className={`text-md block py-1 px-3 rounded-md border border-gray-300 font-light transition ${selectedMaterial === mat.Material
                                ? "bg-blue-500 text-white"
                                : "bg-white hover:bg-gray-200 text-gray-800"
                              }`}
                          >
                            {mat.Material}
                          </button>
                        </li>
                      ))}
                  </ul>
                )}
              </div>

              {/* Business Type Filter */}
              <div className="mb-4 text-gray-600">
                <button className="w-full text-left py-2 px-4" onClick={() => setTypeDropdown(!TypeDropdown)}>
                  <h1 className="flex items-center gap-2">
                    <FaRegLightbulb />
                    <span className="font-semibold">ประเภท</span>
                    {TypeDropdown ? (
                      <IoIosArrowUp className="ml-auto w-4 h-4 transform" />
                    ) : (
                      <IoIosArrowDown className="ml-auto w-4 h-4 transform" />
                    )}
                  </h1>
                </button>
                {TypeDropdown && (
                  <ul className="mt-2 flex flex-wrap gap-4 overflow-y-auto justify-start mx-4 max-h-60">
                    {shouldShowFilterLoading
                      ? Array.from({ length: 4 }).map((_, index) => (
                        <li key={`type-skeleton-${index}`}>
                          <div className="animate-pulse bg-gray-200 text-md block py-1 px-3 rounded-md border border-gray-300 w-28 h-8"></div>
                        </li>
                      ))
                      : businessType.map((type: BusinessType) => (
                        // Logic here is correct: use BusiTypeId for key, click handler, and selection check
                        <li key={type.BusiTypeId}>
                          <button
                            onClick={() => handleBusinessTypeFilter(type.BusiTypeId)}
                            className={`text-md block py-1 px-3 rounded-md border border-gray-300 font-light transition ${selectedType === type.BusiTypeId
                                ? "bg-blue-500 text-white"
                                : "bg-white hover:bg-gray-200 text-gray-800"
                              }`}
                          >
                            {type.BusiTypeName_TH}
                          </button>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main
          className={`w-screen flex-1  h-full overflow-y-auto relative no-scrollbar top-[-2px] lg:top-0 md:top-0 transform duration-300 ease-in-out md:border-x border-gray-200 `}
        >
          <div className="sticky top-0  flex-1 overflow-y-auto bg-white/75 backdrop-blur-m z-20  border-none md:border-y border-gray-200 ">
            <div className="bg-gray-50 flex justify-center items-center h-full py-2 px-2 md:px-4 border-y border-gray-200 rounded-none w-full ">
              <button
                className="lg:hidden md:block bg-white text-gray-500 py-1 px-1 rounded-md mr-2 border border-gray-300"
                onClick={toggleSidebar}
              >
                <VscSettings size={24} />
              </button>
              <form onSubmit={handleSearchSubmit} className="flex items-center w-full justify-center">
                <input
                  type="text"
                  className="w-full py-1 px-4 md:py-2 md:px-4 rounded-l border border-gray-200 focus:outline-none"
                  placeholder="ค้นหาผลิตภัณฑ์"
                  value={search}
                  onChange={handleSearchChange}
                />
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-1 px-2 md:py-2 md:px-4 border border-blue-500 rounded-r-md hover:bg-blue-600"
                >
                  {searchbtn_moblie ? (
                    <span className="flex justify-center items-center gap-2">
                      <IoIosSearch size={24} />
                    </span>
                  ) : (
                    <span className="flex justify-center items-center gap-2">
                      <IoIosSearch size={20} /> <p>ค้นหา</p>
                    </span>
                  )}
                </button>
              </form>
            </div>

            <div className="px-4 py-2 w-full border-none md:border-b md:border-gray-200 flex justify-between items-center text-sm lg:text-md md:text-md bg-white/50 backdrop-blur-md">
              <h1 className="font-light text-gray-600">
                แสดงผลลัพธ์สำหรับ&nbsp;"
                <span className="font-medium text-blue-950">{search ? search : "ค้นหาผลิตภัณฑ์"}</span>"
              </h1>
              <div className="flex justify-center items-center gap-2 ">
                <IoBagOutline className="text-gray-600 " />
                <p className="font-light text-gray-600">ค้นพบ</p>
                {!shouldShowContentLoading ? (
                  <h1 className="text-gray-600 font-light">{meta.totalData || 0}</h1>
                ) : (
                  <span className="loading loading-dots loading-xs"></span>
                )}
              </div>
            </div>
          </div>

          {shouldShowContentLoading ? (
            <div className="space-y-4 bg-[#F0F3F8]/75 md:rounded-none rounded-md">
              <div className="px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center py-4 px-16 md:px-0">
                  {Array.from({ length: pageSize }).map((_, index) => (
                    <div
                      key={`prod-skeleton-${index}`}
                      className="bg-white rounded-md p-4 shadow-md w-[200px] mx-auto md:mx-0 md:w-full"
                    >
                      <div className="rounded-md bg-white w-full">
                        <div className="mx-auto w-full aspect-square max-w-[200px] overflow-hidden rounded-md">
                          <div className="w-full h-full bg-gray-300 animate-pulse rounded-md"></div>
                        </div>
                        <div className="flex flex-col justify-center gap-3 mt-2">
                          <div className="flex items-center gap-2 w-full">
                            <div className="h-6 bg-gray-300 rounded animate-pulse w-3/4"></div>
                            <div className="h-5 bg-gray-200 rounded animate-pulse w-1/4"></div>
                          </div>
                          <div className="flex items-center w-full">
                            <div className="w-4 h-4 bg-gray-300 rounded-md animate-pulse mr-2"></div>
                            <div className="flex-grow border-l border-gray-200 pl-2">
                              <div className="h-4 bg-gray-300 rounded animate-pulse w-full"></div>
                            </div>
                          </div>
                          <div className="flex items-center w-full">
                            <div className="w-4 h-4 bg-gray-300 rounded-md animate-pulse mr-2"></div>
                            <div className="flex-grow border-l border-gray-200 pl-2">
                              <div className="h-4 bg-gray-300 rounded animate-pulse w-full"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 bg-[#F0F3F8]/75 md:rounded-none rounded-md">
              <div className="px-4">
                {error && <p className="text-red-500 text-center py-4">{error}</p>}
                {!error && productsToDisplay.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center py-4 px-16 md:px-0 ">
                    {productsToDisplay.map((product: Product) => (
                      <ProductCard
                        key={product.ID}
                        ID={product.ID}
                        productName={product.productName || "-"}
                        BusinessName={product?.BussinessName || "-"}
                        image={isValidUrl(product?.image) ? product.image : "/"}
                        Material={product.materialMain?.Material ?? "N/A"}
                        price={product.price}
                      />
                    ))}
                  </div>
                ) : (
                  !error && <p className="text-center py-4">ไม่พบผลิตภัณฑ์</p>
                )}
              </div>
            </div>
          )}

          {!shouldShowContentLoading && productsToDisplay.length > 0 ? (
            <div className=" sticky bottom-0 w-full bg-white px-4">
              <Pagination
                currentPage={currentPage}
                pageSize={pageSize}
                totalPages={meta.totalPages || 1}
                totalItems={meta.totalData || 0}
                onChangePage={handlePageChange}
                onChangeLimit={handleLimitChange}
              />
            </div>
          ) : null}
        </main>
      </div>
    </div>
  )
}
