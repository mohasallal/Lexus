import Link from "next/link";
import React from "react";

type FacebookSvgProps = {
  width?: number;
  height?: number;
  fill?: string;
  link: string;
};

const FacebookSvg = ({
  width = 24,
  height = 24,
  fill = "currentColor",
  link,
}: FacebookSvgProps) => {
  return (
    <Link href={link}>
      <svg
        width={width}
        height={height}
        fill={fill}
        viewBox="0 0 24 24"
        transform=""
        id="injected-svg"
      >
        <path d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22 22 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202z"></path>
      </svg>
    </Link>
  );
};

export default FacebookSvg;
