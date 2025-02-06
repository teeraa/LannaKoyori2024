"use client";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Footer from "@/app/components/footer";

import { AiOutlineLink } from "react-icons/ai";

// swiper slide
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

import axios from "axios";

export default function MemberDetail() {
    const pathname = usePathname();
    const params = useParams();
    const ID = parseInt(params.ID as string);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [members, setMembers] = useState<any>([]);
    const [filteredProducts, setFilteredProducts] = useState([]);

    // หา member ที่ ID ตรงกัน
    const member = members.flat().find((m: any) => m.ID === ID);
    const businessID = member?.businessinfo?.ID;

    const fetchMembers = async ( id : Number ) => {

        try {
            // เรียก API ด้วย Axios
            const response = await axios.get(`/api/members/${id}`)
            setMembers(response.data)
        } catch (error: any) {
            setError(error.response?.data?.error || 'Failed to fetch members');
        } finally {
            setIsLoading(false);
        }
    };
    const fetchProducts = async (id: number | null = null) => {
        try {
            const params: Record<string, any> = {};
            if (id) params.businessID = id;

            const response = await axios.get('/api/productByBus', { params });
            setFilteredProducts(response.data);

        } catch (error: any) {
            setError(error.response?.data?.error || 'Failed to fetch products');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers(ID); // ดึงข้อมูลทั้งหมดเมื่อโหลดหน้าเว็บ
        fetchProducts(businessID)
    }, [ID, businessID]);

    if (!member) {
        return <div className="container">ไม่พบข้อมูลสมาชิก</div>;
    }
    return (
        <>
            <div className="container pb-10">
                <div className="fixed inset-0 z-0 flex justify-start items-start top-40">
                    <div className="w-10/12 h-40 md:h-96 bg-gradient-to-tr from-cyan-500 via-blue-300 to-green-500 rounded-[60%] blur-3xl opacity-30 transform scale-110 rotate-[20deg] md:rotate-[20deg]">
                    </div>
                </div>
                <div className="fixed inset-0 z-0 flex justify-end items-end bottom-0">
                    <div className="w-96 h-96 md:h-96 bg-gradient-to-tr from-cyan-500 via-blue-300 to-red-500 rounded-[60%] blur-3xl opacity-30 transform scale-80 rotate-[0deg] md:rotate-[140deg]">
                    </div>
                </div>
                <main className=" pt-12 md:pt-[68px]">
                    <div className="bg-red-200 w-full h-[200px] sm:h-[300px] overflow-hidden relative rounded-b-md">
                        <Image
                            src={`/images/entreprenuer/koyori_${member.businessinfo?.DataYear}/${member.businessinfo?.ID}/banner/${member.businessinfo?.picture}` || "/images/default.jpg"}
                            layout="fill"
                            alt="models"
                            priority={true}
                            quality={90}
                            style={{
                                objectFit: "cover",
                                objectPosition: "top",
                                width: "100%",
                                height: "100%",
                            }}
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:p-4 px-0 py-4 lg:px-0">
                        <div className="col-span-3 md:col-span-1 flex flex-wrap md:flex-col items-center justify-center p-4 bg-white/75 rounded-md z-10 border border-gray-100">
                            <div className="relative w-[160px] h-[160px] md:w-[200px] md:h-[200px] -mt-16 sm:-mt-20 lg:-mt-24">
                                <Image
                                    src={`/images/entreprenuer/koyori_${member.businessinfo?.DataYear}/${member.businessinfo?.ID}/Profile/${member.picture}` || "/images/default.jpg"}
                                    className="rounded-full border-4 sm:border-6 border-white"
                                    layout="fill"
                                    objectFit="cover"
                                    alt={member.NameThai}
                                />
                            </div>
                            <div className="lg:text-left mt-4">
                                <h1 className="text-center text-2xl lg:text-2xl font-bold text-gray-600 text-wrap">
                                    {member.NameThai}
                                </h1>
                                <h2 className="text-center text-lg text-gray-400 text-wrap">
                                    ({member.NameEng})
                                </h2>
                            </div>
                            <div className="mt-6">
                                <div className="grid grid-cols-[1fr_2fr] gap-2 text-sm lg:text-md text-gray-600">
                                    <div className="font-semibold text-gray-500">เบอร์โทรศัพท์</div>
                                    <div className="text-gray-400 text-wrap">{member.Contact}</div>
                                    <div className="font-semibold text-gray-500">ตำแหน่ง</div>
                                    <div className="text-gray-400 text-wrap">{member.RoleThai}</div>
                                    <div className="font-semibold text-gray-500">ปี</div>
                                    <div className="text-gray-400 text-wrap">{member.Year}</div>
                                    <div className="font-semibold text-gray-500">เพศ</div>
                                    <div className="text-gray-400 text-wrap">{member.gender}</div>
                                </div>
                            </div>

                        </div>
                        <div className="relative col-span-3 space-y-4">

                            {/* <div className="border border-gray-100 rounded-md p-4 bg-white/75 z-10  ">
                                <Link href={`/stores/${member.businessinfo?.ID}`} className="gap-2 flex items-center">
                                    <h1 className="text-gray-600 text-md md:text-2xl font-regular ">ผู้ประกอบการร้าน <span className="font-bold text-blue-950 hover:underline">{member.businessinfo?.BussinessName}</span>
                                    </h1><AiOutlineLink size={26} className="text-gray-600" />
                                </Link>
                            </div> */}
                            <div className="border border-gray-100 rounded-md p-4 bg-white/75 z-10">
                                <h1 className="text-2xl font-bold mb-4 text-gray-600">เกี่ยวกับผู้ประกอบการ</h1>
                                <div className="max-h-60 overflow-y-auto">
                                    <p className="text-lg text-gray-400">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Neque quaerat ex expedita perspiciatis, aliquam rem cumque doloribus aliquid fugit ipsam omnis perferendis quae, eveniet ut! Voluptate repudiandae odio quaerat error eligendi distinctio iure eos? Laudantium consequuntur molestias impedit possimus, sed, ea quos repellendus saepe reprehenderit perferendis corporis obcaecati! Soluta perspiciatis esse distinctio ipsa harum quos labore voluptate consequuntur qui doloribus impedit magnam atque temporibus explicabo alias cupiditate id consectetur mollitia ab necessitatibus culpa, porro, facere itaque. Earum culpa vero voluptate tempora laudantium, quisquam, asperiores deleniti obcaecati reiciendis molestias explicabo autem saepe delectus praesentium consequuntur? Suscipit voluptas, deleniti vel aperiam debitis tempora eos alias esse. Est quasi quis eligendi ducimus similique iste illum aliquam. Debitis soluta vero, incidunt dolorem rerum accusamus laboriosam labore quasi quod neque tenetur obcaecati earum? Sit quasi corporis harum, assumenda rem perferendis eum dolorum voluptas ad, doloremque quis dolorem iste, praesentium explicabo. Beatae, quae dolor officia dolore ad voluptatem esse repellendus voluptas, fuga, facilis accusantium illo. Ipsum quam assumenda ratione optio rerum, dignissimos accusantium rem incidunt modi asperiores, architecto amet quaerat earum repellendus doloremque! Explicabo nobis, et dicta numquam autem iure quos iusto veniam magnam cumque voluptas, ad quia voluptatibus delectus aut minima quae! Explicabo voluptatum voluptas eligendi doloribus ratione, modi commodi placeat deleniti perferendis quasi iure porro esse est exercitationem officiis quis soluta dolor rem iste, voluptatem consequatur eius, sed nulla natus. Eligendi dignissimos dolores vel non, aut optio nihil adipisci facilis architecto corporis quo laboriosam quae quisquam harum numquam modi illo earum accusamus sint consequuntur.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="flex items-center my-4">
                            <hr className="border-t-4 border-gray-600 flex-grow"></hr>
                            <h1 className="text-3xl md:text-3xl lg:text-5xl font-bold md:ms-4 lg:ms-4 ms-4 text-gray-600 ">
                                สินค้าผู้ประกอบการ
                            </h1>
                        </div>

                        <div className="flex flex-wrap items-center justify-center md:justify-between gap-4 py-4">
                        {filteredProducts.length > 6 ? (
                            <Swiper
                                modules={[Pagination, Autoplay]}
                                pagination={{
                                    clickable: true,
                                    el: ".custom-pagination",
                                    dynamicBullets: false,
                                    renderBullet: (index, className) => {
                                        if (index < 6) {
                                            return `<span class="${className}"></span>`;
                                        }
                                        return '';

                                    },
                                }}
                                spaceBetween={30}
                                slidesPerView={3}
                                slidesPerGroup={1}
                                autoplay={{
                                    delay: 3000,
                                    disableOnInteraction: false,
                                }}
                                speed={1000}
                                loop={true}
                                breakpoints={{
                                    0: { slidesPerView: 1 },
                                    640: { slidesPerView: 1 },
                                    768: { slidesPerView: 2 },
                                    1024: { slidesPerView: 4 },
                                    1280: { slidesPerView: 6 },
                                }}
                                className="relative"
                            >
                                {filteredProducts.map((product: any) => (
                                    <SwiperSlide className="my-4 flex justify-center" key={product.ID}>
                                        <Link key={product.ID} href={`/products/${product.ID}`} className="cursor-pointer flex justify-center w-full">
                                            <Image src={`/images/entreprenuer/koyori_${product.businessinfo?.DataYear}/${product.businessinfo?.ID}/Product/${product.ID}/${product.image}` || ""} width={150} height={150} alt="models" className="rounded-md hover:shadow-md border-3 border-white shadow-md hover:border-2" />
                                        </Link>
                                    </SwiperSlide>
                                ))}
                            </Swiper>)
                            : (
                                <div className="">
                                    {filteredProducts.map((product: any) => (
                                        <SwiperSlide className="my-4 flex justify-center" key={product.ID}>
                                            <Link key={product.ID} href={`/products/${product.ID}`} className="cursor-pointer flex justify-center w-full">
                                                <Image src={`/images/entreprenuer/koyori_${product.businessinfo?.DataYear}/${product.businessinfo?.ID}/Product/${product.ID}/${product.image}` || ""} width={150} height={150} alt="models" className="rounded-md hover:shadow-md border-3 border-white shadow-md hover:border-2" />
                                            </Link>
                                        </SwiperSlide>
                                    ))}
                                </div>
                            )
                        }
                    </div>
                        <div className="custom-pagination absolute bottom-0 left-0 right-0 flex justify-center mt-4"></div>
                    </div>
                </main>
            </div>
            <Footer />
        </>
    );
}