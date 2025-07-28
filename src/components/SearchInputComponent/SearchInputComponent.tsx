"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";

//Redux - Store
import { setSearchTerm } from "@/redux/slices/searchTermSlice";
import { setSearchResultGif } from "@/redux/slices/searchResultGifSlice";
import {
  useGetGifBySearchQuery,
  useGetTagsBySearchQuery,
} from "@/redux/services/giphyApi";

//Styles
import { FaSearch } from "react-icons/fa";
import { monserrat } from "@/utils/styles/fonts";
import { IoClose } from "react-icons/io5";

const SearchInputComponent = () => {
  const dispatch = useDispatch();

  const [showTagsContainer, setShowTagsContainer] = useState(false);

  const searchTerm = useSelector(
    (state: RootState) => state.searchTerm.searchTerm
  );

  //Queries
  const { data } = useGetTagsBySearchQuery(searchTerm);

  const { data: gifData } = useGetGifBySearchQuery(
    { searchTerm, offset: 0 },
    {
      refetchOnMountOrArgChange: true,
      skip: !searchTerm,
    }
  );

  useEffect(() => {
    if (!searchTerm.trim()) {
      dispatch(setSearchResultGif({ searchResultGif: [] }));
      return;
    }

    if (gifData?.data?.length > 0) {
      dispatch(setSearchResultGif({ searchResultGif: gifData.data }));
    } else if (gifData?.data?.length === 0) {
      dispatch(setSearchResultGif({ searchResultGif: [] }));
    }
  }, [gifData, searchTerm, dispatch]);

  //Functions
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(e.target.value));

    setShowTagsContainer(true);
  };

  const handleClickAndSearchByTag = (tag: string) => {
    dispatch(setSearchTerm(tag));
    handleSearch();

    setShowTagsContainer(false);
  };

  const handleClearSearchInput = () => {
    dispatch(setSearchTerm(""));
    dispatch(setSearchResultGif({ searchResultGif: [] }));

    setShowTagsContainer(false);
  };

  const handleSearch = () => {
    if (gifData?.data?.length > 0) {
      dispatch(setSearchResultGif({ searchResultGif: gifData.data }));
    } else {
      dispatch(setSearchResultGif({ searchResultGif: [] }));
    }

    setShowTagsContainer(false);
  };

  return (
    <div
      className={`w-[90vw] lg:w-[600px] flex flex-col gap-2 items-center py-3 pl-10 pr-6 border-1 border-[#4A1EE3] dark:border-white ${
        data?.data.length > 0 ? "rounded-3xl" : "rounded-full"
      }`}
    >
      <div className="w-full flex justify-between">
        <input
          onChange={handleChange}
          className={`w-full outline-none placeholder:text-[#c6c6c6] text-black dark:text-white ${monserrat.className}`}
          type="text"
          placeholder="Search GIFOS"
          value={searchTerm}
          autoComplete="off"
          onKeyDown={(e) =>
            e.key === "Enter" && searchTerm.trim() !== "" && handleSearch()
          }
        />
        {searchTerm.trim() === "" && (
          <div className="cursor-pointer flex items-center justify-center">
            <FaSearch className="text-[#4A1EE3] dark:text-white text-lg" />
          </div>
        )}
        {searchTerm.trim() !== "" && (
          <button
            className="cursor-pointer"
            title="Clear"
            onClick={handleClearSearchInput}
          >
            <IoClose className="text-[#4A1EE3] dark:text-white text-2xl" />
          </button>
        )}
      </div>
      {showTagsContainer && data?.data.length > 0 && (
        <>
          <hr className="w-full border-1 border-[#4A1EE3] dark:border-white" />
          <div className="w-full text-[#4A1EE3] dark:text-white">
            <ul className="flex flex-col gap-2">
              {showTagsContainer &&
                data?.data.map((tag: { id: string; name: string }) => (
                  <li
                    key={tag.id}
                    onClick={() => handleClickAndSearchByTag(tag.name)}
                    className="cursor-pointer hover:underline"
                  >
                    {tag.name}
                  </li>
                ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default SearchInputComponent;
