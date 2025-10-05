import React from "react";
import CountdownCard from "@/components/CountdownCard";
import { Button } from "../ui/button";
import Link from "next/link";
import Title from "../title";

const Home = () => {
  return (
    <main className="w-full h-screen flex flex-col items-center justify-center text-center px-4 py-12 gap-8">
      <div className="flex flex-col gap-6">
        <Title
          main="عش تجربتك المدهشة"
          sub="
          انضم إلينا في حدث حصري مليء بالفخامة والأداء واللحظات التي لا تنسى.
          سجل الآن لتأمين مكانك."
        />
      </div>

      <div className="w-full max-w-3xl">
        <CountdownCard />
      </div>

      <div>
        <Button
          variant="outline"
          size="lg"
          className="text-xl cursor-pointer rounded-none px-8"
        >
          <Link href="/activities">استكشف الأنشطة</Link>
        </Button>
      </div>
    </main>
  );
};

export default Home;
