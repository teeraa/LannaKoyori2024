"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { VscTools } from "react-icons/vsc";


interface MemberCardProps {
  ID: number;
  name: string;
  location: string;
  image?: string;
}

export default function MemberCard({ image, location, name, ID }: MemberCardProps) {
  const router = useRouter();
    
  const handleMemberLink = () => {
    router.push(`/stores/${ID}`);
  };

  return (
    // <Link href={`/members/member_detail/${ID}`}>
    <div
    className="bg-white rounded-md hover:shadow-lg p-4 cursor-pointer shadow-md w-full"
    onClick={handleMemberLink}
  >
    <div className="rounded-md bg-white p-4">
      <div className="mx-auto min-w-full h-full group overflow-hidden">
        <Image
          src={image || "/images/default.jpg"}
          alt={name}
          width={176}
          height={176}
          quality={90}
          placeholder="blur"
          blurDataURL="/images/default.jpg"
          priority={true}
          className="rounded-md transition-transform duration-300 group-hover:scale-110 origin-center"
          style={{
            objectFit: "cover",
            objectPosition: "center center",
            width: "100%",
            height: "100%",
          }}
        />
      </div>
      <div className="mt-2">
        <h1 className="card-title text-xl text-start text-gray-600 truncate">
          {name}
        </h1>
        <h1 className="text-md text-start text-gray-400 flex justify-start items-center gap-2 truncate">
          <span>
            <VscTools size={16} />
          </span>
          {location}
        </h1>
      </div>
    </div>
  </div>
    // </Link>
  );
}
