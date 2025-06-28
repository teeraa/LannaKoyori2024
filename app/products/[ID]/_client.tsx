"use client";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineLink } from "react-icons/ai";
import Footer from "@/app/components/footer";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import { useParams, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import ProductDetail from "./_ProductDetail";
import ConsultDetail from "./_ConsultDetial";

export interface Product {
    ID: number;
    productName: string;
    price: number;
    mainMaterialId: number;
    subMaterial1Id: number;
    subMaterial2Id: number;
    subMaterial3Id: number;
    businessId: number;
    image: string;
    sketch: string;
    description: string;
    color: string;
    size: string;
    businessInfo: BusinessInfo;
}

export interface ConsultantInfo {
    BusinessID: number;
    ID: number;
    NameThai: string;
    NameEng: string;
    gender: string;
    nationality: string;
    RoleThai: string;
    RoleEng: string;
    year: number;
    picture: string;
}

export interface BusinessInfo {
    id: number;
    dataYear: number;
    typeId: number;
    nameTh: string;
    nameEn: string;
    addressTh: string;
    latitude: string;
    longitude: string;
    logoUrl: string;
    bannerUrl: string;
    consultants: ConsultantInfo[];
}

export default function Product() {
    const pathname = usePathname();
    const params = useParams();
    const ID = parseInt(params?.ID as string);
    const [error, setError] = useState<string | null>(null);
    const [isConsultLoading, setIsCousultLoading] = useState(true)
    const [isProductLoading, setIsProductLoading] = useState(true)
    const [products, setProducts] = useState<Product[]>([]);
    const [consults, setConsults] = useState<ConsultantInfo[]>([]);

    const product = products?.find((product: Product) => product.ID === ID);

    const fetchProducts = async (ID: number) => {
        setIsProductLoading(true);
        try {
            const response = await axios.get(`/api/products/${ID}`)
            setProducts(response.data)
        } catch (error: any) {
            setError(error.response?.data?.error || 'Failed to fetch products');
        } finally {
            setIsProductLoading(false);
        }
    };

    const fetchConsults = async (ID: number) => {
        setIsCousultLoading(true);
        try {
            const response = await axios.get(`/api/consultants/${ID}`)
            setConsults(response?.data);
        } catch (error: any) {
            setError(error.response?.data?.error || 'Failed to fetch consultants');
        } finally {
            setIsCousultLoading(false);
        }
    }

    useEffect(() => {
        const Fancybox = require('@fancyapps/ui').Fancybox;
        Fancybox.bind('[data-fancybox="gallery"]');

        if (ID) {
            fetchProducts(ID);
        }
    }, [ID]);

    useEffect(() => {
        if (product?.businessId) {
            fetchConsults(product.businessId);
        }
    }, [product?.businessId]);


    function isValidUrl(str: string) {
        try {
            new URL(str)
            return true
        } catch {
            return false
        }
    }

    return (
        <>
            <div className="mx-4 md:mx-auto md:container lg:container lg:mx-auto">
                <div className="fixed inset-0 z-0 flex justify-start items-start top-40">
                    <div className="w-10/12 h-40 md:h-96 bg-gradient-to-tr from-cyan-500 via-blue-300 to-green-500 rounded-[60%] blur-3xl opacity-30 transform scale-110 rotate-[20deg] md:rotate-[20deg]">
                    </div>
                </div>
                <div className="fixed inset-0 z-0 flex justify-end items-end bottom-0">
                    <div className="w-96 h-96 md:h-96 bg-gradient-to-tr from-cyan-500 via-blue-300 to-red-500 rounded-[60%] blur-3xl opacity-30 transform scale-80 rotate-[0deg] md:rotate-[140deg]">
                    </div>
                </div>
                <main className="pt-12 md:pt-[68px] relative z-10">
                    <div>
                        {(isProductLoading || product) && (
                            <ProductDetail
                                product={product}
                                isLoading={isProductLoading}
                                isValidUrl={isValidUrl}
                            />
                        )}
                    </div>
                    {(isConsultLoading || consults) && (
                        <ConsultDetail
                            consults={consults}
                            isLoading={isConsultLoading}
                            isValidUrl={isValidUrl} 
                            />
                    )}
                </main>
            </div>
            <div className="z-10 mt-12">
                <Footer />
            </div>
        </>
    );
}