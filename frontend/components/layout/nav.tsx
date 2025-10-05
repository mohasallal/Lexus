import Image from "next/image";
import { Button } from "../ui/button";
import Link from "next/link";
const NavBar = () => {
  return (
    <div className="w-full h-20 drop-shadow-sm bg-black border-b-[0.8px] border-b-gray-50/10">
      <div className="container h-full flex items-center justify-between row-reverse">
        <div className="flex items-center gap-4 h-full">
          <Button
            variant={"ghost"}
            className="text-white hover:text-white cursor-pointer hover:bg-gray-600"
          >
            <Link href="/auth/login"> مكتب الاستقبال</Link>
          </Button>
          <Button
            variant={"ghost"}
            className="text-white hover:text-white cursor-pointer hover:bg-gray-600"
          >
            English
          </Button>
        </div>
        <div className="flex items-center gap-4 h-full">
          <div className="w-50">
            <Image
              src="/svgs/markazia-white.svg"
              alt="markazia"
              width={500}
              height={86}
              className="fill-white"
            />
          </div>
          <div className="border-gray-600 border-[0.25px] h-1/2" />
          <div className="w-50">
            <Image
              src="/images/new-light-logo.png"
              alt="markazia"
              width={500}
              height={86}
              className="fill-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
