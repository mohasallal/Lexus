"use client";

import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";
import UserSvg from "../svgs/user";
import LogOutSvg from "../svgs/logout";
import { useEffect, useState } from "react";
import MenuSvg from "../svgs/menu";
import XSvg from "../svgs/x";
import LangSvg from "../svgs/lang";
import GlassyCard from "../GlassyCard";

const NavBar = () => {
  const { user, isInitialized, initialize, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [isInitialized, initialize]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="w-full h-20 drop-shadow-sm bg-black border-b-[0.8px] border-b-gray-50/10 relative z-40">
        <nav className="container h-full flex items-center justify-between">
          <div className="hidden lg:flex items-center gap-4 h-full">
            {isInitialized &&
              (user ? (
                <>
                  <Button
                    variant={"ghost"}
                    className="text-white hover:text-white cursor-pointer hover:bg-gray-600 flex items-center gap-2"
                    onClick={logout}
                  >
                    <LogOutSvg width={20} height={20} fill="white" />
                    تسجيل الخروج
                  </Button>
                  <Link
                    href="/admin/dashboard"
                    className="flex items-center gap-2"
                  >
                    <GlassyCard
                      icon={<UserSvg />}
                      title="اهلا و سهلا مجددا"
                      subtitle={`${user.role}`}
                      className="pr-4"
                    />
                  </Link>
                </>
              ) : (
                <Button
                  variant={"ghost"}
                  className="text-white hover:text-white cursor-pointer hover:bg-gray-600"
                >
                  <Link href="/auth/login"> مكتب الاستقبال</Link>
                </Button>
              ))}

            <Button
              variant={"ghost"}
              className="text-white hover:text-white cursor-pointer hover:bg-gray-600"
            >
              English
            </Button>
          </div>

          <div className="lg:hidden">
            <Button
              variant={"ghost"}
              className="text-white hover:text-white cursor-pointer hover:bg-gray-600 p-4"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              <div className="w-20 h-20 flex flex-col justify-center items-center">
                <MenuSvg width={24} height={24} />
              </div>
            </Button>
          </div>

          <Link
            href="/"
            className="flex items-center gap-2 lg:gap-4 h-full cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="w-32 lg:w-50">
              <Image
                src="/svgs/markazia-white.svg"
                alt="markazia"
                width={500}
                height={86}
                className="fill-white w-full h-auto"
              />
            </div>
            <div className="border-gray-600 border-[0.25px] h-1/2" />
            <div className="w-32 lg:w-50">
              <Image
                src="/images/new-light-logo.png"
                alt="markazia"
                width={500}
                height={86}
                className="fill-white w-full h-auto"
              />
            </div>
          </Link>
        </nav>
      </header>

      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-30 transition-all duration-300 lg:hidden ${
          isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={closeMobileMenu}
      />

      <div
        className={`fixed top-0 right-0 h-full w-full xs:w-80 bg-black border-l border-gray-700 z-40 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-white text-lg font-semibold">القائمة</h2>
          <Button
            variant={"ghost"}
            className="text-white hover:text-white cursor-pointer hover:bg-gray-600 p-4"
            onClick={closeMobileMenu}
            aria-label="Close mobile menu"
          >
            <div className="w-10 h-10 flex items-center justify-center">
              <XSvg />
            </div>
          </Button>
        </div>

        <div className="flex flex-col p-6 gap-4">
          {isInitialized &&
            (user ? (
              <>
                <Link
                  href="/admin/dashboard"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 text-white hover:bg-gray-700 p-4 rounded-lg transition-colors"
                >
                  <UserSvg width={24} height={24} fill="white" />
                  <span className="text-lg">لوحة التحكم</span>
                </Link>
                <Button
                  variant={"ghost"}
                  className="flex items-center gap-3 text-white hover:bg-gray-700 p-4 rounded-lg transition-colors justify-start"
                  onClick={() => {
                    logout();
                    closeMobileMenu();
                  }}
                >
                  <LogOutSvg width={24} height={24} fill="white" />
                  <span className="text-lg">تسجيل الخروج</span>
                </Button>
              </>
            ) : (
              <Link
                href="/auth/login"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 text-white hover:bg-gray-700 p-4 rounded-lg transition-colors"
              >
                <UserSvg width={24} height={24} fill="white" />
                <span className="text-lg">مكتب الاستقبال</span>
              </Link>
            ))}

          <Button
            variant={"ghost"}
            className="flex items-center gap-3 text-white hover:bg-gray-700 p-4 rounded-lg transition-colors justify-start"
            onClick={closeMobileMenu}
          >
            <LangSvg width={32} height={32} fill="white" />
            <span className="text-lg">English</span>
          </Button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-700">
          <div className="flex items-center justify-center gap-4">
            <div className="w-24">
              <Image
                src="/svgs/markazia-white.svg"
                alt="markazia"
                width={200}
                height={34}
                className="fill-white w-full h-auto"
              />
            </div>
            <div className="border-gray-600 border-[0.25px] h-6" />
            <div className="w-24">
              <Image
                src="/images/new-light-logo.png"
                alt="markazia"
                width={200}
                height={34}
                className="fill-white w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
