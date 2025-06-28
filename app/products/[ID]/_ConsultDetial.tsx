"use client";
import Image from "next/image";
import { useState } from "react";
import type { ConsultantInfo } from "./_client";

interface ConsultDetailProps {
    consults: ConsultantInfo[];
    isLoading: boolean;
    isValidUrl(str: string): boolean;
}

export default function ConsultDetail({ consults, isLoading, isValidUrl }: ConsultDetailProps) {
    const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});

    const consultData = consults.map((consult: ConsultantInfo) => {
        return {
            id: consult.ID,
            name: consult.NameThai,
            nation: consult.nationality,
            picture: consult.picture,
            role: consult.RoleThai
        };
    })
    const handleImageError = (consultId: number) => {
        setImageErrors(prev => ({ ...prev, [consultId]: true }));
    };

    if (isLoading) {
        return (
            <div className="animate-pulse">
                <div className="h-8 bg-gray-300 rounded mb-4"></div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {[...Array(5)].map((_, index) => (
                        <div key={index} className="h-[165px] w-[177px] bg-gray-300 rounded-3xl"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (!consults || consults.length === 0) {
        return <div className="text-gray-600">ไม่มีข้อมูลที่ปรึกษา</div>;
    }

    return (
        <div className="">
            <div className="flex items-center my-4">
                <hr className="border-t-4 border-gray-600 flex-grow"></hr>
                <h1 className="text-3xl md:text-3xl lg:text-5xl font-bold md:ms-4 lg:ms-4 ms-4 text-gray-600">
                    ผู้ที่เกี่ยวข้อง
                </h1>
            </div>

            <div className="show-member h-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 items-center gap-8 md:gap-4 mb-4 place-content-center">
                {consultData.map((consult) => (
                    <div key={consult.id} className="personal relative mx-auto">
                        <a href={`/members/${consult.id}`}>
                            {isValidUrl(consult.picture) && !imageErrors[consult.id] ? (
                                <Image
                                    src={consult.picture}
                                    className="rounded-3xl border-4 border-white"
                                    width={177}
                                    height={165}
                                    alt={consult.name || "Consultant"}
                                    onError={() => handleImageError(consult.id)}
                                />
                            ) : (
                                <div className="w-[177px] h-[165px] bg-gray-300 rounded-3xl flex items-center justify-center">
                                    <span className="text-gray-500">ไม่มีรูป</span>
                                </div>
                            )}
                            <div className="absolute -bottom-3 left-4 w-36 bg-white rounded-full font-semibold py-1 px-4">
                                <h3 className="text-center text-nowrap text-gray-600">
                                    {consult.role || "ไม่ระบุบทบาท"}
                                </h3>
                            </div>
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}