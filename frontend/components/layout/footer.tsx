import React from "react";
import FacebookSvg from "../svgs/facebook";
import InstagramSvg from "../svgs/instagram";
import YoutubeSvg from "../svgs/youtubeSvg";
import { Button } from "../ui/button";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="w-full h-full drop-shadow-sm bg-black border-t-[0.8px] border-t-gray-50/10 py-6">
      <div className="container flex flex-col items-center justify-center gap-6">
        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-3 items-center w-full">
          {/* Left Section - Logos */}
          <div className="flex flex-col items-center justify-center gap-3 h-fit">
            <div className="flex justify-center items-center gap-3">
              <div className="w-32 lg:w-50">
                <Image
                  src="/svgs/markazia-white.svg"
                  alt="markazia"
                  width={500}
                  height={86}
                  className="fill-white w-full h-auto"
                />
              </div>
              <div className="border-gray-600 border-[0.25px] h-full" />
              <div className="w-32 lg:w-50">
                <Image
                  src="/images/new-light-logo.png"
                  alt="markazia"
                  width={500}
                  height={86}
                  className="fill-white w-full h-auto"
                />
              </div>
            </div>
            <p className="text-center text-gray-400">
              Amazing Experience <br /> Where automotive excellence meets
              world-class activities
            </p>
          </div>

          {/* Center Section - Social Media */}
          <div className="flex items-center justify-center gap-4">
            <div className="border-1 rounded-full p-2 border-gray-500">
              <YoutubeSvg
                link="https://www.youtube.com/user/LexusCTA"
                width={30}
                height={30}
                fill="gray"
              />
            </div>
            <div className="border-1 rounded-full p-2 border-gray-500">
              <InstagramSvg
                link="https://www.instagram.com/markazia_lexus/"
                width={30}
                height={30}
                fill="gray"
              />
            </div>
            <div className="border-1 rounded-full p-2 border-gray-500">
              <FacebookSvg
                link="https://www.facebook.com/MarkaziaLexusJo/"
                width={30}
                height={30}
                fill="gray"
              />
            </div>
          </div>

          {/* Right Section - Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              className="cursor-pointer rounded-full px-6"
              size="lg"
            >
              Terms & Conditions
            </Button>
          </div>
        </div>

        {/* Mobile & Tablet Layout */}
        <div className="flex flex-col lg:hidden items-center gap-6 w-full">
          {/* Logos Section */}
          <div className="flex flex-col items-center justify-center gap-3 h-fit">
            <div className="flex justify-center items-center gap-3">
              <div className="w-24 sm:w-32">
                <Image
                  src="/svgs/markazia-white.svg"
                  alt="markazia"
                  width={500}
                  height={86}
                  className="fill-white w-full h-auto"
                />
              </div>
              <div className="border-gray-600 border-[0.25px] h-12" />
              <div className="w-24 sm:w-32">
                <Image
                  src="/images/new-light-logo.png"
                  alt="markazia"
                  width={500}
                  height={86}
                  className="fill-white w-full h-auto"
                />
              </div>
            </div>
            <p className="text-left max-lg:text-center text-gray-400 text-sm sm:text-base px-4">
              Amazing Experience <br /> Where automotive excellence meets
              world-class activities
            </p>
          </div>

          {/* Social Media Section */}
          <div className="flex items-center justify-center gap-3 sm:gap-4">
            <div className="border-1 rounded-full p-2 border-gray-500">
              <YoutubeSvg
                link="https://www.youtube.com/user/LexusCTA"
                width={24}
                height={24}
                fill="gray"
              />
            </div>
            <div className="border-1 rounded-full p-2 border-gray-500">
              <InstagramSvg
                link="https://www.instagram.com/markazia_lexus/"
                width={24}
                height={24}
                fill="gray"
              />
            </div>
            <div className="border-1 rounded-full p-2 border-gray-500">
              <FacebookSvg
                link="https://www.facebook.com/MarkaziaLexusJo/"
                width={24}
                height={24}
                fill="gray"
              />
            </div>
          </div>

          {/* Button Section */}
          <div className="flex justify-center w-full px-4">
            <Button
              variant="outline"
              className="cursor-pointer rounded-full px-4 sm:px-6 text-sm sm:text-base"
              size="sm"
            >
              Terms & Conditions
            </Button>
          </div>
        </div>
        <div className="w-96 border-gray-50/30 border-[0.5px]" />
        <div className="text-center">
          <p className="text-gray-400">
            @2025 Copyright approved by Markazia Lexus
          </p>
          <Link href="https://www.lexus.com.jo/" className="underline">
            Visit Official Website
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
