//Styles
import { monserrat } from "@/utils/styles/fonts";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const FooterComponent = () => {
  return (
    <footer className="w-full flex justify-center bg-white dark:bg-[#37383C] border-b [border-color:#4A1EE3] dark:border-black border-solid [border-bottom-width:4px]">
      <div
        className={`w-full flex flex-col gap-4 md:flex-row justify-between items-center px-10 lg:px-30 py-10 ${monserrat.className} text-black text-sm`}
      >
        <div className="flex flex-col lg:flex-row items-center gap-2">
          <p className="text-black dark:text-white">Share on:</p>
          <ul className="flex gap-4">
            <li>
              <a
                href="https://www.facebook.com"
                target="_blank"
                title="Facebook"
                className="cursor-pointer"
              >
                <FaFacebook className="text-[#C6C6C6] hover:text-[#4A1EE3] dark:hover:text-white text-2xl" />
              </a>
            </li>
            <li>
              <a
                href="https://x.com"
                title="X"
                className="cursor-pointer"
                target="_blank"
              >
                <FaXTwitter className="text-[#C6C6C6] hover:text-[#4A1EE3] dark:hover:text-white text-2xl" />
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com"
                title="Instagram"
                className="cursor-pointer"
                target="_blank"
              >
                <FaInstagram className="text-[#C6C6C6] hover:text-[#4A1EE3] dark:hover:text-white text-2xl" />
              </a>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-black dark:text-white">
            © GIFOS 2025 All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterComponent;
