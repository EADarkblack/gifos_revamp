"use client";

import Image from "next/image";
import { useState } from "react";

//Components
import RecordCameraComponent from "../RecordCameraComponent/RecordCameraComponent";

const CreateGifoSectionComponet = () => {
  const [showAnimation, setShowAnimation] = useState(false);

  return (
    <section className="w-full h-full lg:h-[88.75vh] bg-white dark:bg-[#37383C] flex justify-center bg-[#F3F5F8] pt-30 lg:pt-45 pb-10 lg:pb-20">
      <div>
        {showAnimation && (
          <>
            <Image
              src="/assets/images/element_cinta1.svg"
              alt="reel medium"
              width={150}
              height={150}
              className="hidden lg:block dark:hidden absolute top-[12.25rem] left-[4.25rem] transform scale-[0.45] z-2 animate-spin"
            />
            <Image
              src="/assets/images/element_cinta2.svg"
              alt="reel small"
              width={150}
              height={150}
              className="hidden lg:block dark:hidden absolute top-[12.75rem] left-[0.5rem] transform scale-[0.35] z-2 animate-spin"
            />
            <Image
              src="/assets/images/element_cinta1-modo-noc.svg"
              alt="reel medium"
              width={150}
              height={150}
              className="hidden lg:dark:block absolute top-[12.25rem] left-[4.25rem] transform scale-[0.45] z-2 animate-spin"
            />
            <Image
              src="/assets/images/element_cinta2-modo-noc.svg"
              alt="reel small"
              width={150}
              height={150}
              className="hidden lg:dark:block absolute top-[12.75rem] left-[0.5rem] transform scale-[0.35] z-2 animate-spin"
            />
          </>
        )}
        <Image
          src="/assets/images/camara.svg"
          alt="gifos create"
          width={125}
          height={125}
          className="hidden lg:block dark:hidden absolute top-60 left-15 z-1"
        />

        <Image
          src="/assets/images/camara-modo-noc.svg"
          alt="gifos create"
          width={125}
          height={125}
          className="hidden lg:dark:block absolute top-60 left-15"
        />

        {showAnimation && (
          <Image
            src="/assets/images/element-luz-camara.svg"
            alt="camera light"
            width={150}
            height={150}
            className="hidden lg:block absolute top-[12.5rem] left-[9.5rem] transform scale-[0.5] animate-pulse"
          />
        )}
      </div>
      <RecordCameraComponent setShowAnimation={setShowAnimation} />
      <Image
        src="/assets/images/pelicula.svg"
        alt="gifos create"
        width={150}
        height={150}
        className="hidden lg:block dark:hidden absolute top-130 right-30"
      />
      <Image
        src="/assets/images/pelicula-modo-noc.svg"
        alt="gifos create"
        width={150}
        height={150}
        className="hidden lg:dark:block absolute top-130 right-30"
      />
    </section>
  );
};

export default CreateGifoSectionComponet;
