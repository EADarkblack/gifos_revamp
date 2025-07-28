"use client";

import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";

//Styles
import { monserrat } from "@/utils/styles/fonts";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { IoDownloadOutline } from "react-icons/io5";
import { AiOutlineFullscreen } from "react-icons/ai";
import { MdDeleteOutline } from "react-icons/md";

//Types
import { GifCardComponentProps } from "./GifCardComponent.types";

//Functions
import { generateDownloadGifUrl } from "@/utils/functions/generateDownloadGifUrl";

//Redux - Slice
import {
  setShowFullscreen,
  setGifData,
} from "@/redux/slices/fullscreenModalSlice";
import { toggleFavorite } from "@/redux/slices/favoritesSlice";
import { deleteGifo } from "@/redux/slices/myGifosSlice";

const GifCardComponent = ({ gifData, mode }: GifCardComponentProps) => {
  const dispatch = useDispatch();

  const favorites = useSelector(
    (state: RootState) => state.favorites.favorites
  );

  const isFavorite = favorites.some(
    (favorite: { id: string }) => favorite.id === gifData?.id
  );

  const handleAddToFavorites = () => {
    dispatch(toggleFavorite(gifData));
  };

  const handleDownloadGif = async () => {
    await generateDownloadGifUrl(gifData?.images.original.url, gifData?.title);
  };

  const handleOpenFullScreen = () => {
    dispatch(setShowFullscreen(true));
    dispatch(setGifData(gifData));
  };

  const handleDeleteMyGifo = () => {
    dispatch(deleteGifo(gifData));
  };

  return (
    <div className="relative w-full h-full">
      {gifData?.images.downsized_medium.url ? (
        <Image
          src={gifData?.images.downsized_medium.url}
          alt={gifData?.alt_text}
          width={300}
          height={300}
          className="w-full h-full object-cover"
          unoptimized
        />
      ) : null}
      <div
        role="hover"
        className="absolute top-0 left-0 w-full h-full bg-[#4A1EE3]/80 flex flex-col justify-between gap-2 opacity-0 hover:opacity-100 transition-opacity duration-300 ease-in-out"
      >
        <div className="w-full flex justify-end mt-2 pr-2">
          <ul className="flex gap-2 items-center">
            <li>
              {mode !== "my-gifos" && (
                <button
                  className="bg-[#C6C6C6] hover:bg-white text-[#4A1EE3] px-2 py-2 cursor-pointer rounded transition duration-300 ease-in-out"
                  title="Add to favorites"
                  onClick={handleAddToFavorites}
                >
                  {isFavorite ? (
                    <FaHeart className="text-base" />
                  ) : (
                    <FaRegHeart className="text-base" />
                  )}
                </button>
              )}
              {mode === "my-gifos" && (
                <button
                  className="bg-[#C6C6C6] hover:bg-white text-[#4A1EE3] px-2 py-2 cursor-pointer rounded transition duration-300 ease-in-out"
                  title="Delete gifo"
                  onClick={handleDeleteMyGifo}
                >
                  <MdDeleteOutline className="text-base" />
                </button>
              )}
            </li>
            <li>
              <button
                className="bg-[#C6C6C6] hover:bg-white text-[#4A1EE3] px-2 py-2 cursor-pointer rounded transition duration-300 ease-in-out"
                title="Download"
                onClick={handleDownloadGif}
              >
                <IoDownloadOutline className="text-base" />
              </button>
            </li>
            <li>
              <button
                className="bg-[#C6C6C6] hover:bg-white text-[#4A1EE3] px-2 py-2 cursor-pointer rounded transition duration-300 ease-in-out"
                title="Fullscreen"
                onClick={handleOpenFullScreen}
              >
                <AiOutlineFullscreen className="text-base" />
              </button>
            </li>
          </ul>
        </div>
        <div
          className={`w-full flex flex-col gap-2 pl-2 mb-4 ${monserrat.className} text-white`}
        >
          <p className="text-sm">{gifData?.username}</p>
          <h1 className="font-bold max-w-[90%]">{gifData?.title}</h1>
        </div>
      </div>
    </div>
  );
};

export default GifCardComponent;
