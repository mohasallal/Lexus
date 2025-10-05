import React from "react";
import CountdownCard from "@/components/CountdownCard";
import { Button } from "../ui/button";
import Link from "next/link";

const Hero: React.FC = () => {
  return (
    <main className="w-full h-screen flex flex-col items-center justify-center text-center px-4 py-12 gap-8">
      <div className="flex flex-col gap-6">
        <h1 className="text-6xl font-bold">عش تجربتك المدهشة</h1>
        <h2 className="text-2xl max-w-3xl">
          انضم إلينا في حدث حصري مليء بالفخامة والأداء واللحظات التي لا تنسى.
          سجل الآن لتأمين مكانك.
        </h2>
      </div>

      <div className="w-full max-w-3xl">
        <CountdownCard />
      </div>

      <div>
        <Button variant="outline" size="lg" className="text-xl cursor-pointer">
          <Link href="/activities">استكشف الأنشطة</Link>
        </Button>
      </div>
    </main>
  );
};

export default Hero;
