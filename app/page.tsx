"use client";
import { KeyValue, contact, personals } from "./database/Home";
import Image from "next/image";
import logo from "../public/images/koyori-logo-banner.png";
import Footer from "./components/footer";

// swiper slide
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import GoogleTranslate from "./components/GoogleTranslate";

import Marquee from "react-fast-marquee";

const SponsorImage = [
  { id: 1, image: "/images/worchor.png", alt: "sponsor1" },
  { id: 2, image: "/images/high_education.png", alt: "sponsor2" },
  { id: 3, image: "/images/otop.png", alt: "sponsor3" },
  { id: 4, image: "/images/develop_human.png", alt: "sponsor4" },
  { id: 5, image: "/images/pbs.png", alt: "sponsor5" },
  { id: 6, image: "/images/cea.png", alt: "sponsor6" },
  { id: 7, image: "/images/yip.png", alt: "sponsor7" },
  { id: 8, image: "/images/lanna_culture.png", alt: "sponsor8" },
  { id: 9, image: "/images/rmutl.png", alt: "sponsor9" },
];
function SponsorMarquee() {
  return (
    <div className="flex flex-row gap-12 ml-12">
      {SponsorImage.map((sponsor) => (
        <div
          key={sponsor.id}
          className="w-20 h-20 md:w-32 md:h-32 flex justify-center items-center overflow-hidden"
        >
          <Image
            src={sponsor.image}
            width={160}
            height={160}
            alt={sponsor.alt}
            quality={100}
            priority={true}
            className="object-center w-full h-full object-contain flex justify-center items-center"
          />
        </div>
      ))}
    </div>
  );
}

export default function Home({}) {
  return (
    <>
      {/* <main className="main relative bg-gradient-to-b from-white via-gray-100 to-white"> */}
      <main className="bg-white relative">
        <div className="w-full h-screen lg:h-[60vh] md:h-full bg-no-repeat bg-cover md:bg-fixed bg-center relative">
          <div
            className="absolute w-full h-screen lg:h-[70vh] md:h-full bg-no-repeat bg-cover md:bg-fixed bg-center"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, rgba(255,255,255,1), rgba(255, 255, 255, 0.7), rgba(255,255,255,1)), url('/images/banner.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              width: "100%",
              zIndex: 0,
              opacity: "0.5",
            }}
          ></div>
          <div className="relative container h-full">
            <div className="grid place-items-center lg:place-items-center md:place-items-center mx-auto px-0 h-full">
              <div className="flex flex-col-reverse lg:flex-row h-auto items-center justify-center px-0 ">
                <div className=" w-full sm:py-5 pb-4 sm:pb-0">
                  <h1 className="text-3xl lg:text-5xl md:text-3xl text-center lg:text-start font-bold text-blue-950 mb-0 lg:mb-4 md:mb-4">
                    โครงการยกระดับผลิตภัณฑ์หัตถศิลป์ล้านนา
                  </h1>
                  <h1 className="text-2xl lg:text-5xl md:text-3xl text-center lg:text-start  font-bold  text-red-600 mb-0 lg:mb-4 md:mb-4">
                    Lanna-Koyori Project
                  </h1>
                  <p className="text-sm lg:text-xl md:text-xl text-center text-medium lg:text-start text-gray-600">
                    Koyori
                    เป็นโครงการที่มีนักออกแบบทั้งชาวญี่ปุ่นและชาวไทยได้ร่วมมือกับช่างฝีมือจาก
                    8
                    จังหวัดทางภาคเหนือของประเทศไทยเพื่อพัฒนาคุณภาพงานหัตถกรรมด้วยการผสมผสานเทคนิคแบบดั้งเดิมเข้ากับการออกแบบที่สร้างสรรค์แล้วประดิษฐ์เป็นงานหัตถกรรมใหม่
                  </p>
                </div>

                <div className="fixed inset-0 z-0 flex justify-start items-start top-40">
                  <div className="w-10/12 h-40 md:h-96 bg-gradient-to-tr from-cyan-500 via-blue-300 to-green-500 rounded-[60%] blur-3xl opacity-30 transform scale-110 rotate-[20deg] md:rotate-[20deg]"></div>
                </div>
                <div className="fixed inset-0 z-0 flex justify-between items-end bottom-0">
                  <div className="w-96 h-96 md:h-96 bg-gradient-to-tr from-cyan-500 via-blue-300 to-red-500 rounded-[60%] blur-3xl opacity-30 transform scale-80 rotate-[0deg] md:rotate-[140deg]"></div>
                </div>

                <div className="relative w-3/4 lg:w-1/3 md:w-1/2">
                  <div className="flex justify-center lg:justify-end md:justify-center">
                    <Image
                      src={logo}
                      width={600}
                      height={600}
                      alt="models"
                      priority={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="relative z-10 pb-8 -top-20 md:top-5 lg:-top-24">
            <div className="flex justify-center">
              <div className="w-full max-w-[300px] md:max-w-lg lg:max-w-2xl bg-white/40 p-4 rounded-md">
                <div className="aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src="https://www.youtube.com/embed/vWvjqOVJOio?autoplay=1&mute=1"
                    title="YouTube video player"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen={true}
                    className="rounded-lg "
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container flex items-center my-4 pt-28 md:pt-0 lg:pt-[350px]"></div>
        <div className="bg-white p-0 h-full">
          <div className="container flex items-center py-4">
            <h1 className="text-3xl md:text-3xl lg:text-5xl font-bold md:mr-4 lg:mr-4 mr-4 text-blue-950">
              ผู้สนับสนุน
            </h1>
            <hr className="border-t-4 border-blue-950 flex-grow"></hr>
          </div>
          <div className="container relative text-center text-block py-5">
            <Marquee
              pauseOnHover={true}
              speed={20}
              direction="left"
              gradientWidth={100}
              gradientColor="rgba(23, 37, 84, 0.2)"
              gradient={false}
            >
              <SponsorMarquee />
            </Marquee>
          </div>
        </div>

        <div className="container ">
          {/*marquee */}
          {/* <div className="flex items-center my-4">
            <h1 className="text-3xl md:text-3xl lg:text-5xl font-bold md:mr-4 lg:mr-4 mr-4 text-blue-950">
              ผู้สนับสนุน
            </h1>
            <hr className="border-t-4 border-blue-950 flex-grow"></hr>
          </div>
          <div className="bg-blue-950 p-0 h-full">
            <div className="relative  text-center text-block py-5">
              <Marquee
                pauseOnHover={true}
                speed={20}
                direction="left"
                gradientWidth={100}
                gradientColor="rgba(255, 255, 255, 0.9)"
              >
                <SponsorMarquee />
              </Marquee>
            </div>
          </div> */}

          <div className="flex items-center my-4">
            <hr className="border-t-4 border-blue-950 flex-grow"></hr>
            <h1 className="text-3xl md:text-3xl lg:text-5xl font-bold md:ms-4 lg:ms-4 ms-4 text-blue-950">
              คำสำคัญ
            </h1>
          </div>
          <div
            id="about"
            className="grid grid-cols-2 md:grid-cols-3 place-items-center lg:flex lg:flex-wrap lg:justify-center lg:items-center gap-4 py-4"
          >
            {KeyValue.map((item: any) => (
              <div
                key={item.id}
                className="relative z-10 rounded-md m-2 w-40 md:w-48 drop-shadow-md inline-block 
        bg-gradient-to-tl from-blue-600 via-transparent to-cyan-500 p-px"
              >
                <div className="p-4 md:card-body lg:card-body text-blue-950 text-center bg-white rounded-md">
                  <h1 className="text-3xl lg:text-5xl md:text-4xl mb-2 flex justify-center items-center">
                    {item.icon}
                  </h1>
                  <h1 className="text-sm md:text-2xl text-nowrap">
                    {item.titleTH}
                  </h1>
                  <h1 className="text-sm md:text-lg">{item.titleEN}</h1>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-950 p-0 h-full">
          <div className="relative container text-center text-white py-5">
            <h1 className="text-[16px] lg:text-xl md:text-[16px]">
              โคะโยะริ หมายถึงเชือกเหนียวและแข็งแรง
              ที่ได้มาจากการฟั่นเกลียวจากกระดาษอ่อน
            </h1>
            <h1 className="text-[16px] lg:text-xl md:text-[16px]">
              「こより」とは柔らかな紙をより合わせることでできる丈夫な糸のことを言います。
            </h1>
            <h1 className="text-[16px] lg:text-xl md:text-[16px]">
              Koyori is tough string made from twisted soft paper.
            </h1>
          </div>
        </div>

        <div className="container">
          <div className="flex items-center my-4">
            <h1 className="text-3xl md:text-3xl lg:text-5xl font-bold md:mr-4 lg:mr-4 mr-4 text-blue-950">
              คำนิยม
            </h1>
            <hr className="border-t-4 border-blue-950 flex-grow"></hr>
          </div>
          <div className="container py-4">
            <Swiper
              modules={[Pagination, Autoplay]}
              pagination={{
                clickable: true,
                el: ".custom-pagination",
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
                1024: { slidesPerView: 2 },
                1280: { slidesPerView: 3 },
              }}
              className="relative"
            >
              {personals.map((personal: any, index) => (
                <SwiperSlide className="my-4 flex justify-center" key={index}>
                  <div className="bg-white pb-4 py-6 px-6 w-64 lg:w-72 md:w-72 h-[450px] drop-shadow-[0px_0px_10px_rgba(0,0,0,0.09)]  border-1 boderder border-gray-300 rounded-lg mx-auto overflow-hidden  duration-300 transition ease-in-out">
                    <div className="space-y-4">
                      <div className="w-96 h-10 bg-blue-950 rotate-45 absolute -right-40">
                        <p className="absolute top-1/2 left-1/2 -translate-x-12 -translate-y-1/2 rotate-60 text-center text-white text-md md:text-2xl">
                          {personal.year}
                        </p>
                      </div>
                      <div className="mx-auto w-32 h-32 rounded-full overflow-hidden bg-gray-200 mb-4 relative">
                        <Image
                          src={personal.image}
                          alt={personal.name}
                          layout="fill"
                          priority={true}
                          className=""
                          style={{
                            objectFit: "cover",
                            objectPosition: "top center",
                            width: "100%",
                            height: "100%",
                          }}
                        />
                      </div>
                      <div className="">
                        <h3 className="text-xl font-semibold text-blue-950 text-center text-wrap">
                          {personal.name}
                        </h3>
                        <p className="text-gray-400 text-center truncate ">
                          {personal.position}
                        </p>
                      </div>
                      <div className="description">
                        <p
                          className="text-gray-500 text-md overflow-hidden mt-4"
                          style={{
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 3,
                            lineClamp: 3,
                          }}
                        >
                          {personal.text}
                        </p>
                      </div>
                      <div className="text-center mt-4 border-t border-gray-300 bottom-2 left-0 right-0 absolute w-full">
                        <button className="px-3 pt-2 text-blue-950">
                          อ่านเพิ่มเติม
                        </button>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="custom-pagination absolute bottom-0 left-0 right-0 flex justify-center mt-4"></div>
          </div>
        </div>

        <div
          className="relative w-full h-full lg:h-full md:h-full z-10"
          id="contact"
        >
          <div className="container py-4">
            <div className="flex items-center">
              <hr className="border-t-4 border-blue-950 flex-grow"></hr>
              <h1 className="text-3xl md:text-3xl lg:text-5xl font-bold md:ms-4 lg:ms-4 ms-4 text-blue-950">
                ช่องทางการติดต่อ
              </h1>
            </div>
            <div className="block md:flex py-4 justify-start gap-4 space-y-4 ">
              <div className=" flex flex-col jstify-start items-start w-full md:w-1/4 gap-4 ">
                {contact.map((item: any) => (
                  <div
                    key={item.id}
                    className="rounded-md  bg-base-500 p-4 items-center m-0 w-full bg-white "
                  >
                    <b className="text-3xl m-0 p-0 text-blue-950">
                      {item.icon}
                    </b>
                    <div className="">
                      <h4 className="text-gray-600 font-bold">{item.title}</h4>
                      <p className="text-gray-500">{item.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="w-full md:w-3/4 ">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3786.521992403125!2d99.59297107518798!3d18.36907928269539!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30d9127bfc5f3283%3A0xd1908855f2f0f59c!2z4Lih4Lir4Liy4Lin4Li04LiX4Lii4Liy4Lil4Lix4Lii4LmA4LiX4LiE4LmC4LiZ4LmC4Lil4Lii4Li14Lij4Liy4LiK4Lih4LiH4LiE4Lil4Lil4LmJ4Liy4LiZ4LiZ4LiyIOC4peC4s-C4m-C4suC4hw!5e0!3m2!1sth!2sth!4v1733463021019!5m2!1sth!2sth"
                  className="w-full h-96 md:h-full rounded-lg"
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
        <div className="relative">
          <Footer />
        </div>
      </main>
    </>
  );
}
