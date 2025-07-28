"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";

//Styles
import { monserrat } from "@/utils/styles/fonts";

//Components
import SearchInputComponent from "../SearchInputComponent/SearchInputComponent";
import SearchResultComponent from "../SearchResultComponent/SearchResultComponent";

//Services
import {
  useGetGifBySearchQuery,
  useGetTrendTagsQuery,
} from "@/redux/services/giphyApi";

//Redux - Slice
import { setSearchTerm } from "@/redux/slices/searchTermSlice";
import { setSearchResultGif } from "@/redux/slices/searchResultGifSlice";
import { GifData } from "../FullScreenGifViewComponent/FullScreenGifViewComponent.types";

const SearchSectionComponent = () => {
  const dispatch = useDispatch();

  const searchTerm = useSelector(
    (state: RootState) => state.searchTerm.searchTerm
  );

  const gifResultBySearch: GifData[] = useSelector(
    (state: RootState) => state.resultBySearch.searchResultGif || []
  );

  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  //Queries
  const { data: trendingTags } = useGetTrendTagsQuery("");
  const { data: gifsByTag } = useGetGifBySearchQuery(selectedTag ?? "", {
    skip: !selectedTag,
  });

  useEffect(() => {
    if (gifsByTag?.data && selectedTag) {
      dispatch(setSearchResultGif({ searchResultGif: gifsByTag.data }));
    }
  }, [gifsByTag, selectedTag, dispatch]);

  const handleTrendingTagClick = (tag: string) => {
    dispatch(setSearchTerm(tag));
    setSelectedTag(tag);
  };

  return (
    <section className="w-full flex justify-center bg-white dark:bg-[#37383C] pt-30 pb-20">
      <div
        className={`w-[90vw] lg:w-[1004px] flex flex-col gap-20 items-center ${monserrat.className}`}
      >
        <div>
          <h1
            className={`text-2xl text-center lg:text-4xl text-[#4A1EE3] dark:text-white font-bold`}
          >
            Get inspired, search, save, and create the best{" "}
            <span className={`text-[#50E3C2]`}>GIFOS</span>
          </h1>
        </div>
        <div className="w-full flex flex-col items-center">
          <Image
            src="/assets/images/ilustra_header.svg"
            alt="welcome to gifos"
            width={400}
            height={600}
          />
          <SearchInputComponent />
        </div>
        <div className="w-full flex flex-col items-center text-[#4A1EE3] dark:text-white">
          <h2 className="text-lg font-bold">Trending:</h2>
          <ul className="flex gap-2">
            {trendingTags?.map((tag: string, index: number) => (
              <li
                onClick={() => handleTrendingTagClick(tag)}
                key={index}
                className="hover:underline cursor-pointer"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
        {searchTerm.trim() !== "" && (
          <SearchResultComponent
            dataLength={gifResultBySearch.length}
            title={searchTerm}
          />
        )}
      </div>
    </section>
  );
};

export default SearchSectionComponent;
