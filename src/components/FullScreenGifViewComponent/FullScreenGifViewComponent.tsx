"use client";

import { RootState } from "@/redux/store";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";

//Styles
import { monserrat } from "@/utils/styles/fonts";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { IoClose, IoDownloadOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";

//Redux - Slice
import { setShowFullscreen } from "@/redux/slices/fullscreenModalSlice";

//Functions
import { generateDownloadGifUrl } from "@/utils/functions/generateDownloadGifUrl";
import { toggleFavorite } from "@/redux/slices/favoritesSlice";
import { deleteGifo } from "@/redux/slices/myGifosSlice";

//Types
import {
  GifData,
  FullScreenGifViewComponentProps,
} from "./FullScreenGifViewComponent.types";

const FullScreenGifViewComponent = ({
  mode,
}: FullScreenGifViewComponentProps) => {
  const dispatch = useDispatch();

  const showModal = useSelector(
    (state: RootState) => state.fullscreenModal.showFullscreen
  );

  const gifData: GifData = useSelector(
    (state: RootState) => state.fullscreenModal.gifData as GifData
  );

  const favorites = useSelector(
    (state: RootState) => state.favorites.favorites
  );

  const isFavorite = favorites.some(
    (favorite: { id: string }) => favorite.id === gifData?.id
  );

  const handleCloseFullscreen = () => {
    dispatch(setShowFullscreen(false));
  };

  const handleAddToFavorites = () => {
    dispatch(toggleFavorite(gifData));
  };

  const handleDownloadGif = async () => {
    await generateDownloadGifUrl(
      gifData?.images.downsized_medium.url,
      gifData?.title
    );
  };

  const handleDeleteMyGifo = () => {
    dispatch(setShowFullscreen(false));
    dispatch(deleteGifo(gifData));
  };

  if (!showModal || !gifData?.images?.downsized_medium?.url) return null;

  return showModal ? (
    <div className="fixed w-full h-full flex items-center justify-center z-50 ">
      <div className="absolute w-full h-full z-51 flex items-center justify-center">
        <div className="w-[90vw] lg:w-[1004px] flex flex-col items-center gap-6">
          <div className="w-full flex justify-end">
            <button title="close" onClick={handleCloseFullscreen}>
              <IoClose
                className={`text-2xl text-[#4A1EE3] dark:text-white cursor-pointer`}
              />
            </button>
          </div>
          <Image
            src={gifData.images.downsized_medium.url}
            alt={gifData.alt_text}
            width={720}
            height={600}
            className="w-full max-h-[600px] object-contain"
            unoptimized
          />
          <div className=" w-full flex justify-between items-center gap-4">
            <div
              className={`flex flex-col gap-2 ${monserrat.className} text-[#4A1EE3] dark:text-white`}
            >
              <p>{gifData.username}</p>
              <h1 className="text-xl lg:text-2xl font-bold">{gifData.title}</h1>
            </div>
            <div className="flex gap-4">
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
              <button
                className="bg-[#C6C6C6] hover:bg-white text-[#4A1EE3] px-2 py-2 cursor-pointer rounded transition duration-300 ease-in-out"
                title="Download"
                onClick={handleDownloadGif}
              >
                <IoDownloadOutline className="text-base" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-full bg-white dark:bg-[#37383C] opacity-80"></div>
    </div>
  ) : null;
};

export default FullScreenGifViewComponent;
