"use client";

import { useSelector } from "react-redux";

//Store - Types
import { RootState } from "@/redux/store";
import GifsGridComponent from "../GifsGridComponent/GifsGridComponent";
import Image from "next/image";

const MyGifosGifSectionComponent = () => {
  const myGifos = useSelector((state: RootState) => state.myGifos.myGifos);

  return (
    <div>
      {myGifos.length > 0 ? (
        <GifsGridComponent mode="my-gifos" />
      ) : (
        <div className="flex flex-col items-center gap-6">
          <Image
            src="/assets/images/icon-mis-gifos-sin-contenido.svg"
            alt="no content"
            width={125}
            height={125}
          />
          <p className="text-[#50E3C2] dark:text-white text-base md:text-lg font-bold">
            Create your first GIFO!
          </p>
        </div>
      )}
    </div>
  );
};

export default MyGifosGifSectionComponent;
