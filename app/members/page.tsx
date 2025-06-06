"use client"
import { useState, useEffect } from "react"
import type React from "react"

import Pagination from "../components/pagination"
import MemberCard from "../components/MemberCard"
import { usePathname, useSearchParams, useRouter } from "next/navigation"
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io"
import { VscSettings } from "react-icons/vsc"
import { IoClose } from "react-icons/io5"
import { RxPerson } from "react-icons/rx"
import { IoIosSearch } from "react-icons/io"
import { FiCalendar } from "react-icons/fi"
import { FaRegAddressCard, FaRegFlag } from "react-icons/fa"
import { BsGenderAmbiguous } from "react-icons/bs"
import axios from "axios"

interface BusinessInfo {
  ID: number;
  DataYear: number;
  BusiTypeId: number;
  BussinessName: string;
  BussinessNameEng: string;
  AddressThai: string;
  AddressT: string;
  TumbolT: string;
  AmphurT: string;
  ProvinceT: string;
  ZipCodeT: string;
  CountryT: string;
  AddressEng: string | null;
  AddressE: string | null;
  TumbolE: string | null;
  AmphurE: string | null;
  ProvinceE: string;
  ZipCodeE: string | null;
  CountryE: string | null;
  Latitude: string;
  Longtitude: string;
  picture: string;
  username: string;
  password: string;
}

interface Member {
  ID: number;
  BusinessID: number;
  NameThai: string;
  NameEng: string;
  RoleThai: string;
  RoleEng: string;
  Position: string;
  nationality: string;
  gender: string;
  Institute: string;
  Contact: string;
  Year: number;
  description: string | null;
  picture: string;
  businessinfo: BusinessInfo;
}


const RoleThai = [
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
const Year = [2021, 2022, 2023]
const Gender = ["ชาย", "หญิง"]
const Nation = ["ไทย", "ญี่ปุ่น", "มาเลเซีย", "อเมริกัน", "มาซิโดเนีย"]

export default function MembersList() {
  const searchParams = useSearchParams()
  const [FilterToggle, setFilterToggle] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(12)
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([])
  const [searchbtn_moblie, setsearchbtn_moblie] = useState(false)

  // แยก loading state
  const [isInitialLoading, setIsInitialLoading] = useState(true) // สำหรับโหลดครั้งแรก
  const [isContentLoading, setIsContentLoading] = useState(false) // สำหรับโหลดเมื่อกรอง

  // dropdown states
  const [GenderDropdown, setGenderDropdown] = useState(true)
  const [RoleDropdown, setRoleDropdown] = useState(true)
  const [NationDropdown, setNationDropdown] = useState(false)
  const [YearDropdown, setYearDropdown] = useState(false)

  // filter states
  const [selectedGender, setSelectedGender] = useState<string | null>(null)
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  const [selectedNation, setSelectedNation] = useState<string | null>(null)
  const [search, setSearch] = useState(searchParams.get("search") || "")

  // data states
  const [members, setMembers] = useState([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleRebtn = () => {
      setsearchbtn_moblie(window.innerWidth < 640)
    }

    handleRebtn()
    window.addEventListener("resize", handleRebtn)

    return () => window.removeEventListener("resize", handleRebtn)
  }, [])

  const fetchMembers = async (
    roleThai: string | null = null,
    year: number | null = null,
    nationality: string | null = null,
    gender: string | null = null,
    search: string | null = null,
    isInitial = false,
  ) => {
    // ตั้งค่า loading state ตามประเภทการโหลด
    if (isInitial) {
      setIsInitialLoading(true)
    } else {
      setIsContentLoading(true)
    }

    setError(null)

    try {
      const params: Record<string, any> = {}
      if (roleThai) params.roleThai = roleThai
      if (year) params.Year = year
      if (nationality) params.nationality = nationality
      if (gender) params.gender = gender
      if (search) params.search = search

      const response = await axios.get("/api/members", { params })
      setFilteredMembers(response.data)
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to fetch members")
    } finally {
      if (isInitial) {
        setIsInitialLoading(false)
      } else {
        setIsContentLoading(false)
      }
    }
  }

  useEffect(() => {
    fetchMembers(null, null, null, null, null, true) // โหลดครั้งแรก
  }, [])

  function toggleSidebar() {
    setFilterToggle(!FilterToggle)
  }

  const closeFilter = () => {
    setFilterToggle(false)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchMembers(selectedRole, selectedYear, selectedNation, selectedGender, search, false)
    setCurrentPage(1)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch(value)
    fetchMembers(selectedRole, selectedYear, selectedNation, selectedGender, value, false)
    setCurrentPage(1)
  }

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const handleLimitChange = (newLimit: number) => {
    setPageSize(newLimit)
    setCurrentPage(1)
  }

  const GenderFilter = (gender: string) => {
    const newGender = selectedGender === gender ? null : gender
    setSelectedGender(newGender)
    fetchMembers(selectedRole, selectedYear, selectedNation, newGender, search, false)
  }

  const RoleFilter = (role: string) => {
    const newRole = selectedRole === role ? null : role
    setSelectedRole(newRole)
    fetchMembers(newRole, selectedYear, selectedNation, selectedGender, search, false)
  }

  const YearFilter = (year: number) => {
    const newYear = selectedYear === year ? null : year
    setSelectedYear(newYear)
    fetchMembers(selectedRole, newYear, selectedNation, selectedGender, search, false)
  }

  const NationFilter = (nation: string) => {
    const newNation = selectedNation === nation ? null : nation
    setSelectedNation(newNation)
    fetchMembers(selectedRole, selectedYear, newNation, selectedGender, search, false)
  }

  const startIndex = (currentPage - 1) * pageSize
  const currentMembers = filteredMembers.slice(startIndex, startIndex + pageSize)
  const currentMembersFiltered = filteredMembers.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  // ตรวจสอบว่าควรแสดง loading หรือไม่
  const shouldShowFilterLoading = isInitialLoading
  const shouldShowContentLoading = isInitialLoading || isContentLoading

  function isValidUrl(str: string) {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
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

          <div className="w-full no-scrollbar">
            {/* Gender Filter */}
            <div className="mb-4 text-gray-600">
              <button className="w-full text-left py-2 px-4" onClick={() => setGenderDropdown(!GenderDropdown)}>
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
                <ul className="overflow-y-auto mt-2 flex flex-wrap gap-4 justify-start mx-4">
                  {shouldShowFilterLoading
                    ? Array.from({ length: 2 }).map((_, index) => (
                      <li key={index}>
                        <div className="animate-pulse bg-gray-200 text-md block py-1 px-3 rounded-md border border-gray-300 w-20 h-8"></div>
                      </li>
                    ))
                    : Gender.map((items) => (
                      <li key={items}>
                        <button
                          onClick={() => GenderFilter(items)}
                          className={`text-md block py-1 px-3 rounded-md border border-gray-300 font-light transition ${selectedGender === items
                              ? "bg-blue-500 text-white"
                              : "bg-white hover:bg-gray-200 text-gray-800"
                            }`}
                        >
                          {items}
                        </button>
                      </li>
                    ))}
                </ul>
              )}
            </div>

            {/* Role Filter */}
            <div className="mb-4 text-gray-600">
              <button className="w-full text-left py-2 px-4" onClick={() => setRoleDropdown(!RoleDropdown)}>
                <h1 className="flex items-center gap-2">
                  <FaRegAddressCard />
                  <span className="font-semibold">ตําแหน่ง</span>
                  {RoleDropdown ? (
                    <IoIosArrowUp className="ml-auto w-4 h-4 transform" />
                  ) : (
                    <IoIosArrowDown className="ml-auto w-4 h-4 transform" />
                  )}
                </h1>
              </button>
              {RoleDropdown && (
                <ul className="overflow-y-auto mt-2 flex flex-wrap gap-4 justify-start mx-4">
                  {shouldShowFilterLoading
                    ? Array.from({ length: 6 }).map((_, index) => (
                      <li key={index}>
                        <div className="animate-pulse bg-gray-200 text-md block py-1 px-3 rounded-md border border-gray-300 w-20 h-8"></div>
                      </li>
                    ))
                    : RoleThai.map((items) => (
                      <li key={items}>
                        <button
                          onClick={() => RoleFilter(items)}
                          className={`text-md block py-1 px-3 rounded-md border border-gray-300 font-light transition ${selectedRole === items
                              ? "bg-blue-500 text-white"
                              : "bg-white hover:bg-gray-200 text-gray-800"
                            }`}
                        >
                          {items}
                        </button>
                      </li>
                    ))}
                </ul>
              )}
            </div>

            {/* Nation Filter */}
            <div className="mb-4 text-gray-600">
              <button className="w-full text-left py-2 px-4" onClick={() => setNationDropdown(!NationDropdown)}>
                <h1 className="flex items-center gap-2">
                  <FaRegFlag />
                  <span className="font-semibold">สัญชาติ</span>
                  {NationDropdown ? (
                    <IoIosArrowUp className="ml-auto w-4 h-4 transform" />
                  ) : (
                    <IoIosArrowDown className="ml-auto w-4 h-4 transform" />
                  )}
                </h1>
              </button>

              {NationDropdown && (
                <ul className="overflow-y-auto mt-2 flex flex-wrap gap-4 justify-start mx-4">
                  {shouldShowFilterLoading
                    ? Array.from({ length: 5 }).map((_, index) => (
                      <li key={index}>
                        <div className="animate-pulse bg-gray-200 text-md block py-1 px-3 rounded-md border border-gray-300 w-20 h-8"></div>
                      </li>
                    ))
                    : Nation.map((items) => (
                      <li key={items}>
                        <button
                          onClick={() => NationFilter(items)}
                          className={`text-md block py-1 px-3 rounded-md border border-gray-300 font-light transition ${selectedNation === items
                              ? "bg-blue-500 text-white"
                              : "bg-white hover:bg-gray-200 text-gray-800"
                            }`}
                        >
                          {items}
                        </button>
                      </li>
                    ))}
                </ul>
              )}
            </div>

            {/* Year Filter */}
            <div className="mb-4 text-gray-600">
              <button className="w-full text-left py-2 px-4" onClick={() => setYearDropdown(!YearDropdown)}>
                <h1 className="flex items-center gap-2">
                  <FiCalendar />
                  <span className="font-semibold">ปี</span>
                  {YearDropdown ? (
                    <IoIosArrowUp className="ml-auto w-4 h-4 transform" />
                  ) : (
                    <IoIosArrowDown className="ml-auto w-4 h-4 transform" />
                  )}
                </h1>
              </button>
              {YearDropdown && (
                <ul className="overflow-y-auto mt-2 flex flex-wrap gap-4 justify-start mx-4">
                  {shouldShowFilterLoading
                    ? Array.from({ length: 3 }).map((_, index) => (
                      <li key={index}>
                        <div className="animate-pulse bg-gray-200 text-md block py-1 px-3 rounded-md border border-gray-300 w-20 h-8"></div>
                      </li>
                    ))
                    : Year.map((items: any) => (
                      <li key={items}>
                        <button
                          onClick={() => YearFilter(items)}
                          className={`text-md block py-1 px-3 rounded-md border border-gray-300 font-light transition ${selectedYear === items
                              ? "bg-blue-500 text-white"
                              : "bg-white hover:bg-gray-200 text-gray-800"
                            }`}
                        >
                          {items}
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
                <span className="font-medium text-blue-950">{search ? search : "ค้นหาบุคคล"}</span>"
              </h1>
              <div className="flex justify-center items-center gap-2">
                <RxPerson className="text-gray-600" />
                <p className="font-light text-gray-600">ค้นพบ</p>
                {!shouldShowContentLoading ? (
                  <h1 className="text-gray-600 font-light">{filteredMembers ? filteredMembers.length : 0}</h1>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center py-4 px-16 md:px-0">
                  {currentMembers.length > 0 ? (
                    currentMembersFiltered.map((member: Member) => (
                      <MemberCard
                        key={member.ID || "-"}
                        memberID={member.ID}
                        NameThai={member.NameThai || member.NameEng || "-"}
                        Role={member.RoleThai || "-"}
                        image={
                          isValidUrl(member?.picture)
                            ? member.picture
                            : "/images/default.png"
                        }
                        Gender={member.gender || "-"}
                      />
                    ))
                  ) : (
                    <p>ไม่พบสมาชิก</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Pagination */}
          {!shouldShowContentLoading && (
            <div className="sticky bottom-0 w-full bg-white px-4">
              <Pagination
                totalPages={Math.ceil(filteredMembers.length / pageSize)}
                filteredData={filteredMembers.length}
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
