import { EmblaOptionsType } from "embla-carousel";

//Styles
import { monserrat } from "@/utils/styles/fonts";

//Components
import EmblaCarousel from "../EmblaCarousel/EmblaCarousel";

const TrendSectionComponent = () => {
  const OPTIONS: EmblaOptionsType = { align: "start", loop: true };

  return (
    <section className="w-full flex justify-center bg-[#F3F5F8] dark:bg-[#222326] pt-15 pb-30">
      <div
        className={`w-[90vw] lg:w-[1004px] flex flex-col gap-15 items-center ${monserrat.className}`}
      >
        <div className="w-full flex flex-col gap-2 items-center">
          <h1 className="text-2xl text-[#4A1EE3] dark:text-white font-bold">
            Trending GIFOS
          </h1>
          <p className="text-black dark:text-white text-center">
            Check out the latest GIFOS from our community.
          </p>
        </div>
        <div className="w-full">
          <EmblaCarousel options={OPTIONS} />
        </div>
      </div>
    </section>
  );
};

export default TrendSectionComponent;
