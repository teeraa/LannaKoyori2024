"use client";
import Script from "next/script";
import { useEffect } from "react";

export default function GoogleTranslate() {

  return (
    <>
      <div className="container w-full h-full">
        <div id="google_translate_element" className="fixed z-50 top-14 sm:top-5 md:top-5 lg:top-5 right-2" />
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
