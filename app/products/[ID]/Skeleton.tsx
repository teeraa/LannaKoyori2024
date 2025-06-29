import React from 'react';

export const ProductSkeleton = () => (
  <div className="bg-white rounded-md p-4 shadow-md w-[200px] mx-auto md:mx-0 md:w-full">
    <div className="rounded-md bg-white w-full">
      <div className="mx-auto w-full aspect-square max-w-[200px] overflow-hidden rounded-md">
        <div className="w-full h-full bg-gray-300 animate-pulse rounded-md"></div>
      </div>

      <div className="flex flex-col justify-center gap-3 mt-2">
        <div className="flex items-center gap-2 w-full">
          <div className="h-6 bg-gray-300 rounded animate-pulse w-3/4"></div>
          <div className="h-5 bg-gray-200 rounded animate-pulse w-1/4"></div>
        </div>

        <div className="flex items-center w-full">
          <div className="w-4 h-4 bg-gray-300 rounded-md animate-pulse mr-2"></div>
          <div className="flex-grow border-l border-gray-200 pl-2">
            <div className="h-4 bg-gray-300 rounded animate-pulse w-full"></div>
          </div>
        </div>

        <div className="flex items-center w-full">
          <div className="w-4 h-4 bg-gray-300 rounded-md animate-pulse mr-2"></div>
          <div className="flex-grow border-l border-gray-200 pl-2">
            <div className="h-4 bg-gray-300 rounded animate-pulse w-full"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

export const HeaderSkeleton = () => (
  <div className="flex items-center mb-4">
    <hr className="border-t-4 border-gray-300 flex-grow animate-pulse"></hr>
    <div className="h-8 w-48 md:w-56 bg-gray-300 rounded md:ms-4 lg:ms-4 ms-4 animate-pulse"></div>
  </div>
)

export const ProductSkeletonGrid = () => {
  const visibilityClasses = [
    "block", // Skeleton 1: Always visible
    "hidden sm:block", // Skeleton 2: Visible from sm upwards
    "hidden md:block", // Skeleton 3: Visible from md upwards
    "hidden lg:block", // Skeleton 4: Visible from lg upwards
    "hidden xl:block", // Skeleton 5: Visible from xl upwards
    "hidden 2xl:block", // Skeleton 6: Visible from 2xl upwards
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6 ">
      {visibilityClasses.map((className, index) => (
        <div key={`grid-dynamic-skel-${index}`} className={className}>
          <ProductSkeleton />
        </div>
      ))}
    </div>
  )
}

export const ProductSkeletonSwiper = () => (
  <div className="relative pb-4">
    <div className="flex justify-center sm:justify-start gap-6 overflow-hidden">
      <div className="flex-shrink-0 w-full max-w-[250px]">
        <ProductSkeleton />
      </div>
      <div className="hidden sm:flex flex-shrink-0 w-full max-w-[250px]">
        <ProductSkeleton />
      </div>
      <div className="hidden md:flex flex-shrink-0 w-full max-w-[250px]">
        <ProductSkeleton />
      </div>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={`lg-skel-${index}`} className="hidden lg:flex flex-shrink-0 w-full max-w-[250px]">
          <ProductSkeleton />
        </div>
      ))}
    </div>
    <div className="flex justify-center mt-6">
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={`dot-${index}`} className="w-2.5 h-2.5 bg-gray-300 rounded-full animate-pulse"></div>
        ))}
      </div>
    </div>
  </div>
)

export const ProductDetailSkeleton = () => (
  <div className="animate-pulse container mx-auto px-4 py-8">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-4">
        <div className="relative bg-gray-200 rounded-md h-[400px] md:h-[400px]"></div>
        <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory">
          {[...Array(5)].map((_, index) => (
            <div key={`thumbnail-${index}`} className="snap-start flex-shrink-0 w-32 h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded-xl w-3/4"></div>
        <div className="h-6 bg-gray-200 rounded-xl w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded-xl w-2/3"></div>
        <div className="h-4 bg-gray-200 rounded-xl w-1/3"></div>
        <div className="flex gap-2">
          {[...Array(3)].map((_, index) => (
            <div key={`material-${index}`} className="h-6 bg-gray-200 rounded-md w-20"></div>
          ))}
        </div>
        <div className="flex gap-4">
          <div className="h-4 bg-gray-200 rounded-xl w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded-xl w-1/4"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
      </div>
    </div>
    <div className="mt-4">
      <div className="h-8 bg-gray-200 rounded-md w-1/4 mb-4"></div>
      <div className="h-16 bg-gray-200 rounded-md w-full"></div>
    </div>
    <div className="mt-4 grid grid-cols-1 md:grid-cols-5 gap-4">
      <div className="md:col-span-3">
        <div className="h-8 bg-gray-200 rounded-md w-1/4 mb-4"></div>
        <div className="h-24 bg-gray-200 rounded-md w-full"></div>
      </div>
      <div className="md:col-span-2">
        <div className="h-[300px] bg-gray-200 rounded-md"></div>
      </div>
    </div>
  </div>
)

export const ConsultDetailSkeleton = () => (
  <div className="relative">
    <HeaderSkeleton />
    <div className="show-member h-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 items-center gap-8 md:gap-4 mb-4 place-content-center">
      {[...Array(5)].map((_, index) => (
        <div key={`consult-skel-${index}`} className="w-full">
          <ProductSkeleton />
        </div>
      ))}
    </div>
  </div>
)