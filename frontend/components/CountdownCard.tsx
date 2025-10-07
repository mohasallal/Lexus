"use client";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Box from "./Box";

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

  const num = (n: number) => String(n).padStart(2, "0");

  return (
    <Card className="bg-white/6 backdrop-blur-md border-white/20 border p-0 shadow-lg w-full mx-auto text-white gap-1">
      <CardHeader className="px-4 pt-4">
        <CardTitle className="text-lg font-medium text-center">
          الوقت المتبقي للمؤتمر
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="mt-3 grid grid-cols-2 gap-4">
          <Box value={num(timeLeft.hours)} label="ساعات" />
          <Box value={num(timeLeft.days)} label="أيام" />
          <Box value={num(timeLeft.seconds)} label="ثواني" />
          <Box value={num(timeLeft.minutes)} label="دقائق" />
        </div>
      </CardContent>
    </Card>
  );
};

export default CountdownCard;
