import Image from "next/image";
import Footer from "../components/footer";

export default function Home() {
  const SponsorImage = [
    { id: 1, image: "/images/worchor.png", alt: "sponsor1" },
    { id: 2, image: "/images/high_education.png", alt: "sponsor2" },
    { id: 3, image: "/images/otop.png", alt: "sponsor3" },
    { id: 4, image: "/images/develop_human.png", alt: "sponsor4" },
    { id: 5, image: "/images/pbs.png", alt: "sponsor5" },
    { id: 6, image: "/images/cea.png", alt: "sponsor6" },
    { id: 7, image: "/images/yip.png", alt: "sponsor7" },
    { id: 8, image: "/images/lanna_culture.png", alt: "sponsor8" },
    { id: 9, image: "/images/rmutl.png", alt: "sponsor9" },
  ];
  return (
    <>
      <div className="flex flex-col">
        <div className="container flex-1 flex flex-col items-center">
          <div className="fixed inset-0 z-0 flex justify-start items-start top-40">
            <div className="w-10/12 h-40 md:h-96 bg-gradient-to-tr from-cyan-500 via-blue-300 to-green-500 rounded-[60%] blur-3xl opacity-30 transform scale-110 rotate-[20deg] md:rotate-[20deg]"></div>
          </div>
          <div className="fixed inset-0 z-0 flex justify-between items-end bottom-0">
            <div className="w-96 h-96 md:h-96 bg-gradient-to-tr from-cyan-500 via-blue-300 to-red-500 rounded-[60%] blur-3xl opacity-30 transform scale-80 rotate-[0deg] md:rotate-[140deg]"></div>
          </div>
          <div className="h-full md:h-screen pt-12 lg:pt-[68px] md:pt-[68px] z-10">
            <div className="text-center py-4">
              <h1 className="text-3xl font-semibold text-gray-600">ผู้สนับสนุน</h1>
            </div>

         
            <div className="flex flex-wrap justify-center lg:justify-start md:justify-center items-center gap-6 z-10">
              {SponsorImage.map((sponsor) => (
                <div
                  key={sponsor.id}
                  className="w-40 h-40 flex justify-center items-center overflow-hidden"
                >
                  <Image
                    src={sponsor.image}
                    width={160}
                    height={160}
                    alt={sponsor.alt}
                    quality={100}
                    priority={true}
                    className="object-center w-full h-full object-contain" 
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

         <div className=" z-10 mt-4">
          <Footer />
        </div>
      </div>
    </>
  );
}
