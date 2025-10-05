"use client";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const TARGET_YEAR = new Date().getFullYear();
const EVENT_DATE = new Date(`${TARGET_YEAR}-10-17T00:00:00`);

function getTimeLeft(target: Date): TimeLeft {
  const now = new Date();
  const diff = Math.max(0, target.getTime() - now.getTime());

  const seconds = Math.floor((diff / 1000) % 60);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  return { days, hours, minutes, seconds };
}

const CountdownCard: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    getTimeLeft(EVENT_DATE)
  );

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft(EVENT_DATE)), 1000);
    return () => clearInterval(id);
  }, []);

  const boxClass =
    "flex flex-col items-center justify-center gap-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 min-w-[64px]";

  const num = (n: number) => String(n).padStart(2, "0");

  return (
    <Card className="bg-white/6 backdrop-blur-md border-white/20 border p-0 shadow-lg max-w-md mx-auto text-white gap-1">
      <CardHeader className="px-4 pt-4">
        <CardTitle className="text-sm font-medium">
          يبدأ الحدث في : 17 اوكتوبر 2025
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="mt-3 grid grid-cols-4 gap-3">
          <div className={boxClass}>
            <div className="text-2xl font-semibold">{num(timeLeft.days)}</div>
            <div className="text-xs text-white">Days</div>
          </div>

          <div className={boxClass}>
            <div className="text-2xl font-semibold">{num(timeLeft.hours)}</div>
            <div className="text-xs text-white">Hours</div>
          </div>

          <div className={boxClass}>
            <div className="text-2xl font-semibold">
              {num(timeLeft.minutes)}
            </div>
            <div className="text-xs text-white">Minutes</div>
          </div>

          <div className={boxClass}>
            <div className="text-2xl font-semibold">
              {num(timeLeft.seconds)}
            </div>
            <div className="text-xs text-white">Seconds</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CountdownCard;
