import { AiOutlineLoading3Quarters } from "react-icons/ai";
export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen bg-base-100">
      <div className="flex justify-center items-center space-x-4">
        <AiOutlineLoading3Quarters className="animate-spin text-primary text-4xl font-semibold" />
        <p className="text-4xl font-regular text-primary">Loading...</p>
      </div>
    </div>
  );
}