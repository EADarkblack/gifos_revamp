//Components
import FooterComponent from "@/components/FooterComponent/FooterComponent";
import FullScreenGifViewComponent from "@/components/FullScreenGifViewComponent/FullScreenGifViewComponent";
import NavbarComponent from "@/components/NavbarComponent/NavbarComponent";
import SearchSectionComponent from "@/components/SearchSectionComponent/SearchSectionComponent";
import TrendSectionComponent from "@/components/TrendSectionComponent/TrendSectionComponent";

const page = () => {
  return (
    <>
      <FullScreenGifViewComponent mode="search" />
      <NavbarComponent />
      <SearchSectionComponent />
      <TrendSectionComponent />
      <FooterComponent />
    </>
  );
};

export default page;
