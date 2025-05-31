"use client"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import axios from "axios"
import Footer from "@/app/components/footer"
import MemberDetail from "./_MemberDetail"
import OwnerProduct from "./_OwnerProduct"
import { Member, Product } from '@/app/types/page'


export default function MemberDetailPage() {
  const params = useParams()
  const ID = Number.parseInt(params.ID as string)
  const [error, setError] = useState<string | null>(null)
  const [isMemberLoading, setIsMemberLoading] = useState(true)
  const [isProductLoading, setIsProductLoading] = useState(true)
  const [members, setMembers] = useState<Member[]>([])
  const [products, setProducts] = useState<Product[]>([])

  // หา member ที่ ID ตรงกัน
  const member = members.flat().find((m: any) => m.ID === ID)
  const businessID = member?.businessinfo?.ID

  const fetchMembers = async (id: number) => {
    try {
      setIsMemberLoading(true)
      const response = await axios.get(`/api/members/${id}`)
      setMembers(response.data)
      console.log(response.data)
    } catch (error: any) {
      setError(error.response?.data?.error || "Failed to fetch members")
    } finally {
      setIsMemberLoading(false)
    }
  }

  // กรองผลิตภัณฑ์ตามผู้ประกอบการ
  const fetchProducts = async (id: number | null = null) => {
    try {
      setIsProductLoading(true)
      const params: Record<string, any> = {}
      if (id) params.businessID = id

      const response = await axios.get("/api/productByBus", { params })
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
      <div className="container pb-10 px-4 sm:px-6 lg:px-8">
        <div className="fixed inset-0 z-0 flex justify-start items-start top-40">
          <div className="w-10/12 h-40 md:h-96 bg-gradient-to-tr from-cyan-500 via-blue-300 to-green-500 rounded-[60%] blur-3xl opacity-30 transform scale-110 rotate-[20deg] md:rotate-[20deg]"></div>
        </div>
        <div className="fixed inset-0 z-0 flex justify-end items-end bottom-0">
          <div className="w-96 h-96 md:h-96 bg-gradient-to-tr from-cyan-500 via-blue-300 to-red-500 rounded-[60%] blur-3xl opacity-30 transform scale-80 rotate-[0deg] md:rotate-[140deg]"></div>
        </div>

        <main className="pt-12 md:pt-[68px]">
          <MemberDetail member={member} isMemberLoading={isMemberLoading} />
          <OwnerProduct products={products} isLoading={isProductLoading} />
        </main>
      </div>
      <Footer />
    </>
  )
}
