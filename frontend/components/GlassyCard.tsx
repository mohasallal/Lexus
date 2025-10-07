import React from "react";

interface GlassyCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
  titleColor?: string;
  subColor?: string;
  iconBgColor?: string;
}

const GlassyCard = ({
  icon,
  title,
  subtitle,
  className,
  titleColor,
  subColor,
  iconBgColor,
}: GlassyCardProps) => {
  return (
    <div
      className={`flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg shadow-lg max-w-sm ${className}`}
    >
      <div
        className={`flex items-center justify-center w-12 h-12 backdrop-blur-sm border border-white/25 rounded-lg shrink-0 ${
          iconBgColor || "bg-white/15"
        }`}
      >
        {icon}
      </div>

      <div className="flex flex-col gap-1 min-w-0">
        {subtitle && (
          <p
            className={`text-xs leading-tight truncate ${
              subColor || "text-gray-300"
            }`}
          >
            {subtitle}
          </p>
        )}
        {title && (
          <h3
            className={`font-medium text-sm leading-tight truncate ${
              titleColor || "text-white"
            }`}
          >
            {title}
          </h3>
        )}
      </div>
    </div>
  );
};

export default GlassyCard;
