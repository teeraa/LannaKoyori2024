"use client";
import Script from "next/script";
import { useEffect } from "react";

export default function GoogleTranslate() {

  return (
    <>
      <div className="container w-full h-full">
        <div id="google_translate_element" className="fixed z-50 top-3 md:top-6 lg:top-6 xl:top-6 left-4 right-auto  md:left-auto md:right-4" />
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
