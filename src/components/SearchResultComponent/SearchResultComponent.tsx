import Image from "next/image";

//Components
import GifsGridComponent from "../GifsGridComponent/GifsGridComponent";

//Styles
import { monserrat } from "@/utils/styles/fonts";

//Types
import { SearchResultComponentProps } from "./SearchResultComponent.types";

const SearchResultComponent = ({
  dataLength,
  title,
}: SearchResultComponentProps) => {
  return (
    <div className="w-full flex flex-col items-center gap-6">
      <hr className="w-[50%] border-t-[0.5px] border-t-[#4A1EE3] dark:border-t-white border-0" />
      <h1
        className={`text-[40px] text-[#4A1EE3] dark:text-white font-bold text-center ${monserrat.className}`}
      >
        {title.charAt(0).toUpperCase() + title.slice(1)}
      </h1>
      {dataLength > 0 ? (
        <GifsGridComponent searchTerm={title} mode="search" />
      ) : (
        <div className="w-full flex flex-col items-center gap-4">
          <Image
            src="/assets/images/icon-busqueda-sin-resultado.svg"
            alt="no content"
            width={175}
            height={175}
          />
          <h2
            className={`text-2xl font-bold text-[#4A1EE3] dark:text-white text-center ${monserrat.className}`}
          >
            Try a different search
          </h2>
        </div>
      )}
    </div>
  );
};

export default SearchResultComponent;
