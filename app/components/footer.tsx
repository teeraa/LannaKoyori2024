"use client";

import Image from "next/image";
import { FaSquareFacebook,FaLinkedin  } from "react-icons/fa6";
import { FaLine,FaInstagramSquare  } from "react-icons/fa";
import Link from "next/link";

export function Footer() {
  return (
    <div
    className="top-16 w-full h-full lg:h-full md:h-full bg-no-repeat bg-cover bg-fixed bg-center"
    style={{
      backgroundImage:
        "linear-gradient(to bottom, rgba(23,37,84,0.9), rgba(23, 37, 84, 0.9), rgba(23,37,84,0.9)), url('/images/banner.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      width: "100%",
    }}
  >
      <div className="container" id="#contact">
        <footer className="text-white py-3">
          <div className="flex justify-between my-3">
            <div className="logo-contact text-center">
              <div className="logo">
                <Image
                  src="/images/koyori_footer.png"
                  width="107"
                  height="152"
                  alt="logo"
                />
              </div>
              <div className="contact flex justify-center gap-2">
                <FaSquareFacebook />
                <FaLine />
                <FaLinkedin />
                <FaInstagramSquare  />
              </div>
            </div>
            <div className="menu w-2/ md:w-96 px-0">
              <ul className="grid grid-rows-4 grid-flow-col gap-0 md:gap-4">
                <li>
                  <Link href={"/"}>หน้าหลัก</Link>
                </li>
                <li>
                  <Link href={"/about"}>เกี่ยวกับ</Link>
                </li>
                <li>
                  <Link href={"/products"}>ผลิตภัณท์</Link>
                </li>
                <li>
                  <Link href={"/businesses"}>ร้านค้า</Link>
                </li>
                <li>
                  <Link href={"/members"}>สมาชิก</Link>
                </li>
                <li>
                  <Link href={"/sponsors"}>ผู้สนับสนุน</Link>
                </li>
                <li>
                  <Link href={"/location"}>ที่ตั้ง</Link>
                </li>
                <li>
                  <Link href={"/contact"}>ติดต่อ</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="copyright border-t-2 border-white text-center pt-2 mt-2">
            <h1 className="text-sm md:text-base font-light">© Lanna-Koyori Project | 2024 All rights reserved.</h1>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Footer;
