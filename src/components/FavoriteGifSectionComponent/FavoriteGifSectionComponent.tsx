"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import Image from "next/image";

//Components
import GifsGridComponent from "../GifsGridComponent/GifsGridComponent";

const FavoriteGifSectionComponent = () => {
  const favorites = useSelector(
    (state: RootState) => state.favorites.favorites
  );

  return (
    <div>
      {favorites.length > 0 ? (
        <GifsGridComponent mode="favorites" />
      ) : (
        <div className="flex flex-col items-center gap-6">
          <Image
            src="/assets/images/icon-fav-sin-contenido.svg"
            alt="no content"
            width={125}
            height={125}
          />
          <p className="text-center text-[#50E3C2] dark:text-white text-base md:text-lg font-bold">
            Save your first GIFO to Favourites to be displayed here!
          </p>
        </div>
      )}
    </div>
  );
};

export default FavoriteGifSectionComponent;
