"use client"
import { useState, useEffect, useCallback, useRef } from "react"
import type React from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import Pagination from "../components/pagination" // Assuming this is the same pagination component
import MemberCard from "../components/MemberCard"
import { VscSettings } from "react-icons/vsc"
import { IoClose } from "react-icons/io5"
import { IoIosArrowDown, IoIosArrowUp, IoIosSearch } from "react-icons/io"
import { RxPerson } from "react-icons/rx"
import { FiCalendar } from "react-icons/fi"
import { FaRegAddressCard, FaRegFlag } from "react-icons/fa"
import { BsGenderAmbiguous } from "react-icons/bs"
import axios from "axios"

interface BusinessInfo {
  ID: number
  DataYear: number
  BusiTypeId: number
  BussinessName: string
  BussinessNameEng: string
  AddressThai: string
  AddressT: string
  TumbolT: string
  AmphurT: string
  ProvinceT: string
  ZipCodeT: string
  CountryT: string
  AddressEng: string | null
  AddressE: string | null
  TumbolE: string | null
  AmphurE: string | null
  ProvinceE: string
  ZipCodeE: string | null
  CountryE: string | null
  Latitude: string
  Longtitude: string
  picture: string
  username: string
  password: string
}

interface Member {
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
  Year: number
  description: string | null
  picture: string
  businessinfo: BusinessInfo
}

const RoleThaiOptions = [
  "ครูช่าง",
  "นักออกแบบไทย",
  "ผู้เชี่ยวชาญ",
  "นักออกแบบญี่ปุ่น",
  "ล่ามแปลภาษา",
  "ที่ปรึกษาไทย",
  "ที่ปรึกษาญี่ปุ่น",
  "ที่ปรึกษาอเมริกัน",
  "ที่ปรึกษามาเลเซีย",
  "ที่ปรึกษามาซิโดเนีย",
]
const YearOptions = [2021, 2022, 2023]
const GenderOptions = ["ชาย", "หญิง"]
const NationOptions = ["ไทย", "ญี่ปุ่น", "มาเลเซีย", "อเมริกัน", "มาซิโดเนีย"]

export default function MembersList() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [FilterToggle, setFilterToggle] = useState(false)
  const [members, setMembers] = useState<Member[]>([])
  const [meta, setMeta] = useState<{ page?: number; limit?: number; totalPages?: number; totalData?: number }>({})
  const [searchbtn_moblie, setsearchbtn_moblie] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [searchInput, setSearchInput] = useState("")

  const [selectedGender, setSelectedGender] = useState<string | null>(null)
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [selectedNation, setSelectedNation] = useState<string | null>(null)

  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isContentLoading, setIsContentLoading] = useState(false)

  const [GenderDropdown, setGenderDropdown] = useState(true)
  const [RoleDropdown, setRoleDropdown] = useState(true)
  const [NationDropdown, setNationDropdown] = useState(false)
  const [YearDropdown, setYearDropdown] = useState(false)

  const initialFetchDone = useRef(false)

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

  const currentPage = Number.parseInt(searchParams.get("page") || "1", 10)
  const pageSize = Number.parseInt(searchParams.get("limit") || "12", 10)

  const createQueryString = useCallback(
    (paramsToUpdate: Record<string, string | number | null>) => {
      const currentParams = new URLSearchParams(searchParams.toString())
      Object.entries(paramsToUpdate).forEach(([name, value]) => {
        if (value !== null && value !== undefined && String(value).trim() !== "") {
          currentParams.set(name, String(value))
        } else {
          currentParams.delete(name)
        }
      })
      return currentParams.toString()
    },
    [searchParams],
  )

  useEffect(() => {
    const handleRebtn = () => {
      setsearchbtn_moblie(window.innerWidth < 640)
    }
    handleRebtn()
    window.addEventListener("resize", handleRebtn)
    return () => window.removeEventListener("resize", handleRebtn)
  }, [])

  const fetchMembers = async (
    page: number,
    limit: number,
    role: string | null,
    year: number | null,
    nation: string | null,
    gender: string | null,
    searchTerm: string | null,
    isInitial = false,
  ) => {
    if (isInitial) setIsInitialLoading(true)
    else setIsContentLoading(true)
    setError(null)

    try {
      const params: Record<string, any> = { page, limit }
      if (role) params.roleThai = role
      if (year) params.Year = year
      if (nation) params.nationality = nation
      if (gender) params.gender = gender
      if (searchTerm) params.search = searchTerm

      const response = await axios.get("/api/members", { params })
      const newMeta = response.data.meta
      const fetchedMembers = response.data.payload

      setMembers(fetchedMembers)
      setMeta(newMeta || {})

      const newTotalPages = newMeta?.totalPages || 0
      let pageNeedsAdjustment = false
      let targetPageStr = page.toString()

      if (newTotalPages === 0 && fetchedMembers.length === 0) {
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
        router.replace(`${pathname}?${currentUrlParams.toString()}`, { scroll: false })
      }
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to fetch members")
      setMembers([])
      setMeta({})
    } finally {
      if (isInitial) setIsInitialLoading(false)
      else setIsContentLoading(false)
    }
  }

  useEffect(() => {
    const roleFromUrl = searchParams.get("roleThai")
    const yearFromUrl = searchParams.get("Year")
    const nationFromUrl = searchParams.get("nationality")
    const genderFromUrl = searchParams.get("gender")
    const searchFromUrl = searchParams.get("search")

    setSelectedRole(roleFromUrl)
    setSelectedYear(yearFromUrl ? Number.parseInt(yearFromUrl, 10) : null)
    setSelectedNation(nationFromUrl)
    setSelectedGender(genderFromUrl)
    setSearchInput(searchFromUrl || "")

    if (searchParams.has("page") && searchParams.has("limit")) {
      let isThisTheVeryFirstFetch = false
      if (!initialFetchDone.current) {
        isThisTheVeryFirstFetch = true
        initialFetchDone.current = true
      }

      fetchMembers(
        currentPage,
        pageSize,
        roleFromUrl,
        yearFromUrl ? Number.parseInt(yearFromUrl, 10) : null,
        nationFromUrl,
        genderFromUrl,
        searchFromUrl,
        isThisTheVeryFirstFetch,
      )
    }
  }, [searchParams, currentPage, pageSize])

  function toggleSidebar() {
    setFilterToggle(!FilterToggle)
  }
  const closeFilter = () => {
    setFilterToggle(false)
  }

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newQueryString = createQueryString({
      search: searchInput,
      roleThai: selectedRole,
      Year: selectedYear,
      nationality: selectedNation,
      gender: selectedGender,
      page: "1",
    })
    router.push(`${pathname}?${newQueryString}`)
  }

  const applyFilter = (filterType: string, value: string | number | null) => {
    const currentFilters = {
      roleThai: searchParams.get("roleThai"),
      Year: searchParams.get("Year") ? Number.parseInt(searchParams.get("Year")!, 10) : null,
      nationality: searchParams.get("nationality"),
      gender: searchParams.get("gender"),
      search: searchParams.get("search"),
    }

    let newSelectedValue: string | number | null = null

    switch (filterType) {
      case "roleThai":
        newSelectedValue = selectedRole === value ? null : (value as string)
        setSelectedRole(newSelectedValue as string | null)
        currentFilters.roleThai = newSelectedValue as string | null
        break
      case "Year":
        newSelectedValue = selectedYear === value ? null : (value as number)
        setSelectedYear(newSelectedValue as number | null)
        currentFilters.Year = newSelectedValue as number | null
        break
      case "nationality":
        newSelectedValue = selectedNation === value ? null : (value as string)
        setSelectedNation(newSelectedValue as string | null)
        currentFilters.nationality = newSelectedValue as string | null
        break
      case "gender":
        newSelectedValue = selectedGender === value ? null : (value as string)
        setSelectedGender(newSelectedValue as string | null)
        currentFilters.gender = newSelectedValue as string | null
        break
    }

    const newQueryString = createQueryString({ ...currentFilters, page: "1" })
    router.push(`${pathname}?${newQueryString}`)
  }

  const handlePageChange = (newPage: number) => {
    const newQueryString = createQueryString({ page: newPage.toString() })
    router.push(`${pathname}?${newQueryString}`)
  }

  const handleLimitChange = (newLimit: number) => {
    const newQueryString = createQueryString({ limit: newLimit.toString(), page: "1" })
    router.push(`${pathname}?${newQueryString}`)
  }

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

          <div className="w-full no-scrollbar p-4">
            {/* Gender Filter */}
            <div className="mb-4 text-gray-600">
              <button className="w-full text-left py-2" onClick={() => setGenderDropdown(!GenderDropdown)}>
                <h1 className="flex items-center gap-2">
                  <BsGenderAmbiguous />
                  <span className="font-semibold">เพศ</span>
                  {GenderDropdown ? (
                    <IoIosArrowUp className="ml-auto w-4 h-4 transform" />
                  ) : (
                    <IoIosArrowDown className="ml-auto w-4 h-4 transform" />
                  )}
                </h1>
              </button>
              {GenderDropdown && (
                <ul className="mt-2 flex flex-wrap gap-2 justify-start">
                  {shouldShowFilterLoading
                    ? Array.from({ length: GenderOptions.length }).map((_, index) => (
                      <li key={index}>
                        <div className="animate-pulse bg-gray-200 text-md block py-1 px-3 rounded-md border border-gray-300 w-20 h-8"></div>
                      </li>
                    ))
                    : GenderOptions.map((item) => (
                      <li key={item}>
                        <button
                          onClick={() => applyFilter("gender", item)}
                          className={`text-sm block py-1 px-3 rounded-md border border-gray-300 font-light transition ${selectedGender === item ? "bg-blue-950 text-white" : "bg-white hover:bg-gray-200 text-gray-800"}`}
                        >
                          {item}
                        </button>
                      </li>
                    ))}
                </ul>
              )}
            </div>

            {/* Role Filter */}
            <div className="mb-4 text-gray-600">
              <button className="w-full text-left py-2" onClick={() => setRoleDropdown(!RoleDropdown)}>
                <h1 className="flex items-center gap-2">
                  <FaRegAddressCard /> <span className="font-semibold">ตำแหน่ง</span>
                  {RoleDropdown ? (
                    <IoIosArrowUp className="ml-auto w-4 h-4 transform" />
                  ) : (
                    <IoIosArrowDown className="ml-auto w-4 h-4 transform" />
                  )}
                </h1>
              </button>
              {RoleDropdown && (
                <ul className="mt-2 flex flex-wrap gap-2 justify-start overflow-y-auto">
                  {shouldShowFilterLoading
                    ? Array.from({ length: RoleThaiOptions.length }).map((_, index) => (
                      <li key={index}>
                        <div className="animate-pulse bg-gray-200 text-md block py-1 px-3 rounded-md border border-gray-300 w-28 h-8"></div>
                      </li>
                    ))
                    : RoleThaiOptions.map((item) => (
                      <li key={item}>
                        <button
                          onClick={() => applyFilter("roleThai", item)}
                          className={`text-sm block py-1 px-3 rounded-md border border-gray-300 font-light transition ${selectedRole === item ? "bg-blue-950 text-white" : "bg-white hover:bg-gray-200 text-gray-800"}`}
                        >
                          {item}
                        </button>
                      </li>
                    ))}
                </ul>
              )}
            </div>

            {/* Nation Filter */}
            <div className="mb-4 text-gray-600">
              <button className="w-full text-left py-2" onClick={() => setNationDropdown(!NationDropdown)}>
                <h1 className="flex items-center gap-2">
                  <FaRegFlag /> <span className="font-semibold">สัญชาติ</span>
                  {NationDropdown ? (
                    <IoIosArrowUp className="ml-auto w-4 h-4 transform" />
                  ) : (
                    <IoIosArrowDown className="ml-auto w-4 h-4 transform" />
                  )}
                </h1>
              </button>
              {NationDropdown && (
                <ul className="mt-2 flex flex-wrap gap-2 justify-start">
                  {shouldShowFilterLoading
                    ? Array.from({ length: NationOptions.length }).map((_, index) => (
                      <li key={index}>
                        <div className="animate-pulse bg-gray-200 text-md block py-1 px-3 rounded-md border border-gray-300 w-24 h-8"></div>
                      </li>
                    ))
                    : NationOptions.map((item) => (
                      <li key={item}>
                        <button
                          onClick={() => applyFilter("nationality", item)}
                          className={`text-sm block py-1 px-3 rounded-md border border-gray-300 font-light transition ${selectedNation === item ? "bg-blue-950 text-white" : "bg-white hover:bg-gray-200 text-gray-800"}`}
                        >
                          {item}
                        </button>
                      </li>
                    ))}
                </ul>
              )}
            </div>

            {/* Year Filter */}
            <div className="mb-4 text-gray-600">
              <button className="w-full text-left py-2" onClick={() => setYearDropdown(!YearDropdown)}>
                <h1 className="flex items-center gap-2">
                  <FiCalendar /> <span className="font-semibold">ปี</span>
                  {YearDropdown ? (
                    <IoIosArrowUp className="ml-auto w-4 h-4 transform" />
                  ) : (
                    <IoIosArrowDown className="ml-auto w-4 h-4 transform" />
                  )}
                </h1>
              </button>
              {YearDropdown && (
                <ul className="mt-2 flex flex-wrap gap-2 justify-start">
                  {shouldShowFilterLoading
                    ? Array.from({ length: YearOptions.length }).map((_, index) => (
                      <li key={index}>
                        <div className="animate-pulse bg-gray-200 text-md block py-1 px-3 rounded-md border border-gray-300 w-20 h-8"></div>
                      </li>
                    ))
                    : YearOptions.map((item) => (
                      <li key={item}>
                        <button
                          onClick={() => applyFilter("Year", item)}
                          className={`text-sm block py-1 px-3 rounded-md border border-gray-300 font-light transition ${selectedYear === item ? "bg-blue-950 text-white" : "bg-white hover:bg-gray-200 text-gray-800"}`}
                        >
                          {item}
                        </button>
                      </li>
                    ))}
                </ul>
              )}
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
                  placeholder="ค้นหาบุคคล"
                  value={searchInput}
                  onChange={handleSearchInputChange}
                />
                <button
                  type="submit"
                  className="bg-blue-950 text-white py-1 px-2 md:py-2 md:px-4 border border-blue-950 rounded-r-md hover:bg-blue-950/90"
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
                <span className="font-medium text-blue-950">{searchInput || "ค้นหาบุคคล"}</span>"
              </h1>
              <div className="flex justify-center items-center gap-2">
                <RxPerson className="text-gray-600" />
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
                {!error && members.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center py-4 px-16 md:px-0">
                    {members.map((member: Member) => (
                      <MemberCard
                        key={member.ID}
                        memberID={member.ID}
                        NameThai={member.NameThai || member.NameEng || "-"}
                        Role={member.RoleThai || "-"}
                        image={isValidUrl(member?.picture) ? member.picture : "/images/default.png"}
                        Gender={member.gender || "-"}
                      />
                    ))}
                  </div>
                ) : (
                  !error && <p className="text-center py-4">ไม่พบสมาชิก</p>
                )}
              </div>
            </div>
          )}

          {!shouldShowContentLoading && members.length > 0 ? (
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
          ): (
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
  )
}
