"use client"
import Footer from "@/app/components/footer"

export default function MemberDetailSkeleton() {
  return (
    <>
      <div className="container pb-10">
        <div className="fixed inset-0 z-0 flex justify-start items-start top-40">
          <div className="w-10/12 h-40 md:h-96 bg-gradient-to-tr from-cyan-500 via-blue-300 to-green-500 rounded-[60%] blur-3xl opacity-30 transform scale-110 rotate-[20deg] md:rotate-[20deg]"></div>
        </div>
        <div className="fixed inset-0 z-0 flex justify-end items-end bottom-0">
          <div className="w-96 h-96 md:h-96 bg-gradient-to-tr from-cyan-500 via-blue-300 to-red-500 rounded-[60%] blur-3xl opacity-30 transform scale-80 rotate-[0deg] md:rotate-[140deg]"></div>
        </div>
        <main className="pt-12 md:pt-[68px]">
          <div className="w-full h-[200px] sm:h-[300px] rounded-b-md bg-gray-300 animate-pulse"></div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:p-4 px-0 py-4 lg:px-0">
            <div className="col-span-3 md:col-span-1 flex flex-wrap md:flex-col items-center justify-center p-4 bg-white rounded-md z-10 border border-gray-100">
              <div className="relative w-[160px] h-[160px] md:w-[200px] md:h-[200px] -mt-16 sm:-mt-20 lg:-mt-24">
                <div className="rounded-full border-4 sm:border-6 border-white w-full h-full bg-gray-300 animate-pulse"></div>
              </div>

              <div className="lg:text-left mt-4 w-full flex flex-col items-center">
                <div className="h-8 w-48 mb-2 bg-gray-300 rounded animate-pulse"></div>
                <div className="h-6 w-36 bg-gray-300 rounded animate-pulse"></div>
              </div>

              <div className="mt-6 w-full">
                <div className="grid grid-cols-[1fr_2fr] gap-2 text-sm lg:text-md">
                  <div className="h-5 w-24 bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-5 w-32 bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-5 w-24 bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-5 w-32 bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-5 w-24 bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-5 w-32 bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-5 w-24 bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-5 w-32 bg-gray-300 rounded animate-pulse"></div>
                </div>
              </div>
            </div>

            <div className="relative col-span-3 space-y-4">
              <div className="border border-gray-100 rounded-md p-4 bg-gradient-to-t from-white to-white z-10 relative overflow-hidden">
                <div className="h-8 w-64 mb-4 bg-gray-300 rounded animate-pulse"></div>

                <div className="space-y-3">
                  <div className="h-5 w-full bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-5 w-full bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-5 w-full bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-5 w-full bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-5 w-3/4 bg-gray-300 rounded animate-pulse"></div>
                </div>

                <div className="flex justify-center mt-8">
                  <div className="h-10 w-32 rounded-full bg-gray-300 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="flex items-center my-4">
              <hr className="border-t-4 border-gray-600 flex-grow"></hr>
              <div className="h-12 w-64 ms-4 bg-gray-300 rounded animate-pulse"></div>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-between gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6 w-full">
                {Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <div key={index} className="flex justify-center">
                      <div className="w-[150px] h-[150px] rounded-md bg-gray-300 animate-pulse"></div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="flex justify-center mt-4 gap-2">
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="w-2 h-2 rounded-full bg-gray-300 animate-pulse"></div>
                ))}
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </>
  )
}
