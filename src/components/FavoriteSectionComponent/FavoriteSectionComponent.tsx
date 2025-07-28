//Styles
import { monserrat } from "@/utils/styles/fonts";
import Image from "next/image";
import FavoriteGifSectionComponent from "../FavoriteGifSectionComponent/FavoriteGifSectionComponent";

const FavoriteSectionComponent = () => {
  return (
    <section className="w-full flex justify-center bg-white dark:bg-[#37383C] pt-30 pb-20">
      <div
        className={`w-[90vw] lg:w-[1004px] flex flex-col gap-20 items-center ${monserrat.className}`}
      >
        <div className="flex flex-col items-center gap-2">
          <Image
            src="/assets/images/icon-favoritos.svg"
            alt="favorite icon"
            width={28}
            height={21}
          />
          <h1 className="text-xl md:text-2xl font-bold text-[#4A1EE3] dark:text-white">
            Favorites
          </h1>
        </div>
        <FavoriteGifSectionComponent />
      </div>
    </section>
  );
};

export default FavoriteSectionComponent;
