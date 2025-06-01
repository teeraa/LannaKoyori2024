export const ProductSkeleton = () => (
  <div className="bg-white rounded-md shadow-md p-4 w-[230px] md:w-full lg:w-full">
    <div className="rounded-md bg-white w-full">
      <div className="mx-auto w-full aspect-square max-w-[200px] overflow-hidden">
        <div className="w-full h-full bg-gray-300 animate-pulse rounded-md"></div>
      </div>
      <div className="mt-2 space-y-2">
        <div className="h-6 bg-gray-200 rounded w-full"></div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    </div>
  </div>
)

export const HeaderSkeleton = () => (
  <div className="flex items-center mb-4">
    <hr className="border-t-4 border-gray-600 flex-grow"></hr>
    <div className="h-12 w-56 bg-gray-300 rounded md:ms-4 lg:ms-4 ms-4 animate-pulse"></div>
  </div>
)


export const ProductSkeletonGrid = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6">
    {Array.from({ length: 1 }).map((_, index) => (
      <div key={index} className="flex justify-center w-full sm:hidden">
        <ProductSkeleton />
      </div>
    ))}
    {Array.from({ length: 6 }).map((_, index) => (
      <div key={index} className="flex justify-center w-full hidden sm:block">
        <ProductSkeleton />
      </div>
    ))}
  </div>
)

export const ProductSkeletonSwiper = () => (
  <div className="relative">
    <div className="flex gap-6 overflow-hidden py-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="flex justify-center flex-shrink-0 w-full max-w-[250px] sm:block hidden">
          <ProductSkeleton />
        </div>
      ))}
      <div className="flex justify-center flex-shrink-0 w-full max-w-[250px] sm:hidden">
        <ProductSkeleton />
      </div>
    </div>
    <div className="flex justify-center mt-4">
      <div className="flex gap-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
        ))}
      </div>
    </div>
  </div>
)
