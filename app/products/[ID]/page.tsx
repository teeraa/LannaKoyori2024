"use client";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineLink } from "react-icons/ai";
import Footer from "@/app/components/footer";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import { useParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";

import axios from "axios";

export default function ProductDetail() {
    const pathname = usePathname();
    const params = useParams();
    const ID = parseInt(params?.ID as string);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [products, setProducts] = useState<any>([]);
    const [consults, setConsults] = useState<any>([]);


    // หา product ที่ ID ตรงกัน
    const product = products?.flat().find((m: any) => m.ID === ID);
    const businessID = product?.businessinfo?.ID;

    const fetchProducts = async (id: Number) => {
        setIsLoading(true);
        try {
            // เรียก API ด้วย Axios
            const response = await axios.get(`/api/products/${id}`)
            setProducts(response.data)
        } catch (error: any) {
            setError(error.response?.data?.error || 'Failed to fetch products');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchConsults = async (businessID: Number) => {
        try {
            const params: Record<string, any> = {};
            if (businessID) params.businessID = businessID;
            const response = await axios.get('/api/consultants', { params })
            setConsults(response?.data);
        } catch (error: any) {
            setError(error.response?.data?.error || 'Failed to fetch consultants');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        const Fancybox = require('@fancyapps/ui').Fancybox;
        Fancybox.bind('[data-fancybox="gallery"]');
        if (ID) {
            fetchProducts(ID); // ดึงข้อมูลทั้งหมดเมื่อโหลดหน้าเว็บ
        }
        if (businessID) {
            fetchConsults(businessID); // ดึงข้อมูลที่เกี่ยวข้องกับ businessID
        }
    }, [ID, businessID]);

    if (!product) {
        return <div className="container">ไม่พบข้อมูลสินค้า</div>;
    }
    return (
        <>
            <div className="container">
                <div className="fixed inset-0 z-0 flex justify-start items-start top-40">
                    <div className="w-10/12 h-40 md:h-96 bg-gradient-to-tr from-cyan-500 via-blue-300 to-green-500 rounded-[60%] blur-3xl opacity-30 transform scale-110 rotate-[20deg] md:rotate-[20deg]">
                    </div>
                </div>
                <div className="fixed inset-0 z-0 flex justify-end items-end bottom-0">
                    <div className="w-96 h-96 md:h-96 bg-gradient-to-tr from-cyan-500 via-blue-300 to-red-500 rounded-[60%] blur-3xl opacity-30 transform scale-80 rotate-[0deg] md:rotate-[140deg]">
                    </div>
                </div>
                <main className="relative pt-12 lg:pt-[68px] md:pt-[68px]">
                    <div className="grid items-center mb-4">
                        <div className="show-product w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 md:gap-4 overflow-hidden">
                            <div className="main-show col-span-1 h-[330px] w-[330px] mx-auto">
                                <Image
                                    src={`/images/entreprenuer/Koyori_${product?.businessinfo?.DataYear}/${product?.businessinfo?.BussinessNameEng.replace(/\s+/g, '')}/Product/${product?.productName.replace(/\s+/g, '')}/${product?.image}` || ""}
                                    className="rounded-md w-full h-auto"
                                    width="290"
                                    height="321"
                                    alt="product"
                                    priority={true}
                                    style={
                                        {
                                            objectFit: "cover"
                                            , objectPosition: "center center"
                                            , width: "100%"
                                            , height: "100%"
                                        }
                                    }
                                />
                            </div>
                            <div className="justify-center col-span-2 mt-4">
                                <h1 className="text-5xl md:text-[50px] font-bold text-gray-600 text-wrap">{product?.productName}</h1>
                                <div className="border-1 more-show rounded-md px-0 md:p-4 bg-white/50 z-10 border-gray-100">
                                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-4">
                                        {[...Array(7)].map((_, index) => (
                                            <a
                                                href={`/images/entreprenuer/Koyori_${product?.businessinfo?.DataYear}/${product?.businessinfo?.BussinessNameEng.replace(/\s+/g, '')}/Product/${product?.productName.replace(/\s+/g, '')}/${product?.image}` || ""}
                                                data-fancybox="gallery"
                                                key={index}
                                            >
                                                <Image
                                                    src={`/images/entreprenuer/Koyori_${product?.businessinfo?.DataYear}/${product?.businessinfo?.BussinessNameEng.replace(/\s+/g, '')}/Product/${product?.productName.replace(/\s+/g, '')}/${product?.image}` || ""}
                                                    className="rounded-md mb-2"
                                                    width="97"
                                                    height="97"
                                                    alt="product"
                                                />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="show-detail py-4">
                            <div className="flex text-xl md:text-3xl px-0 md:px-4 pb-4">
                                <Link href={`/businesses/${product?.businessinfo?.ID}`} className="gap-2 items-center">
                                    <h1 className="text-gray-600 text-md md:text-3xl font-regular flex">ผลิตภัณฑ์จากร้าน:
                                        <span className="font-bold text-blue-950 hover:underline text-wrap">{product?.businessinfo?.BussinessName}</span>
                                        <AiOutlineLink size={40} className="text-gray-600" />

                                    </h1>
                                </Link>
                            </div>
                            <div className="border-1 border-gray-100 rounded-md bg-white/50 md:p-4 px-0 ">
                                <h1 className="text-2xl font-semibold text-gray-600">รายละเอียดผลิตภัณฑ์</h1>
                                <h1 className="text-xl text-gray-400">
                                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vitae id nihil commodi optio fugiat dolorem rem aliquam, a delectus quae? Quia vero beatae quae ab, animi perferendis dolore quas quisquam eveniet ipsa repudiandae architecto dolor iusto illo cupiditate quam nobis reprehenderit modi temporibus quidem non dolorum quaerat voluptatum. Aspernatur, excepturi!
                                </h1>
                            </div>
                        </div>
                        <div className="show-skech grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                            <div className="skech-detail bg-white/50 text-gray-600 rounded-xl px-0 md:p-4 col-span-3">
                                <h1 className="font-semibold text-2xl text-gray-600">การออกแบบ</h1>
                                <h1 className="text-gray-400 ">
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem esse eius cumque porro tempora, commodi vero laborum similique blanditiis id neque asperiores necessitatibus fugit amet repellat excepturi maiores placeat harum voluptatum mollitia quibusdam voluptatem et. Necessitatibus quas facilis aliquid perferendis cumque laborum itaque amet nostrum dolorum? Molestias temporibus eligendi voluptate!
                                </h1>
                            </div>
                            <div className="skech-image col-span-2 flex justify-end">
                                <Image
                                    src={`/images/entreprenuer/Koyori_${product?.businessinfo?.DataYear}/${product?.businessinfo?.BussinessNameEng.replace(/\s+/g, '')}/Sketch/${product?.sketch}` || "/images/default.png"}
                                    className="rounded-xl w-full h-auto"
                                    width="365"
                                    height="300"
                                    alt=""
                                />
                            </div>
                        </div>
                    </div>
                    <div className="">
                        <div className="flex items-center my-4">
                            <hr className="border-t-4 border-gray-600 flex-grow"></hr>
                            <h1 className="text-3xl md:text-3xl lg:text-5xl font-bold md:ms-4 lg:ms-4 ms-4 text-gray-600">
                                ผู้ที่เกี่ยวข้อง
                            </h1>
                        </div>

                        <div className="show-member h-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 items-center gap-8 md:gap-4 mb-4 place-content-center">

                            {consults.map((consult: any) => (

                                <div key={consult?.ID} className="personal relative mx-auto">
                                    <a href={`/members/${consult?.ID}`}>
                                        <Image
                                            src={`/images/entreprenuer/Koyori_${consult?.businessinfo?.DataYear}/${consult?.businessinfo?.BussinessNameEng.replace(/\s+/g, '')}/Profile/${consult?.picture}` || "/images/default.png"}
                                            className="rounded-3xl border-4 border-white"
                                            width="177"
                                            height="165"
                                            alt="models"
                                        />
                                        <div className="absolute -bottom-3 left-4 w-36 bg-white rounded-full font-semibold py-1 px-4">
                                            <h3 className="text-center text-nowrap text-gray-600">
                                                {consult?.RoleThai}
                                            </h3>
                                        </div>
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
            <div className=" z-10 mt-12">
                <Footer />
            </div>
        </>
    );
}
