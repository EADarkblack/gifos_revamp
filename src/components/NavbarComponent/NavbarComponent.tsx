"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";

//Styles
import { monserrat } from "@/utils/styles/fonts";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { usePathname } from "next/navigation";

const NavbarComponent = () => {
  const { resolvedTheme, setTheme } = useTheme();

  const pathname = usePathname();

  const [showMenu, setShowMenu] = useState(false);
  return (
    <header
      className={`fixed z-1 w-full bg-white dark:bg-[#37383C] border-t border-solid border-[#4A1EE3] dark:border-black border-t border-solid [border-top-width:4px] py-4 px-10 lg:px-30`}
    >
      <nav className="w-full flex items-center justify-between">
        <Link href="/">
          <Image
            src="/assets/images/logo.svg"
            alt="logo"
            width={50}
            height={50}
            className="block dark:hidden"
          />
          <Image
            src="/assets/images/logo-noc.svg"
            alt="logo-dark"
            width={50}
            height={50}
            className="hidden dark:block"
          />
        </Link>
        <div className="md:hidden">
          {!showMenu && (
            <button aria-label="open" onClick={() => setShowMenu(true)}>
              <GiHamburgerMenu
                className={`text-2xl text-[#4A1EE3] dark:text-white cursor-pointer`}
              />
            </button>
          )}
          {showMenu && (
            <button aria-label="close" onClick={() => setShowMenu(false)}>
              <IoClose
                className={`text-3xl text-[#4A1EE3] dark:text-white cursor-pointer`}
              />
            </button>
          )}
        </div>
        <ul
          className={`hidden md:flex items-center text-[#4A1EE3] dark:text-white text-xs font-bold gap-8`}
        >
          <li>
            <button
              className={`cursor-pointer hover:underline hover:decoration-[#50E3C2] hover:decoration-2 hover:underline-offset-4`}
              title={resolvedTheme === "dark" ? "Light Mode" : "Dark Mode"}
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
            >
              {resolvedTheme === "dark" ? "LIGHT MODE" : "DARK MODE"}
            </button>
          </li>
          <li>
            <Link
              className={`cursor-pointer ${
                pathname === "/favorites"
                  ? "text-[#99ABBF] no-underline hover:no-underline"
                  : "hover:underline hover:decoration-[#50E3C2] hover:decoration-2 hover:underline-offset-4"
              }`}
              href="/favorites"
              title="Favorites"
            >
              FAVS
            </Link>
          </li>
          <li>
            <Link
              className={`cursor-pointer  ${
                pathname === "/my-gifos"
                  ? "text-[#99ABBF] no-underline hover:no-underline"
                  : "hover:underline hover:decoration-[#50E3C2] hover:decoration-2 hover:underline-offset-4"
              }`}
              href="/my-gifos"
              title="My GIFOS"
            >
              MY GIFOS
            </Link>
          </li>
          <li>
            <Link
              title="Create GIFO"
              className={`cursor-pointer ${
                pathname === "/create-gifo"
                  ? "[border-color:#99ABBF] bg-[#99ABBF] text-white"
                  : "[border-color:#4A1EE3] dark:[border-color:#ffffff] [border-width:1px] [border-style:solid] dark:hover:[background-color:#ffffff] dark:hover:text-[#37383C] hover:[background-color:#4A1EE3] hover:text-white"
              } text-2xl font-bold rounded-full px-4 py-2
              `}
              href="/create-gifo"
            >
              +
            </Link>
          </li>
        </ul>
        <ul
          className={`fixed w-[100%] h-[100vh] transition-all duration-200 ease-in-out ${
            showMenu ? "right-0" : "right-[-100%]"
          } top-19 bg-white dark:bg-[#37383C] flex flex-col items-center gap-8 z-[1000] ${
            monserrat.className
          } md:hidden text-[#4A1EE3] text-xs font-bold text-[#4A1EE3] dark:text-white`}
        >
          <li>
            <button
              className={`cursor-pointer hover:underline hover:decoration-[#50E3C2] hover:decoration-2 hover:underline-offset-4`}
              title={resolvedTheme === "dark" ? "Light Mode" : "Dark Mode"}
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
            >
              {resolvedTheme === "dark" ? "LIGHT MODE" : "DARK MODE"}
            </button>
          </li>
          <li>
            <Link
              className={`cursor-pointer ${
                pathname === "/favorites" && "text-[#99ABBF]"
              }`}
              href="/favorites"
              title="Favorites"
            >
              FAVS
            </Link>
          </li>
          <li>
            <Link
              className={`cursor-pointer ${
                pathname === "/my-gifos" && "text-[#99ABBF]"
              }`}
              href="/my-gifos"
              title="My GIFOS"
            >
              MY GIFOS
            </Link>
          </li>
          <li>
            <Link
              title="Create GIFO"
              className={`cursor-pointer ${
                pathname === "/create-gifo" && "text-[#99ABBF]"
              }`}
              href="/create-gifo"
            >
              CREATE GIFO
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default NavbarComponent;
