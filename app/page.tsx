import SearchBox from "@/components/ui/searchbox";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fffffa] font-sans">
      <main className="flex min-h-screen items-center justify-center">
        <SearchBox />
      </main>
    </div>
  );
}
