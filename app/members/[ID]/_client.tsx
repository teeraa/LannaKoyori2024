"use client"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import axios from "axios"
import Footer from "@/app/components/footer"
import MemberDetail from "./_MemberDetail"
import OwnerProduct from "./_OwnerProduct"


export interface Product {
  ID: number;
  productName: string;
  price: number;
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
  BussinessName: string
}

export interface Material {
  ID: number;
  Material: string;
}

export interface ContactUs {
  facebook_name: string;
  facebook_url: string;
  instagram_name: string;
  instagram_url: string;
  lineId_name: string;
  line_url: string;
  email: string;
  phone: string;
  website_name: string;
  website_url: string;
}

export interface Member {
  memberID: number;
  memberNameThai: string;
  memberNameEng: string;
  memberRoleThai: string;
  memberRoleEng: string;
  memberPosition: string;
  memberNationality: string;
  memberGender: string;
  memberContact: string;
  description_EN?: string;
  description_TH?: string;
  description_JP?: string;
  memberpicture: string
  contactUs: ContactUs;
  BusinessID: number;
  BussinessName: string;
  BussinessNameEng: string;
  AddressThai: string;
  Latitude: string;
  Longtitude: string;
  Year: number;
  picture: string;
  memberBanner?: string
}


export default function MemberDetailPage() {
  const params = useParams()
  const ID = Number.parseInt(params.ID as string)
  const [error, setError] = useState<string | null>(null)
  const [isMemberLoading, setIsMemberLoading] = useState(true)
  const [isProductLoading, setIsProductLoading] = useState(true)
  const [members, setMembers] = useState<Member[]>([])
  const [products, setProducts] = useState<Product[]>([])

  // หา member ที่ ID ตรงกัน
  const member = members.find((member: Member) => member.memberID === ID)
  const businessID = member?.BusinessID

  const fetchMembers = async (memberID: number) => {
    try {
      setIsMemberLoading(true)
      const response = await axios.get(`/api/members/${memberID}`)
      setMembers(Array.isArray(response.data) ? response.data : [response.data])
      console.log("Fetched Member Data:", response.data) // <--- ตรวจสอบตรงนี้ใน console ของเบราว์เซอร์
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to fetch members")
    } finally {
      setIsMemberLoading(false)
    }
  }
  // กรองผลิตภัณฑ์ตามผู้ประกอบการ
  const fetchProducts = async (businessID: number) => {
    try {
      setIsProductLoading(true)
      const response = await axios.get("/api/productByBus", { params: { businessID } })
      setProducts(response.data)
     } catch (error: any) {
      setError(error.response?.data?.error || "Failed to fetch products")
    } finally {
      setIsProductLoading(false)
    }
  }

  useEffect(() => {
    fetchMembers(ID)
  }, [ID])

  useEffect(() => {
    if (businessID) {
      fetchProducts(businessID)
    } else if (member && !businessID) {
      // ถ้ามี member แต่ไม่มี businessID ให้หยุดการโหลด products
      setIsProductLoading(false)
    }
  }, [businessID, member])

  if (error) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">เกิดข้อผิดพลาด: {error}</div>
      </div>
    )
  }

  if (!isMemberLoading && !member) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">ไม่พบข้อมูลสมาชิก</div>
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

        <main className="pt-12 md:pt-[68px]">
          <div>
            {(isMemberLoading || member) && (
              <MemberDetail member={member} isLoading={isMemberLoading} roleThai={member?.memberRoleThai} />
            )}
          </div>
          <OwnerProduct products={products} isLoading={isProductLoading} roleThai={member?.memberRoleThai} />
        </main>
      </div>
      <Footer />
    </>
  )
}
