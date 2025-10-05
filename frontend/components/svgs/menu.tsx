type SvgsType = {
  width?: number;
  height?: number;
  fill?: string;
};
const MenuSvg = ({
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
        <path d="M4 6h16v2H4zM4 11h16v2H4zM4 16h16v2H4z"></path>
      </svg>
    </>
  );
};

export default MenuSvg;
