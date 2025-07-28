//Styles
import { monserrat } from "@/utils/styles/fonts";
import Image from "next/image";
import MyGifosGifSectionComponent from "../MyGifosGifSectionComponent/MyGifosGifSectionComponent";

const MyGifosSectionComponent = () => {
  return (
    <section className="w-full flex justify-center bg-white dark:bg-[#37383C] pt-30 pb-20">
      <div
        className={`w-[90vw] lg:w-[1004px] flex flex-col gap-20 items-center ${monserrat.className}`}
      >
        <div className="flex flex-col items-center gap-2">
          <Image
            src="/assets/images/icon-mis-gifos.svg"
            alt="favorite icon"
            width={28}
            height={21}
          />
          <h1 className="text-xl md:text-2xl font-bold text-[#4A1EE3] dark:text-white">
            My GIFOS
          </h1>
        </div>
        <MyGifosGifSectionComponent />
      </div>
    </section>
  );
};

export default MyGifosSectionComponent;
