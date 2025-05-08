"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import NavbarLogo from "../../public/images/korori-logo.png";
import SidebarLogo from "../../public/images/koyori-logo-banner.png";
import { HiOutlineMenuAlt3 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { MdArrowUpward } from "react-icons/md";
import GoogleTranslate from "./GoogleTranslate";


export default function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);


  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  const navLinks = [
    { href: "/", label: "หน้าหลัก" },
    { href: "/#about", label: "เกี่ยวกับ" },
    { href: "/products", label: "ผลิตภัณฑ์" },
    { href: "/stores", label: "ร้านค้า" },
    { href: `/members`, label: "สมาชิก" },
    { href: "/sponsors", label: "ผู้สนับสนุน" },
    { href: "/location", label: "ที่ตั้งร้าน" },
    { href: "/#contact", label: "ติดต่อ" },
  ];

  return (
    <>
      {/* navbar______________________________________ */}
      <div
        className={`fixed top-0 w-full z-40 md:border-b md:border-gray-200 md:drop-shadow-sm transition-all duration-500 ease-in-out ${isScrolled
            ? "md:backdrop-blur-md md:bg-white/75"
            : "backdrop-blur-none md:bg-white/40 md:border-b md:border-white shadow-sm"
          }`}
      >
        <div className="lg:container md:container">
          <nav
            className={`${isMenuOpen
              ? "bg-none"
              : "bg-white lg:bg-transparent md:bg-transparent"
              } container  mx-auto px-4 lg:px-0 md:px-0 md:py-0 lg:py-0 py-2 flex justify-end lg:justify-between md:justify-between items-center`}
          >
            <div className="hidden lg:block md:block">
              <Link href="/">
                <Image
                  src={NavbarLogo}
                  width={120}
                  height={120}
                  alt="Logo"
                  className="w-[80px] md:w-[120px] lg:w-[120px]"
                  priority={true}
                />
              </Link>
            </div>
            <div className="hidden md:hidden lg:flex space-x-4 lg:space-x-4 md:space-x-4">
              <ul className="flex gap-4 lg:gap-4 md:gap-4">
                {navLinks.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className={`${
                        pathname === href || pathname.startsWith(`${href}/`)
                          ? "text-sm bg-blue-950 text-white rounded-full px-3 py-1"
                          : "text-sm hover:bg-gray-200 hover:text-blue-950 px-3 py-1 rounded-full"
                        } transition-all duration-300`}
                    >
                      {label}
                    </Link>

                  </li>
                ))}
              </ul>
              {/* <GoogleTranslate /> */}
            </div>

            {/* sidebar_______________________________________ */}
            <div className="block md:block lg:hidden">
              <button
                className={`focus:outline-none text-2xl text-gray-800 transform transition-transform duration-300 ${isMenuOpen ? "rotate-90" : "rotate-0"
                  }`}
                onClick={toggleMenu}
              >
                {isMenuOpen ? (
                  <IoClose className="transition-transform duration-300" />
                ) : (
                  <HiOutlineMenuAlt3 className="transition-transform duration-300" />
                )}
              </button>
            </div>
          </nav>
        </div>
      </div>

      {isMenuOpen && (
        <div
          className="fixed inset-0 backdrop-blur bg-black bg-opacity-50 z-40"
          onClick={closeMenu}
        ></div>
      )}

      <div
        className={`${isMenuOpen ? "translate-x-0" : "translate-x-full"
          } fixed top-0 right-0 bg-white w-3/4 h-screen transition-transform duration-300 ease-in-out z-40 lg:hidden`}
      >
        <div className="flex flex-col justify-center items-center space-y-4 p-4 h-full">
          <div className="block">
            <Link href="/">
              <Image
                src={SidebarLogo}
                width={120}
                height={120}
                alt="Logo"
                className="w-[120px] md:w-[120px] lg:w-[120px]"
                onClick={closeMenu}
                priority={true}
              />
            </Link>
          </div>
          {navLinks.map(({ href, label }) => (
            <ul key={href} className="w-1/2 flex justify-center items-center">
              <Link
                href={href}
                onClick={closeMenu}
                className={`${
                  pathname === href || pathname.startsWith(`${href}/`)
                  ? "text-sm  bg-blue-950 text-white rounded-full px-3 py-2"
                  : "text-sm hover:bg-gray-200 hover:text-blue-950 px-3 py-2 rounded-full"
                  } transition-all duration-300 text-center w-full`}
              >
                {label}
              </Link>
            </ul>
          ))}
        </div>
      </div>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-4 z-50 right-4 p-3 bg-white border-2 border-blue-950 text-blue-950 rounded-full shadow-lg hover:bg-blue-1000 focus:outline-none"
        >
          <MdArrowUpward />
        </button>
      )}
    </>
  );
}
