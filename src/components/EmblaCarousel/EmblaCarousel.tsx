"use client";

import useEmblaCarousel from "embla-carousel-react";

//Components
import {
  PrevButton,
  NextButton,
  usePrevNextButtons,
} from "../EmblaCarouselArrowButtons/EmblaCarouselArrowButtons";

//Types
import { PropType } from "./EmblaCarousel.types";
import GifCardComponent from "../GifCardComponent/GifCardComponent";
import { useGetTrendGifsQuery } from "@/redux/services/giphyApi";
import { GifData } from "../FullScreenGifViewComponent/FullScreenGifViewComponent.types";

const EmblaCarousel = (props: PropType) => {
  const { options } = props;
  const [emblaRef, emblaApi] = useEmblaCarousel(options);

  const { data } = useGetTrendGifsQuery("");

  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi);

  return (
    <div className="w-full">
      <div className="flex gap-2 items-center justify-center">
        <PrevButton
          onClick={onPrevButtonClick}
          disabled={prevBtnDisabled}
          className="hover:bg-[#4A1EE3] dark:hover:bg-white hover:text-white dark:hover:text-[#222326] text-sm font-medium disabled:opacity-50 cursor-pointer"
        />
        <div className="overflow-hidden w-full md:h-[20rem]" ref={emblaRef}>
          <div className="flex">
            {(data?.data ?? []).map((gif: GifData, index: number) => (
              <div
                className="w-full md:w-1/3 md:h-[20rem] flex-shrink-0 px-1 box-border relative"
                key={index}
              >
                <GifCardComponent mode="search" gifData={gif} />
              </div>
            ))}
          </div>
        </div>
        <NextButton
          onClick={onNextButtonClick}
          disabled={nextBtnDisabled}
          className="hover:bg-[#4A1EE3] dark:hover:bg-white dark:hover:text-[#222326] hover:text-white text-sm font-medium disabled:opacity-50 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default EmblaCarousel;
