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
    if (ID) router.push(`/members/${ID}`)
  };

  return (
    <div className="bg-white rounded-md hover:shadow-lg p-4 cursor-pointer shadow-md w-full" onClick={handleMemberLink}>
      <div className="rounded-md bg-white w-full">
        <div className="mx-auto w-full aspect-square max-w-[200px] group overflow-hidden">
          <Image
            src={img || "/images/default.jpg"}
            alt={NameThai}
            width={200}
            height={200}
            quality={90}
            placeholder="blur"
            blurDataURL="/images/default.jpg"
            priority={true}
            className="rounded-md transition-transform duration-300 group-hover:scale-110 origin-center w-full h-full object-cover"
            sizes="(max-width: 640px) 150px, (max-width: 768px) 180px, (max-width: 1024px) 200px, 220px"
          />
        </div>

        <div className="mt-2 w-full">
          <h1 className="text-xl text-start text-gray-600 truncate w-full">
            {NameThai}
          </h1>
          <h1 className="text-md text-start text-gray-400 flex justify-start items-center gap-2 truncate w-full font-light">
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



