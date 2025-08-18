"use client";
import Script from "next/script";
import { useEffect, useState } from "react";
import { MdGTranslate } from "react-icons/md";

export default function GoogleTranslate() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleTransaltor = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      <button className="bg-white border-2 fixed z-50 right-2 bottom-2 cursor-pointer rounded-full shadow-sm p-3" onClick={toggleTransaltor}> 
        <MdGTranslate className="text-4xl text-blue-600"/>
      </button>
      <div className={`container w-full h-full ${isOpen ? 'block' : 'hidden'}`}>
        {/* <div id="google_translate_element" className="fixed z-50 top-3 md:top-6 lg:top-6 xl:top-6 left-4 right-auto  md:left-auto md:right-4" /> */}
        <div id="google_translate_element" className="fixed z-50 bottom-20 right-3" />
      </div>
      <Script
        src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
      <Script id="google-translate-init" strategy="afterInteractive">
        {`
          function googleTranslateElementInit() {
            new google.translate.TranslateElement({
              pageLanguage: 'th',
              includedLanguages: 'th,en,ja',
              layout: google.translate.TranslateElement.InlineLayout.SIMPLE
            }, 'google_translate_element');
          }
        `}
      </Script>
    </>
  );
}
