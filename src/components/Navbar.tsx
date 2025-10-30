"use client";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const q = searchParams.get("q");
  const [searchTerm, setSearchTerm] = useState(q || "");

  useEffect(() => {
    if (pathname) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSearchTerm(q || "");
    }
  }, [pathname, q]);

  const handleSearch = () => {
    const params = new URLSearchParams(searchParams);
    if (searchTerm) {
      params.set("q", searchTerm);
    } else {
      params.delete("q"); // Remove if search term is empty
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <header className=" bg-white shadow-[0_2px_16px_rgba(0,0,0,0.1)]">
      <div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-4">
        <Image
          src={"/HDlogo-1.png"}
          alt={"highway delite"}
          width={100}
          height={55}
          className="object-cover"
        />
        <div className="flex items-center gap-3">
          <input
            placeholder="Search experiences"
            className="bg-[#EDEDED] text-[#727272] rounded px-3 py-2 text-sm w-64"
            id="global-search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className="bg-brand px-3 py-2 rounded-lg text-[#161616] bg-[#FFD643] font-medium cursor-pointer"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>
    </header>
  );
}
