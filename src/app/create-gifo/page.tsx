//Components
import CreateGifoSectionComponet from "@/components/CreateGifoSectionComponent/CreateGifoSectionComponet";
import FooterComponent from "@/components/FooterComponent/FooterComponent";
import NavbarComponent from "@/components/NavbarComponent/NavbarComponent";

const page = () => {
  return (
    <>
      <NavbarComponent />
      <CreateGifoSectionComponet />
      <FooterComponent />
    </>
  );
};

export default page;
