import React from "react";
import FacebookSvg from "../svgs/facebook";
import InstagramSvg from "../svgs/instagram";
import YoutubeSvg from "../svgs/youtubeSvg";
import { Button } from "../ui/button";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full h-full drop-shadow-sm bg-black border-t-[0.8px] border-t-gray-50/10 py-6">
      <div className="container flex flex-col items-center justify-center gap-6">
        <div className="flex items-center justify-center gap-4">
          <YoutubeSvg
            link="https://www.youtube.com/user/LexusCTA"
            width={42}
            height={42}
          />
          <InstagramSvg
            link="https://www.instagram.com/markazia_lexus/"
            width={42}
            height={42}
          />
          <FacebookSvg
            link="https://www.facebook.com/MarkaziaLexusJo/"
            width={42}
            height={42}
          />
        </div>
        <Button
          variant="outline"
          className="cursor-pointer rounded-full px-6"
          size="lg"
        >
          القواعد و شروط الحملة
        </Button>
        <div className="w-96 border-gray-50/30 border-[0.5px]" />
        <div className="text-center">
          <p className="text-gray-400">حقوق النشر معتمدة من المركزية لكزس</p>
          <Link href="https://www.lexus.com.jo/" className="underline">
            زيارة الموقع الرسمي
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
