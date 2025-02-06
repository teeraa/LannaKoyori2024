"use client";
import { useEffect, useState } from "react";
import Pagination from "../components/pagination";
import ProductCard from "../components/ProductCard";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { LuLeaf } from "react-icons/lu";
import { FaRegLightbulb } from "react-icons/fa6";
import { VscSettings } from "react-icons/vsc";
import { IoClose, IoBagOutline } from "react-icons/io5";
import { IoIosSearch } from "react-icons/io";
// import { products } from '../database/product'
import axios from 'axios';

export default function ProductList() {
  const [search, setSearch] = useState("");
  const [FilterToggle, setFilterToggle] = useState(false);
  const [MaterialDropdown, setMaterialDropdown] = useState(true);
  const [TypeDrpopdown, setTypeDropdown] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [searchbtn_moblie, setsearchbtn_moblie] = useState(false);

  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleRebtn = () => {
      setsearchbtn_moblie(window.innerWidth < 640);
    };

    handleRebtn();
    window.addEventListener("hiddenText", handleRebtn);

    return () => window.removeEventListener("hiddenText", handleRebtn);
  }, []);

  function toggleSidebar() {
    setFilterToggle(!FilterToggle);
  }
  const closeFilter = () => {
    setFilterToggle(false);
  };

  function typingSearch(e: any) {
    setSearch(e.target.value);
  }

  const fetchProducts = async (material: string | null = null) => {
    setIsLoading(true);
    setError(null);
    try {
      const params: Record<string, any> = {};
      if (material) params.material = material;

      const response = await axios.get('/api/products', { params });
      setFilteredProducts(response.data);

    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to fetch products');
    } finally {
      setIsLoading(false);
    }
  };
  const fetchMaterials = async () => {
    try {
      const response = await axios.get('api/materials');
      setMaterials(response.data);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to fetch materials');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
    fetchMaterials();
  }, []);

  // คำนวณการแบ่งหน้าข้อมูล
  const startIndex = (currentPage - 1) * pageSize;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + pageSize);
  // กรองแล้วให้ pagin กลับมาหน้าแรก
  const currentProductsFiltered = filteredProducts.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const value = e.target.value;
    setSearch(value);
    try {
      fetchProducts(selectedMaterial)
      setCurrentPage(1);
    } catch {
      console.error('Error fetching search results:', error);
    }

  };

  // ฟังก์ชันที่ใช้ในการเปลี่ยนหน้า
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // ฟังก์ชันที่ใช้ในการเปลี่ยนจำนวนรายการที่แสดงต่อหน้า
  const handleLimitChange = (newLimit: number) => {
    setPageSize(newLimit);
    setCurrentPage(1);
  };

  const MaterialFilter = (material: string) => {
    const newMaterial = selectedMaterial === material ? null : material
    setSelectedMaterial(newMaterial);
    fetchProducts(newMaterial);
  };
  const TypeFilter = (type: string) => {
    setSelectedType(selectedType === type ? null : type);
    setSearch("");
  };

  const workTypes = [
    "ของตกแต่ว",
    "เครื่องใช้ในบ้าน",
    "อุปกรณ์สํานักงาน",
    "อุปกรณ์อื่นๆ",
  ];

  return (
    <div className="md:container">
      <div className="fixed inset-0 z-0 flex justify-start items-start top-40">
        <div className="w-10/12 h-40 md:h-96 bg-gradient-to-tr from-cyan-500 via-blue-300 to-green-500 rounded-[60%] blur-3xl opacity-30 transform scale-110 rotate-[20deg] md:rotate-[20deg]">
        </div>
      </div>
      <div className="fixed inset-0 z-0 flex justify-end items-end bottom-0">
        <div className="w-96 h-96 md:h-96 bg-gradient-to-tr from-cyan-500 via-blue-300 to-red-500 rounded-[60%] blur-3xl opacity-30 transform scale-80 rotate-[0deg] md:rotate-[140deg]">
        </div>
      </div>
      <div className="flex h-full max-h-full md:h-screen lg:h-screen overflow-hidden bg-white/75 border-none border-gray-200 md:border pt-12 lg:pt-[68px] md:pt-[68px]">
        <aside
          className={`fixed inset-y-0 left-0 w-3/4 lg:w-1/4 h-full border-l no-scrollbar overflow-y-auto border-gray-200 bg-white transform transition-transform duration-300 ease-in-out z-50 md:z-20 lg:static lg:translate-x-0 ${FilterToggle ? "translate-x-0 w-full" : "-translate-x-full"
            }`}
        >
          <div className="sticky top-0 inset-x-0 z-20 px-4 py-[11px] text-center border-y border-gray-200 bg-gray-50 flex items-center justify-between lg:justify-center md:justify-between">
            <h1 className="text-3xl font-medium text-gray-600">กรองข้อมูล</h1>
            <button
              onClick={closeFilter}
              className={`text-2xl text-gray-800 ${!FilterToggle ? "hidden" : "block"
                }`}
            >
              <IoClose />
            </button>
          </div>
          <div className="w-full no-scrollbar">
            <div className="w-full overflow-y-auto">
              <div className="mb-4 text-gray-600">
                <button
                  className="w-full text-left py-2 px-4"
                  onClick={() => setMaterialDropdown(!MaterialDropdown)}
                >
                  <h1 className="flex items-center gap-2">
                    <LuLeaf />
                    <span className="font-semibold">วัถุดิบ</span>
                    {MaterialDropdown ? (
                      <IoIosArrowUp className="ml-auto w-4 h-4 transform" />
                    ) : (
                      <IoIosArrowDown className="ml-auto w-4 h-4 transform" />
                    )}
                  </h1>
                </button>

                {MaterialDropdown && (
                  <ul className="mt-2 flex flex-wrap gap-4 overflow-y-auto justify-start mx-4 max-h-60">
                    {materials.map((type: any) => (
                      <li key={type?.ID}>
                        <button
                          onClick={() => MaterialFilter(type?.Material)}
                          className={`text-md block py-1 px-3 rounded-md border border-gray-300 font-light transition ${selectedMaterial == type?.Material
                            ? "bg-blue-500 text-white"
                            : "bg-white hover:bg-gray-200 text-gray-800"
                            }`}
                        >
                          {type?.Material}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

               <div className="mb-4 text-gray-600">
                <button
                  className="w-full text-left py-2 px-4"
                  onClick={() => setTypeDropdown(!TypeDrpopdown)}
                >
                  <h1 className="flex items-center gap-2">
                    <FaRegLightbulb />
                    <span className="font-semibold">ประเภท</span>
                    {TypeDrpopdown ? (
                      <IoIosArrowUp className="ml-auto w-4 h-4 transform" />
                    ) : (
                      <IoIosArrowDown className="ml-auto w-4 h-4 transform" />
                    )}
                  </h1>
                </button>

                {TypeDrpopdown && (
                  <ul className="mt-2 flex flex-wrap gap-4 overflow-y-auto justify-start mx-4 max-h-60">
                    {/* {workTypes.map((type) => (
                      <li key={type}>
                        <a
                          href="#"
                          className="text-sm block py-1 px-3 bg-white rounded-md border border-gray-300 font-light hover:bg-gray-200 transition"
                        >
                          {type}
                        </a>
                      </li>
                    ))} */}
                  </ul>
                )}
              </div>  
            </div>
          </div>
        </aside>

        <main
          className={`w-screen flex-1  h-full overflow-y-auto relative no-scrollbar top-[-2px] lg:top-0 md:top-0 transform duration-300 ease-in-out md:border-x border-gray-200 `}>

          <div className="sticky top-0  flex-1 overflow-y-auto bg-white/75 backdrop-blur-m z-20  border-none md:border-y border-gray-200 ">
            <div className="bg-gray-50 flex justify-center items-center h-full py-2 px-2 md:px-4 border-y border-gray-200 rounded-none w-full ">
              <button
                className="lg:hidden md:block bg-white text-gray-500 py-1 px-1 rounded-md mr-2 border border-gray-300"
                onClick={toggleSidebar}
              >
                <VscSettings size={24} />
              </button>
              <form
                // onSubmit={handleSearchSubmit}
                className="flex items-center w-full justify-center"
              >

                <input
                  type="text"
                  className="w-full py-1 px-4 md:py-2 md:px-4 rounded-l border border-gray-200 focus:outline-none"
                  placeholder="ค้นหาบุคคล"
                  value={search}
                  onChange={handleSearchChange}
                />
                <button type="submit" className="bg-blue-500 text-white py-1 px-2 md:py-2 md:px-4 border border-blue-500 rounded-r-md hover:bg-blue-600">
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
                <span className="font-medium text-blue-950">
                  {search ? search : "ค้นหาบุคคล"}
                </span>
                "
              </h1>
              <div className="flex justify-center items-center gap-2 ">
                <IoBagOutline className="text-gray-600 " />
                <p className="font-light text-gray-600">ค้นพบ</p>
                {!isLoading ? (
                  <h1 className="text-gray-600 font-light">
                    {filteredProducts ? filteredProducts.length : 0}
                  </h1>
                ) : (
                  <span className="loading loading-dots loading-xs"></span>
                )
                }
              </div>
            </div>

          </div>

          {isLoading ? (
            <span className=" absolute top-1/2 left-1/2 loading loading-spinner loading-xl w-40 h-40 bg-gradient-to-r from-blue-950 via-blue-500 to-cyan-400 animate-spin"></span>
          ) : (
            <div className="space-y-4 bg-[#F0F3F8]/75 md:rounded-none rounded-md">
              <div className="px-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center py-4 px-16 md:px-0 ">
                  {currentProducts.length > 0 ? (
                    currentProductsFiltered.map((product: any) => (
                      <ProductCard
                        key={product.ID || "-"}
                        ID={product.ID}
                        productName={product.productName || "-"}
                        BusinessName={product.businessinfo.BussinessName || "-"}
                        image={`/images/entreprenuer/Koyori_${product.businessinfo?.DataYear}/${product.businessinfo?.BussinessNameEng.replace(/\s+/g, '')}/Product/${product.productName.replace(/\s+/g, '')}/${product.image}` || ""}
                      />
                    ))
                  ) : (
                    <p>ไม่พบสมาชิก</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {!isLoading ? (
            <div className=" sticky bottom-0 w-full bg-white px-4">
              <Pagination
                totalPages={Math.ceil(filteredProducts.length / pageSize)}
                filteredData={filteredProducts.length}
                onChangePage={handlePageChange}
                onChangeLimit={handleLimitChange}
              />
            </div>
          ) : null}
        </main>

      </div >
    </div>
  );
}
