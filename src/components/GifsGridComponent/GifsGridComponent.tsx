"use client";

import { useEffect, useState } from "react";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

//Components
import GifCardComponent from "../GifCardComponent/GifCardComponent";

//Types
import { GifData } from "../FullScreenGifViewComponent/FullScreenGifViewComponent.types";
import { GifsGridComponentProps } from "./GifsGridComponent.types";

//Styles
import { monserrat } from "@/utils/styles/fonts";

//Redux - Queries
import { useGetGifBySearchQuery } from "@/redux/services/giphyApi";

const GifsGridComponent = ({ searchTerm, mode }: GifsGridComponentProps) => {
  const [offset, setOffset] = useState(0);
  const [allGif, setAllGif] = useState<GifData[]>([]);
  const [hasMore, setHasMore] = useState(false);

  const favorites = useSelector(
    (state: RootState) => state.favorites.favorites
  );

  const myGifos = useSelector((state: RootState) => state.myGifos.myGifos);

  //Queries
  const { data } = useGetGifBySearchQuery(
    { searchTerm, offset },
    {
      skip: !searchTerm,
    }
  );

  useEffect(() => {
    setOffset(0);
    setAllGif([]);
  }, [searchTerm, mode]);

  useEffect(() => {
    if (mode === "favorites") {
      setOffset(0);
      const favoriteSlice = favorites.slice(0, 16);
      setAllGif(favoriteSlice);
      setHasMore(favorites.length > 16);
    }
  }, [favorites, mode]);

  useEffect(() => {
    if (mode === "my-gifos") {
      setOffset(0);
      const myGifosSlice = myGifos.slice(0, 16);
      setAllGif(myGifosSlice);
      setHasMore(myGifos.length > 16);
    }
  }, [myGifos, mode]);

  useEffect(() => {
    if (mode === "search" && data?.data && offset === 0) {
      const gifSlice = data.data.slice(0, 16);
      setAllGif(gifSlice);
      setHasMore(data.pagination.total_count > 16);
    }
  }, [data?.data, data?.pagination.total_count, offset, mode]);

  useEffect(() => {
    if (offset === 0) return;

    if (mode === "search" && data?.data) {
      setAllGif((prev) => {
        const ids = new Set(prev.map((gif) => gif.id));
        const newUnique = data.data.filter(
          (gif: { id: string }) => !ids.has(gif.id)
        );
        return [...prev, ...newUnique];
      });

      setHasMore(data.pagination.total_count > offset + 16);
    }

    if (mode === "favorites") {
      const favoriteSlice = favorites.slice(offset, offset + 16);

      setAllGif((prev) => [...prev, ...favoriteSlice]);
      setHasMore(favorites.length > offset + 16);
    }

    if (mode === "my-gifos") {
      const myGifosSlice = myGifos.slice(offset, offset + 16);

      setAllGif((prev) => [...prev, ...myGifosSlice]);
      setHasMore(myGifos.length > offset + 16);
    }
  }, [data, offset, mode, favorites, myGifos]);

  const handleSeeMore = () => {
    setOffset((prev) => prev + 16);
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <ul
        aria-label="gif list"
        className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
      >
        {allGif.map((gif: GifData) => (
          <li data-testid="gif-card" key={gif.id} className="w-full h-60">
            <GifCardComponent gifData={gif} mode={mode} />
          </li>
        ))}
      </ul>
      {hasMore && (
        <div>
          <button
            className={`text-[#4A1EE3] font-semibold dark:text-white border-1 rounded-full border-[#4A1EE3] dark:border-white px-4 py-2 cursor-pointer hover:bg-[#4A1EE3] hover:text-white dark:hover:bg-white dark:hover:text-[#222326] ${monserrat.className}`}
            title="See more"
            onClick={handleSeeMore}
          >
            See more
          </button>
        </div>
      )}
    </div>
  );
};

export default GifsGridComponent;
