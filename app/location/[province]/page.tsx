"use client"
import PropTypes from 'prop-types'
import React, { Component, useState, useEffect } from 'react'
import Image from 'next/image'
import { useParams, usePathname } from "next/navigation";
import axios from "axios";

const MyComponent = () => {
  const [filteredStores, setFilteredStores] = useState([]);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const params = useParams();
  const province = Array.isArray(params.province)
    ? decodeURIComponent(params.province[0]) // Decode if it's an array
    : params.province
      ? decodeURIComponent(params.province) // Decode if it's a string
      : null;

  const fetchBusiness = async (province: string | null = null) => {
    try {
      const params: Record<string, any> = {};
      if (province) params.province = province;

      const response = await axios.get('/api/business', { params });
      setFilteredStores(response.data.payload);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to fetch Business');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchBusiness(province);
  }, [province]);

  return (
    <div className="container">
      <div className="relative flex flex-col justify-center items-center w-full h-full text-gray-700 bg-white shadow-md rounded-xl bg-clip-border mt-20">
        <table className="w-full text-left table-auto min-w-max">
          <thead>
            <tr>
              <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                  ที่
                </p>
              </th>
              <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                  ชื่อสถานประกอบการ
                </p>
              </th>
              <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                  ที่อยู่
                </p>
              </th>
              <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                  ที่ตั้งสถานประกอบการ
                </p>
              </th>
              <th className="p-4 border-b border-blue-gray-100 bg-blue-gray-50">
                <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70"></p>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredStores.map((store: any, index: number) => (
              <tr key={store.ID || index}>
                <td className="p-4 border-b border-blue-gray-50">{index + 1}</td>
                <td className="p-4 border-b border-blue-gray-50">{store.BussinessName}</td>
                <td className="p-4 border-b border-blue-gray-50">{store.AddressThai}</td>
                <td className="p-4 border-b border-blue-gray-50">
                  <a href={`https://www.google.co.th/maps/place/(${store.Latitude}, ${store.Longtitude})`} target='_blank'>
                    {`(${store.Latitude}, ${store.Longtitude})` || "-"}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default MyComponent