//Components
import FavoriteSectionComponent from "@/components/FavoriteSectionComponent/FavoriteSectionComponent";
import FooterComponent from "@/components/FooterComponent/FooterComponent";
import FullScreenGifViewComponent from "@/components/FullScreenGifViewComponent/FullScreenGifViewComponent";
import NavbarComponent from "@/components/NavbarComponent/NavbarComponent";
import TrendSectionComponent from "@/components/TrendSectionComponent/TrendSectionComponent";

const page = () => {
  return (
    <>
      <FullScreenGifViewComponent mode="favorites" />
      <NavbarComponent />
      <FavoriteSectionComponent />
      <TrendSectionComponent />
      <FooterComponent />
    </>
  );
};

export default page;
