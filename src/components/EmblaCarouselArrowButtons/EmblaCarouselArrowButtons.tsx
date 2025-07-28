import React, {
  ComponentPropsWithRef,
  useCallback,
  useEffect,
  useState,
} from "react";
import { EmblaCarouselType } from "embla-carousel";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

type UsePrevNextButtonsType = {
  prevBtnDisabled: boolean;
  nextBtnDisabled: boolean;
  onPrevButtonClick: () => void;
  onNextButtonClick: () => void;
};

export const usePrevNextButtons = (
  emblaApi: EmblaCarouselType | undefined
): UsePrevNextButtonsType => {
  const [prevBtnDisabled, setPrevBtnDisabled] = useState(true);
  const [nextBtnDisabled, setNextBtnDisabled] = useState(true);

  const onPrevButtonClick = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
  }, [emblaApi]);

  const onNextButtonClick = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnDisabled(!emblaApi.canScrollPrev());
    setNextBtnDisabled(!emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect).on("select", onSelect);
  }, [emblaApi, onSelect]);

  return {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  };
};

type PropType = ComponentPropsWithRef<"button">;

export const PrevButton: React.FC<PropType> = (props) => {
  const { children, className = "", ...restProps } = props;

  return (
    <button
      type="button"
      {...restProps}
      className={`px-2 py-2 border-1 border-[#4A1EE3] dark:border-white hover:bg-[#4A1EE3] text-[#4A1EE3] dark:text-white hover:text-white transition ${className}`}
      title="Previous"
    >
      <FaChevronLeft className="text-lg" />
      {children}
    </button>
  );
};

export const NextButton: React.FC<PropType> = (props) => {
  const { children, className = "", ...restProps } = props;

  return (
    <button
      type="button"
      {...restProps}
      className={`px-2 py-2 border-1 border-[#4A1EE3] dark:border-white text-[#4A1EE3] dark:text-white hover:text-white transition ${className}`}
      title="Next"
    >
      <FaChevronRight className="text-lg" />
      {children}
    </button>
  );
};
