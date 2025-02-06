"use client";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import Footer from "@/app/components/footer";

// swiper slide
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import { useState, useEffect } from "react";

import axios from "axios";

export default function StoreDetail() {
    const pathname = usePathname();
    const params = useParams();
    const ID = parseInt(params.ID as string);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [stores, setStores] = useState<any>([]);
    const [filteredProducts, setFilteredProducts] = useState([]);

    const storeArray = Array.isArray(stores) ? stores : [stores];
    const store = storeArray.flat().find((m: any) => m.ID === ID);

    const fetchStores = async (id: Number) => {

        try {
            // เรียก API ด้วย Axios
            const response = await axios.get(`/api/business/${id}`)
            setStores(response.data)
        } catch (error: any) {
            setError(error.response?.data?.error || 'Failed to fetch Stores');
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
        fetchStores(ID); // ดึงข้อมูลทั้งหมดเมื่อโหลดหน้าเว็บ
        fetchProducts(ID);
    }, [ID, ID]);
    console.log(ID);
    if (!store) {
        return <div className="container">ไม่พบข้อมูลร้านค้า</div>;


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
                <main className="pt-12 md:pt-[68px]">
                    <div className="bg-red-200 w-full h-[200px] sm:h-[300px] overflow-hidden relative rounded-b-md">
                        <Image
                            src="/images/coverpage.jpg"
                            layout="fill"
                            alt="models"
                            priority={true}
                            quality={90}
                            style={{
                                objectFit: "cover",
                                objectPosition: "top center",
                                width: "100%",
                                height: "100%",
                            }}
                            className="h-full"
                        />
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 py-4 md:p-4 md:py-4  lg:px-0">
                        <div className="col-span-1 lg:col-span-2 flex flex-col items-start justify-start p-4 bg-white/75 rounded-md z-10 border border-gray-100">
                            <h1 className="text-2xl lg:text-4xl font-bold text-gray-600 text-wrap mb-0">{store.BussinessName} </h1>
                            <h2 className="text-xl text-gray-400 text-wrap mb-6">({store.BussinessNameEng})</h2>
                            <div className="grid grid-cols-[1fr_2fr] gap-y-4 text-sm lg:text-md text-gray-600 w-full">
                                <div className="font-semibold text-gray-500">เบอร์โทรศัพท์</div>
                                <div className="text-gray-400 text-wrap">{store.personinfo.Contact}</div>
                                <div className="font-semibold text-gray-500">ตำแหน่ง</div>
                                <div className="text-gray-400 text-wrap">{store.personinfo.RoleThai}</div>
                                <div className="font-semibold text-gray-500">ปี</div>
                                <div className="text-gray-400 text-wrap">{store.DataYear}</div>
                                <div className="font-semibold text-gray-500">เพศ</div>
                                <div className="text-gray-400 text-wrap">{store.personinfo.gender}</div>
                            </div>
                        </div>
                        <div className="col-span-1 lg:col-span-3 border border-gray-100 rounded-md p-4 bg-white/75 relative">
                            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
                                <div className="grid place-items-center md:flex justify-center items-center gap-4">
                                    <div className="relative w-[160px] h-[160px] md:w-[200px] md:h-[200px]">
                                        <Image
                                            src={`/images/entreprenuer/Koyori_${store.DataYear}/${store.BussinessNameEng.replace(/\s+/g, '')}/Profile/${store.personinfo.picture}` || "/images/entreprenuerdKfault.png"}
                                            className="rounded-full border-4 sm:border-6 border-white"
                                            layout="fill"
                                            objectFit="cover"
                                            alt="models"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <h1 className="text-center md:text-start text-sm lg:text-lg font-regular text-white bg-blue-950 px-2 py-1 rounded-md w-fit mx-auto md:mx-0">
                                            ผู้ประกอบการ
                                        </h1>
                                        <h1 className="text-center md:text-start  text-2xl lg:text-4xl font-bold text-gray-600 text-wrap">{store.personinfo.NameThai}</h1>
                                        <h2 className="text-center md:text-start  text-xl md:text-xl text-gray-400 text-wrap">{store.personinfo.NameEng}</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6">
                                <h1 className="sticky top-0 text-2xl font-bold mb-4 text-gray-600">เกี่ยวกับผู้ประกอบการ</h1>
                                <div className="max-h-60 overflow-y-auto">
                                    <p className="text-lg text-gray-500">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Atque odit harum eos unde nobis doloremque non assumenda? Provident nulla, nesciunt nam tempore harum explicabo velit minus ut sunt suscipit sint modi ea quasi, praesentium omnis repellendus tempora maiores, rem asperiores cupiditate iure atque. Temporibus cum eligendi repellendus commodi amet nostrum velit inventore veritatis rerum odio iusto iste, vel voluptatem, assumenda minus aliquam nisi laborum. Quae, sed impedit. Nisi vero cum, quis eligendi est, perspiciatis laudantium architecto quibusdam reprehenderit non blanditiis nam totam assumenda deleniti, officia voluptatem rem neque. Ducimus eius blanditiis doloribus? Distinctio debitis adipisci aut iure at maiores veritatis deserunt omnis laudantium, dolorem soluta? Deleniti, modi. Cumque iure reprehenderit debitis alias accusamus dolores veniam cum iusto, nemo quidem adipisci! Cupiditate nulla ipsa et fugit dolorum voluptate impedit assumenda quae, mollitia excepturi! Alias rerum quasi reiciendis ea sit facere veniam inventore voluptatem, deserunt quibusdam quo. Optio, odio temporibus esse fuga labore, unde consequuntur voluptate eveniet sequi, aspernatur cum iure nulla! Nesciunt reiciendis voluptatem corrupti vitae cumque commodi expedita illum a omnis quod harum optio ratione ut inventore, veniam rem, rerum minus. Nihil assumenda quidem eius totam necessitatibus eum est minus facere fugit repudiandae, dolorum laudantium, harum amet, ullam sit similique! Error similique sed laudantium quos dolorum velit quibusdam, molestias minus nesciunt quis magnam et eaque nostrum optio voluptatum vero a iure obcaecati reiciendis fugiat? Quae blanditiis maxime labore molestiae obcaecati quia autem soluta hic sit est praesentium, tempora laborum, dolorem qui et. Nisi enim quidem adipisci nihil suscipit ut maxime!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {store.urldata != null ? (
                        <div className="grid grid-cols-1 py-4 md:p-4 md:py-4  lg:px-0">
                            <div className="col-span-1 flex flex-col items-center justify-start p-4 bg-white/75 rounded-md z-10 border border-gray-100">
                                <iframe src={store.urldata.url} width="1200" height="600" allowFullScreen />

                            </div>
                        </div>
                    ): ("")}

                </main>
                <div className="relative">
                    <div className="flex items-center my-4">
                        <hr className="border-t-4 border-gray-600 flex-grow"></hr>
                        <h1 className="text-3xl md:text-3xl lg:text-5xl font-bold md:ms-4 lg:ms-4 ms-4 text-gray-600">
                            สินค้าภายในร้าน
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
                                            <Image src={`/images/entreprenuer/Koyori_${product.businessinfo?.DataYear}/${product.businessinfo?.BussinessNameEng.replace(/\s+/g, '')}/Product/${product.productName.replace(/\s+/g, '')}/${product.image}` || ""} width={150} height={150} alt="models" className="rounded-md hover:shadow-md border-3 border-white shadow-md hover:border-2" />
                                        </Link>
                                    </SwiperSlide>
                                ))}
                            </Swiper>)
                            : (
                                <div className="">
                                    {filteredProducts.map((product: any) => (
                                        <SwiperSlide className="my-4 flex justify-center" key={product.ID}>
                                            <Link key={product.ID} href={`/products/${product.ID}`} className="cursor-pointer flex justify-center w-full">
                                                <Image src={`/images/entreprenuer/Koyori_${product.businessinfo?.DataYear}/${product.businessinfo?.BussinessNameEng.replace(/\s+/g, '')}/Product/${product.productName.replace(/\s+/g, '')}/${product.image}` || ""} width={150} height={150} alt="models" className="rounded-md hover:shadow-md border-3 border-white shadow-md hover:border-2" />
                                            </Link>
                                        </SwiperSlide>
                                    ))}
                                </div>
                            )
                        }
                    </div>
                    <div className="custom-pagination absolute bottom-0 left-0 right-0 flex justify-center mt-4"></div>
                </div>
            </div>
            <Footer />
        </>
    );
}
