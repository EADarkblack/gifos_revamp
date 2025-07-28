"use client";

import { useEffect, useRef, useState } from "react";
import GIF from "gif.js.optimized";
import { useDispatch } from "react-redux";
import Image from "next/image";

//Styles
import { monserrat } from "@/utils/styles/fonts";
import { IoDownloadOutline } from "react-icons/io5";
import { HiOutlineClipboardDocument } from "react-icons/hi2";

//Redux - API
import {
  useGetGifByIdQuery,
  usePostGifMutation,
} from "@/redux/services/giphyApi";

//Redux - Slice
import { deleteGifo } from "@/redux/slices/myGifosSlice";

//Functions
import { generateDownloadGifUrl } from "@/utils/functions/generateDownloadGifUrl";

//Types
import { RecordCameraComponentProps } from "./RecordCameraComponent.types";

const RecordCameraComponent = ({
  setShowAnimation,
}: RecordCameraComponentProps) => {
  const dispatch = useDispatch();

  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<NodeJS.Timer | number | null>(null);

  const [hasCameraAccess, setHasCameraAccess] = useState(false);
  const [stepNumber, setStepNumber] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [gifUrl, setGifUrl] = useState<string | null>(null);
  const [recordTime, setRecordTime] = useState(0);
  const [recording, setRecording] = useState(false);
  const [createdGifId, setCreatedGifId] = useState<string | null>(null);
  const [isGifUploaded, setIsGifUploaded] = useState(false);

  //Queries
  const [mutate, { isLoading }] = usePostGifMutation();
  const { data, isSuccess: isGifSuccess } = useGetGifByIdQuery(createdGifId!, {
    skip: !createdGifId,
  });

  useEffect(() => {
    if (isGifSuccess && data?.data) {
      dispatch(deleteGifo(data.data));
    }
  }, [isGifSuccess, data, dispatch]);

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [stream]);

  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setRecordTime((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current as number);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getRealTimeCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      setHasCameraAccess(true);
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }

      setStepNumber(2);
    } catch (err) {
      setHasCameraAccess(false);

      throw err;
    }
  };

  const handleRequestCameraPermission = async () => {
    setStepNumber(1);

    try {
      await getRealTimeCamera();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRecordVideo = () => {
    setShowAnimation(true);

    if (!stream) return;

    const chunks: Blob[] = [];
    const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });

    setMediaRecorder(recorder);

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunks.push(e.data);
      }
    };

    recorder.onstop = () => {
      stopTimer();

      const blob = new Blob(chunks, { type: "video/webm" });
      const videoURL = URL.createObjectURL(blob);

      const hiddenVideo = document.createElement("video");
      hiddenVideo.src = videoURL;
      hiddenVideo.crossOrigin = "anonymous";
      hiddenVideo.muted = true;
      hiddenVideo.playsInline = true;
      hiddenVideo.style.display = "none";

      document.body.appendChild(hiddenVideo);

      const waitForReady = () =>
        new Promise<void>((resolve) => {
          const tryPlay = () => {
            if (hiddenVideo.readyState >= 3) {
              hiddenVideo.currentTime = 0;
              resolve();
            } else {
              setTimeout(tryPlay, 100);
            }
          };
          tryPlay();
        });

      hiddenVideo.addEventListener("loadedmetadata", async () => {
        await waitForReady();

        try {
          await hiddenVideo.play();

          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          canvas.width = 360;
          canvas.height = 240;

          const gif = new GIF({
            workers: 2,
            quality: 10,
            width: 360,
            height: 240,
            workerScript: "/gif.worker.js",
          });

          let currentFrame = 0;
          const totalFrames = 10;
          const frameDelay = 200;

          const captureFrame = () => {
            if (currentFrame >= totalFrames) {
              gif.on("finished", (gifBlob: Blob) => {
                const gifUrlFromBlob = URL.createObjectURL(gifBlob);

                setGifUrl(gifUrlFromBlob);
                document.body.removeChild(hiddenVideo);
              });

              gif.render();
              return;
            }

            ctx?.drawImage(hiddenVideo, 0, 0, canvas.width, canvas.height);
            gif.addFrame(canvas, { copy: true, delay: frameDelay });
            currentFrame++;

            setTimeout(captureFrame, frameDelay);
          };

          captureFrame();
        } catch (err) {
          throw err;
        }
      });

      hiddenVideo.load();
    };

    recorder.start();
    startTimer();
    setRecording(true);
  };

  const handleStopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      stopTimer();
      setRecording(false);
    }
  };

  const handleRepeatRecording = async () => {
    setShowAnimation(false);
    setGifUrl(null);
    setRecordTime(0);
    setRecording(false);

    try {
      await getRealTimeCamera();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadGifToGiphy = () => {
    if (!gifUrl) return;

    setStepNumber(3);
    setIsGifUploaded(true);

    fetch(gifUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const formData = new FormData();
        formData.append("file", blob, "myGif.gif");

        mutate(formData)
          .unwrap()
          .then((res) => {
            setCreatedGifId(res.data.id);
          });
      })
      .catch((err) => {
        throw err;
      });
  };

  const handleDownloadGif = async () => {
    await generateDownloadGifUrl(
      data?.data?.images.original.url,
      "gifo-" + Date.now()
    );
  };

  const handleCopyUrlToClipboard = () => {
    navigator.clipboard.writeText(data?.data?.images.original.url);
  };

  const handleReset = async () => {
    setShowAnimation(false);
    setGifUrl(null);
    setRecordTime(0);
    setRecording(false);
    setIsGifUploaded(false);
    setStepNumber(1);

    try {
      await getRealTimeCamera();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="w-[90vw] lg:w-[1004px] flex flex-col gap-4 items-center">
        <div className="flex flex-col items-center gap-2">
          <div className="relative w-full lg:w-[688px] h-[390px] border border-[#4A1EE3] dark:border-white mx-auto">
            <div className="absolute top-5 left-5 w-5 h-5 border-t-1 border-l-1 border-teal-300 dark:border-white" />
            <div className="absolute top-5 right-5 w-5 h-5 border-t-1 border-r-1 border-teal-300 dark:border-white" />
            <div className="absolute bottom-5 left-5 w-5 h-5 border-b-1 border-l-1 border-teal-300 dark:border-white" />
            <div className="absolute bottom-5 right-5 w-5 h-5 border-b-1 border-r-1 border-teal-300 dark:border-white" />

            {stepNumber === 1 && !hasCameraAccess && (
              <div
                role="alert"
                className={`flex flex-col items-center justify-center h-full text-center px-4 ${monserrat.className}`}
              >
                <h1 className="text-2xl font-bold text-[#4A1EE3] dark:text-white">
                  Could you give us access to your camera?
                </h1>
                <p className="text-lg text-black dark:text-white mt-2 font-semibold">
                  The access to your camera will be valid
                </p>
                <p className="mt-4 text-lg text-black dark:text-white font-semibold">
                  only for the time you are creating the GIFO.
                </p>
              </div>
            )}

            {!gifUrl && (
              <video
                ref={videoRef}
                muted
                playsInline
                className="w-full h-full object-cover"
                style={{
                  display: hasCameraAccess ? "block" : "none",
                }}
                title="camera preview"
              ></video>
            )}

            {gifUrl && (
              <div className="relative w-full h-full">
                {isGifUploaded && (
                  <div className="absolute top-0 left-0 w-full h-full bg-[#4A1EE3]/80">
                    <div
                      className={`absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center gap-4 ${monserrat.className}`}
                    >
                      <Image
                        src={
                          isLoading
                            ? "/assets/images/loader.svg"
                            : "/assets/images/check.svg"
                        }
                        alt="loader"
                        width={25}
                        height={25}
                        className={isLoading ? "animate-spin" : ""}
                      />
                      <h1 className="font-semibold">
                        {isLoading
                          ? "Your GIFO is uploading"
                          : "GIFO uploaded successfully"}
                      </h1>
                    </div>
                    {isGifSuccess && (
                      <div className="w-full flex justify-end mt-2 pr-2">
                        <ul className="flex gap-2 items-center z-10">
                          <li>
                            <button
                              className="bg-[#C6C6C6] hover:bg-white text-[#4A1EE3] px-2 py-2 cursor-pointer rounded transition duration-300 ease-in-out"
                              title="Download"
                              onClick={handleDownloadGif}
                            >
                              <IoDownloadOutline className="text-base" />
                            </button>
                          </li>
                          <li>
                            <button
                              className="bg-[#C6C6C6] hover:bg-white text-[#4A1EE3] px-2 py-2 cursor-pointer rounded transition duration-300 ease-in-out"
                              title="Copy Link"
                              onClick={handleCopyUrlToClipboard}
                            >
                              <HiOutlineClipboardDocument className="text-base" />
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                <Image
                  src={gifUrl}
                  alt="Generated GIF"
                  width={688}
                  height={390}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {stepNumber === 0 && (
              <div
                className={`flex flex-col items-center justify-center h-full text-center px-4 ${monserrat.className}`}
              >
                <h1 className="text-2xl font-bold text-[#4A1EE3] dark:text-white">
                  Here you can create your own{" "}
                  <span className="text-[#50E3C2]">GIFOS</span>
                </h1>
                <p className="mt-4 text-lg text-black dark:text-white font-semibold">
                  Create your GIFO in only 3 steps!
                </p>
                <p className="text-sm text-black dark:text-white mt-2 font-semibold">
                  (you only need a camera to record a video)
                </p>
              </div>
            )}
          </div>
        </div>
        <div
          className={`w-full flex flex-col gap-6 items-center justify-center ${monserrat.className}`}
        >
          {recording && (
            <span
              className={`${monserrat.className} text-[#4A1EE3] dark:text-white text-lg font-bold`}
            >
              {formatTime(recordTime)}
            </span>
          )}
          {stepNumber === 2 && gifUrl && (
            <button
              className={`${monserrat.className} text-[#4A1EE3] dark:text-white text-lg font-bold hover:underline underline-offset-4 decoration-[#50E3C2] decoration-2 cursor-pointer`}
              title="Repeat recording"
              onClick={handleRepeatRecording}
              aria-label="Repeat recording"
            >
              Repeat recording
            </button>
          )}
          <div className="w-full flex justify-center">
            <ul className="flex gap-4">
              <li
                className={` border-1 border-[#4A1EE3] dark:border-white rounded-full px-[14px] py-1 ${
                  stepNumber === 1
                    ? "bg-[#4A1EE3] dark:bg-white text-white dark:text-[#37383C]"
                    : "text-[#4A1EE3] dark:text-white"
                }`}
              >
                1
              </li>
              <li
                className={` border-1 border-[#4A1EE3] dark:border-white rounded-full px-[14px] py-1 ${
                  stepNumber === 2
                    ? "bg-[#4A1EE3] dark:bg-white text-white dark:text-[#37383C]"
                    : "text-[#4A1EE3] dark:text-white"
                }`}
              >
                2
              </li>
              <li
                className={` border-1 border-[#4A1EE3] dark:border-white rounded-full px-[14px] py-1 ${
                  stepNumber === 3
                    ? "bg-[#4A1EE3] dark:bg-white text-white dark:text-[#37383C]"
                    : "text-[#4A1EE3] dark:text-white"
                }`}
              >
                3
              </li>
            </ul>
          </div>
          <div className="border-3 border-[#4A1EE3] dark:border-white w-full lg:w-[784px] rounded-full"></div>
          <div className="w-full flex justify-center">
            {stepNumber === 0 && (
              <button
                className="bg-white dark:bg-[#37383C] text-[#4A1EE3] dark:text-white border-[#4A1EE3] dark:border-white border-1 px-10 py-2 rounded-full cursor-pointer hover:bg-[#4A1EE3] dark:hover:bg-white hover:text-white dark:hover:text-[#37383C] font-semibold"
                title="Start"
                onClick={handleRequestCameraPermission}
              >
                Start
              </button>
            )}
            {stepNumber === 2 && !recording && recordTime === 0 && (
              <button
                className="bg-white dark:bg-[#37383C] text-[#4A1EE3] dark:text-white border-[#4A1EE3] dark:border-white border-1 px-10 py-2 rounded-full cursor-pointer hover:bg-[#4A1EE3] dark:hover:bg-white hover:text-white dark:hover:text-[#37383C] font-semibold"
                title="Record"
                onClick={handleRecordVideo}
              >
                Record
              </button>
            )}
            {recording && (
              <button
                className="bg-white dark:bg-[#37383C] text-[#4A1EE3] dark:text-white border-[#4A1EE3] dark:border-white border-1 px-10 py-2 rounded-full cursor-pointer hover:bg-[#4A1EE3] dark:hover:bg-white hover:text-white dark:hover:text-[#37383C] font-semibold"
                title="Stop"
                onClick={handleStopRecording}
              >
                Stop
              </button>
            )}
            {!recording && gifUrl && stepNumber === 2 && (
              <button
                className="bg-white dark:bg-[#37383C] text-[#4A1EE3] dark:text-white border-[#4A1EE3] dark:border-white border-1 px-10 py-2 rounded-full cursor-pointer hover:bg-[#4A1EE3] dark:hover:bg-white hover:text-white dark:hover:text-[#37383C] font-semibold"
                title="Upload gifo"
                onClick={handleUploadGifToGiphy}
              >
                Upload GIFO
              </button>
            )}
            {stepNumber === 3 && isGifSuccess && (
              <button
                className="bg-white dark:bg-[#37383C] text-[#4A1EE3] dark:text-white border-[#4A1EE3] dark:border-white border-1 px-10 py-2 rounded-full cursor-pointer hover:bg-[#4A1EE3] dark:hover:bg-white hover:text-white dark:hover:text-[#37383C] font-semibold"
                title="Create Another Gif"
                onClick={handleReset}
              >
                Create Another GIFO
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default RecordCameraComponent;
