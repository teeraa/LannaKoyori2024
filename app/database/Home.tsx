// ไอคอน
import { FaBagShopping, FaCommentDots, FaMapLocationDot,FaLocationDot } from "react-icons/fa6";
import { IoStorefront } from "react-icons/io5";
import { FaUser, FaPaintBrush,FaPhoneAlt } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export const personals = [
  {
    id: 1,
    image: "/images/43-12.jpg",  // ใช้เส้นทางที่เริ่มต้นด้วย "/"
    name: "ศาสตราจารย์พิเศษ ดร.เอนก เหล่าธรรมทัศน์",
    position: "รัฐมนตรีว่าการกระทรวงการอุดมศึกษา วิทยาศาสตร์วิจัยและนวัตกรรม",
    year: "2021",
    text: "การพัฒนาผลิตภัณฑ์ท้องถิ่นด้วยนวัตกรรมสร้างสรรค์ บนฐานของทุนทางวัฒนธรรมและทรัพยากรของชุมชน...",
  },
  {
    id: 2,
    image: "/images/person2.png",
    name: "นายฮิโรชิ มัทสึโมะโตะ ",
    position: "กงสุลใหญ่ญี่ปุ่น ณ นครเชียงใหม่",
    year: "2021",
    text: "ขอชื่นชมยินดีและขอบคุณมหาวิทยาลัยเทคโนโลยีราชมงคลล้านนาที่ได้ร่วมมือกับสมาคมวัฒนหัตถศิลป์ล้านนาในการเปิดการอบรมเชิงปฏิบัติการเพื่อเพิ่มสมรรถนะด้านผลิตภัณฑ์หัตถศิลป์ท้อง",
  },
  {
    id: 3,
    image: "/images/43-12.jpg", // ใช้เส้นทางที่เริ่มต้นด้วย "/"
    name: "ศาสตราจารย์พิเศษ ดร.เอนก เหล่าธรรมทัศน์",
    position: "รัฐมนตรีว่าการกระทรวงการอุดมศึกษา วิทยาศาสตร์วิจัยและนวัตกรรม",
    year: "2022",
    text: "การพัฒนาผลิตภัณฑ์ท้องถิ่นด้วยนวัตกรรมสร้างสรรค์ บนฐานของทุนทางวัฒนธรรมและทรัพยากรของชุมชน...",
  },
  {
    id: 4,
    image: "/images/person3.png",  // ใช้เส้นทางที่เริ่มต้นด้วย "/"
    name: "นายเคอิจิ ฮิกุจิ",
    position: "กงสุลใหญ่ญี่ปุ่น ณ นครเชียงใหม่",
    year: "2022",
    text: 'เมื่อพูดถึง "โครงการโคะโยะริ" ใจผมจะนึกถึงสามคำนี้ "ความชาญฉลาดในการประดิษฐ์" "ความทุ่มเท" "ความอุตสาหะ" โครงการโคะโยะริที่ริเริ่มโดยคุณลักษมี',
  },
  {
    id: 5,
    image: "/images/person3.png", // ใช้เส้นทางที่เริ่มต้นด้วย "/"
    name: "นายเคอิจิ ฮิกุจิ",
    position: "กงสุลใหญ่ญี่ปุ่น ณ นครเชียงใหม่",
    year: "2023",
    text: 'เมื่อพูดถึง "โครงการโคะโยะริ" ใจผมจะนึกถึงสามคำนี้ "ความชาญฉลาดในการประดิษฐ์" "ความทุ่มเท" "ความอุตสาหะ" โครงการโคะโยะริที่ริเริ่มโดยคุณลักษมี',
  },
];
  export const contact = [
      {
          id: 1,
          icon: <FaLocationDot />,
          title: "ตำแหน่งที่ตั้ง",
          subtitle: "200 หมู่ 11 ตำบลพิชัย อำเภอเมืองลำปาง จังหวัดลำปาง",
      },
      {
          id: 2,
          icon: <MdEmail />,
          title: "อีเมล",
          subtitle: "lpc@rmutl.ac.th",
      },
      {
          id: 3,
          icon: <FaPhoneAlt />,
          title: "เบอร์โทรศัพท์",
          subtitle: "054 342 547",
      }
  ]
  
export const KeyValue = [
    {
      id: 1,
      icon: <FaBagShopping />,
      titleTH: "ผลิตภัณฑ์",
      titleEN: "(Products)",
    },
    {
      id: 2,
      icon: <IoStorefront />,
      titleTH: "ร้านค้า",
      titleEN: "(Stores)",
    },
    {
      id: 3,
      icon: <FaUser />,
      titleTH: "ผู้ประกอบการ",
      titleEN: "(Entrepreneur)",
    },
    {
      id: 4,
      icon: <FaPaintBrush />,
      titleTH: "นักออกแบบ",
      titleEN: "(Designers)",
    },
    {
      id: 5,
      icon: <FaCommentDots />,
      titleTH: "ผู้เชี่ยวชาญ",
      titleEN: "(Experts)",
    },
    {
      id: 6,
      icon: <FaMapLocationDot />,
      titleTH: "ตำแหน่งร้านค้า",
      titleEN: "(Location)",
    },
  ];