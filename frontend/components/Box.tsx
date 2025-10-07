import React from "react";

interface BoxProps {
  value: string | number;
  label: string;
  className?: string;
  fontColor?: string;
  bgColor?: string;
}

const Box: React.FC<BoxProps> = ({
  value,
  label,
  className,
  fontColor,
  bgColor,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 border border-white/20 rounded-lg px-6 py-4 min-w-[80px] ${
        bgColor || "bg-white/10"
      } ${className || ""}`}
    >
      <div className={`text-3xl font-semibold ${fontColor || "text-white"}`}>
        {value}
      </div>
      <div className={`text-sm ${fontColor || "text-white"}`}>{label}</div>
    </div>
  );
};

export default Box;
