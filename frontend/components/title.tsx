import React from "react";

interface TitleProps {
  main: string;
  sub: string;
}

const Title = ({ main, sub }: TitleProps) => {
  return (
    <>
      <h1 className="text-6xl font-bold">{main}</h1>
      <h2 className="text-2xl max-w-3xl">{sub}</h2>
    </>
  );
};

export default Title;
