//Components
import FooterComponent from "@/components/FooterComponent/FooterComponent";
import FullScreenGifViewComponent from "@/components/FullScreenGifViewComponent/FullScreenGifViewComponent";
import MyGifosSectionComponent from "@/components/MyGifosSectionComponent/MyGifosSectionComponent";
import NavbarComponent from "@/components/NavbarComponent/NavbarComponent";
import TrendSectionComponent from "@/components/TrendSectionComponent/TrendSectionComponent";

const page = () => {
  return (
    <>
      <FullScreenGifViewComponent mode="my-gifos" />
      <NavbarComponent />
      <MyGifosSectionComponent />
      <TrendSectionComponent />
      <FooterComponent />
    </>
  );
};

export default page;
