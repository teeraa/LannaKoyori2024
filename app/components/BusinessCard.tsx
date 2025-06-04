"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { GrLocation } from "react-icons/gr"

interface BusinessProps {
  BusinessID: number;
  BussinessName: string;
  location: string;
  image?: string;
  ProvinceT?: string;
}

export default function StoreCard({ image, BussinessName, BusinessID, ProvinceT }: BusinessProps) {
  const router = useRouter();

  const handleStoreLink = () => {
    router.push(`/businesses/${BusinessID}`);
  };

  return (
    // <Link href={`/members/member_detail/${BusinessID}`}>
    <div className="bg-white rounded-md hover:shadow-lg p-4 cursor-pointer shadow-md w-full group" onClick={handleStoreLink} >
      <div className="rounded-md bg-white w-full">
        <div className="mx-auto w-full aspect-square max-w-[200px] overflow-hidden rounded-md">
          <Image
            src={image || "/images/default.jpg"}
            alt={BussinessName}
            width={176}
            height={176}
            quality={90}
            placeholder="blur"
            blurDataURL="/images/default.jpg"
            priority={true}
            className="rounded-md transition-transform duration-300 group-hover:scale-110 origin-center w-full h-full object-cover"
            sizes="(max-width: 640px) 150px, (max-width: 768px) 180px, (max-width: 1024px) 200px, 220px"
            style={{
              objectFit: "cover",
              objectPosition: "center center",
              width: "100%",
              height: "100%",
            }}
          />
        </div>
        <div className="mt-2 w-full">
          <h1 className="text-xl text-start text-gray-600 truncate w-full">{BussinessName}</h1>
          <h1 className="text-md text-start text-gray-400 flex justify-start items-center gap-2 truncate w-full">
            <span>
              <GrLocation size={16} />
            </span>
            {ProvinceT}
          </h1>
        </div>
      </div>
    </div>
    // </Link>
  );
}
