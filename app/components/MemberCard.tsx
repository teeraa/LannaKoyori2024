"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { VscTools } from "react-icons/vsc";


interface MemberCardProps {
  ID: number;
  NameThai: string;
  Role: string;
  img?: string;
  Gender: string;
}

export default function MemberCard({ NameThai, Role, img, ID }: MemberCardProps) {
  const router = useRouter();

  const handleMemberLink = () => {
    if (ID) router.push(`/members/${ID}`);
  };

  return (
    <div
      className="bg-white rounded-md hover:shadow-lg cursor-pointer shadow-md w-full "
      onClick={handleMemberLink}
    >
      <div className="rounded-md bg-white p-4">
        <div className="mx-auto min-w-full h-full group overflow-hidden">
          <Image
            src={img || "/images/default.jpg"}
            alt={NameThai}
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
            {NameThai}
          </h1>
          <h1 className="text-md text-start text-gray-400 flex justify-start items-center gap-2 truncate">
            <span>
              <VscTools size={16} />
            </span>
            {Role}
          </h1>
        </div>
      </div>
    </div>
  );
}
