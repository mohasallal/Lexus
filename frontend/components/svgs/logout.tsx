type SvgsType = {
  width?: number;
  height?: number;
  fill?: string;
};
const LogOutSvg = ({
  width = 24,
  height = 24,
  fill = "currentColor",
}: SvgsType) => {
  return (
    <>
      <svg
        width={width}
        height={height}
        fill={fill}
        viewBox="0 0 24 24"
        transform=""
        id="injected-svg"
      >
        <path d="M9 13h7v-2H9V7l-6 5 6 5z"></path>
        <path d="M19 3h-7v2h7v14h-7v2h7c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2"></path>{" "}
      </svg>
    </>
  );
};

export default LogOutSvg;
