"use client"
import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import type React from "react"
import Pagination from "../components/pagination"
import BusinessCard from "../components/BusinessCard"
import { VscSettings } from "react-icons/vsc"
import { IoClose } from "react-icons/io5"
import { IoIosArrowDown, IoIosArrowUp, IoIosSearch } from "react-icons/io"
import { IoStorefrontOutline } from "react-icons/io5"
import axios from "axios"
import { GrLocation } from "react-icons/gr"

interface Business {
  BusinessID: number
  BussinessName: string
  BussinessNameEng: string
  AddressThai: string
  Latitude: string
  Longtitude: string
  Year: number
  picture: string
  ProvinceT: string
}

export default function BusinessList() {
  const [search, setSearch] = useState("")
  const [FilterToggle, setFilterToggle] = useState(false)
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [meta, setMeta] = useState<{
    page?: number
    limit?: number
    totalPages?: number
    totalData?: number
  }>({})
  const [searchbtn_moblie, setsearchbtn_moblie] = useState(false)

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentPage = Number.parseInt(searchParams.get("page") || "1", 10)
  const pageSize = Number.parseInt(searchParams.get("limit") || "12", 10)

  const [selectedProvince, setSelectedProvince] = useState<string | null>(null)
  const [provinceDrpopdown, setProvinceDropdown] = useState(true)

  const [error, setError] = useState<string | null>(null)

  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isContentLoading, setIsContentLoading] = useState(false)

  const initialFetchDone = useRef(false)

  const createQueryString = useCallback(
    (paramsToUpdate: Record<string, string | null>) => {
      const currentParams = new URLSearchParams(searchParams.toString())
      Object.entries(paramsToUpdate).forEach(([name, value]) => {
        if (value) {
          currentParams.set(name, value)
        } else {
          currentParams.delete(name)
        }
      })
      return currentParams.toString()
    },
    [searchParams],
  )

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
    const handleRebtn = () => {
      setsearchbtn_moblie(window.innerWidth < 640)
    }

    handleRebtn()
    window.addEventListener("resize", handleRebtn)

    return () => window.removeEventListener("resize", handleRebtn)
  }, [])

  function toggleSidebar() {
    setFilterToggle(!FilterToggle)
  }

  const closeFilter = () => {
    setFilterToggle(false)
  }

  const fetchBusiness = async (
    province: string | null,
    searchTerm: string | null,
    page: number,
    limit: number,
    isInitial = false,
  ) => {
    if (isInitial) {
      setIsInitialLoading(true)
    } else {
      setIsContentLoading(true)
    }
    setError(null)

    try {
      const params: Record<string, any> = { page, limit }
      if (province) params.province = province
      if (searchTerm) params.search = searchTerm

      const response = await axios.get(`api/business`, { params })
      const newMeta = response.data.meta
      const fetchedBusinesses = response.data.payload

      setBusinesses(fetchedBusinesses)
      setMeta(newMeta)

      const newTotalPages = newMeta.totalPages || 0
      let pageNeedsAdjustment = false
      let targetPageStr = page.toString()

      if (newTotalPages === 0 && fetchedBusinesses.length === 0) {
        if (page !== 1) {
          targetPageStr = "1"
          pageNeedsAdjustment = true
        }
      } else if (newTotalPages > 0 && page > newTotalPages) {
        targetPageStr = newTotalPages.toString()
        pageNeedsAdjustment = true
      } else if (newTotalPages === 1 && page !== 1) {
        targetPageStr = "1"
        pageNeedsAdjustment = true
      }

      if (pageNeedsAdjustment) {
        const currentUrlParams = new URLSearchParams(searchParams.toString())
        currentUrlParams.set("page", targetPageStr)
        router.replace(pathname + "?" + currentUrlParams.toString(), { scroll: false })
      }
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to fetch Business")
      setBusinesses([])
      setMeta({})
    } finally {
      if (isInitial) {
        setIsInitialLoading(false)
      } else {
        setIsContentLoading(false)
      }
    }
  }

  useEffect(() => {
    const provinceFromUrl = searchParams.get("province")
    const searchFromUrl = searchParams.get("search")

    setSelectedProvince(provinceFromUrl)
    setSearch(searchFromUrl || "")

    if (searchParams.has("page") && searchParams.has("limit")) {
      let isThisTheVeryFirstFetch = false
      if (!initialFetchDone.current) {
        isThisTheVeryFirstFetch = true
        initialFetchDone.current = true
      }
      fetchBusiness(provinceFromUrl, searchFromUrl, currentPage, pageSize, isThisTheVeryFirstFetch)
    }
  }, [searchParams, currentPage, pageSize])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const provinceFilter = (province: string) => {
    const newProvince = selectedProvince === province ? null : province
    const newQueryString = createQueryString({ province: newProvince, search, page: "1" })
    router.push(pathname + "?" + newQueryString)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newQueryString = createQueryString({ search, province: selectedProvince, page: "1" })
    router.push(pathname + "?" + newQueryString)
  }

  const handlePageChange = (newPage: number) => {
    const newQueryString = createQueryString({ page: newPage.toString() })
    router.push(pathname + "?" + newQueryString)
  }

  const handleLimitChange = (newLimit: number) => {
    const newQueryString = createQueryString({ limit: newLimit.toString(), page: "1" })
    router.push(pathname + "?" + newQueryString)
  }

  const provinces = ["เชียงใหม่", "เชียงราย", "ลำพูน", "แม่ฮ่องสอน", "ลำปาง", "น่าน", "ตาก", "แพร่", "พะเยา"]

  const shouldShowFilterLoading = isInitialLoading
  const shouldShowContentLoading = isInitialLoading || isContentLoading

  function isValidUrl(str: string) {
    try {
      new URL(str)
      return true
    } catch {
      return false
    }
  }

  return (
    <>
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
            className={`fixed inset-y-0 left-0 w-3/4 lg:w-1/4 h-full border-l no-scrollbar overflow-y-auto border-gray-200 bg-white transform transition-transform duration-300 ease-in-out z-50 md:z-20 lg:static lg:translate-x-0 ${FilterToggle ? "translate-x-0 w-full" : "-translate-x-full"}`}
          >
            <div className="sticky top-0 inset-x-0 z-20 px-4 py-[11px] text-center border-y border-gray-200 bg-gray-50 flex items-center justify-between lg:justify-center md:justify-between">
              <h1 className="text-3xl font-medium text-gray-600">กรองข้อมูล</h1>
              <button onClick={closeFilter} className={`text-2xl text-gray-800 ${!FilterToggle ? "hidden" : "block"}`}>
                <IoClose />
              </button>
            </div>

            <div className="w-full no-scrollbar">
              <div className="w-full overflow-y-auto">
                {/* Province Filter */}
                <div className="mb-4 text-gray-600">
                  <button
                    className="w-full text-left py-2 px-4"
                    onClick={() => setProvinceDropdown(!provinceDrpopdown)}
                  >
                    <h1 className="flex items-center gap-2">
                      <GrLocation />
                      <span className="font-semibold">จังหวัด</span>
                      {provinceDrpopdown ? (
                        <IoIosArrowUp className="ml-auto w-4 h-4 transform" />
                      ) : (
                        <IoIosArrowDown className="ml-auto w-4 h-4 transform" />
                      )}
                    </h1>
                  </button>

                  {provinceDrpopdown && (
                    <ul className="mt-2 flex flex-wrap gap-4 overflow-y-auto justify-start mx-4 max-h-60">
                      {shouldShowFilterLoading
                        ? Array.from({ length: 9 }).map((_, index) => (
                            <li key={index}>
                              <div className="animate-pulse bg-gray-200 text-md block py-1 px-3 rounded-md border border-gray-300 w-20 h-8"></div>
                            </li>
                          ))
                        : provinces.map((province) => (
                            <li key={province}>
                              <button
                                onClick={() => provinceFilter(province)}
                                className={`text-md block py-1 px-3 rounded-md border border-gray-300 font-light transition ${
                                  selectedProvince === province
                                    ? "bg-blue-500 text-white"
                                    : "bg-white hover:bg-gray-200 text-gray-800"
                                }`}
                              >
                                {province}
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
          <main className="w-screen flex-1 h-full overflow-y-auto relative no-scrollbar top-[-2px] lg:top-0 md:top-0 transform duration-300 ease-in-out md:border-x border-gray-200">
            {/* Search Header */}
            <div className="sticky top-0 flex-1 overflow-y-auto bg-white/75 backdrop-blur-m z-20 border-none md:border-y border-gray-200">
              <div className="bg-gray-50 flex justify-center items-center h-full py-2 px-2 md:px-4 border-y border-gray-200 rounded-none w-full">
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
                    placeholder="ค้นหาร้านค้า"
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
                  <span className="font-medium text-blue-950">{search ? search : "ค้นหาร้านค้า"}</span>"
                </h1>
                <div className="flex justify-center items-center gap-2">
                  <IoStorefrontOutline className="text-gray-600" />
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
                      <div key={index} className="bg-white rounded-md p-4 shadow-md w-full animate-pulse">
                        <div className="rounded-md bg-white w-full">
                          <div className="mx-auto w-full aspect-square max-w-[200px] bg-gray-200 rounded-md"></div>
                          <div className="mt-2 space-y-2">
                            <div className="h-6 bg-gray-200 rounded w-full"></div>
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 bg-gray-200 rounded"></div>
                              <div className="h-4 bg-gray-200 rounded w-full"></div>
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
                  {!error && businesses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center py-4 px-16 md:px-0">
                      {businesses.map((business: Business) => (
                        <BusinessCard
                          key={business?.BusinessID}
                          BusinessID={business?.BusinessID}
                          BussinessName={business?.BussinessName}
                          location={`(${business.Latitude}, ${business.Longtitude})` || "-"}
                          ProvinceT={business.ProvinceT || "-"}
                          image={isValidUrl(business?.picture) ? business.picture : "/images/default.png"}
                        />
                      ))}
                    </div>
                  ) : (
                    !error && <p className="text-center py-4">ไม่พบข้อมูลร้านค้า</p>
                  )}
                </div>
              </div>
            )}

            {!shouldShowContentLoading && businesses.length > 0 && (
              <div className="sticky bottom-0 w-full bg-white px-4">
                <Pagination
                  currentPage={currentPage}
                  pageSize={pageSize}
                  totalPages={meta.totalPages || 1}
                  totalItems={meta.totalData || 0}
                  onChangePage={handlePageChange}
                  onChangeLimit={handleLimitChange}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  )
}
