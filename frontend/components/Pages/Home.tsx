import React from "react";
import CountdownCard from "@/components/CountdownCard";
import { Button } from "../ui/button";
import Link from "next/link";
import Title from "../title";
import GlassyCard from "../GlassyCard";
import CalendarSvg from "../svgs/calendar";
import LocationSvg from "../svgs/location";

const Home = () => {
  return (
    <main
      className="w-full h-screen flex items-center justify-center text-center px-4 py-12 bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage:
          "linear-gradient(to left, rgba(0,0,0,1), rgba(0,0,0,0.3)), url('/images/lexus-lx700h.jpg')",
      }}
    >
      <div className="container flex max-md:flex-col-reverse items-center justify-between gap-8">
        <div className="flex flex-col items-center gap-6 w-full ">
          <div className="w-full max-w-md relative z-10">
            <CountdownCard />
          </div>
        </div>

        <div className="flex flex-col items-end max-md:items-center max-md:text-center gap-6 relative z-10 text-right w-full">
          <Title
            main="عش تجربتك المدهشة"
            sub="انضم إلينا في حدث حصري مليء بالفخامة والأداء واللحظات التي لا تنس
          سجل الآن لتأمين مكانك."
          />
          <div className="flex gap-4">
            <GlassyCard
              icon={<LocationSvg />}
              title="17 اكتوبر"
              subtitle={`التاريخ`}
            />
            <GlassyCard
              icon={<CalendarSvg />}
              title="نادي عمان للجولف"
              subtitle={`الموقع`}
            />
          </div>
          <div className="relative z-10">
            <Button variant="outline" className="rounded-none p-0 m-0">
              <Link href="/activities" className="text-xl cursor-pointer px-12">
                استكشف الأنشطة
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
