"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const BackButton = () => {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft size={32} strokeWidth={1.5} />
    </button>
  );
};

export default BackButton;
