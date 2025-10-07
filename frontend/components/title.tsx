import React from "react";

interface TitleProps {
  main: string;
  sub: string;
}

const Title = ({ main, sub }: TitleProps) => {
  const words = main.split(" ");
  const lastWord = words.pop();
  const otherWords = words.join(" ");

  return (
    <>
      <h1 className="text-6xl font-bold">
        {otherWords} <span className="text-dark-gold">{lastWord}</span>
      </h1>
      <h2 className="text-2xl max-w-3xl">{sub}</h2>
    </>
  );
};

export default Title;
